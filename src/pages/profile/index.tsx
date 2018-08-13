import * as React from 'react';
import fetch from 'isomorphic-unfetch';

const Profile: React.StatelessComponent<{}> = ({ prURL }) => (
  <div>
    <h1>Profile Page</h1>
    <h3>Rem Lampa</h3>

    <h2>
      <a href={prURL} rel="noreferrer noopener" target="_blank">
        PR PAGE
      </a>
    </h2>

    <h3>Open Source Contributions</h3>
    <ul>
      <li>Project 1</li>
      <li>Project 3</li>
    </ul>
  </div>
);

Profile.getInitialProps = async ({ req }) => {
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';

  const res = await fetch(`${baseUrl}/get-repo-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'RemLampa',
      repo: 'RemLampa/tulongan-frontend',
      // repo: 'ContributorCovenant/contributor_covenant',
    }),
  });

  const { prURL } = await res.json();

  return { prURL };
};

export default Profile;
