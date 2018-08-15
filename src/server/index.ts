const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');

// const github = require('octonode');

const db = require('../mock-db/db.json');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: 'src' });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json());

    server.post('/get-user-repos', (_, res) => {
      console.log('from server:');

      const { username, repositories } = db;

      res.send({ username, repositories });
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(3000, err => {
      if (err) throw err;

      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);

    process.exit(1);
  });
