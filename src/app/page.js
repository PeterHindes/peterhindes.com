import Image from "next/image";
import portfolioData from "@/data/portfolio.json";

export default function Home() {
  const { about, projects, jobs, education, skills, contact, settings } = portfolioData;
  const showSkillEmojis = settings?.showSkillEmojis ?? true; // Default to true if not specified

  return (
    <div className="min-h-screen blueprint-bg">
      {/* Header/About Section with improved responsive handling */}
      <header className="py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Image with fixed dimensions and spacing - improved sizing */}
            <div className="relative flex-shrink-0 w-36 h-36 md:w-48 md:h-48 profile-container cursor-pointer mx-auto md:mx-0">
              <div className="profile-content">
                <div className="absolute inset-0 rounded-full overflow-hidden z-5">
                  <Image
                    src={about.profileImage}
                    alt={about.name}
                    fill
                    sizes="(max-width: 768px) 144px, 192px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 font-permanent-marker"><span className="name-highlighter">{about.name}</span></h1>
              <p className="tagline text-lg md:text-xl mb-4 font-pangolin">{about.tagline}</p>
              <p className="bio max-w-2xl font-pangolin">{about.bio}</p>
              <div className="mt-4 flex gap-4 justify-center md:justify-start">
                <a href={`mailto:${contact.email}`} className="contact-button flex items-center">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5l-8-5V6l8,5l8-5V8z" />
                    </svg>
                    {contact.email}
                  </span>
                </a>
                <a href={"https://github.com/"+contact.github} target="_blank" rel="noopener noreferrer" className="contact-button flex items-center">
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
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

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Projects Section */}
        <section className="mb-16">
          <h2 className="section-heading font-permanent-marker">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="blueprint-card flex flex-col h-full">
                <div className="relative h-60 w-full mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover relative z-10 rounded-xl"
                  />
                </div>
                <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                <p className="mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="blueprint-tag">{tag}</span>
                  ))}
                </div>
                <div className="mt-auto">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block blueprint-link"
                  >
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <h2 className="section-heading">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillCategory, index) => (
              <div key={index} className="blueprint-card">
                <div className="flex items-center mb-3">
                  {showSkillEmojis && skillCategory.emoji && (
                    <span className="text-2xl mr-2" role="img" aria-label={`${skillCategory.title} icon`}>
                      {skillCategory.emoji}
                    </span>
                  )}
                  <h3 className="font-bold text-xl">{skillCategory.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.skills.map((skill, index) => (
                    <span key={index} className="blueprint-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="mb-16">
          <h2 className="section-heading">Work Experience</h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div key={index} className="blueprint-card">
                <div className="flex items-center mb-1">
                  <div className="relative w-15 h-15 mr-3 flex items-center justify-center logo-container">
                    {job.needsBackground && (
                      <div className="absolute w-[3.375rem] h-[3.375rem] bg-white rounded-md" 
                           style={{ zIndex: 1 }}></div>
                    )}
                    <Image 
                      src={job.icon}
                      alt={`${job.title} icon`}
                      fill
                      sizes="60px"
                      className="object-contain relative"
                      style={{ zIndex: 2 }}
                    />
                  </div>
                  <h3 className="font-bold text-xl">{job.title}</h3>
                </div>
                <p className="font-medium">{job.company}</p>
                <p className="my-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {job.tags.map((tag, index) => (
                    <span key={index} className="blueprint-tag">{tag}</span>
                  ))}
                  <span className="blueprint-tag ml-auto bg-blue-800/30">{job.period}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <h2 className="section-heading">Education</h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="blueprint-card">
                <div className="flex items-center mb-1">
                  <div className="relative w-15 h-15 mr-3 flex items-center justify-center logo-container">
                    {edu.needsBackground && (
                      <div className="absolute w-[3.375rem] h-[3.375rem] bg-white rounded-md" 
                           style={{ zIndex: 1 }}></div>
                    )}
                    <Image 
                      src={edu.icon}
                      alt={`${edu.school} icon`}
                      fill
                      sizes="60px"
                      className="object-contain relative"
                      style={{ zIndex: 2 }}
                    />
                  </div>
                  <h3 className="font-bold text-xl">{edu.title}</h3>
                </div>
                <p className="font-medium">{edu.school}</p>
                <p className="my-2">{edu.description}</p>
                <div className="my-2">
                  <h4 className="font-medium">Relevant Coursework:</h4>
                  <ul className="list-disc pl-5">
                    {edu.relevantCoursework.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 items-center mt-3">
                  {edu.tags && edu.tags.map((tag, index) => (
                    <span key={index} className="blueprint-tag">{tag}</span>
                  ))}
                  <span className="blueprint-tag ml-auto bg-blue-800/30">{edu.period}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-6 text-center">
        <p>© {new Date().getFullYear()} {about.name} - Portfolio</p>
      </footer>
    </div>
  );
}
