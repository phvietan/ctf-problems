import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory, request, make_response, render_template
load_dotenv(verbose=True)

pwd = os.environ['PWD']
static_directory = os.path.join(pwd, 'static')
app = Flask(__name__, static_url_path=static_directory)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/flagpassword')
def flagPassword():
    referrer = str(request.headers.get("Referer"))
    l = len('flagflagflagflag')
    if len(referrer) >= l and referrer[-l:] == 'flagflagflagflag':
        return render_template('flagPassword.html')
    else:
        return render_template('flagPasswordNonReferer.html')

@app.route('/flagflagflagflag')
def flagFile():
    if request.authorization and request.authorization.username == 'hcmus_society' and request.authorization.password == 'youhavedonewellyoungone':
        return "<h1>HCMUS-CTF{1t_1zzzz_Crucial_t0_kn0W_Headers_and_R0b0tz}</h1>"
    else:
        return make_response('Could not verify!', 401, {'WWW-Authenticate' : 'Basic realm="Login is required"'})

@app.route('/robots.txt')
def robot():
    return send_from_directory(static_directory, 'robots.txt')

@app.route('/css/<path:path>')
def css(path):
    return send_from_directory(os.path.join(static_directory, 'css'), path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ['PORT'])