import { LoaAxios } from "../network/LoaAxios";

const subtitleContext = {
  subtitles: []
}

class Subtitle {
  constructor(start, end, content) {
    this.start = start;
    this.end = end;
    this.content = content;
  }

  includes(start, end) {
    return start <= this.start && this.end <= end;
  }

  static compare(a, b) {
    return a.start - b.start;
  }

  toString() {
    return this.content;
  }

  size() {
    return this.content.length;
  }
}

export class SubtitleContentsRequest {
  static MAX_SIZE = 1000;
  
  constructor() {
    this.buffer = []
    this.size = 0
  }

  insert(content) {
    if (this.size > SubtitleContentsRequest.MAX_SIZE) {
      return;
    }
    this.buffer.push(content);
    this.size += content.length;
  }

  getRangeSubtitleContents(prevReqTime, reqTime) {
    const subtitles = subtitleContext.subtitles;
    for (let i = 0; i < subtitles.length; i++) {
      const subtitle = subtitles[i];
      if (subtitle.includes(prevReqTime, reqTime)) {
        this.insert(subtitle.toString());
      }
    }
    return this.toString();
  }

  toString() {
    return this.buffer.join(' ');
  }
}

function timeStringToSeconds(timeStr) {
  const parts = timeStr.split(':');
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

function initializeSubtitles() {
  subtitleContext.subtitles = [];
}

function parseTextToSubtitle(text) {
  initializeSubtitles();
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const timeLine = lines[i].match(/\d+:\d+:\d+\.\d+ --> \d+:\d+:\d+\.\d+/);

    if (timeLine) {
      const start = timeStringToSeconds(timeLine[0].split(' --> ')[0]);
      const end = timeStringToSeconds(timeLine[0].split(' --> ')[1]);
      const content = lines[++i];
      subtitleContext.subtitles.push(new Subtitle(start, end, content));
    }
  }
}

function parseJsonToSubtitle(jsonResponse) {
  initializeSubtitles();
  for (let i = 0; i < jsonResponse.length; i++) {
    const { start, end, content } = {
      start: jsonResponse[i].start / 1000,
      end: jsonResponse[i].start / 1000,
      content: jsonResponse[i].text,
    }
    subtitleContext.subtitles.push(new Subtitle(start, end, content));
  }
}

function getLectureSubtitleUrl() {
  return document.querySelector('video track').src
}

function makeSubtitleRequest() {
  // 모든 'css-zl1inp' 클래스를 가진 'li' 요소를 찾습니다.
  const listItems = document.querySelectorAll('li.css-zl1inp');
  // 다섯 번째 'li' 요소가 존재하는지 확인합니다.
  if (listItems.length >= 5) {
      const fifthListItem = listItems[4];
      // 다섯 번째 'li' 요소 내부에서 버튼을 찾습니다.
      const button = fifthListItem.querySelector('.mantine-UnstyledButton-root.mantine-Button-root.mantine-syxma7');
      // 버튼이 존재하면 클릭 이벤트를 트리거합니다.
      if (button) {
        button.click();
        setTimeout(function() { button.click() }, 100);
      } else {
        console.error('해당 요소에 버튼이 없습니다');
      }
  } 
}

export function loadSubtitles() {
  if (subtitleContext.subtitles.length > 0) {
    return;
  }
  return new Promise(resolve => {
    chrome.runtime.onMessage.addListener(function fetchSubtitles(message, sender, sendResponse) {
      if (message.jsonResponse) {
        parseJsonToSubtitle(message.jsonResponse);
        chrome.runtime.onMessage.removeListener(fetchSubtitles);
        resolve();
      }
    });
    makeSubtitleRequest();
  })
}