import {GLTFLoader} from './GLTFLoader.js';

//3d오브젝트를 렌더링할 HTML Element요소
let middle = document.querySelector('.middle');
//scene 객체 생성
const scene = new THREE.Scene();

//camera 세팅 
//시야각, 종횡비, near, far 
//near : 해당 값보다 가까이 있는 오브젝트는 랜더링하지 않음 / far : 해당값보다 멀리 있는 오브젝트는 렌더링하지 않음
const camera = new THREE.PerspectiveCamera( 75, middle.clientWidth / middle.clientHeight, 0.1, 1000 );
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( middle.clientWidth, middle.clientHeight );
middle.appendChild( renderer.domElement );

//컨트롤러 추가
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();


//빛 추가

const color = 'white';
const intensity = 1;
const ypos = 7;


const leftLight = new THREE.DirectionalLight(color, intensity);
leftLight.position.set(5, ypos, 0);

const rightLight = new THREE.DirectionalLight(color, intensity);
rightLight.position.set(-5, ypos, 0);

const frontLight = new THREE.DirectionalLight(color, intensity);
frontLight.position.set(0, ypos, 5);

const backLight = new THREE.DirectionalLight(color, intensity);
backLight.position.set(0, ypos, -5);


const gltfLoader = new GLTFLoader();
const url = './resources/landscape_gallery_by_stoneysteiner/scene.gltf';
gltfLoader.load(url, (gltf) => {
    const root = gltf.scene;
    scene.add(root);
	

	// 일단 상하좌우 조명설치
	// 추후 지붕에서 보이거나 액자마다 할 예정
	root.add(rightLight);
	root.add(leftLight);
	root.add(frontLight);
	root.add(backLight);


	root.add(camera);
	console.dir(root.children);
});


//화면 랜더링
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );	
}
animate();