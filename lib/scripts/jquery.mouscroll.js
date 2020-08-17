;( function( $ ) {
    
$.widget( "ccw.mouscroll", {
    
    options: {
        handle: false,
        cancel: false,
        cursor: "auto",
        x: true,
        y: true
    },
    
    _init: function() {
        var opts = this.options,
            handle = opts.handle ? this.element.find( opts.handle ) : this.element;
        
        
        handle.mousedown( $.proxy( function( e ) {
            if ( opts.cancel && 
                ( $( e.target ).is( opts.cancel ) || 
                $( e.target ).parents( opts.cancel ).length )) {
                return;
            }
            e.preventDefault();
            var axis = {
                x: opts.x,
                y: opts.y
            }
            
            if ( this.element[0] === window ) {
                var innerHeight = $( window ).height();
                    scrollHeight = $( document ).height();
                    innerWidth = $( window ).width();
                    scrollWidth = $( document ).width();
            } else {
                var innerHeight = this.element.innerHeight(),
                    scrollHeight = this.element[0].scrollHeight,
                    innerWidth = this.element.innerWidth(),
                    scrollWidth = this.element[0].scrollWidth;
            }
            
            if ( innerHeight >= scrollHeight ) {
                axis.y = false;
            }
            
            if ( innerWidth >= scrollWidth ) {
                axis.x = false;
            }
            
            if ( opts.cursor ) {
                $( document.body ).css({
                    cursor: opts.cursor
                });
            }
            
            var initScroll = {
                top: this.element.scrollTop(),
                left: this.element.scrollLeft()
            },
            initOffset = {
                x: e.clientX,
                y: e.clientY
            };
            
            $( document ).bind( "mousemove.mouscroll", $.proxy( function( e ) {
                e.preventDefault();
                var left = ( initOffset.x - e.clientX ) * 1.2 + initScroll.left,
                    top = ( initOffset.y - e.clientY ) * 1.2 + initScroll.top;
                
                if ( axis.x ) {
                    this.element.scrollLeft( left );
                }
                if ( axis.y ) {
                    this.element.scrollTop( top );
                }
            }, this )).one( "mouseup", $.proxy( function( e ) {
                $( document ).unbind( "mousemove.mouscroll" );
                if ( opts.cursor ) {
                    $( document.body ).css({
                        cursor: "auto"
                    });
                }
            }, this ));
        }, this ));
    }
    
});

}( jQuery ));