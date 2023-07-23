import * as THREE from 'three'

// Definning the variables
const m = 75; // Mass of the parachuter (in kg)
const g = new THREE.Vector3(0, -9.81, 0); // Acceleration due to gravity (m/s^2)
const p = 1.225 // Air density (in kg/m^3)
const Cd = 0.25; // Drag coefficient
const A = 0.7; // Cross-sectional area of the parachuter (in m^2)

// Variables
let time = 0; // Current time (in seconds)
let position = new THREE.Vector3(0, 0, 0); // Initial position of the skydiver (m)
let velocity = new THREE.Vector3(0, 0, 0); // Initial velocity of the skydiver (m/s)const Vy0 = 0; // Initial vertical velocity of the parachuter (in m/s)



export class Physics {
    constructor(gravity, airResistance) {
      this.gravity = gravity;
      this.airResistance = airResistance;
    }
  
calculateVerticalVelocity(deltaTime) {

const Fg = g.clone().multiplyScalar(m); // Force due to gravity

// Calculate the velocity magnitude and direction
  const velocityMagnitude = velocity.length();
  const velocityDirection = velocity.clone().normalize();

  // Calculate the force due to drag using air resistance formula (Fd = 0.5 * p * Cd * A * v^2)
  const FdMagnitude = 0.5 * p * Cd * A * velocityMagnitude * velocityMagnitude;
  const Fd = velocityDirection.clone().multiplyScalar(-FdMagnitude); // Negative direction opposes velocity

  // Calculate the net force
  const netForce = Fg.add(Fd);

  // Calculate the acceleration of the skydiver (F = ma, so a = F / m)
  const acceleration = netForce.divideScalar(m);

  // Update the velocity and position using Euler's method
  velocity.add(acceleration.clone().multiplyScalar(deltaTime));
  position.add(velocity.clone().multiplyScalar(deltaTime));

  // Increment time
 return time += deltaTime;
}

calculateVerticalVelocity2(deltaTime) {
 

const term1 = Math.sqrt(2 * m * g / (p * Cd * A));

const term2 = Math.sqrt((p * Cd * A * g / (2 * m)) * deltaTime);

const vy = term1 * Math.tanh(term2);


return vy;
}




  }
