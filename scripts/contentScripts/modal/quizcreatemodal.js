import { HOST, LoaAxios, REPORT_PROCESSING_HOST } from '../network/LoaAxios.js';
import { SubtitleContentsRequest, loadSubtitles } from '../subtitle/subtitle.js';
import { displayWorkbookContent, loadDefaultElementsForWorkbook, workbookContext } from '../workbook/workbook.js';
import { showQuizCreateLoadingModal } from './reportcreateloadingmodal.js';

let iframeQuizzes = [];
let quizRequestTimes = [];

export async function showCreateModal() {
    const currentURL = window.location.href;

    const courseTitleElement = document.querySelector('.css-1pqj6dl');
    const subCourseTitleElement = document.querySelector('.css-1vtpfoe');
    const playTimeElement = document.querySelector('.shaka-current-time');

    const courseTitle = courseTitleElement ? courseTitleElement.textContent : 'N/A';
    const subCourseTitle = subCourseTitleElement ? subCourseTitleElement.textContent : 'N/A';
    const playTime = playTimeElement ? playTimeElement.textContent : 'N/A';

    const videoContainer = document.createElement('div');
    document.body.appendChild(videoContainer);
    if (!videoContainer) {
        console.error('Video container not found');
        return;
    }
    function setIframeUrl(url) {
    const modal = document.createElement('div');
    modal.classList.add('overlay');
    modal.innerHTML = `
        <div class="draggable-header"></div>
        <iframe id="iframeContent" class="close" src="" style="width:100%; height:100%;"></iframe>
    `;
    videoContainer.appendChild(modal);
    modal.style.width = '50%';
    modal.style.height = '100%';
    modal.style.position = 'absolute';

    const draggableHeader = modal.querySelector('.draggable-header');
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    draggableHeader.style.position = 'absolute';
    draggableHeader.style.width = '100%';
    draggableHeader.style.height = '30px';
    draggableHeader.style.top = '0';
    draggableHeader.style.left = '0';
    draggableHeader.style.cursor = 'move';
    draggableHeader.style.backgroundColor = '#ccc';

    draggableHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - modal.offsetLeft;
        startY = e.clientY - modal.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            modal.style.left = `${e.clientX - startX}px`;
            modal.style.top = `${e.clientY - startY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    
        const iframe = document.getElementById('iframeContent');
        if (iframe) {
            iframe.src = url;
            iframe.onload = function() {
                chrome.storage.local.get('authToken', function(data) {
                    const token = data.authToken;
                    const dataToSend = {
                        courseTitle,
                        subCourseTitle,
                        playTime,
                        currentURL,
                        iframeQuizzes,
                        authToken: token,
                        quizRequestTimes
                    };
                    console.log('post iframe data', dataToSend);
                    iframe.contentWindow?.postMessage(dataToSend, '*');
                });
            };
        }
    }
    await loadDefaultElementsForWorkbook();
    const closeModalHandler = showQuizCreateLoadingModal();
    await AIQuizSetControllerForExtension([closeModalHandler, setIframeUrl]);
    // await setIframeUrl(`${REPORT_PROCESSING_HOST}/createforextension`);
}

window.addEventListener('message', (e) => {

    if (e.data.functionName === 'closeModal') {
        const modal = document.querySelector('.overlay');
        if (modal) {
            alert('문제 생성 완료!!');
            loadDefaultElementsForWorkbook();
            displayWorkbookContent();
            modal.remove();
        }
    }
});

async function AIQuizSetControllerForExtension(callbacks) {
    
    let lastRequestTimeIdx = 0;

    function calculateRequestTimes(durationInSeconds) {
        let quizRequestTimes = [];
        const durationInMinutes = durationInSeconds / 60;

        let numberOfQuizzes;
        if (durationInMinutes < 5) {
            return [];
        } else if (durationInMinutes <= 10) {
            numberOfQuizzes = 1;
        } else if (durationInMinutes <= 60) {
            numberOfQuizzes = 3;
        } else {
            numberOfQuizzes = Math.min(Math.ceil(durationInMinutes / 20), 5);
        }
        const interval = durationInSeconds / (numberOfQuizzes + 1);
        for (let i = 1; i <= numberOfQuizzes; i++) {
            quizRequestTimes.push(Math.round(interval * i));
        }
        return quizRequestTimes;
    }

    async function select() {
        const video = workbookContext.videoElement;
        if (!video) {
            console.error('Video element not found');
            return false;
        }
        quizRequestTimes = calculateRequestTimes(parseInt(video.duration));
        if (quizRequestTimes.length === 0) {
            return false;
        }
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        await loadSubtitles();
        await fetchAllQuiz();
        await delay(10); // 10초 딜레이 주는 함수
        callbacks[0](); // close modal
        callbacks[1](`${REPORT_PROCESSING_HOST}/createforextension`); // send message
        return true;
    }

    function getSubtitleContents(prevReqTime, reqTime) {
        const subtitleRequest = new SubtitleContentsRequest();
        return subtitleRequest.getRangeSubtitleContents(prevReqTime, reqTime);
    }

    function hasAllProperties(response) {
        return (
            response.instruction &&
            response.commentary &&
            response.choices.length > 0 &&
            response.popupTime > 0
        );
    }

    async function fetchAllQuiz() {
        for (let i = 0; i < quizRequestTimes.length; i++) {
            await fetchQuiz(i);
        }
        return true
    }

    async function fetchQuiz(i) {
        return new Promise((resolve, reject) => {
            const reqTime = quizRequestTimes[i];
            const prevReqTime = lastRequestTimeIdx === i ? 0 : quizRequestTimes[lastRequestTimeIdx];
            lastRequestTimeIdx = i;

            // 콜백을 사용하여 비동기 처리
            LoaAxios.post(
                `${HOST}/api/quizsets/llm/nosave`,
                {
                    subLectureId: workbookContext.subLectureId,
                    script: getSubtitleContents(prevReqTime, reqTime),
                    popupTime: reqTime,
                },
                (response) => {
                    if (hasAllProperties(response)) {
                        iframeQuizzes.push(response);
                        resolve();
                    } else {
                        reject('invalid response');
                    }
                }
            );
        }).catch(error => {
            console.error('Error fetching quiz:', error);
            throw error;
        });
        
    }

    return select();
}
