import React, { useEffect, useRef } from 'react';
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

  const countersRef = useRef([]);

  useEffect(() => {
    const targets = [10, 5, 100];
    const suffixes = ['+', '+', '%'];
    countersRef.current.forEach((el, i) => {
      if (!el) return;
      let start = 0;
      const end = targets[i];
      const duration = 1400;
      const step = Math.ceil(end / (duration / 16));
      const timer = setInterval(() => {
        start = Math.min(start + step, end);
        el.textContent = start + suffixes[i];
        if (start >= end) clearInterval(timer);
      }, 16);
    });
  }, []);

  const skills = [
    {
      icon: '◈',
      title: 'Data Analysis',
      desc: 'Cleaning, modeling and interpreting datasets to surface patterns and drive strategic decisions.',
    },
    {
      icon: '▣',
      title: 'Business Intelligence',
      desc: 'Dashboards, KPIs and visual reports that translate raw data into executive clarity.',
    },
    {
      icon: '◉',
      title: 'Web Development',
      desc: 'Responsive, performance-first interfaces connecting data systems to end users.',
    },
    {
      icon: '◆',
      title: 'Automation & ETL',
      desc: 'Pipelines and scripts that eliminate manual work and keep data flowing reliably.',
    },
  ];

  const techStack = [
    'Python', 'SQL', 'PostgreSQL', 'Power BI',
    'React', 'JavaScript', 'Pandas', 'Flask',
    'ETL', 'Excel', 'Git', 'Web Scraping',
  ];

  return (
    <main className="home-page">

      {/* ── NAV ── */}
      <nav className="home-navbar">
        <div className="logo">
          <span className="logo-dot" />
          miron<span className="logo-accent">dev</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">

          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-dot" />
              Available for opportunities
            </div>

            <h1>
              Turning raw data<br />
              into <span className="hero-accent">clear answers.</span>
            </h1>

            <p className="hero-sub">
              Data Analyst & Web Developer based in Brasília. I work at the intersection
              of engineering, analytics and business — building systems that make data
              visible, useful and actionable.
            </p>

            <div className="hero-meta-row">
              <span className="hero-meta-item">
                <span className="hero-meta-label">Focus</span>
                Data · BI · Web
              </span>
              <span className="hero-meta-divider" />
              <span className="hero-meta-item">
                <span className="hero-meta-label">Based</span>
                Brasília, BR
              </span>
              <span className="hero-meta-divider" />
              <span className="hero-meta-item">
                <span className="hero-meta-label">Degree</span>
                Computer Engineering
              </span>
            </div>

            <div className="hero-buttons">
              <Link to="/projects" className="btn-primary">View Projects →</Link>
              <Link to="/contact" className="btn-secondary">Contact Me</Link>
            </div>

            <div className="hero-socials">
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={personalInfo.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={`mailto:${personalInfo.email}`}>Email ↗</a>
            </div>
          </div>

          {/* ── PROFILE CARD ── */}
          <div className="hero-card">
            <div className="profile-card">
              <div className="profile-card-top">
                <div className="profile-avatar">
                  <img src="/maypic.jpeg" alt="Mayron Malaquias" />
                </div>
                <div className="profile-status">
                  <span className="status-dot" />
                  Open to work
                </div>
              </div>

              <h3>{personalInfo.name}</h3>
              <p className="profile-role">{personalInfo.role}</p>

              <div className="profile-divider" />

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span>Location</span>
                  <strong>{personalInfo.location}</strong>
                </div>
                <div className="profile-info-item">
                  <span>Focus</span>
                  <strong>Data & BI</strong>
                </div>
                <div className="profile-info-item">
                  <span>Semester</span>
                  <strong>7th — IESB</strong>
                </div>
                <div className="profile-info-item">
                  <span>Status</span>
                  <strong>Open to projects</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        {[
          { val: 10, suf: '+', label: 'Projects Delivered', sub: 'data & web' },
          { val: 5, suf: '+', label: 'Technologies', sub: 'in daily use' },
          { val: 100, suf: '%', label: 'Results Focus', sub: 'always' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-number" ref={el => countersRef.current[i] = el}>
              {s.val}{s.suf}
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* ── SKILLS ── */}
      <section className="skills-section">
        <div className="section-header">
          <span className="section-tag">What I Do</span>
          <h2>Data meets engineering,<br />engineering meets impact.</h2>
          <p>I work across the full analytics stack — from raw SQL to interactive dashboards, from ETL pipelines to user-facing web apps.</p>
        </div>

        <div className="skills-grid">
          {skills.map((s, i) => (
            <div className="skill-card" key={i}>
              <div className="skill-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH ── */}
      <section className="tech-section">
        <div className="section-header">
          <span className="section-tag">Stack</span>
          <h2>Tools I trust to get the job done.</h2>
        </div>
        <div className="tech-list">
          {techStack.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURED CTA ── */}
      <section className="featured-section">
        <div className="featured-content">
          <div className="featured-inner">
            <span className="section-tag">Featured Work</span>
            <h2>Real projects. Real data. Real results.</h2>
            <p>
              From a production real estate intelligence platform to hackathon tools
              and cybersecurity dashboards — explore the work that reflects how I think
              and build.
            </p>
            <Link to="/projects" className="btn-primary">Explore Projects →</Link>
          </div>
          <div className="featured-decoration">
            <div className="deco-grid">
              {Array.from({ length: 16 }).map((_, i) => (
                <div className="deco-cell" key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;