import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  // SearchBar owns the "term" state.
  constructor(props) {
    super(props);
    this.state = {term: ''};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(event) {
    // Only search when a term is actually entered.
    // Otherwise, if we send an empty query, we get a Bad Request response.
    if (this.state.term) {
      // .search() passes the term up to parent App using
      // this.props.onSearch().
      this.props.onSearch(this.state.term);
      event.preventDefault();
    }
  }

  handleTermChange(event) {
    // Re-render term when a change in the input field is triggered.
    this.setState({term: event.target.value});
  }

  render() {
    return(
      <div className="SearchBar">
        <input type="text" placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
