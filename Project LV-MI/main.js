import {CharacterController} from './js/Controllers/CharacterController.js';
import {CharacterFactory} from './js/CharacterFactory.js';
import {EntityManager} from './js/EntityManager.js';
import {BulletManager} from './js/BulletManager.js';
import {ScoreManager} from './js/ScoreManager.js';

class gameManager {
	constructor(){
		
		this.gameStarted = false;
		
		this.gameEnable = false;
		
		this.APP = null;
		
		this.setOptionsDefault = function() {
			this.options = {
				mouseSensibility : 1,
				lifes: 100,
				enemyQuantity: 10,
				time: 180,
				viewfinder: true,
				velocityFactorDefault : 0.2,
			}
		}
		this.setOptionsDefault();
		
		this.velocityFactor = this.options.velocityFactorDefault;
	}
	
	getOptions() {return this.options;}
	getMouseSensibility() {return this.options.mouseSensibility;}
	getEnemyQuantity() {return this.options.enemyQuantity;}
	getLifes() {return this.options.lifes;}
	getTime() {return this.options.time;}
	getViewfinder() {return this.options.viewfinder;}
	getVelocityFactor() {return this.velocityFactor;}
	
	setOptions(options) {this.options = options;}
	
	resetVelocityFactor(){this.velocityFactor = this.options.velocityFactorDefault;}
	multiplyVelocityFactor(val = 2) {this.velocityFactor = this.options.velocityFactorDefault*val;}
	
	startGame() {
		this.gameStarted = true;
		this.APP = new gameEnvironment();
	}
	
	endGame(params) {
		this.APP = new gameOverEnvironment(params);
	}
	
}



class MenuEnvironment {
	constructor() {
		this.game = document.getElementById("game");
		
		this.playGameButton = document.getElementById("playGameButton");
		this.settingButton = document.getElementById("settingsButton");
		
		this.setting = document.getElementById("settings");
		this.exitSettings = document.getElementById("exitSettings");
		this.confirmSettings = document.getElementById("confirmSettings");
		this.resetSettings = document.getElementById("resetSettings");
		
		this.difficultyEasy = document.getElementById("easyMode");
		this.difficultyNormal = document.getElementById("normalMode");
		this.difficultyHard = document.getElementById("hardMode");
		
		this.sliderMouseSens = document.getElementById("sliderMouseSens");
		this.sliderLifes = document.getElementById("sliderLifes");
		this.sliderEnemys = document.getElementById("sliderEnemys");
		this.sliderTime = document.getElementById("sliderTime");
		
		this.wiewfinderCkBox = document.getElementById("wiewfinderCkBox");

		this.setUpMainButtons();
		this.setUpSettingButton();
		this.giveValueFromCookie();
	}
	
	setUpMainButtons() {
		this.game.style.display = "none";
		this.playGameButton.addEventListener("click", () => {
			this.game.style.display = "block"
            this.game.style.bottom = "0px";
            this.game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            MANAGER.startGame();
        }, false);
		this.setting.style.display = "none";
		this.settingButton.addEventListener("click", () => {
			this.updateAllSlider();
			this.setting.style.display = "block"
            this.setting.style.bottom = "0px";
            this.setting.style.animation = "1s newPage normal";
            document.activeElement.blur();		
        }, false);
	}
	setUpSettingButton() {
		this.exitSettings.addEventListener("click", this.exitSetting.bind(this), false);
		this.confirmSettings.addEventListener("click", () => {
			this.updateAllOptions();
            var currentOptions = MANAGER.getOptions();
            document.cookie = "options={mouseSensibility:"+currentOptions.mouseSensibility+
				", lifes:"+currentOptions.lifes+
                ", enemyQuantity:"+currentOptions.enemyQuantity+
                ", time:"+currentOptions.time+
				", viewfinder"+currentOptions.viewfinder+"};";
			this.exitSetting();
        }, false);
		this.resetSettings.addEventListener("click", () => {
			MANAGER.setOptionsDefault();
			this.updateAllSlider();
        }, false);
		this.difficultyEasy.addEventListener("click", this.setDifficulty.bind(this,0), false);
		this.difficultyNormal.addEventListener("click", this.setDifficulty.bind(this,1), false);
		this.difficultyHard.addEventListener("click", this.setDifficulty.bind(this,2), false);
	}
	giveValueFromCookie() {
		var cookieSettings = this.getCookie("options");
        if(cookieSettings != null){
            var data = cookieSettings.slice(1, cookieSettings.length-1).split(", ");

            MANAGER.setOptions({
                mouseSensibility: parseFloat(data[0].split(":")[1]),
                lifes: parseFloat(data[1].split(":")[1]),
                enemyQuantity: parseFloat(data[2].split(":")[1]),
                time: parseFloat(data[3].split(":")[1]),
				viewfinder: (data[4].split(":")[1] === 'true'),
				velocityFactorDefault: 0.2,
            });
        }
	}
	
