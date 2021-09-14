export class CharacterFactory {
	static GUN_PISTOL = "pistol";
	static GUN_PISTOL_STATISTIC = {
		name: CharacterFactory.GUN_PISTOL,
		timeReloading: 1.8,
		ammo: 14,
		timeBetweenAmmo: 0.45,
		bullet: {
			mass: 10,
			radius: 0.1,
			shootVelocity: 30,
		}
	};
    static GUN_MP5 = "mp5";
	static GUN_MP5_STATISTIC = {
		name: CharacterFactory.GUN_MP5,
		timeReloading: 3.2,
		ammo: 50,
		timeBetweenAmmo: 0.2,
		bullet: {
			mass: 10,
			radius: 0.15,
			shootVelocity: 45,
		}
	};
    static GUN_MINIGUN = "minigun";
	static GUN_MINIGUN_STATISTIC = {
		name: CharacterFactory.GUN_MINIGUN,
		timeReloading: 5,
		ammo: 200,
		timeBetweenAmmo: 0.009,
		bullet: {
			mass: 20,
			radius: 0.2,
			shootVelocity: 60,
		}
	};
	
	static GUN_ALL = [CharacterFactory.GUN_PISTOL,
						CharacterFactory.GUN_MP5,
						CharacterFactory.GUN_MINIGUN]
	static GUN_ALL_STATISTIC = [CharacterFactory.GUN_PISTOL_STATISTIC,
						CharacterFactory.GUN_MP5_STATISTIC,
						CharacterFactory.GUN_MINIGUN_STATISTIC]
	static GUN_RANDOM = CharacterFactory.GUN_ALL[Math.floor(Math.random() * CharacterFactory.GUN_ALL.length)]
	
	constructor(params){
		this.MANAGER = params.manager;
		this.gunsName = params.guns;
		this.guns = [];
		this.gunsQuantity = 0;
		this.actualGun = 0;
		this.typeFlag = params.type;
		
		this.buildCharacter();
		
		if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
		this.character.position.set(...params.position);
        if(params.rotation)
            this.character.rotation.set(...params.rotation);
		
		this.prepareGuns();
		
		this.initializeAnimation();
		if(this.typeFlag == 'giant') this.character.scale.set(3,3,3);
	}
	
	buildCharacter() {

		//Generate character
		if(this.typeFlag == 'player') this.headMesh = this.generateBoxMesh(0.6,0.6,0.6, 0, 0, 0);
		if(this.typeFlag == 'giant') {
		   var boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
		   var headTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadFront.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadRight.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadLeft.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   //var boxMaterial = new THREE.MeshPhongMaterial( { map: headTexture } );
		   this.headMesh = new THREE.Mesh(boxGeometry, headTexture);
		   this.headMesh.rotation.y  = Math.PI/2;
		 }

  		if(this.typeFlag == 'enemy'){
		   var boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
		   var headTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieFace.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   //var boxMaterial = new THREE.MeshPhongMaterial( { map: headTexture } );
		   this.headMesh = new THREE.Mesh(boxGeometry, headTexture);
		 }

		this.headMesh.name = "skull";

		this.headGroup = new THREE.Group();
		this.headGroup.name = "head";
		this.headGroup.add(this.headMesh);
		
		// Body mesh models and groups
		if(this.typeFlag == 'player') this.bodyMesh = this.generateBoxMesh(0.6, 1.2, 0.45, 0, -0.9, 0);
		if(this.typeFlag == 'giant'){
		   var boxGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.45); 
		   var bodyTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantBodyBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantBodyUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantBodyDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantBodyRight.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantBodyLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantBodyFront.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   this.bodyMesh = new THREE.Mesh(boxGeometry, bodyTexture);
		   this.bodyMesh.position.set(0, -0.9, 0);
		  }
		if(this.typeFlag == 'enemy'){
		   var boxGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.45); 
		   var bodyTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyFront.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyRight.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   this.bodyMesh = new THREE.Mesh(boxGeometry, bodyTexture);
		   this.bodyMesh.position.set(0, -0.9, 0);
		  }
		
		
		//Legs
		this.leftLeg = new THREE.Object3D;
		this.leftLeg.position.y = -1.5;
		this.leftLeg.position.x = -0.155;
		this.leftLeg.name = "Left Leg";
		if(this.typeFlag == 'player') this.leftLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0);
		if(this.typeFlag == 'giant'){
		   var boxGeometry = new THREE.BoxGeometry(0.28, 1.0, 0.3);
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = new THREE.Mesh(boxGeometry, legTexture);
		   this.leftLegMesh.position.set(0, -0.45, 0);

		}
		if(this.typeFlag == 'enemy'){
		   var boxGeometry = new THREE.BoxGeometry(0.28, 1.0, 0.3);
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieLegFront.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = new THREE.Mesh(boxGeometry, legTexture);
		   this.leftLegMesh.position.set(0, -0.45, 0);
		  }
		  this.leftLeg.add(this.leftLegMesh)
		
		this.rightLeg = new THREE.Object3D;
		this.rightLeg.position.y = -1.5;
		this.rightLeg.position.x = 0.155;
		this.rightLeg.name = "Right Leg"
		if(this.typeFlag == 'player') this.rightLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0);
		if(this.typeFlag == 'giant'){
		   var boxGeometry = new THREE.BoxGeometry(0.28, 1.0, 0.3);
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.rightLegMesh = new THREE.Mesh(boxGeometry, legTexture);
		   this.rightLegMesh.position.set(0, -0.45, 0);
		}
		if(this.typeFlag == 'enemy'){
		   var boxGeometry = new THREE.BoxGeometry(0.28, 1.0, 0.3);
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieLegFront.png'), side: THREE.DoubleSide, dithering: true});
		   this.rightLegMesh = new THREE.Mesh(boxGeometry, legTexture);
		   this.rightLegMesh.position.set(0, -0.45, 0);
		  }
		this.rightLeg.add(this.rightLegMesh)
		this.legGroup = new THREE.Group();
		this.legGroup.name = "leg"
		this.legGroup.add(this.leftLeg, this.rightLeg);
		
		//Arms
		this.leftArm = new THREE.Object3D;
		this.leftArm.position.x = -0.45;
		this.leftArm.position.y = -0.45;
		this.leftArm.name = "Left Arm"
		if(this.typeFlag == 'player') this.leftArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0);
		if(this.typeFlag == 'giant'){
			var leftGeometry = new THREE.BoxGeometry(0.2775, 0.9, 0.3);
			var leftTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantArm.png'), side: THREE.DoubleSide, dithering: true})
			this.leftArmMesh= new THREE.Mesh(leftGeometry, leftTexture);
			this.leftArmMesh.position.set(0, -0.3, 0);
		}
		if(this.typeFlag == 'enemy'){
			var leftGeometry = new THREE.BoxGeometry(0.2775, 0.9, 0.3);
			var leftTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieArm.png'), side: THREE.DoubleSide, dithering: true})
			this.leftArmMesh= new THREE.Mesh(leftGeometry, leftTexture);
			this.leftArmMesh.position.set(0, -0.3, 0);
		}
		this.leftArm.add(this.leftArmMesh)

		this.rightArm = new THREE.Object3D;
		this.rightArm.position.x = 0.45;
		this.rightArm.position.y = -0.45;
		this.rightArm.name = "Right Arm"
		if(this.typeFlag == 'player') this.rightArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0);
		if(this.typeFlag == 'giant'){
			var rightGeometry = new THREE.BoxGeometry(0.2775, 0.9, 0.3);
			var rightTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantArm.png'), side: THREE.DoubleSide, dithering: true})
			this.rightArmMesh= new THREE.Mesh(rightGeometry, rightTexture);
			this.rightArmMesh.position.set(0, -0.3, 0);
		}
		if(this.typeFlag == 'enemy'){
			var rightGeometry = new THREE.BoxGeometry(0.2775, 0.9, 0.3);
			var rightTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieArm.png'), side: THREE.DoubleSide, dithering: true})
			this.rightArmMesh= new THREE.Mesh(rightGeometry, rightTexture);
			this.rightArmMesh.position.set(0, -0.3, 0);
		}
		this.rightArm.add(this.rightArmMesh)
		this.rightArm.rotation.x = Math.PI / 2;
		
		this.armGroup = new THREE.Group();
		this.armGroup.name = "arm"
		this.armGroup.add(this.leftArm, this.rightArm);
		
		this.bodyGroup = new THREE.Group();
		this.bodyGroup.name = "body"
		this.bodyGroup.add(this.bodyMesh, this.legGroup, this.armGroup);
		
		// Character Group
		this.character = new THREE.Group();
		this.character.name = "robot";
		this.character.add(this.headGroup, this.bodyGroup);


		}
	

	
	prepareGuns() {
		for(let i in this.gunsName) {
			switch(this.gunsName[i]) {
				case CharacterFactory.GUN_PISTOL:
					this.guns.push(this.MANAGER.APP.models[CharacterFactory.GUN_PISTOL].model.clone())
					this.guns[this.gunsQuantity].position.set(-0.05,-0.9,-0.3);
					this.guns[this.gunsQuantity].rotation.x = -Math.PI/2;
					break;
				case CharacterFactory.GUN_MP5:
					this.guns.push(this.MANAGER.APP.models[CharacterFactory.GUN_MP5].model.clone())
					this.guns[this.gunsQuantity].position.set(-0.12,-0.6,-0.1);
					this.guns[this.gunsQuantity].rotation.y = -Math.PI/2;
					this.guns[this.gunsQuantity].rotation.x = -Math.PI/2;
					break;
				case CharacterFactory.GUN_MINIGUN:
					this.guns.push(this.MANAGER.APP.models[CharacterFactory.GUN_MINIGUN].model.clone())
					this.guns[this.gunsQuantity].position.set(0.0,-1.0,0);
					this.guns[this.gunsQuantity].rotation.y = Math.PI/2;
					this.guns[this.gunsQuantity].rotation.z = -Math.PI/2;
					//this.guns[this.gunsQuantity].rotation.x = -Math.PI;
					break;
			}
			this.gunsQuantity++;
		}
		if(this.gunsQuantity!=0)
			this.rightArm.add(this.guns[0]);
	}
	
	changeGun() {
		if(this.gunsQuantity==0) return;
		this.rightArm.remove(this.guns[this.actualGun]);
		this.actualGun = (this.actualGun+1)%this.gunsQuantity;
		this.rightArm.add(this.guns[this.actualGun])
	}
	
	initializeAnimation() {
		//Generate Animations
		this.legTween1 = new TWEEN.Tween({x: 0, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 50/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween2 = new TWEEN.Tween({x: Math.PI/6, y: 0, z: 0}).to( {x:-Math.PI/6, y: 0, z: 0}, 100/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween3 = new TWEEN.Tween({x:-Math.PI/6, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 100/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween1.chain(this.legTween2)
		this.legTween2.chain(this.legTween3)
		this.legTween3.chain(this.legTween2)
		
		this.updateLeg1 = function(object){
			this.leftLeg.rotation.x = object.x;
			this.rightLeg.rotation.x = -object.x;
			this.leftArm.rotation.x = object.x *0.5;
		}
		this.legTween1.onUpdate(this.updateLeg1.bind(this))
		this.legTween2.onUpdate(this.updateLeg1.bind(this))
		this.legTween3.onUpdate(this.updateLeg1.bind(this))		
	}
	
	getMesh() {
		return this.character;
	}
	
	getActualGun() {
		return CharacterFactory.GUN_ALL_STATISTIC.find(gun => gun.name==this.gunsName[this.actualGun]);
	}
	
	changeRotation(rotX) {
		this.leftArm.rotation.x = rotX;
	}
	
	startMove() {
		this.legTween1.start();
	}
	
	stopMove() {
		this.legTween1.stop();
		const legTween4 = new TWEEN.Tween(this.leftLeg.rotation.clone()).to({x: 0, y: 0, z: 0}, 50/this.MANAGER.getVelocityFactor());
		legTween4.onUpdate(this.updateLeg1.bind(this));
		legTween4.start();
	}
	
	sphereMesh(radius, x, y, z, color='#' + (Math.random() * 0xFFFFFF << 0).toString(16)) {
		var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
		var sphereMaterial = new THREE.MeshPhongMaterial( { color: color } );
		var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
		mesh.position.set(x,y,z);
		return mesh;
	}
	generateBoxMesh(width, height, depth, x, y, z) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		var boxMaterial = new THREE.MeshPhongMaterial( { color: randomColor } );
		var mesh = new THREE.Mesh(boxGeometry, boxMaterial);
		mesh.castShadow = true;
		mesh.position.set(x,y,z);
		return mesh;
	}

	cylinderMesh(radius, height, x, y, z) {
		var cylinderGeometry = new THREE.CylinderGeometry(radius,radius, height, 32, 32);
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		var cylinderMaterial = new THREE.MeshPhongMaterial( { color: randomColor } );
		var mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
		mesh.position.set(x,y,z);
		return mesh;
	}
}