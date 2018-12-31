import React from 'react';

import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const PleaseSignin = props => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.me) {
          return (
            <div>
              Please signin before continuing
              <Signin />
            </div>
          );
        }
        return props.children
      }}
    </Query>
  )
}

export default PleaseSignin;


