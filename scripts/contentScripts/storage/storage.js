export async function getDataFromLocalStorage(key) {
  function getData(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function(result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  }
  try {
    return await getData(key);  
  } catch (error) {
    console.error('Fetching From Chrome Storage ', error);
  }
}

export function setDataLocalStorage(key, value, callback = function () {}) {
  chrome.storage.local.set({[key]: value}, callback)
}