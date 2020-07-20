var container, stats;
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xcce0ff);
scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

container = document.createElement('div');
document.body.appendChild(container);

var renderer = new THREE.WebGLRenderer({ antialias: true });
container.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function () {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

//camera position
camera.position.z = 5;

//stats
stats = new Stats();
container.appendChild(stats.dom);

//render to the page
var render = function () {
	renderer.render(scene, camera);
};

var update = function () {
	stats.update();
};

var animate = function () {
	requestAnimationFrame(animate);
	update();
	render();
};

animate();