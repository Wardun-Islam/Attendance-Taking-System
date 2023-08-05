const path = require('path');
const express = require('express');
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
dotenv.config();
const port = 3001;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.post('api/check-password', (req, res) => {
  if (req.body.password === process.env.CURRENT_USER_PASSWORD) {
    const token = jwt.sign(
      {
        data: process.env.CURRENT_USER_PASSWORD,
      },
      process.env.JWT_SECRET,
      { expiresIn: '10m' },
    );
    res.send({ message: 'success', token });
  } else {
    res.send({ message: 'failed' });
  }
});

app.get(
  'api/',
  (req, res, next) => {
    console.log(req.headers.authorization);
    // Verify Token
    req.token = req.headers.authorization;
    if (typeof req.token !== 'undefined') {
      jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else if (authData.data === process.env.CURRENT_USER_PASSWORD) {
          next();
        } else {
          res.sendStatus(403);
        }
      });
    } else {
      res.sendStatus(403);
    }
  },
  async (req, res) => {
    try {
      const wb = XLSX.readFile(
        `./files/${req.query.labClass} Attandence Sheet Summer 2023.xlsx`,
        { cellDates: true },
      );
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      const date = new Date();
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      const names = data.map((item) => ({
        name: item['Student Name'],
        attendance: !!item[dateStr],
      }));
      console.log(names);
      res.send(names);
    } catch (err) {
      console.log(err);
    }
  },
);

app.post(
  'api/',
  (req, res, next) => {
    // Verify Token
    req.token = req.headers.authorization;
    if (typeof req.token !== 'undefined') {
      jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else if (authData.data === process.env.CURRENT_USER_PASSWORD) {
          next();
        } else {
          res.sendStatus(403);
        }
      });
    } else {
      res.sendStatus(403);
    }
  },
  (req, res) => {
    try {
      const wb = XLSX.readFile(
        `./files/${req.body.labClass} Attandence Sheet Summer 2023.xlsx`,
        { cellDates: true },
      );
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      for (let i = 0; i < data.length; i += 1) {
        const date = new Date();
        const dateStr = `${date.getDate()}/${date.getMonth() + 1
        }/${date.getFullYear()}`;
        data[i][dateStr] = req.body.data[i].attendance ? 1 : 0;
      }
      const wb2 = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb2, ws, 'Sheet1');
      XLSX.writeFile(
        wb2,
        `./files/${req.body.labClass} Attandence Sheet Summer 2023.xlsx`,
      );
      res.send({ message: 'success' });
    } catch (err) {
      console.log(err);
    }
  },
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
