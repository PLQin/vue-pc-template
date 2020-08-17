(function ( $ ) {

	var counter = [], sub = 0;
	$.fn.compass = function( options ){
	
		var opts = $.extend({
			sector:[0, 360],			// 表盘象限分布
			range: [0, 360],		
			r:100,						//圆半径，指针尖端距离坐标原点的绝对距离  r<x r<y
			x:150,						//坐标原点
			y:150,						//坐标原点
			pointerA:[22,0,"#09f",true],  	//指针偏转值(null表示指针不存在)，指针末端距离坐标原点的百分比,指针颜色
			pointerB:[0,0,"rgba(255,0,0,0.7)",false],
			imgA:["id",0,0],			//指针图片id,修正图片坐标x,y
			imgB:["id",0,0],
			anticlockwise:true,   		//true 逆时针，false 顺时针
			start:true,			  		//true 起点在右边，false 起点在左边，象限分布正好相反
			speed:[2,1],	          	//指针速度
			interval:10					//时间间隔
		}, options );

		opts.range[1] = opts.range[1] * 10;
		opts.pointerA[0] = opts.pointerA[0] * 10;
		opts.pointerB[0] = opts.pointerB[0] * 10;


		if( opts.range[1] < opts.pointerA[0] || opts.pointerA[0] < opts.range [0] || opts.range[1] < opts.pointerB[0] || opts.pointerB[0] < opts.range [0] ) {
			alert("指针值溢出，请修改指针值或者范围！");
			return;
		}

		this.each( function(){

			var canvas = $( this );
			counter[sub] = [];
			_init( opts, canvas, sub );
			sub++;

		});
		
		
	};

	function _init ( opts, canvas, sub ) {

		var ave = ( opts.range[1] - opts.range[0] ) / 720 ;
		if ( !canvas[0].getContext ) return;
		var ctx = canvas[0].getContext("2d");

		var intervalId = setInterval( function(){
			
			if( ave > opts.pointerA[0] && ave > opts.pointerB[0] ){
				clearInterval( intervalId );
			}

			draw( opts, ave, ctx, canvas, sub );
			ave++;

		}, opts.interval );

	}

	function draw( opts, value, ctx, canvas, sub ) {
		ctx.save();
		ctx.clearRect( 0, 0,  canvas.width(), canvas.height() );

		ctx.lineCap = "round";
		ctx.lineWidth = 6;
		ctx.shadowOffsetX = 2;  
		ctx.shadowOffsetY = 2;  
		ctx.shadowBlur = 2;  
		ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
		ctx.translate( opts.x,opts.y ); //移动坐标原点
		
		//指针一
		ctx.save();
		if ( value * opts.speed[0]  <= opts.pointerA[0] ){
			counter[sub][0] = value * opts.speed[0];
		} else if ( opts.pointerA[0] == 0 ){
			counter[sub][0] = 0;
		}
		var result = rad ( opts, counter[sub][0] );
		if ( opts.imgA[0] == "id" ){
			ctx.rotate( result.rad );
			ctx.strokeStyle = opts.pointerA[2];
			ctx.beginPath();
			ctx.moveTo( result.dx * opts.pointerA[1], result.dy * opts.pointerA[1] );
			ctx.lineTo( result.dx, result.dy );
			ctx.stroke();
		} else {
			ctx.rotate( result.rad - Math.PI );
			ctx.drawImage( $( opts.imgA[0] )[0], - result.dx + opts.imgA[1] , - result.dy + opts.imgA[2] );
		}
		ctx.restore();

		//指针二
		if( opts.pointerB[3] ){

			ctx.save();
			if ( value * opts.speed[1] <= opts.pointerB[0] ){
				counter[sub][1] = value * opts.speed[1];
			} else if( opts.pointerB[0] == 0 ){
				counter[sub][1] = 0;
			}
			result = rad ( opts, counter[sub][1] );
			if( opts.imgB[0] == "id" ){
				ctx.rotate( result.rad );
				ctx.strokeStyle = opts.pointerB[2];
				ctx.beginPath();
				ctx.moveTo(  result.dx * opts.pointerB[1], result.dy * opts.pointerB[1] );
				ctx.lineTo( result.dx, result.dy );
				ctx.stroke();
			} else {
				ctx.rotate( result.rad - Math.PI );
				ctx.drawImage( $( opts.imgB[0] )[0], - result.dx + opts.imgB[1] , - result.dy + opts.imgB[2] );
			}
			ctx.restore();

		}


		ctx.restore();

		//ctx.translate( -opts.x, -opts.y );

	}

	function rad( opts, value ) {

		var r1 = opts.range[0],
			r2 = opts.range[1],
			s1 = opts.sector[0],
			s2 = opts.sector[1],
			degree, rad,
			dx,dy;

		degree = ( s2-s1 ) / ( r2-r1 ) * ( value - r1);
		
		if( opts.start ){
			dx = Math.cos ( Math.PI / 180 * s1 ) * opts.r;
			dy = - Math.sin ( Math.PI / 180 * s1 ) * opts.r;
		} else {
			dx = Math.cos ( Math.PI / 180 * s1 ) * opts.r;
			dy = Math.sin ( Math.PI / 180 * s1 ) * opts.r;
		}

		if ( opts.anticlockwise && opts.start ) {	//逆时针右边起点,rotate是顺时针，用 - 取反
			rad = - Math.PI / 180 * degree;
		} else if ( opts.anticlockwise && !opts.start ) { 	//逆时针左边起点
			rad = - Math.PI / 180 * ( 180 + degree );
		} else if ( !opts.anticlockwise && !opts.start ) {	//顺时针左边起点
			rad = - Math.PI / 180 * ( 180 - degree );
		} else if ( !opts.anticlockwise && opts.start ) {	//顺时针右边起点
			rad = - Math.PI / 180 * ( 360 - degree );
		}

		//posX = Math.cos( rad ) * opts.r;
		//posY = - Math.sin( rad ) * opts.r;
		//posX = opts.x + Math.cos( rad ) * opts.r;
		//posY = opts.y - Math.sin( rad ) * opts.r;

		return { dx: dx, dy: dy, rad: rad };
	
	}
})( jQuery );
