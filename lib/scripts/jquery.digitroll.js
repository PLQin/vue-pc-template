(function( $ ){

	var li = [];

	$.fn.digitroll = function( options ){
	
		var opts = $.extend({
				baseValue: null,
				step: null,
				range:null,
				bg:[],
				odd:null,
				interval: 3000
			}, options ),
			container = this;

		this.each( function() {
			var baseValue = opts.baseValue,
				step = opts.step,
				digit;
			if( !baseValue ){
					return;
			}

			if( li.length === 0 ){
				_generateMarkup( opts, container );
			}				

			setInterval( function() {
				//console.log( 2 );

				digit = baseValue.toString().split("").reverse();

				$.each(digit,function(i,n){
					//span[i].animate({"top":"-=40px"},500,function(){span[i].css({"top":"-40px"}).stop();});
					var newSpan = [],
						oldSpan = [],
						oHeight = li[i].height();

					newSpan[i] = $( "<span/>" ).css({
						"top":oHeight + "px"
					}).text( n ).appendTo( li[i] );

					oldSpan[i] = li[i].find( "span" ).first();

					if ( newSpan[i].text() == oldSpan[i].text() ) {

						newSpan[i].remove();

					} else {

						newSpan[i].animate({
							"top":"-=" + oHeight + "px"
						},500);

						oldSpan[i].animate({
							"top":"-=" + oHeight + "px"
						},600,function(){
							oldSpan[i].remove();
						});

					}
				});
				
				baseValue += step;

			} , opts.interval );

		});

	};

	function _generateMarkup( opts, container ){

		var ul = $( "<ul/>" ).appendTo( $(container) ),
			span = [];
		
		for( var i = 0; i<opts.range; i++){
			li[i] = $( "<li/>" ).appendTo( ul );
			span[i] = $( "<span/>" ).text(0).appendTo( li[i] );

			if( i % opts.odd === 0 && i !== 0 ){
				li[i].addClass("odd");
			} else if ( i == opts.bg[0]-1 || i == opts.bg[1]-1 ) {
				li[i].addClass("bg");
			}
		}

	}
	
})( jQuery );
