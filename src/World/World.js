import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

export class World {

    constructor() 
    {
        this.mesh = null; // The skybox mesh
        this.texture = null; // The skybox texture
        this.lastKnownPosition = new THREE.Vector3(); // The last known position inside the sphere
        this.lastKnownCameraPosition = new THREE.Vector3(); // The last known position of the camera inside the sphere
    }
     loadTexture(texturePath) {
            const loader = new THREE.TextureLoader();
            this.texture = loader.load(texturePath);
          }

        createMesh(radius, width, height) {
            const geometry = new THREE.SphereGeometry(radius, width, height);
            const material = new THREE.MeshBasicMaterial
            ({ 
                toneMapped: false,
                map: this.texture, 
                side: THREE.BackSide 
             });
            this.mesh = new THREE.Mesh(geometry, material);
            scene.add(this.mesh); // Add the skybox mesh to the scene

          }
        
          

    update() {
  }
}