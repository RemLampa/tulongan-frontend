import * as React from 'react';
import { Formik } from 'formik';
import fetch from 'isomorphic-unfetch';

async function addRepo(values, actions) {
  const { repoOwner, repoName } = values;

  const githubReqURL = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?author=RemLampa`;

  const res = await fetch(githubReqURL, {
    method: 'GET',
  });

  if (res.status !== 200) {
    const errorMessage = `Error: ${repoOwner}/${repoName} is an invalid Github repository.`;

    actions.setErrors({ repoOwner: errorMessage });

    return actions.setSubmitting(false);
  }

  const commits = await res.json();

  if (!commits.length) {
    const errorMessage = `Error: You are not a contributor in ${repoOwner}/${repoName}`;

    actions.setErrors({ repoOwner: errorMessage });

    return actions.setSubmitting(false);
  }

  console.log(
    `${repoOwner}/${repoName} has been successfully added to your portfolio!`,
  );

  return actions.setSubmitting(false);
}

const Form: React.StatelessComponent<{}> = () => (
  <Formik
    initialValues={{
      repoOwner: '',
      repoName: '',
    }}
    validate={() => {}}
    onSubmit={addRepo}
    render={({
      values,
      errors,
      handleChange,
      handleBlur,
      isSubmitting,
      handleSubmit,
    }) => (
      <form onSubmit={handleSubmit}>
        <label htmlFor="repo">
          <h3>Add a Github repository to your portfolio</h3>
          <div>
            https&#x0003A;&#x0002f;&#x0002F;github.com&#x0002f;
            <input
              type="text"
              name="repoOwner"
              placeholder="repo owner"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.repoOwner}
            />
            &#x0002f;
            <input
              type="text"
              name="repoName"
              placeholder="repo name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.repoName}
            />
          </div>
        </label>
        <button type="submit" disabled={isSubmitting}>
          Verify
        </button>
        {errors.repoOwner && <div>{errors.repoOwner}</div>}
      </form>
    )}
  />
);

const Profile: React.StatelessComponent<{}> = () => (
  <div>
    <h1>Profile Page</h1>
    <h3>Rem Lampa</h3>

    <Form />

    <h3>Open Source Contributions</h3>
    <ul>
      <li>Project 1</li>
      <li>Project 3</li>
    </ul>
  </div>
);

// Profile.getInitialProps = async () => {

// };

export default Profile;
