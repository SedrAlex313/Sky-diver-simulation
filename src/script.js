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
import { ThirdPersonPerspective } from "./World/ThirdPersonPerspective";
import { WindShape } from './Physics/Windshape';
import { Camera } from "./World/Camera";
import { AudioManager } from "./World/Audio";
import { GuiController } from "./World/Gui";
//import { gui } from "dat.gui";

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





/**
 *
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

const velocityOnY= document.getElementById(
  "velocityOnY",
);
const velocityOnX= document.getElementById(
  "velocityOnX",
);
const velocityOnZ= document.getElementById(
  "velocityOnZ",
);
window.addEventListener("keydown", function (event) {
  if (event.key === 't') {
    currentCamera = thirdPersonPerspectiveCamera;
    console.log('thirdPersonPerspectiveCamera ');
  } else if (event.key === 'c') {
    console.log('currentCamera ');
    currentCamera = camera;
  }
});
const currentYMeter = document.getElementById("current-y");

// Scene
const myscene = new THREE.Scene()


const parameters = {
  length: 130,
  m: 80,
  volume: 0.5,
  deployParachute: false,
};
// Define safeVelocity and calculateInjurySeverity function
const guiController = new GuiController(parameters);
let volume = parameters.volume;
let m = parameters.m; // Mass of the parachuter (in kg)  
let v0, t0;
//#region // Calculate k for parachute   
                                                                                
// initialize variables for x, and z directions
let velocityX = 10;   //initial velocity of the skydiver moving along x-axis
let velocityz = 1000;   //initial velocity of the skydiver moving along z-axis which is taken from plane
let windForceX = 0;  // wind force along x-axis
let windForceZ = 0;  //wind force along z-axis
let windSpeed = 6.26; // wind speed in m/s
let angle = Math.random() * 2 * Math.PI; // random wind direction
 // mass of skydiver
let windCoefficient = 1; //wind coefficient, adjust to fit your simulation needs
 // Mass of the parachuter (in kg)
const g = 9.81; // Acceleration due to gravity (m/s^2)
const p = 1.225 // Air density (in kg/m^3)
let Cd_parachute = 1.2;  // Drag coefficient with parachute
let A_parachute = 25;  // Reference area with parachute (m²)
const physics= new Physics(g,m);                                                                                                     
let velocityZ =  velocityz/40;
//#endregion 

/**
 * Sizes
 */


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener("resize", () => {
  if (currentCamera === camera) {
    classCamera.updateSize();
  }
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const thirdPersonPerspective = new ThirdPersonPerspective(sizes, canvas);
const thirdPersonPerspectiveCamera = thirdPersonPerspective.getCamera();

const classCamera = new Camera(sizes, canvas);
const camera = classCamera.getCamera();

let currentCamera = thirdPersonPerspectiveCamera;


myscene.add(currentCamera);

const controls = classCamera.getControls();





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
let uniforms;
  // Load the GLTF model
  let skinnedMesh;
// Define the ground and parachuter
let ground = {x: 100, y: 100, width: 1000, height: 1000}; // Adjust to match your ground size and position
let parachuter = {x: 500, y: 1000, width: 50, height: 50, velocity: 0}; // Adjust to match your parachute size and initial position

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
    onBeforeCompile: (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uClothes = { value : skyDiverTextureClothes };
      uniforms = shader.uniforms;
  
      shader.vertexShader = `
        uniform float uTime;
        uniform sampler2D uClothes;
        ${shader.vertexShader}
      `;
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `
        vec3 clothesTexture = vec3(texture2D(uClothes, vUv));
        float circleTime = 2.0;
        float amplitude = 30.0;
        float circleTimeParam = mod(uTime, circleTime);
        vec3 transformed = vec3( position );
        transformed.y += min(clothesTexture.y * sin( circleTimeParam * amplitude * (PI  / circleTime)) * 0.025, 0.5);
        `
      );
    }
  });




  skinnedMesh.traverse(function(child) {
    if (child.isMesh) {
      child.material = material;
    }
  });


  

 

  skinnedMesh.position.set(0, 10,-100);
  skinnedMesh.scale.set(2, 2,2);
  // skinnedMesh.rotation.x = 30


 // ...
myscene.add(skinnedMesh);

parachute = new Parachute(myscene, skinnedMesh);
parachute.loadModel();


  })

//physics







//create an object and define the amount
let lengthWs = parameters.length;
const windShapes = Array.from({ length: lengthWs }, () => new WindShape());
windShapes.forEach((shape) => myscene.add(shape.mesh));


 

// lighting
var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
myscene.add( ambientLight );
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(-10, -300, 0);
myscene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(10, 300, 0);
myscene.add(directionalLight2);


