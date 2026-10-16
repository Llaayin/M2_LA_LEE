const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let letterMesh;
let stars;
let starGeo;
let starMaterial;

let lastColorChange = 0;
const colorChangeInterval = 3000;
const colors = [0xffb6c1, 0x87ceeb, 0xffd700, 0x98fb98, 0xdda0dd];

initLighting();
createLetter();
createParticles();

function createParticles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    const star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  const sprite = new THREE.TextureLoader().load("Assets/Images/star.png");
  
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
    transparent: true
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  stars.position.y -= 0.9;

  if (stars.position.y < -300) {
    stars.position.y = 300;
  }
}

function updateParticleColor(time) {
    if (time - lastColorChange > colorChangeInterval) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        starMaterial.color.setHex(randomColor);
        lastColorChange = time;
    }
}

function createLetter() {
  const texture = new THREE.TextureLoader().load("Assets/Textures/wooden.jpg");
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const shape = new THREE.Shape();
  
  shape.moveTo(0, 0);
  shape.lineTo(5, 0);
  shape.lineTo(2.5, 10);
  shape.lineTo(0, 0);

  const hole = new THREE.Path();
  hole.moveTo(1.5, 2);
  hole.lineTo(3.5, 2);
  hole.lineTo(2.5, 6);
  hole.lineTo(1.5, 2);
  shape.holes.push(hole);

  const extrudeSettings = {
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  letterMesh = new THREE.Mesh(geometry, material);

  letterMesh.position.set(-2.5, -5, -5);
  letterMesh.rotation.y = 0.5;

  camera.position.z = 15;

  scene.add(letterMesh);
}

function initLighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);
}

function animate(time) {
  requestAnimationFrame(animate);

  animateParticles();
  updateParticleColor(time);

  if (letterMesh) {
    letterMesh.rotation.x += 0.005;
    letterMesh.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}

animate();