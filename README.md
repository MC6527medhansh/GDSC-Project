# ezCal

ezCal is a Chrome extension designed to help students easily capture event details (such as assignment deadlines and TA office hours) from screenshots and sync them with their calendars. By leveraging AI-driven workflows, ezCal extracts event information from images, converts it into a downloadable .ics calendar file, and sends you an email with a download link for manual calendar integration.

## What It Does

- **Capture Events:**  
  Capture screenshots directly from your browser using the extension.

- **AI-Driven Processing:**  
  The captured image is sent to a Gumloop workflow where AI (via Gemini) performs OCR to extract event details and outputs structured JSON data.

- **Calendar Integration:**  
  The extracted JSON is converted into an .ics file. An email with a download link for the .ics file is sent to you, enabling you to import events into your Google Calendar.

## How to Use

1. **Install the Extension:**  
   - Load the unpacked extension into Chrome through the `chrome://extensions/` page.

2. **Capture a Screenshot:**  
   - Click the "Capture" button in the extension popup.
   - Enter your email address when prompted.

3. **Process and Sync:**  
   - The extension uploads the screenshot to Firebase.
   - It triggers the Gumloop workflow to process the image.
   - Once processing is complete, you'll receive an email with a link to download the generated .ics file.
   - Import the .ics file into your Google Calendar to add the events.

## Technical Overview

- **Chrome Extension:**  
  Built with React, TypeScript, and Vite using Manifest V3. The extension captures screenshots and collects your email for processing.

- **Gumloop AI Workflow:**  
  The screenshot is analyzed using Gemini for OCR and event extraction, which outputs structured JSON data.

- **Calendar & Email Integration:**  
  A Python backend converts the JSON data into an .ics file and sends an email with a download link so you can import the events into your calendar.

## Impact & Future Plans

- **Automation:**  
  Automates the tedious process of manually entering event data from various platforms, reducing errors and saving time.

- **Enhanced Productivity:**  
  Centralizes important academic deadlines and office hours, making it easier to manage your schedule.

- **What's Next:**  
  Future improvements include exploring alternative integrations to support recurring events, enhance processing speed, and resolve current deployment challenges with Gumloop.

---

For additional details and updates, please refer to the project documentation or contact the development team.
