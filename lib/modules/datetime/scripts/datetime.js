
( function( $ ) {
    
$( function() {
    
    $( "#txt-datetime1" ).datetime({
        time: false
    });
    
    $( "#txt-datetime2" ).datetime();
    
    $( "#txt-datetime3" ).datetime({
        seconds: true,
        timeFormat: "hh:mm:ss"
    });
    
});

})( jQuery );
