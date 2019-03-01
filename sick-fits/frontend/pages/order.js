import Order from '../components/Order';
import PleaseSignin from '../components/PleaseSignin';

const OrderPage = props => {
  return (
    <PleaseSignin>
      <Order id={props.query.id} />
    </PleaseSignin>
  )
}

export default OrderPage;