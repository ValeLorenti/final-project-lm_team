import {PersonMonitor} from './../Monitors/PersonMonitor.js';
import {AIMonitor} from './../Monitors/AIMonitor.js';
import {PersonFactory} from './../PersonFactory.js';

export class EntityAdministrator{
	static ENTITY_SMALL_ZOMBIE = "smallEnemy";
    static ENTITY_GIANT_ZOMBIE = "giantEnemy";
	static ENTITY_PLAYER = "Player";

	constructor(params){
        this.entities = [];
        this.player = null;

        this.scene = params.scene;
        this.world = params.world;
        this.ADMINISTRATOR = params.administrator;
		this.bulletAdministrator = params.bulletAdministrator;
        this.scoreAdministrator = params.scoreAdministrator;

    }

	addEntity(params) {
		switch(params.name){
            case EntityAdministrator.ENTITY_SMALL_ZOMBIE:
				var person = new PersonFactory({administrator: this.ADMINISTRATOR, weapons: params.weapons, position: params.position, type: 'small'})
                var entity = new SmallZombieEntity({
                    administrator: this.ADMINISTRATOR,
					entityAdministrator: this,
					maxDistance: params.maxDistance,
                    scoreAdministrator: this.scoreAdministrator,
					pos: this.entities.length,
                    target: person.getMesh(),
                    body: this.buildBody(params),
                    player: this.player,
					person : person, 
					entityId: 2,
                });
                this.entities.push(entity);
                break;

            case EntityAdministrator.ENTITY_GIANT_ZOMBIE:
                var person = new PersonFactory({administrator: this.ADMINISTRATOR, weapons: params.weapons, position: params.position, type: 'giant'})
                var entity = new GiantZombieEnity({
                    administrator: this.ADMINISTRATOR,
                    entityAdministrator: this,
                    maxDistance: params.maxDistance,
                    scoreAdministrator: this.scoreAdministrator,
                    pos: this.entities.length,
                    target: person.getMesh(),
                    body: this.buildBody(params),
                    player: this.player,
                    person : person, 
					entityId: 2,
                });
                this.entities.push(entity);
				
                break;

            case EntityAdministrator.ENTITY_PLAYER:
				var person = new PersonFactory({administrator: this.ADMINISTRATOR, weapons: params.weapons, position: params.position, type: 'player'})
                var entity = new PlayerEntity({
                    administrator: this.ADMINISTRATOR,
					entityAdministrator: this,
					pos: this.entities.length,
                    scoreAdministrator: this.scoreAdministrator,
                    target: person.getMesh(),
					body: this.buildBody(params),
					person : person,
					entityId: 1,
                });
                this.entities.push(entity);
                break;
        }
		this.scene.add(entity.target);
        if(entity.body != null){
            this.world.add(entity.body);
		}
	}
	addEntityAndReturn(params){
        this.addEntity(params);
        return this.entities[this.entities.length-1];
    }
	
	buildMesh(params){
		var elem = this._models[params.name];
		var mesh = elem.model.clone();

        mesh.name = params.name+(++elem.count);

        mesh.position.set(...params.position);
        if(params.rotation)
            mesh.rotation.set(...params.rotation);

        return mesh;
    }

	buildBody(params){
        switch(params.name){ 
            case EntityAdministrator.ENTITY_SMALL_ZOMBIE:
                var body = new CANNON.Body({ mass: 30, shape: new CANNON.Sphere(2), });
                break;
            case EntityAdministrator.ENTITY_GIANT_ZOMBIE:
                var body = new CANNON.Body({ mass: 80, shape: new CANNON.Sphere(7), });
                break;
            case EntityAdministrator.ENTITY_PLAYER:
                var body = new CANNON.Body({ mass: 50, shape: new CANNON.Sphere(1), });
                body.linearDamping = 0.9;
                break;
        }
        body.position.set(...params.position);
        if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
        return body;
    }
	
	deleteOneEntity(elem){
		elem.body.position.y = +1000;
		elem.body.sleep();
		elem.target.parent.remove(elem.target);
        var pos = elem.pos;
        this.entities.splice(pos, 1);
        for (var i = pos; i < this.entities.length; i++){
            this.entities[i].pos -= 1;
        }
    }
	
