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
			mass: 10,
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
		this.high = 2.5;
		this.deathSpeed = 650;
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
		this.deathAnimation();
		if(this.typeFlag == 'giant') this.character.scale.set(3,3,3);
	}
	
	buildCharacter() {

		//Generate character
		if(this.typeFlag == 'player'){
		   var headTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveRight.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveFront.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		  this.headMesh = this.generateBoxMesh(0.6, 0.6, 0.6, 0, 0, 0, headTexture);
		 }
		if(this.typeFlag == 'giant') {
		   var headTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadFront.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadRight.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantHeadLeft.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   //var boxMaterial = new THREE.MeshPhongMaterial( { map: headTexture } );
		   this.headMesh = this.generateBoxMesh(0.6, 0.6, 0.6, 0, 0, 0, headTexture);
		   this.headMesh.rotation.y  = Math.PI/2;
		   this.high = 3*3;
		   this.deathSpeed = 1500;
		 }

  		if(this.typeFlag == 'enemy'){
		   var headTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieFace.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   //var boxMaterial = new THREE.MeshPhongMaterial( { map: headTexture } );
		  this.headMesh = this.generateBoxMesh(0.6, 0.6, 0.6, 0, 0, 0, headTexture);
		 }

		this.headMesh.name = "skull";

		this.headGroup = new THREE.Group();
		this.headGroup.name = "head";
		this.headGroup.add(this.headMesh);
		
		// Body mesh models and groups
		if(this.typeFlag == 'player'){
		   var boxGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.45); 
		   var bodyTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveBodyLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveBodyRight.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveBodyUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveBodyDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveBodyBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveBodyFront.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   this.bodyMesh = this.generateBoxMesh(0.6, 1.2, 0.45, 0, -0.9, 0, bodyTexture);
		  }
		  
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
		   this.bodyMesh = this.generateBoxMesh(0.6, 1.2, 0.45, 0, -0.9, 0, bodyTexture);
		  }
		  
		if(this.typeFlag == 'enemy'){
		   var bodyTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyFront.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyRight.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
			this.bodyMesh = this.generateBoxMesh(0.6, 1.2, 0.45, 0, -0.9, 0, bodyTexture);
		  }
		
		
		//Legs
		this.leftLeg = new THREE.Object3D;
		this.leftLeg.position.y = -1.5;
		this.leftLeg.position.x = -0.155;
		this.leftLeg.name = "Left Leg";
		if(this.typeFlag == 'player') {
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
			
		if(this.typeFlag == 'giant'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
		if(this.typeFlag == 'enemy'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieLegFront.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		  }
		  this.leftLeg.add(this.leftLegMesh)
		
		this.rightLeg = new THREE.Object3D;
		this.rightLeg.position.y = -1.5;
		this.rightLeg.position.x = 0.155;
		this.rightLeg.name = "Right Leg"
		if(this.typeFlag == 'player') {
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.rightLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
		if(this.typeFlag == 'giant'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantLeg.png'), side: THREE.DoubleSide, dithering: true});
		    this.rightLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
		if(this.typeFlag == 'enemy'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieLegFront.png'), side: THREE.DoubleSide, dithering: true});
		   this.rightLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
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
		if(this.typeFlag == 'player'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveArm.png'), side: THREE.DoubleSide, dithering: true});
			this.leftArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'giant'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantArm.png'), side: THREE.DoubleSide, dithering: true});
			this.leftArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'enemy'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieArm.png'), side: THREE.DoubleSide, dithering: true})
			this.leftArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		this.leftArm.add(this.leftArmMesh)

		this.rightArm = new THREE.Object3D;
		this.rightArm.position.x = 0.45;
		this.rightArm.position.y = -0.45;
		this.rightArm.name = "Right Arm"
		if(this.typeFlag == 'player') {
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/adventure_SteveArm.png'), side: THREE.DoubleSide, dithering: true});
			this.rightArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'giant'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantArm.png'), side: THREE.DoubleSide, dithering: true});
			this.rightArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'enemy'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieArm.png'), side: THREE.DoubleSide, dithering: true});
			this.rightArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
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
	
	deathAnimation() {
		
		this.deathTween = new TWEEN.Tween( {x: 0, y: this.high , z: 0}).to({x: -Math.PI/2, y: 0 , z: 0}, this.deathSpeed)
			.easing(TWEEN.Easing.Quadratic.InOut);
		this.updateDeath = function(object){
			this.character.rotation.x = object.x;
			this.character.position.y = object.y;
		}			
		this.deathTween.onUpdate(this.updateDeath.bind(this));	
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
	
	startDeath() {
		this.deathTween.start();
		var audio = new Audio('resources/audios/ZombieDeath.wav');
		audio.play();
	}
	
	stopMove() {
		this.legTween1.stop();
		const legTween4 = new TWEEN.Tween(this.leftLeg.rotation.clone()).to({x: 0, y: 0, z: 0}, 50/this.MANAGER.getVelocityFactor());
		legTween4.onUpdate(this.updateLeg1.bind(this));
		legTween4.start();;
	}

	generateBoxMesh(width, height, depth, x, y, z, material) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		var mesh = new THREE.Mesh(boxGeometry, material);
		mesh.castShadow = true;
		mesh.position.set(x,y,z);
		return mesh;
	}

}