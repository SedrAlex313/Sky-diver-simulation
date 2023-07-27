import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, Color } from 'three';


export class Parachute {
    constructor(scene, skydiver) {
        this.scene = scene;
        this.skydiver = skydiver;
        this.parachuteDeployed = false;
        this.gltfloader = new GLTFLoader();
        this.parachute = null;
    }
    loadModel() {
        this.gltfloader.load("models/glbParachute.glb", (gltf) => {
          this.parachute = gltf.scene;
          this.parachute.scale.set(0.1, 0.1, 0.1); // Make parachute small initially
          this.parachute.position.set(-5, 4, 0.5); // Position it on skydiver's back
          var material = new MeshStandardMaterial();

          // Set the color property to yellow
          material.color = new Color(0xffff00);
  
          // Traversing each child and applying yellow color
          this.parachute.traverse((child) => {
              if (child.isMesh) {
                  child.material = material;
              }
          });
    
          // Assures that the initial visibility of parachute is false
          this.parachute.visible = false;
          this.skydiver.add(this.parachute); // Attach the parachute to the skydiver model
        }, undefined, function ( error ) {
            console.error( error );
        });
      }

      deployParachute() {
        if (!this.parachuteDeployed && this.parachute) {
          this.parachute.scale.set(2, 2, 2); // Bring back the original size when parachute is deployed
          this.parachute.visible = true;
          this.parachuteDeployed = true; // parachute is deployed now
        }
      }

    checkStatus() {
        return this.parachuteDeployed ;
    }
    
}
