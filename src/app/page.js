import Image from "next/image";
import portfolioData from "@/data/portfolio.json";

export default function Home() {
  const { about, projects, jobs, education, skills, contact, settings } = portfolioData;
  const showSkillEmojis = settings?.showSkillEmojis ?? true; // Default to true if not specified

  return (
    <div className="portfolio-container">
      {/* Header/About Section */}
      <header className="portfolio-header">
        <div className="header-container">
          <div className="about-section">
            {/* Profile Image */}
            <div className="profile-image-container">
              <div className="profile-content">
                <div className="profile-image-wrapper">
                  <Image
                    src={about.profileImage}
                    alt={about.name}
                    fill
                    sizes="(max-width: 768px) 144px, 192px"
                    className="profile-image"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="about-content">
              <h1 className="profile-name"><span className="name-highlighter">{about.name}</span></h1>
              <p className="profile-tagline">{about.tagline}</p>
              <p className="profile-bio">{about.bio}</p>
              <div className="contact-links">
                <a href={`mailto:${contact.email}`} className="contact-button">
                  <span className="button-content">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5l-8-5V6l8,5l8-5V8z" />
                    </svg>
                    {contact.email}
                  </span>
                </a>
                <a href={"https://github.com/"+contact.github} target="_blank" rel="noopener noreferrer" className="contact-button">
                  <span className="button-content">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2C6.48,2,2,6.48,2,12c0,4.42,2.87,8.17,6.84,9.5c0.5,0.09,0.68-0.22,0.68-0.48c0-0.24-0.01-0.87-0.01-1.7c-2.78,0.6-3.37-1.34-3.37-1.34c-0.45-1.16-1.11-1.47-1.11-1.47c-0.91-0.62,0.07-0.61,0.07-0.61c1,0.07,1.53,1.03,1.53,1.03c0.89,1.53,2.34,1.09,2.91,0.83c0.09-0.65,0.35-1.09,0.63-1.34c-2.22-0.25-4.55-1.11-4.55-4.92c0-1.09,0.39-1.98,1.03-2.67c-0.1-0.25-0.45-1.28,0.1-2.67c0,0,0.84-0.27,2.75,1.02c0.8-0.22,1.65-0.33,2.5-0.33c0.85,0,1.7,0.11,2.5,0.33c1.91-1.29,2.75-1.02,2.75-1.02c0.55,1.39,0.2,2.42,0.1,2.67c0.64,0.7,1.03,1.58,1.03,2.67c0,3.82-2.34,4.66-4.57,4.91c0.36,0.31,0.68,0.92,0.68,1.85c0,1.34-0.01,2.42-0.01,2.75c0,0.27,0.18,0.58,0.69,0.48C19.14,20.16,22,16.42,22,12C22,6.48,17.52,2,12,2z" />
                    </svg>
                    {"GitHub/"+contact.github}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="portfolio-main">
        {/* Projects Section */}
        <section className="projects-section">
          <h2 className="section-heading">Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-image-container">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="project-image"
                  />
                </div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="project-tag">{tag}</span>
                  ))}
                </div>
                <div className="project-link-container">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link"
                  >
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills-section">
          <h2 className="section-heading">Skills</h2>
          <div className="skills-grid">
            {skills.map((skillCategory, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  {showSkillEmojis && skillCategory.emoji && (
                    <span className="skill-emoji" role="img" aria-label={`${skillCategory.title} icon`}>
                      {skillCategory.emoji}
                    </span>
                  )}
                  <h3 className="skill-title">{skillCategory.title}</h3>
                </div>
                <div className="skill-tags">
                  {skillCategory.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="experience-section">
          <h2 className="section-heading">Work Experience</h2>
          <div className="experience-list">
            {jobs.map((job, index) => (
              <div key={index} className="job-card">
                <div className="job-header">
                  <div className="job-logo-container">
                    {job.needsBackground && (
                      <div className="job-logo-background"></div>
                    )}
                    <Image 
                      src={job.icon}
                      alt={`${job.title} icon`}
                      fill
                      sizes="60px"
                      className="job-logo"
                    />
                  </div>
                  <h3 className="job-title">{job.title}</h3>
                </div>
                <p className="job-company">{job.company}</p>
                <p className="job-description">{job.description}</p>
                <div className="job-footer">
                  {job.tags.map((tag, index) => (
                    <span key={index} className="job-tag">{tag}</span>
                  ))}
                  <span className="job-period">{job.period}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="education-section">
          <h2 className="section-heading">Education</h2>
          <div className="education-list">
            {education.map((edu, index) => (
              <div key={index} className="education-card">
                <div className="education-header">
                  <div className="education-logo-container">
                    {edu.needsBackground && (
                      <div className="education-logo-background"></div>
                    )}
                    <Image 
                      src={edu.icon}
                      alt={`${edu.school} icon`}
                      fill
                      sizes="60px"
                      className="education-logo"
                    />
                  </div>
                  <h3 className="education-degree">{edu.title}</h3>
                </div>
                <p className="education-school">{edu.school}</p>
                <p className="education-description">{edu.description}</p>
                <div className="coursework-container">
                  <h4 className="coursework-title">Relevant Coursework:</h4>
                  <ul className="coursework-list">
                    {edu.relevantCoursework.map((course, index) => (
                      <li key={index} className="coursework-item">{course}</li>
                    ))}
                  </ul>
                </div>
                <div className="education-footer">
                  {edu.tags && edu.tags.map((tag, index) => (
                    <span key={index} className="education-tag">{tag}</span>
                  ))}
                  <span className="education-period">{edu.period}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <p>© {new Date().getFullYear()} {about.name} - Portfolio</p>
      </footer>
    </div>
  );
}
