import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { FirstPersonControls } from './FirstPersonControls.js';

let cave, controls;

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const lamp = new THREE.PointLight( 0xf51b00, 0.6, 5 );
const AmbientLight = new THREE.PointLight( 0xfcd4a9, 0.05, 100 ); 
lamp.position.set( 10, 1, 2 ); 
scene.add( lamp );
scene.add( AmbientLight );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);

camera.position.z = 5;
controls = new FirstPersonControls(camera, renderer.domElement)
controls.lookSpeed = 0.15

// Instantiate a loader
const loader = new GLTFLoader();

// Load a glTF resource
loader.load(
	// resource URL
	'src/cave.glb',
	// called when the resource is loaded
	function ( gltf ) {

        cave = gltf.scene;
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

		console.log( 'An error happened' );

	}
);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    controls.update( clock.getDelta() );
	renderer.render( scene, camera );

    camera.position.y = 0

    lamp.position.set(camera.position.x, camera.position.y, camera.position.z - 2)

    console.log("z:" + camera.position.z)
}

window.addEventListener('resize', onWindowResize, false);

function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}

function onWindowResize() {

    const aspectRatio = window.innerWidth / window.innerHeight;
    camera.aspect = aspectRatio;

    controls.handleResize();
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

// Audio

const caveAmbience = new Audio('src/caveAmbience.ogg'); 
caveAmbience.loop = true;
caveAmbience.play();

animate();