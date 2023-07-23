import * as THREE from 'three'
Draco


export class Skydiver {
        constructor() {
          this.textureLoader = new THREE.TextureLoader();
          this.gltfloader = new GLTFLoader();
          this.gltfloader.setDRACOLoader(new DRACOLoader());

        }
      
        loadModel() {
        const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      
        const skyDiverTextureBaseColor = this.textureLoader.load("../texture/skydiver_BaseColor.webp");
        const skyDiverTextureRoughness = this.textureLoader.load("../texture/skydiver_Roughness.webp");
        const skyDiverTextureMetallic = this.textureLoader.load("../texture/skydiver_Metallic.webp");
        const skyDiverTextureNormal = this.textureLoader.load("../texture/skydiver_Normal.webp");
        const skyDiverTextureClothes = this.textureLoader.load("../texture/skydiver_Clothes.webp");
          skyDiverTextureBaseColor.flipY = false;
          skyDiverTextureRoughness.flipY = false;
          skyDiverTextureMetallic.flipY = false;
          skyDiverTextureNormal.flipY = false;
          skyDiverTextureClothes.flipY = false;
      
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
      
        this.gltfloader.load("../models/skydiver.glb", (gltf) => {
            const model = gltf.scene;
            const skydiver = model.getObjectByName('skydiver_2');
            const skinnedMesh = new THREE.SkinnedMesh(skydiver.geometry, material);
            skinnedMesh.bind(skydiver.skeleton);
            this.myscene.add(skinnedMesh);
          });

        }
      }
      



  
