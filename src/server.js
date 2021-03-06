const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
require('dotenv').config()

const app = express()
app.use(cors())
const server = require('http').Server(app)
const io = require("socket.io")(server)

io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box);
    })
})

try {
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-duosl.mongodb.net/omnistack?retryWrites=true`, {
        useNewUrlParser: true
    })
} catch(err) {
    console.log(err)
}

app.use((req, res, next) => {
    req.io = io

    return next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')))

app.use(require("./routes"))

server.listen(process.env.PORT || 3333)