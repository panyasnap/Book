const express = require('express');
const path = require('path')
const err404 = require('../book/middleware/err-404')
const userRouter = require('../book/routes/userRouter')
const bookRouter = require('../book/routes/bookRouter')
const mainRouter = require('../book/routes/index')


const app = express();

app.use(express.urlencoded());

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs");


app.use('/', mainRouter)
app.use('/api/user', userRouter)
app.use('/api/books', bookRouter)
//app.use('/public', express.static(__dirname+"/public"))
//app.use(err404)


const PORT = process.env.PORT || 3000
app.listen(PORT)