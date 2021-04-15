const socket = io('/');
const videoGrid=document.getElementById('video-grid')
const mivideo=document.createElement('video');  //Creo un elemento 'video'
mivideo.muted=true;                             //Muteo el elemento para no escuchar mi propia voz
const peers = {}                                //Para todos los pares 
let salidaparausuario;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
/*var peer = new Peer(undefined, {                 //Se crea una nueva conexion peer..el parametro "undefined" es para que el id que tome cada par sea automaticamente dado por peer 
    path: '/peerjs',                            //Se especifica el path en donde estara la conexion peer
    host: '/',                                   //Se especifica que el host es cualquiera, puede ser local, heroku etc.
    port: '443'

});*/
const servidores ={
  config: {'iceServers': [
  //  { url: 'stun:stun.l.google.com:19302' },
  //  { url: 'stun:stun.services.mozilla.com' },
  //  { url: 'stun:stun.turnservejr.com:5349'},
    { url: 'turn:turn.turnservejr.com:5349', credential: '14as78df95g26sad7', username:'jordyadrianstudentEPN' }
    //{ url: 'turn:192.158.29.39:3478?transport=udp', credential: '12345', username:'adrian' }
  /*  {url: 'stun:stun1.l.google.com:19302'},
    {url: 'stun:stun2.l.google.com:19302'},
    {url: 'stun:stun3.l.google.com:19302'},
    {url: 'stun:stun4.l.google.com:19302'},
    {url: 'stun:stun.ekiga.net:3478'},
    {url: 'stun:stun.cheapvoip.com:3478'},
    {url: 'stun:stun.gmx.de:3478'},
    {url: 'stun:stun.gmx.net:3478'},
    {url: 'stun:stun.ipfire.org:3478'},
    {url: 'stun:stun.linphone.org:3478'},
    {url: 'stun:stun.services.mozilla.com:3478'},
    {url: 'stun:stun.stunprotocol.org:3478'},
    {url: 'stun:stunserver.org:3478'},
    { url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username:'web...@live.com' },
    { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username:'web...@live.com' },
    *///{ url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
    //{ url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
  ]}
                };
var peer=new Peer(servidores);
//Manejo de peers
peer.on('open',id =>{                       //Cuando se ejecuta un cliente se abre una conexion peer
    socket.emit('join-room',ROOM_ID,id);    //Hace la llamada "emit" de nombre 'join-room', para acceder a la sala correspondiente , enviando el ID de la sala"ROOM-ID"el cual esta como constante en el room.ejs y enviando el id unico de este par
    console.log("Usted se encuentra dentro de la sala, su id es : "+id);
})

let myVideoStream                           //Varible global
getUserMedia({                              //Nos permite capturar el video y audio, es una promesa, por eso el 
    video: true,                            //then.., solo si tiene audio y video hace lo que dice el ...then
    audio: true
},function(stream){                          //si se cumple lo anterior, se crea una funcion stream con el video y audio

    myVideoStream=stream;                    //Se guarda dentro de la variable el stream antes capturado
    incluirVideoStream(mivideo,stream);   //Llamo la funcion para añadir mi video 
    console.log('my stream:')
    console.log(stream.id);

    peer.on('call', call => {                           //Cuando recibe un llamado
        call.answer(stream)                             //Respondemos con el stream propio
        console.log('Envie mi stream');
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {          
            console.log('Ha recibido el stream de:');   
            console.log(userVideoStream.id);
            console.log(userVideoStream);
         incluirVideoStream(video, userVideoStream)     //Mostramos el stream del otro usuario en el cliente que se conecto 
              
    
       })
     })
    socket.on('user-connected',(userId)=>{                  //Una vez que el usuario obtenga el "emit", se ejecuta esto y sellama a la funcion "conectar nuevo usuario"
      console.log("conectando nuevo usuario....");
      setTimeout(function ()
          {
          conectarNuevoUsuario(userId,stream);
          },5000)       
    })

}, function(err) {
    console.log('Fallo en conseguir el stream' ,err);
  });

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
    console.log("El usuario "+userId+" ha salido de la conferencia");

  })


