import CreateItem from '../components/CreateItem';
import PleaseSignin from '../components/PleaseSignin';

const Sell = props => {
  return (
    <PleaseSignin>
      <CreateItem />
    </PleaseSignin>
  )
}

export default Sell;