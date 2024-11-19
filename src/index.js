const express = require('express');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Define a localização da public, a pasta estatica
app.use(express.static(path.join(__dirname, "../public")))

// Define ejs como engine front-end
app.set('views', path.join(__dirname, "../public"));
app.engine('html', ejs.renderFile);

app.use('/', (req, res) =>{
    res.render('index.html');
});

// Websocket
let message = []
io.on('connection', socket =>{
    console.log('Novo usuário conectado! ID:' + socket.id)
});

// Inicializa
const port = 3000;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})