import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { CURRENT_USER_QUERY } from './User'


const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;
const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;


export default class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }
  // this gets called as soon as we get a response back from the server after a mutation has been performed
  update = (cache, payload) => {
    //1. first read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    //2. remove that item from the cache
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    //3. write that item to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data })
  }
  render() {
    const { id } = this.props 
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{ // if we want an optimistic response assuming that everything its going to work, pass a default value like this and it runs inmediately without waiting for the server
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}
      >
        {(removeFromCart, { loading, error }) => (
          <BigButton
            title="Delete Item"
            onClick={() => 
              removeFromCart()
                .catch(err => alert(err.message))
            }
            disabled={loading}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}

