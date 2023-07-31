import * as THREE from 'three'

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

export class WindShape {
    constructor() {
      this.geometry = new THREE.PlaneGeometry(0.0135, 1.2);
      this.material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, blending: THREE.AdditiveBlending, opacity: 0.15, transparent: true});
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(
        THREE.MathUtils.randFloatSpread(8),
        THREE.MathUtils.randFloatSpread(5),
        THREE.MathUtils.randFloatSpread(8)
      );
      this.randomSpeed = THREE.MathUtils.randFloat(0.05, 0.5);
    }
  
    update(camera) {
      const limitPos = window.innerHeight - (this.mesh.position.y + this.geometry.parameters.height / 2);
      if (limitPos < 0) {
        this.mesh.position.y = -(window.innerHeight + this.geometry.parameters.height / 2);
      }
      this.mesh.position.y += this.randomSpeed;
      this.mesh.rotation.y = camera.rotation.y;
    }
  }