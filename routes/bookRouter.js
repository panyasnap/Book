const express = require('express')
const router = express.Router();
const Book = require('../models/books')
const Msg = require('../models/comments')
const path = require("path");


router.get('/', async (req, res) => {
    try {
        const books = await Book.find().select('-__V')
        res.render("books/index", {
            title: "All book",
            books: books,
        });
    } catch (e) {
        res.status(500).json
    }
})


router.get('/view/:id', async (req, res) => {
    const {id} = req.params

    try {
        const book = await Book.findById(id).select('-__V')
        const msg = await Msg.find({id}).select('-__V')
        console.log(msg, 'в бд')
        //res.sendFile(path.resolve(__dirname, 'index.html'));
        await res.render("books/view", {
            title: "item | view",
            books: book,
            msg: msg
        });
    } catch (e) {
        res.status(500).json
    }
})
router.post('/view/:book_id', async (req, res) => {
    const {book_id} = req.params
    const {username, text} = req.body;
    const newMsg = new Msg({username, text, book_id});

    try {
        // const comm = await Book.findById(id).select('-__V')
        await newMsg.save()
        //res.sendFile(path.resolve(__dirname, 'index.html'));
        // await res.render("books/view", {
        //     title: "item | view",
        //     books: book,
        // });
    } catch (e) {
        res.status(500).json
    }
})

router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Book | create",
        books: {},
    });
});

router.post('/create', async (req, res) => {
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    const newBook = new Book({title, description, authors, favorite, fileCover, fileName});
    try {
        await newBook.save()
        res.redirect(`/api/books`)
    } catch (e) {
        res.redirect('/404');
    }
})

router.get('/update/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const book = await Book.findById(id).select('-__V')
        res.render("books/update", {
            title: "Books | update",
            books: book,
        });
    } catch (e) {
        res.redirect('/404');
    }

});
//put
router.post('/update/:id', async (req, res) => {
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params
    try {
        await Book.findByIdAndUpdate(id, {title, description, authors, favorite, fileCover, fileName})
        res.redirect(`/api/books/view/${id}`)
    } catch (e) {
        res.redirect('/404');
    }
})


router.post('/delete/:id', async (req, res) => {
    const {id} = req.params
    try {
        await Book.deleteOne({_id: id})
        res.redirect(`/api/books/`);
    } catch (e) {
        res.redirect('/404');
    }

});

// router.get('/:id/download', (req, res) => {
//     const {books} = stor
//     const {id} = req.params
//     const idx = books.findIndex(e => e.id === id)
//     if (idx !== -1) {
//         let dir = books[idx].fileBook
//         console.log(dir)
//         if (dir) {
//             let img = path.basename(books[idx].fileBook)
//             res.download(`${dir}`, `${img}`, err => {
//                 if (err) {
//                     res.status(404).json();
//                 }
//             });
//
//         } else {
//             res.redirect('/404');
//         }
//     }
// })
module.exports = router