import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Bienvenido from './Bienvenido';
// import Cliente from './Cliente';
// import Administrador from './Administrador';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenido />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/administrador" element={<Administrador />} />
      </Routes>
    </Router>
  );
};

export default App;
