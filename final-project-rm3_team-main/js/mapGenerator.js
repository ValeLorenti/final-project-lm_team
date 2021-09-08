
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function mapGenerator(){
	
var halfExtents = new CANNON.Vec3(8,4,0.5);
var boxShape = new CANNON.Box(halfExtents);
var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
haflExtens = (20, 20, 20);
var sphereShape = new CANNON.Sphere(halfExtents.x);
var sphereGeometry = new THREE.SphereGeometry(halfExtents.x, 20, 20);
var x = 0;
var y = 0;
var z = 0;
var genFactor = 0;

	for(var i=0; i<1000; i++){
		x = (Math.random()-0.5)*300;
		y = (Math.random()-0.5)*1;
		z = (Math.random()-0.5)*300;
		genFactor = getRandomIntInclusive(1, 3);
		switch(genFactor){
							
			case 1:
				y = y + 4;
				var boxBody = new CANNON.Body({ mass: 0 });
				boxBody.addShape(boxShape);
				var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
				var material2 = new THREE.MeshLambertMaterial( { color: randomColor } );
				var boxMesh = new THREE.Mesh( boxGeometry, material2 );
				this.world.add(boxBody);
				this.scene.add(boxMesh);
				boxBody.position.set(x,y,z);
				boxMesh.position.set(x,y,z);
				boxMesh.castShadow = true;
				boxMesh.receiveShadow = true;
				this.boxes.push(boxBody);
				this.boxMeshes.push(boxMesh);
				break;
			
			case 2:
				y = y -15
				var sphereBody = new CANNON.Body({ mass: 0 });
				sphereBody.addShape(sphereShape);
				var material2 = new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load('resources\\images\\field.png'), side: THREE.DoubleSide } );
				var sphereMesh = new THREE.Mesh(sphereGeometry, material2);
				this.world.add(sphereBody);
				this.scene.add(sphereMesh);
				sphereBody.position.set(x,y,z);
				sphereMesh.position.set(x,y,z);
				sphereMesh.castShadow = true;
				sphereMesh.receiveShadow = true;
				this.spheres.push(sphereBody);
				this.sphereMeshes.push(sphereMesh);
				break;
			
			case 3: 	
				var tree = this.models["alberi"].model
				this.scene.add();
				tree.position.set(x, y, z);
				var halfExtents2 = new CANNON.Vec3(0.5,3,0.5)
				var treeShape = new CANNON.Box(halfExtents2);
				var treeBody = new CANNON.Body({ mass: 0 });
				treeBody.addShape(treeShape);
				y = y + 3;
				treeBody.position.set(x, y, z);
				this.world.add(treeBody);
				this.boxes.push(treeBody);
				this.boxMeshes.push(tree);
				break;
		}
			
	}
}	