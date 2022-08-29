const express = require('express');
const {v4: uuid} = require('uuid')

class User {
    constructor(id = 1, mail = '') {
        this.id = id
        this.mail = mail
    }
}

const stor_user = {
    users: []
}

class Book {
    constructor(id = uuid(), title = "", description = "", authors = "", favorite = "",
                fileCover = "", fileName = "") {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
    }
}

const stor = {
    books: []
}


const app = express();
app.use(express.json());

app.post('/api/user/login', (req, res) => {
    const {users} = stor_user
    const {id, mail} = req.body
    const newUser = new User(users.length, mail)
    users.push(newUser)
    res.status(201)
    res.json(newUser)
})

app.get('/api/books', (req, res) => {
    const {books} = stor
    res.json(books)
})

app.get('/api/books/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)
    if (idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

app.post('/api/books', (req, res) => {
    const {books} = stor
    const {id, title, description, authors, favorite, fileCover, fileName} = req.body
    const newBook = new Book(id, title, description, authors, favorite, fileCover, fileName)
    books.push(newBook)
    res.status(201)
    res.json(newBook)
})

app.put('/api/books/:id', (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)
    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        }
        res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})
app.delete('/api/books/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)
    if (idx !== -1) {
        books.splice(idx,1)
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

const PORT = process.env.PORT || 3000
app.listen(3000)