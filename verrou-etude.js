const $=id=>document.getElementById(id);
let state='locked';
let currentShift=0,animation=0;
function pose(shift){
 currentShift=shift;
 $('leaf').querySelector('path').setAttribute('d',`M641 266L610 266C505 266 386 ${313+shift} 311 ${313+shift}L311 ${329+shift}C410 ${329+shift} 510 283 610 283L641 283Z`);
 $('leaf').querySelectorAll('path')[1].setAttribute('transform',`translate(0 ${shift})`);
 $('ball').setAttribute('cy',String(333+shift));
}
function moveTo(target){
 cancelAnimationFrame(animation);
 const from=currentShift,start=performance.now();
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){pose(target);return;}
 const step=now=>{const t=Math.min(1,(now-start)/600),e=t*t*(3-2*t);pose(from+(target-from)*e);if(t<1)animation=requestAnimationFrame(step);};
 animation=requestAnimationFrame(step);
}
const copy={
 locked:['Ouverte : la languette bloque la fermeture.','L’extrémité de la languette vient en appui contre la base de la lame. Une butée distincte limite l’ouverture; elle n’est pas dessinée dans ce schéma de détail.'],
 released:['Languette écartée : la lame peut maintenant se refermer.','La languette revient vers sa plaque d’origine et libère le passage. Dans l’objet réel, on la maintient écartée jusqu’à ce que le talon ait dépassé la zone de blocage.'],
 closed:['Fermée : la bille retient la lame.','La bille se place dans un petit logement du talon. C’est une retenue à surmonter à l’ouverture, pas le même verrouillage que lorsque la lame est ouverte.']
};
function draw(){
 const closed=state==='closed',released=state==='released';
 $('feedback').textContent=copy[state][0];$('explain').textContent=copy[state][1];
 $('open').disabled=!closed;$('release').disabled=state!=='locked';$('close').disabled=!released;
 $('sideState').textContent=closed?'Lame fermée':released?'Lame ouverte · passage libéré':'Lame ouverte';
 $('bladeOpen').style.opacity=closed?'0':'1';$('bladeClosed').style.opacity=closed?'1':'0';
 // Two separate orthographic schematics: side position above, lateral flex below.
 const shift=released?-50:closed?-31:0;
 moveTo(shift);
 $('ball').style.opacity=state==='locked'?'0':'1';
 $('closedTang').style.opacity=closed?'1':'0';$('lockFace').style.opacity=state==='locked'?'1':'0';
 $('pressArrow').style.opacity=released?'1':'0';
 document.body.dataset.lockState=state;
}
$('open').onclick=()=>{if(state!=='closed')return;state='locked';draw();};
$('release').onclick=()=>{if(state!=='locked')return;state='released';draw();};
$('close').onclick=()=>{if(state!=='released')return;state='closed';draw();};
document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{
 const id=button.dataset.tab;
 document.querySelectorAll('.panel').forEach(panel=>panel.hidden=panel.id!==id);
 document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 if(id==='knife'&&!$('knifeFrame').getAttribute('src'))$('knifeFrame').src=$('knifeFrame').dataset.src;
});
draw();
