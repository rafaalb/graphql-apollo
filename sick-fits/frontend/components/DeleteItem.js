import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_ITEMS_QUERY } from './Items' 

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;
export default class DeleteItem extends Component {
  onDelete = (deleteItemMutation) => {
    if (confirm('Are you sure you want to delete?')) {
      deleteItemMutation().catch((err) => alert(err.message))
    }
  }
  update = (cache, payload) => {
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id)
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{
          id: this.props.id
        }}
        update={this.update}
      >
        {(deleteItem, { data, loading, error }) => {
          return (
            <button onClick={() => this.onDelete(deleteItem)}>
              Delete Item
            </button>
          )
        }}
      </Mutation>
    )
  }
}
