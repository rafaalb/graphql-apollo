import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import OrderItem from './OrderItem'


const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;
export default class componentName extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  render() {
    return (
      <Query
        query={SINGLE_ORDER_QUERY}
        variables={{ id: this.props.id }}
      >
        {({ data: { order }, loading, error }) => {
          if (error) return <Error error={error} />
          if (loading) return <p>loading...</p>
          return (
            <OrderItem order={order} />
          )
        }}
      </Query>
    )
  }
}