	getCookie(name){
        var elem = document.cookie.split("; ").find(row => row.startsWith(name))
        if(elem == null)
            return null;
        return elem.split('=')[1];
    }
	exitSetting() {
		this.setting.style.display = "none";
		document.activeElement.blur();
	}
	updateAllSlider() {
		var curOptions = MANAGER.getOptions();
		this.sliderMouseSens.value = curOptions.mouseSensibility;
		this.sliderLifes.value = curOptions.lifes;
		this.sliderEnemys.value = curOptions.enemyQuantity;
		this.sliderTime.value = curOptions.time;
		this.wiewfinderCkBox.checked = curOptions.viewfinder;
	}
	updateAllOptions() {
		MANAGER.setOptions({
			mouseSensibility: parseFloat(this.sliderMouseSens.value),
			lifes: parseFloat(this.sliderLifes.value),
			enemyQuantity: parseFloat(this.sliderEnemys.value),
			time: parseFloat(this.sliderTime.value),
			viewfinder: this.wiewfinderCkBox.checked,
			velocityFactorDefault: 0.2,
		});
	}
	setDifficulty(difficulty) {
		switch(difficulty){
			case 0:		//easy
				var options = {
					mouseSensibility : 1,
					lifes: 10,
					enemyQuantity: 10,
					time: 180,
					viewfinder: true,
					velocityFactorDefault : 0.2,
				}
				break
			case 1:		//normal
				var options = {
					mouseSensibility : 1,
					lifes: 5,
					enemyQuantity: 25,
					time: 150,
					viewfinder: true,
					velocityFactorDefault : 0.2,
				}
				break;
			case 2:		//hard
				var options = {
					mouseSensibility : 1,
					lifes: 2,
					enemyQuantity: 50,
					time: 120,
					viewfinder: false,
					velocityFactorDefault : 0.2,
				}
				break
		}
		MANAGER.setOptions(options);
		this.updateAllSlider();
	}
}

function searchInChild(root, name) {
	if(root.name == name) return root;
	if(root.children == null) return null;
	for(let i in root.children) {
		var result = searchInChild(root.children[i],name);
		if(result!=null) return result;
	}
	return null;
}


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function checkPositions(forbiddens, newPosition){
	var around = 10;
	for (var i = 0; i<forbiddens.length; i++){
		var forbiddenX = forbiddens[i].x;
		var forbiddenZ = forbiddens[i].z;
		if(((newPosition[0] < (forbiddenX-around))||(newPosition[0] > (forbiddenX+around))) && ((newPosition[1] < (forbiddenZ-around))||(newPosition[1] > (forbiddenZ+around)))){
				console.log("true");
				return true;
		}
		else{
			console.log("false");
			return false;
		}
	}
}

