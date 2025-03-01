import React, { useState } from 'react'
import './App.css';

function App() {
  const [screenshot, setScreenshot] = useState<string | null>(null);

  function capture() {
    chrome.runtime.sendMessage({ action: "capture_screenshot" }, (response) => {
      if (response?.screenshotUrl) {
        setScreenshot(response.screenshotUrl);
      }
    });
  } 

  return (
    <div className={""}>
        <h1 className="text-2xl font-bold">ezCal</h1>
        <button onClick={capture}>capture</button>
    </div>
  )
}

export default App
