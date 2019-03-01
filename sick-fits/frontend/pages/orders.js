import Orders from '../components/Orders';
import PleaseSignin from '../components/PleaseSignin';

const OrdersPage = props => {
  return (
    <PleaseSignin>
      <Orders />
    </PleaseSignin>
  )
}

export default OrdersPage;