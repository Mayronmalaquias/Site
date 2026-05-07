import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/styles.css';

function Projects() {
  const [active, setActive] = useState('All');

  const projects = [
    {
      title: 'Real Estate Pricing Platform',
      category: 'Data Analysis',
      tag: 'Production',
      tagClass: 'tag-live',
      headline: 'End-to-end platform for property valuation based on live market data.',
      description:
        'A professional real estate intelligence system with continuous data collection from real estate portals, internal broker access, market analysis dashboards and automated pricing logic. Built from ETL pipeline to React front-end.',
      technologies: ['React', 'JavaScript', 'Python', 'Flask', 'PostgreSQL', 'SQL', 'ETL', 'Web Scraping'],
      link: 'https://inteligencia61imoveis.com.br/',
      metrics: [
        { val: '10k+', label: 'Properties tracked' },
        { val: 'Live', label: 'Production system' },
      ],
      highlight: true,
      filters: ['All', 'Data', 'Web'],
    },
    {
      title: 'Real-Time Network Monitoring Dashboard',
      category: 'Cybersecurity',
      tag: 'GitHub',
      tagClass: 'tag-github',
      headline: 'Dashboard for live network traffic capture and behavior analysis.',
      description:
        'Monitors network activity in real time by capturing and visualizing traffic data. Connects cybersecurity monitoring with interactive data visualization, giving operators instant visibility into network behavior.',
      technologies: ['Python', 'Networking', 'Cybersecurity', 'Data Visualization', 'Dashboard'],
      link: 'https://github.com/AlphaCompLabs/Dash_TempoReal',
      metrics: [
        { val: 'Real-time', label: 'Data stream' },
        { val: 'Open', label: 'Source' },
      ],
      highlight: true,
      filters: ['All', 'Data', 'Security'],
    },
    {
      title: 'Sensitive Data Protection Tool',
      category: 'Data Privacy',
      tag: 'Hackathon',
      tagClass: 'tag-hackathon',
      headline: 'Government hackathon tool to detect and redact sensitive personal data.',
      description:
        'Developed for the Brazilian government during a hackathon. Processes documents to identify sensitive information — CPF numbers, personal identifiers — and redacts or flags them before public disclosure.',
      technologies: ['Python', 'Data Processing', 'Regex', 'Automation', 'Privacy'],
      link: 'https://github.com/Mayronmalaquias/HACKATHON---Acesso-a-informa-o.git',
      metrics: [
        { val: 'Gov', label: 'Client' },
        { val: 'Regex+', label: 'Detection' },
      ],
      highlight: true,
      filters: ['All', 'Data', 'Security'],
    },
    {
      title: 'Pokédex',
      category: 'Front-End',
      tag: 'Early Project',
      tagClass: 'tag-early',
      headline: 'One of my first web projects — REST API consumption and JS fundamentals.',
      description:
        'A Pokédex web app built to practice API integration, JavaScript logic and front-end composition. Marks the beginning of my web development journey.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'REST API'],
      link: 'https://pokedex.mirondev.com/',
      metrics: [
        { val: 'API', label: 'Driven' },
        { val: '2023', label: 'Built' },
      ],
      highlight: false,
      filters: ['All', 'Web'],
    },
  ];

  const filters = ['All', 'Data', 'Web', 'Security'];

  const visible = projects.filter(p => p.filters.includes(active));

  return (
    <main className="projects-page">
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <nav className="home-navbar">
        <div className="logo">
          <span className="logo-dot" />
          miron<span className="logo-accent">dev</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects" className="active">Projects</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="main-content" className="projects-hero">
        <div className="projects-container">
          <span className="projects-badge">Portfolio</span>
          <h1>Projects built at the edge of data and engineering.</h1>
          <p>
            From production real estate systems to government hackathon tools —
            each project reflects how I approach real problems with data, code and
            a focus on practical results.
          </p>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="projects-section">
        <div className="projects-container">
          <div className="projects-filter-bar">
            {filters.map(f => (
              <button
                key={f}
                className={`filter-btn ${active === f ? 'filter-active' : ''}`}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {visible.map((project, index) => (
              <article
                className={`project-card ${project.highlight ? 'project-highlight' : ''}`}
                key={index}
              >
                <div className="project-card-header">
                  <span className={`project-type ${project.tagClass}`}>{project.tag}</span>
                  <span className="project-category">{project.category}</span>
                </div>

                <h3>{project.title}</h3>
                <p className="project-headline">{project.headline}</p>
                <p className="project-desc">{project.description}</p>

                <div className="project-metrics">
                  {project.metrics.map((m, i) => (
                    <div className="project-metric" key={i}>
                      <strong>{m.val}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="project-tech-list">
                  {project.technologies.map((tech, ti) => (
                    <span key={ti}>{tech}</span>
                  ))}
                </div>

                <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                  View Project ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="projects-summary-section">
        <div className="projects-container">
          <div className="projects-summary-card">
            <span className="section-tag">My Focus</span>
            <h2>Technical execution connected to practical value.</h2>
            <p>
              My strongest interests are data analysis, business intelligence, automation,
              cybersecurity and web development. I build things that are useful, scalable
              and grounded in real problems.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Projects;