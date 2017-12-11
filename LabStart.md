# Lab:  Setup Locally and Emulate

> On Windows, Mac and Unix, the instructions are pretty much the same

## Prerequisites

Fufill those listed on the wiki on this repo in the Syllabus, [here](https://github.com/michhar/bot-education-ocrbot/wiki/Data-Science-Conference-Syllabus#prerequisites-for-hands-on-labs).

## Setup

### Cognitive Services trial keys

To sign up for the Computer Vision trial, follow these instructions:

1.  Go to https://www.microsoft.com/cognitive-services/en-us/apis
*  Click on "My account" in the upper right-hand corner to log in to Cognitive Services.
*  You will see a 'Hello' welcome page with a listing of trials from which you can request new ones.  Please select "Entity Linking", "Computer Vision" and "Text Analytics".  Read and decide if you agree to Microsoft Cognitive Services Terms and Microsoft Privacy Statement.  After agreeing, click "Subscribe" to sign up for these trials.  

You will then be able to gain access to your keys.

### Setup Environment

1.  Ensure you have the emulator installed (found in the prereqs link above).
3.  Git clone this repository into a suitable folder on your machine
<br> `$ git clone https://github.com/michhar/bot-education-ocrbot.git`

### Visual Studio Code

2.  Copy the github repo to another folder for "local dev"

## Instructions

3.  Open the "local dev" folder in VSCode (Open Folder...).
2.  Modify, in `configuration.js`, `COMPUTER_VISION_SERVICE.API_KEY` to contain your API key from above trial sign-up process.
3.  Start the process in the command terminal with (type into the commmand prompt):
  - `$ node --debug-brk server.js` (Mac, Linux)
  - `$ node server.js` (Windows)
4.  Attach the debuger (Mac tested only right now, if on Windows skip to (5)) by:
  1.  Click on the debug icon in left-hand panel (bug in circle).
  *  At the top left click on the settings "wheel" icon.  A `launch.json` file is automatically created. (Will only need to do this once)
  *  Modify the `console` variable to hold `externalTerminal`.
  *  To the right of the green "run" button click on where it says "Launch" and change this to **"Attach to Process"**.
  *  Now click on the green "run" button and choose your process which you started earlier (if it does not show up confirm you started it and that you've set up the debugger properly).
5.  Start the emulator (make sure this is in your PATH or go to its folder) with:
  - Open the emulator (search for "botframework-emulator" on Windows).  These are the settings
  - `Port:                (automatic)`
  - `Emulator ServiceUrl: http://localhost:<Port>/ (automatic)`
  - `Bot Endpoint:        http://localhost:3978/api/messages`
  - `AppId:               (keep empty)`
  - `AppPassword:         (keep empty)`
*  Click on "Enter your endpoint URL", click on the URL, keep App ID and App Password empty, hit "Connect"
* Test with a link to an image online that contains clear text and wait a second or two for the bot's response.  It should be the text found in the image (run through the OCR model in Cognitive Services).

## Advanced exercises

* Add the ability to upload an attachment from the user (check out [this](https://github.com/Microsoft/BotBuilder-Samples/blob/master/Node/core-ReceiveAttachment/app.js) bot)
* Add sentiment analysis to the text by calling the Text Analytics sentiment rest API (will have to sign up for a trial key like you did with the Vision API key above).

## Very Advance exercise

* Implement an Eliza bot using this js code project as a base:  http://www.masswerk.at/elizabot/

