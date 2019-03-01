import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import OrderItem from './OrderItem'

const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY {
    orders {
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

class Orders extends Component {
  render() {
    return (
      <Query
        query={ALL_ORDERS_QUERY}
      >
        {({ data: { orders }, loading, error }) => {
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>
          return orders.map(order =>
            <OrderItem order={order} key={order.id} />
          )
        }}
      </Query>
    )
  }
}

export default Orders;