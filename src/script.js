import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { World } from './world/world';
import { Physics } from './Physics/Physics';

var textureLoader = new THREE.TextureLoader();

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


// Definning the variables
const m = 75; // Mass of the parachuter (in kg)
const g = new THREE.Vector3(0, -9.81, 0); // Acceleration due to gravity (m/s^2)
const p = 1.225 // Air density (in kg/m^3)
const Cd = 0.25; // Drag coefficient
const A = 0.7; // Cross-sectional area of the parachuter (in m^2)


/**
 *
 * Base
 */
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
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 20;

myscene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
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

// Create an instance of the World class
const world = new World();

world.loadTexture('./sky-texture.jpg');
world.createMesh(30, 240, 240); // Size of the skybox

myscene.add(world.mesh);

/**
  Skydiver_model
 **/
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // use a full url path
 
const gltfloader = new GLTFLoader();
gltfloader.setDRACOLoader(dracoLoader);

let mixer = null

  // Load the GLTF model
  let skydiver;

    // Load the GLTF model
  gltfloader.load("models/astronau1t.glb", (gltf) => {
  skydiver= gltf.scene



 
// Set the initial position of the skydiver using a vector (m)


 skydiver.position.set(0, 10,0);

skydiver.rotation.x-=80;
  

  

  myscene.add(skydiver);

  })
//physics
const physics = new Physics(-9.81, 0.01);



 

// lighting
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
myscene.add( ambientLight );
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(-0.15, -100, 0);
myscene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(0.15, 100, 0);
myscene.add(directionalLight2);



function calculateVerticalVelocity2(deltaTime) {
 

  const term1 = Math.sqrt(2 * m * g / (p * Cd * A));
  
  const term2 = Math.sqrt((p * Cd * A * g / (2 * m)) * deltaTime);
  
  const vy = term1 * Math.tanh(term2);
  
  
  return vy;
  }






/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let translationY = 0.0009; // Adjust this value to control the translation amount

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime   - previousTime;
  previousTime = elapsedTime
 
 if(mixer !==null)
 {
  mixer.update(deltaTime)
 }
 
  

  // Calculate the vertical velocity at the current time
  const Vy = calculateVerticalVelocity2(elapsedTime);

// Update the skydiver's velocity along the y-axis using the calculated vertical velocity
if (skydiver) {
  skydiver.position.y -= Vy*0.0010;
  console.log(" skydiver.position.y:", skydiver.position.y);
}

 
   

    // Update controls
    controls.update()

    // Render
    renderer.render(myscene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()