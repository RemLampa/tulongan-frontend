const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');

require('isomorphic-unfetch');

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

    server.post('/add-user-repo', async (req, res) => {
      console.log('from server:');

      const { repoOwner, repoName } = req.body;

      const githubReqURL = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?author=RemLampa`;

      const githubRes = await fetch(githubReqURL, {
        method: 'GET',
      });

      if (githubRes.status !== 200) {
        const errorMessage = `${repoOwner}/${repoName} is an invalid Github repository.`;

        return res.status(404).json({ error: { message: errorMessage } });
      }

      const commits = await githubRes.json();

      if (!commits.length) {
        const errorMessage = `You are not a contributor in ${repoOwner}/${repoName}`;

        return res.status(200).json({ error: { message: errorMessage } });
      }

      db.repositories.push({ repoOwner, repoName });

      const successMessage = `${repoOwner}/${repoName} has been successfully added to user's portfolio`;

      return res.status(200).json({ message: successMessage });
    });

    server.post('/delete-user-repo', (req, res) => {
      const { id } = req.body;

      const { repositories } = db;

      if (id < 0 || id > repositories.length - 1) {
        const error = {
          message: 'Invalid ID!',
        };

        return res.status(416).json({ error });
      }

      repositories.splice(id, 1);

      const successResponse = {
        id,
        message: `Repo ID ${id} was succesfully deleted.`,
      };

      return res.status(200).json(successResponse);
    });

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
