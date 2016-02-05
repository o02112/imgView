;(function(){
	
	
	var defaults = {
		
	};
	
	
	$.fn.imgView = function(options){
		
		if(this.length == 0) return this;

		if(this.length > 1){
			this.each(function(){$(this).imgView(options)});
			return this;
		}
		
		var iv = {},
		
		el = this,
		
		imgView = $('<div id="imgView"><div id="viewBox"><img src="" /></div><div id="iv-close">X</div></div>'),
		viewBox = imgView.children('#viewBox'),
		img = viewBox.children('img'),
		closeBtn = imgView.children('#iv-close');
		
		// 把用户的选项与默认值合并，得到最终选项值
		iv.settings = $.extend({}, defaults, options);
		
		el.showImg = function(targetEle){
			showImg($(targetEle).src);
		}
		
		var init = function(){
			
			imgView.css({
				display: 'none'
			})
			viewBox.css({
				position: 'fixed',
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
				'background-color': '#191919',
				'text-align': 'center'
			});
			
			closeBtn.css({
				position: 'fixed',
				right: '1vw',
				top: '1vw',
				width:'2em',
				'text-align': 'center',
				display: 'inline-block',
				background: 'rgba(170, 170, 170, .4)',
				color:'white',
				//'border-radius': '5px',
				font: '1em/2em "Microsoft YaHei"',
				zindex: 2
			}).click(function(){
				imgView.fadeOut();
			});
			el.find('img').click(function(){
				showImg($(this).attr('src'));
			});
			
			imgView.appendTo('body');
  		}
		
		var showImg = function(src){
			
			iv.tranX = 0;
			iv.tranY = 0;
			iv.distX = 0;
			iv.distY = 0;
			
			iv.scale = 1;
			
			iv.startScaleDistX = 0;
			iv.startScaleDistY = 0;
			
			img.attr('src', src).css({width: 'auto',height: 'auto', transform: ''});
			
			imgView.fadeIn();
			viewBox.off();
			
			if(img.width() > $(window).width()){
				img.css('width', '100%');
			}
			
			var imgTop = $(window).height()/2 - img.height()/2;
			
			img.css({
				'margin-top': imgTop,
				'margin-left': 0,
				'transition': 'transform .1s ease-out'
			});
			
			var width = Math.min($(window).width(), img.width());
		    var height = Math.min($(window).height(), img.height());
		    var left = 0;
		    var top = imgTop;
		    
			viewBox[0].addEventListener('touchstart', function(e){
				var figures = e.targetTouches.length;
				if(figures === 1){
					el.startDrag(e);
				}else if(figures === 2){
					el.startScale(e);
				}
				
				e.preventDefault();
			});
			
			viewBox[0].addEventListener('touchmove', function(e){
				var figures = e.targetTouches.length;
				if(figures === 1){
					el.startDrag(e);
				}else if(figures === 2){
					el.startScale(e);
				}
				
				// 只有一段设置transform的代码
				img.css({
					transform: 
					'translateX('+iv.distX+'px) translateY('+iv.distY+'px) '
					+'scale('+iv.scale+')'
				});
				
				e.preventDefault();
			});
			
			viewBox[0].addEventListener('touchend', function(e){
				
				var figures = e.targetTouches.length;
				if(figures === 0){
					el.startDrag(e);
				}else if(figures === 1){
					el.startScale(e);
				}
				e.preventDefault();
			});
		}

		el.startScale = function(e){
			
			var f1X = e.targetTouches[0].pageX;
			var f1Y = e.targetTouches[0].pageY;
			
			var f2X = e.targetTouches[1].pageX;
			var f2Y = e.targetTouches[1].pageY;
			
			if(e.type == 'touchstart'){
				
				if(iv.boxClose) iv.boxClose = false; // 有两手指时不再关闭
				
				iv.f1StartX = f1X;
				iv.f1StartY = f1Y;
				iv.f2StartX = f2X;
				iv.f2StartY = f2Y;
				
				// 判定是缩小还是放大（根据手指初始位置与当前位置的相对关系）
				// 开始距离
				iv.startScaleDistX =  Math.abs(iv.f2StartX - iv.f1StartX);
				iv.startScaleDistY = Math.abs(iv.f2StartY - iv.f1StartY);
				
				
			}else if(e.type == 'touchmove'){
				
				// 移动过后的距离
				var cDistX = Math.abs(f2X - f1X);
				var cDistY = Math.abs(f2Y - f1Y);

				// 图片放大，两指距离增大
				if((iv.startScaleDistX < cDistX) || (iv.startScaleDistY < cDistY)){
					el.zoomOut();
				}
				
				// 图片缩小，两指距离减小
				if((iv.startScaleDistX > cDistX) || (iv.startScaleDistY > cDistY)){
					el.zoomIn();
				}

				iv.startScaleDistX = cDistX;
				iv.startScaleDistY = cDistY;

			}else if(e.type == 'touchend'){
			
			}
			//$('#info').text(cDistX +','+cDistY+'-->'+iv.startScaleDistX +','+iv.startScaleDistY);
		}

		el.zoomOut = function(zoomLevel){
			zoomLevel = parseInt(zoomLevel);
			iv.scale += zoomLevel?zoomLevel:.05;
		}
		el.zoomIn = function(zoomLevel){
			zoomLevel = parseInt(zoomLevel);
			iv.scale -= zoomLevel?zoomLevel:.05;
			if(iv.scale < 0.5) { iv.scale = 0.5; }
		}
		
		// 开始拖拽元素
		el.startDrag = function(e){
			if(e.type == 'touchstart'){
				
				// 点击viewBox关闭，即开始-->结束，中间没有移动（touchmove）动作
				iv.boxClose = true;
				
				iv.cX = iv.sX = e.targetTouches[0].pageX;
				iv.cY = iv.sY = e.targetTouches[0].pageY;
			}else if(e.type == 'touchmove'){
				
				// 单手指有移动动作时，不关闭
				if(iv.boxClose) iv.boxClose = false;
				
				iv.cX = e.targetTouches[0].pageX;
				iv.cY = e.targetTouches[0].pageY;
			}else if(e.type == 'touchend'){
				iv.tranX = iv.distX;
				iv.tranY = iv.distY;
				
				if(iv.boxClose) { imgView.fadeOut(); }
				
				viewBox.off();
				return;
			}
			iv.distX = iv.cX - iv.sX + iv.tranX;
			iv.distY = iv.cY - iv.sY + iv.tranY;
		}
		
		init();
	}
})(jQuery);


