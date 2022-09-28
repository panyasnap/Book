const express = require('express');
const path = require('path')
const err404 = require('./middleware/err-404')
const userRouter = require('./routes/userRouter')
const bookRouter = require('./routes/bookRouter')
const mainRouter = require('./routes/index')
const mongoose = require("mongoose");


const app = express();

//app.use(express.urlencoded());
//app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', mainRouter)
app.use('/api/user', userRouter)
app.use('/api/books', bookRouter)
const UrlDB = process.env.UrlDB
//app.use('/public', express.static(__dirname+"/public"))
app.use(err404)
async function  start(PORT, UrlDB) {
    try {
        await mongoose.connect('mongodb://root:example@mongo:27017/');
        app.listen(PORT, () => console.log(`listening on port ${PORT}`));
    } catch (e) {
        console.log(e)
    }
}
const PORT = process.env.PORT || 3000
start(PORT, UrlDB);
// app.listen(PORT)