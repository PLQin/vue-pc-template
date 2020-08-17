( function( $ ) {

$( function() {
    $.ajax({
        url: "home.html",
        success: function( result ) {
            $( "#home-content" ).html( result );
        }
    });
    
    $.ajax({
        url: "nav.html",
        success: function( result ) {
            var nav = $( "<div/>" ).html( result );
            nav.find( "a" ).each( function() {
                var name = this.hash.substring( 1 ),
                    desc = $( this ).find( ".module-desc" ).text(),
                    path = "modules/" + name +"/";
                    wrapper = $( ".wrapper" );
                
                $( "<div/>", {
                    "class": "main-title"
                }).html( "<h2>" + name + "</h2>" )
                    .appendTo( wrapper );
                
                $( "<p/>", {
                    "class": "desc"
                }).html( desc )
                    .appendTo( wrapper );
                
                $( "<div/>", {
                    "class": "demo"
                }).html( '<iframe frameborder="0" src="' + path + '" allowtransparency="true"></iframe>' )
                    .appendTo( wrapper );
                
                var doc = $( "<div/>", {
                    "class": "entry"
                }).appendTo( wrapper );
                $.ajax({
                    url: path + "doc.html",
                    success: function( result ) {
                        doc.html( result );
                    }
                });
            });
        }
    });
});

})( jQuery );