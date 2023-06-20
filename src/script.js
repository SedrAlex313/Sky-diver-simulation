import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// const skyDiverTextureBaseColor = textureLoader.load('texture/skydiver_BaseColor.webp');
// const skyDiverTextureMetallic = textureLoader.load('texture/skydiver_Metallic.webp')
// const skyDiverTextureNormal = textureLoader.load('texture/skydiver_Normal.webp');
// const skyDiverTextureRoughness = textureLoader.load(' texture/skydiver_Roughness.webp"');




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
camera.position.x = -1
camera.position.y = -1
camera.position.z = 5;

myscene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
    
 const texturePaths = [
    "texture/skydiver_BaseColor.webp",
    "texture/skydiver_Metallic.webp",
    "texture/skydiver_Normal.webp",
    "texture/skydiver_Clothes.webp",
  ];
  
   

  

const gltfloader = new GLTFLoader();
gltfloader.setDRACOLoader(dracoLoader);

// Load the WebP textures
  const textures = texturePaths.map((path) => textureLoader.load(path));

  // Set the flipY property to false for each loaded texture
  textures.forEach((texture) => (texture.flipY = false));

  // Load the GLTF model
  gltfloader.load("models/skydiver.glb", (gltf) => {
    const { scene, nodes } = gltf;
console.log(gltf);
    // Apply textures to materials
    if (nodes) {

    nodes.forEach((node) => {
      if (node.material) {
        node.material.map = textures[0]; // Set the base color texture
        // node.material.roughnessMap = textures[1];
        // node.material.metalnessMap = textures[2];
        // node.material.normalMap = textures[3];
        // node.material.map = textures[4];
       
      }
    })
}
      myscene.add(scene)

   });
   
    

// Camera Position

// lighting
var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.2 );
myscene.add( ambientLight );
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(-0.15, -2, 0);
myscene.add(directionalLight)









/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

  
    // Update controls
    controls.update()

    // Render
    renderer.render(myscene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()