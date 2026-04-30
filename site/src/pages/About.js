import React from 'react';
import '../assets/css/styles.css';

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-container">
          <span className="about-badge">About Me</span>

          <h1>
            Data-driven professional passionate about technology, analytics and innovation.
          </h1>

          <p>
            I am a Computer Engineering student at IESB, currently in the 7th semester,
            with a strong focus on data analysis, business intelligence, automation and
            modern web development.
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container about-grid">
          <div className="about-text">
            <h2>My Journey</h2>

            <p>
              I started studying programming without fully understanding the size and
              possibilities of the technology field. Over time, what began as curiosity
              became a real passion for solving problems, building systems and transforming
              data into valuable information.
            </p>

            <p>
              Today, my main focus is data analysis. I work in a real estate company,
              where I deal with market data, business indicators and analytical processes
              that support strategic decision-making. This experience has helped me connect
              technology with real business needs.
            </p>

            <p>
              In my daily work, I handle PostgreSQL databases, SQL queries, ETL processes,
              data cleaning, data scraping and market analysis. I have also worked with
              Business Intelligence, Python, JavaScript and React, combining data and
              development to create practical solutions.
            </p>

            <p>
              At university, I have also developed projects involving circuits and automation,
              including an autonomous boat designed to deliver resources. These projects
              helped me expand my understanding of hardware, software and problem-solving
              through engineering.
            </p>

            <p>
              For my final undergraduate project, I am working on a cybersecurity topic
              focused on Honeypots with Artificial Intelligence. This research combines
              security, data and intelligent systems to study how AI can support threat
              detection and analysis.
            </p>
          </div>

          <aside className="about-card">
            <h3>Profile</h3>

            <div className="about-info-item">
              <span>Education</span>
              <strong>Computer Engineering</strong>
            </div>

            <div className="about-info-item">
              <span>Institution</span>
              <strong>IESB</strong>
            </div>

            <div className="about-info-item">
              <span>Current Semester</span>
              <strong>7th Semester</strong>
            </div>

            <div className="about-info-item">
              <span>Main Focus</span>
              <strong>Data Analysis</strong>
            </div>

            <div className="about-info-item">
              <span>Current Field</span>
              <strong>Real Estate Analytics</strong>
            </div>

            <div className="about-info-item">
              <span>Final Project</span>
              <strong>AI-based Honeypot for Cybersecurity</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="experience-section">
        <div className="about-container">
          <div className="section-header">
            <span>Experience</span>
            <h2>What I work with</h2>
            <p>
              My professional experience combines data engineering, analytics,
              automation and front-end development.
            </p>
          </div>

          <div className="experience-grid">
            <div className="experience-card">
              <h3>Data Analysis</h3>
              <p>
                Market analysis, business indicators, customer behavior analysis and
                analytical reports for strategic decision-making.
              </p>
            </div>

            <div className="experience-card">
              <h3>ETL Processes</h3>
              <p>
                Data extraction, transformation and loading, including data cleaning,
                structuring and preparation for analysis.
              </p>
            </div>

            <div className="experience-card">
              <h3>Database Management</h3>
              <p>
                SQL queries, PostgreSQL database handling, data organization and
                information retrieval for business analysis.
              </p>
            </div>

            <div className="experience-card">
              <h3>Web Development</h3>
              <p>
                Development of responsive interfaces and web solutions using JavaScript,
                React, HTML and CSS.
              </p>
            </div>

            <div className="experience-card">
              <h3>Business Intelligence</h3>
              <p>
                Creation and interpretation of dashboards, KPIs and visual reports to
                support operational and strategic decisions.
              </p>
            </div>

            <div className="experience-card">
              <h3>Cybersecurity Research</h3>
              <p>
                Academic research focused on Honeypots and Artificial Intelligence for
                cybersecurity monitoring and threat analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-tech-section">
        <div className="about-container">
          <div className="section-header">
            <span>Technical Skills</span>
            <h2>Technologies and tools</h2>
          </div>

          <div className="about-tech-list">
            <span>Python</span>
            <span>SQL</span>
            <span>PostgreSQL</span>
            <span>ETL</span>
            <span>Data Cleaning</span>
            <span>Web Scraping</span>
            <span>Business Intelligence</span>
            <span>Power BI</span>
            <span>JavaScript</span>
            <span>React</span>
            <span>HTML</span>
            <span>CSS</span>
            <span>Cybersecurity</span>
            <span>Artificial Intelligence</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;