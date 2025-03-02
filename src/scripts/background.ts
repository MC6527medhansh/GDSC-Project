chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "capture_screenshot") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            sendResponse({ screenshotUrl: dataUrl });
        });
        return true; // Required to use `sendResponse` asynchronously
    }
});