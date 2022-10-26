import time
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/hello')
def welcome():
    return {'welcome': 'welcome!!'}
