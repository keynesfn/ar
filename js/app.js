const $=id=>document.getElementById(id);
const el={
camera:$("camera"),
inicio:$("inicio"),
start:$("btnStart"),
jogo:$("jogo"),
status:$("status"),
radar:$("radar"),
sinal:$("sinal"),
objeto:$("objeto"),
msg:$("msg"),
videoBox:$("videoBox"),
video:$("videoSkill"),
perfil:$("perfil"),
nome:$("nome"),
tipo:$("tipo"),
btnPerfil:$("btnPerfil"),
lead:$("lead"),
fone:$("fone"),
btnLead:$("btnLead"),
slots:$("slots"),
debug:$("debug"),
found:$("sndFound"),
capture:$("sndCapture")
};
let jogador={
nome:"",
tipo:"",
fone:"",
skills:[]
};
let itens=[ITEM_INICIAL];
let atual=0;
let escolheu=false;
let passos=0;
let meta=0;
let procurando=false;
let ultimo=0;
let movimento=0;
let angulo=0;
let alvo=0;
let ativo=false;
el.start.onclick=async()=>{
el.inicio.style.display="none";
el.jogo.style.display="block";
el.debug.style.display="block";
await sensores();
const stream=await navigator.mediaDevices.getUserMedia({
video:{facingMode:"environment"},
audio:false
});
el.camera.srcObject=stream;
buscar();
};
async function sensores(){
if(typeof DeviceMotionEvent!="undefined"&&DeviceMotionEvent.requestPermission){
await DeviceMotionEvent.requestPermission();
}
if(typeof DeviceOrientationEvent!="undefined"&&DeviceOrientationEvent.requestPermission){
await DeviceOrientationEvent.requestPermission();
}
window.addEventListener("devicemotion",e=>{
if(!procurando)return;
const a=e.accelerationIncludingGravity;
if(!a)return;
const forca=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
movimento=Math.abs(forca-9.8);
if(movimento>1.8&&Date.now()-ultimo>500){
ultimo=Date.now();
passos++;
el.status.innerHTML=`🚶 ${passos}/${meta}`;
if(passos>=meta){
procurando=false;
mostrarItem();
}
}
});
window.addEventListener("deviceorientation",e=>{
angulo=e.alpha||0;
rastrear();
});
}
function buscar(){
el.radar.style.display="block";
el.objeto.style.display="none";
el.msg.style.display="none";
el.sinal.innerHTML="";
passos=0;
meta=Math.floor(Math.random()*8)+8;
procurando=true;
ativo=false;
el.status.innerHTML="🟢 Procurando habilidade";
}
function mostrarItem(){
const item=itens[atual];
el.radar.style.display="none";
el.objeto.src=item.modelo;
alvo=angulo;
ativo=true;
el.msg.style.display="block";
el.msg.innerHTML="🛰️ Sinal encontrado";
el.found.play();
}
function rastrear(){
if(!ativo)return;
let dif=Math.abs(angulo-alvo);
if(dif>180)dif=360-dif;
let sinal=Math.max(0,100-Math.round(dif*4));
el.sinal.innerHTML=`🛰️ Sinal ${sinal}%`;
if(dif<15){
el.objeto.style.display="block";
el.msg.innerHTML="✨ Toque para capturar";
}else{
el.objeto.style.display="none";
el.msg.innerHTML="🧭 Continue procurando";
}
}
el.objeto.onclick=()=>{
const item=itens[atual];
ativo=false;
el.capture.play();
el.objeto.style.display="none";
el.msg.style.display="none";
jogador.skills.push(item.nome);
inventario();
abrirVideo(item.video);
};
function abrirVideo(src){
el.videoBox.style.display="block";
el.video.src=src;
el.video.play();
el.video.onended=()=>{
el.videoBox.style.display="none";
el.video.src="";
proximo();
};
}
function proximo(){
if(!escolheu){
el.jogo.style.display="none";
el.perfil.style.display="flex";
return;
}
atual++;
if(atual>=itens.length){
fim();
}else{
buscar();
}
}
el.btnPerfil.onclick=()=>{
if(!el.nome.value||!el.tipo.value){
alert("Preencha os dados");
return;
}
jogador.nome=el.nome.value;
jogador.tipo=el.tipo.value;
itens=JORNADAS[jogador.tipo];
jogador.skills=[];
atual=0;
escolheu=true;
el.perfil.style.display="none";
el.jogo.style.display="block";
inventario();
buscar();
};
function fim(){
el.jogo.style.display="none";
el.lead.style.display="flex";
}
el.btnLead.onclick=()=>{
jogador.fone=el.fone.value;
console.log(jogador);
el.lead.innerHTML=`
<h2>🚀 Obrigado ${jogador.nome}</h2>
<p>Continue sua jornada empreendedora!</p>
`;
};
function inventario(){
let html="";
itens.forEach(i=>{
html+=jogador.skills.includes(i.nome)
?`<div class="slot ok">${i.icone}</div>`
:`<div class="slot"></div>`;
});
el.slots.innerHTML=html;
}
setInterval(()=>{
el.debug.innerHTML=`
DEBUG<br>
👣 ${passos}/${meta}<br>
📳 ${movimento.toFixed(2)}<br>
🧭 ${Math.round(angulo)}°<br>
🎯 ${Math.round(alvo)}°
`;
},500);