	setPlayer(player){
        this.player = player;
    }
	
	update(timeInSeconds){
        for(var i in this.entities){
            this.entities[i].update(timeInSeconds);
        }
    }
}

class Entity{
    constructor(params){
        this.ADMINISTRATOR = params.administrator;
        this.entityAdministrator = params.entityAdministrator;
        this.target = params.target;
        this.body = params.body;
        this.pos = params.pos;
		this.entityId = params.entityId;
        this.player = params.player;
        if(this.body){
            this.contactNormal = new CANNON.Vec3();
            this.upAxis = new CANNON.Vec3(0, 1, 0);
            
            this.body.addEventListener("collide", function (e){
				
                if ( !((e.contact.bi.isBullet &&(e.contact.bi.isBullet != this.entityId )) || (e.contact.bj.isBullet &&(e.contact.bj.isBullet != this.entityId ))))
                    return;
				
                if (e.contact.bi.id == this.body.id)
                    e.contact.ni.negate(this.contactNormal);
                else
                    this.contactNormal.copy(e.contact.ni);
                
                var direction = this.contactNormal.dot(this.upAxis)
                if (direction > 0.5){
                    this.hittedDown();
                } else if (direction < -0.5){
                    this.hittedUp();
                } else {
                    this.hitted();
                }
            }.bind(this));
        }
    }

    collected(){}
    hitted(){}
    hittedUp(){this.hitted()}
    hittedDown(){this.hitted()}
    update(timeInSeconds){}
}
	
class SmallZombieEntity extends Entity{
	constructor(params){
		super(params);
		
		this.scoreAdministrator = params.scoreAdministrator;
		this.maxDistance = params.maxDistance;
		this.person = params.person;
        this.hit = 0;

		this.controls = new AIMonitor({
			administrator: this.ADMINISTRATOR,
			person: this.person,
			entity: this,
			target: this.target,
			body: this.body,
			player: this.player,
			maxDistance: this.maxDistance,
			bulletAdministrator: this.entityAdministrator.bulletAdministrator,
			scoreAdministrator: this.scoreAdministrator,
		});
	}

	hitted(){
			if(this.ADMINISTRATOR.godMode == false){
				this.hit ++;
				if(this.hit == 2){
					this.scoreAdministrator.enemyKilled();
					this.person.startDeath();
					this.deathCount = true;
					this.death = Date.now();
				}
			}
			else{
				this.hit ++;
				if(this.hit == 1){
					this.scoreAdministrator.enemyKilled();
					this.person.startDeath();
					this.deathCount = true;
					this.death = Date.now();
				}
			}
		}
	update(timeInSeconds){
			this.controls.update(timeInSeconds);

			if(this.body.position.y < -20){
				this.scoreAdministrator.enemyKilled();
				this.entityAdministrator.deleteOneEntity(this);
			}
			
			var now = Date.now();
			if(this.deathCount && ((now - this.death)>this.person.deathSpeed))this.entityAdministrator.deleteOneEntity(this);
				
		}
}

class GiantZombieEnity extends SmallZombieEntity{
    constructor(params){
        super(params);
    }
	
	hitted(){
			if(this.ADMINISTRATOR.godMode == false){
				this.hit ++;
				if(this.hit == 10){
					this.scoreAdministrator.enemyKilled();
					this.person.startDeath();
					this.deathCount = true;
					this.death = Date.now();
				}
			}
			else{
				this.hit ++;
				if(this.hit == 1){
					this.scoreAdministrator.enemyKilled();
					this.person.startDeath();
					this.deathCount = true;
					this.death = Date.now();
				}
			}
		}

}

class PlayerEntity extends Entity{
	constructor(params){
		super(params);
		
		this.scoreAdministrator = params.scoreAdministrator;
		this.person = params.person;
	}
	hitted(){
		if(this.ADMINISTRATOR.godMode == false) this.scoreAdministrator.lose1life();
		else return;
		
        var audio = new Audio('resources/audios/Hitted.wav');
        audio.play();
	}
}
