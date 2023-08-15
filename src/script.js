//FBS
(function () {
  var script = document.createElement("script");
  script.onload = function () {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "//rawgit.com/mrdoob/stats.js/master/build/stats.min.js";
  document.head.appendChild(script);
})();
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { World } from "./world/world";
import { Physics } from "./Physics/Physics";
import { Parachute } from "./Parachute/Parachute";
import { MeshStandardMaterial } from "three";
import { WindShape } from "./Physics/Windshape";
import { ThirdPersonPerspective } from "./World/ThirdPersonPerspective";
import { Camera } from "./World/Camera";
import { AudioManager } from "./World/Audio";
import { GuiController } from "./World/Gui";
import { gui } from "dat.gui";
var textureLoader = new THREE.TextureLoader();

// Define the paths to the WebP textures
const skyDiverTextureBaseColor = textureLoader.load(
  "texture/skydiver_BaseColor.webp"
);
const skyDiverTextureRoughness = textureLoader.load(
  "texture/skydiver_Roughness.webp"
);
const skyDiverTextureMetallic = textureLoader.load(
  "texture/skydiver_Metallic.webp"
);
const skyDiverTextureNormal = textureLoader.load(
  "texture/skydiver_Normal.webp"
);
const skyDiverTextureClothes = textureLoader.load(
  "texture/skydiver_Clothes.webp"
);
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
const canvas = document.querySelector("canvas.webgl");
// defining the values of html elements
const deltaTime = document.getElementById("delta-time");
const terminalVelocity = document.getElementById("terminal-velocity");
const acceleration = document.getElementById("acceleration");
const currentXMeter = document.getElementById("current-x");
const currentYMeter = document.getElementById("current-y");

// Scene
const myscene = new THREE.Scene();

const parameters = {
  length: 130,
  m: 80,
  volume: 0.5,
  deployParachute: false,
};
const guiController = new GuiController(parameters);
let volume = parameters.volume;
let dec = 0.1;
let m = parameters.m; // Mass of the parachuter (in kg)
const g = 9.81; // Acceleration due to gravity (m/s^2)
const p = 1.225; // Air density (in kg/m^3)
const k = 0.25; // Damping coefficient
let v0; // Velocity at the time of the parachute deployment
let Cd = 0.7; // Drag coefficient without parachute
let A = 1; // Reference area without parachute (m²)
let Cd_parachute = 1.2; // Drag coefficient with parachute
let A_parachute = 25; // Reference area with parachute (m²)
let Z;
let V;
let Vy;
let Vy_p;

/**
 * Sizes
 */
window.addEventListener("keydown", function (event) {
  if (event.code === "KeyT") {
    currentCamera = thirdPersonPerspectiveCamera;
  } else if (event.code === "KeyC") {
    currentCamera = camera;
  }
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
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
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Create an instance of the World class
const world = new World();

world.loadTexture("./sky-texture.jpg");
world.createMesh(30, 240, 240); // Size of the skybox

myscene.add(world.mesh);

/**
  Skydiver_model
 **/
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
); // use a full url path

const gltfloader = new GLTFLoader();
gltfloader.setDRACOLoader(dracoLoader);

let mixer = null;
let uniforms;
// Load the GLTF model
let skinnedMesh;
// Define the ground and parachuter
let ground = { x: 100, y: 100, width: 1000, height: 1000 }; // Adjust to match your ground size and position
let parachuter = { x: 500, y: 1000, width: 50, height: 50, velocity: 0 }; // Adjust to match your parachute size and initial position

let parachute; // Declare 'parachute' in the outer scope

// Load the GLTF model
gltfloader.load("models/skydiver.glb", (gltf) => {
  skinnedMesh = gltf.scene;

  //load the animations
  const animations = gltf.animations;
  mixer = new THREE.AnimationMixer(skinnedMesh);
  const actions = animations.map((animation) => mixer.clipAction(animation));

  // Assuming you have defined the animation actions as 'actions'
  actions.forEach((action) => {
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
      shader.uniforms.uClothes = { value: skyDiverTextureClothes };
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
    },
  });

  skinnedMesh.traverse(function (child) {
    if (child.isMesh) {
      child.material = material;
    }
  });

  skinnedMesh.position.set(0, 10, 0);
  // skinnedMesh.rotation.x = 30

  // ...
  myscene.add(skinnedMesh);

  parachute = new Parachute(myscene, skinnedMesh);
  parachute.loadModel();
});

//physics
const physics = new Physics(-9.81, 0.01);

//create an object and define the amount
let lengthWs = parameters.length;
const windShapes = Array.from({ length: lengthWs }, () => new WindShape());
windShapes.forEach((shape) => myscene.add(shape.mesh));

// lighting
var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
myscene.add(ambientLight);
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(-10, -300, 0);
myscene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(10, 300, 0);
myscene.add(directionalLight2);

// function collision(a, b) {
//   return a.x < b.x + b.width &&
//          a.x + a.width > b.x &&
//          a.y < b.y + b.height &&
//          a.y + a.height > b.y;
// }

// Define safeVelocity and calculateInjurySeverity function
const safeVelocity = 10; // Maximum safe landing velocity

function calculateInjurySeverity(velocity) {
  if (velocity <= safeVelocity + 10) {
    return "Minor injuries, possible fractures.";
  } else if (velocity <= safeVelocity + 20) {
    return "Severe injuries, likely multiple fractures and possible spinal injuries.";
  } else {
    return "Critical injuries, likely spinal injuries and possible brain damage.";
  }
}

// Define checkLanding function
function checkLanding(parachuter, ground) {
  if (parachuter.y <= -32) {
    const messageDiv = document.getElementById("safeMessage");

    if (parachuter.velocity <= safeVelocity) {
      // Change color to green for safe landing

      messageDiv.style.display = "block";
      messageDiv.textContent = `The parachuter landed safely.`;
      // Reload the page after 3 seconds
      // 3000ms = 3 seconds
    } else {
      const messageDiv = document.getElementById("injuryMessage");

      //   console.log('not good')
      const injurySeverity = calculateInjurySeverity(parachuter.velocity);

      messageDiv.style.display = "block";
      messageDiv.textContent = `The parachuter sustained injuries. Severity: ${injurySeverity}`;
      // Reload the page after 3 seconds
    }
  }
}

function calculateVerticalVelocity2(deltaTime, parachuteDeployed, min) {
  if (!parachuteDeployed) {
    // Use previous calculations for large Reynolds number (free fall)
    const term1 = Math.sqrt((2 * m * g) / (p * Cd * A));
    const term2 = Math.sqrt(((p * Cd * A * g) / (2 * m)) * deltaTime);
    Vy = term1 * Math.tanh(term2);

    V = Vy;
  }

  // Use the same calculations as for large Reynolds number (free fall), but with updated Cd and A
  const term1_p = Math.sqrt((2 * m * g) / (p * Cd_parachute * A_parachute));
  const term2_p = Math.sqrt(
    ((p * Cd_parachute * A_parachute * g) / (2 * m)) * deltaTime
  );
  Vy_p = term1_p * Math.tanh(term2_p);

  if (parachuteDeployed) {
    if (V <= Vy_p) {
      Z = 3;
      return Vy_p;
    } else {
      if (V <= 10) {
        V -= 0.005;
        Z = 4;
      } else {
        Z = 2;
        V -= min;
      }

      return V;
    }
  } else {
    Z = 1;
    return Vy;
  }
}

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
const clock = new THREE.Clock();
let previousTime = 0;
let translationY = 0.00000009; // Adjust this value to control the translation amount
let VFinalGui;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  m = guiController.parameters.m;
  lengthWs = guiController.parameters.length;
  volume = guiController.parameters.volume;
  naturalAudio.setVolume(volume)
  parachuteAudio.setVolume(volume)
  parachuteLandingAudio.setVolume(volume)
  if (mixer !== null) {
    mixer.update(deltaTime);
  }

  // Calculate the vertical velocity at the current time

  let VFinal;
  VFinalGui = VFinal;
  if (parachute && parachute.parachuteDeployed) {
    if (dec >= 0) {
      dec -= 0.00005;
    }

    VFinal = calculateVerticalVelocity2(
      elapsedTime,
      parachute.parachuteDeployed,
      dec
    );
  } else {
    VFinal = calculateVerticalVelocity2(elapsedTime, false, 0);
  }

  // Update the skydiver's velocity along the y-axis using the calculated vertical velocity
  if (skinnedMesh) {
    skinnedMesh.position.y -= VFinal * 0.001;
    if (currentCamera === thirdPersonPerspectiveCamera) {
      thirdPersonPerspectiveCamera.position.y -= VFinal * 0.001;
    }

    // Update the velocity and position of the parachuter as it is falling
    parachuter.y = skinnedMesh.position.y;
    parachuter.velocity = VFinal;
    // Check if the parachuter has landed and log the result
    checkLanding(parachuter, ground);
    //update values
    currentYMeter.textContent = skinnedMesh.position.y.toFixed(2);
    terminalVelocity.textContent = VFinal.toFixed(2);
    console.log(" Z :", Z, "dec:", dec);

    //  updateOverlay();
  }

  // Update wind effect
  windShapes.forEach((shape) => shape.update(thirdPersonPerspectiveCamera));

  if (uniforms) {
    uniforms.uTime.value = clock.getElapsedTime();
  }

  // // Update controls
  controls.update();

  // Render
  renderer.render(myscene, currentCamera);

  // Rest of your code...

  // Listen for 'p' key press
  if (parachute && !parachute.parachuteDeployed) {
    // Check if 'parachute' exists before accessing 'parachuteDeployed'
    window.addEventListener("keydown", function (event) {
      if (event.key === "p") {
        parachute.deployParachute(m, g, p, Cd_parachute, A_parachute, VFinal);
        playParachuteS();
        // console.log( parachute.calculateTension(m, g, p, Cd_parachute, A_parachute, VFinal));
      }
    });
  }

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

guiController.addParachuteButton(function () {
  parachute.deployParachute(m, g, p, Cd_parachute, A_parachute, VFinalGui);
  playParachuteS();
});

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
