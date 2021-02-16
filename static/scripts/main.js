document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('tbody')
    let currentRow = null

    const info = (status, message) => {
        const alert = document.querySelector('.alert')
        alert.classList.add(`alert-${status === 'success' ? 'success' : 'danger'}`, 'alert--visible')
        alert.textContent = message
        setTimeout(() =>
                alert.classList.remove('alert--visible', 'alert-success', 'alert-danger'),
            3000)
    }

    const deleteNote = (id) => new Promise((res, rej) => {
        fetch(`http:\/\/127.0.0.1:5000/api/v1/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(async (response) => {
                response.status === 204
                    ? info('success', 'Note has been deleted successfully')
                    : info('error', 'Note has not been deleted')
                return res(response.status === 204)
            })
            .catch((err) => rej(err))
    })

    const updateNote = (id, title, text) => new Promise((res, rej) => {
        fetch(`http:\/\/127.0.0.1:5000/api/v1/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                text
            })
        })
            .then(async (response) => {
                const {message} = await response.json()
                response.status === 200
                    ? info('success', message)
                    : info('error', message)
                return res(response.status === 200)
            })
            .catch((err) => rej(err))
    })

    const updateRow = (el) => {
        const elTitle = el.querySelector('.title')
        const elText = el.querySelector('.text')
        const id = el.querySelector('th').textContent

        fetch(`http:\/\/127.0.0.1:5000/api/v1/notes/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(async (response) => {
                const {data} = await response.json()
                if (response.status === 200) {
                    elTitle.textContent = data.title
                    elText.textContent = data.text
                }
            })
            .catch((err) => info('error', err))
    }

    const addNote = (note) => {
        const row = document.createElement('tr')
        const noteId = document.createElement('th')
        noteId.scope = 'row'
        noteId.textContent = note.noteId

        const title = document.createElement('td')
        title.classList.add('title')
        title.textContent = note.title

        const text = document.createElement('td')
        text.classList.add('text')
        text.textContent = note.text

        const actions = document.createElement('td')

        const delButton = document.createElement('button')
        delButton.classList.add('btn', 'btn-danger', 'del')
        delButton.textContent = 'DELETE'
        delButton.onclick = async (e) => {
            const currentBtn = e.target
            const tr = currentBtn.closest('tr')
            const noteId = tr.querySelector('th').textContent
            await deleteNote(noteId) && tr.remove()
        }
        actions.appendChild(delButton)

        const editButton = document.createElement('button')
        editButton.classList.add('btn', 'btn-light', 'edit')
        editButton.setAttribute('data-bs-toggle', 'modal')
        editButton.setAttribute('data-bs-target', '#editModal')
        editButton.textContent = 'EDIT'

        editButton.onclick = async (e) => {
            const id = document.getElementById('primaryKey')
            const title = document.getElementById('editTitle')
            const text = document.getElementById('editText')
            const currentBtn = e.target
            const tr = currentBtn.closest('tr')
            const noteId = tr.querySelector('th').textContent
            const titleValue = tr.querySelector('.title').textContent
            const textValue = tr.querySelector('.text').textContent

            id.value = noteId
            title.value = titleValue
            text.value = textValue

            currentRow = tr
        }

        actions.appendChild(editButton)

        row.appendChild(noteId)
        row.appendChild(title)
        row.appendChild(text)
        row.appendChild(actions)

        table.appendChild(row)
    }

    const createTable = (notes) => {
        notes.forEach((note) => {
            addNote(note)
        })
    }

    const getNotes = () => {
        fetch('http:\/\/127.0.0.1:5000/api/v1/notes')
            .then((response) => response.json())
            .then(({data}) => createTable(data))

    }

    getNotes()

    const addBtn = document.querySelector('.btn.btn-success.add');

    addBtn.onclick = () => {
        let title = document.getElementById('title').value
        let text = document.getElementById('text').value

        fetch('http:\/\/127.0.0.1:5000/api/v1/notes', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                text
            })
        })
            .then((response) => response.json())
            .then(({data, message}) => {
                if (data) {
                    addNote(data)
                    title = ''
                    text = ''
                    info('success', message)
                } else {
                    info('error', message)
                }
            })
            .catch((err) => info('error', err))
    }

    const updateButton = document.querySelector('.btn.btn-success.update')

    updateButton.onclick = async () => {
        const id = document.getElementById('primaryKey').value
        const title = document.getElementById('editTitle').value
        const text = document.getElementById('editText').value
        await updateNote(id, title, text) && updateRow(currentRow)
    }
})