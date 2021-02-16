from flask import request, render_template, make_response, jsonify
from flask import current_app as app
from configuration import db
from models import Note

POST = 'POST'
GET = 'GET'
PUT = 'PUT'
DELETE = 'DELETE'


@app.route('/api/v1/notes', methods=[GET, POST])
def notes():
    if request.method == POST and request.is_json:
        try:
            data = request.get_json()
            note = Note(title=data['title'], text=data['text'])
            db.session.add(note)
            db.session.commit()
            return success('Note has been saved', note.serialize, 201)
        except:
            return not_found('Note has not been saved')

    elif request.method == GET:
        try:
            notes_list = Note.query.all()
            response = [note.serialize for note in notes_list]
            return success('Notes have been founded', response, 200)
        except:
            return not_found('Nothing found')


@app.route('/api/v1/notes/<int:id>', methods=[GET, POST, PUT, DELETE])
def note_by_id(id):
    try:
        note = Note.query.filter_by(noteId=id).first_or_404()

        if request.method == GET:
            try:
                return success('Note has been founded', note.serialize, 200)
            except:
                return not_found('Note was not found')

        elif request.method == PUT:
            try:
                data = request.get_json()
                note.title = data['title']
                note.text = data['text']
                db.session.add(note)
                db.session.commit()
                return success('Note has been updated', note.serialize, 200)
            except:
                return bad_request('Note has not been updated')

        elif request.method == DELETE:
            try:
                db.session.delete(note)
                db.session.commit()
                return make_response({}, 204)
            except:
                return bad_request('Note has not been deleted')
    except:
        not_found('note was not found')


# Custom Response Handlers
def success(message, data, code):
    return make_response(jsonify({'message': 'Success. ' + message, 'data': data}), code)


def bad_request(message):
    return make_response(jsonify({'message': 'Error. ' + message}), 400)


def not_found(message):
    return make_response(jsonify({'message': 'Error. ' + message}), 404)
