const express = require('express');

const err404 = require('../book/middleware/err-404')
const userRouter = require('../book/routes/userRouter')
const bookRouter = require('../book/routes/bookRouter')
const mainRouter = require('../book/routes/index')


const app = express();

app.use(express.urlencoded());

app.set("view engine", "ejs");


app.use('/', mainRouter)
app.use('/api/user', userRouter)
app.use('/api/books', bookRouter)
//app.use('/public', express.static(__dirname+"/public"))
//app.use(err404)


const PORT = process.env.PORT || 3000
app.listen(PORT)