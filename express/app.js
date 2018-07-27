var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var app = express();

app.use('/static', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'jade');

app.route('/')
    .get(function(req, resp){
            listarCursos(resp);
    })
    .post(function(req, resp){
        var curso = {name: req.body.name, price: req.body.price, category: req.body.category};
        
        inserirCurso(curso, function(){
            listarCursos(resp);
        })
    })


app.listen(3000, function(){
   console.log('App rodando'); 
});

var url = 'mongodb://localhost:27017';
function listarCursos(resp){
    MongoClient.connect(url, (err, client)=> {
        var db = client.db('treinaweb');
        console.log("Conexão realizada - listarCursos");
        db.collection('cursos').find().sort({name: 1}).toArray(function(err, result){
            resp.render('index', {data: result});
        });
    });
}

function inserirCurso(obj, callback){
    MongoClient.connect(url, (err, client)=> {
        var db = client.db('treinaweb');
        console.log("Conexão realizada - inserirCurso");
        db.collection('cursos').insertOne(obj, function(err, result){
           callback();
        });
    });
}