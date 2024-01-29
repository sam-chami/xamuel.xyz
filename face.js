import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.module.js';
import { GLTFLoader } from './thecave/GLTFLoader.js';

const container = document.getElementById('faceContainer');
var containerWidth =  (window.innerWidth * 40) / 100;
var containerHeight = (window.innerHeight * 40) / 100;

const renderer = new THREE.WebGLRenderer({antialias: true});
const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(containerWidth, containerHeight);

container.appendChild(renderer.domElement);

scene.background = new THREE.Color( 0x080808 );

const light = new THREE.AmbientLight( 0xfff0f0 ); // soft white light scene.add( light );
scene.add(light);

const loader = new GLTFLoader();
var head;

loader.load( 'src/face_decimated.glb', function ( gltf ) {
  
  head = gltf.scene
	scene.add( head );

}, undefined, function ( error ) {

	console.error( error );

} );

if (window.devicePixelRatio > 1.5) {
  camera.position.z = 4;
} else {
  camera.position.z = 2;
}

function updateSize() {
  containerWidth =  (window.innerWidth * 40) / 100;
  containerHeight = (window.innerHeight * 40) / 100;

  camera.aspect = containerWidth / containerHeight;
  renderer.setSize(containerWidth, containerHeight);
  camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
  
  head.rotation.x += 0.01;
  head.rotation.y += 0.01;
  updateSize();
}
animate();

