function mapGenerator(){
	
var halfExtents = new CANNON.Vec3(8,4,0.5);
var boxShape = new CANNON.Box(halfExtents);
var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
var sphereShape = new CANNON.Sphere(halfExtents.x);
var sphereGeometry = new THREE.SphereGeometry(halfExtents.x, 10, 10);
var x = (Math.random()-0.5)*200;
var y = 4 + (Math.random()-0.5)*1;
var z = (Math.random()-0.5)*200;

for(var i=0; i<1000; i++){
	switch(gen_factor){
						
		case 1:		
			
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
		
			this.scene.add(this.models["alberi"].model);
			this.models["alberi"].model.position.set(10,0,10);
			var halfExtents2 = new CANNON.Vec3(0.5,3,0.5)
			var treeShape = new CANNON.Box(halfExtents2);
			var treeBody = new CANNON.Body({ mass: 0 });
			treeBody.addShape(treeShape);
			treeBody.position.set(10,0,10);
			this.world.add(treeBody);
			console.log(this.models["alberi"]);
			break;
		}
		
}	
		
		
		


var halfExtents = new CANNON.Vec3(10,10,10); // regolando questo facciamo altre figure
var sphereShape = new CANNON.Sphere(halfExtents.x);
var sphereGeometry = new THREE.SphereGeometry(halfExtents.x, 10, 10);
for(var i = 0; i < 10; i++){

	
	//var boxBody = new CANNON.Body({ mass: 0 });
	var sphereBody = new CANNON.Body({ mass: 0 });
	//boxBody.addShape(boxShape);
	sphereBody.addShape(sphereShape);
	//var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
	var material2 = new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load('resources\\images\\field.png'), side: THREE.DoubleSide } );
	//var boxMesh = new THREE.Mesh( boxGeometry, material2 );
	var sphereMesh = new THREE.Mesh(sphereGeometry, material2);
	//this.world.add(boxBody);
	//this.scene.add(boxMesh);
	this.world.add(sphereBody);
	this.scene.add(sphereMesh);
	

	//boxBody.position.set(x,y,z);
	//boxMesh.position.set(x,y,z);
	//boxMesh.castShadow = true;
	//boxMesh.receiveShadow = true;
	//this.boxes.push(boxBody);
	//this.boxMeshes.push(boxMesh);

	sphereBody.position.set(x,y,z);
	sphereMesh.position.set(x,y,z);
	sphereMesh.castShadow = true;
	sphereMesh.receiveShadow = true;
	this.spheres.push(sphereBody);
	this.sphereMeshes.push(sphereMesh);
	
	
	
	this.scene.add(this.models["alberi"].model);
	this.models["alberi"].model.position.set(10,0,10);
	var halfExtents2 = new CANNON.Vec3(0.5,3,0.5)
	var treeShape = new CANNON.Box(halfExtents2);
	var treeBody = new CANNON.Body({ mass: 0 });
	treeBody.addShape(treeShape);
	treeBody.position.set(10,0,10);
	this.world.add(treeBody);
	console.log(this.models["alberi"]);
	
}