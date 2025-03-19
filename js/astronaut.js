/**
 * Astronaut floating character with cursor following
 */
class Astronaut {
    constructor() {
        this.container = document.getElementById('astronaut-container');
        this.canvas = document.getElementById('astronaut-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fieldOfView,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.nearPlane,
            CONFIG.camera.farPlane
        );
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.astronaut = null;
        this.loadingManager = new THREE.LoadingManager();
        this.currentlyVisibleProject = null;
        this.projectCards = document.querySelectorAll('.project-card');
        
        // Initialize everything
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.loadAstronautModel();
        this.addEventListeners();
    }
    
    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    
    setupCamera() {
        this.camera.position.z = CONFIG.camera.astronautDistance;
    }
    
    setupLights() {
        // Add light for astronaut scene
        const brightAmbientLight = new THREE.AmbientLight(
            CONFIG.lights.ambient.color, 
            CONFIG.lights.ambient.intensity
        );
        this.scene.add(brightAmbientLight);
        
        const brightDirectionalLight = new THREE.DirectionalLight(
            CONFIG.lights.directional.color, 
            CONFIG.lights.directional.intensity
        );
        brightDirectionalLight.position.set(
            CONFIG.lights.directional.position.x,
            CONFIG.lights.directional.position.y,
            CONFIG.lights.directional.position.z
        );
        this.scene.add(brightDirectionalLight);
        
        // Add sun light
        const astroSunLight = new THREE.DirectionalLight(
            CONFIG.lights.sun.color, 
            CONFIG.lights.sun.intensity
        );
        astroSunLight.position.set(
            CONFIG.lights.sun.position.x,
            CONFIG.lights.sun.position.y,
            CONFIG.lights.sun.position.z
        );
        this.scene.add(astroSunLight);
    }
    
    loadAstronautModel() {
        const loader = new THREE.GLTFLoader(this.loadingManager);
        loader.load(
            CONFIG.astronaut.modelPath,
            (gltf) => {
                this.astronaut = gltf.scene;
                
                // Scale the astronaut
                this.astronaut.scale.set(
                    CONFIG.astronaut.scale,
                    CONFIG.astronaut.scale,
                    CONFIG.astronaut.scale
                );
                
                // Initial position
                this.astronaut.position.set(
                    CONFIG.astronaut.position.x,
                    CONFIG.astronaut.position.y,
                    CONFIG.astronaut.position.z
                );
                
                this.scene.add(this.astronaut);
                
                // Initialize visible project for touch devices
                if (!CONFIG.hasPointer) {
                    this.updateVisibleProject();
                }
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened while loading the astronaut model', error);
            }
        );
    }
    
    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Update on scroll for touch devices
        if (!CONFIG.hasPointer) {
            window.addEventListener('scroll', () => this.updateVisibleProject());
            window.addEventListener('resize', () => this.updateVisibleProject());
        }
    }
    
    updateVisibleProject() {
        if (CONFIG.hasPointer) return;
        
        let mostVisibleProject = null;
        let maxVisibility = 0;
        
        // Calculate which project is most visible in the viewport
        this.projectCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            
            // Calculate how much of the card is visible in the viewport
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(window.innerHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const percentVisible = visibleHeight / rect.height;
            
            if (percentVisible > maxVisibility) {
                maxVisibility = percentVisible;
                mostVisibleProject = card;
            }
        });
        
        if (mostVisibleProject !== this.currentlyVisibleProject) {
            this.currentlyVisibleProject = mostVisibleProject;
        }
    }
    
    getProjectInspectionPosition() {
        if (!this.currentlyVisibleProject) return { x: 0, y: 0 };
        
        const rect = this.currentlyVisibleProject.getBoundingClientRect();
        
        // Position astronaut near the project card
        const projectCenterX = rect.left + rect.width / 2;
        const projectCenterY = rect.top + rect.height / 2;
        
        // Add some animation based on time
        const time = Date.now() * 0.001;
        const offsetX = Math.sin(time * 0.5) * rect.width * 0.15;
        const offsetY = Math.sin(time * 0.3) * rect.height * 0.1;
        
        return Utils.getWorldPosition(
            projectCenterX + offsetX, 
            projectCenterY + offsetY
        );
    }
    
    update() {
        if (!this.astronaut) return;
        
        const time = Date.now() * 0.001;
        
        if (CONFIG.hasPointer) {
            // Calculate target position for the astronaut
            const targetX = Utils.mouse.normalizedX * CONFIG.astronaut.movementRange.x;
            const targetY = Utils.mouse.normalizedY * CONFIG.astronaut.movementRange.y;
            
            // Move the astronaut to follow cursor with smooth easing
            this.astronaut.position.x += (targetX - this.astronaut.position.x) * CONFIG.astronaut.followSpeed;
            this.astronaut.position.y += (targetY - this.astronaut.position.y) * CONFIG.astronaut.followSpeed;
            
            // Keep z-position stable with slight bobbing
            this.astronaut.position.z = CONFIG.astronaut.position.z + Math.sin(time * CONFIG.astronaut.bobSpeed) * CONFIG.astronaut.bobAmount;
            
            // Get direction of mouse movement for rotation
            const direction = Utils.mouse.getAverageDirection();
            
            // Apply slight rotation based on movement direction
            const targetRotationX = 0.1 - direction.y * 0.3; // Look up/down
            const targetRotationY = direction.x * 0.3;       // Look left/right
            
            // Smooth rotation transition
            this.astronaut.rotation.x += (targetRotationX - this.astronaut.rotation.x) * CONFIG.astronaut.rotationSpeed;
            this.astronaut.rotation.y += (targetRotationY - this.astronaut.rotation.y) * CONFIG.astronaut.rotationSpeed;
            this.astronaut.rotation.z = Math.sin(time * 0.2) * 0.05; // Slight tilt
            
        } else {
            // Touch device behavior, looking at projects
            const inspectionPos = this.getProjectInspectionPosition();
            
            // Move camera slightly based on project position
            this.camera.position.x += (inspectionPos.x * 0.2 - this.camera.position.x) * 0.03;
            this.camera.position.y += (inspectionPos.y * 0.2 - this.camera.position.y) * 0.03;
            
            // Look at the project
            this.camera.lookAt(0, 0, CONFIG.astronaut.position.z);
            
            if (this.currentlyVisibleProject) {
                // For touch devices, keep the astronaut in fixed position with floating
                this.astronaut.position.set(0, 0, CONFIG.astronaut.position.z);
                
                // Apply floating animation using sine waves
                this.astronaut.position.y += Math.sin(time * 0.5) * CONFIG.astronaut.bobAmount;
                this.astronaut.position.x += Math.sin(time * 0.7) * CONFIG.astronaut.bobAmount;
                this.astronaut.position.z += Math.sin(time * 0.3) * CONFIG.astronaut.bobAmount;
                
                // Tilt head to look at project
                this.astronaut.rotation.x = Math.sin(time * 0.3) * 0.1 + 0.2;
            }
        }
        
        // Add subtle floating on top of any existing movements
        if (CONFIG.hasPointer) {
            this.astronaut.position.x += Math.sin(time * 0.7) * 0.03;
            this.astronaut.position.y += Math.sin(time * 0.5) * 0.03;
        }
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.render();
    }
    
    init() {
        this.animate();
    }
}
