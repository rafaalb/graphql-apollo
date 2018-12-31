import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id,
      name,
      email,
      permissions
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION(
    $userId: ID!
    $permissions: [Permission]
  ) {
    updatePermissions(
      userId: $userId
      permissions: $permissions
    ) {
      name
      email
      permissions
    }
  }
`;

const Permissions = (props) => {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) => console.log(data) || (
          <div>
            <Error error={error} />
            {data.users &&
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>email</th>
                    {possiblePermissions.map(permission => (
                      <th key={`${permission}-possible`}>
                        {permission}
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <UserPermissions user={user} key={`${user.id}-permissions`}/>
                  ))}
                </tbody>
              </Table>
            }
          </div>
        )
      }
    </Query>
  )
}

class UserPermissions extends React.Component {
  state = {
    permissions: this.props.user.permissions
  };
  updatePermissions = (ev, permission) => {
    let permissions = this.state.permissions.filter(perm => 
      perm !== permission
    );
    if (ev.target.checked) {
      permissions = this.state.permissions.concat(permission);
    }
    this.setState({ permissions });
  }
  render() {
    const user = this.props.user;
    return (
      <Mutation
        mutation={UPDATE_USER_MUTATION}
        variables={{
          userId: user.id,
          permissions: this.state.permissions
        }}
      >
        {(updateUser, { data, error, loading}) => {
          return (
            <>
            {error && 
              <tr>
                <td colspan={8}>
                  <Error error={error} />
                </td>
              </tr>
            }
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type='checkbox'
                      checked={this.state.permissions.some(perm => perm === permission)}
                      onChange={(ev) => this.updatePermissions(ev, permission)}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  onClick={updateUser}
                  disabled={loading}
                >
                  Updat{loading ? `ing` : `e`}
                </SickButton>
              </td>
            </tr>
            </>
          );
        }}
      </Mutation>
    )
  }
}

UserPermissions.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.array
  }).isRequired
}

export default Permissions;
export { ALL_USERS_QUERY, UPDATE_USER_MUTATION };