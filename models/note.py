from datetime import datetime
from configuration import db


class Note(db.Model):
    __tablename__ = 'notes'

    noteId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=True, nullable=False)
    text = db.Column(db.Text, unique=False, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super(Note, self).__init__(**kwargs)

    def __repr__(self):
        return '<Note %r>' % self.title

    @property
    def serialize(self):
        return {
            'noteId': self.noteId,
            'title': self.title,
            'text': self.text,
            'date': self.date
        }
