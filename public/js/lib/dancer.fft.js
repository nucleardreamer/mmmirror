(function() {
  Dancer.addPlugin( 'fft', function( canvasEl, options ) {
    options = options || {};
    var
      ctx     = canvasEl.getContext( '2d' ),
      h       = canvasEl.height,
      w       = canvasEl.width,
      width   = options.width || 6,
      spacing = options.spacing || 2,
      count   = options.count || 512;

    ctx.fillStyle = options.fillStyle || "white";

    this.bind( 'update', function() {
      var spectrum = this.getSpectrum();
      ctx.clearRect( 0, 0, w, h );
      for ( var i = 0, l = spectrum.length; i < l && i < count; i++ ) {
        ctx.fillRect( i * ( spacing + width ), h, width, -spectrum[ i ] * (h*6) );
      }
      if(!this.isPlaying()){
        console.log('done playing');
        if(options.done)options.done();
      }
    });

    return this;
  });
})();