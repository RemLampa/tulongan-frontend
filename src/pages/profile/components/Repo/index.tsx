import * as React from 'react';

interface GithubURLs {
  homepageURL: string;
  commitsURL: string;
  prURL: string;
}

interface RepoObj {
  repoName: string;
  repoOwner: string;
}

function buildGitHubURLs(repo: RepoObj, username: string): GithubURLs {
  const repoString = `${repo.repoOwner}/${repo.repoName}`;

  const homepageURL = `https://github.com/${repoString}`;

  const commitsURL = `https://github.com/${repoString}/commits?author=${username}`;

  const prURL = `https://github.com/${repoString}/pulls?utf8=✓&q=is%3Apr+author%3A${username}+`;

  return {
    homepageURL,
    commitsURL,
    prURL,
  };
}

export interface Props {
  repo: RepoObj;
  username: string;
  onDelete: (number) => void;
  id: number;
}

const Repo: React.SFC<Props> = ({ repo, username, onDelete, id }) => {
  const { homepageURL, commitsURL, prURL } = buildGitHubURLs(repo, username);

  return (
    <li>
      <h4>
        {repo.repoOwner}/{repo.repoName} ID: {id}
      </h4>
      <div>
        <a href={homepageURL}>Visit Repo</a> |&nbsp;
        <a href={commitsURL}>View User&apos;s Commits</a> |&nbsp;
        <a href={prURL}>View User&apos;s PRs</a>
      </div>
      <div>
        <button type="button" onClick={() => onDelete(id)}>
          Remove Repo
        </button>
      </div>
    </li>
  );
};

export default Repo;
