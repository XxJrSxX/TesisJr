//const { default: Swal } = require("sweetalert2");

const socket = io('/');                         //Creacion de la constante socket que actuara consu libreria desde la raiz
let itera=0;                                    //Varible de ayuda para numerar los videos de cada usuario
//let nombre='jordy'
let width=640;
let height=480;
let enlaceAmigos = window.location;
const videoGrid=document.getElementById('video-grid') //Creo un elemento 'video-grid'

const mivideo=document.createElement('video');        //Creo un elemento 'video'
mivideo.setAttribute("id",itera);                     //Seteo un "id" y su valor a mi video para conocer que valor tiene
mivideo.setAttribute("width",width);
mivideo.setAttribute("height",height);
mivideo.setAttribute("ondblclick","TenerPantallaGigante(this)");
//mivideo.controls=true
mivideo.muted=true;                             //Muteo el elemento para no escuchar mi propia voz
//mivideo.append(nombre);
$("mivideo").append(`<head>Jordy</head>`);
const peers = {}                                //Para todos los pares 
var peeractual = [];
let identi;                                     //Variable que nos dice la identidad del usuario
let roomIdx;                                    //Variblae que permite conocer la sala donde nos encontramos
let salidaparausuario;
bienvenida();

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
    { url: 'stun:stun.turnservejr.com:5349'},
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
    identi=id;
    roomIdx=ROOM_ID;
})

