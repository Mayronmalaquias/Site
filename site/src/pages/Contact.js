import React, { useState } from 'react';
import { FaLinkedinIn, FaGithub, FaEnvelope, FaGlobe } from 'react-icons/fa';
import '../assets/css/styles.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const contactLinks = [
    {
      title: 'LinkedIn',
      value: 'linkedin.com/in/mayronn',
      link: 'https://www.linkedin.com/in/mayronn/',
      icon: <FaLinkedinIn />,
      desc: 'Professional network',
    },
    {
      title: 'GitHub',
      value: 'github.com/Mayronmalaquias',
      link: 'https://github.com/Mayronmalaquias',
      icon: <FaGithub />,
      desc: 'Code & open source',
    },
    {
      title: 'Email',
      value: 'mayron.malaquias.eng@gmail.com',
      link: 'mailto:mayron.malaquias.eng@gmail.com',
      icon: <FaEnvelope />,
      desc: 'Direct contact',
    },
    {
      title: 'Website',
      value: 'mirondev.com',
      link: 'https://mirondev.com',
      icon: <FaGlobe />,
      desc: 'Portfolio live',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Portfolio Contact — ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    window.location.href = `mailto:mayron.malaquias.eng@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="contact-page">
      <nav className="home-navbar">
        <div className="logo">
          <span className="logo-dot" />
          miron<span className="logo-accent">dev</span>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/projects">Projects</a>
          <a href="/contact" className="active">Contact</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="contact-container">
          <span className="contact-badge">Contact</span>
          <h1>Let's work on something meaningful together.</h1>
          <p>
            Open to opportunities in data analysis, business intelligence, web development
            and cybersecurity. Reach out for projects, collaborations or just to connect.
          </p>
        </div>
      </section>

      {/* ── MAIN ── */}
      <section className="contact-section">
        <div className="contact-container contact-grid">

          {/* ── LEFT ── */}
          <div className="contact-info">
            <div className="section-header" style={{ marginBottom: '32px' }}>
              <span className="section-tag">Get in Touch</span>
              <h2>Choose your preferred channel.</h2>
              <p>I'm most responsive on LinkedIn and email — usually reply within 24h.</p>
            </div>

            <div className="contact-links">
              {contactLinks.map((item, index) => (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link-card"
                  key={index}
                >
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-link-text">
                    <h3>{item.title}</h3>
                    <p>{item.value}</p>
                  </div>
                  <span className="contact-link-arrow">↗</span>
                </a>
              ))}
            </div>

            <div className="contact-availability">
              <div className="avail-dot" />
              <span>Currently open to new projects and opportunities.</span>
            </div>
          </div>

          {/* ── FORM ── */}
          <div className="contact-form-card">
            <h2>Send a Message</h2>
            <p className="form-sub">Fill in the form and I'll receive it directly in my inbox.</p>

            {sent ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Message sent!</h3>
                <p>Your email client opened with the message pre-filled. Thank you for reaching out.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label>
                  <span>Message</span>
                  <textarea
                    placeholder="Tell me about your project or opportunity..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </label>

                <button type="submit">Send Message →</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;