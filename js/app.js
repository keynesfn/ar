// ==============================
// CONFIGURAÇÃO DA JORNADA
// ==============================


const itens = [

{
nome:"Gestão Financeira",
icone:"💰",
modelo:"modelos/dotum.glb",
video:"videos/video1.mp4"
},

{
nome:"Clientes e Mercado",
icone:"🎯",
modelo:"modelos/sicoob.glb",
video:"videos/video2.mp4"
},

{
nome:"Vendas",
icone:"🚀",
modelo:"modelos/sebrae.glb",
video:"videos/video3.mp4"
},

{
nome:"Inovação",
icone:"💡",
modelo:"modelos/dotum.glb",
video:"videos/video4.mp4"
},

{
nome:"Crescimento",
icone:"👑",
modelo:"modelos/sicoob.glb",
video:"videos/video5.mp4"
}

];



// ==============================
// VARIÁVEIS
// ==============================


let atual = 0;

let capturados = [];


// passos

let passos = 0;

let metaPassos = 0;

let ultimoPasso = 0;

let procurando = false;


// sensores

let movimento = 0;

let direcaoAtual = 0;

let direcaoItem = null;

let itemAtivo = false;


let inicioBusca = 0;






// ==============================
// COMEÇAR
// ==============================


start.onclick = async()=>{


inicio.style.display="none";

hud.style.display="block";


await iniciarSensores();



let stream = 

await navigator.mediaDevices.getUserMedia({

video:{

facingMode:"environment"

},

audio:false

});



camera.srcObject = stream;



buscarItem();



};








// ==============================
// SENSORES
// ==============================



async function iniciarSensores(){



// IOS


if(

typeof DeviceMotionEvent !== "undefined"

&&

typeof DeviceMotionEvent.requestPermission==="function"

){

await DeviceMotionEvent.requestPermission();

}





if(

typeof DeviceOrientationEvent !== "undefined"

&&

typeof DeviceOrientationEvent.requestPermission==="function"

){

await DeviceOrientationEvent.requestPermission();

}







// DETECTA PASSOS


window.addEventListener(

"devicemotion",

(e)=>{


if(!procurando)

return;



let acc =

e.accelerationIncludingGravity;



if(!acc)

return;




let forca = Math.sqrt(

acc.x*acc.x +

acc.y*acc.y +

acc.z*acc.z

);




movimento =

Math.abs(forca - 9.8);





let agora = Date.now();





if(

movimento > 1.8

&&

agora - ultimoPasso > 500

){



ultimoPasso = agora;



passos++;




status.innerHTML =

"🚶 Explorando... "+

passos+

"/"+

metaPassos;




if(passos >= metaPassos){



procurando=false;



ativarArtefato();



}



}



});


 





// DIREÇÃO DO CELULAR


window.addEventListener(

"deviceorientation",

(e)=>{


if(e.alpha!==null){


direcaoAtual=e.alpha;


verificarDirecao();


}


});



}










// ==============================
// BUSCA
// ==============================


function buscarItem(){



scanner.style.display="block";

energia.style.display="none";


objeto.style.display="none";


mensagem.style.display="none";



itemAtivo=false;


passos=0;



inicioBusca=Date.now();



// random 8 até 15 passos


metaPassos =

Math.floor(

Math.random()*8

)+8;




procurando=true;



status.innerHTML=

"🟢 Radar procurando habilidades";



}










// ==============================
// ITEM ENCONTRADO
// ==============================



function ativarArtefato(){



scanner.style.display="none";



let item = itens[atual];



objeto.src=item.modelo;




// fixa posição virtual


direcaoItem = direcaoAtual;



itemAtivo=true;



somFound.play();



energia.style.display="block";



status.innerHTML=

"✨ Sinal encontrado";



mensagem.style.display="block";


mensagem.innerHTML=

"🧭 Procure o artefato";



navigator.vibrate?.(300);



}









// ==============================
// GIROSCOPIO - ANCORAGEM
// ==============================



function verificarDirecao(){



if(!itemAtivo)

return;




let diferenca =

Math.abs(

direcaoAtual -

direcaoItem

);




// ajuste 360 graus


if(diferenca>180)

diferenca = 360-diferenca;




let sinal =

Math.max(

0,

100 - Math.round(diferenca*4)

);




energia.innerHTML=

"🛰️ Sinal "+sinal+"%";






if(diferenca < 15){



objeto.style.display="block";



mensagem.innerHTML=

"✨ Artefato encontrado<br>Toque para capturar";



}

else{



objeto.style.display="none";



if(diferenca > 30){


mensagem.innerHTML=

"🧭 Continue procurando";


}



}



}









// ==============================
// CAPTURA
// ==============================


objeto.onclick=()=>{



if(!itemAtivo)

return;




let item=itens[atual];



somCapture.play();



objeto.classList.add("captura");




setTimeout(()=>{



objeto.classList.remove("captura");


objeto.style.display="none";



itemAtivo=false;



capturados.push(item);



atualizarInventario();



abrirVideo(item.video);



},800);



};










// ==============================
// VIDEO
// ==============================


function abrirVideo(video){



playerVideo.style.display="block";



videoSkill.src=video;



videoSkill.play();




videoSkill.onended=()=>{



playerVideo.style.display="none";



videoSkill.src="";



atual++;




if(atual >= itens.length){


finalizar();


}

else{


buscarItem();


}



};



}









// ==============================
// INVENTARIO
// ==============================



function atualizarInventario(){



let html="";



itens.forEach(i=>{



if(

capturados.includes(i)

){



html+=`

<div class="slot ativo">

${i.icone}

</div>

`;



}

else{


html+=`

<div class="slot vazio">

</div>

`;


}



});




slots.innerHTML=html;



nivel.innerHTML =

capturados.length+

"/"+

itens.length;



}











// ==============================
// FINAL
// ==============================


function finalizar(){



somComplete.play();



scanner.style.display="none";


energia.style.display="none";



status.innerHTML=

"🏆 Jornada concluída";



mensagem.style.display="block";



mensagem.innerHTML=

`
🚀 Parabéns!<br><br>

Você conquistou todas as habilidades empreendedoras!

`;



}










// ==============================
// DEBUG
// ==============================



setInterval(()=>{



let tempo =

inicioBusca

?

Math.floor(

(Date.now()-inicioBusca)/1000

)

:

0;




debug.innerHTML=

"DEBUG<br>"+

"⏱ "+tempo+"s<br>"+

"👣 "+passos+"/"+metaPassos+"<br>"+

"📳 "+movimento.toFixed(2)+"<br>"+

"🧭 Atual: "+Math.round(direcaoAtual)+"°<br>"+

"🎯 Item: "+

(

direcaoItem!==null

?

Math.round(direcaoItem)+"°"

:

"-"

)

+"<br>"+

"🎁 "+(atual+1)+"/"+itens.length;



},500);
