import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importando as páginas
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import CalculadoraIESB from './pages/CalculadoraIESB';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">Sobre Mim</a></li>
            <li><a href="/projects">Projetos</a></li>
            <li><a href="/contact">Contato</a></li>
            <li><a href='/calculadora_do_miron'>Calculadora</a></li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calculadora_do_miron" element={<CalculadoraIESB />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;