function mapGenerator(world, scene, boxes, boxMeshes, spheres, sphereMeshes, models){
	
    var halfExtentsBox = new CANNON.Vec3(5,3,0.5);
    var boxShape = new CANNON.Box(halfExtentsBox);
    var boxGeometry = new THREE.BoxGeometry(halfExtentsBox.x*2,halfExtentsBox.y*2,halfExtentsBox.z*2);

    var halfExtentsSphere = new CANNON.Vec3 (10, 20, 20);
    var sphereShape = new CANNON.Sphere(halfExtentsSphere.x);
    var sphereGeometry = new THREE.SphereGeometry(halfExtentsSphere.x, 20, 20);

	var x = 0;
	var y = 0;
	var z = 0;
	var genFactor = 0;
	var spawn = new CANNON.Vec3(0, 1.6, 0);
	var forbiddenPositions = [spawn];
	var currentPos = [];
	
	for(var i=0; i<150; i++){
		x = (Math.random()-0.5)*300;
		y = 0;
		z = (Math.random()-0.5)*300;
		currentPos = [x,z];
		if(checkPositions(forbiddenPositions, currentPos)){
			genFactor = getRandomIntInclusive(1, 3);
			
			switch(genFactor){
								
				case 1:
					y = 1;
					var boxBody = new CANNON.Body({ mass: 0 });
					boxBody.addShape(boxShape);
					var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
					var material2 = new THREE.MeshLambertMaterial( { color: randomColor } );
					var boxMesh = new THREE.Mesh( boxGeometry, material2 );
					world.add(boxBody);
					scene.add(boxMesh);
					boxBody.position.set(x,y,z);
					boxMesh.position.set(x,y,z);
					console.log(boxBody.position);
					forbiddenPositions.push(boxBody.position);
					boxMesh.castShadow = true;
					boxMesh.receiveShadow = true;
					boxes.push(boxBody);
					boxMeshes.push(boxMesh);
					break;
				
				case 2:
					y = -7;
					var sphereBody = new CANNON.Body({ mass: 0 });
					sphereBody.addShape(sphereShape);
					var material2 = new THREE.MeshLambertMaterial( { map: new THREE.TextureLoader().load('resources\\images\\field.png'), side: THREE.DoubleSide } );
					var sphereMesh = new THREE.Mesh(sphereGeometry, material2);
					world.add(sphereBody);
					scene.add(sphereMesh);
					sphereBody.position.set(x,y,z);
					sphereMesh.position.set(x,y,z);
					forbiddenPositions.push(sphereBody.position);
					sphereMesh.castShadow = true;
					sphereMesh.receiveShadow = true;
					spheres.push(sphereBody);
					sphereMeshes.push(sphereMesh);
					break;
				
				case 3:
					var genFactor1 = getRandomIntInclusive(1, 7);
					var tree;
					console.log(genFactor1);
					switch(genFactor1){
						case 1: tree = models["albero1"].model.clone();
							break;
						case 2: tree = models["albero2"].model.clone();
							break;
						case 3: tree = models["albero3"].model.clone();
							break;
						case 4: tree = models["albero4"].model.clone();
							break;
						case 5: tree = models["albero5"].model.clone();
							break;
						case 6: tree = models["albero6"].model.clone();
							break;
						case 7: tree = models["albero7"].model.clone();
							break;
					}
					scene.add(tree);
					tree.position.set(x, y, z);
					var halfExtents2 = new CANNON.Vec3(1.5, 4, 1.5);
					var treeShape = new CANNON.Box(halfExtents2);
					var treeBody = new CANNON.Body({ mass: 0 });
					treeBody.addShape(treeShape);
					treeBody.position.set(x, 2, z);
					world.add(treeBody);
					forbiddenPositions.push(tree.position);
					break;
			}
		}	
	}
}


class gameEnvironment {
	constructor() {
		this.models = {};
		this.load();
		
		this.scoreManager = new ScoreManager({
			lifesTarget: document.getElementById("lifesSpanGame"),
			timeTarget: document.getElementById("timeSpanGame"),
			enemyTarget: document.getElementById("enemySpanGame"),
			ammoTarget: document.getElementById("ammoSpanGame"),
			lifes: MANAGER.getLifes(), numEnemy: MANAGER.getEnemyQuantity(),
			time: MANAGER.getTime(),
		})
	}
	
