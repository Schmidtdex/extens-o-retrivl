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

function getCurrentUrl() {
    return window.location.href;
}

async function sendDataToStreamlit(data) {
    try {
        const response = await fetch("http://localhost:8502/api/receive-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            return { success: true, message: result.message || "Dados enviados com sucesso!" };
        } else {
            return { success: false, message: "Erro ao enviar dados." };
        }
    } catch (error) {
        console.error("Error sending data to Streamlit:", error);
        return { success: false, message: "Erro ao enviar dados: " + error.message };
    }
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
    if (req.type === "GET_CURRENT_URL") {
        const url = getCurrentUrl();
        sendResponse({ url });
    }
    if (req.type === "SEND_ALL_DATA") {
        const text = getText();
        const metaData = getMetaData();
        const url = getCurrentUrl();
        
        const allData = {
            text: text,
            metaData: metaData,
            url: url,
            timestamp: new Date().toISOString()
        };

        sendDataToStreamlit(allData).then(result => {
            sendResponse(result);
        }).catch(error => {
            sendResponse({ success: false, message: "Erro ao enviar dados: " + error.message });
        });
        return true;
    }
});
