import * as React from 'react';
import fetch from 'isomorphic-unfetch';

const Profile: React.StatelessComponent<{}> = () => (
  <div>
    <h1>Profile Page</h1>
    <h3>Rem Lampa</h3>

    <h3>Open Source Contributions</h3>
    <ul>
      <li>Project 1</li>
      <li>Project 3</li>
    </ul>
  </div>
);

Profile.getInitialProps = async ({ req }) => {
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';

  console.log(baseUrl);

  const res = await fetch(`${baseUrl}/get-repo-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      test: 'test',
    }),
  });

  const data = await res.json();

  console.log(data);

  return { res };
};

export default Profile;
