//调用方法   $.modal(command, options);
//command 的是为了给弹出层添加一个 class, 用 css 来控制该弹出层的样式。
//遮罩使用的是 jQuery UI 的样式，class 是 ui-widget-overlay 

(function($){
  
	//变量 oDiv 用来实现弹出层，oDiv1 用来实现遮罩。
    var oDiv = null;
    var oDiv1 = null;
  
    $.modal = function( command, options ) {
		//设置默认选项,autoHide:弹出层自动消失时间，msg:弹出层文本，
        var opts = $.extend({
          autoHide: false,
          msg: "Hello Wrold!"
        },options );
        
		//判断弹出层的 html 是否存在
        if( !oDiv ){
          createDiv( opts );
        }
        
		//相对浏览器给弹出层定位
        $( ".modal-box" ).css({
            position: "absolute",
            top: "50%",
            left: "50%"
        }).show().css({
            marginTop: 0 - oDiv.height() / 2, 
            marginLeft: 0 - oDiv.width() / 2
		});
        
		//弹出层的文本信息
        $( ".modal-text" ).text( opts.msg );
        
		//弹出层
        $( ".modal-box" ).removeClass( "modal-loading modal-success modal-error" )
            .addClass( command );
        
		//显示遮罩
        $( ".modal-overlay" ).show();
        
		//自动关闭
        if ( opts.autoHide ) {
            setTimeout( function() {
                oDiv.hide();
                $( ".modal-overlay" ).hide();
            }, opts.autoHide );
        }
      
		//点击按钮关闭
        $( ".modal-close" ).mousedown( function( e ) {
            oDiv.hide();
            $( ".modal-overlay" ).hide();
        });
        
    };
  
	//生成弹出层和遮罩 html
    function createDiv( opts ){
		//生成弹出层 html
        oDiv = $( "<div/>", {
            "class": "modal-box"
        }).appendTo( "body" );
    	
		//生成遮罩 html
        oDiv1 = $( "<div/>", {
            "class":"modal-overlay ui-widget-overlay",
            css: {
                height: $( document ).height(),
                width: $( document ).width()
            }
        }).appendTo( "body" ).hide();
    	
		//生成弹出层文本 html
        var p = $( "<p/>", {
            "class":"modal-text"
        }).text( opts.msg ).appendTo( oDiv );
		
		//生成关闭按钮 html
        var a = $( "<a/>", {
            "class":"modal-close",
            href: "#"
        }).text( "x" ).appendTo( oDiv );
    }
})(jQuery);
