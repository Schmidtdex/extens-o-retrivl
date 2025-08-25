document.getElementById("extractTextButton").addEventListener("click", () => {
  const result = document.getElementById("extractedText");
  result.textContent = "Extraindo texto...";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "GET_ARTICLE_TEXT" },
          (response) => {
            if (chrome.runtime.lastError) {
              result.textContent = "Erro: " + chrome.runtime.lastError.message;
              return;
            }
            if (!response) {
              result.textContent = "Content script não presente na página";
              return;
            }
            result.textContent = response.text
              ? response.text.slice(0, 500) + "..."
              : "Nenhum texto encontrado";
          }
        );
      }
    );
  });
});

document.getElementById("extractMetaButton").addEventListener("click", () => {
  const result = document.getElementById("extractedMeta");
  result.textContent = "Extraindo metadados...";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "GET_META_DATA" },
          (response) => {
            if (chrome.runtime.lastError) {
              result.textContent = "Erro: " + chrome.runtime.lastError.message;
              return;
            }
            result.textContent =
              response && response.metaData
                ? JSON.stringify(response.metaData, null, 2)
                : "Nenhum metadado encontrado.";
          }
        );
      }
    );
  });
});