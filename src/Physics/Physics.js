
// Definning the variable

const Cd = 0.25; // Drag coefficient
const A = 0.7; // Cross-sectional area of the parachuter (in m^2)
const k = 0.25; // Damping coefficient 
const m = 80; // Mass of the parachuter (in kg)
const g = 9.81; // Acceleration due to gravity (m/s^2)
const p = 1.225 // Air density (in kg/m^3)
let Cd_parachute = 1.2;  // Drag coefficient with parachute
let A_parachute = 25;  // Reference area with parachute (m²)
const k_p = 2 * m * g / (p * Cd_parachute * A_parachute);
let V;
let Vy;
let Vy_p;
let v0;
let t0;
 // Calculate k for parachute
 


// Variables
let time = 0; // Current time (in seconds)
let position = new THREE.Vector3(0, 0, 0); // Initial position of the skydiver (m)
let velocity = new THREE.Vector3(0, 0, 0); // Initial velocity of the skydiver (m/s)const Vy0 = 0; // Initial vertical velocity of the parachuter (in m/s)



export class Physics {
    constructor(gravity, airResistance,v0,t0) {
      this.gravity = gravity;
      this.airResistance = airResistance;
      this.v0 = v0;
      this.t0 = t0;
      
    }
  



 calculateInjurySeverity(velocity) {
  if (velocity <= safeVelocity + 10) {
    return 'Minor injuries, possible fractures.';
  } else if (velocity <= safeVelocity + 20) {
    return 'Severe injuries, likely multiple fractures and possible spinal injuries.';
  } else {
    return 'Critical injuries, likely spinal injuries and possible brain damage.';
  }
}
 checkLanding(parachuter, ground) {
  if (parachuter.y <= -30.9) {
    const messageDiv = document.getElementById('safeMessage');
   
    if (parachuter.velocity <= safeVelocity) {
      // Change color to green for safe landing
   
     
      messageDiv.style.display = 'block';
      messageDiv.textContent = `The parachuter landed safely.`;
   // Reload the page after 3 seconds
   // 3000ms = 3 seconds
    } else {
      const messageDiv = document.getElementById('injuryMessage');
 
   //   console.log('not good')
      const injurySeverity = calculateInjurySeverity(parachuter.velocity);
  
      
      messageDiv.style.display = 'block';
      messageDiv.textContent = `The parachuter sustained injuries. Severity: ${injurySeverity}`;
      // Reload the page after 3 seconds
   
    }
  }
}




 calculateVerticalVelocity2(deltaTime, parachuteDeployed) {
    if (!parachuteDeployed){
        // Use previous calculations for large Reynolds number (free fall)
        const term1 = Math.sqrt(2 * m * g / (p * Cd * A));
        const term2 = Math.sqrt((p * Cd * A * g / (2 * m)) * deltaTime);
        Vy = term1 * Math.tanh(term2);
        V = Vy;
    } else {
        if (this.t0 === undefined || this.v0 === undefined) {
            throw new Error('Parachute was deployed but initial time and velocity were not set');
        }
       
        // Use the same calculations as for large Reynolds number (free fall), but with updated Cd and A
        Vy_p = (m * g / k_p) * (1 - Math.exp(-(k_p / m) * (deltaTime - this.t0))) + this.v0 * Math.exp(-(k_p / m) * (deltaTime - t0));
        V = Vy_p;
    }
    return V;
}





  }
