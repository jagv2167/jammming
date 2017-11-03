import React from 'react';
import './TrackList.css';
import Track from '../Track/Track.js';

class TrackList extends React.Component {
  render() {
    return(
      <div className="TrackList">
      {/* Create an array of track components each with its own props.
        Depending on wheether the track component is rendered in the
        SearchResults or the Playlist each uses different props. */}
        {this.props.tracks.map(track => <Track track={track}
            key={track.id}
            onAdd={this.props.onAdd}
            onRemove={this.props.onRemove}
            isRemoval={this.props.isRemoval}/>)}
      </div>
    );
  }
}

export default TrackList;