let myVideoStream                           //Varible global
navigator.mediaDevices.getUserMedia({       //Nos permite capturar el video y audio, es una promesa, por eso el 
    video: true,                            //then.., solo si tiene audio y video hace lo que dice el ...then
    audio: true
}).then(stream =>{                          //si se cumple lo anterior, se crea una funcion stream con el video y audio

    myVideoStream=stream;                    //Se guarda dentro de la variable el stream antes capturado
    incluirVideoStream(mivideo,stream);     //Llamo la funcion para añadir mi video 
    relacionAspecto();
    console.log('my stream:')
    console.log(stream.id);
    peer.on('call', call => {                           //Cuando recibe un llamado
        peers[call.peer]=call
        call.answer(stream)                             //Respondemos con el stream propio
        console.log('Envie mi stream');
        const video = document.createElement('video')
        itera++;
        console.log('mitad',itera);
        video.setAttribute("id", itera);
        video.setAttribute("ondblclick","TenerPantallaGigante(this)");
        call.on('stream', userVideoStream => {          
            console.log('Ha recibido el stream de:');   
            console.log(userVideoStream.id);
        incluirVideoStream(video, userVideoStream)     //Mostramos el stream del otro usuario en el cliente que se conecto 
        //peeractual = call.peerConnection;
        peeractual.push(call.peerConnection);     
       // stream.getTracks().forEach(track => senders.push(peer.addTrack(track, stream)));
       })
       call.on("close", () => {
        video.remove();
    })
     })
    socket.on('user-connected',(userId)=>{                  //Una vez que el usuario obtenga el "emit", se ejecuta esto y sellama a la funcion "conectar nuevo usuario"
      console.log("conectando nuevo usuario....");
      setTimeout(function ()
          {
          conectarNuevoUsuario(userId,stream);
          },1000)
                 
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
        let call=peer.call(userId,stream)                     //Llamo al usuario que recien ingreso, y le envio el MI stream(Propio) 
        let video1 =document.createElement('video')            //Creo un nuevo elemento video para alojar el stream
        itera++;
        video1.setAttribute("id",itera);
        video1.setAttribute("ondblclick","TenerPantallaGigante(this)");
       // video1.controls=true;
        console.log('final',itera);
        call.on('stream', userVideoStream =>{                   //Se ejecutara y se agregara un video con el stream de la otra persona
            console.log('Recibiendo el stream de: ');
            console.log(userVideoStream.id);
           incluirVideoStream(video1,userVideoStream)           //Añado el stream de la otra persona a mi stream propio
           //peeractual=call.peerConnection; 
           peeractual.push(call.peerConnection); 
           console.log(peeractual)
          })
        call.on('close',() =>{
            video1.remove();
        })
        peers[userId] = call
}



function incluirVideoStream (video,stream){             //Funcion que toma un elemento video y un stream capturado
    video.srcObject= stream;                        //El elemento video tomara lo que se encuentre en el stream
    video.addEventListener ('loadedmetadata',()=>{    //Evento que permite cargar todos los datos del stream, y una
        video.play();                               //vez que este capturado, se da el play
    })
    videoGrid.appendChild(video);                      //Agrego el video a la cuadricula que creamos anteriormente
    
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
socket.on('salidausuario',nmbr=>{
  $("ul").append(`<li class="Mensajes"><b>El usuario: ${nmbr}</b><br/>Ha salido de la conferencia</li>`);
  /*setTimeout(function ()
    {
     location.reload();
    },5000)     
  */
})
socket.on('MensajeCreado',(msg,horario) =>{
    console.log('Mensaje desde el servidor:', msg);
    $("ul").append(`<li class="Mensajes"><b>${msg.usuario}</b><br/>${msg.mensaje}&nbsp;&nbsp;&nbsp;&nbsp;${horario}</li>`);
    BotonBajada()
})

$('#MensajeDeChat').keydown(function(e){
    if(e.keyCode === 13){
        var usuariochat = document.getElementById('NombreUsuario').value.trim();
        if (usuariochat === '') {
            Swal.fire('ALTO!!','Coloque su nombre para acceder al chat','info');
            return false;
        }
        if ($('#MensajeDeChat').val() === '')
          return false;
        var datos= $('#MensajeDeChat').val();
        var resultado=datos.slice(0, 20);
        var datosglobales={
            'usuario': usuariochat,
            'mensaje': resultado
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
    var jl=$('#NombreUsuario').val();
    var jl1=$('#MensajeDeChat').val();
    console.log(jl);
    if ( jl === '') {
      Swal.fire('ALTO!!','Porfavor Introduzca su nombre de usuario.. ','error');
      return false;
  }
  if (jl1 ===''){
    salidaparausuario=jl;
  }
    socket.emit('salida',salidaparausuario,identi,roomIdx);
    Swal.fire({
    icon:'question',
    title:'Esta seguro de abandonar la sesion?',
    showCancelButton: true,
    confirmButtonText: 'SI!!',
    confirmButtonColor: '#32CD32',
    cancelButtonText: 'Cancelar',
    cancelButtonColor:'#FFA07A',
    }).then(function(result){
      if(result.isConfirmed){
        setTimeout(function ()
        {
          socket.disconnect();
        },2000)
        Swal.fire({
          icon:'success',
          title:'Ud ha salido de la Sala, porfavor cierre su pestaña',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#32CD32',
          showCancelButton: false
        })
        const ventana=window.self;
        ventana.opener=window.self;
        ventana.close();
    }
   
  });
    
    
    
    
  }

  //FUNCIONALIDAD BOTON INFORMACION

  function Informacion(){
    Swal.fire({
      title:'Aplicacion Desarrollada por: '+'👨‍💻', 
      text:'Jordy Adrian Ramon Bedoya',
      showCancelButton: false,
      confirmButtonText: 'OK',
      confirmButtonColor: '#32CD32',});
  }

  //FUNCIONALIDAD ENVIARMENSAJE MEDIANTE EL CLICK
  function BotonEnvioSMS(){
    
    var usuariochat = document.getElementById('NombreUsuario').value.trim();
    if (usuariochat === '') {
      Swal.fire('ALTO!!','Coloque su nombre para acceder al chat','info');
        return false;
    }
    if ($('#MensajeDeChat').val() === '')
      return false;

    var datos= $('#MensajeDeChat').val();
    var resultado=datos.slice(0, 20);
    var datosglobales={
        'usuario': usuariochat,
        'mensaje': resultado
    }
    salidaparausuario=usuariochat;
        socket.emit('mensaje',datosglobales);
        $('#NombreUsuario').attr("disabled","disabled")
        $('#MensajeDeChat').val('');

  }  
 
  //FUNCIONALIDAD BOTON CHAT
  function CambiosChat(){
   console.log('holaasd');
  }


//FUNCIONALIDAD BOTON PARA INVITAR AMIGOS
function InvitarAmigos(){
document.getElementById("enlace").value=window.location.href
var enlace=document.getElementById("enlace")
  Swal.fire({
  title: "Invita a mas amigos!!"+'&#128525;',
  text: "LINK:  "+enlaceAmigos,
  showCancelButton: true,
  confirmButtonText: 'COPIAR!!'+'&#x1f919;',
  confirmButtonColor: '#32CD32',
  cancelButtonText: 'Cancelar'+'&#128528',
  cancelButtonColor:'#FFA07A',
  showLoaderOnConfirm: false,
  allowOutsideClick: true,
  allowEscapeKey: true
    }).then(function(result){
        if(result.isConfirmed){
          enlace.select();
          enlace.setSelectionRange(0,99999);
          document.execCommand('copy');
          Swal.fire({
            title:'LISTO!!'+'&#x1f60e',
            text:'Envia el link a tus amigos para que puedan acceder a la sala!!',
            confirmButtonText: '&#x1f44c',
            confirmButtonColor: '#32CD32'})
      }
    });
  } 

//FUNCION COMPARTIR PANTALLA
function SharePantalla(){
navigator.mediaDevices.getDisplayMedia({
  video:{
    cursor: true
  },
  audio:{
    echoCancellation:true,
    noiseSuppression:true
  }
  }).then((stream)=>{
    let videotrack=stream.getVideoTracks()[0];
    videotrack.onended = function(){
      DetenerComparticionPantalla();
    }
    for (let x=0;x<peeractual.length;x++){
           
      let sender = peeractual[x].getSenders().find(function(s){
         return s.track.kind == videotrack.kind;
       })
       
       sender.replaceTrack(videotrack);
  }
  }).catch((err)=>{
    console.log("No se pudo obtener el stream de comparticion");
  })
}

function DetenerComparticionPantalla(){
  console.log("COMPARTICION CANCELADA")
  let videotrack=myVideoStream.getVideoTracks()[0];
  for(let x=0;x<peeractual.length;x++){
    var sender=peeractual[x].getSenders().find(function(s){
      return s.track.kind == videotrack.kind;
    })
    sender.replaceTrack(videotrack);
  }
}
//socket.emit('Compartir',ROOM_ID,compartirscrean);
socket.on('recibirCompartir', streamCompartir => {
  let video23 =document.createElement('video')
 // video23.controls=true;
  incluirVideoStream(video23,streamCompartir);
  console.log("La comparticion se ha realizado con exito");
  
})

//FUNCION LEVANTAR MANO
function LevantarMano(){
  var usuariochat = document.getElementById('NombreUsuario').value.trim();
  if (usuariochat === '') {
      Swal.fire('ALTO!!','Coloque su nombre para acceder al chat','info');
      return false;
  }
  var datos= "&#9995;";
  var datosglobales={
      'usuario': usuariochat,
      'mensaje': datos
  }
  salidaparausuario=usuariochat;
      socket.emit('mensaje',datosglobales);
      $('#NombreUsuario').attr("disabled","disabled")
      $('#MensajeDeChat').val('');
}

//FUNCION PARA BIENVENIDA
function bienvenida(){
  Swal.fire({
    title: 'Bienvenido a la sala!!'+'&#x1f64c',
    text:  'Porfavor Introduzca su nombre y apellido',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'on'
    },
    showCancelButton: false,
    confirmButtonText: 'ENTRAR!!'+'&#x1f6aa',
    confirmButtonColor: '#32CD32',
    showLoaderOnConfirm: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => {
      if (!value) {
        return 'Necesita ingresar sus datos!!'+'&#x1f928'
      }
      else{
        $('#NombreUsuario').val(value);
        $('#NombreUsuario').attr("disabled","disabled")
      }
    }
  })/*.then((result) => {
    if (result.isConfirmed) {
        if(!result.value ){
            return 'You need to write something!'
            //bienvenida();
        }
        else{
        
          
        }
    }
  })*/
  
}
//FUNCION PARA RELACION ASPECTO.
function relacionAspecto(){
  setInterval(aspectototal,5000);
}
function aspectototal(){
  var numeroVideo=$('video').length;

    switch(numeroVideo){
      case 1:
      //  console.log("Solo hay un participante")
        $('video').attr("height",540)
        $('video').attr("width",730)

        break;
      case 2:
       // console.log("Solo hay dos participantes")
        $('video').attr("height",'auto')
        $('video').attr("width",530)
        break;
      case 3:
       // console.log("Solo tres participantes")
        $('video').attr("height",275)
        $('video').attr("width",363)
        
        break;
      case 4:
    
        $('video').attr("height",275)
        $('video').attr("width",363)
        break;
      case 5:
          $('video').attr("height",200)
          $('video').attr("width",200)
        break;

        case 6:
          $('video').attr("height",200)
          $('video').attr("width",200)
        break;
        case 7:
          $('video').attr("height",200)
          $('video').attr("width",200)
        break;





    }
}

//FUNCION PARA AGRANDAR CUALQUIER PANTALLA
function TenerPantallaGigante(elemento){
  if(elemento.requestFullscreen) {
      elemento.requestFullscreen();
    } else if(mivideo.mozRequestFullScreen) {
      elemento.mozRequestFullScreen();
    } else if(mivideo.webkitRequestFullscreen) {
      elemento.webkitRequestFullscreen();
    } else if(mivideo.msRequestFullscreen) {
      elemento.msRequestFullscreen();
    }
}

/*  //EXTRAS
function Lectura() {
    setInterval( lecturavideo, 3000);
}
function lecturavideo(){
  var numeroVideo=$('video').length;
  var ayudaVideo;
  console.log('num exacto',numeroVideo)
  //const activo=myVideoStream.getVideoTracks()[0].enabled;
 // var element = document.getElementById('video');
  for (ayudaVideo=1;ayudaVideo<numeroVideo;ayudaVideo++){
    if (myVideoStream.getVideoTracks()[ayudaVideo]==null){
      //helpe='video[id=];
      $('video[id='+ayudaVideo+']').remove();
      console.log('Eliminando video numero ',ayudaVideo) ;
      break;
    }
  }
  
}  
*/