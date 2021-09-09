function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function checkPositions(forbiddens, newPosition){
	var around = 10;
	for (var i = 0; i<forbiddens.length; i++){
		var forbiddenX = forbiddens[i].x;
		var forbiddenZ = forbiddens[i].z;
		if(((newPosition[0] < (forbiddenX-around))||(newPosition[0] > (forbiddenX+around))) && ((newPosition[1] < (forbiddenZ-around))||(newPosition[1] > (forbiddenZ+around)))){
				console.log("true");
				return true;
		}
		else{
			console.log("false");
			return false;
		}
	}
}

function mapGenerator(world, scene, boxes, boxMeshes, spheres, sphereMeshes, models){
	
	var halfExtents = new CANNON.Vec3(8,4,0.5);
	var boxShape = new CANNON.Box(halfExtents);
	var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
	halfExtents = new CANNON.Vec3 (10, 20, 20);
	var sphereShape = new CANNON.Sphere(halfExtents.x);
	var sphereGeometry = new THREE.SphereGeometry(halfExtents.x, 20, 20);
	var x = 0;
	var y = 0;
	var z = 0;
	var genFactor = 0;
	var spawn = new CANNON.Vec3(0, 1.6, 0);
	var forbiddenPositions = [spawn];
	var currentPos = [];
	
	for(var i=0; i<150; i++){
		x = (Math.random()-0.5)*300;
		y = 0;
		z = (Math.random()-0.5)*300;
		currentPos = [x,z];
		if(checkPositions(forbiddenPositions, currentPos)){
			genFactor = getRandomIntInclusive(1, 3);
			
			switch(genFactor){
								
				case 1:
					y = 4;
					var boxBody = new CANNON.Body({ mass: 0 });
					boxBody.addShape(boxShape);
					var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
					var material2 = new THREE.MeshLambertMaterial( { color: randomColor } );
					var boxMesh = new THREE.Mesh( boxGeometry, material2 );
					world.add(boxBody);
					scene.add(boxMesh);
					boxBody.position.set(x,y,z);
					boxMesh.position.set(x,y,z);
					console.log(boxBody.position);
					forbiddenPositions.push(boxBody.position);
					boxMesh.castShadow = true;
					boxMesh.receiveShadow = true;
					boxes.push(boxBody);
					boxMeshes.push(boxMesh);
					break;
				
				case 2:
					y = -7;
					var sphereBody = new CANNON.Body({ mass: 0 });
					sphereBody.addShape(sphereShape);
					var material2 = new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load('resources\\images\\field.png'), side: THREE.DoubleSide } );
					var sphereMesh = new THREE.Mesh(sphereGeometry, material2);
					world.add(sphereBody);
					scene.add(sphereMesh);
					sphereBody.position.set(x,y,z);
					sphereMesh.position.set(x,y,z);
					forbiddenPositions.push(sphereBody.position);
					sphereMesh.castShadow = true;
					sphereMesh.receiveShadow = true;
					spheres.push(sphereBody);
					sphereMeshes.push(sphereMesh);
					break;
				
				case 3:
					var genFactor1 = getRandomIntInclusive(1, 7);
					var tree;
					console.log(genFactor1);
					switch(genFactor1){
						case 1: tree = models["albero1"].model.clone();
							break;
						case 2: tree = models["albero2"].model.clone();
							break;
						case 3: tree = models["albero3"].model.clone();
							break;
						case 4: tree = models["albero4"].model.clone();
							break;
						case 5: tree = models["albero5"].model.clone();
							break;
						case 6: tree = models["albero6"].model.clone();
							break;
						case 7: tree = models["albero7"].model.clone();
							break;
					}
					scene.add(tree);
					tree.position.set(x, y, z);
					var halfExtents2 = new CANNON.Vec3(1.5, 4, 1.5);
					var treeShape = new CANNON.Box(halfExtents2);
					var treeBody = new CANNON.Body({ mass: 0 });
					treeBody.addShape(treeShape);
					treeBody.position.set(x, 2, z);
					world.add(treeBody);
					forbiddenPositions.push(tree.position);
					break;
			}
		}	
	}
}

load() {
		var promise = [
            this.getModel('Pistola/scene.gltf', 5.0),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_03'),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_04'),
            this.getModel('Guns/scene.gltf', 0.0006, 'Weapon_06'),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_08'),
			this.getModel('alberi/scene.gltf', 2, "_1_tree"),
			this.getModel('alberi/scene.gltf', 1, "_2_tree"),
			this.getModel('alberi/scene.gltf', 1, "_3_tree"),
			this.getModel('alberi/scene.gltf', 1, "_4_tree"),
			this.getModel('alberi/scene.gltf', 1, "_5_tree"),
			this.getModel('alberi/scene.gltf', 1, "_6_tree"),
			this.getModel('alberi/scene.gltf', 1, "_7_tree"),
		];
		Promise.all(promise).then(data => {
            var nameModels = [
                "Pistola",
				"ak47",
				"pistol",
				"sniper",
				"rpg",
				"albero1",
				"albero2",
				"albero3",
				"albero4",
				"albero5",
				"albero6",
				"albero7"
				
            ];