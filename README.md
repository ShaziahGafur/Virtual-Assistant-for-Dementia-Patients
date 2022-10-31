# Virtual-Assistant-for-Dementia

## How to run the iOS Application
For extra links, refer to this document: [Documentation](https://docs.google.com/document/d/1drUgM7sAjvyY1wdhVYIKTmXiFKVz9cIe8cFuc7jUkfY/edit?usp=sharing)


Front-End is in React-Native

Back-End is in Flask

---

### Setup
#### 1) For React-Native: 
[Set Up Environment for React Native](https://reactnative.dev/docs/environment-setup)

Download Expo Go on your device

In the ios-app directory, do `npm install`

#### 2) For Flask:
Install Python 3

Set up a virtual environment (or use mine):

Set up a virtual environment by following [virtualenv documentation](https://docs.python.org/3/library/venv.html). You will need to pip install everything again. I'll make a requirements.txt soon. 

To enter the virtual environment: (on Windows) `env\Scripts\activate` inside the api directory. You should see "(env)" in front of all your terminal cmds.

To deactivate the virtual environment: `deactivate`. The "(env)" should disappear.

#### 3) Install ngrok: 
`choco install ngrok` or [Download ngrok](https://ngrok.com/download)

Ngrok is for port-forwarding. Essentially when you're on the Expo Go app, the localhost on your iPad and the localhost on your computer will be different. Usually you can find the IP Address of your computer by doing `ipconfig` on Windows, and use that IP address instead but I found that didn't work on UofT wifi / my computer for some reason. Ngrok basically exposes a port on your computer to the Internet and converts it to like a web address. You can then use that web address to communicate from the front-end to back-end. 

You don't really need to use Ngrok if you're running the front-end and back-end on the same machine. Eg. after running the front-end server, open the web version vs using the Expo App on your iPad.

Ngrok only runs for 2 hours in the free version, so you'll need to re-run the cmd, and change value of "NGROK_API" to the new web address they give you every 2 hours.

#### 4) Create a Google Cloud Service Account

On the Google Cloud account *and* in the Capstone Google Cloud Project, make a Google Cloud Service account. Follow these [instructions from Google](https://developers.google.com/workspace/guides/create-credentials#service-account). Make sure you save the .json of your key somewhere, and that you give yourself owner permission. 

#### 5) Authenticate your Google Cloud Service Account Credentials when calling Google Client APIs

Basically, when you're calling Google Client APIs, you need to authenticate / declare your credentials to Google, or else Google will just refuse your request. (I also need to change this so it's easier because right now, it's spaghetti code) But in app.py, replace r'C:\Users\ellen\Downloads\indigo-replica-365820-a02e63c8d4a5.json' when the path to your own .json key file. Your "os.environ['GOOGLE_APPLICATION_CREDENTIALS']" should now have the path to your .json file of the key.


---
### Running 

Hopefully everything is now set up. 

#### 1) Run Ngrok

In a terminal, run `ngrok http 5000`. This is because 5000 is the port that the backend will run from. Copy the ".io" address that the response gives you, and then paste that into the constant "NGROK_API" on the Front-End.

#### 2) Run the Backend

Start another terminal, and leave the Ngrok one open. cd into the Virtual-Assistant ..../ios-app/api folder. (This might be \ instead sorry I'll double check this)

Start the virtual environment: `env\Scripts\activate`

Start the back-end app by: `flask --app main.py --debug run`. This should dynamically refresh when you Ctrl-S on the app.py file so you don't need to stop and restart every time. Check that this is working by typing `localhost:5000/time` in your browser. You shouldn't get a 404 page.

#### 3) Run the Front End

Start another terminal and go into the Virtual-Assistant .... etc folder, and run `cd ios-app`.

Now, run `npm start`. You should see something nice and pretty pop up with a QR code. On your Camera app, use the QR code to open the Expo Go application, and you should see the app running. 

---
### Note about communicating:

For some ????? reason, React-Native's "fetch" doesn't work when doing POST requests with a body. You'll get the request but it'll have nothing in the body. I haven't tested if this is the same for GET or DELETE requests. Use "axios" instead. I have an example already set up in the RecordAudio.js file. 
