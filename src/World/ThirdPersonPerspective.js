import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class ThirdPersonPerspective {
  constructor(sizes, canvas) {
    this.sizes = sizes;
    this.canvas = canvas;

    this.camera = new THREE.PerspectiveCamera(
      70, //field of view
      sizes.width / sizes.height, // aspect ratio
      0.1, //near
      10000 //far
    );
    // this.camera.rotateX(-10);
    // this.camera.position.x = this.position.x;
    // this.camera.position.y = this.position.y;
    // this.camera.position.z = this.position.z;
    this.camera.position.set(0, 14, 0);
    this.camera.lookAt(0, 0, 2);
  }

  updateSize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
  }

  getCamera() {
    return this.camera;
  }

  getControls() {
    return this.controls;
  }
}
