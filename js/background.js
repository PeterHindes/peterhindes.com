/**
 * Background scene with stars
 */
class Background {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.canvas = document.getElementById('three-canvas');
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fieldOfView,
            this.container.clientWidth / this.container.clientHeight,
            CONFIG.camera.nearPlane,
            CONFIG.camera.farPlane
        );
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        // Initialize everything
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.createStars();
        this.addEventListeners();
    }
    
    setupRenderer() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    
    setupCamera() {
        this.camera.position.z = CONFIG.camera.backgroundDistance;
    }
    
    setupLights() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(
            CONFIG.lights.ambient.color, 
            CONFIG.lights.ambient.intensity
        );
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(
            CONFIG.lights.directional.color, 
            CONFIG.lights.directional.intensity
        );
        directionalLight.position.set(
            CONFIG.lights.directional.position.x,
            CONFIG.lights.directional.position.y,
            CONFIG.lights.directional.position.z
        );
        this.scene.add(directionalLight);
        
        // Add point light
        const pointLight = new THREE.PointLight(
            CONFIG.lights.point.color, 
            CONFIG.lights.point.intensity, 
            CONFIG.lights.point.distance
        );
        pointLight.position.set(
            CONFIG.lights.point.position.x,
            CONFIG.lights.point.position.y,
            CONFIG.lights.point.position.z
        );
        this.scene.add(pointLight);
        
        // Add sun light
        const sunLight = new THREE.DirectionalLight(
            CONFIG.lights.sun.color, 
            CONFIG.lights.sun.intensity
        );
        sunLight.position.set(
            CONFIG.lights.sun.position.x,
            CONFIG.lights.sun.position.y,
            CONFIG.lights.sun.position.z
        );
        this.scene.add(sunLight);
    }
    
    createStars() {
        const starGeometry = new THREE.SphereGeometry(CONFIG.stars.size, 8, 8);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        for(let i = 0; i < CONFIG.stars.count; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial);
            
            const x = THREE.MathUtils.randFloatSpread(CONFIG.stars.spread);
            const y = THREE.MathUtils.randFloatSpread(CONFIG.stars.spread);
            const z = THREE.MathUtils.randFloatSpread(CONFIG.stars.spread) - CONFIG.stars.distance;
            
            star.position.set(x, y, z);
            this.scene.add(star);
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.render();
    }
    
    init() {
        this.animate();
    }
}
