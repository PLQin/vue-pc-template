(function($){
	
	var daytable = null;
	var trigger = null;
	
	$.fn.daypicker = function( options ) {
		
		//配置默认参数，selected:默认选择日期，rang:日期范围，cols:生成 table 列数，today:当天日期。
		var opts = $.extend({
			selected: false,
			range: [1,31],
			cols: 11,
			today: false
		}, options );
		
		//绑定匿名函数
		this.each( function() {
			var container = $( this ).addClass( "daypicker-trigger" );
			container.mousedown( function( e ) {
				trigger = $( e.currentTarget );
				if ( !daytable ) {
					generateTable( opts );
				}
				
				daytable.css({
					position: "absolute",
					top: trigger.offset().top + trigger.height(),
					left: "50%",
					marginLeft: 0 - daytable.width() / 2,
					display: "block"
				});
				
				var selected = trigger.data( "dayselected" ) || opts.selected;
				daytable.find( "td" )
            .removeClass( "date-has-event" )
            .filter( "td[day=" + selected + "]" )
            .addClass( "date-has-event" )

			});
			$( document ).mousedown( function( e ) {
				var target = $( e.target );
				if ( !target.parents( ".daytable, .daypicker-trigger" ).length
					&& !target.is( ".daytable, .daypicker-trigger" )) {
					  if(daytable){
					     daytable.hide(); 
					  }
				}
			});
		});
		
		return this;
	};
	
	function generateTable( opts ) {
		daytable = $( "<table/>", {
			"class": "daytable",
			cellspacing: "0"
		}).hide().appendTo( "body" );
		
		var tbody = $( "<tbody/>" )
			.appendTo( daytable );
		
		var tr = null;
		for ( var i = opts.range[0]; i <= opts.range[1]; i++ ) {
			if (( i - opts.range[0]) % opts.cols == 0 ) {
				tr = $( "<tr/>" ).appendTo( tbody );
			}
			
			var td = $( "<td/>", {
				text: i,
				day: i
			}).mousedown( function( e ) {
				var day = $( this ).attr( "day" );
				if ( day >= opts.today&&opts.today ) {
					return;
			  }
			  trigger.data( "dayselected", day )
			  .trigger( "dayselect", day );
		  	daytable.hide();
			}).appendTo( tr );
			
			if ( opts.today ) {
				if( i == opts.today ) {
					td.addClass( "today" );
				} else if ( i > opts.today ) {
					td.addClass( "noclick" );
				}
			}
		}
	}
	
})(jQuery);

