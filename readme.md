## Flask API (Flask-SQLAlchemy)

### Setup
```
pip install flask flask-sqlalchemy psycopg2 python-dotenv jinja2
```

### DB Initialization
```
flask db init
```
```
flask db migrate
```
```
flask db upgrade
```

### Run
```
export FLASK_APP=app.py
```
```
flask run
```