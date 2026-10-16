const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let letterMesh;
let stars;
let starGeo;
let starMaterial;
let starPositions;

let lastColorChange = 0;
const colorChangeInterval = 3000;
const colors = [0xffb6c1, 0x87ceeb, 0xffd700, 0x98fb98, 0xdda0dd];

initLighting();
createName();
createParticles();

function createParticles() {
  starGeo = new THREE.BufferGeometry();
  const count = 6000;
  starPositions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    starPositions[i] = Math.random() * 600 - 300;
    starPositions[i + 1] = Math.random() * 600 - 300;
    starPositions[i + 2] = Math.random() * 600 - 300;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

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
  const positions = starGeo.attributes.position.array;

  for (let i = 1; i < positions.length; i += 3) {
    positions[i] -= 0.9;

    if (positions[i] < -300) {
      positions[i] = 300;
    }
  }

  starGeo.attributes.position.needsUpdate = true;
}

function updateParticleColor(time) {
    if (time - lastColorChange > colorChangeInterval) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        starMaterial.color.setHex(randomColor);
        lastColorChange = time;
    }
}

function createName() {
  const loader = new THREE.FontLoader();
  
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const geometry = new THREE.TextGeometry('AARON', {
      font: font,
      size: 4,
      height: 1.5,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 2
    });

    geometry.computeBoundingBox();
    const mid = geometry.boundingBox.getCenter(new THREE.Vector3());
    geometry.translate(-mid.x, -mid.y, -mid.z);

    const texture = new THREE.TextureLoader().load("Assets/Textures/wooden.jpg");
    const material = new THREE.MeshBasicMaterial({ map: texture });

    letterMesh = new THREE.Mesh(geometry, material);
    letterMesh.position.set(0, 0, -10);
    
    camera.position.z = 15;
    scene.add(letterMesh);
  });
}

function initLighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
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