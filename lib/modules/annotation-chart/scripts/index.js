( function( $ ) {

$( function() {
    
    var annotations = [];
    
    window.annotationChart = {
        isAllowedToChange: function() {
            return true;
        },
        addNewAnnotation: function( data ) {
            $( "#chart" )[0].selectDate(null);
    		$( "#chart-box .editArea" ).show();
        },
        setSelectedDate: function (date) {
    		var datetime = date.toString();
    		datetime = datetime.slice(0, 4) + "-" + datetime.slice(4,6) + "-" + datetime.slice(6);
    		var dateEl = $( "#chart-box .editArea .hd span" ).text( datetime );
            var list = $( "#chart-box .annotationList" ).empty();
            
    		$.each( annotations, function(i, val) {
    			if (val.date == date) {
    				list.show();
    				var li = $( "<li/>" ).appendTo( list ); 
    				var hd = $( "<h4/>" ).addClass("hd").appendTo( li );
    				var creator = $( "<em/>" ).text( val.creator ).appendTo( hd );
    				var dateInput = $( "<span/>" ).text( datetime ).appendTo( hd );
    				$( "<p/>" ).text( val.text ).appendTo( li );
    			}
    		});
    	}
    };
    
    $.ajax({
		url: "chart.json", 
		data: {},
		dataType: "text",
		success: function( data ) {
			data = data.replace(/^\s*/mg, '').replace(/\r/g, '');

			var flashvars = {
				"input"                 : encodeURIComponent(data),
				"annotationsEnabled"    : "true",
				"handCursorEnabled"     : "true",
				"msgAnnotationSingular" : "1 条注释",
				"msgAnnotationsPlural"  : encodeURIComponent("%s 条注释"),
				"msgCreateAnnotation"   : "创建新注释"
			};
			var params = {
				menu: "false",
				wmode: "transparent"
			};

			swfobject.embedSWF( "../../swfs/chart.swf", "chart", 800, 200, "9.0.0", false, flashvars, params );
		    
			function establishCommunication() {
				var	flash = $( "#chart" )[0];
				if (flash.establishCommunication) {
					var b = {
						'addAnnotations': 1,
						'closeEditedAnnotation': 0,
						'getSelectedDate': 0,
						'getSetUpErrors': 0,
						'openForEdit': 1,
						'removeAnnotations': 1,
						'selectDate': 1,
						'setJson': 1,
						'showAlertHighlight': 1
					};
					var d = {
						'addNewAnnotation': 1,
						'cancelDateSelection':0,
						'isAllowedToChange': 0,
						'openDrawer': 0,
						'openDrawer_': 0,
						'setSelectedDate': 1,
						'waitForFlash': 1
					};
					
					flash.establishCommunication(b, 'annotationChart', d, true);

				} else {
					setTimeout(establishCommunication, 100);
				}
			}

			establishCommunication();
		}
	});
	
	var count = 0;
	$( "#chart-box .editArea .btn" ).click( function( e ) {
	    count++;
	    var editArea = $( this ).parents( ".editArea:first" );
	    var date = editArea.find( ".hd span" ).text().replace(/-/g, "");
		var annotation = {
			"id" : count.toString(),
			"creator": editArea.find( ".hd em" ).text(),
			"date": date,
			"text": editArea.find( "textarea" ).val()
		};
		annotations.push(annotation);
		
		var chart = $( "#chart" )[0];
		chart.addAnnotations($.toJSON(annotation));
		chart.selectDate( date );
		editArea.hide()
		    .find( "textarea" )
		    .val( "" );
	});
	
	$( "#chart-box .editArea .close-btn" ).click( function( e ) {
	    e.preventDefault();
	    $( this ).parents( ".editArea:first" )
	        .hide()
		    .find( "textarea" )
		    .val( "" );
	})

});

})( jQuery );
