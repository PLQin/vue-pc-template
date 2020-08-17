
( function( $ ) {
    
    $( function() {
        
        $( "#btn-show" ).click( function( e ) {
            $( "#txt-password" ).tips({
                content: "密码只能包含数字和英文字母",
                position: "top",
                color: "red"
            });
        });
        
        $( "#btn-show2" ).click( function( e ) {
            $( "#txt-username" ).tips({
                content: "用户名是必填项",
                position: "bottom",
                color: "green"
            });
        });
        
    });
    
}( jQuery ));