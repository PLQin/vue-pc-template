;( function( $ ) {

var el = null,
    template = {
        box: '<div class="lightbox"><div class="lightbox-shadow"></div><div class="lightbox-inner"><div class="lightbox-content"></div></div></div>',
        button: '<button class="lightbox-button">#{text}</button>',
        link: '<a class="lightbox-link" href="#">#{text}</a>',
        text: '<span class="lightbox-text">#{text}</span>'
    };
    
$.widget( "ccw.lightbox", {
    
    options: {
        width: "auto",
        height: "auto",
        autoShow: true,
        buttons: []
    },
    
    _init: function() {
        var opts = this.options;
        this.box = $( template.box )
            .width( opts.width )
            .height( opts.height )
            .appendTo( "body" )
            .hide();
        this.box.find( ".lightbox-content" )
            .append( this.element.show());
        
        if ( opts.title ) {
            $( "<h3/>", {
                text: opts.title
            }).prependTo( this.box.find( ".lightbox-content" ));
        }
        
        if ( opts.buttons && opts.buttons.length ) {
            var buttonBar = $( '<div class="lightbox-buttons clearfix"></div>' );
            $.each( opts.buttons, function( i, b ) {
                if ( b.type == "text" ) {
                    $( template.text.replace( /#\{text\}/g, b.text ))
                        .addClass( b.align )
                        .appendTo( buttonBar );
                } else {
                    b.type = b.type || "button";
                    $( template[b.type].replace( /#\{text\}/g, b.text ))
                        .addClass( b.align )
                        .appendTo( buttonBar )
                        .click( function( e ) {
                            e.preventDefault();
                            if ( $.isFunction( b.handler )) {
                                b.handler.call( this, e );
                            }
                        });
                }
            });
            
            this.box.find( ".lightbox-inner" )
                .append( buttonBar );
        }
        
        if ( opts.autoShow ) {
            this.show();
        }
    },
    
    show: function() {
        var opts = this.options,
            boxW = this.box.width(),
            boxH = this.box.height(),
            ie6 = $.browser.msie && $.browser.version == "6.0";
        
        this.box.show()
            .css({
                position: ie6 ? "absolute" : "fixed",
                top: ( $( window ).height() - boxH ) / 2 + ( ie6 ? $( window ).scrollTop() : 0 ),
                left: ( $( window ).width() - boxW ) / 2 + ( ie6 ? $( window ).scrollLeft() : 0 )
            })
            .find( ".lightbox-shadow" )
            .width( boxW + 30 )
            .height( boxH + 30 );
            
    },
    
    hide: function() {
        this.box.hide();
    }

});

$.lightbox = function( opts ) {
    if ( typeof opts == "object" ) {
        if ( el ) {
            el.parents( ".lightbox" ).remove();
        }
        
        el = $( opts.content );
        if ( !el.length ) {
            el = $( "<p/>" ).html( opts.content );
        }
        el.lightbox( opts );
    } else if ( typeof opts == "string" && opts == "show" ) {
        el && el.lightbox( "show" );
    } else if ( typeof opts == "string" && opts == "hide" ) {
        el && el.lightbox( "hide" );
    }
}

$.message = function( opts ) {
    $.lightbox({
        width: opts.width || 300,
        content: opts.content,
        buttons: [{
            text: "我知道了",
            handler: function() {
                $.lightbox( "hide" );
            }
        }]
    });
    
    $( ".lightbox .lightbox-button" ).focus();
};


$.confirm = function( opts ) {
    $.lightbox({
        width: opts.width || 300,
        content: opts.content,
        buttons: [{
            text: "确定",
            handler: function() {
                $.lightbox( "hide" );
                if ( opts.callback ) {
                    opts.callback.call( this, true );
                }
            }
        },{
            text: "取消",
            type: "link",
            handler: function() {
                $.lightbox( "hide" );
                if ( opts.callback ) {
                    opts.callback.call( this, false );
                }
            }
        }]
    });
    
    $( ".lightbox .lightbox-link" ).focus();
}

}( jQuery ));