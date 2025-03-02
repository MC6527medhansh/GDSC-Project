import React, { useEffect, useState } from 'react'
import './App.css';

import { initializeApp } from "firebase/app"
import { getDownloadURL, getStorage, ref, uploadBytes, } from "firebase/storage"
import { v4 as uuid } from "uuid"

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyCFdZrf1pzCV2H8OxG-bCKDhmQTc5PEEqU",
    authDomain: "gdsc-f2c78.firebaseapp.com",
    projectId: "gdsc-f2c78",
    storageBucket: "gdsc-f2c78.firebasestorage.app",
    messagingSenderId: "914075252164",
    appId: "1:914075252164:web:a982894f926ebe756da091"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

function App() {
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [email, setEmail] = useState<string | undefined>();
    const [sent, setSent] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        async function upload() {
            if (screenshot) {
                const downloadURL = await uploadBase64Image(screenshot, `${uuid()}.png`) 
                const options = {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${process.env.auth_token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      "user_id": process.env.user_id,
                      "saved_item_id": process.env.saved_item_id,
                      "pipeline_inputs": [
                        {"input_name": "input", "value": `${downloadURL}`},
                        {"input_name": "email", "value": `${email}`}
                      ]
                    })
                  };
                  
                  const req = await fetch('https://api.gumloop.com/api/v1/start_pipeline', options)
                  await req.json()
                  if (req.ok) {
                    setSent(true)
                  } else {
                    setError(true)
                  }
            }
        }
        upload()
    }, [screenshot, email])

    function isValidEmail(email: string) {
        if (email === undefined) return false;
        const regex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
      }

    function base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64.split(",")[1]); // Decode base64
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    async function uploadBase64Image(base64String, filePath) {
        const blob = base64ToBlob(base64String, "image/png"); // Change type if needed
        const storageRef = ref(storage, filePath);

        try {
            const snapshot = await uploadBytes(storageRef, blob);
            console.log("Uploaded successfully!", snapshot);

            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log("File available at:", downloadURL);
            return downloadURL;
        } catch (error) {
            console.error("Upload failed:", error);
        }
    }

    function capture() {
        chrome.runtime.sendMessage({ action: "capture_screenshot" }, (response) => {
            if (response?.screenshotUrl) {
                setScreenshot(response.screenshotUrl);
            }
        });
    }

    const inputEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
      };

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 w-80 text-center border border-gray-200">
            <h1 className="text-3xl font-bold text-blue-600">ezCal</h1>
            <p className="my-3 text-gray-600">Upload events to your calendar with a single click!</p>

            {/* Email Input */}
            <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                onChange={inputEmail}
            />

            {/* Capture Button */}
            <button
                className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-transform ease-in-out duration-150 hover:bg-blue-600 disabled:bg-gray-300"
                onClick={capture}
                disabled={!isValidEmail(email)}
            >
                Capture
            </button>
            {sent && <p>Calendar sent to {email}!</p>}
            {error && <p>an error occurred!</p>}
        </div>
    )
}

export default App
