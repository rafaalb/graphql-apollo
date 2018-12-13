import SingleItem from '../components/SingleItem';

const Item = props => {
  const { query } = props;
  return (
    <div>
      <SingleItem id={query.id} />
    </div>
  )
}

export default Item;