import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String!
    $largeImage: String!
    $price: Int!
  ) {
    createItem(
      title: $title 
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`; // we use $ to pass the parameter throught the function


export default class createItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  }
  handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  }

  uploadFile = async (e) => {
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sick-fits');
    const res = await fetch('https://api.cloudinary.com/v1_1/ddq1kn4hy/image/upload/', {
      method: 'POST',
      body: data
    });
    const file = await res.json();
    this.setState({ image: file.secure_url, largeImage: file.eager[0].secure_url });
  }
  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}
      >
      {(createItem, { loading, error }) => (
        <Form onSubmit={async (e) => {
          e.preventDefault(); // stop the form from submitting

          const res = await createItem(this.state); // call mutation
          Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id }
          })
        }}>
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                onChange={this.uploadFile}
              />
              {this.state.image && <img width="200" src={this.state.image} alt={'Upload preview'} />}
            </label>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={this.state.title}
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
                required
                value={this.state.description}
                onChange={this.handleChange}
              />
            </label>
            <button type="submit">
              Submit
            </button>
          </fieldset>
        </Form>
      )}
      </Mutation>
    )
  }
}

export { CREATE_ITEM_MUTATION };