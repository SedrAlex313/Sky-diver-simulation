import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const myscene = new THREE.Scene()




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.01, 100)
camera.position.x = -1
camera.position.y = -1
camera.position.z = 5;

myscene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.keys = {
	LEFT: 'KeyA', //left arrow
	UP: 'KeyW', // up arrow
	RIGHT: 'KeyD', // right arrow
	BOTTOM: 'KeyS' // down arrow
}
controls.listenToKeyEvents(window);
controls.keyPanSpeed=300;
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Create the sphere geometry
var radius = 15; // Adjust the radius as desired
var widthSegments = 60; // Adjust the number of segments for the sphere
var heightSegments = 40;
var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

// Create the sky material
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load("/sky-texture.jpg"); // Replace with the path to your sky texture
var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });

// Create the sky sphere mesh
var sphere = new THREE.Mesh(geometry, material);


// Add the sky sphere to the scene
myscene.add(sphere);

/**
 * Models
 */

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // use a full url path
 
// Define the paths to the WebP textures
const skyDiverTextureBaseColor = textureLoader.load("texture/skydiver_BaseColor.webp");
const skyDiverTextureRoughness = textureLoader.load("texture/skydiver_Roughness.webp");
const skyDiverTextureMetallic = textureLoader.load("texture/skydiver_Metallic.webp");
const skyDiverTextureNormal = textureLoader.load("texture/skydiver_Normal.webp");
const skyDiverTextureClothes = textureLoader.load("texture/skydiver_Clothes.webp");
skyDiverTextureBaseColor.flipY = false;
skyDiverTextureRoughness.flipY = false;
skyDiverTextureMetallic.flipY = false;
skyDiverTextureNormal.flipY = false;
skyDiverTextureClothes.flipY = false;


   

  

const gltfloader = new GLTFLoader();
gltfloader.setDRACOLoader(dracoLoader);


let skydiver;
  // Load the GLTF model
  gltfloader.load("models/astronau1t.glb", (gltf) => {
  skydiver= gltf.scene



 
  gltf.scene.position.set(0, 0,0);
  gltf.scene.rotation.x=90;
  
  myscene.add(gltf.scene);

  })

// Camera Position

// lighting
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
myscene.add( ambientLight );
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(-0.15, 2, 0);
myscene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(0.15, -2, 0);
myscene.add(directionalLight2);










/**
 * Animate
 */
const clock = new THREE.Clock()

// ...

// Definning the variables
const m = 75; // Mass of the parachuter (in kg)
const g = 9.8; // Acceleration due to gravity (in m/s^2)
const p = 1.2; // Air density (in kg/m^3)
const Cd = 0.75; // Drag coefficient
const A = 2.5; // Cross-sectional area of the parachuter (in m^2)

// Setting the initial conditions
const Vy0 = 0; // Initial vertical velocity of the parachuter (in m/s)

// Calculating the vertical velocity at each time step
function calculateVerticalVelocity(t) {
  const term1 = Math.sqrt(2 * m * g / (p * Cd * A));
  const term2 = Math.sqrt((p * Cd * A * g / (2 * m)) * t);
  const vy = term1 * Math.tanh(term2);

  return vy;
}







const tick = () => {
  const elapsedTime = clock.getElapsedTime();
   // Store the delta time in a variable

  // Calculating the vertical velocity at the current time
  const Vy = calculateVerticalVelocity(elapsedTime);
//x+=1;
if (skydiver) {

  
  
    // Update the position of the skydiver along the x-axis
   skydiver.position.y -= Vy*0.0010;
   console.log(" skydiver.position.y:", skydiver.position.y);
  
 

 
}


  // Update controls
  controls.update();

  // Render
  renderer.render(myscene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick();
