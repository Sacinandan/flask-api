from flask import Flask
from configuration import db
import os


def create_app():
    app = Flask(__name__, instance_relative_config=False)
    db.init_app(app)

    if os.environ['FLASK_ENV'] == 'development':
        app.config.from_object('configuration.config.DevelopmentConfig')
    elif os.environ['FLASK_ENV'] == 'testing':
        app.config.from_object('configuration.config.TestingConfig')
    else:
        app.config.from_object('configuration.config.ProductionConfig')

    with app.app_context():
        from routes import index, notes
        db.create_all()
        return app
