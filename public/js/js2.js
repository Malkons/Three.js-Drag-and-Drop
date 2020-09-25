
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

var planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
planeGeometry.rotateX(- Math.PI / 2);
var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = - 200;
plane.receiveShadow = true;
scene.add(plane);

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
objectsToBeDragged.push(cube);
console.log(objectsToBeDragged);
scene.add(cube);

// Controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.damping = 0.2;
controls.addEventListener('change', render);

controls.addEventListener('start', function () {

    cancelHideTransform();

});

controls.addEventListener('end', function () {

    delayHideTransform();

});

transformControl = new THREE.TransformControls(camera, renderer.domElement);
transformControl.addEventListener('change', render);
transformControl.addEventListener('dragging-changed', function (event) {

    controls.enabled = !event.value;

});
scene.add(transformControl);

// Hiding transform situation is a little in a mess :
transformControl.addEventListener('change', function () {

    cancelHideTransform();

});

transformControl.addEventListener('mouseDown', function () {

    cancelHideTransform();

});

transformControl.addEventListener('mouseUp', function () {

    delayHideTransform();

});

transformControl.addEventListener('objectChange', function () {

    updateSplineOutline();

});

var dragcontrols = new THREE.DragControls(objectsToBeDragged, camera, renderer.domElement); //
dragcontrols.enabled = false;
dragcontrols.addEventListener('hoveron', function (event) {

    transformControl.attach(event.object);
    console.log(event.object);
    cancelHideTransform();

});

dragcontrols.addEventListener('hoveroff', function () {

    delayHideTransform();

});

var hiding;

function delayHideTransform() {

    cancelHideTransform();
    hideTransform();

}

function hideTransform() {

    hiding = setTimeout(function () {

        transformControl.detach(transformControl.object);

    }, 2500);

}

function cancelHideTransform() {

    if (hiding) clearTimeout(hiding);

}


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