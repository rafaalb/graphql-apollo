import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title 
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`; // we use $ to pass the parameter thought the function


export default class UpdateItem extends Component {
  state = {

  }
  handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  }
  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
    console.log(res)
  }
  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ data, loading}) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No item found for id: {this.props.id}</p>
          return (
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              variables={this.state}
            >
            {(updateItem, { loading, error }) => (
              <Form onSubmit={e => this.updateItem(e, updateItem)}>
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Title"
                      required
                      value={this.state.title}
                      defaultValue={data.item.title}
                      onChange={this.handleChange}
                    />
                  </label>
                  <label htmlFor="price">
                    Price
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Price"
                      required
                      value={this.state.price}
                      defaultValue={data.item.price}
                      onChange={this.handleChange}
                    />
                  </label>
                  <label htmlFor="description">
                    Description
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Enter a description"
                      defaultValue={data.item.description}
                      required
                      value={this.state.description}
                      onChange={this.handleChange}
                    />
                  </label>
                  <button type="submit">
                    Sav{loading ? `ing` : `e`} Changes
                  </button>
                </fieldset>
              </Form>
            )}
            </Mutation>
          );
        }}
      </Query>
    )
  }
}

export { UPDATE_ITEM_MUTATION };