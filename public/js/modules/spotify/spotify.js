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
			var item = $(this);
			playTrack(item.attr('data-action'), item.find('.name').text(),item.find('.artist').text())
		});
		$('body').hammer().on('tap', '.player .controls i', function(){
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
		$(_this.args.selectors.main).append($.render.visualizerTmpl());

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
	function playTrack(uri, name, artist){
		$('.player').remove();
		$.address.value('loader');
		var playerTmpl = $.render.playerTmpl({
			name: name,
			artist: artist
		});
			$(_this.args.selectors.front).append(playerTmpl);
			$('#visualizer').append(playerTmpl);	

		canvasLoader();
		_this.binaryStream = _this.binaryClient.createStream({song: uri});

		var parts = [],
			audioTrigger = true,
			player = $(".player");
		
		_this.binaryStream.on('data', function(data) {
			parts.push(data);
		});

		_this.binaryStream.on('end', function() {
			$.address.value('visualizer');
			player.removeClass('loading');
			$()
			var url = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
			//player.src = url;
			var a = new Audio();
			a.src=url;

			a.addEventListener('ended', function() {
			    $('.player').remove();
			    $.address.value('front');
			}, false);
			var progress = setInterval(function(){
				var prog = Math.ceil((a.currentTime / a.duration)*100).toFixed(1)
				player.find('.progress .fill').css('width',prog+'%');
			},1000);

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
			
			_this.dance.fft( $('#visualizer canvas')[0], { fillStyle: '#006288', width: 15, spacing: 3, count: 1024 });
			_this.dance.play();
		});
	}
	return dfd.promise();

}
//@ sourceURL=js/modules/spotify/spotify.js