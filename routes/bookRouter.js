const express = require('express')
const router = express.Router();
const fileMulter = require('../middleware/file')
const {v4: uuid} = require("uuid");
const path = require("path");

let errm = {
    errcode: 404,
    errmsg: 'страница не найдена'
}

class Book {
    constructor(id = uuid(), title = "", description = "", authors = "", favorite = "",
                fileCover = "", fileName = "", fileBook = "") {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const stor = {
    books: []
}

router.get('/', (req, res) => {
    const {books} = stor
    res.json(books)
})

router.get('/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)
    if (idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404)
        res.json(errm)
    }
})

router.post('/', fileMulter.single('fileBook'), (req, res) => {
    const {books} = stor
    let {id, title, description, authors, favorite, fileCover, fileName} = req.body
    let fileBook = req.file.path
    const newBook = new Book(id, title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(newBook)
    res.status(201)
    res.json(newBook)
})

router.put('/:id', (req, res) => {
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
        res.json(errm)
    }
})
router.delete('/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)
    if (idx !== -1) {
        books.splice(idx, 1)
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})
router.get('/:id/download', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)
    if (idx !== -1) {
        let dir = books[idx].fileBook
        let img = path.basename(books[idx].fileBook)
        res.download(`${dir}`, `${img}`, err => {
            if (err) {
                res.status(404).json();
            }
            console.log('Your file has been downloaded!')
        });

    } else {

        res.status(404)
        res.json(errm)
    }
})
module.exports = router