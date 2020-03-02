const express = require("express")
const server = express()

server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({extended: true}))


//Configurando conexão com banco de dados
const Pool = require('pg').Pool

const db = new Pool({
    user: 'postgres',
    password: 'X010999x@',
    host: 'localhost',
    port: 5432,
    database: 'donate'
})


//Confgurando o templete
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noChace:true
})


//Confiurar apresentação da página
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if(err) return res.send("Erro no banco de dados!")

        if(result.rowCount > 4) {
            const donors2 = result.rows

            const donors = []

            donors.push(donors2[result.rowCount - 1])
            donors.push(donors2[result.rowCount - 2])
            donors.push(donors2[result.rowCount - 3])
            donors.push(donors2[result.rowCount - 4])

            return res.render("index.html", {donors})
        }
        else {
            const donors = result.rows
            return res.render("index.html", {donors})
        }
        
    })
})

server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "" ) {
        return res.send("Todos os campos são obrigatórios!")
    }

    const query = `INSERT INTO donors ("name", "email", "blood")
                    VALUES ($1, $2, $3)`

    const values = [name, email, blood]
    
    db.query(query, values, function(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/")
    })

})

//Configurando a porta
server.listen(3000, function() {
    console.log("Servidor Iniciado")    
})
