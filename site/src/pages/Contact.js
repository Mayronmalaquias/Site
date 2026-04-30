import React, { useState } from 'react';
import { FaLinkedinIn, FaGithub, FaEnvelope, FaGlobe } from 'react-icons/fa';
import '../assets/css/styles.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const contactLinks = [
    {
      title: 'LinkedIn',
      value: 'linkedin.com/in/mayronn',
      link: 'https://www.linkedin.com/in/mayronn/',
      icon: <FaLinkedinIn />,
    },
    {
      title: 'GitHub',
      value: 'github.com/Mayronmalaquias',
      link: 'https://github.com/Mayronmalaquias',
      icon: <FaGithub />,
    },
    {
      title: 'Gmail',
      value: 'mayron.malaquias.eng@gmail.com',
      link: 'mailto:mayron.malaquias.eng@gmail.com',
      icon: <FaEnvelope />,
    },
    {
      title: 'Website',
      value: 'mirondev.com',
      link: 'https://mirondev.com',
      icon: <FaGlobe />,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = `Portfolio Contact - ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

    window.location.href = `mailto:mayron.malaquias.eng@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-container">
          <span className="contact-badge">Contact</span>

          <h1>Let’s connect and build something meaningful.</h1>

          <p>
            Feel free to contact me for opportunities, projects, collaborations or
            professional connections related to data analysis, web development,
            business intelligence and cybersecurity.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container contact-grid">
          <div className="contact-info">
            <div className="section-header">
              <span>Get in Touch</span>
              <h2>Contact information</h2>
              <p>
                You can reach me through my professional channels or send a
                message directly using the form.
              </p>
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
                  <div className="contact-icon">
                    {item.icon}
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form-card">
            <h2>Send a Message</h2>

            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Message
                <textarea
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </label>

              <button type="submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;