import './ItemContainer.css';
import ItemCard from '../ItemCard/ItemCard';

function ItemContainer({ searchQuery }) {
  const cardsdisplayed = [];
  //temporary for loop to generate a lot of cards for testing display
  for (let i = 0; i < 50; i++) {
    const randomPrice = (i).toFixed(2);
    cardsdisplayed.push(<ItemCard price={randomPrice} key={i}/>);
  }
  return (
    <div className="item-container">
      <div className="search-result">
        <p>{ searchQuery ? searchQuery : "Type something and search to display search query" }</p>
      </div>
      <div className="item-cards-grid">
        {cardsdisplayed}
      </div>
    </div>
  );
}

export default ItemContainer;