import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

export class World {

    constructor() 
    {
        this.mesh = null; // The skybox mesh
        this.texture = null; // The skybox texture
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