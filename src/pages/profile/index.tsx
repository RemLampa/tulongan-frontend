import fetch from 'isomorphic-unfetch';
import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import withApollo from 'libs/withApollo';

import AddRepoForm from './components/AddRepoForm';
import Repo from './components/Repo';

const USER_QUERY = gql`
  query user {
    user {
      userName
      repositories {
        owner
        name
      }
    }
  }
`;

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

  // static getInitialProps = async ({ req }) => {
  //   const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';

  //   const res = await fetch(`${baseUrl}/get-user-repos`, {
  //     method: 'POST',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // body: JSON.stringify({
  //   username: 'RemLampa',
  //   repo: 'RemLampa/tulongan-frontend',
  //   // repo: 'ContributorCovenant/contributor_covenant',
  // }),
  // });

  // const { username, repositories } = await res.json();

  // return { username, repositories };
  // };

  addRepo = (repo: Repositories) => {
    const { repositories } = this.state;

    const updatedRepos = repositories.concat(repo);

    this.setState({
      repositories: updatedRepos,
    });
  };

  deleteRepo = async (id: number) => {
    const res = await fetch('/delete-user-repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (res.status !== 200) {
      const { error } = await res.json();

      return console.log(error.message);
    }

    const { message } = await res.json();

    const { repositories } = this.state;

    const updatedRepositories = repositories.filter((_, index) => index !== id);

    this.setState({ repositories: updatedRepositories });

    return console.log(message);
  };

  render() {
    return (
      <div>
        <h1>Profile Page</h1>
        <h3>Rem Lampa</h3>

        <AddRepoForm onSubmit={this.addRepo} />

        <h3>Open Source Contributions</h3>
        <ul>
          <Query query={USER_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';

              if (error) return `Error: ${error}`;

              console.log(data.user.repositories[0]);

              return data.user.repositories.map((repo, index) => (
                <Repo
                  repo={repo}
                  username={data.user.userName}
                  onDelete={this.deleteRepo}
                  id={index}
                />
              ));
            }}
          </Query>
        </ul>
      </div>
    );
  }
}

export default withApollo(Profile);
