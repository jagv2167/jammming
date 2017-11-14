import React from 'react';
import './SearchBar.css';

const searchByOptionsObj = {
  'By Name': 'track',
  'By Album': 'album',
  'By Artist': 'artist'
};

class SearchBar extends React.Component {
  // SearchBar owns the "term" state.
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      searchBy: 'track'
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(event) {
    // Only search when a term is actually entered AND either the search button
    // is clicked or the "Enter" key is pressed.
    // Otherwise, if we send an empty query, we get a Bad Request response.
    if (this.state.term && (event.key === "Enter" || event.type === "click")) {
      // .search() passes the term up to parent App using
      // this.props.onSearch().
      this.props.onSearch(this.state.term, this.state.searchBy);
      event.preventDefault();
    }
  }

  handleTermChange(event) {
    // Re-render term when a change in the input field is triggered.
    this.setState({term: event.target.value});
  }

  getSearchByClass(searchByOption) {
    if (this.state.searchBy === searchByOption) {
      return 'active';
    }
    else {
      return '';
    }
  }

  handleSearchByChange(searchByOption) {
    this.setState({searchBy: searchByOption});
  }

  renderSearchByOptions() {
    return Object.keys(searchByOptionsObj).map(searchByOption => {
      let searchValue = searchByOptionsObj[searchByOption];
      return <li
        className={this.getSearchByClass(searchValue)}
        onClick={this.handleSearchByChange.bind(this, searchValue)}
        key={searchValue}>
        {searchByOption}
        </li>
    });
  }

  render() {
    return(
      <div className="SearchBar">
        <div className="SearchBar-search-options">
          <ul>
            {this.renderSearchByOptions()}
            {/*<li className="active">Songs</li>
            <li>Albums</li>
            <li>Artists</li>*/}
          </ul>
        </div>
        <input type="text" placeholder="Find Songs" onChange={this.handleTermChange} onKeyDown={this.search}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
