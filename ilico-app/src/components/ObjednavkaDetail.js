import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ObjednavkaDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRow = location.state?.selectedRow || {};
  const fakturaVydanaData = location.state?.fakturaVydanaData || {};

  const handleBackClick = () => {
    navigate(-1);
  };

  const [fakturaVydanaId, setFakturaVydanaId] = useState(null);

  // funkce, která by měla propojit objednávku a fakturu a najít správné ID na základě cisObj z faktur a kódu z objednávky //NEZOBRAZUJE
  useEffect(() => {
    if (selectedRow.kod && Object.keys(fakturaVydanaData).length > 0) {
      Object.keys(fakturaVydanaData).forEach((key) => {
        if (fakturaVydanaData[key].cisObj === selectedRow.kod) {
          setFakturaVydanaId(fakturaVydanaData[key].id);
        }
      });
    }
  }, [selectedRow.kod, fakturaVydanaData]);

  // složení url pro stažení dokladu
  const generatePdfUrl = (fakturaId) => {
    return `https://demo.flexibee.eu/c/demo/faktura-vydana/${fakturaId}.pdf`;
  };

  // funkce pro vyvolání odkazu s pdf v novém okně po kliknutí na tlačítko
  const handleFakturaDownloadClick = () => {
    if (fakturaVydanaId) {
      const pdfUrl = generatePdfUrl(fakturaVydanaId);
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div>
    {/* zobrazení informací z tabulky */}
      <h3>Detail záznamu</h3>
      <table>
        <thead>
          <tr>
            <th>Uživatel</th>
            <th>Kód</th>
            <th>Kontaktní jméno</th>
            <th>Stát</th>
            <th>Město</th>
            <th>Ulice</th>
            <th>PSČ</th>
            <th>IČO</th>
            <th>DIČ</th>
            <th>Forma dopravy</th>
            <th>Způsob platby</th>
            <th>Stav</th>
            <th>Celková cena objednávky</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectedRow['uzivatel@showAs']}</td>
            <td>{selectedRow.kod}</td>
            <td>{selectedRow.kontaktJmeno}</td>
            <td>{selectedRow['stat@showAs']}</td>
            <td>{selectedRow.faMesto}</td>
            <td>{selectedRow.faUlice}</td>
            <td>{selectedRow.faPsc}</td>
            <td>{selectedRow.ic}</td>
            <td>{selectedRow.dic}</td>
            <td>{selectedRow['formaDopravy@showAs']}</td>
            <td>{selectedRow['formaUhradyCis@showAs']}</td>
            <td>{selectedRow['stavDoklObch@showAs']}</td>
            <td>{selectedRow.sumCelkem}</td>
          </tr>
        </tbody>
      </table>

      {/* Položky objednávky */}
      {selectedRow.polozkyDokladu && selectedRow.polozkyDokladu.length > 0 ? (
        <div>
          <h3>Položky objednávky</h3>
          <table>
            <thead>
              <tr>
                <th>Kód</th>
                <th>Množství</th>
                <th>Sazba DPH</th>
                <th>Základ DPH</th>
                <th>DPH</th>
                <th>Celková cena</th>
              </tr>
            </thead>
            <tbody>
              {selectedRow.polozkyDokladu.map((item, index) => (
                <tr key={index}>
                  <td>{item.kod}</td>
                  <td>{item.mnozMj}</td>
                  <td>{item.szbDph}</td>
                  <td>{item.sumZkl}</td>
                  <td>{item.sumDph}</td>
                  <td>{item.sumCelkem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Na objednávce nejsou žádné položky</p>
      )}

    {/* tlačítko za stažení faktury, pokud je navázaná */}
      {fakturaVydanaId ? (
        <div>
          <h2>Faktura ke stažení</h2>
          <button className="download-button" onClick={handleFakturaDownloadClick}>
            Stažení dokladu objednávky
          </button>
        </div>
      ) : (
        <p>Není navázaná faktura, kterou by bylo možné stáhnout</p>
      )}

      {/* vrátit zpět */}
      <button className="submit-button" onClick={handleBackClick}>
        Zpět na seznam objednávek
      </button>
    </div>
  );
}

export default ObjednavkaDetail;

