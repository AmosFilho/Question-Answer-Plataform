//all "require" need to install
const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//const bodyParser = require("body-parser");

//Database
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com o banco de dados!");
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })

//Dizendo pro express usar o EJS como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
//Decodificar os dados enviados pelo formulário
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Rotas
app.get("/", (req, res) => {
    //Equivalente ao SELECT * from perguntas
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        res.render("index", {
            perguntas: perguntas
        });
    });
    
});

app.get("/perguntar",(req, res)=>{
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res)=>{
    //console.log("BODY RECEBIDO:", req.body);
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    //Equivalente ao INSER INTO
    Pergunta.create({
        titulo:titulo,
        descricao:descricao
    }).then(()=>{
        res.redirect("/");
    });
    //res.send(`Formulário recebido título ${titulo} descricao ${descricao}`);
});

app.get("/pergunta/:id",(req, res)=>{
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta=>{
        if(pergunta != undefined){//Encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
            ]
            }).then(respostas=>{
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            })
        }else{//Não encontrada
            res.redirect("/");
        }
    })
});

app.post("/responder", (req, res)=>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect("/pergunta/"+ perguntaId);
    });
});

app.listen(8080, ()=>{
    console.log("App rodando!");
});