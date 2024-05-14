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
  MAX_SIZE = 1000;
  constructor() {
    this.buffer = []
    this.size = 0
  }

  insert(content) {
    if (this.size > SubtitleContentsRequest.MAX_SIZE) {
      return;
    }
    this.buffer.push(content);
  }

  getRangeSubtitleContents(prevReqTime, reqTime) {
    const subtitles = subtitleContext.subtitles;
    for (let i = 0; i < subtitles.length; i++) {
      const subtitle = subtitles[i];
      if (subtitle.includes(prevReqTime, reqTime)) {
        this.insert(subtitle.toString());
        this.size += subtitle.size();
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

function getLectureSubtitleUrl() {
  return document.querySelector('video track').src
}

export function loadSubtitles() {
  return new Promise(resolve => {
    LoaAxios.get(
      getLectureSubtitleUrl(),
      (text) => {
        parseTextToSubtitle(text);
        resolve();
      },
      false
    )
  })
}