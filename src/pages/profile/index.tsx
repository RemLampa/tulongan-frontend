import * as React from 'react';
import fetch from 'isomorphic-unfetch';

import AddRepoForm from './components/AddRepoForm';
import Repo from './components/Repo';

interface Repositories {
  repoOwner: string;
  repoName: string;
}

export interface Props {
  username: string;
  repositories?: Repositories[];
}

interface State {
  repositories: Repositories[];
}

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      repositories: props.repositories || [],
    };
  }

  static getInitialProps = async ({ req }) => {
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

  addRepo = (repo: Repositories) => {
    const { repositories } = this.state;

    const updatedRepos = repositories.concat(repo);

    this.setState({
      repositories: updatedRepos,
    });
  };

  render() {
    const { username } = this.props;
    const { repositories } = this.state;

    return (
      <div>
        <h1>Profile Page</h1>
        <h3>Rem Lampa</h3>

        <AddRepoForm onSubmit={this.addRepo} />

        <h3>Open Source Contributions</h3>
        <ul>
          {repositories.map(repo => (
            <Repo repo={repo} username={username} />
          ))}
        </ul>
      </div>
    );
  }
}

export default Profile;
