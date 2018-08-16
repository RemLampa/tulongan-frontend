import * as React from 'react';
import { Formik } from 'formik';

async function addRepo(values, actions) {
  const { repoOwner, repoName } = values;

  const addRepoEndpoint = '/add-user-repo';

  const res = await fetch(addRepoEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repoOwner, repoName }),
  });

  const { error, message } = await res.json();

  if (res.status !== 200) {
    const errorMessage = `Error: ${error.message}`;

    actions.setErrors({ repoOwner: errorMessage });

    return actions.setSubmitting(false);
  }

  if (error) {
    const errorMessage = `Error: ${error.message}`;

    actions.setErrors({ repoOwner: errorMessage });

    return actions.setSubmitting(false);
  }

  console.log(message);

  return actions.setSubmitting(false);
}

const AddRepoForm: React.StatelessComponent<{}> = () => (
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

export default AddRepoForm;
