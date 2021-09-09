    var halfExtentsBox = new CANNON.Vec3(5,3,0.5);
    var boxShape = new CANNON.Box(halfExtentsBox);
    var boxGeometry = new THREE.BoxGeometry(halfExtentsBox.x*2,halfExtentsBox.y*2,halfExtentsBox.z*2);

    var halfExtentsSphere = new CANNON.Vec3 (10, 20, 20);
    var sphereShape = new CANNON.Sphere(halfExtentsSphere.x);
    var sphereGeometry = new THREE.SphereGeometry(halfExtentsSphere.x, 20, 20);