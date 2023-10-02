const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const host = 'https://demo.flexibee.eu:443';
const firma = 'demo';
const user = 'winstrom';
const password = 'winstrom';

// stažení dat s položkami přes api
const fetchObjednavkaPrijataData = async (query, page, perPage) => {
  const objednavkyEvidence = 'objednavka-prijata';
  const uri = `${host}/c/${firma}/${objednavkyEvidence}.json`;

  try {
    const queryParams = {
      auth: {
        username: user,
        password: password,
      },
      params: {
        q: query,
        order: 'datVyst@D',
        detail: 'detail',
        start: (page - 1) * perPage,
        limit: perPage,
        relations: 'polozkyDokladu',
      },
    };

    const response = await axios.get(uri, queryParams);

    if (
      response.data &&
      response.data.winstrom &&
      response.data.winstrom[objednavkyEvidence]
    ) {
      return response.data.winstrom[objednavkyEvidence];
    } else {
      console.error('Invalid or empty response for objednavka-prijata:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching objednavka-prijata data:', error.message);
    throw error;
  }
};

// stažení dat z faktur vydaných, pouze id a cisObj
const fetchFakturaVydanaData = async () => {
  const fakturaEvidence = 'faktura-vydana';
  const uri = `${host}/c/${firma}/${fakturaEvidence}.json`;

  try {
    const queryParams = {
      auth: {
        username: user,
        password: password,
      },
      params: {
        detail: 'custom:id,cisObj',
        limit: 0,
      },
    };

    const response = await axios.get(uri, queryParams);

    if (response.data && response.data.winstrom && response.data.winstrom[fakturaEvidence]) {
      return response.data.winstrom[fakturaEvidence];
    } else {
      console.error('Invalid or empty response for faktura-vydana:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching faktura-vydana data:', error.message);
    throw new Error('Error fetching faktura-vydana data');
  }
};

//poslání dat
app.get('/api/objednavky-prijate', async (req, res) => {
  try {
    const { query, page, perPage } = req.query;
    const objednavky = await fetchObjednavkaPrijataData(query, page, perPage);
    const fakturaData = await fetchFakturaVydanaData();

    res.json({ objednavky, fakturaData });
  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
