import Permissions from '../components/Permissions';
import PleaseSignin from '../components/PleaseSignin';

const PermissionsPage = props => {
  return (
    <PleaseSignin>
      <Permissions />
    </PleaseSignin>
  )
}

export default PermissionsPage;