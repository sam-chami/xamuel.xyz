import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { FirstPersonControls } from './FirstPersonControls.js';

let cave, controls, cobject;

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const lamp = new THREE.PointLight( 0xf51b00, 0.7, 8 );
const AmbientLight = new THREE.PointLight( 0xfcd4a9, 0.05, 100 ); 
lamp.position.set( 10, 1, 2 ); 
scene.add( lamp );
scene.add( AmbientLight );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
controls = new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.15;

// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
	// resource URL
	'../src/cave.glb',
	// called when the resource is loaded
	function ( gltf ) {

        cave = gltf.scene;

		cobject = gltf.asset;

        cave.position.z = -7;
        cave.position.y = -2.75;
        cave.position.x = -0.45

		scene.add( cave );

        renderer.outputEncoding = THREE.sRGBEncoding;

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened', error );

	}
);

// Make it posibble to click objects

renderer.domElement.addEventListener("click", onclick, true);

const pointer = new THREE.Vector2();

var raycaster = new THREE.Raycaster();

function onclick(event) {

	event.preventDefault();

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera(pointer, camera);

	console.log("x,y" +pointer.x + pointer.y);

	const intersects = raycaster.intersectObjects(cave.children, false);

	if ( intersects.length > 0 ) {		
		this.name = intersects[ 0 ].object.name;

		if(this.name === "Chest") {
			window.location.href = "inf_thecave.html";
		}

		console.log("name: " + this.name);
	}
}

// Resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    const aspectRatio = window.innerWidth / window.innerHeight;
    camera.aspect = aspectRatio;

    controls.handleResize();
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

// Audio

const caveAmbience = new Audio('../src/caveAmbience.ogg'); 
caveAmbience.loop = true;
caveAmbience.play();

// Animate loop

function animate() {
    requestAnimationFrame(animate);

    controls.update( clock.getDelta() );

    camera.position.y = 0;

    lamp.position.set(camera.position.x, camera.position.y, camera.position.z);
	
	renderer.render( scene, camera );
}

animate();
