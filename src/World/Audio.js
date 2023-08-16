export class AudioManager {
  // constructor(camera, playAudio) {
  //   this.listener = new THREE.AudioListener();
  //   camera.add(this.listener);
  //   this.playAudio = playAudio;
  //   this.audioLoader = new THREE.AudioLoader();
  //   this.sound = new THREE.Audio(this.listener);
  // }

  loadSound(url) {
   // this.audioLoader.load(url, (buffer) => {
    //  this.sound.setBuffer(buffer);
      // if (this.playAudio) {
      //   this.sound.play();
      //   this.sound.setLoop(true);
      // } else {
      // }
   // });
  }
  pauseSound() {
   // this.sound.pause();
  }

  setVolume(volume) {
 //   this.sound.setVolume(volume);
  }

  playSound() {
   // this.sound.play();
  }
}
