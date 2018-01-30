var engine;
var canvas;


var createScene = function () { 
             // Scene 
             var scene = new BABYLON.Scene(engine); 
             // Camera 
             
             var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(29, 13, 23), scene); 
             camera.setTarget(new BABYLON.Vector3(0, 0, 0)); 
             camera.attachControl(canvas); 
             
             // Light 
             var light = new BABYLON.PointLight("Point", new BABYLON.Vector3(-60, 60, 80), scene); 
             light.intensity = 1; 
             
             // Textures 
             var diffuseTexture = new BABYLON.Texture("../assets/floor.png", scene); 
             diffuseTexture.vScale = diffuseTexture.uScale = 5.0; 
             var boxTexture = new BABYLON.Texture("../assets/wood.jpg", scene); 
             
             // Materials 
             var planeMaterial = new BABYLON.StandardMaterial("plane_material", scene); 
             planeMaterial.diffuseTexture = diffuseTexture; 
             var boxMaterial = new BABYLON.StandardMaterial("box_material", scene); 
             boxMaterial.diffuseTexture = boxTexture; 
             
             // Meshes 
			 var plane = BABYLON.Mesh.CreateGround("ground", 100, 100, 2, scene); 
             plane.material = planeMaterial; 
             var box = BABYLON.Mesh.CreateBox("box", 5, scene); 
             box.refreshBoundingInfo(); 
             box.position.y = 2.5; 
             box.material = boxMaterial; 
			 
			// Player
            BABYLON.SceneLoader.ImportMesh("","../assets/player/","Vincent.babylon",scene,(meshes,particleSystems,skeletons)=>{

				var skeleton = skeletons[0];
				skeleton.enableBlending(0.2);


				var player = meshes[0];
				player.skeleton = skeleton;
				player.position = new BABYLON.Vector3(0,5,0);
				player.checkCollisions = true;
				player.ellipsoid = new BABYLON.Vector3(0.5,1,0.5);
				player.ellipsoidOffset = new BABYLON.Vector3(0,1,0);

				var sm = player.material;
				if(sm.diffuseTexture!=null){
					sm.backFaceCulling = true;
					sm.ambientColor = new BABYLON.Color3(1,1,1);
				}

				var alpha = -player.rotation.y-4.69;
				var beta = Math.PI/2.5;
				var target = new BABYLON.Vector3(player.position.x,player.position.y+1.5,player.position.z);

			});
				
             return scene; 
         };

var showError = function (errorMessage) {
	console.error(errorMessage);	
}


var run = function () {
	try { 

		if (!BABYLON.Engine.isSupported()) {
			showError("Your browser does not support WebGL");
			return;
		}

		if (engine) {
			engine.dispose();
			engine = null;
		}

		canvas = document.getElementById("renderCanvas");
		engine = new BABYLON.Engine(canvas, true);


		var scene;

		if (createScene) { // createScene
			scene = createScene();
			if (!scene) {
				showError("createScene function must return a scene.");
				return;
			}
		} else if (CreateScene) { // CreateScene
			scene = CreateScene();
			if (!scene) {
				showError("CreateScene function must return a scene.");
				return;
			}
		} else if (createscene) { // createscene
			scene = createscene();
			if (!scene) {
				showError("createscene function must return a scene.");
				return;
			}

		} 
		
		if (engine.scenes.length === 0) {
			showError("You must at least create a scene.");
			return;
		}

		if (engine.scenes[0].activeCamera == null) {
			showError("You must at least create a camera.");
			return;
		}


		engine.runRenderLoop(function () {
			if (engine.scenes.length === 0) {
				return;
			}

			if (canvas.width !== canvas.clientWidth) {
				engine.resize();
			}

			var scene = engine.scenes[0];

			if (scene.activeCamera || scene.activeCameras.length > 0) {
				scene.render();
			}

		});

	} catch (e) {
		showError(e.message);
	}
};

window.addEventListener("resize", function () {
	if (engine) {
		engine.resize();
	}
});