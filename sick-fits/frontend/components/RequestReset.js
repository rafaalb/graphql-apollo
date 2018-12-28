import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Form  from './styles/Form';
import Error from './ErrorMessage';
import gql from 'graphql-tag';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: '',
  }

  saveToState = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  onSubmit = async (ev, requestReset) => {
    ev.preventDefault();
    await requestReset();
    this.setState({ email: '' });
  }
  render() {
    return (
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(requestReset, { error, loading, called }) => (
          <Form onSubmit={(ev) => this.onSubmit(ev, requestReset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request reset</h2>
              <Error error={error} />
              {!error && !loading && called &&
                <p>Success! Check your email for a reset link</p>
              }
              <label htmlFor={'email'}>
                Email
                <input type={'text'}
                  name='email'
                  placeholder='email'
                  value={this.state.email}
                  onChange={this.saveToState}
                  />
              </label>
              <button type='submit'>
                Request reset
              </button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default RequestReset;