document.getElementById("sendToStreamlitButton").addEventListener("click", () => {
  const result = document.getElementById("streamlitResult");
  result.textContent = "Enviando dados para Streamlit...";
  result.style.color = "blue";

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "SEND_ALL_DATA" },
          (response) => {
            if (chrome.runtime.lastError) {
              result.textContent = "Erro: " + chrome.runtime.lastError.message;
              result.style.color = "red";
              return;
            }
            
            if (!response) {
              result.textContent = "Erro: Nenhuma resposta do content script";
              result.style.color = "red";
              return;
            }
            
            if (response.success) {
              result.textContent = response.message;
              result.style.color = "green";
            } else {
              result.textContent = "Erro: " + response.message;
              result.style.color = "red";
            }
          }
        );
      }
    );
  });
});
