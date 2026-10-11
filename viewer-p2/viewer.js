import * as THREE from 'three';
import { OrbitControls } from './OrbitControls.js';
import { STLLoader } from './STLLoader.js';
const host=document.querySelector('#view'), status=document.querySelector('#status');
try {
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(36,1,.1,1200);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=true;controls.dampingFactor=.08;controls.enablePan=true;
 controls.screenSpacePanning=true;controls.minDistance=14;controls.maxDistance=500;
 controls.autoRotateSpeed=.65;
 controls.touches.ONE=THREE.TOUCH.ROTATE;controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
 scene.add(new THREE.HemisphereLight(0xf4fff6,0x405149,2.4));
 for(const [pos,power] of [[[50,70,100],3],[[-80,0,40],1.8],[[20,-50,-80],2]]){
  const light=new THREE.DirectionalLight(0xffffff,power);light.position.set(...pos);scene.add(light);
 }
 let currentView='all';
 function frame(mode='all'){
  currentView=mode;
  const distance=Math.max(mode==='clip'?45:100,(mode==='clip'?52:138)/(2*Math.tan(Math.PI/10)*camera.aspect));
  const target=mode==='clip'?new THREE.Vector3(49,0,5):new THREE.Vector3();
  const direction=mode==='back'?new THREE.Vector3(.15,.4,-1):new THREE.Vector3(.12,-.6,1);
  if(mode==='clip')direction.set(.45,-.5,1);
  camera.up.set(0,1,0);camera.position.copy(target).add(direction.normalize().multiplyScalar(mode==='clip'?Math.min(distance,145):distance));
  controls.target.copy(target);controls.update();
 }
 function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(host);resize();frame();
 new STLLoader().load('./maquette-p2/BIVOUAC-Maquette-fermee-P2-mm.stl',geometry=>{
  geometry.translate(-60,-15,-7.2);
  geometry.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({color:0x8ca18d,roughness:.54,metalness:.06});
  scene.add(new THREE.Mesh(geometry,material));
  status.hidden=true;document.body.dataset.loaded='true';frame();
 },undefined,()=>{status.textContent='Chargement impossible. Recharge la page ou ouvre le lien « Fichiers ».';});
 document.querySelector('#reset').onclick=()=>frame();
 document.querySelector('#clip').onclick=()=>frame('clip');
 document.querySelector('#back').onclick=()=>frame('back');
 document.querySelector('#spin').onclick=e=>{controls.autoRotate=!controls.autoRotate;e.currentTarget.setAttribute('aria-pressed',String(controls.autoRotate));};
 window.addEventListener('orientationchange',()=>{setTimeout(()=>{resize();frame(currentView);},180);});
 renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera);});
}catch(e){status.textContent='La vue 3D ne peut pas démarrer dans ce navigateur. Essaie Chrome ou Safari à jour, ou ouvre « Fichiers » pour voir l’image.';console.error(e);}
