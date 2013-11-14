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
		$('body').hammer().on('tap', '#player .controls i', function(){
			var btn = $(this),
				audio = $('#player audio')[0];
			if(btn.hasClass('play')){
				audio.play();
			} else if(btn.hasClass('pause')){
				audio.pause();
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
	function canvasLoader(){
		var cl = new CanvasLoader('loader');
		cl.setColor('#00b7ff'); // default is '#000000'
		cl.setDiameter(120); // default is 40
		cl.setDensity(16); // default is 40
		cl.setRange(1.2); // default is 1.3
		cl.setFPS(20); // default is 24
		cl.show(); // Hidden by default
	}
	function playTrack(uri){
		$('#player').remove();
		$(_this.args.selectors.main).append($.render.playerTmpl());
		canvasLoader();
		_this.binaryStream = _this.binaryClient.createStream({song: uri});
		var parts = [],
			audioTrigger = true,
			player = $("#player audio")[0],
			playerCont = $("#player");

		_this.binaryStream.on('data', function(data) {
			parts.push(data);
		});

		_this.binaryStream.on('end', function() {
			playerCont.removeClass('loading');
			var url = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
			player.src = url;
			player.play();
		});
		$('#playlists').css('display','none').addClass('hidden');
	}
	return dfd.promise();

}
//@ sourceURL=js/modules/spotify/spotify.js