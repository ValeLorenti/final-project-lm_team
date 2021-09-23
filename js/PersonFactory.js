export class PersonFactory {
	static GUN_PISTOL = "pistol";
	static GUN_PISTOL_STATISTIC = {
		name: PersonFactory.GUN_PISTOL,
		timeReloading: 1.8,
		ammo: 14,
		timeBetweenAmmo: 0.45,
		bullet: {
			mass: 3,
			radius: 0.1,
			shootSpeed: 35,
		}
	};
    static GUN_MP5 = "mp5";
	static GUN_MP5_STATISTIC = {
		name: PersonFactory.GUN_MP5,
		timeReloading: 3.2,
		ammo: 50,
		timeBetweenAmmo: 0.2,
		bullet: {
			mass: 5,
			radius: 0.15,
			shootSpeed: 45,
		}
	};
    static GUN_MINIGUN = "minigun";
	static GUN_MINIGUN_STATISTIC = {
		name: PersonFactory.GUN_MINIGUN,
		timeReloading: 4.5,
		ammo: 200,
		timeBetweenAmmo: 0.006,
		bullet: {
			mass: 8,
			radius: 0.2,
			shootSpeed: 60,
		}
	};
	
	static GUN_ALL = [PersonFactory.GUN_PISTOL,
						PersonFactory.GUN_MP5,
						PersonFactory.GUN_MINIGUN]
	static GUN_ALL_STATISTIC = [PersonFactory.GUN_PISTOL_STATISTIC,
						PersonFactory.GUN_MP5_STATISTIC,
						PersonFactory.GUN_MINIGUN_STATISTIC]
	static GUN_RANDOM = PersonFactory.GUN_ALL[Math.floor(Math.random() * PersonFactory.GUN_ALL.length)]
	
	constructor(params){
		this.ADMINISTRATOR = params.administrator;
		this.weaponsName = params.weapons;
		this.weapons = [];
		this.weaponsQuantity = 0;
		this.actualWeapon = 0;
		this.typeFlag = params.type;
		this.high = 2.5;
		this.deathSpeed = 650;
		this.buildPerson();
		
		if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
		this.person.position.set(...params.position);
        if(params.rotation)
            this.person.rotation.set(...params.rotation);
		
		this.prepareWeapons();
		
		this.walkingAnimation();
		this.deathAnimation();
		if(this.typeFlag == 'giant') this.person.scale.set(3,3,3);
	}
	
	buildPerson() {

	
		if(this.typeFlag == 'player'){
		   var headTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveRight.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveFront.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		  this.headMesh = this.createMeshedBox(0.6, 0.6, 0.6, 0, 0, 0, headTexture);
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

		   this.headMesh = this.createMeshedBox(0.6, 0.6, 0.6, 0, 0, 0, headTexture);
		   this.headMesh.rotation.y  = Math.PI/2;
		   this.high = 3*3;
		   this.deathSpeed = 1500;
		 }

  		if(this.typeFlag == 'small'){
		   var headTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieHeadSlide.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieFace.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		 
		  this.headMesh = this.createMeshedBox(0.6, 0.6, 0.6, 0, 0, 0, headTexture);
		 }

		this.headMesh.name = "skull";

		this.headGroup = new THREE.Group();
		this.headGroup.name = "head";
		this.headGroup.add(this.headMesh);
		

		if(this.typeFlag == 'player'){
		   var boxGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.45); 
		   var bodyTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveBodyLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveBodyRight.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveBodyUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveBodyDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveBodyBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveBodyFront.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
		   this.bodyMesh = this.createMeshedBox(0.6, 1.2, 0.45, 0, -0.9, 0, bodyTexture);
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
		   this.bodyMesh = this.createMeshedBox(0.6, 1.2, 0.45, 0, -0.9, 0, bodyTexture);
		  }
		  
		if(this.typeFlag == 'small'){
		   var bodyTexture = [
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyFront.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyBack.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyUp.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyDown.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyLeft.png'), side: THREE.DoubleSide, dithering: true}),
		   new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieBodyRight.png'), side: THREE.DoubleSide, dithering: true}),
		  ];
			this.bodyMesh = this.createMeshedBox(0.6, 1.2, 0.45, 0, -0.9, 0, bodyTexture);
		  }
		
		
	
		this.leftLeg = new THREE.Object3D;
		this.leftLeg.position.y = -1.5;
		this.leftLeg.position.x = -0.155;
		this.leftLeg.name = "Left Leg";
		if(this.typeFlag == 'player') {
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = this.createMeshedBox(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
			
		if(this.typeFlag == 'giant'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = this.createMeshedBox(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
		if(this.typeFlag == 'small'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieLegFront.png'), side: THREE.DoubleSide, dithering: true});
		   this.leftLegMesh = this.createMeshedBox(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		  }
		  this.leftLeg.add(this.leftLegMesh)
		
		this.rightLeg = new THREE.Object3D;
		this.rightLeg.position.y = -1.5;
		this.rightLeg.position.x = 0.155;
		this.rightLeg.name = "Right Leg"
		if(this.typeFlag == 'player') {
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveLeg.png'), side: THREE.DoubleSide, dithering: true});
		   this.rightLegMesh = this.createMeshedBox(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
		if(this.typeFlag == 'giant'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantLeg.png'), side: THREE.DoubleSide, dithering: true});
		    this.rightLegMesh = this.createMeshedBox(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		}
		if(this.typeFlag == 'small'){
		   var legTexture =  new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieLegFront.png'), side: THREE.DoubleSide, dithering: true});
		   this.rightLegMesh = this.createMeshedBox(0.28, 1.0, 0.3, 0, -0.45, 0, legTexture);
		  }
		this.rightLeg.add(this.rightLegMesh)
		this.legGroup = new THREE.Group();
		this.legGroup.name = "leg"
		this.legGroup.add(this.leftLeg, this.rightLeg);
		

		this.leftArm = new THREE.Object3D;
		this.leftArm.position.x = -0.45;
		this.leftArm.position.y = -0.45;
		this.leftArm.name = "Left Arm"
		if(this.typeFlag == 'player'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveArm.png'), side: THREE.DoubleSide, dithering: true});
			this.leftArmMesh = this.createMeshedBox(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'giant'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantArm.png'), side: THREE.DoubleSide, dithering: true});
			this.leftArmMesh = this.createMeshedBox(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'small'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieArm.png'), side: THREE.DoubleSide, dithering: true})
			this.leftArmMesh = this.createMeshedBox(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		this.leftArm.add(this.leftArmMesh)

		this.rightArm = new THREE.Object3D;
		this.rightArm.position.x = 0.45;
		this.rightArm.position.y = -0.45;
		this.rightArm.name = "Right Arm"
		if(this.typeFlag == 'player') {
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/SteveArm.png'), side: THREE.DoubleSide, dithering: true});
			this.rightArmMesh = this.createMeshedBox(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'giant'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/giantArm.png'), side: THREE.DoubleSide, dithering: true});
			this.rightArmMesh = this.createMeshedBox(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		if(this.typeFlag == 'small'){
			var armTexture = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources/images/zombieArm.png'), side: THREE.DoubleSide, dithering: true});
			this.rightArmMesh = this.createMeshedBox(0.2775, 0.9, 0.3, 0, -0.3, 0, armTexture);
		}
		this.rightArm.add(this.rightArmMesh)
		this.rightArm.rotation.x = Math.PI / 2;
		
		this.armGroup = new THREE.Group();
		this.armGroup.name = "arm"
		this.armGroup.add(this.leftArm, this.rightArm);
		
		this.bodyGroup = new THREE.Group();
		this.bodyGroup.name = "body"
		this.bodyGroup.add(this.bodyMesh, this.legGroup, this.armGroup);
		

		this.person = new THREE.Group();
		this.person.name = "robot";
		this.person.add(this.headGroup, this.bodyGroup);


	}
	

	
	prepareWeapons() {
		for(let i in this.weaponsName) {
			switch(this.weaponsName[i]) {
				case PersonFactory.GUN_PISTOL:
					this.weapons.push(this.ADMINISTRATOR.SYSTEM.models[PersonFactory.GUN_PISTOL].model.clone())
					this.weapons[this.weaponsQuantity].position.set(-0.05,-0.65,-0.3);
					this.weapons[this.weaponsQuantity].rotation.x = -Math.PI/2;
					break;
				case PersonFactory.GUN_MP5:
					this.weapons.push(this.ADMINISTRATOR.SYSTEM.models[PersonFactory.GUN_MP5].model.clone())
					this.weapons[this.weaponsQuantity].position.set(-0.12,-0.7,-0.1);
					this.weapons[this.weaponsQuantity].rotation.y = +Math.PI/2;
					this.weapons[this.weaponsQuantity].rotation.x = -Math.PI/2;
					break;
				case PersonFactory.GUN_MINIGUN:
					this.weapons.push(this.ADMINISTRATOR.SYSTEM.models[PersonFactory.GUN_MINIGUN].model.clone())
					this.weapons[this.weaponsQuantity].position.set(0.0,-1.0,0);
					this.weapons[this.weaponsQuantity].rotation.y = Math.PI/2;
					this.weapons[this.weaponsQuantity].rotation.z = -Math.PI/2;
				
					break;
			}
			this.weaponsQuantity++;
		}
		if(this.weaponsQuantity!=0)
			this.rightArm.add(this.weapons[0]);
	}
	
	changeWeapon() {
		if(this.weaponsQuantity==0) return;
		this.rightArm.remove(this.weapons[this.actualWeapon]);
		this.actualWeapon = (this.actualWeapon+1)%this.weaponsQuantity;
		this.rightArm.add(this.weapons[this.actualWeapon])
	}
	
	walkingAnimation() {
		this.legTween1 = new TWEEN.Tween({x: 0, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 50/this.ADMINISTRATOR.getSpeedFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween2 = new TWEEN.Tween({x: Math.PI/6, y: 0, z: 0}).to( {x:-Math.PI/6, y: 0, z: 0}, 100/this.ADMINISTRATOR.getSpeedFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween3 = new TWEEN.Tween({x:-Math.PI/6, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 100/this.ADMINISTRATOR.getSpeedFactor() )
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
			this.person.rotation.x = object.x;
			this.person.position.y = object.y;
		}			
		this.deathTween.onUpdate(this.updateDeath.bind(this));	
	}
	
	
	getMesh() {
		return this.person;
	}
	
	getActualWeapon() {
		return PersonFactory.GUN_ALL_STATISTIC.find(gun => gun.name==this.weaponsName[this.actualWeapon]);
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
		const legTween4 = new TWEEN.Tween(this.leftLeg.rotation.clone()).to({x: 0, y: 0, z: 0}, 50/this.ADMINISTRATOR.getSpeedFactor());
		legTween4.onUpdate(this.updateLeg1.bind(this));
		legTween4.start();;
	}

	createMeshedBox(width, height, depth, x, y, z, material) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		var mesh = new THREE.Mesh(boxGeometry, material);
		mesh.castShadow = true;
		mesh.position.set(x,y,z);
		return mesh;
	}

}