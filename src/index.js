const express = require('express')
const app = express()
app.listen(3333)

app.get("/",
    (req, res) => {
        res.send("oi funciona")
    })