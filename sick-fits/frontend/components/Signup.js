import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Form  from './styles/Form';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      name
      email
      password
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    password: '',
    name: ''
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
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(signup, { error, loading }) => (
          <Form onSubmit={(ev) => this.onSubmit(ev, signup)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for an account</h2>
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
              <label htmlFor={'name'}>
                Name
                <input type={'text'}
                  name='name'
                  placeholder='name'
                  value={this.state.name}
                  onChange={this.saveToState}
                  />
              </label>
              <label htmlFor={'password'}>
                Password
                <input
                  type='password'
                  name='password'
                  placeholder='password'
                  value={this.state.password}
                  onChange={this.saveToState}
                  />
              </label>
              <button type='submit'>
                Sign Up
              </button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signup