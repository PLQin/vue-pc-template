( function( $ ) {
	$( function() {
		$( ".digit" ).digitroll ({
			baseValue:9000,		//初始化参数
			step:45,			//递增量
			range:12,			//初始化位数
			bg:[5,9],			//指定位置高亮背景图片，从右向左
			odd:3,				//指定位置添加边距，从右向左
			interval:3000		//时间间隔
		});
	});
})( jQuery );
