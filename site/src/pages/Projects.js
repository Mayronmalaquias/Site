import React from 'react';
import '../assets/css/styles.css';

function Projects() {
  const projects = [
    {
      title: 'Real Estate Pricing Platform',
      category: 'Data Analysis, Real Estate Intelligence and Web System',
      description:
        'A professional real estate pricing platform that estimates property values based on a monitored database with continuous data collection from real estate portals. The system includes internal login access for brokers, business processes, data analysis features and market intelligence tools.',
      technologies: ['React', 'JavaScript', 'Python', 'Flask', 'PostgreSQL', 'SQL', 'ETL', 'Web Scraping', 'Data Analysis'],
      link: 'https://inteligencia61imoveis.com.br/',
      type: 'Published Project',
      highlight: true,
    },
    {
      title: 'Real-Time Network Monitoring Dashboard',
      category: 'Cybersecurity, Network Monitoring and Data Visualization',
      description:
        'A dashboard designed to monitor network activity in real time by capturing and displaying network traffic data. The project focuses on visibility, monitoring and analysis of network behavior, connecting cybersecurity concepts with data visualization.',
      technologies: ['Python', 'Networking', 'Cybersecurity', 'Dashboard', 'Data Visualization'],
      link: 'https://github.com/AlphaCompLabs/Dash_TempoReal',
      type: 'GitHub Project',
      highlight: true,
    },
    {
      title: 'Sensitive Data Protection Tool',
      category: 'Hackathon, Data Privacy and Public Sector Innovation',
      description:
        'A hackathon project developed with a colleague for the Brazilian government. The solution processes documents and identifies possible sensitive information, such as CPF numbers and other personal data, helping to hide or protect confidential information before disclosure.',
      technologies: ['Python', 'Data Processing', 'Regex', 'Data Privacy', 'Automation'],
      link: 'https://github.com/Mayronmalaquias/HACKATHON---Acesso-a-informa-o.git',
      type: 'Hackathon Project',
      highlight: true,
    },
    {
      title: 'Pokédex',
      category: 'Front-End Development and API Consumption',
      description:
        'A simple Pokédex application and one of my first web development projects. It helped me practice front-end development, API consumption, JavaScript logic and interface organization.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'API'],
      link: 'https://pokedex.mirondev.com/',
      type: 'Early Project',
      highlight: false,
    },
  ];

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div className="projects-container">
          <span className="projects-badge">Portfolio</span>

          <h1>Projects that combine data, technology and real-world problem solving.</h1>

          <p>
            Here are some of the projects I have developed, ranging from data-driven
            platforms and cybersecurity tools to web applications and early front-end
            experiments.
          </p>
        </div>
      </section>

      <section className="projects-section">
        <div className="projects-container">
          <div className="section-header">
            <span>Selected Work</span>
            <h2>Featured Projects</h2>
            <p>
              These projects reflect my experience with data analysis, web development,
              automation, cybersecurity and business-oriented solutions.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <article
                className={`project-card ${project.highlight ? 'project-highlight' : ''}`}
                key={index}
              >
                <div className="project-card-header">
                  <span className="project-type">{project.type}</span>
                  <span className="project-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3>{project.title}</h3>

                <h4>{project.category}</h4>

                <p>{project.description}</p>

                <div className="project-tech-list">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex}>{tech}</span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-link"
                >
                  View Project
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-summary-section">
        <div className="projects-container">
          <div className="projects-summary-card">
            <span>My Project Focus</span>

            <h2>I build projects that connect technical execution with practical value.</h2>

            <p>
              My strongest interests are data analysis, business intelligence,
              automation, cybersecurity and web development. I enjoy creating solutions
              that are useful, scalable and connected to real problems.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Projects;