import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ObjednavkaTable from './components/ObjednavkaTable';
import ObjednavkaDetail from './components/ObjednavkaDetail';
import iliconLogo from './logo-ilico.svg';
import './App.css';
import WebFont from 'webfontloader';

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          'Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic',
        ],
      },
    });
  }, []);

  return (
    <div className="App">
      <header>
        <img src={iliconLogo} alt="ILICON.io Logo" className="logo" />
        <h1>ILICO.io seznam objednávek z FLEXIBEE</h1>
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/detail" element={<ObjednavkaDetail />} />
            <Route path="/" element={<ObjednavkaTable />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
