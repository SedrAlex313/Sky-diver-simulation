export class Parachute {
    constructor(model, deployed) {
        this.model = model;                           
        this.deployed = deployed;
    }

    toggleDeployment() {
       this.deployed = !this.deployed;
    }

    checkStatus() {
        return this.deployed ? "Deployed" : "Not deployed";
    }
    
}
