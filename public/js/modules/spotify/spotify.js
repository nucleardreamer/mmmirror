/*
	blank module
*/

mmmirror.__proto__._spotify = function(data) {

	var dfd 	= $.Deferred(),
		_this 	= this;
	
	// do setup to return a resolve or reject
	(function(){
		_this.event('templatesLoaded').listen(renderSpotify);
		$('body').hammer().on('tap', '#spotify',function(){
			if(!$(_this.args.selectors.main).hasClass('uiHidden')){
				$('#playlists').css('display','block').removeClass('hidden');
			}
		});
		$('body').hammer().on('tap', '#playlists div[data-uri]', function(){
			var thisUri = $(this).attr('data-uri');
			if($(this).hasClass('track')){
				playTrack(thisUri)
			} else {
				renderTracks(thisUri)
			}
		});

		dfd.resolve();
	})();
	
	function renderSpotify(){
		$(_this.args.selectors.main).append($.render.spotifyTmpl());
		renderPlaylists();
	}
	function renderPlaylists(){
		_this.event('api.getSpotifyPlaylists').push(function(d){
			$('#playlists').html($.render.playlistsTmpl(d)); 
		})
	}
	function renderTracks(uri){
		$('#playlists').html('loading');
		_this.event('api.getSpotifyTracks').push({
			uri: uri,
			cb: function(d){
				console.log(d);
				$('#playlists').html($.render.tracksTmpl({tracks: d})); 
			}
		})
	}
	function playTrack(uri){
		_this.event('api.playTrack').push({
			uri: uri,
			cb: function(d){
				console.log(d);
				$('#playlists').css('display','none').addClass('hidden');
			}
		});
	}
	return dfd.promise();

}
//@ sourceURL=js/modules/spotify/spotify.js