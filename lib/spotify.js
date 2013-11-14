var Spotify = require('spotify-web');
var _ = require('underscore')

var username = 'nucleardreamer';
var password = 'zeroice';

module.exports = function(){

  var spot = function(cb){
    var _this = this;
    console.log('*** spotify init');
    _this.playlists = [];
    _this.fetchPlaylists(function(d){
      if(cb)cb(d);
    })
  }
  spot.prototype.playTrack = function(stream, meta){
    var _this = this;
    Spotify.login(username, password, function (err, spotify) {
      if (err) throw err;
      spotify.get(meta.song, function (err, track) {
        if (err) throw err;
        console.log('Streaming: %s - %s', track.artist[0].name, track.name);

        track.play()
          .pipe(stream)
          .on('finish', function () {
            console.log('song ended')
            spotify.disconnect();
          });
      });
    })
  }
  spot.prototype.getAllPlaylists = function(cb){
    cb(this.playlists);
  }
  spot.prototype.getAllTracks = function(uri, cb){
    var _this = this, count = 0;
    _this.tracks = [];
    _.each(_this.playlists, function(e){
      if(e.uri == uri){
        Spotify.login(username, password, function (err, spotify) {
          if (err) throw err;
          var toRet = [];
          _.each(e.contents.items, function(ee){  
            spotify.get(ee.uri, function (err, track) {
              _this.tracks.push({
                uri: ee.uri,
                data: track
              });
              if(count == e.contents.items.length -1){
                spotify.disconnect();
                if(cb)cb(_this.tracks);
              } else {
                count++;
              }
            });  
          })
        })
      }
    })
  }
  spot.prototype.fetchPlaylists = function(cb){
    var _this = this;
    console.log('*** pulling spotify playlists');

    Spotify.login(username, password, function (err, spotify) {
      if (err) throw err;

      spotify.rootlist(function (err, rootlist) {
        if (err) throw err;
        var count = 0;
        _.each(rootlist.contents.items, function(e, i){
            spotify.playlist(e.uri, function (err, playlist) {
              if (err) throw err;
              playlist.uri = e.uri;
              _this.playlists.push(playlist);

              if(count == rootlist.contents.items.length -1){
                console.log('*** got all playlists');
                spotify.disconnect();
                if(cb) cb(_this.playlists);
              } else {
                count++;
              }            
            });
        })
      });
    });  
  }
  
  return spot;
}