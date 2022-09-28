const express = require('express')
const router = express.Router();
const Book = require('../models/books')


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
        await res.render("books/view", {
            title: "item | view",
            books: book,
        });
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
    console.log(newBook)
    try {
        await newBook.save()
        console.log(newBook)
        res.redirect(`/api/books`)
    } catch (e) {
        console.log(newBook)
        console.log(e)
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