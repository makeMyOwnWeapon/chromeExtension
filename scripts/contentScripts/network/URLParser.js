export const URLParser = (() => {
    function parseWithoutTab(url) {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.delete('tab'); 
        return parsedUrl.href;
    }

    return {
        parseWithoutTab: parseWithoutTab
    }
})();