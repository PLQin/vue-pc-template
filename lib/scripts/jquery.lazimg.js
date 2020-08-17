;( function( $ ) {

$.widget( "ccw.lazimg", {
    
    options: {
        attr: "lazy",
        beforeLazyLoad: false,
        lazyLoad: false
    },
    
    _init: function() {
        var opts = this.options;
        
        this._initEvents();
        
        this.element.scroll( $.proxy( this.check, this ));
        $( window ).resize( $.proxy( this.check, this ));
        this.check();
    },
    
    _initEvents: function() {
        var opts = this.options;
        
        if ( opts.beforeLazyLoad ) {
            this.element.bind( "beforelazyload.lazimg", opts.beforeLazyLoad );
        }
        
        if ( opts.lazyLoad ) {
            this.element.bind( "lazyload.lazimg", opts.lazyLoad );
        }
    },
    
    check: function() {
        var opts = this.options,
            imgs = this.element.find( "img[" + opts.attr + "]" )
            offset = null,
            innerHeight = 0,
            innerWidth = 0;
        
        if ( this.element[0] == document ) {
            var win = $( window );
            offset = { top: win.scrollTop(), left: win.scrollLeft() };
            innerHeight = win.height();
            innerWidth = win.width();
        } else {
            offset = this.element.offset();
            innerHeight = this.element.innerHeight();
            innerWidth = this.element.innerWidth();
        }
        
        $.each( imgs, $.proxy( function( i, img ) {
            var image = $( img ),
                imgH = image.height(),
                imgW = image.width(),
                imgOffset = image.offset();
            if ( imgOffset.top + imgH > offset.top 
                && imgOffset.top < offset.top + innerHeight
                && imgOffset.left + imgW > offset.left
                && imgOffset.left < offset.left + innerWidth ) {
                    this.element.trigger( "beforelazyload.lazimg", [image]);
                    image.addClass( "lazimg-loading" )
                        .one( "load", $.proxy( function( e ) {
                            this.element.trigger( "lazyload.lazimg", [image]);
                            $( e.currentTarget ).removeClass( "lazimg-loading" );
                        }, this ))
                        .attr({
                            src: image.attr( "lazy" )
                        })
                        .removeAttr( "lazy" );
            }
        }, this ));
    }
});

}( jQuery ));