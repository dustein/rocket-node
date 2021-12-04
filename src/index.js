const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
app.use(express.json())

const customers = []

app.get("/account", (req, res) => {
    res.json({status: "ok"})
})

app.post("/account", (req, res) => {
    const { cpf, name } = req.body
    const id = uuidv4()

    customers.push({
        id,
        cpf,
        name,
        statement: []
    })
    res.status(201).json(customers)
})

app.put("account/:id", (req, res) => {
    res.json(ok)
})
    
app.patch("account/:id", (req, res) => {
    res.json(ok)
})

app.delete("account/:id", (req, res) => {
    res.json(Ok)
})


app.listen(3333)
