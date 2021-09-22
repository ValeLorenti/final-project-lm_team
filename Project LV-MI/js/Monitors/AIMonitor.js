import {PersonFactory} from './../PersonFactory.js';

export class AIMonitor {
	constructor(params) {
		this.ADMINISTRATOR = params.administrator
		this.target = params.target;
		this.body = params.body;
		this.player = params.player;
		this.maxDistance = params.maxDistance;
		this.entity = params.entity;
		this.bulletAdministrator = params.bulletAdministrator;
		this.setTimeToShot();
		this.timeToShot = Math.random()*500;
		this.timeToMove = Math.random()*1000;
		this.move = false;
		this.scoreAdministrator = params.scoreAdministrator;
	}
	
	update(time) {
		this.target.position.copy(this.body.position);
		this.target.position.y += 0.3;
		this.body.velocity.x *= 0.95;
		this.body.velocity.z *= 0.95;
		
		var distance = this.player.body.position.distanceTo(this.body.position);
		if((distance<this.maxDistance*1.6) || (distance<this.maxDistance*2.5 && this.entity.hit>0) || (time < 5500)){
			var direction = this.computeDirection();
			this.target.rotation.y = Math.atan2(-direction.x,-direction.z);
			if(distance<this.maxDistance) {				//From maxDistance start to shot
				if(this.timeToShot<0) {
					this.bulletAdministrator.buildNewBullet(this.entity,direction)
					this.currAmmo -= 1;
					this.timeToShot = this.computeNewTimeToShot();
				}
				else
					this.timeToShot -= time;
			}
			if(distance>this.maxDistance*0.8) {			//When arrive to maxDistance*0.8 stop to move forward and move laterally
				this.timeToMove = 0;
				this.directionMove = new THREE.Vector3(0,0,-1);
				if(!this.move) {
					this.entity.person.startMove();
					this.move = true;
				}
			}
			else {
				if(this.timeToMove<=0) {
					this.move = !this.move;
					this.timeToMove = this.computeNewTimeToMove(0.5);
					var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
					this.directionMove = new THREE.Vector3(plusOrMinus,0,0);
					if(this.move)
						this.entity.person.startMove();
					else
						this.entity.person.stopMove();
				}
				else
					this.timeToMove -= time;
			}
			if(this.move) {
				var move = new THREE.Vector3();
				move.x = this.directionMove.x*time*0.02;
				move.z = this.directionMove.z*time*0.03;
				move.applyAxisAngle(new THREE.Vector3(0,1,0),this.target.rotation.y);
				this.body.velocity.x += move.x;
				this.body.velocity.z += move.z;
			}
		}
		else {
			if(this.move) {
				this.move = false;
				this.entity.person.stopMove();
			}
		}
	}
	
	computeNewTimeToShot() {
		if(this.currAmmo<=0) {
			this.currAmmo = this.ammo;
			return this.timeReloading;
		}
		return this.timeBetweenAmmo;
	}
	computeNewTimeToMove(factor=1) {
		return (factor+Math.random()*factor)*1000
	}
	
	setTimeToShot() {
		var gun = this.entity.person.getActualWeapon()
		this.timeReloading = gun.timeReloading *1000;
		this.ammo = gun.ammo;
		this.timeBetweenAmmo = gun.timeBetweenAmmo *1000;
		this.currAmmo = this.ammo;
		console.log()
	}
	
	computeDirection() {
		var objective = (new THREE.Vector3()).copy(this.player.body.position);
		var from = this.target.position.clone();
		if(this.entity.person.typeFlag == 'giant') from.y+=2;
		var direction = objective.sub(from).normalize();
		return (new THREE.Ray(this.body.position, direction)).direction;
	}

}