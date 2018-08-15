import * as React from 'react';
import fetch from 'isomorphic-unfetch';

import AddRepoForm from './components/AddRepoForm';
import Repo from './components/Repo';

const Profile: React.StatelessComponent<{}> = ({ username, repositories }) => (
  <div>
    <h1>Profile Page</h1>
    <h3>Rem Lampa</h3>

    <AddRepoForm />

    <h3>Open Source Contributions</h3>
    <ul>
      {repositories.map(repo => (
        <Repo repo={repo} username={username} />
      ))}
    </ul>
  </div>
);

Profile.getInitialProps = async ({ req }) => {
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';

  const res = await fetch(`${baseUrl}/get-user-repos`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    // body: JSON.stringify({
    //   username: 'RemLampa',
    //   repo: 'RemLampa/tulongan-frontend',
    //   // repo: 'ContributorCovenant/contributor_covenant',
    // }),
  });

  const { username, repositories } = await res.json();

  return { username, repositories };
};

export default Profile;
