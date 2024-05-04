export const LoaAxios = (() => {
    function _get(_url, callback) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const options = {
                method: 'GET', // 데이터 전송 방식 지정
                headers: {
                    'Authorization': `Bearer ${token}`, // 컨텐츠 타입 지정
                }
            }
            chrome.runtime.sendMessage({
                type: 'REST',
                url: _url,
                options: options
            }, callback);
        });
    }

    function _post(_url, _body, callback) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const options = {
                method: 'POST', // 데이터 전송 방식 지정
                headers: {
                    'Authorization': `Bearer ${token}`, // 컨텐츠 타입 지정
                },
                body: _body
            }
            chrome.runtime.sendMessage({
                type: 'REST',
                url: _url,
                options: options
            }, callback);
        });
    }

    return {
        get: _get,
        post: _post
    }
})();