const conectarNuevoUsuario =(userId,stream)=>{                  //Funcion para conectar unnuevo usuario 
        console.log("El usuario :"+userId+"ha ingresado a la sala");
        const call=peer.call(userId,stream)                     //Llamo al usuario que recien ingreso, y le envio el MI stream(Propio) 
        const video =document.createElement('video')            //Creo un nuevo elemento video para alojar el stream
        call.on('stream', userVideoStream =>{                   //Se ejecutara y se agregara un video con el stream de la otra persona
            console.log('Recibiendo el stream de: ');
            console.log(userVideoStream.id);
            incluirVideoStream(video,userVideoStream)           //Añado el stream de la otra persona a mi stream propio
        })
        call.on('close',() =>{
            video.remove();
        })
        peers[userId] = call
}



function incluirVideoStream (video,stream){             //Funcion que toma un elemento video y un stream capturado
    video.srcObject= stream;                        //El elemento video tomara lo que se encuentre en el stream
    video.addEventListener ('loadedmetadata',()=>{    //Evento que permite cargar todos los datos del stream, y una
        video.play();                               //vez que este capturado, se da el play
    })
    videoGrid.append(video);                        //Agrego el video a la cuadricula que creamos anteriormente
    
}


//PARA EL CHAT

/*let mensaje= $('input')
$('html').keydown((e)=>{
    if (e.which == 13 && mensaje.val().lenght !==0){
        console.log(mensaje);
        socket.emit('mensaje',mensaje.val());
        mensaje.val('');
    }

})*/

socket.on('MensajeCreado',msg =>{
    console.log('Mensaje desde el servidor:', msg);
    $("ul").append(`<li class="Mensajes"><b>${msg.usuario}</b><br/>${msg.mensaje}</li>`);
    BotonBajada()
})

$('#MensajeDeChat').keydown(function(e){
    if(e.keyCode === 13){
        console.log("123")
        var usuariochat = document.getElementById('NombreUsuario').value.trim();
        if (usuariochat === '') {
            alert('Primero introduzca su usuario ');
            return false;
        }
        if ($('#MensajeDeChat').val() === '')
          return false;
        var datos= $('#MensajeDeChat').val();
        console.log(datos);
        var datosglobales={
            'usuario': usuariochat,
            'mensaje': datos
        }
        salidaparausuario=usuariochat;
            socket.emit('mensaje',datosglobales);
            $('#NombreUsuario').attr("disabled","disabled")
            $('#MensajeDeChat').val('');
    }
})


function BotonBajada(){
    var botonparabajar= $('VentanaChat');
    botonparabajar.scrollTop(botonparabajar.prop("scrollHeight"));

}




//FUNCIONALIDAD DE SONIDO
function MuteoDesmuteo(){
    const activo=myVideoStream.getAudioTracks()[0].enabled;
    if (activo){
        myVideoStream.getAudioTracks()[0].enabled=false;
        SeteoBotonMuteo();
    }else{
        SeteoBotonDesmuteo();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}

const SeteoBotonDesmuteo = () => {
    const html = `
      <i class="fas fa-microphone-alt"></i>
      <span>Activo</span>
    `
    document.querySelector('.botonMuteo').innerHTML = html;
  }
  
  const SeteoBotonMuteo = () => {
    const html = `
      <i class="silencio fas fa-microphone-alt-slash"></i>
      <span>Silenciado</span>
    `
    document.querySelector('.botonMuteo').innerHTML = html;
  }




  //FUNCIONALIDAD DE VIDEO
  function CambiosVideo (){
    const activo=myVideoStream.getVideoTracks()[0].enabled;
    if (activo){
        myVideoStream.getVideoTracks()[0].enabled=false;
        DetenerVideo();
    }else{
        FuncionarVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
  }


  const DetenerVideo = () => {
    const html = `
      <i class="detenidoCamara fas fa-user-alt-slash "></i>
      <span>Video Detenido</span>
    `
    document.querySelector('.botonVideo').innerHTML = html;
  }

  const FuncionarVideo = () => {
    const html = `
      <i class="fas fa-camera"></i>
      <span>Video Activo</span>
    `
    document.querySelector('.botonVideo').innerHTML = html;
  }

  //FUNCIONALIDAD BOTON SALIR
  function Salir(){
    const ventana=window.self;
    ventana.opener=window.self;
    ventana.close();
    socket.emit('salida',salidaparausuario);
    
  }
  socket.on('salidausuario',sld=>{
    $("ul").append(`<li class="Mensajes"><b></b><br/>El usuario ${sld} ha salido de la conferencia</li>`);
  })


  //FUNCIONALIDAD BOTON INFORMACION

  function Informacion(){
    alert('Pagina desarrollada por JR');
  }