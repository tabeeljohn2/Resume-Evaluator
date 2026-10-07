import os
import logging
from flask import Flask
from dotenv import load_dotenv


def create_app():
    load_dotenv()
    logging.basicConfig(level=logging.INFO)

    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ["FLASK_SECRET_KEY"]
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5 MB

    from .routes import bp
    app.register_blueprint(bp)
    return app