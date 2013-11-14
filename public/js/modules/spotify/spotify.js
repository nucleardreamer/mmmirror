/*
	blank module
*/

mmmirror.__proto__._spotify = function(data) {

	var dfd 	= $.Deferred(),
		_this 	= this;
	
	// do setup to return a resolve or reject
	(function(){
		_this.event('templatesLoaded').listen(renderSpotify);

		$('body').hammer().on('tap', '#playlist div[data-action]', function(){
			renderTracks($(this).attr('data-action'));
		});
		$('body').hammer().on('tap', '#tracks div[data-action]', function(){
			playTrack($(this).attr('data-action'))
		});
		$('body').hammer().on('tap', '#player .controls i', function(){
			var btn = $(this);
			if(btn.hasClass('play')){
				_this.dance.play();
			} else if(btn.hasClass('pause')){
				_this.dance.pause();
			}
		});
		dfd.resolve();
	})();
	
	function renderSpotify(){
		$(_this.args.selectors.front).append($.render.spotifyTmpl());
		$(_this.args.selectors.main).append($.render.playlistTmpl());
		$(_this.args.selectors.main).append($.render.trackTmpl());
		_this.event('api.getSpotifyPlaylists').push(function(d){
			$('#playlist').html($.render.playlistsTmpl(d)); 
		})
	}
	function renderTracks(uri){
		$.address.value('loader');
		_this.event('api.getSpotifyTracks').push({
			uri: uri,
			cb: function(d){
				console.log(d);
				$('#tracks').html($.render.tracksTmpl({tracks: d})); 
				$.address.value('tracks');
			}
		})
	}
	function canvasLoader(){
		var cl = new CanvasLoader('loading');
		cl.setColor('#00b7ff'); // default is '#000000'
		cl.setDiameter(120); // default is 40
		cl.setDensity(16); // default is 40
		cl.setRange(1.2); // default is 1.3
		cl.setFPS(20); // default is 24
		cl.show(); // Hidden by default
	}
	function playTrack(uri){
		$('#player').remove();
		$(_this.args.selectors.front).append($.render.playerTmpl());
		canvasLoader();
		_this.binaryStream = _this.binaryClient.createStream({song: uri});

		var parts = [],
			audioTrigger = true,
			player = $("#player");
		
		_this.binaryStream.on('data', function(data) {
			parts.push(data);
		});

		_this.binaryStream.on('end', function() {
			player.removeClass('loading');
			var url = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
			//player.src = url;
			var a = new Audio();
			a.src=url;
			_this.dance = new Dancer();
			_this.dance.load(a);
			// var kick = _this.dance.createKick({
			//   onKick: function ( mag ) {
			//     console.log('Kick!');
			//   	console.log(mag);
			//   },
			//   offKick: function ( mag ) {
			//   }
			// });
			// kick.on();
			_this.dance.waveform( player.find('canvas.waveform')[0], { strokeStyle: '#006288', strokeWidth: 9 });
			_this.dance.play();
		});
		$.address.value('front');
	}
	return dfd.promise();

}
//@ sourceURL=js/modules/spotify/spotify.js