/**
 * Project loader and display handler
 */
class ProjectManager {
    constructor() {
        this.projects = [];
        this.projectsContainer = document.querySelector('.projects');
    }
    
    async init() {
        await this.loadProjects();
        this.renderProjects();
    }
    
    async loadProjects() {
        try {
            // Fetch the list of project files
            const response = await fetch('/data/projects/index.json');
            const projectList = await response.json();
            
            // Load each project
            const projectPromises = projectList.map(async (projectId) => {
                const projectResponse = await fetch(`/data/projects/${projectId}.json`);
                return await projectResponse.json();
            });
            
            this.projects = await Promise.all(projectPromises);
            console.log(`Loaded ${this.projects.length} projects`);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
    
    renderProjects() {
        if (!this.projectsContainer) return;
        
        this.projectsContainer.innerHTML = '';
        
        this.projects.forEach(project => {
            const projectElement = this.createProjectElement(project);
            this.projectsContainer.appendChild(projectElement);
        });
    }
    
    createProjectElement(project) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Create title
        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = project.title;
        
        // Create tech tags
        const techContainer = document.createElement('div');
        techContainer.className = 'project-tech';
        
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techContainer.appendChild(tag);
        });
        
        // Create description
        const description = document.createElement('p');
        description.className = 'project-description';
        description.textContent = project.description;
        
        // Create links
        const linksContainer = document.createElement('div');
        linksContainer.className = 'project-links';
        
        project.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.className = 'project-link';
            linkElement.href = link.url;
            linkElement.textContent = link.text;
            linkElement.target = '_blank';
            linksContainer.appendChild(linkElement);
            
            // Add separator between links
            if (project.links.indexOf(link) < project.links.length - 1) {
                const separator = document.createElement('span');
                separator.textContent = ' | ';
                linksContainer.appendChild(separator);
            }
        });
        
        // Add blog post link if available
        if (project.blogPost) {
            const blogLink = document.createElement('a');
            blogLink.className = 'project-blog-link';
            blogLink.href = `/blog.html?post=${project.id}`;
            blogLink.textContent = 'Read more';
            
            const linkContainer = document.createElement('div');
            linkContainer.className = 'blog-link-container';
            linkContainer.appendChild(blogLink);
            
            linksContainer.appendChild(document.createTextNode(' | '));
            linksContainer.appendChild(blogLink);
        }
        
        // Create 3D model viewer container
        const modelContainer = document.createElement('div');
        modelContainer.className = 'project-model-container';
        modelContainer.dataset.model = project.modelPath;
        modelContainer.dataset.projectId = project.id;
        
        // Combine everything
        projectCard.appendChild(title);
        projectCard.appendChild(techContainer);
        projectCard.appendChild(description);
        projectCard.appendChild(linksContainer);
        projectCard.appendChild(modelContainer);
        
        return projectCard;
    }
    
    // Method to load and display 3D models
    initModels() {
        // Find all model containers
        const modelContainers = document.querySelectorAll('.project-model-container');
        
        modelContainers.forEach(container => {
            const modelPath = container.dataset.model;
            const projectId = container.dataset.projectId;
            
            // Create a viewer for this model
            const modelViewer = new ModelViewer(container, modelPath, projectId);
            modelViewer.init();
        });
    }
}

/**
 * 3D Model viewer for project cards
 */
class ModelViewer {
    constructor(container, modelPath, projectId) {
        this.container = container;
        this.modelPath = modelPath;
        this.projectId = projectId;
        
        // Set up Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    }
    
    init() {
        // Set up renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Position camera
        this.camera.position.z = 5;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        // Load model
        this.loadModel();
        
        // Start animation loop
        this.animate();
        
        // Add event listeners
        window.addEventListener('resize', () => this.onResize());
    }
    
    loadModel() {
        // Use GLTFLoader to load the model
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            this.modelPath,
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // Center and scale model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                
                this.model.scale.set(scale, scale, scale);
                this.model.position.sub(center.multiplyScalar(scale));
            },
            (xhr) => {
                console.log(`${this.projectId} model: ${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            (error) => {
                console.error(`Error loading model for ${this.projectId}:`, error);
            }
        );
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate model if loaded
        if (this.model) {
            this.model.rotation.y += 0.01;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
}
