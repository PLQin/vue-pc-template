( function( $ ) {

$( function() {
    $( "#btn-lightbox1" ).click( function( e ) {
        $.lightbox({
            width: 300,
            content: '<p>我是HTML字符串，1秒之后自动关闭</p>'
        });
        
        setTimeout( function() {
            $.lightbox( "hide" );
        }, 1000 );
    });
    
    $( "#btn-lightbox2" ).click( function( e ) {
        $.lightbox({
            width: 300,
            content: $( "#dialog" )
        });
        
        setTimeout( function() {
            $.lightbox( "hide" );
        }, 1000 );
    });
    
    $( "#btn-lightbox3" ).click( function( e ) {
        $.lightbox({
            width: 300,
            content: '<p>我支持3种button类型：link、button和text</p>',
            buttons: [{
                type: "button",
                text: "按钮",
                handler: function() {
                    $.lightbox( "hide" );
                }
            }, {
                type: "text",
                text: "文本"
            }, {
                type: "link",
                text: "链接",
                handler: function() {
                    $.lightbox( "hide" );
                }
            }]
        });
    });
    
    $( "#btn-lightbox4" ).click( function( e ) {
        $.message({
            content: "<p>我是一个简单的message</p>"
        });
    });
    
    $( "#btn-lightbox5" ).click( function( e ) {
        $.confirm({
            content: "<p>你确定要这么做吗？</p>",
            callback: function( yes ) {
                $.lightbox( "hide" );
            }
        });
    });
});

})( jQuery );