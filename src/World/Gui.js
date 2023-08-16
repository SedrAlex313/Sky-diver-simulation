import * as dat from "dat.gui";
export class GuiController {
  constructor(parameters) {
    this.gui = new dat.GUI({ width: 350 });

    this.parameters = parameters;
    this.addMassControl();
    this.addLengthWS();
    this.addVolume();
  }

  addMassControl() {
    this.gui
      .add(this.parameters, "m")
      .min(60)
      .max(90)
      .step(10)
      .name("Skydiver Mass");
  }

  addParachuteButton(deployParachute) {
    this.gui
      .add(this.parameters, "deployParachute")
      .name("Deploy Parachute")
      .onChange(function (value) {
        if (value) {
          deployParachute();
          //   playSound();
          // this.parameters.deployParachute = true;
        } else {
        }
      })
      .listen();
  }
  addLengthWS() {
    this.gui
      .add(this.parameters, "length")
      .min(130)
      .max(200)
      .step(10)
      .name("Length WS");
  }
  addVolume() {
    this.gui
      .add(this.parameters, "volume")
      .min(0)
      .max(1)
      .step(0.1)
      .name("Volume");
  }

}
