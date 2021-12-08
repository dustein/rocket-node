const express = require('express')
const app = express()
app.listen(1976)
//biblioteca para gerar ID. "v4" é gerar id aleatório
// const { v4 } = require('uuid')
const { v4 : uuidv4 } = require('uuid')

app.use(express.json())

//enquanto nao usams banco de dados, vamos guardar os dados num array
const customers = []

///inicio middlewares========================================================

function midCpfAccount(req, res, next) {
  const { cpf } = req.headers
    
  const customer = customers.find((pessoa) => pessoa.cpf === cpf)

  if(!customer) {
      return res.status(400).json({erro: "CPF não cadastrado"})
  }
  //para retornar o req sempre que o middleware for invocado
  req.customer = customer

  return next()
}

//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function getBalance(statement) {
  const balance = statement.reduce((acumulador, operation) => {
    if(operation.type === 'credit') {
      return acumulador += operation.amount
    } else {
      //se a operation.type for === "debito"
      return acumulador -= operation.amount
    }
    ///valor inicial do acumulador do reduce estabelecido em 0
  }, 0)
  return balance
  
}

//fim midlewares=======================================================


app.get("/",
  (req, res) => {
    res.json({status: "inicio"})
  })

app.post("/account",
  (req, res) => {
    const { cpf, name } = req.body
  
    //verificar se o CPF já existe no cadastro
    const pessoaAlreadyExists = customers.some((pessoa) => pessoa.cpf === cpf)
    
    if (pessoaAlreadyExists) {
      return res.status(400).json({error: "CPF já cadastrado"})
    }

    customers.push({
      cpf,
      name,
      id: uuidv4(),
      statement: []
    })


    return res.status(201).json(customers)
  })

  app.get("/statement", midCpfAccount, (req, res) => {
    //para puxar o "customer" do middleware
    const { customer } = req
    
    return res.json({cliente: customer.statement})

  })


  app.post("/deposit", midCpfAccount, (req, res) =>{
  const { description, amount} = req.body
  const { customer } = req
  const operation = {
    description,
    amount,
    date: new Date(),
    type: "credit"
  }
  customer.statement.push(operation)
  res.status(201).json(operation)

  } )

app.post("/withdraw", midCpfAccount, (req, res) => {
  const { amount } = req.body
  //puxa o customer do midCpfAccount
  const { customer } = req

  const balance = getBalance(customer.statement)

  //verificar se a operação é possível com o saldo disponível
  if (balance < amount) {
    return res.status(400).json({error: "Insufficient Funds"})
  }
  const operation = {
    amount,
    date: new Date(),
    type: "debit"
  }

  customer.statement.push(operation)

  return res.status(201).json(operation)
} )

//extrato conforme a data =============================
//dando erro não pode ler a propriedade toDateString de undefined...
  app.get("/statement/date", midCpfAccount, (req, res) => {
    //para puxar o "customer" do middleware
    const { customer } = req
    
    const { date } = req.body

    const dateFormat = new Date(date + " 00:00")

    const statement = customer.statement.filter((statement) => {
      statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    })

    return res.json({cliente: customer.statement})

  })

//update account
app.put("/account", midCpfAccount, (req, res)=> {
  const { name } = req.body

  const { customer } = req

  customer.name = name

  return res.status(201).json(customer)

})

app.delete("/account", midCpfAccount, (req, res) => {
  const { customer } = req

  //splice argumentos apagar desde customer até 1 posição, que é só ele mesmo
  const indexCostumer = costumers.findIndex(costumerIndex => costumerIndex.cpf === costumer.cpf)
  
  costumers.splice(indexCostumer, 1)

  return res.status(210).json(customers)

})
