import * as React from 'react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';

import gql from 'graphql-tag';

import { USER_QUERY } from 'pages/profile';

const ADD_REPO_MUTATION = gql`
  mutation createRepo($repo: CreateRepo!) {
    createRepoMutation(repo: $repo) {
      name
      owner
    }
  }
`;

interface Values {
  owner: string;
  name: string;
}

interface Actions {
  setErrors: (...args: any[]) => any;
  setSubmitting: (...args: any[]) => any;
}

async function addRepo(
  values: Values,
  actions: Actions,
  mutation: (any) => Promise<any>,
) {
  const { owner, name } = values;

  await mutation({
    variables: {
      repo: {
        owner,
        name,
      },
    },
    refetchQueries: [
      {
        query: USER_QUERY,
      },
    ],
  })
    .then(data => console.log(data))
    .catch(error => {
      actions.setFieldError('owner', error.message);
    });

  return actions.setSubmitting(false);
}

export interface Props {
  onSubmit: (
    repo: {
      name: string;
      owner: string;
    },
  ) => void;
}

const AddRepoForm: React.SFC<{}> = () => (
  <Mutation mutation={ADD_REPO_MUTATION}>
    {mutation => (
      <Formik
        initialValues={{
          owner: '',
          name: '',
        }}
        validate={() => {}}
        onSubmit={(values, actions) => addRepo(values, actions, mutation)}
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
                  name="owner"
                  placeholder="repo owner"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.owner}
                />
                &#x0002f;
                <input
                  type="text"
                  name="name"
                  placeholder="repo name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </div>
            </label>
            <button type="submit" disabled={isSubmitting}>
              Verify
            </button>
            {errors.owner && <div>{errors.owner}</div>}
          </form>
        )}
      />
    )}
  </Mutation>
);

export default AddRepoForm;
