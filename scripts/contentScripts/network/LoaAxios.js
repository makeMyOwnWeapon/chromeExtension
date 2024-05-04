export const LoaAxios = (() => {
    function _get(_url, successHandler) {
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
            }, successHandler)
        });
    }

    function _post(_url, _body, successHandler) {
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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(_body)
            }
            chrome.runtime.sendMessage({
                type: 'REST',
                url: _url,
                options: options
            }, successHandler);
        });
    }

    function _patch(_url, _body, successHandler) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const options = {
                method: 'PATCH', // 데이터 전송 방식 지정
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(_body)
            }
            chrome.runtime.sendMessage({
                type: 'REST',
                url: _url,
                options: options
            }, successHandler);
        });
    }

    return {
        get: _get,
        post: _post,
        patch: _patch
    }
})();

export const HOST = {
    local: 'http://localhost:3000',
    prod: ''
}.local;