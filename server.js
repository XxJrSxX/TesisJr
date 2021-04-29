const express= require('express');          //Inicializa el proyecto "express"
const app =express();                       //Inicializa una "aplicacion" con el proyecto express antes creado
const cors = require('cors')
const server = require ('http').Server(app);//Inicializa un servidor con HTTP que atendera a la "app" antes creada
const io = require('socket.io')(server)     // Inicializamos un socket que funcionara especificamente para el server
const {v4: uuidv4 } = require('uuid');      //Inicializamos el uuid, y lo hacemos con la v4
const { ExpressPeerServer } = require('peer');      //SE inicializa un peerserver que trabaja en conjunto con express
const peerServer = ExpressPeerServer(server, {      //lo hacemos funcionarcon el servidor que ya se posee 
  debug: true
});
app.use(cors());
app.use('/peerjs',peerServer);              //Con /peerjs, le decimos que esa es la direccion  a la cual va a servir el peerServer, es decir. que el peerserver funcionara para la sala en la que nos encontremos

app.set('view engine','ejs');               //Le decimos a la aplicacion que para su motor grafico se utilizara ejs

app.use(express.static('public'));          //La aplicacion utilizara de maneja fija lo que se encuentre en la carpeta "public"


app.get('/',(req, res) =>{                 //En donde la aplicacion va a estar alojada
    //res.status(200).send("Servidor Listo")
    //res.render('room');                  //La respuesta del servidor sera la vista "room"
    res.redirect(`/${uuidv4()}`);          //Cuando nos dirijimos al link root,automaticamente nos redirecciona al valor uuid creado
}) 

app.get('/:room',(req, res) =>{
    res.render('room',{roomId: req.params.room })       //Toma el parametro de redireccion anterior y pone en "roomId" para ser usado en el front-end
})
//MANEJO DE LOS SOCKETS         --ON es "ESPERAR" -- EMIT es enviar, un ON funciona solo con un EMIT
io.on('connection',socket =>{                       //Cada que alguien se conecte al servicio , ocurrira esto
    socket.on('join-room',(roomId,userId)=>{        //Se realizara una conexion "join-room" a la id de la sala,solo si el cliente hace un "emit" que se encuentra cuando inicia la conexion peer,enviando la sala a la que desea pertenecer y el id propio
    socket.join(roomId,userId);                                        //El usuario ingresa a la sala
    socket.broadcast.to(roomId).emit('user-connected',userId); //Una vez que ingresa hara un broadcast a toda la sala,diciendo que ingreso el usuario "userId" , y el usuario que ya estaba dentro de la sala realizara su .ON "user-connected"
    console.log("Nuevo usuario: "+userId);  
    socket.on('mensaje',mensaje =>{
        io.to(roomId).emit('MensajeCreado',mensaje);
        })
    socket.on('disconnect', () => {
    socket.broadcast.to(roomId).emit('user-disconnected', userId);
                })
    socket.on('salida', (nombre,iden,roomIdx) =>{
    socket.leave(roomIdx,iden);
    socket.broadcast.to(roomId).emit('salidausuario',nombre);
    })

    socket.on('Compartir',(roomID1,compartirscrean)=>{
    socket.broadcast.to(roomID1).emit('recibirCompartir',compartirscrean);

    })


    })
})
server.listen(process.env.PORT || 3030);  //Escucha el puerto de heroku o el 3030