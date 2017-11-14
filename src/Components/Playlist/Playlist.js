import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList.js';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    // Playlist owns the isRemoval state, which is used to render a "+" for
    // each track in SearchResults or a "-" for each track in Playlist.
    this.state = {isRemoval: true};
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    // When a change in the input field is triggered, pass the playlist name
    // entered up to parent App using this.props.onNameChange().
    this.props.onNameChange(event.target.value);
  }

  render() {
    return(

      <div className="Playlist">
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
        <div className="Playlist-box">
          
          {/* Use placeholder instead of defaultValue in order for the playlistName
            1) state to be cleared
            2) re-render to an empty value
            after a playlist has been saved. Also, placeholder provides the desired behavior
            when interacting with the input text field. */}
          <input type="text" placeholder="New Playlist" value={this.props.playlistName} onChange={this.handleNameChange} onKeyDown={this.props.onSave}/>
          <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={this.state.isRemoval}/>
        </div>
      </div>
    );
  }
}

export default Playlist;
