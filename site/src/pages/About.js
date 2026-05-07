import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/styles.css';

function About() {
  const timeline = [
    {
      year: '2022',
      title: 'Started Computer Engineering',
      desc: 'Enrolled at IESB, Brasília. First contact with programming, logic and hardware fundamentals.',
    },
    {
      year: '2023',
      title: 'Entered the Data World',
      desc: 'Joined a real estate company as a data analyst. First real datasets, first SQL queries, first dashboards.',
    },
    {
      year: '2024',
      title: 'Built Production Systems',
      desc: 'Developed the real estate pricing platform — from ETL pipeline to React front-end — used in production.',
    },
    {
      year: '2025',
      title: 'Cybersecurity Research',
      desc: 'Final project: AI-based Honeypot system. Combining security, data and machine learning.',
    },
  ];

  const experience = [
    { title: 'Data Analysis', desc: 'Market analysis, business indicators, customer behavior and strategic reports for decision-making.' },
    { title: 'ETL Processes', desc: 'Data extraction, transformation and loading — cleaning, structuring and preparing data for analysis.' },
    { title: 'Database Management', desc: 'SQL queries, PostgreSQL administration, data modeling and efficient retrieval for business use.' },
    { title: 'Web Development', desc: 'Responsive interfaces and web systems using React, JavaScript, HTML and CSS.' },
    { title: 'Business Intelligence', desc: 'Dashboards, KPIs and visual reports to support operational and strategic decisions in Power BI.' },
    { title: 'Cybersecurity Research', desc: 'Academic research on Honeypots with AI for cybersecurity monitoring and threat detection.' },
  ];

  const tools = [
    'Python', 'SQL', 'PostgreSQL', 'ETL', 'Data Cleaning',
    'Web Scraping', 'Power BI', 'Business Intelligence',
    'JavaScript', 'React', 'Flask', 'HTML', 'CSS',
    'Cybersecurity', 'Artificial Intelligence',
  ];

  return (
    <main className="about-page">
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <nav className="home-navbar">
        <div className="logo">
          <span className="logo-dot" />
          miron<span className="logo-accent">dev</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="main-content" className="about-hero">
        <div className="about-container">
          <span className="about-badge">About Me</span>
          <h1>Data analyst.<br />Engineer at heart.<br />Builder by nature.</h1>
          <p>
            Computer Engineering student at IESB (7th semester), working professionally
            with data analysis, business intelligence and modern web development.
            I turn messy datasets into structured insight and build the tools that make
            that insight visible.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="about-content">
        <div className="about-container about-grid">
          <div className="about-text">
            <h2>My Journey</h2>
            <p>
              I started studying programming without fully grasping how large the
              technology field really was. What began as curiosity grew into a genuine
              passion for solving real problems — the kind where a clean query or a
              well-built pipeline makes someone's work meaningfully better.
            </p>
            <p>
              Today, my primary focus is data. I work at a real estate company
              where I deal with market data, business indicators and analytical
              workflows that directly support strategic decisions. This role forced me
              to grow fast: real clients, real deadlines, real consequences.
            </p>
            <p>
              Day-to-day I handle PostgreSQL databases, write complex SQL queries,
              run ETL processes, scrape and clean market data, and build dashboards
              that non-technical stakeholders can actually use. I've also built
              production web systems with React and Flask connecting data layers to
              end-user interfaces.
            </p>
            <p>
              At university, I've gone beyond software — autonomous boat prototypes,
              circuit design and hardware projects expanded how I think about
              engineering as a whole. My final project closes the loop: AI-powered
              Honeypots for cybersecurity threat detection, where data and security
              intersect.
            </p>
          </div>

          <aside className="about-card">
            <h3>Profile</h3>
            {[
              ['Education', 'Computer Engineering'],
              ['Institution', 'IESB — Brasília'],
              ['Semester', '7th (graduating 2025)'],
              ['Main Focus', 'Data Analysis & BI'],
              ['Current Role', 'Analyst · Real Estate'],
              ['Final Project', 'AI Honeypot · Cybersecurity'],
            ].map(([label, value]) => (
              <div className="about-info-item" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="timeline-section">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">Timeline</span>
            <h2>How I got here.</h2>
          </div>
          <div className="timeline">
            {timeline.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-bar">
                  <div className="timeline-dot" />
                  {i < timeline.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="experience-section">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">Experience</span>
            <h2>What I work with daily.</h2>
            <p>My professional background spans data engineering, analytics, automation and front-end development.</p>
          </div>
          <div className="experience-grid">
            {experience.map((item, i) => (
              <div className="experience-card" key={i}>
                <div className="exp-index">0{i + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="about-tech-section">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">Technical Skills</span>
            <h2>Technologies and tools.</h2>
          </div>
          <div className="about-tech-list">
            {tools.map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;