	load() {
		var promise = [
            this.getModel('Pistola/scene.gltf', 5.0),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_03'),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_04'),
            this.getModel('Guns/scene.gltf', 0.0006, 'Weapon_06'),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_08'),
			this.getModel('alberi/scene.gltf', 2, "_1_tree"),
			this.getModel('alberi/scene.gltf', 1, "_2_tree"),
			this.getModel('alberi/scene.gltf', 1, "_3_tree"),
			this.getModel('alberi/scene.gltf', 1, "_4_tree"),
			this.getModel('alberi/scene.gltf', 1, "_5_tree"),
			this.getModel('alberi/scene.gltf', 1, "_6_tree"),
			this.getModel('alberi/scene.gltf', 1, "_7_tree"),
		];

		Promise.all(promise).then(data => {
            var nameModels = [
                "Pistola",
				"ak47",
				"pistol",
				"sniper",
				"rpg",
				"albero1",
				"albero2",
				"albero3",
				"albero4",
				"albero5",
				"albero6",
				"albero7"
				
            ];

			for(let i in nameModels){
                this.models[nameModels[i]] = {};
                this.models[nameModels[i]].model = data[i];
                this.models[nameModels[i]].name = nameModels[i];
            }
			
			setTimeout(this.init(), 3000);
		}, error => {
            console.log('An error happened:', error);
        });
	}

	getModel(path, scale=1.0, childName=null) {
        const myPromise = new Promise((resolve, reject) => {
            const gltfLoader = new THREE.GLTFLoader();
            gltfLoader.load("./resources/models/" + path, (gltf) => {
				var mesh;
                if (childName == null)
                    mesh = gltf.scene;
				else
					mesh = searchInChild(gltf.scene, childName)
				if (mesh == null)
					throw 'Error in searching ' + childName + ' in ' + path;

                mesh.traverse(c => {
                    c.castShadow = true;
                });

                mesh.scale.setScalar(scale);

                resolve(mesh);
            },
                function (xhr) {
                },
                function (error) {
                    console.log('An error happened');
                    reject(error);
                });
        });
        return myPromise;
    }
	
	
	changeVisual() {
		this.activeCamera = (this.activeCamera+1)%2;
	}
	
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera2.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.camera2.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	/*DA QUI è WORK IN PROGRESS FINO ALLA LINEA ---------------*/
	locker() {
		document.getElementById("loading").style.display = "none";
		
		var blocker = document.getElementById( 'blocker' );
		var pauseCanvas = document.getElementById( 'PauseCanvas' );
		var resumeButton = document.getElementById( 'resumeButton' );
		
		if(MANAGER.getViewfinder())
			document.getElementById('viewfinder').style.display = 'block'
		else
			document.getElementById('viewfinder').style.display = 'none'

		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		if ( havePointerLock ) {

			var element = document.body;

			var pointerlockchange = function ( event ) {
				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
					MANAGER.gameEnable = true;
					
					if(this.pauseTime){
						this.scoreManager.addPauseTime(Date.now()-this.pauseTime);
					}
					
					blocker.style.display = 'none';
					pauseCanvas.style.display = 'none';

				} else {
					this.pauseTime = Date.now();
					MANAGER.gameEnable = false;

					pauseCanvas.style.display = '-webkit-flex';
					pauseCanvas.style.display = '-moz-flex';
					pauseCanvas.style.display = 'flex';

				}

			}

			var pointerlockerror = function ( event ) {
				pauseCanvas.style.display = '-webkit-flex';
				pauseCanvas.style.display = '-moz-flex';
				pauseCanvas.style.display = 'flex';
			}

			// Hook pointer lock state change events
			document.addEventListener( 'pointerlockchange', pointerlockchange.bind(this), false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange.bind(this), false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange.bind(this), false );

			document.addEventListener( 'pointerlockerror', pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				instructions.style.display = 'none';

				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

				if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

							element.requestPointerLock();
						}

					}

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

					element.requestFullscreen();

				} else {

					element.requestPointerLock();

				}
				
		} else {

			instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

		}
		
		resumeButton.addEventListener('click', () => {
            element.requestPointerLock();
        }, false)
	}
		
	update() {
		var dt = 1/60;
		this.world.step(dt);
		
		var time = Date.now() - this.time;
		
		this.scoreManager.updateCurrTime(Date.now());
        if(this.scoreManager.isGameOver()){
			cancelAnimationFrame(this.animationFrameID);
            document.exitPointerLock();
            MANAGER.endGame({
                win: this.scoreManager.isWin(),
                enemyKilled: this.scoreManager.getEnemyKilled(),
				numEnemy: this.scoreManager.getNumEnemy(),
                time: this.scoreManager.getRemaningTime(),
            });
            return;
        }
		
		this.entityManager.update(time);
		this.bulletManager.update(time)
		//this.controls.update( Date.now() - this.time );
		
		// Update ball positions
		for(var i=0; i<this.balls.length; i++){
			this.ballMeshes[i].position.copy(this.balls[i].position);
			this.ballMeshes[i].quaternion.copy(this.balls[i].quaternion);
		}

		// Update box positions
		for(var i=0; i < this.boxes.length; i++){
			this.boxMeshes[i].position.copy(this.boxes[i].position);
			this.boxMeshes[i].quaternion.copy(this.boxes[i].quaternion);
		}

		// Update sphere positions
		for(var i=0; i < this.spheres.length; i++){
			this.sphereMeshes[i].position.copy(this.spheres[i].position);
			this.sphereMeshes[i].quaternion.copy(this.spheres[i].quaternion);
		}
		TWEEN.update()
	}

	//Draw Scene
	render() {
		this.controls.update( Date.now() - this.time );
		if(this.activeCamera==0)
			this.renderer.render( this.scene, this.camera );
		else
			this.renderer.render( this.scene, this.camera2 );
		this.time = Date.now();
	}

	//Run game loop (update, render, repet)
	GameLoop() {
		this.animationFrameID = requestAnimationFrame(this.GameLoop.bind(this));
		if(MANAGER.gameEnable){
			this.update();
			this.render();
        }
	}
