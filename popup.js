document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("extractTextButton").addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: () => document.body.innerText
        }, (results) => {
                if (results && results[0] && results[0].result) {
                    document.getElementById("extractedText").value = results[0].result;
                }
            });
        });
    });
});