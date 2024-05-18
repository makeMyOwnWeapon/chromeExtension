export const LoaAxios = (() => {
    function _get(_url, successHandler, json = true) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
            chrome.runtime.sendMessage({
                type: json ? 'REST' : 'TEXT',
                url: _url,
                options: options
            }, successHandler)
        });
    }

    function _post(_url, _body, successHandler, json = true) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(_body)
            }
            chrome.runtime.sendMessage({
                type: json ? 'REST' : 'TEXT',
                url: _url,
                options: options
            }, successHandler);
        });
    }

    function _postFile(_url, base64Data, successHandler) {
        chrome.runtime.sendMessage({
            type: 'REST_FILE',
            url: _url,
            base64Data: base64Data
        }, successHandler);
    }

    function _patch(_url, _body, successHandler) {
        chrome.storage.local.get('authToken', function(data) {
            if (!data.authToken) {
                console.error("Doesn't have authToken");
                return;
            }
            const token = data.authToken;
            const options = {
                method: 'PATCH',
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
        patch: _patch,
        postFile: _postFile,
    }
})();

export const HOST = {
    local: 'http://localhost:3000',
    prod: 'https://api.learn-on-air.site'
}.prod;

export const IMAGE_PROCESSING_HOST = {
    local: 'http://localhost:8000',
    prod: 'https://api.learn-on-air.site:8000'
}.prod;

export const REPORT_PROCESSING_HOST = {
    local: 'http://localhost:3002',
    prod: 'https://www.learn-on-air.site'
}.prod;
