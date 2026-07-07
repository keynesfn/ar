// ===============================
// JOGADOR
// ===============================

let jogador = {

    nome:null,
    perfil:null,
    whatsapp:null,
    skills:[]

};


// ===============================
// CONFIG
// ===============================


const primeiroItem = {

    nome:"Entrada Jornada",
    icone:"🚀",
    modelo:"modelos/dotum.glb",
    video:"videos/video1.mp4"

};



let itens = [

    primeiroItem

];




// ===============================
// CONTROLE
// ===============================


let atual = 0;


let capturados=[];


let aguardandoPerfil=false;


let jornadaCarregada=false;



// passos

let passos=0;

let metaPassos=0;

let ultimoPasso=0;

let procurando=false;



// sensores

let movimento=0;

let direcaoAtual=0;

let direcaoItem=null;

let itemAtivo=false;



let inicioBusca=0;







// ===============================
// COMEÇAR
// ===============================


start.onclick = async()=>{


inicio.style.display="none";


introVideo.style.display="block";


videoIntro.play();



};






btnEntrar.onclick=async()=>{


introVideo.style.display="none";


hud.style.display="block";



await iniciarSensores();



let stream =

await navigator.mediaDevices.getUserMedia({

video:{

facingMode:"environment"

},

audio:false

});



camera.srcObject=stream;



buscarItem();


};








// ===============================
// SENSORES
// ===============================


async function iniciarSensores(){



if(

typeof DeviceMotionEvent!="undefined"

&&

DeviceMotionEvent.requestPermission

){

await DeviceMotionEvent.requestPermission();

}



if(

typeof DeviceOrientationEvent!="undefined"

&&

DeviceOrientationEvent.requestPermission

){

await DeviceOrientationEvent.requestPermission();

}





// passos


window.addEventListener(

"devicemotion",

(e)=>{


if(!procurando)return;



let a=e.accelerationIncludingGravity;


if(!a)return;



let forca=Math.sqrt(

a.x*a.x+

a.y*a.y+

a.z*a.z

);



movimento=Math.abs(forca-9.8);



let agora=Date.now();



if(

movimento>1.8

&&

agora-ultimoPasso>500

){



ultimoPasso=agora;


passos++;



status.innerHTML=

"🚶 Explorando "+passos+"/"+metaPassos;




if(passos>=metaPassos){


procurando=false;


ativarItem();


}



}



});






// orientação


window.addEventListener(

"deviceorientation",

(e)=>{


if(e.alpha!=null){


direcaoAtual=e.alpha;


verificaDirecao();


}


});


}








// ===============================
// BUSCAR
// ===============================


function buscarItem(){



scanner.style.display="block";

energia.style.display="none";

objeto.style.display="none";

mensagem.style.display="none";



itemAtivo=false;


inicioBusca=Date.now();



passos=0;


metaPassos=

Math.floor(Math.random()*8)+8;



procurando=true;



status.innerHTML=

"🟢 Procurando habilidade";



}









// ===============================
// ENCONTRO
// ===============================


function ativarItem(){



scanner.style.display="none";



let item=itens[atual];



objeto.src=item.modelo;



direcaoItem=direcaoAtual;


itemAtivo=true;



somFound.play();



energia.style.display="block";


mensagem.style.display="block";



mensagem.innerHTML=

"🛰️ Sinal detectado";



}








// ===============================
// FIXAR NO AMBIENTE
// ===============================



function verificaDirecao(){



if(!itemAtivo)return;



let dif=Math.abs(

direcaoAtual-direcaoItem

);



if(dif>180)

dif=360-dif;



let sinal=

Math.max(

0,

100-Math.round(dif*4)

);



energia.innerHTML=

"🛰️ Sinal "+sinal+"%";




if(dif<15){


objeto.style.display="block";


mensagem.innerHTML=

"✨ Artefato encontrado<br>Toque para capturar";


}else{


objeto.style.display="none";


mensagem.innerHTML=

"🧭 Continue procurando";


}


}









// ===============================
// CAPTURA
// ===============================


objeto.onclick=()=>{



let item=itens[atual];



somCapture.play();



itemAtivo=false;


objeto.style.display="none";


mensagem.style.display="none";



capturados.push(item);



jogador.skills.push(item.nome);



atualizarInventario();



abrirVideo(item.video);



};










// ===============================
// VIDEO
// ===============================


function abrirVideo(v){



playerVideo.style.display="block";


videoSkill.src=v;


videoSkill.play();



videoSkill.onended=()=>{


playerVideo.style.display="none";

videoSkill.src="";



aposVideo();



};



}










// ===============================
// DECISÃO APÓS VIDEO
// ===============================


function aposVideo(){



// terminou primeiro item


if(

!jornadaCarregada

){


abrirPerfil();


return;


}




atual++;



if(atual>=itens.length){


abrirWhatsapp();


}else{


buscarItem();


}



}









// ===============================
// FORM PERFIL
// ===============================


function abrirPerfil(){


hud.style.display="none";


formPerfil.style.display="block";


}







salvarPerfil.onclick=()=>{



if(

!nomeJogador.value ||

!perfilJogador.value

){

alert("Preencha seus dados");

return;

}



jogador.nome=

nomeJogador.value;



jogador.perfil=

perfilJogador.value;



itens =

JORNADAS[jogador.perfil];



atual=0;


capturados=[];



jornadaCarregada=true;



formPerfil.style.display="none";


hud.style.display="block";



atualizarInventario();



buscarItem();



};









// ===============================
// WHATSAPP FINAL
// ===============================



function abrirWhatsapp(){



hud.style.display="none";


formWhats.style.display="block";



somComplete.play();



}







enviarLead.onclick=()=>{


jogador.whatsapp=

whatsapp.value;



console.log(

"LEAD GERADO",

jogador

);



formWhats.innerHTML=

`

<h2>🚀 Obrigado ${jogador.nome}</h2>

<p>
Sua jornada continua!
</p>

`;


};










// ===============================
// INVENTÁRIO
// ===============================



function atualizarInventario(){



let html="";



itens.forEach(i=>{


html+=

jogador.skills.includes(i.nome)

?

`

<div class="slot ativo">

${i.icone}

</div>

`

:

`

<div class="slot vazio"></div>

`;



});



slots.innerHTML=html;



nivel.innerHTML=

jogador.skills.length+

"/"+

itens.length;



}









// ===============================
// DEBUG
// ===============================



setInterval(()=>{


debug.innerHTML=

`
DEBUG<br>

👣 ${passos}/${metaPassos}<br>

📳 ${movimento.toFixed(2)}<br>

🧭 ${Math.round(direcaoAtual)}°<br>

🎯 ${
direcaoItem?
Math.round(direcaoItem)+"°":
"-"
}

`;


},500);
