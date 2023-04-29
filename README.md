# Virtual-Assistant-for-Dementia

## Demos of our Application
Demonstration of our Video Call Functionality: https://drive.google.com/file/d/1BUVfxPlsUkjYGHuKzA6W-qGKIGHU5Qe2/preview

## How to run the iOS Application
Clone the branch 'main'. Please refer to all of the documentation in the folder 'docs', which has documentation on creating a Google Cloud Project, the database, the Image Animation automation and the voice cloning automation.

This project uses React Native, Flask, Google Cloud for APIs, and SQLite for the database. 

---

### Setup
#### 1) For React-Native: 
[Set Up Environment for React Native](https://reactnative.dev/docs/environment-setup)

Download Expo Go on your device (this must be an iOS device - either an iPad, or an iPhone). Expo also can use the iOS Simulator if you are running the project on a Mac. 

In the ios-app directory, do `npm install`

#### 2) For Flask:
Install Python 3

Set up a virtual environment:

Set up a virtual environment by following [virtualenv documentation](https://docs.python.org/3/library/venv.html). You will need to pip install everything again, you can do this by `pip install -r requirements.txt`.

To enter the virtual environment: (on Windows) `env\Scripts\activate` inside the api directory. On Mac, `source env/bin/activate`. You should see "(env)" in front of all your terminal cmds.

To deactivate the virtual environment: `deactivate`. The "(env)" should disappear.

#### 3) Create a Google Cloud Service Account

To create a Google Cloud Project, you must follow the steps in the documentation, located at "docs/Google Cloud Project Documentation.pdf". If one is already created (either by yourself or a member of your team), you can simply create a service account (also demonstrated in the documentation). 

#### 4) Authenticate your Google Cloud Service Account Credentials when calling Google Client APIs

When you're calling Google Client APIs, you need to authenticate / declare your credentials to Google, or else Google will just refuse your request.

In ios-api/api/config.py, change GOOGLE_APPLICATION_CREDENTIALS to be the path of your Google Service .json key.

<img width="1094" alt="Screenshot 2023-04-28 at 7 53 33 PM" src="https://user-images.githubusercontent.com/44852580/235271150-d3a94efe-281f-40ef-8c56-3cf350f8b55d.png">

---
### Running the Application

#### 1) Run the Backend

Start a terminal, and cd into the Virtual-Assistant-for-Dementia-Patients/ios-app/api folder. 

Start the virtual environment: `env\Scripts\activate` for Windows. On Mac, 'source env/bin/activate'.

Start the back-end app by: `flask run --host=0.0.0.0`. This should dynamically refresh when you Ctrl-S on the app.py file so you don't need to stop and restart every time. Check that this is working by typing `localhost:5000/time` in your browser. You shouldn't get a 404 page.

You should see two IP addresses pop up:

<img width="575" alt="Screenshot 2023-04-28 at 7 57 17 PM" src="https://user-images.githubusercontent.com/44852580/235271361-c42ab393-d7bd-47ad-bda7-da4563193250.png">

In the .env file (inside ios-app directory), change REACT_APP_BACKEND_API to be the value of the second IP address (the one that's not 127.0.0.1).

<img width="742" alt="Screenshot 2023-04-28 at 7 58 53 PM" src="https://user-images.githubusercontent.com/44852580/235271436-e176dde1-a9f0-4d49-8ad9-6e4446521da2.png">

#### 2) Run the Front End

Start another terminal, and cd into the Virtual-Assistant-for-Dementia-Patients/ios-app folder. You should have 2 terminals at this point.

Now, run `npm start`. You should see a QR code pop-up. On your Camera app on the device that has Expo Go installed (iPhone or iPad), use the QR code to open the Expo Go application, and you should see the app running. However, if you are running the project on a MacOS, you can also use the built-in iOS Simulator provided by XCode (press "i" in the terminal). Expo may take some time to render, you can press "r" to refresh if you want. 

<img width="707" alt="Screenshot 2023-04-28 at 8 01 12 PM" src="https://user-images.githubusercontent.com/44852580/235271541-f541e128-5f61-4152-ba90-332e4fc7e230.png">

