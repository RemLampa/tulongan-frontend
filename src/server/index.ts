const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const next = require('next');

require('isomorphic-unfetch');

// const github = require('octonode');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: 'src' });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json());

    server.get('/callback', async (req, res) => {
      const { code } = req.query;
      const { GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;

      const data = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${GH_CLIENT_ID}&client_secret=${GH_CLIENT_SECRET}&code=${code}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const auth = await data.json();

      console.log(auth);

      res.status(200).json(req.query);
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
