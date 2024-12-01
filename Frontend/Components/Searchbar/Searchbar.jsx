import './Searchbar.css';

function Searchbar({ onSearch }) {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(e.target.value);
        }
    }

    const handleSearchClick = () => {
        onSearch(document.querySelector('.searchbar').value);
    }

  return (
    <div className='searchbar-container'>
      <input
        type='text'
        className='searchbar'
        placeholder='Search...'
        onChange={handleKeyPress}
      />
      <div className='search-button-container' onClick={handleSearchClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  );
}

export default Searchbar;