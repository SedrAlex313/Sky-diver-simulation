


const g = 9.81; // Acceleration due to gravity (m/s^2)
const p = 1.225 // Air density (in kg/m^3)
let Cd = 0.7;  // Drag coefficient without parachute
let A = 1;   // Reference area without parachute (m²)
let Cd_parachute = 1.2;  // Drag coefficient with parachute
let A_parachute = 25;  // Reference area with parachute (m²)
let Vy;
let Vy_p;
const safeVelocity = 10 ;  // Maximum safe landing velocity


export class Physics {
    constructor(gravity,m) {
      this.gravity = gravity;
      this.m = m;
      
     
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
 checkLanding(velocity) {
  
   
   
    if (velocity <= safeVelocity) {
      // Change color to green for safe landing
   
      const messageDiv = document.getElementById('safeMessage');
      messageDiv.style.display = 'block';
      messageDiv.textContent = `The parachuter landed safely.`;
   // Reload the page after 3 seconds
   // 3000ms = 3 seconds
    } else {
      const messageDiv = document.getElementById('injuryMessage');
 
   //   console.log('not good')
      const injurySeverity = this.calculateInjurySeverity(velocity);
  
      
      messageDiv.style.display = 'block';
      messageDiv.textContent = `The parachuter sustained injuries. Severity: ${injurySeverity}`;
      // Reload the page after 3 seconds
   
    }
  }





 calculateVelocityFreeFall(deltaTime, parachuteDeployed) {
    if (!parachuteDeployed){
        // Use previous calculations for large Reynolds number (free fall)
        const term1 = Math.sqrt(2 * this.m * g / (p * Cd * A));
        const term2 = Math.sqrt((p * Cd * A * g / (2 * this.m)) * deltaTime);
        Vy = term1 * Math.tanh(term2);
       
        return Vy;
      }
    }
      


    calculateVelocityParachute(deltaTime,v0,t0) {
      console.log('calculateVerticalVelocity2',v0,t0)
     const  k_p=  2 * this.m * g / (p * Cd_parachute * A_parachute);
        if (t0 === undefined || v0 === undefined) {
         
            throw new Error('Parachute was deployed but initial time and velocity were not set');
        }
       
        // Use the same calculations as for large Reynolds number (free fall), but with updated Cd and A
        Vy_p = (this.m * g / k_p) * (1 - Math.exp(-(k_p / this.m) * (deltaTime - t0))) + v0 * Math.exp(-(k_p / this.m) * (deltaTime - t0));
    
        return Vy_p;
    }





  }
