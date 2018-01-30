function loadPlayer(){

	BABYLON.SceneLoader.ImportMesh("","../assets/player/","Vincent.babylon",scene,(meshes,particleSystems,skeletons)=>{

		var skeleton = skeletons[0];
		skeleton.enableBlending(0.2);
		setAnimationRanges(skeleton);

		var player = meshes[0];
		player.skeleton = skeleton;
		player.position = new BABYLON.Vector3(0,12,0);
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
		var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera",alpha,beta,5,target,scene);
		camera.wheelPrecision = 15;
		camera.checkCollisions = true;
		camera.keysLeft=[];
		camera.keysRight=[];
		camera.keysUp=[];
		camera.keysDown=[];
		camera.attachControl(canvas,false);

		var CharacterController = org.ssatguru.babylonjs.component.CharacterController;
		var cc = new CharacterController(player,camera,scene);
		cc.setCameraTarget(new BABYLON.Vector3(0,1.5,0));
		camera.lowerRadiusLimit=2;
		camera.upperRadiusLimit=20;
		cc.setNoFirstPerson(false);

		cc.setIdleAnim("idle",1,true);
		cc.setTurnLeftAnim("turnLeft",0.5,true);
		cc.setTurnRightAnim("turnRight",0.5,true);
		cc.setWalkBackAnim("walkBack",0.5,true);
		cc.setJumpAnim("jump",4,false);
		cc.setFallAnim("fall",2,false);
		cc.setSlideBackAnim("slideBack",1,false)
		cc.start();

		engine.runRenderLoop(function(){
			scene.render();
		});

	});
}


function setAnimationRanges(skel){
	delAnimRanges(skel);
   
	skel.createAnimationRange("fall",0,16);
	skel.createAnimationRange("idle",21,65);
	skel.createAnimationRange("jump",70,94);
	skel.createAnimationRange("run",100,121);
	skel.createAnimationRange("slideBack",125,129);
	skel.createAnimationRange("strafeLeft",135,179);
	skel.createAnimationRange("strafeRight",185,229);
	skel.createAnimationRange("turnLeft",240,262);
	skel.createAnimationRange("turnRight",270,292);
	skel.createAnimationRange("walk",300,335);
	skel.createAnimationRange("walkBack",340,366);
}
/*
 * delete all existing ranges
 * @param {type} skel
 * @returns {undefined}
 */
function delAnimRanges(skel){
	let ars = skel.getAnimationRanges();
	let l = ars.length;
	for(let i = 0;i<l;i++){
		let ar = ars[i];
		console.log(ar.name+","+ar.from+","+ar.to);
		skel.deleteAnimationRange(ar.name,false);
	}

}

function createGround(scene){
	let groundMaterial = createGroundMaterial(scene);
	BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","../assets/ground/ground_heightMap.png",{
		width:128,
		height:128,
		minHeight:0,
		maxHeight:10,
		subdivisions:32,
		onReady:(grnd)=>{
			grnd.material = groundMaterial;
			grnd.checkCollisions = true;
			grnd.isPickable = true;
			grnd.freezeWorldMatrix();
		}

	},scene);
}

function createGroundMaterial(scene){
	let groundMaterial = new BABYLON.StandardMaterial("groundMat",scene);
	groundMaterial.diffuseTexture = new BABYLON.Texture("../assets/ground/ground.jpg",scene);
	groundMaterial.diffuseTexture.uScale = 4.0;
	groundMaterial.diffuseTexture.vScale = 4.0;
	
	groundMaterial.bumpTexture = new BABYLON.Texture("../assets/ground/ground-normal-0.png",scene);
	groundMaterial.bumpTexture.uScale = 12.0;
	groundMaterial.bumpTexture.vScale = 12.0;
	
	groundMaterial.diffuseColor = new BABYLON.Color3(0.9,0.6,0.4);
	groundMaterial.specularColor = new BABYLON.Color3(0,0,0);
	return groundMaterial;
}

/*
 * The scene
 */
var canvas = document.querySelector("#renderCanvas");
var engine = new BABYLON.Engine(canvas,true);
var scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.75,0.75,0.75);
scene.ambientColor = new BABYLON.Color3(1,1,1);

var light = new BABYLON.HemisphericLight("light1",new BABYLON.Vector3(0,1,0),scene);
light.intensity = .3;

var light2=new BABYLON.DirectionalLight("light2",new BABYLON.Vector3(-1,-1,-1),scene);
light2.position=new BABYLON.Vector3(0,128,0);
light2.intensity = .7;

var ground = createGround(scene);

window.addEventListener("resize",function(){
	engine.resize();
});