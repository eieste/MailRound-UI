from flask import Flask, make_response, send_file
from flask_cors import CORS
import io
from flask_caching import Cache


app = Flask(__name__)
cache = Cache(app,config={'CACHE_TYPE': 'simple'})
cache.init_app(app)

CORS(app)

@app.route("/")
def hello():
    return "Hello World!"


@cache.cached(timeout=50)
@app.route("/api/blob/get")
def api_blob_get():

    with open("./data.mrmp", "rb") as fobj:
        bin_data = io.BytesIO(fobj.read())

    return send_file(
        bin_data,
        attachment_filename='data.mrmp',
        mimetype='application/x-msgpack'
    )



