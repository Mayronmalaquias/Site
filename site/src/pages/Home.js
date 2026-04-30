import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/styles.css';

function Home() {
  const personalInfo = {
    name: 'Mayron Malaquias',
    role: 'Data Analyst & Web Developer',
    location: 'Brasília, Brazil',
    email: 'mayron.malaquias.eng@gmail.com',
    linkedin: 'https://www.linkedin.com/in/mayronn/',
    github: 'https://github.com/Mayronmalaquias',
  };

  return (
    <main className="home-page">
      <section className="hero-section">
        <nav className="home-navbar">
          <div className="logo">Portfolio</div>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Available for opportunities</span>

            <h1>
              Hi, I’m <span>{personalInfo.name}</span>
            </h1>

            <h2>{personalInfo.role}</h2>

            <p>
              I build modern web applications and transform data into clear,
              strategic and actionable insights. My work combines technology,
              business intelligence and user-focused solutions.
            </p>

            <div className="hero-buttons">
              <Link to="/projects" className="btn-primary">
                View Projects
              </Link>

              <Link to="/contact" className="btn-secondary">
                Contact Me
              </Link>
            </div>

            <div className="hero-socials">
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={personalInfo.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={`mailto:${personalInfo.email}`}>
                Email
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="profile-card">
              <div className="profile-avatar">
                {personalInfo.name.charAt(0)}
              </div>

              <h3>{personalInfo.name}</h3>
              <p>{personalInfo.role}</p>

              <div className="profile-info">
                <span>Location</span>
                <strong>{personalInfo.location}</strong>
              </div>

              <div className="profile-info">
                <span>Focus</span>
                <strong>Data, BI and Web Solutions</strong>
              </div>

              <div className="profile-info">
                <span>Status</span>
                <strong>Open to new projects</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>10+</h3>
          <p>Projects Developed</p>
        </div>

        <div className="stat-card">
          <h3>5+</h3>
          <p>Technologies Used</p>
        </div>

        <div className="stat-card">
          <h3>100%</h3>
          <p>Focus on Results</p>
        </div>
      </section>

      <section className="skills-section">
        <div className="section-header">
          <span>What I Do</span>
          <h2>Building solutions with data and technology</h2>
          <p>
            I work with development, analysis and visualization to create
            practical solutions for real business problems.
          </p>
        </div>

        <div className="skills-grid">
          <div className="skill-card">
            <h3>Data Analysis</h3>
            <p>
              Cleaning, organizing and analyzing data to discover patterns,
              trends and business opportunities.
            </p>
          </div>

          <div className="skill-card">
            <h3>Business Intelligence</h3>
            <p>
              Creating dashboards and reports that help teams monitor
              performance and make better decisions.
            </p>
          </div>

          <div className="skill-card">
            <h3>Web Development</h3>
            <p>
              Developing responsive, clean and functional interfaces using
              modern front-end technologies.
            </p>
          </div>

          <div className="skill-card">
            <h3>Automation</h3>
            <p>
              Building scripts and tools to reduce manual work, improve
              productivity and organize processes.
            </p>
          </div>
        </div>
      </section>

      <section className="tech-section">
        <div className="section-header">
          <span>Technologies</span>
          <h2>Tools I use to build solutions</h2>
        </div>

        <div className="tech-list">
          <span>React</span>
          <span>JavaScript</span>
          <span>Python</span>
          <span>Pandas</span>
          <span>SQL</span>
          <span>Power BI</span>
          <span>Excel</span>
          <span>Flask</span>
          <span>Git</span>
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-content">
          <span>Featured Work</span>
          <h2>Projects that connect technology, data and usability</h2>
          <p>
            Explore some of my projects involving dashboards, data analysis,
            web systems, automation tools and practical business solutions.
          </p>

          <Link to="/projects" className="btn-primary">
            See All Projects
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;