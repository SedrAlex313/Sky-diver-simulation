
// Definning the variables
const m = 75; // Mass of the parachuter (in kg)
const g = -9.81; // Acceleration due to gravity (m/s^2)
const p = 1.225 // Air density (in kg/m^3)
const Cd = 0.25; // Drag coefficient
const A = 0.7; // Cross-sectional area of the parachuter (in m^2)
const k = 0.25; // Damping coefficient 
let v0; // Velocity at the time of the parachute deployment

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

calculateVerticalVelocity2(deltaTime, parachuteDeployed) {
 

  let Vy;

  if (parachuteDeployed) {
    // For small Reynolds number (when parachute is deployed)
    Vy = (m * g / k) + (v0 - m * g / k) * Math.exp(-k/m * deltaTime);
   
    deltaTime = 0; // Reset the time difference after parachute deployment
  } else {
    // Use previous calculations for large Reynolds number (free fall)
    const term1 = Math.sqrt(2 * m * g / (p * Cd * A));
    const term2 = Math.sqrt((p * Cd * A * g / (2 * m)) * deltaTime);
    Vy = term1 * Math.tanh(term2);
  }
  v0 = Vy; // Save the current velocity to be used as initial velocity in next calculation

  return Vy;
}




  }
