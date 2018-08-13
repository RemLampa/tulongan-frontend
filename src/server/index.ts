const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');

const github = require('octonode');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: 'src' });

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json());

    server.post('/get-repo-link', (req, res) => {
      console.log('from server:');
      console.log(req.body);

      const user = req.body.username;

      const client = github.client(process.env.GH_TOKEN);

      const ghrepo = client.repo(req.body.repo);

      ghrepo.collaborators(user, (err, _, body) => {
        if (err || body.status !== '204 No Content') {
          return res.status(401).json({
            message: 'The user is not a collaborator of the repository.',
          });
        }

        const prURL = `https://github.com/${
          req.body.repo
        }/pulls?utf8=✓&q=is%3Apr+${req.body.username}`;

        return res.status(200).json({ prURL });
      });
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
