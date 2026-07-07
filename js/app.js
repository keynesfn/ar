/* ===============================
   JOGADOR
================================ */


let jogador = {

nome:null,

perfil:null,

whatsapp:null,

skills:[]

};





/* ===============================
   ESTADO DO JOGO
================================ */


let itens=[ITEM_INICIAL];


let atual=0;


let jornadaSelecionada=false;



// sensores

let passos=0;

let metaPassos=0;

let ultimoPasso=0;

let procurando=false;



let movimento=0;


let direcaoAtual=0;

let direcaoItem=null;


let itemAtivo=false;



let inicioBusca=0;






/* ===============================
   INICIAR JOGO
================================ */


start.onclick=async()=>{


inicio.style.display="none";


hud.style.display="block";


debug.style.display="block";



await iniciarSensores();




let stream=

await navigator.mediaDevices.getUserMedia({

video:{

facingMode:"environment"

},

audio:false

});



camera.srcObject=stream;



buscarItem();


};










/* ===============================
   SENSORES
================================ */


async function iniciarSensores(){



// IOS


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






// MOVIMENTO


window.addEventListener(

"devicemotion",

(e)=>{


if(!procurando)

return;



let acc=

e.accelerationIncludingGravity;



if(!acc)

return;




let forca=Math.sqrt(

acc.x*acc.x+

acc.y*acc.y+

acc.z*acc.z

);



movimento=

Math.abs(forca-9.8);





let agora=Date.now();




if(

movimento>1.8

&&

agora-ultimoPasso>500

){



ultimoPasso=agora;



passos++;



status.innerHTML=

"🚶 Explorando "

+passos+

"/"

+metaPassos;





if(passos>=metaPassos){



procurando=false;


ativarItem();



}



}



});








// GIROSCOPIO


window.addEventListener(

"deviceorientation",

(e)=>{



if(e.alpha!==null){


direcaoAtual=e.alpha;


verificarDirecao();


}



});


}









/* ===============================
   BUSCAR ITEM
================================ */


function buscarItem(){



scanner.style.display="block";


energia.style.display="none";


objeto.style.display="none";


mensagem.style.display="none";



itemAtivo=false;



passos=0;



inicioBusca=Date.now();



metaPassos=

Math.floor(

Math.random()*8

)+8;



procurando=true;




status.innerHTML=

"🟢 Procurando habilidade";


}











/* ===============================
   ITEM ACHADO
================================ */


function ativarItem(){



scanner.style.display="none";



let item=itens[atual];



objeto.src=item.modelo;



direcaoItem=direcaoAtual;



itemAtivo=true;




energia.style.display="block";


mensagem.style.display="block";



somFound.play();



mensagem.innerHTML=

"🛰️ Sinal detectado";


}









/* ===============================
   ANCORAGEM AR
================================ */


function verificarDirecao(){



if(!itemAtivo)

return;




let diferenca=

Math.abs(

direcaoAtual-

direcaoItem

);



if(diferenca>180)

diferenca=

360-diferenca;





let sinal=

Math.max(

0,

100-

Math.round(

diferenca*4

)

);





energia.innerHTML=

"🛰️ Sinal "

+sinal+

"%";






if(diferenca<15){



objeto.style.display="block";



mensagem.innerHTML=

"✨ Artefato encontrado<br>Toque para capturar";


}



else{



objeto.style.display="none";


mensagem.innerHTML=

"🧭 Continue procurando";


}



}









/* ===============================
   CAPTURAR
================================ */


objeto.onclick=()=>{



let item=

itens[atual];




somCapture.play();



itemAtivo=false;


objeto.style.display="none";


energia.style.display="none";


mensagem.style.display="none";




jogador.skills.push(

item.nome

);



atualizarInventario();



abrirVideo(

item.video

);



};










/* ===============================
   VIDEO
================================ */


function abrirVideo(video){



playerVideo.style.display="block";



videoSkill.src=video;



videoSkill.play();





videoSkill.onended=()=>{



playerVideo.style.display="none";


videoSkill.src="";



aposVideo();



};



}










/* ===============================
   APÓS VIDEO
================================ */


function aposVideo(){





// terminou primeiro item


if(

!jornadaSelecionada

){


abrirFormularioPerfil();


return;


}





atual++;




if(

atual>=itens.length

){


abrirWhatsapp();


}



else{


buscarItem();


}



}









/* ===============================
   FORM PERFIL
================================ */


function abrirFormularioPerfil(){



hud.style.display="none";


formPerfil.style.display="flex";


}







salvarPerfil.onclick=()=>{



if(

!nomeJogador.value

||

!perfilJogador.value

){


alert(

"Informe seu nome e escolha a jornada"

);


return;


}




jogador.nome=

nomeJogador.value;




jogador.perfil=

perfilJogador.value;





itens=

JORNADAS[jogador.perfil];



jogador.skills=[];



atual=0;



jornadaSelecionada=true;




formPerfil.style.display="none";


hud.style.display="block";




atualizarInventario();



buscarItem();



};









/* ===============================
   WHATSAPP FINAL
================================ */


function abrirWhatsapp(){



hud.style.display="none";



formWhats.style.display="flex";



somComplete.play();



}







enviarLead.onclick=()=>{



jogador.whatsapp=

whatsapp.value;





console.log(

"LEAD",

jogador

);





formWhats.innerHTML=

`

<h2>

🚀 Obrigado ${jogador.nome}

</h2>


<p>

Continue sua jornada empreendedora!

</p>

`;


};










/* ===============================
   INVENTÁRIO
================================ */


function atualizarInventario(){



let html="";



itens.forEach(

i=>{



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



}

);





slots.innerHTML=html;



nivel.innerHTML=

jogador.skills.length+

"/"+

itens.length;



}










/* ===============================
   DEBUG
================================ */


setInterval(()=>{



debug.innerHTML=

`

DEBUG<br>

👣 ${passos}/${metaPassos}<br>

📳 ${movimento.toFixed(2)}<br>

🧭 ${Math.round(direcaoAtual)}°<br>

🎯 ${
direcaoItem?
Math.round(direcaoItem)+"°"
:
"-"
}

`;



},500);
