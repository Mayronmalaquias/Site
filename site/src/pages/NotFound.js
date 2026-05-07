import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/styles.css';

function NotFound() {
  return (
    <main className="notfound-page">
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

      <section className="notfound-section">
        <span className="notfound-code">404</span>
        <h1>Página não encontrada.</h1>
        <p>O endereço que você acessou não existe ou foi removido.</p>
        <Link to="/" className="btn-primary">Voltar ao início →</Link>
      </section>
    </main>
  );
}

export default NotFound;