/* Audioooooooooooooooooo */

const naturalAudio = new AudioManager(camera, true);
naturalAudio.loadSound("sounds/Natural.mp3");

const parachuteAudio = new AudioManager(camera, false);
parachuteAudio.loadSound("sounds/Parachute.mp3");

const parachuteLandingAudio = new AudioManager(camera, false);
parachuteLandingAudio.loadSound("sounds/Parachute landing.mp3");

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let translationY = 0.00000009; // Adjust this value to control the translation amount
let VFinalGui;

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime   - previousTime;
  previousTime = elapsedTime
 
  m = guiController.parameters.m;
  lengthWs = guiController.parameters.length;
  volume = guiController.parameters.volume;
  naturalAudio.setVolume(volume)
  parachuteAudio.setVolume(volume)
  parachuteLandingAudio.setVolume(volume)

 if(mixer !==null)
 {
  mixer.update(deltaTime)
 }
 


  // Calculate the vertical velocity at the current time
  
  
  let VFinal;

// Update the skydiver's velocity along the y-axis using the calculated vertical velocity
if (skinnedMesh) {
  
  // Calculate the wind velocity components and wind forces.
  let windVelocityX = windSpeed * Math.cos(angle);
  let windVelocityZ = windSpeed * Math.sin(angle);
  windForceX = windCoefficient * windVelocityX;
  windForceZ = windCoefficient * windVelocityZ;
 
  // Update the velocity along x and z axis.
     // Update the velocity along x and z axis.
     velocityX += windForceX / m * deltaTime;
     velocityZ += windForceZ / m * deltaTime;

  // Now update the position of the skydiver.
  skinnedMesh.position.x += 0.007*velocityX;
  skinnedMesh.position.z += 0.007*velocityZ;
//console.log('velocityX', skinnedMesh.position.z,'velocityZ', skinnedMesh.position.x, skinnedMesh.position.y);
  
  if (parachute && parachute.parachuteDeployed) {
  
    VFinal = physics.calculateVelocityParachute(elapsedTime, v0, t0);
  }
  else{
    VFinal = physics.calculateVelocityFreeFall(elapsedTime, false);
  }
   skinnedMesh.position.y -= VFinal*0.007;
   if (currentCamera === thirdPersonPerspectiveCamera) {
    thirdPersonPerspectiveCamera.position.y -= VFinal * 0.001;
  }

   if (skinnedMesh.position.y <= -311) {
    // Stop the simulation
    return;
  }
  parachuter.y = skinnedMesh.position.y;
  parachuter.velocity = VFinal;
  // Check if the parachuter has landed and log the result

  
   // Update the velocity and position of the parachuter as it is falling
   let distance = world.mesh.position.distanceTo(skinnedMesh.position);
    if (distance > 10*(world.mesh.geometry.parameters.radius+0.2)) {
       skinnedMesh.position.copy(world.lastKnownPosition);
      physics.checkLanding(VFinal);
     
     } else {
       world.lastKnownPosition.copy(skinnedMesh.position);
     
     } 

  
  
   //update values
   currentYMeter.textContent = skinnedMesh.position.y .toFixed(2)
   velocityOnY.textContent = VFinal.toFixed(2)
   velocityOnX.textContent = velocityX.toFixed(2)
  velocityOnZ.textContent = velocityZ.toFixed(2)
   
  //  updateOverlay();

}

 
// Update wind effect
windShapes.forEach(shape => shape.update(camera));

if (uniforms) {
  uniforms.uTime.value = clock.getElapsedTime()
}

controls.update();

// Render
renderer.render(myscene, currentCamera);
    
   // Rest of your code...

// Listen for 'p' key press
if (parachute && !parachute.parachuteDeployed) { // Check if 'parachute' exists before accessing 'parachuteDeployed'
  window.addEventListener('keydown', function(event) {
    if(event.key === 'p') {
          // Capture the current time and velocity when the parachute is deployed

          t0 = elapsedTime;
          v0 = VFinal;
       
    parachute.deployParachute(m, g, p, Cd_parachute, A_parachute, VFinal);
   playParachuteS();
   // console.log( parachute.calculateTension(m, g, p, Cd_parachute, A_parachute, VFinal));
    }
  });
}



    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// guiController.addParachuteButton(function () {
//   parachute.deployParachute(m, g, p, Cd_parachute, A_parachute, VFinalGui);
//   playParachuteS();
// });

function playParachuteS() {
  if (parachute.parachuteDeployed) {
    naturalAudio.pauseSound();
    parachuteAudio.playSound();
    setTimeout(() => {
      parachuteLandingAudio.playSound(),
        parachuteLandingAudio.sound.setLoop(true);
    }, 2000);
  }
}








