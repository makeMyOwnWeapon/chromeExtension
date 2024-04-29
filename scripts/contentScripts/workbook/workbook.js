function updateWorkbookContent(content) {
    const navbarContent = document.getElementById('navbarContent');
    if (navbarContent) {
        navbarContent.innerHTML = content;
    } else {
        console.error('Navbar content element not found');
    }
}

function popupQuiz() {
    // shaka-video-container의 shaka-controls : 컨트롤바 작동여부
    const videoPlayer = document.querySelector('.shaka-video-container');
    console.log('videoPlayer', videoPlayer);
    const quiz = document.createElement('div');
    quiz.classList.add('overlay');
    quiz.innerHTML = `
    <div class="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5" tabindex="-1" role="dialog" id="quiz-modal">
        <div class="modal-dialog" role="document">
            <div class="modal-content rounded-4 shadow">
                <div class="modal-header border-bottom-0">
                    <h1 class="modal-title fs-5">문제 1</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body py-0">
                    <p>가상 메모리는 진짜 가상일뿐이다. 하드웨어와 관련이 없다.</p>
                    <p>가상화 기술에는 가상 메모리밖에 없다.</p>
                    <p>CPU 가상화를 이루기 위해서 시분할 기법을 사용한다.</p>
                </div>
                <div class="modal-footer flex-column align-items-stretch w-100 gap-2 pb-3 border-top-0">
                    <button type="button" class="btn btn-lg btn-primary">제출</button>
                </div>
            </div>
        </div>
    </div>
    `;
    videoPlayer.parentNode.prepend(quiz);
}

function makeWorkbookHTML() {
    return `
    <div style="width: 100%">
        <div class="list-group">
        <button class="list-group-item list-group-item-action margin-4" aria-current="true">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">AI가 생성한 문제</h5>
        </div>
        <p class="mb-1">LOA AI</p>
        </button>
        <button class="list-group-item list-group-item-action margin-4 active" aria-current="true">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">소단원 중심의 문제</h5>
            <small><i class="bi bi-hand-thumbs-up-fill"></i> 15</small>
        </div>
        <p class="mb-1">의도한 짜장면</p>
        </button>
        <button class="list-group-item list-group-item-action margin-4">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">뽀모도로 학습법에 기반한 문제</h5>
            <small><i class="bi bi-hand-thumbs-up-fill"></i> 3</small>
        </div>
        <p class="mb-1">성실한 단무지</p>
        </button>
        </div>
        <div class="d-flex justify-content-center py-3">
            <button class="btn btn-primary d-inline-flex align-items-center center" type="button">
            문제집 만들기
            </button>
        </div>
        <div>
            <div class="position-relative m-4" style="margin-bottom: 30px;">
            <button type="button" class="position-absolute start-10 translate-middle btn btn-sm" style="width: 2rem; height:2rem;"><i class="bi bi-caret-down-fill"></i></button>
            <button type="button" class="position-absolute start-50 translate-middle btn btn-sm" style="width: 2rem; height:2rem;"><i class="bi bi-caret-down-fill"></i></button>
            <button type="button" class="position-absolute start-100 translate-middle btn btn-sm" style="width: 2rem; height:2rem;"><i class="bi bi-caret-down-fill"></i></button>
            </div>
            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width: 100%"></div>
            </div>
        </div>
    </div>
    `;
}

export function displayWorkbookContent() {
    popupQuiz();
    updateWorkbookContent(makeWorkbookHTML());
}