import * as React from 'react';

interface GithubURLs {
  homepageURL: string;
  commitsURL: string;
  prURL: string;
}

function buildGitHubURLs(repo: string, username: string): GithubURLs {
  const homepageURL = `https://github.com/${repo}`;

  const commitsURL = `https://github.com/${repo}/commits?author=${username}`;

  const prURL = `https://github.com/${repo}/pulls?utf8=✓&q=is%3Apr+author%3A${username}+`;

  return {
    homepageURL,
    commitsURL,
    prURL,
  };
}

export interface Props {
  repo: string;
  username: string;
}

const Repo: React.StatelessComponent<{ Props }> = ({ repo, username }) => {
  const { homepageURL, commitsURL, prURL } = buildGitHubURLs(repo, username);

  return (
    <li>
      <h4>{repo}</h4>
      <div>
        <a href={homepageURL}>Visit Repo</a> |&nbsp;
        <a href={commitsURL}>View User&apos;s Commits</a> |&nbsp;
        <a href={prURL}>View User&apos;s PRs</a>
      </div>
    </li>
  );
};

export default Repo;
