import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Form  from './styles/Form';
import Error from './ErrorMessage';
import gql from 'graphql-tag';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!,
    $password: String!,
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken,
      password: $password,
      confirmPassword: $confirmPassword
    ) {
      email
      name
    }
  }
`;

class Reset extends Component {
  state = {
    password: '',
    confirmPassword: ''
  }

  saveToState = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  onSubmit = async (ev, requestReset) => {
    ev.preventDefault();
    await requestReset();
    this.setState({ password: '', confirmPassword: '' });
  }
  render() {

    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          ...this.state,
          resetToken: this.props.resetToken
        }}
      >
        {(resetPassword, { error, loading, called }) => (
          <Form onSubmit={(ev) => this.onSubmit(ev, resetPassword)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Password Reset</h2>
              <Error error={error} />
              {!error && !loading && called &&
                <p>Password updated</p>
              }
              <label htmlFor={'password'}>
                New Password:
                <input
                  type='password'
                  name='password'
                  placeholder='password'
                  value={this.state.password}
                  onChange={this.saveToState}
                  />
              </label>
              <label htmlFor={'confirmPassword'}>
                New Password:
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Confirm password'
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                  />
              </label>
              <button type='submit'>
                Reset password
              </button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Reset;