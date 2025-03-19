/**
 * Star background with shader-based parallax
 */
class StarBackground {
    constructor() {
        this.canvas = document.getElementById('parallax-stars');
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        // Store window dimensions
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.documentHeight = Utils.getDocumentHeight();
        
        // Initialize everything
        this.setupRenderer();
        this.createShaderMaterial();
        this.createStarField();
        this.addEventListeners();
    }
    
    setupRenderer() {
        this.renderer.setSize(this.windowWidth, this.windowHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    
    createShaderMaterial() {
        // Create uniforms to pass to the shader
        this.uniforms = {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(this.windowWidth, this.windowHeight) },
            mouse: { value: new THREE.Vector2(0.5, 0.5) },
            scroll: { value: 0 }
        };
        
        // Create material using our shader
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: ParallaxShaders.vertexShader,
            fragmentShader: ParallaxShaders.fragmentShader,
            transparent: true
        });
    }
    
    createStarField() {
        // Create full-screen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);
    }
    
    addEventListeners() {
        // Update shader uniforms on mouse move
        document.addEventListener('mousemove', (event) => {
            this.uniforms.mouse.value.x = event.clientX / this.windowWidth;
            this.uniforms.mouse.value.y = 1 - (event.clientY / this.windowHeight); // Invert Y for shader
        });
        
        // Update shader uniforms on scroll
        window.addEventListener('scroll', () => {
            const scrollMax = this.documentHeight - this.windowHeight;
            this.uniforms.scroll.value = window.scrollY / scrollMax;
        });
        
        // Update on window resize
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            this.documentHeight = Utils.getDocumentHeight();
            
            this.renderer.setSize(this.windowWidth, this.windowHeight);
            this.uniforms.resolution.value.set(this.windowWidth, this.windowHeight);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.uniforms.time.value += CONFIG.stars.updateSpeed;
        this.renderer.render(this.scene, this.camera);
    }
    
    init() {
        this.animate();
    }
}
