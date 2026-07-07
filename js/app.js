const $=id=>document.getElementById(id);
let el={};
let jogador={nome:"",tipo:"",fone:"",skills:[]};
let itens=[];
let atual=0;
let etapaInicial=true;
let timer=null;
document.addEventListener("DOMContentLoaded",()=>{
el={
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
found:$("sndFound"),
capture:$("sndCapture")
};
itens=[ITEM_INICIAL];
el.start.onclick=iniciar;
el.objeto.onclick=capturar;
el.btnPerfil.onclick=salvarPerfil;
el.btnLead.onclick=salvarLead;
});
async function iniciar(){
try{
el.inicio.style.display="none";
el.jogo.style.display="block";
await abrirCamera();
buscar();
}catch(e){
alert("Erro câmera: "+e.message);
}
}
async function abrirCamera(){
const stream=await navigator.mediaDevices.getUserMedia({
video:{facingMode:{ideal:"environment"}},
audio:false
});
el.camera.srcObject=stream;
}
function buscar(){
el.status.innerHTML="🛰️ Procurando artefato...";
el.radar.style.display="block";
el.objeto.style.display="none";
el.msg.style.display="none";
let tempo=Math.floor(Math.random()*7000)+8000;
clearTimeout(timer);
timer=setTimeout(()=>{
mostrarItem();
},tempo);
}
function mostrarItem(){
let item=itens[atual];
el.radar.style.display="none";
el.objeto.src=item.modelo;
el.objeto.style.display="block";
el.msg.style.display="block";
el.msg.innerHTML="✨ Artefato encontrado<br>Toque para capturar";
try{
el.found.play();
}catch(e){}
}
function capturar(){
let item=itens[atual];
try{
el.capture.play();
}catch(e){}
jogador.skills.push(item.nome);
inventario();
el.objeto.style.display="none";
el.msg.style.display="none";
abrirVideo(item.video);
}
function abrirVideo(src){
el.videoBox.style.display="block";
el.video.src=src;
el.video.play();
el.video.onended=()=>{
el.video.pause();
el.video.src="";
el.videoBox.style.display="none";
proximaEtapa();
};
}
function proximaEtapa(){
if(etapaInicial){
etapaInicial=false;
el.jogo.style.display="none";
el.perfil.style.display="flex";
return;
}
atual++;
if(atual>=itens.length){
finalizar();
}else{
buscar();
}
}
function salvarPerfil(){
if(!el.nome.value||!el.tipo.value){
alert("Preencha seus dados");
return;
}
jogador.nome=el.nome.value;
jogador.tipo=el.tipo.value;
jogador.skills=[];
itens=JORNADAS[jogador.tipo];
atual=0;
el.perfil.style.display="none";
el.jogo.style.display="block";
inventario();
buscar();
}
function finalizar(){
el.jogo.style.display="none";
el.lead.style.display="flex";
}
function salvarLead(){
jogador.fone=el.fone.value;
console.log("LEAD:",jogador);
el.lead.innerHTML=`<h2>Obrigado ${jogador.nome} 🚀</h2><p>Jornada concluída!</p>`;
}
function inventario(){
let html="";
itens.forEach(i=>{
html+=jogador.skills.includes(i.nome)
?`<div class="slot ok">${i.icone}</div>`
:`<div class="slot"></div>`;
});
el.slots.innerHTML=html;
}
