const express = require('express');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

function connectDB() {

    let dbUrl = 'mongodb+srv://drdrakino:123%40Gui321@cluster0.qzneld1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    mongoose.connect(dbUrl);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback(){
        console.log("Atlas mongoDB conectado!");
    });

}

connectDB();

let Message = mongoose.model('Message',{ author : String, data_hora : String, message : String});

let messages = []

// Recupera as mensagens do banco de dados
Message.find({})
    .then(docs=>{
        console.log('DOCS: ' + docs);
        messages = docs;
        console.log('MESSAGES: ' + messages);
    }).catch(err=>{
        console.log(err);
    });

// Define a localização da public, a pasta estatica
app.use(express.static(path.join(__dirname, "../public")))

// Define ejs como engine front-end
app.set('views', path.join(__dirname, "../public"));
app.engine('html', ejs.renderFile);

app.use('/', (req, res) =>{
    res.render('index.html');
});

// Cria Websocket e salva no mongodb
io.on('connection', socket=>{

    /* Exibe a título de teste da conexão o id do socket do usuário conectado: */
    console.log(`Novo usuário conectado ${socket.id}`);

    /* Recupera e mantem as mensagens do front para back e vice-versa: */
    socket.emit('previousMessage', messages);

    /* Dispara ações quando recebe mensagens do frontend: */
    socket.on('sendMessage', data => {

    /* Adicona uma mensagem enviada no final do array de mensagens: */
    let message = new Message(data);
    message.save()
        .then(
            socket.broadcast.emit('receivedMessage', data)
        )
        .catch(err=>{
            console.log('ERRO: ' + err);
        });
    });
})

// Inicializa
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})