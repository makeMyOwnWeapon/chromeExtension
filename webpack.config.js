module.exports = {
    mode: "development",
    entry: "./scripts/contentScripts/content.js",
    output: {
      filename: "bundle.js",
    },
    devtool: "inline-source-map",
  };
  

  module.exports = {
    mode: "development",
    // 여러 entry 포인트 정의
    entry: {
      contentScript: "./scripts/contentScripts/content.js", 
      serviceWorker: "./scripts/serviceWorkers/serviceWorker.js"
    },
    output: {
      filename: "[name].bundle.js", // output 파일 이름에 entry의 key를 사용
      path: __dirname + "/dist", // 모든 bundle 파일이 저장될 경로
    },
    devtool: "inline-source-map",
  };
  