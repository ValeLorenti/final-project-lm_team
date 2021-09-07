roomGenerator(){
	
	var halfExtents = new CANNON.Vec3(20,20,5);
		var boxShape = new CANNON.Box(halfExtents);
		var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
		for(var i=0; i<6; i++){
			var x = 10+(Math.random()-0.5)*20;
			var y = 20 + (Math.random()-0.5)*1;
			var z = (Math.random()-0.5)*20;
			var boxBody = new CANNON.Body({ mass: 5000 });
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
		}

}

