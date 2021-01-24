/*
 * toTop 1.0
 * Copyright (c) 2015 Veznlee 
 * Date: 2015-09-25
 *返回顶部插件，滚动高度大于100时才显示置顶按钮。
 */
(function ($, window, document,undefined){
	$.fn.toTop = function(id){
		var topbtn = $(id); 
		var lastScroll = 0; 
		topbtn.css("display", "none"); 
		window.onscroll = function(){
			var top = $(window).scrollTop(); 
			if(top > 100){ 
				topbtn.css("display", ""); 
			} 
			if(top <= 100){
				topbtn.css("display", "none"); 
			} 
		}; 
		topbtn.click(function(){ 
			var scrollTop = 0; 
			var curPos = $(window).scrollTop(); 
			//topbtn.addClass("movingtotop"); 
			var step = Math.abs(scrollTop - curPos) / 200 ; 
			var tid = setInterval(function() { 
				//topbtn.toggleClass("movingtotop"); 
				if (curPos > scrollTop + 14) { 
					curPos -= step; 
					step = step * 1.05;
					window.scrollTo(0, curPos); 
				} else if (curPos <= scrollTop + 14){ 
					window.scrollTo(0, scrollTop); 
					//topbtn.removeClass("movingtotop"); 
					clearInterval(tid);
				} 
			}, 0.01); 
		}); 
	};
})(jQuery, window, document);
/*
$().toTop("#totop");
*/