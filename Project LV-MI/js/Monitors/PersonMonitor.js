import { InputMonitor } from './InputMonitor.js';

var PI_2 = Math.PI / 2;
		
export class PersonMonitor {
	constructor(params) {
		this.ADMINISTRATOR = params.administrator;
		this.entity = params.entity;
		this.camera = params.camera;
		this.camera2 = params.camera2;
		this.camera3 =  params.camera3;
		this.bulletAdministrator = params.bulletAdministrator;
		this.scoreAdministrator = params.scoreAdministrator;
		
		this.personBody = this.entity.body;
		this.person = this.entity.person;
		
		this.currWeapon = this.person.getActualWeapon();
		this.setUpWeapon();
		this.setAmmo(this.ammo);
		this.shotTime = -1;
		
		this.input = new InputMonitor({administrator : this.ADMINISTRATOR});
		this.jumpSpeed = 16;

		this.ObjYaw = new THREE.Object3D();
		this.ObjPitch = new THREE.Object3D();	
		
		this.setUpObject();		
		
		this.isMoving = false;
		this.canJump = false;

		this.contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		this.upAxis = new CANNON.Vec3(0,1,0);
		
		this.quat = new THREE.Quaternion();
		this.inputSpeed = new THREE.Vector3();
		this.euler = new THREE.Euler();
	
		this.velocity = this.personBody.velocity;
		this.shiftHelded = false;
		this.tabHelded = false;
		
		this.personBody.addEventListener("collide",this.onCollision.bind(this));
		
		this.shootDirection = new THREE.Vector3();
		window.addEventListener("click",this.shot.bind(this));
		
	}
	
