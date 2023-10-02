import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ObjednavkaTable.css';
import { Link, useNavigate } from 'react-router-dom';

function ObjednavkaTable() {
  const [objednavky, setObjednavky] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20); // Počet položek na stránce
  const [filteredObjednavky, setFilteredObjednavky] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // Celkový počet stránek

  const navigate = useNavigate(); 

  useEffect(() => {
    // stažení objednávek ze serveru
    axios
      .get(`http://localhost:5000/api/objednavky-prijate`, {
        params: {
          query: searchQuery,
          page: currentPage,
          perPage: perPage,
        },
      })
      .then((response) => {
        const objednavkyData = response.data.objednavky;
        setObjednavky(objednavkyData);
        setFilteredObjednavky(objednavkyData);
      })
      .catch((error) => {
        console.error(error);
      });

    // součet všech záznamů pro stránkování
    axios
      .get(`https://demo.flexibee.eu/c/demo/objednavka-prijata.json`, {
        params: {
          detail: 'detail',
          limit: 0,
        },
      })
      .then((response) => {
        const totalCount =
          response.data.winstrom['objednavka-prijata'].length;
        setTotalPages(Math.ceil(totalCount / perPage));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage, perPage, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // vyhledání výsledků fulltext search
  const handleSearchSubmit = () => {
    if (searchQuery.trim() === '') {
      setFilteredObjednavky(objednavky);
    } else {
      const searchString = searchQuery.toLowerCase();
      const filteredObjednavky = objednavky.filter((objednavka) => {

        const allFields = Object.values(objednavka)
          .join(' ')
          .toLowerCase();
        return allFields.includes(searchString);
      });
      setFilteredObjednavky(filteredObjednavky);
    }
  };
  
  //načíst při stránkování požadovanou stránku
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // funkce na poslání dat do detailu
  const handleDetailClick = (objednavka) => {
    navigate('/detail', { state: { selectedRow: objednavka } });
  };

  return (
    <div>
      <h1>Objednávky</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Fulltext search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="submit-button" onClick={handleSearchSubmit}>
          Submit
        </button>
      </div>
      <table className="styled-table">
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
            <th>Detail záznamu</th>
          </tr>
        </thead>
        <tbody>
          {filteredObjednavky.map((objednavka) => (
            <tr key={objednavka.id}>
              <td>{objednavka['uzivatel@showAs']}</td>
              <td>{objednavka.kod}</td>
              <td>{objednavka.kontaktJmeno}</td>
              <td>{objednavka['stat@showAs']}</td>
              <td>{objednavka.faMesto}</td>
              <td>{objednavka.faUlice}</td>
              <td>{objednavka.faPsc}</td>
              <td>{objednavka.ic}</td>
              <td>{objednavka.dic}</td>
              <td>{objednavka['formaDopravy@showAs']}</td>
              <td>{objednavka['formaUhradyCis@showAs']}</td>
              <td>{objednavka['stavDoklObch@showAs']}</td>
              <td>{objednavka.sumCelkem}</td>
              <td>
                <Link
                  to={{
                    pathname: '/detail',
                    state: { selectedRow: objednavka },
                  }}
                >
                  <button
                    className="submit-button"
                    onClick={() => handleDetailClick(objednavka)}
                  >
                    DETAIL
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* stránkování */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ObjednavkaTable;
