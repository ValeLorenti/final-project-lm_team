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
		
		this.currentGun = this.person.getActualGun();
		this.setUpGun();
		this.setAmmo(this.ammo);
		this.shotTime = -1;
		
		this.input = new InputMonitor({administrator : this.ADMINISTRATOR});
		this.jumpVelocity = 16;

		this.yawObject = new THREE.Object3D();
		this.pitchObject = new THREE.Object3D();	
		
		this.setUpObject();		
		
		this.isMoving = false;
		this.canJump = false;

		this.contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		this.upAxis = new CANNON.Vec3(0,1,0);
		
		this.quat = new THREE.Quaternion();
		this.inputVelocity = new THREE.Vector3();
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
		
		this.pitchObject.position.set(0.0,2,-0.2)
		this.pitchObject.add(this.camera);
		this.pitchObject.add(this.camera2);
		this.pitchObject.add(this.camera3);
		this.camera.translateY(+0.15);
		this.camera2.translateZ(-3);
		this.camera2.translateY(-0.3);
		this.camera3.translateZ(+5);
		this.camera3.translateY(+0.3);
		this.yawObject.add(this.person.getMesh());
		this.yawObject.add(this.pitchObject);
	}
	
    getObject() {
        return this.yawObject;
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
		this.bulletAdministrator.spawnNewBullet(this.entity, this.shootDirection)
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
	
	setUpGun() {
		this.currentGun = this.person.getActualGun();
		this.timeReload = this.currentGun.timeReloading*500;
		this.ammo = this.currentGun.ammo;
		this.timeBetweenAmmo = this.currentGun.timeBetweenAmmo*350;
		this.scoreAdministrator.setUpGun({name: this.currentGun.name, ammo: this.ammo});
	}
	
	changeGun() {
		this.person.changeGun();
		this.setUpGun();
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
		
		this.yawObject.rotation.y = this.input.rotationY;
		this.pitchObject.rotation.x = this.input.rotationX;
		this.person.rightArm.rotation.x = this.input.rotationX+PI_2

        time *= 0.1;

        this.inputVelocity.set(0,0,0);
        if (this.input.keys.forward){
            this.inputVelocity.z = -this.ADMINISTRATOR.getVelocityFactor() * time*4;
        }
        if (this.input.keys.backward){
            this.inputVelocity.z = this.ADMINISTRATOR.getVelocityFactor() * time*4;
        }
        if (this.input.keys.left){
            this.inputVelocity.x = -this.ADMINISTRATOR.getVelocityFactor() * time*4;
        }
        if (this.input.keys.right){
            this.inputVelocity.x = this.ADMINISTRATOR.getVelocityFactor() * time*4;
        }
		if (this.input.keys.space && this.canJump){
			this.velocity.y = this.jumpVelocity;
			this.canJump = false;
			this.input.keys.space = false;
		}
		if (this.input.keys.shift && !this.shiftHelded){
			this.ADMINISTRATOR.multiplyVelocityFactor();
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
			this.ADMINISTRATOR.resetVelocityFactor();
			this.shiftHelded = false;
		}
		if (this.input.keys.tab && !this.tabHelded){
			this.changeGun();
			this.tabHelded = true;
		}
		if (this.tabHelded && !this.input.keys.tab){
			this.tabHelded = false;
		}
		if(!this.isMoving && !this.inputVelocity.equals(new THREE.Vector3())){
			this.person.startMove();
			this.isMoving = true;
		}
		else if(this.isMoving && this.inputVelocity.equals(new THREE.Vector3())){
			this.person.stopMove();
			this.isMoving = false;
		} 
		
        // Convert velocity to world coordinates
        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quat);
        //this.quat.multiplyVector3(this.inputVelocity);
		if(!this.isMoving) {		//to avoid too much slippage
			this.velocity.x *= 0.93;
			this.velocity.z *= 0.93;
		}
        // Add to the object
        this.velocity.x += this.inputVelocity.x;
        this.velocity.z += this.inputVelocity.z;
        this.yawObject.position.copy(this.personBody.position);
    };
};