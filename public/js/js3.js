String.prototype.format = function () {

    var str = this;

    for (var i = 0; i < arguments.length; i++) {

        str = str.replace('{' + i + '}', arguments[i]);

    }
    return str;

};

var container, stats;
var camera, scene, renderer;
var splineHelperObjects = [];
var splinePointsLength = 2;
var positions = [];
var point = new THREE.Vector3();

var geometry = new THREE.SphereBufferGeometry(20, 20, 20);
var transformControl;

var ARC_SEGMENTS = 200;

var splines = {};

var params = {
    addPointCylinder: addPointCylinder,
    addPointBox: addPointBox,
    addPoint: addPoint,
    removePoint: removePoint,
};

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 250, 1000);
    scene.add(camera);

    scene.add(new THREE.AmbientLight(0xf0f0f0));
    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 1500, 200);
    light.angle = Math.PI * 0.2;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = - 0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    var planeGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
    planeGeometry.rotateX(- Math.PI / 2);
    var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = - 200;
    plane.receiveShadow = true;
    scene.add(plane);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    var gui = new dat.GUI();
    gui.add(params, 'addPointCylinder').name('Add Cylinder');
    gui.add(params, 'addPointBox').name('Add Cube');
    gui.add(params, 'addPoint').name('Add Sphere');
    gui.add(params, 'removePoint').name('Remove Point');
    gui.open();

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

    var dragcontrols = new THREE.DragControls(splineHelperObjects, camera, renderer.domElement); //
    dragcontrols.enabled = false;
    dragcontrols.addEventListener('hoveron', function (event) {

        transformControl.attach(event.object);

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

	/*******
	 * Curves
	 *********/

    for (var i = 0; i < splinePointsLength; i++) {

        addSplineObject(positions[i]);
    }

    console.log(splineHelperObjects);
    console.log(positions);

    positions = [];

    for (var i = 0; i < splinePointsLength; i++) {

        positions.push(splineHelperObjects[i].position);
    }

    console.log(splineHelperObjects);
    console.log(positions);

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEGMENTS * 3), 3));

    var curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35
    }));
    curve.mesh.castShadow = true;
    splines.uniform = curve;
    splines.uniform.tension = 0;

    for (var k in splines) {

        var spline = splines[k];
        scene.add(spline.mesh);

    }

    load([
        new THREE.Vector3(289.76843686945404, 452.51481137238443, 56.10018915737797),
        new THREE.Vector3(- 383.785318791128, 491.1365363371675, 47.869296953772746),
    ]);

    console.log(splineHelperObjects);
    console.log(splines);
    console.log(positions);
}

function addSplineObjectCylinder(position) {
    var geometry = new THREE.CylinderBufferGeometry(20, 20, 20);
    var material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    var object = new THREE.Mesh(geometry, material);

    if (position) {

        object.position.copy(position);
        console.log(object);
        
    } else {

        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600;
        object.position.z = Math.random() * 800 - 400;
        console.log(object);
    }

    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    splineHelperObjects.push(object);

    return object;

}

function addSplineObjectBox(position) {
    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    var material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    var object = new THREE.Mesh(geometry, material);

    if (position) {

        object.position.copy(position);
        console.log(object);
        
    } else {

        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600;
        object.position.z = Math.random() * 800 - 400;
        console.log(object);
    }

    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    splineHelperObjects.push(object);

    return object;

}

function addSplineObject(position) {
    var material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    var object = new THREE.Mesh(geometry, material);

    if (position) {

        object.position.copy(position);
        console.log(object);
        
    } else {

        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600;
        object.position.z = Math.random() * 800 - 400;
        console.log(object);
    }

    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    splineHelperObjects.push(object);

    return object;

}

function addPointCylinder() {

    splinePointsLength++;

    positions.push(addSplineObjectCylinder().position);
    console.log(positions);

    updateSplineOutline();

}

function addPointBox() {

    splinePointsLength++;

    positions.push(addSplineObjectBox().position);
    console.log(positions);

    updateSplineOutline();

}

function addPoint() {

    splinePointsLength++;

    positions.push(addSplineObject().position);
    console.log(positions);

    updateSplineOutline();

}

function removePoint() {

    if (splinePointsLength <= 2) {

        return;

    }
    splinePointsLength--;
    positions.pop();
    scene.remove(splineHelperObjects.pop());

    updateSplineOutline();

}

function updateSplineOutline() {

    for (var k in splines) {

        var spline = splines[k];

        var splineMesh = spline.mesh;
        var position = splineMesh.geometry.attributes.position;

        for (var i = 0; i < ARC_SEGMENTS; i++) {

            var t = i / (ARC_SEGMENTS - 1);
            spline.getPoint(t, point);
            position.setXYZ(i, point.x, point.y, point.z);

        }

        position.needsUpdate = true;

    }

}

function load(new_positions) {
    console.log(positions);
    while (new_positions.length > positions.length) {

        addPoint();

    }

    while (new_positions.length < positions.length) {

        removePoint();

    }

    for (var i = 0; i < positions.length; i++) {

        positions[i].copy(new_positions[i]);

    }

    updateSplineOutline();

}

function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();

}

function render() {

    splines.uniform.mesh.visible = params.uniform;
    renderer.render(scene, camera);

}