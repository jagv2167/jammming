import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList.js';

class SearchResults extends React.Component {
  render() {
    return(
      <div className="SearchResults">
        <a className="Recommendations" onClick={this.props.onRecommend}>TOP RECOMMENDATIONS</a>
        <div className="SearchResults-box">
          <h2>Results</h2>
          <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd}/>
        </div>
      </div>
    );
  }
}

export default SearchResults;