	onCollision(e) {
		var contact = e.contact;

		// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
		// We do not yet know which one is which! Let's check.
		if(contact.bi.id == this.personBody.id)  // bi is the player body, flip the contact normal
			contact.ni.negate(this.contactNormal);
		else
			this.contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

		// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
		if(this.contactNormal.dot(this.upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
			this.canJump = true;
	}
	
	setUpObject() {
		
		this.ObjPitch.position.set(0.0,2,-0.2)
		this.ObjPitch.add(this.camera);
		this.ObjPitch.add(this.camera2);
		this.ObjPitch.add(this.camera3);
		this.camera.translateY(+0.15);
		this.camera2.translateZ(-3);
		this.camera2.translateY(-0.3);
		this.camera3.translateZ(+5);
		this.camera3.translateY(+0.3);
		this.ObjYaw.add(this.person.getMesh());
		this.ObjYaw.add(this.ObjPitch);
	}
	
    getObject() {
        return this.ObjYaw;
    };

    getDirection(targetVec) {
        targetVec.set(0,0,-1);
        this.quat.multiplyVector3(targetVec);
    }
	getShootDir(targetVec){
		var vector = targetVec;
		targetVec.set(0,0,1);
		vector.unproject(this.camera);
		var ray = new THREE.Ray(this.entity.body.position, vector.sub(this.entity.body.position).normalize() );
		targetVec.copy(ray.direction);
	}
	
	createBulletFromPlayer() {
		this.getShootDir(this.shootDirection);
		this.bulletAdministrator.buildNewBullet(this.entity, this.shootDirection)
	}
	reloadComplete() {
		document.getElementById("reloading").style.visibility = "hidden";
		this.setAmmo(this.ammo);
		this.shotTime = -1;
		this.isReloading = false;
	}
	reload() {
		document.getElementById("reloading").style.visibility = "visible";
		this.shotTime = this.timeReload;
		this.isReloading = true;
		var audio = new Audio('resources/audios/Charging.wav');
		audio.play();
	}

	addTorch(torch) {
		var torchGroup = new THREE.Group();
		torchGroup.add(torch, torch.target);
		torchGroup.rotateX(-Math.PI/2);
		this.person.rightArm.add(torchGroup);
		this.torch = torch;
	}
	turnTorch() {
		this.torch.visible = !this.torch.visible;
		var audio = new Audio('resources/audios/ClickTorch.wav');
		audio.play();
	}

	shot() {
		if(this.ADMINISTRATOR.gameEnable==false) return;
		if(this.shotTime<=0) {
			this.createBulletFromPlayer();
			this.setAmmo()
			var audio = new Audio('resources/audios/PaintballShooting.wav');
			audio.play();
			if(this.currAmmo<=0)
				this.reload();
			else
				this.shotTime = this.timeBetweenAmmo;
		}
	}
	
	setAmmo(quantity=null) {
		if(quantity!=null)
			this.currAmmo = quantity;
		else
			this.currAmmo--;
		this.scoreAdministrator.setCurrAmmo(this.currAmmo);
	}
	
	setUpWeapon() {
		this.currWeapon = this.person.getActualWeapon();
		this.timeReload = this.currWeapon.timeReloading*500;
		this.ammo = this.currWeapon.ammo;
		this.timeBetweenAmmo = this.currWeapon.timeBetweenAmmo*350;
		this.scoreAdministrator.setUpWeapon({name: this.currWeapon.name, ammo: this.ammo});
	}
	
	changeWeapon() {
		this.person.changeWeapon();
		this.setUpWeapon();
		this.setAmmo(0);
		this.reload();
	}
	
	updateReloading(time) {
		if(this.shotTime>0){
			
			this.shotTime -= time;
		}
		if(this.shotTime<=0 && this.isReloading){
			this.reloadComplete();
		}
	}

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    update(time) {
        if ( this.ADMINISTRATOR.gameEnable === false ) return;
		
		this.updateReloading(time);
		
		this.ObjYaw.rotation.y = this.input.rotationY;
		this.ObjPitch.rotation.x = this.input.rotationX;
		this.person.rightArm.rotation.x = this.input.rotationX+PI_2

        time *= 0.1;

        this.inputSpeed.set(0,0,0);
        if (this.input.keys.forward){
            this.inputSpeed.z = -this.ADMINISTRATOR.getSpeedFactor() * time*4;
        }
        if (this.input.keys.backward){
            this.inputSpeed.z = this.ADMINISTRATOR.getSpeedFactor() * time*4;
        }
        if (this.input.keys.left){
            this.inputSpeed.x = -this.ADMINISTRATOR.getSpeedFactor() * time*4;
        }
        if (this.input.keys.right){
            this.inputSpeed.x = this.ADMINISTRATOR.getSpeedFactor() * time*4;
        }
		if (this.input.keys.space && this.canJump){
			this.velocity.y = this.jumpSpeed;
			this.canJump = false;
			this.input.keys.space = false;
		}
		if (this.input.keys.shift && !this.shiftHelded){
			this.ADMINISTRATOR.multiplySpeedFactor();
			this.shiftHelded = true;
		}
		if (this.input.keys.reload && !this.rHelded){
			if(!this.isReloading) this.reload();
			this.rHelded = true;
		}
		if (this.rHelded && !this.input.keys.reload){
			this.rHelded = false;
		}

		if (this.input.keys.torch && !this.tHelded){
			this.turnTorch();
			this.tHelded = true;
		}
		if (this.tHelded && !this.input.keys.torch){
			this.tHelded = false;
		}

		if (this.shiftHelded && !this.input.keys.shift){
			this.ADMINISTRATOR.resetSpeedFactor();
			this.shiftHelded = false;
		}
		if (this.input.keys.tab && !this.tabHelded){
			this.changeWeapon();
			this.tabHelded = true;
		}
		if (this.tabHelded && !this.input.keys.tab){
			this.tabHelded = false;
		}
		if(!this.isMoving && !this.inputSpeed.equals(new THREE.Vector3())){
			this.person.startMove();
			this.isMoving = true;
		}
		else if(this.isMoving && this.inputSpeed.equals(new THREE.Vector3())){
			this.person.stopMove();
			this.isMoving = false;
		} 
		
        // Convert velocity to world coordinates
        this.euler.x = this.ObjPitch.rotation.x;
        this.euler.y = this.ObjYaw.rotation.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputSpeed.applyQuaternion(this.quat);
        //this.quat.multiplyVector3(this.inputSpeed);
		if(!this.isMoving) {		//to avoid too much slippage
			this.velocity.x *= 0.93;
			this.velocity.z *= 0.93;
		}
        // Add to the object
        this.velocity.x += this.inputSpeed.x;
        this.velocity.z += this.inputSpeed.z;
        this.ObjYaw.position.copy(this.personBody.position);
    };
};