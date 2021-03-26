import {GLTFLoader} from './GLTFLoader.js';

// 기본사용한는 전역변수
let scene, camera, renderer, controls, stats;
let container = document.querySelector('.middle');

let targetList = []; // 클릭할 객체 -> 액자안에 그림 배열
let projector, mouse = { x:0, y:0}; // 마우스 클릭시 x,y축을 저장

let init = () => {
    scene = new THREE.Scene();

    // 기본 세팅
    const CLIENT_WIDTH = container.clientWidth
    const CLIENT_HEIGHT = container.clientHeight;
    const VIEW_ANGLE = 45;
    const ASPECT = CLIENT_WIDTH / CLIENT_HEIGHT;
    const NEAR = 0.1;
    const FAR = 20000;

    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 2;

    // middle에 랜더한다
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(CLIENT_WIDTH,CLIENT_HEIGHT);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // 위,아래로 시점 변경불가능 설정
    controls.maxPolarAngle = controls.getPolarAngle();
    controls.minPolarAngle = controls.getPolarAngle();

    //줌속도 , 회전 속도 설정
    controls.panSpeed = 0.5;
    controls.rotateSpeed = 0.2;
    controls.update();

    const color = 'white';
    const intensity = 0.9;
    const ypos = 0.1;

    const leftLight = new THREE.DirectionalLight(color, intensity);
    leftLight.position.set(5, ypos, 0);

    const rightLight = new THREE.DirectionalLight(color, intensity);
    rightLight.position.set(-5, ypos, 0);

    const frontLight = new THREE.DirectionalLight(color, intensity);
    frontLight.position.set(0, ypos, 5);

    const backLight = new THREE.DirectionalLight(color, intensity);
    backLight.position.set(0, ypos, -5);

    let target;
    const gltfLoader = new GLTFLoader();
    const url = './resources/landscape_gallery_by_stoneysteiner/scene.gltf';
    gltfLoader.load(url, (gltf) => {
        const root = gltf.scene;
        scene.add(root);

        // 오브젝트 객체의 정보를 출력해준다
        console.dir(root.getObjectByName('Cube003'));

        // Cube003의 children은 액자인지 그림만인지... 하튼 객체 찾아냄
        target = root.getObjectByName('Cube003');
        for(let item of target.children){
            targetList.push(item);
        }
        // 상하좌우 조명설치
        root.add(rightLight);
	    root.add(leftLight);
	    root.add(frontLight);
	    root.add(backLight);
        root.add(camera);
    });

    document.addEventListener('click', onDocumentMouseDown,false);

}

let onDocumentMouseDown = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    console.log('Click.' + mouse.x + ' : ' + mouse.y);

    let vector = new THREE.Vector3(mouse.x , mouse.y , 1);
    let ray = new THREE.Raycaster();
    ray.setFromCamera( mouse, camera );
    let intersects = ray.intersectObjects( targetList);
    console.dir(intersects);
    if(intersects.length > 0){
        console.log('Hit @' + toString(intersects[0].point) + '\n'+ intersects[0].object.name);
        
        targetList.forEach((e) => {
            // 클릭했을때 눌린 객체가 그림인지 아닌지 확인하는 조건문
            if(e.name === intersects[0].object.name){
                e.geometry.center();
                console.dir(aa.getWorldPosition());

            }
        })
    }
}

// 백터 값사용시 x,y,z를 정리해서 출력해줌
let toString = (v) => {
     return "[ " + v.x + ", " + v.y + ", " + v.z + " ]";
}

let animate = () =>{
    requestAnimationFrame(animate);
    render();
}

let render = () => {
    renderer.render(scene,camera);
}

init();
animate();