
( function( $ ) {	
	$( function() {
        $( "#loading" ).click( function( e ){
            $.modal( "modal-loading", {
                autoHide: 5000,
                msg: "提交中，请稍后..."                
            });
        });
        $( "#success" ).click( function( e ){
            $.modal( "modal-success", {
                autoHide: 1000,
                msg: "提交成功"                
            });
        });
        $( "#error" ).click( function( e ){
            $.modal( "modal-error", {
                autoHide:50000,
                msg: "提交失败"                
            });
        });
			
    });	
})( jQuery );
