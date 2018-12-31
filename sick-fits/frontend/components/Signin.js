import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Form  from './styles/Form';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class Signin extends Component {
  state = {
    email: '',
    password: '',
  }

  saveToState = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  onSubmit = async (ev, signup) => {
    ev.preventDefault();
    await signup();
    this.setState({ email: '', password: '', name: '' });
  }
  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(signup, { error, loading }) => (
          <Form onSubmit={(ev) => this.onSubmit(ev, signup)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in</h2>
              <Error error={error} />
              <label htmlFor={'email'}>
                Email
                <input type={'text'}
                  name='email'
                  placeholder='email'
                  value={this.state.email}
                  onChange={this.saveToState}
                  />
              </label>
              <label htmlFor={'password'}>
                Password
                <input
                  type={'password'}
                  name='password'
                  placeholder='password'
                  value={this.state.password}
                  onChange={this.saveToState}
                  />
              </label>
              <button type='submit'>
                Sign In
              </button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signin;