from flask import Flask, make_response, send_file, render_template, send_from_directory
from flask_cors import CORS
import io
from flask_caching import Cache
from werkzeug.routing import BaseConverter
import os


class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]


application = Flask(__name__, static_url_path='')
cache = Cache(application,config={'CACHE_TYPE': 'simple'})
cache.init_app(application)

CORS(application)

@cache.cached(timeout=50)
@application.route("/api/blob/get")
def api_blob_get():

    with open(os.environ.get("MRMP_FILE", "./data.mrmp"), "rb") as fobj:
        bin_data = io.BytesIO(fobj.read())

    return send_file(
        bin_data,
        attachment_filename='data.mrmp',
        mimetype='application/x-msgpack'
    )

application.url_map.converters['regex'] = RegexConverter

@application.route(r'/<regex(".*"):path>')
def static_file(path):
    print(path)
    return send_file(path)

@application.route(r'/')
def root():
    print("a")
    return send_file('index.html')

if __name__ is "__main__":
    application.run()