import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let postac, mixer, scena; // Declare all used variables globally
const clock = new THREE.Clock();

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xff0000, 1, 50); // color, near, far
scene.background = new THREE.Color(0xff0000);
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 2);
camera.lookAt(0, 2, 0);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);


const loader = new GLTFLoader();

// Load character
loader.load('Character/1/1.gltf', function (gltf) {
    postac = gltf.scene;

    // Przejdź przez wszystkie obiekty i dostosuj materiały
    postac.traverse((node) => {
        if (node.isMesh) {
            node.material = new THREE.MeshStandardMaterial({
                color: node.material.color,
                map: node.material.map || null,
                metalness: 0.5,
                roughness: 0.5
            });
            node.material.needsUpdate = true;
        }
    });

    scene.add(postac);

    if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(postac);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }
});


// Load environment
loader.load('Enviroment/1/scene.gltf', function (gltf) {
    scena = gltf.scene;
    scene.add(scena);

}, undefined, function (error) {
    console.error('Environment load error:', error);
});
// Ambient light for base lighting
const ambientLight = new THREE.AmbientLight(0x000000, 0.4); // Soft white light
scene.add(ambientLight);


const hemisphereLight = new THREE.HemisphereLight(0x7a7a7a, 0xffffff, 0.2);
hemisphereLight.position.set(0, 2, 0);
scene.add(hemisphereLight);

const point = new THREE.PointLight(0xffffff, 5, 200);
point.position.set(0, 0, 0.7);
point.castShadow = true; // Enable shadows for the point light
scene.add(point);
// Animation loop
function animate() {
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    if (postac) {
        postac.rotation.y += 0.005; // optional rotation
    }

    renderer.render(scene, camera);
}
