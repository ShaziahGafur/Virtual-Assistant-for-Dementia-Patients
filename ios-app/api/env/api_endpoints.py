import time
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'welcome': time.time()}

@app.route('/hello')
def welcome():
    return {'welcome': 'welcome!!'}

if __name__ == '__main__':
    app.run(port=5001)