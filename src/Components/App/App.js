import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
      super(props);
      // App owns three states: searchResults, playlistName, and playlistTracks.
      this.state = {
        searchResults: [],
        playlistName: '',
        playlistTracks: []
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.searchSpotify = this.searchSpotify.bind(this);
    }

  addTrack(track) {
    // Find whether the track just passed is in the playlistTracks array or not.
    // .find() returns the value of the first element that satisfies the condition.
    // Otherwise it returns undefined (falsy).
    let inPlaylist = this.state.playlistTracks.find(trackObj => trackObj.id === track.id);
    if (!inPlaylist) {
      // Take the current state (prevState) and .push() the track we want to add.
      // .push() modifies the array and returns the new length of the array.
      // Assign the modified state to playlistTracks and re-render the playlistTracks.
      this.setState(function(prevState, props) {
        prevState.playlistTracks.push(track);
        return {playlistTracks: prevState.playlistTracks}
      });
    }
  }

  removeTrack(track) {
    // Take the current state (prevState) and use .filter() to return a new array
    // with only the elements that satisfy the condition.
    // Assign the filteredPlaylist to playlistTracks and re-render the playlistTracks.
    this.setState(function(prevState, props) {
      let filteredPlaylist = prevState.playlistTracks.filter(trackObj => trackObj.id !== track.id);
      return {playlistTracks: filteredPlaylist}
    });
  }

  updatePlaylistName(name) {
    // Re-render the playlistName.
    this.setState({playlistName: name});
  }

  savePlaylist() {
    // If playlistTracks is not empty AND playlistName has a value other than '',
    // then use playlistTracks to create an array of Track URIs using .map().
    // and then pass the playlistName and trackUris parameters to .savePlaylist() in Spotify.
    if (this.state.playlistTracks.length !== 0 && this.state.playlistName) {
      let trackUris = this.state.playlistTracks.map(trackObj => trackObj.uri);
        Spotify.savePlaylist(this.state.playlistName, trackUris);
        // Reset the playlistName and playlistTracks and re-render them both.
        this.setState({playlistName: ''});
        this.setState({playlistTracks: []});
      //}
    }
  }

  searchSpotify(term) {
    // Send the parameter to .search() in Spotify and then re-render the
    // searchResults.
    Spotify.search(term).then(searchResults => this.setState({searchResults: searchResults}));
  }

  render() {
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.searchSpotify}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist
              playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
