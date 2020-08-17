( function( $ ) {

$( function() {
    $( "#drag-me" ).draggable({
        containment: "window",
        drag: function() {
            $( this ).popbox( "refresh" );
        }
    }).popbox({
        width: 300,
        height: 200,
        content: "<p>我可以是HTML字符串或者jQuery Object或者HTML Element<br/><br/>我还可以自动改变位置噢！</p>"
    });
    
});

})( jQuery );