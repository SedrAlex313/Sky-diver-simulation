import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera {
  constructor(sizes, canvas, position = { x: 0, y: 0, z: 3 }) {
    this.sizes = sizes;
    this.canvas = canvas;
    this.position = position;

    this.camera = new THREE.PerspectiveCamera(
      70, //field of view
      sizes.width / sizes.height, // aspect ratio
      0.1, //near
      10000 //far
    );
    this.camera.position.x = this.position.x;
    this.camera.position.y = this.position.y;
    this.camera.position.z = this.position.z;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.keys = {
      LEFT: "KeyA", //left arrow
      UP: "KeyW", // up arrow
      RIGHT: "KeyD", // right arrow
      BOTTOM: "KeyS", // down arrow
    };
    this.controls.listenToKeyEvents(window);
    this.controls.keyPanSpeed = 300;
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
