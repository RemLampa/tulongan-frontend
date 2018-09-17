import { withData } from 'next-apollo';
import { HttpLink } from 'apollo-link-http';

// can also be a function that accepts a `context` object (SSR only) and returns a config
const config = {
  link: new HttpLink({
    uri: 'http://localhost:3030/graphql', // Server URL (must be absolute)
    // opts: {
    //   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    // },
  }),
};

export default withData(config);
