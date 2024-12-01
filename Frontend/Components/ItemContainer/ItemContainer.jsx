import './ItemContainer.css';

function ItemContainer({ searchQuery }) {
  return (
    <div className="item-container">
      <p>{ searchQuery ? searchQuery : "Type something and search to display search query" }</p>
    </div>
  );
}

export default ItemContainer;