//---------------------------------------------------------------------
	
	init() {
		this.world = this.initCannon();
			
		this.camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.15, 1000 );
		
		this.camera2 = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera2.translateY(4)
		this.camera2.rotation.x = -Math.PI/10;
		
		this.activeCamera = 0;

		this.scene = new THREE.Scene();
		//this.scene.fog = new THREE.Fog( 0x000000, 0, 500 );
		
		this.bulletManager = new BulletManager({manager: MANAGER, world: this.world, scene: this.scene});
		this.entityManager = new EntityManager({scene: this.scene, world: this.world, manager: MANAGER,scoreManager: this.scoreManager ,bulletManager: this.bulletManager})

		var ambient = new THREE.AmbientLight( 0x666666 );
		this.scene.add( ambient );
		/* //Old light
		this.light = new THREE.SpotLight( 0x666666 );
		this.light.position.set( 10, 30, 20 );
		this.light.target.position.set( 0, 0, 0 );
		if(true){
			this.light.castShadow = true;

			this.light.shadow.camera.near = 20;
			this.light.shadow.camera.far = 50;//camera.far;
			this.light.shadow.camera.fov = 40;

			this.light.shadowMapBias = 0.1;
			this.light.shadowMapDarkness = 0.7;
			this.light.shadow.mapSize.width = 2*512;
			this.light.shadow.mapSize.height = 2*512;

			//light.shadowCameraVisible = true;
		}*/
		
		this.tourch = new THREE.SpotLight(0xffffff);
		this.tourch.angle = Math.PI/4
		this.tourch.distance = 100;
		this.tourch.penumbra = 0.3;
		this.tourch.intensity = 1.5;
		if(true){
			this.tourch.castShadow = true;

			this.tourch.shadow.camera.near = 3.5;
			this.tourch.shadow.camera.far = 50;//camera.far;
			this.tourch.shadow.camera.fov = 40;

			this.tourch.shadowMapBias = 0.1;
			this.tourch.shadowMapDarkness = 0.7;
			this.tourch.shadow.mapSize.width = 2*512;
			this.tourch.shadow.mapSize.height = 2*512;

			this.tourch.shadowCameraVisible = true;
		}
		  this.tourch.position.set(0, 1.5, 0);
		  this.tourch.target.position.set(0, 1.5, -1);
		  
		
		this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById( 'canvas' ), antialias: true});
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		//this.renderer.setClearColor( this.scene.fog.color, 1 );
		this.renderer.setClearColor( 0xffffff, 0);

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

		//skybox
		var skyBoxGeometry = new THREE.BoxGeometry(900,900,900);
		var skyBoxMaterials = [
			new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources\\images\\sB-front.png'), side: THREE.DoubleSide, dithering: true}),
			new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources\\images\\sB-back.png'), side: THREE.DoubleSide, dithering: true}),
			new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources\\images\\sB-up.png'), side: THREE.DoubleSide, dithering: true}),
			new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources\\images\\sB-down.png'), side: THREE.DoubleSide, dithering: true}),
			new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources\\images\\sB-right.png'), side: THREE.DoubleSide, dithering: true}),
			new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('resources\\images\\sB-left.png'), side: THREE.DoubleSide, dithering: true}),
		];

		//var skyBoxMaterial = new THREE.MeshFaceMaterial(skyBoxMaterials);
		var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterials);
		skyBox.position.set(0, 300, 0);
		this.scene.add(skyBox);

		// floor
		var geometry = new THREE.PlaneGeometry( 300, 300, 300, 50);
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
		

		//var material = new THREE.MeshLambertMaterial( { color: 0xeeee00 } );
		//var material = new THREE.MeshPhongMaterial( { color: 0xeeee00, dithering: true } );
		var groundTexture = new THREE.TextureLoader().load('resources\\images\\field.png');
		groundTexture.wrapS = THREE.RepeatWrapping;
		groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat = new THREE.Vector2(10,10);
		
		var material = new THREE.MeshPhongMaterial( { map: groundTexture , dithering: true } );

		var mesh = new THREE.Mesh( geometry, material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		this.scene.add(mesh);
		
		

		this.boxes = [];
		this.boxMeshes = [];

		this.spheres = [];
		this.sphereMeshes = [];

		this.balls = [];
		this.ballMeshes=[];

		// Add Borders

		for(var i=0; i<4; i++){

			if(i==0 || i==1){
			var halfExtents = new CANNON.Vec3(150,5,2);
			var boxShape = new CANNON.Box(halfExtents);
			var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
			console.log("I = 3-")
			}

			if(i==2 || i==3){
			var halfExtents = new CANNON.Vec3(2,5,150);
			var boxShape = new CANNON.Box(halfExtents);
			var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
			console.log("I = 2-")
			}

			if(i==0){
				var x = 0;
				var y = 5;
				var z = 150;
			}

			if(i==1){
				var x = 0;
				var y = 5;
				var z = -150;
			}

			if(i==2){
				var x = 150;
				var y = 5;
				var z = 0;
				console.log("I = 2")
			}

			if(i==3){
				var x = -150;
				var y = 5;
				var z = 0;
				console.log("I = 3")

			}

			var boxBody = new CANNON.Body({ mass: 0 });
			boxBody.addShape(boxShape);
			//var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
			var wallTexture = new THREE.TextureLoader().load('resources\\images\\wallBrick.png');
			wallTexture.wrapS = THREE.RepeatWrapping;
			wallTexture.wrapT = THREE.RepeatWrapping;
			wallTexture.repeat = new THREE.Vector2(10,1);

			var material2 = new THREE.MeshLambertMaterial( { map: wallTexture, dithering: true } );
			var boxMesh = new THREE.Mesh( boxGeometry, material2 );

			if(i==2){
				//boxMesh.rotateY = Math.PI/2;
				//boxMesh.rotation.z = Math.PI/2;
				console.log("I = 2+")

			}
			if(i==3){
				//boxMesh.rotation.y = - Math.PI/2;
				//boxMesh.rotation.z = - Math.PI/2;
				console.log("I = 3+")

			}

			this.world.add(boxBody);
			this.scene.add(boxMesh);
			boxBody.position.set(x,y,z);
			boxMesh.position.set(x,y,z);
			boxMesh.castShadow = true;
			boxMesh.receiveShadow = true;
			this.boxes.push(boxBody);
			this.boxMeshes.push(boxMesh);
		}
		
		
		// Add boxes
		var halfExtents = new CANNON.Vec3(1,1,1);
		var boxShape = new CANNON.Box(halfExtents);
		var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
		for(var i=0; i<7; i++){
			var x = 100;
			var y = 5;
			var z = 100;
			var boxBody = new CANNON.Body({ mass: 0 });
			boxBody.addShape(boxShape);
			//var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
			var color = '#CAA472'
			var material2 = new THREE.MeshLambertMaterial( { color: color } );
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
		/*
		
		var halfExtents = new CANNON.Vec3(10,10,10); // regolando questo facciamo altre figure
		//var boxShape = new CANNON.Box(halfExtents);
		var sphereShape = new CANNON.Sphere(halfExtents.x);
		//var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
		var sphereGeometry = new THREE.SphereGeometry(halfExtents.x, 10, 10);
		for(var i = 0; i < 10; i++){
			var x = 20;
			var y = -1;
			var z = 20;
			var randomColor = '#FFFF00';
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
		*/
		
		mapGenerator(this.world, this.scene, this.boxes, this.boxMeshes, this.spheres, this.sphereMeshes, this.models);
		
		
		//Add personaggio
		var gunsPlayer = [CharacterFactory.GUN_PISTOL, "ak47", "sniper", "rpg"];
		var playerStartPosition = [0, 1.6, 0];
		this.playerEntity = this.entityManager.addEntityAndReturn({name: EntityManager.ENTITY_PLAYER, guns : gunsPlayer, position: playerStartPosition})
		this.playerEntity.character.getMesh().add(this.tourch);
		this.playerEntity.character.getMesh().add(this.tourch.target);
		this.entityManager.setPlayer(this.playerEntity);
		//this.person = new CharacterFactory({manager : MANAGER, guns : [CharacterFactory.GUN_PISTOL, "ak47", "sniper", "rpg"]});

		this.controls = new CharacterController({manager: MANAGER, entity: this.playerEntity, camera: this.camera, bulletManager: this.bulletManager, scoreManager: this.scoreManager});
		
		this.scene.add(this.controls.getObject());
		
		this.spawnEnemy();
		/*
		// Add linked boxes
		var size = 0.5;
		var he = new CANNON.Vec3(size,size,size*0.1);
		var boxShape = new CANNON.Box(he);
		var mass = 0;
		var space = 0.1 * size;
		var N = 5, last;
		var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
		for(var i=0; i<N; i++){
			var boxbody = new CANNON.Body({ mass: mass });
			var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
			material2 = new THREE.MeshBasicMaterial( { color: randomColor } );
			//console.log (randomColor);
			boxbody.addShape(boxShape);
			var boxMesh = new THREE.Mesh(boxGeometry, material2);
			boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
			boxbody.linearDamping = 0.01;
			boxbody.angularDamping = 0.01;
			// boxMesh.castShadow = true;
			boxMesh.receiveShadow = true;
			this.world.add(boxbody);
			this.scene.add(boxMesh);
			this.boxes.push(boxbody);
			this.boxMeshes.push(boxMesh);

			if(i!=0){
				// Connect this body to the last one
				var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
				var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
				this.world.addConstraint(c1);
				this.world.addConstraint(c2);
			} else {
				mass=0.3;
			}
			last = boxbody;
		}
		*/
		this.locker();
		var time = Date.now();
		this.scoreManager.setStartTime(time);
        this.scoreManager.updateCurrTime(time);
		
		this.GameLoop();
	}
	
	spawnEnemy() {
		for(let i=0;i<MANAGER.getEnemyQuantity();i++) {
			var gun = CharacterFactory.GUN_ALL[Math.floor(Math.random()*CharacterFactory.GUN_ALL.length)];
			var minDistanceSquared = 625;
			var position = [0,2.5,0];
			position[0] = Math.random()*2-1;
			position[2] = Math.random()*2-1;
			var distanceSquared = position[0]*position[0]+position[2]*position[2];
			var factor = Math.sqrt(minDistanceSquared/distanceSquared);
			position[0] *= (factor+Math.random()*100);
			position[2] *= (factor+Math.random()*100);
			this.entityManager.addEntity({name: EntityManager.ENTITY_SIMPLE_ENEMY, guns: [gun], position: position, maxDistance: 25});
		}
	}
	
	initCannon() {
		var world = new CANNON.World();
		world.quatNormalizeSkip = 0;
		world.quatNormalizeFast = false;

		var solver = new CANNON.GSSolver();

		world.defaultContactMaterial.contactEquationStiffness = 1e9;
		world.defaultContactMaterial.contactEquationRelaxation = 4;

		solver.iterations = 7;
		solver.tolerance = 0.1;
		var split = true;
		if(split)
			world.solver = new CANNON.SplitSolver(solver);
		else
			world.solver = solver;

		world.gravity.set(0, -20, 0);
		world.broadphase = new CANNON.NaiveBroadphase();

		// Create a slippery material (friction coefficient = 0.0)
		var physicsMaterial = new CANNON.Material();
		var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
																physicsMaterial,
																0.0, // friction coefficient
																0.3  // restitution
																);
		// Create other non slippery Material
		var groundMaterial = new CANNON.Material();
		groundMaterial.friction = 200.0;
		
		// We must add the contact materials to the world
		world.addContactMaterial(physicsContactMaterial);
		
		// Create a plane
		var groundShape = new CANNON.Plane();
		var groundBody = new CANNON.Body({ mass: 0 });
		groundShape.material = groundMaterial;
		groundBody.addShape(groundShape);
		groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
		groundBody.isGround = true;
		world.add(groundBody);
		return world
	
		
	}



	setUpButtons() {
		 this.playGameButton.addEventListener("click", () => {
            this.game.style.bottom = "0px";
            this.game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            MANAGER.StartGame();
        }, false);
	}
}

class gameOverEnvironment {
    constructor(params){
        this.gameOver = document.getElementById("gameOver");

        this.gameOverResoult = document.getElementById("gameOverResoult");

        this.statsEnemy = document.getElementById("statsEnemy");
        //this._statsScore = document.getElementById("statsScore");
        this.statsTime = document.getElementById("statsTime");

        if(params.win){
            this.gameOverResoult.innerHTML ="You WIN";
        } else {
            this.gameOverResoult.innerHTML ="You LOSE";
        }

        this.statsEnemy.innerHTML = params.enemyKilled+"/"+params.numEnemy;
        //var score = ("0000" + params.score);
        //this._statsScore.innerHTML = score.substr(score.length-4);
        this.statsTime.innerHTML = parseInt(params.time / 60) + ":" + (params.time % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        
        this.gameOver.style.display = "block";
    }
}

var MANAGER = new gameManager();

window.addEventListener('DOMContentLoaded', () => {
    MANAGER.APP = new MenuEnvironment();
});
