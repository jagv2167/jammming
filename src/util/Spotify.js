const clientID = '';
const redirectURI = 'http://localhost:3000/';

let accessToken = '';
let expiresIn = '';

const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    else if (window.location.href.match(/access_token=([^&]*)/)) {
      let url = window.location.href;
      // Get the accessToken from the url.
      accessToken = url.match(/access_token=([^&]*)/);
      accessToken = accessToken[1];
      // Get the expiresIn from the url.
      expiresIn = url.match(/expires_in=([^&]*)/);
      expiresIn = expiresIn[1];
      // The expiresIn value from Spotify is in seconds.
      // The delay parameter in setTimeout is in milliseconds.
      // Need to multiply the expiresIn value by 1000 so the accessToken
      // is cleared at the same time it expires.
      window.setTimeout(clearToken, expiresIn * 1000);
      function clearToken() {
        accessToken = '';
      }
      // This wipes out the parameters in the url.
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else {
      // If the accessToken is empty, then request the user to authenticate
      // in order to get an accessToken from Spotify.
      // If the accessToken expired and the user has authenticated in the past,
      // then the user will be automatically redirected to the redirectURI
      // and the accessToken will be included in the url.
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}&show_dialog=true`
    }
  },

  search(term) {
    // Make sure there is an accessToken before sending the request.
    Spotify.getAccessToken();
    // This request returns up to 20 tracks matching the term.
    return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track,album,artist`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)
    ).then(jsonResponse => {
      // Check to see if the response has 'tracks' key.
      if (jsonResponse.tracks) {
        // Spotify uses the key 'items'.
        // Map each track's key-value pairs.
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
    })
  },

  savePlaylist(playlistName, urisArray) {
    // Make sure there is an accessToken before sending the request.
    Spotify.getAccessToken();
      let headers = {Authorization: `Bearer ${accessToken}`};
      let userID = '';
      let playlistID = '';
      // The following code block is composed of three separate requests
      // chained by two main .thens.
      // This request returns the userID of the current user.
      fetch(`https://api.spotify.com/v1/me`, {
        headers: headers
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        if (jsonResponse.id) {
          userID = jsonResponse.id;
          console.log(`User ID: ${userID}`);
          console.log(jsonResponse);
        }
      }).then(() => {
        // This request:
        // 1) Creates a playlist.
        // 2) Posts the playlistName to the playlists of the current userID.
        // 3) Returns the playlistID.
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          if (jsonResponse.id) {
            playlistID = jsonResponse.id;
            console.log(`Playlist ID: ${playlistID}`);
            console.log(jsonResponse);
          }
        })
      }).then(() => {
        // This request posts the list of tracks, via an array of URIs, to
        // the specified playlistID.
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: urisArray})
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          console.log(jsonResponse);
          return jsonResponse;
        })
      })
  }

};

export default Spotify;
