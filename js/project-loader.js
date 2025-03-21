/**
 * Portfolio content loader - Loads all content data from JSON and renders to the page
 */
class ProjectLoader {
    constructor() {
        // Find all containers
        this.projectsContainer = document.querySelector('.projects-container');
        this.jobsContainer = document.querySelector('.jobs-container');
        this.educationContainer = document.querySelector('.education-container');
        this.skillsContainer = document.querySelector('.skills-container');
        this.aboutContainer = document.querySelector('.about-container');
        
        // Debug check if containers are found
        console.log('Container elements found:', {
            projects: !!this.projectsContainer,
            jobs: !!this.jobsContainer,
            education: !!this.educationContainer,
            skills: !!this.skillsContainer,
            about: !!this.aboutContainer
        });
        
        this.portfolioData = null;
    }
    
    async loadData() {
        try {
            console.log('Attempting to load portfolio data...');
            const response = await fetch('/projects.json');
            
            if (!response.ok) {
                throw new Error(`Failed to load portfolio data: ${response.status} ${response.statusText}`);
            }
            
            this.portfolioData = await response.json();
            console.log('Portfolio data loaded successfully:', this.portfolioData);
            this.renderAllSections();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            // Show error messages in the containers
            this.showErrorMessages(error);
        }
    }
    
    showErrorMessages(error) {
        const containers = [
            this.projectsContainer,
            this.jobsContainer,
            this.educationContainer,
            this.skillsContainer,
            this.aboutContainer
        ];
        
        containers.forEach(container => {
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <p>Failed to load content: ${error.message}</p>
                        <p>Check the console for more details.</p>
                    </div>
                `;
            }
        });
    }
    
    renderAllSections() {
        console.log('Rendering all sections...');
        this.renderProjects();
        this.renderJobs();
        this.renderEducation();
        this.renderSkills();
        this.renderAboutInfo();
    }
    
    renderProjects() {
        if (!this.portfolioData || !this.portfolioData.projects || !this.projectsContainer) {
            console.error('Project data or container not available');
            return;
        }
        
        // Clear existing content
        this.projectsContainer.innerHTML = '';
        
        // Render each project
        this.portfolioData.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.dataset.projectId = project.id;
            projectCard.dataset.modelType = project.modelType || 'default';
            
            const tagsHtml = project.tags.map(tag => 
                `<span class="tech-tag">${tag}</span>`
            ).join('');
            
            projectCard.innerHTML = `
                <h3 class="project-title">${project.title}</h3>
                <div class="project-tech">
                    ${tagsHtml}
                </div>
                <p class="project-description">
                    ${project.description}
                </p>
                <a href="${project.link || '#'}" class="project-link" target="_blank">Launch Project →</a>
            `;
            
            this.projectsContainer.appendChild(projectCard);
        });
    }
    
    renderJobs() {
        if (!this.portfolioData || !this.portfolioData.jobs || !this.jobsContainer) {
            return;
        }
        
        this.jobsContainer.innerHTML = '';
        
        this.portfolioData.jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.dataset.jobId = job.id;
            jobCard.dataset.modelType = job.modelType || 'default';
            
            const tagsHtml = job.tags.map(tag => 
                `<span class="tech-tag">${tag}</span>`
            ).join('');
            
            jobCard.innerHTML = `
                <h3 class="job-title">${job.title}</h3>
                <h4 class="job-company">${job.company}</h4>
                <p class="job-period">${job.period}</p>
                <div class="job-tech">
                    ${tagsHtml}
                </div>
                <p class="job-description">
                    ${job.description}
                </p>
            `;
            
            this.jobsContainer.appendChild(jobCard);
        });
    }
    
    renderEducation() {
        if (!this.portfolioData || !this.portfolioData.education || !this.educationContainer) {
            return;
        }
        
        this.educationContainer.innerHTML = '';
        
        this.portfolioData.education.forEach(edu => {
            const eduCard = document.createElement('div');
            eduCard.className = 'education-card';
            eduCard.dataset.eduId = edu.id;
            
            const courseListHtml = edu.relevantCoursework ? 
                `<div class="coursework">
                    <h5>Relevant Coursework</h5>
                    <ul>${edu.relevantCoursework.map(course => `<li>${course}</li>`).join('')}</ul>
                </div>` : '';
                
            const tagsHtml = edu.tags.map(tag => 
                `<span class="tech-tag">${tag}</span>`
            ).join('');
            
            eduCard.innerHTML = `
                <h3 class="education-title">${edu.title}</h3>
                <h4 class="education-school">${edu.school}</h4>
                <p class="education-period">${edu.period}</p>
                <div class="education-tags">
                    ${tagsHtml}
                </div>
                <p class="education-description">
                    ${edu.description}
                </p>
                ${courseListHtml}
            `;
            
            this.educationContainer.appendChild(eduCard);
        });
    }
    
    renderSkills() {
        if (!this.portfolioData || !this.portfolioData.skills || !this.skillsContainer) {
            return;
        }
        
        this.skillsContainer.innerHTML = '';
        
        this.portfolioData.skills.forEach(skillGroup => {
            const skillSection = document.createElement('div');
            skillSection.className = 'skill-section';
            
            const skillsList = skillGroup.skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');
            
            skillSection.innerHTML = `
                <h3 class="skill-category">${skillGroup.title}</h3>
                <div class="skills-list">
                    ${skillsList}
                </div>
            `;
            
            this.skillsContainer.appendChild(skillSection);
        });
    }
    
    renderAboutInfo() {
        if (!this.portfolioData || !this.portfolioData.about || !this.aboutContainer) {
            return;
        }
        
        const about = this.portfolioData.about;
        
        this.aboutContainer.innerHTML = `
            <div class="about-content">
                <div class="about-text">
                    <h2>About Me</h2>
                    <h3>${about.tagline}</h3>
                    <p>${about.bio}</p>
                </div>
                <div class="about-image">
                    <img src="${about.profileImage}" alt="${about.name}">
                </div>
            </div>
        `;
    }
    
    init() {
        console.log('Initializing project loader...');
        this.loadData();
    }
}
