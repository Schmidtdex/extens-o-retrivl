function getText() {
    const article = document.querySelector("article");
    if (article) return article.innerText;

    const paragraphs = Array.from(document.querySelectorAll("p"));
    return paragraphs.map((p) => p.innerText).join("\n");
}

function getMetaData() {
    const metaTags = document.getElementsByTagName("meta");
    const metaData = {};
    for (let tag of metaTags) {
        if (tag.name) metaData[tag.name] = tag.content;
        if (tag.property) metaData[tag.property] = tag.content;
    }
    metaData.title = document.title;
    return metaData;
}

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if ((req.type === "GET_ARTICLE_TEXT")) {
        const text = getText();
        sendResponse({ text });
    }
    if ((req.type === "GET_META_DATA")) {
        const metaData = getMetaData();
        sendResponse({ metaData });
    }
});
