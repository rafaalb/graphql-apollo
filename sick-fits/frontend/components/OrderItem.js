import React from 'react'
import Head from 'next/head'
import { format } from 'date-fns'
import formatMoney from '../lib/formatMoney'
import OrderStyles from './styles/OrderStyles'

export default ({ order }) => {
  return (
    <OrderStyles>
      <Head>
        <title>Sick fits - Order {order.id}</title>
      </Head>
      <p>
        <span>OrderID:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Date:</span>
        <span>{format(order.createdAt, 'MMMM D, YYYY h:mm a', { awareOfUnicodeTokens: true })}</span>
      </p>
      <p>
        <span>Total:</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <p>
        <span>Item Count:</span>
        <span>{order.items.length}</span>
      </p>
      <div className="items">
        {order.items.map(item => (
          <div className="order-item" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div className="item-details">
              <h2>{item.title}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  )
}
