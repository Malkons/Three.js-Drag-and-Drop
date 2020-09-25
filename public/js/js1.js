var container, stats;
var transformControl;
var objectsToBeDragged = [];
var control;
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

var geometry = new THREE.BoxGeometry(2, 2, 2);
var cubeMaterials = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../images/mountain.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../images/mountain.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../images/mountain.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../images/mountain.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../images/mountain.png"), side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("../images/mountain.png"), side: THREE.DoubleSide }),
];

//logo cube
var material = new THREE.MeshFaceMaterial(cubeMaterials);
var cube = new THREE.Mesh(geometry, material);
cube.position.y += 2;
scene.add(cube);

var orbit = new THREE.OrbitControls(camera, renderer.domElement);
orbit.update();
orbit.addEventListener('change', render);

control = new THREE.TransformControls(camera, renderer.domElement);
control.addEventListener('change', render);

control.addEventListener('dragging-changed', function (event) {

    orbit.enabled = !event.value;
});
control.attach(cube);

scene.add(control);

//camera position
camera.position.z = 7;
camera.position.y = 4;

//render to the page
var render = function () {

    renderer.render(scene, camera);
};

var update = function () {

};

var animate = function () {
    requestAnimationFrame(animate);
    update();
    render();
};
animate();