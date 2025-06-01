// Create a Scene
const scene = new THREE.Scene();

// Create a Camera (to view the scene)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 10);

// Create a Renderer (to display everything)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a Player (Sphere)
const playerGeometry = new THREE.SphereGeometry(1, 32, 32); // Radius 1
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0);
scene.add(player);

// Create Planets
const planets = [
    { position: new THREE.Vector3(0, -5, 0), radius: 3, color: 0x0000ff }, // Normal gravity planet
    { position: new THREE.Vector3(10, 0, 0), radius: 4, color: 0xff0000 }, // Low-gravity planet
    { position: new THREE.Vector3(-10, 5, 0), radius: 5, color: 0x00ff00 } // Reversed gravity planet
];

planets.forEach((data) => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.copy(data.position);
    scene.add(planet);
});

// Create a Black Hole
const blackHoleGeometry = new THREE.SphereGeometry(5, 32, 32); // Larger than planets
const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
blackHole.position.set(15, 0, 0);
scene.add(blackHole);

// Gravity Variables
let isJumping = false;
const gravityStrength = 0.05;
const jumpStrength = 0.2;

// Apply Gravity Effect
function applyGravity() {
    let closestPlanet = null;
    let minDistance = Infinity;

    planets.forEach((planet) => {
        const distance = player.position.distanceTo(planet.position);
        if (distance < minDistance) {
            minDistance = distance;
            closestPlanet = planet;
        }
    });

    if (closestPlanet && !isJumping) {
        const direction = new THREE.Vector3();
        direction.subVectors(closestPlanet.position, player.position).normalize();
        let gravityEffect = 0.05;
        if (closestPlanet.material.color.getHex() === 0xff0000) gravityEffect = 0.02; // Low Gravity
        if (closestPlanet.material.color.getHex() === 0x00ff00) gravityEffect = -0.05; // Reverse Gravity
        player.position.addScaledVector(direction, gravityEffect);
    }
}

// Apply Black Hole Gravity
function applyBlackHoleGravity() {
    const distance = player.position.distanceTo(blackHole.position);
    if (distance < 10) { 
        const pullStrength = 0.1 * (1 / distance); 
        const direction = new THREE.Vector3();
        direction.subVectors(blackHole.position, player.position).normalize();
        player.position.addScaledVector(direction, pullStrength);
    }
}

// Jump Mechanic
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !isJumping) {
        isJumping = true;
        player.position.y += jumpStrength * 20; 
        setTimeout(() => isJumping = false, 800); 
    }
});

// Game Loop (Unified Animation Function)
function animate() {
    requestAnimationFrame(animate);
    applyGravity();
    applyBlackHoleGravity();
    renderer.render(scene, camera);
}
animate();
