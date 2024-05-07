export const URLParser = (() => {
    function parseWithoutTab(url) {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.delete('tab'); 
        return parsedUrl.href;
    }

    function getParam(url, param) {
        const parsedUrl = new URL(url);
        return parsedUrl.searchParams.get(param);
    }

    return {
        parseWithoutTab: parseWithoutTab,
        getParam: getParam,
    }
})();