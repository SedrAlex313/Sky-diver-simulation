//FBS
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})();
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { World } from './world/world';
import { Physics } from './Physics/Physics';
import { Parachute } from './Parachute/Parachute';
import { MeshStandardMaterial } from 'three';
import { WindShape } from './Physics/Windshape';

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

const m = 75; // Mass of the parachuter (in kg)
const g = 9.81; // Acceleration due to gravity (m/s^2)
const p = 1.225 // Air density (in kg/m^3)
const Cd = 0.25; // Drag coefficient
const A = 0.7; // Cross-sectional area of the parachuter (in m^2)
const k = 0.25; // Damping coefficient 
let v0; // Velocity at the time of the parachute deployment



/**
 *
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
// defining the values of html elements
const deltaTime= document.getElementById("delta-time");
const terminalVelocity= document.getElementById(
  "terminal-velocity",
);
const acceleration = document.getElementById("acceleration");
const currentXMeter = document.getElementById("current-x");
const currentYMeter = document.getElementById("current-y");

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3;

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



//Create an instance of the World class
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
  let skinnedMesh;

  let parachute; // Declare 'parachute' in the outer scope


    // Load the GLTF model
  gltfloader.load("models/skydiver.glb", (gltf) => {
   skinnedMesh = gltf.scene;

   //load the animations
   const animations = gltf.animations;
       mixer = new THREE.AnimationMixer(skinnedMesh);
       const actions = animations.map(animation => mixer.clipAction(animation));

  // Assuming you have defined the animation actions as 'actions'
actions.forEach(action => {
  action.play();
});


   //load the textures on the model
const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: skyDiverTextureBaseColor,
    roughnessMap: skyDiverTextureRoughness,
    metalnessMap: skyDiverTextureMetallic,
    normalMap: skyDiverTextureNormal,
    normalScale: new THREE.Vector2(-0.2, 0.2),
    envMapIntensity: 0.8,
    toneMapped: false,

  });




  skinnedMesh.traverse(function(child) {
    if (child.isMesh) {
      child.material = material;
    }
  });


  

 

  skinnedMesh.position.set(0, 10,0);
  // skinnedMesh.rotation.x = 30


 // ...
myscene.add(skinnedMesh);

parachute = new Parachute(myscene, skinnedMesh);
parachute.loadModel();


  })

//physics
const physics = new Physics(-9.81, 0.01);






//create an object and define the amount
const windShapes = Array.from({length: 130}, () => new WindShape());
windShapes.forEach(shape => myscene.add(shape.mesh));


 

// lighting
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
myscene.add( ambientLight );
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(-10, -300, 0);
myscene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(10, 300, 0);
myscene.add(directionalLight2);


function calculateVerticalVelocity2(deltaTime, parachuteDeployed) {
 

  let Vy;

  if (parachuteDeployed) {
    // For small Reynolds number (when parachute is deployed)
    Vy = (m * g / k) + (v0 - m * g / k) * Math.exp(-k/m * deltaTime);
   
    deltaTime = 0; // Reset the time difference after parachute deployment
  } else {
    // Use previous calculations for large Reynolds number (free fall)
    const term1 = Math.sqrt(2 * m * g / (p * Cd * A));
    const term2 = Math.sqrt((p * Cd * A * g / (2 * m)) * deltaTime);
    Vy = term1 * Math.tanh(term2);
  }
  v0 = Vy; // Save the current velocity to be used as initial velocity in next calculation

  return Vy;
}






/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let translationY = 0.00000009; // Adjust this value to control the translation amount


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
  let Vy;
  if (parachute) {
     Vy = calculateVerticalVelocity2(elapsedTime, parachute.parachuteDeployed)
  }
  else{
     Vy = calculateVerticalVelocity2(elapsedTime, false)
  }

// Update the skydiver's velocity along the y-axis using the calculated vertical velocity
if (skinnedMesh) {
   skinnedMesh.position.y -= Vy*0.0010;
   
   //update values
   currentYMeter.textContent = skinnedMesh.position.y .toFixed(2)
   terminalVelocity.textContent = Vy.toFixed(2)
   console.log(" Vy :", Vy);
  //  updateOverlay();

}

 
// Update wind effect
windShapes.forEach(shape => shape.update(camera));



    // Update controls
    controls.update()

    // Render
    renderer.render(myscene, camera)
    
   // Rest of your code...

// Listen for 'p' key press
if (parachute && !parachute.parachuteDeployed) { // Check if 'parachute' exists before accessing 'parachuteDeployed'
  window.addEventListener('keydown', function(event) {
    if(event.key === 'p') {
      parachute.deployParachute();
    }
  });
}




    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()