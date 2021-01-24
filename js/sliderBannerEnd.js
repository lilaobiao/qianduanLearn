/*
 * sliderBanner 1.0
 * Copyright (c) 2015 Veznlee 
 * Date: 2015-12-17
 * 简单的图片轮播，可控制自动播放与否及时间，左右点击功能可控，小图控制功能可控，可实现多屏。
 */
;(function($){
	$.fn.sliderBanner = function(cjson){
		var defaults = {		
			autoPlay:true,		//默认自动播放
			autoTime:3000,		//间隔时间3000
			moveTime:600		//播放时间600
		};
		var opts = $.extend({},defaults, cjson),
			$this = $(this),
			g_next = $this.find(opts.next),					//下一张
			g_prev = $this.find(opts.prev),					//上一张
			g_showBox = $this.find(opts.showBox),			//轮播区
			g_control = $this.find(opts.control),			//控制小图
			g_conliClass = opts.conliClass,					//控制小图选中样式
			animateEnd = 1,
			timer = null;

		function addIndex(){
			var showli = g_showBox.find("li");
			for (var i=0; i<showli.length; i+=1){
				showli.eq(i).attr("index",i);
			};
		};
		addIndex();

		function nextscroll() {
			var offset = (g_showBox.find("li").width()) * -1;
			g_showBox.stop().animate({
				left: offset
			}, opts.moveTime, function() {
				var firstItem = g_showBox.find("li").first();
				g_showBox.append(firstItem);
				$(this).css("left", "0px");
				if (g_control){
					circle();
				};
			});
		};

		function circle() {
			var currentItem = g_showBox.find("li").first();
			var currentIndex = currentItem.attr("index");
			g_control.find("li").removeClass(g_conliClass);
			g_control.find("li").eq(currentIndex).addClass(g_conliClass);
		};

		function auto(){
			timer = setInterval(function(){
				nextscroll();
			},opts.autoTime);
		};
		
		if(g_prev){
			g_prev.click(function() {
				if (timer){
					clearInterval(timer);
				};
				g_showBox.stop(true,true);
				var offset = (g_showBox.find("li").width() * -1);
				var lastItem = g_showBox.find("li").last();
				g_showBox.prepend(lastItem);
				g_showBox.css("left", offset);
				g_showBox.animate({
					left: "0px"
				}, opts.moveTime, function() {
					if (g_control){
						circle();
					};
				});
			}).mouseout(function(){
				if (opts.autoPlay){
					auto();
				};
			});
		};

		if(g_next){
			g_next.click(function() {
				if (timer){
					clearInterval(timer);
				};
				g_showBox.stop(true,true);
				nextscroll()
			}).mouseover(function(){
				if (timer){
					clearInterval(timer);
				};
			}).mouseout(function(){
				if (opts.autoPlay){
					auto();
				};
			});
		};

		if(g_control){
			g_control.find("li").mouseover(function() {
				clearInterval(timer);
				g_showBox.stop(true,true);
				if (animateEnd == 0) {
					return
				}
				$(this).addClass(g_conliClass).siblings().removeClass(g_conliClass);
				var nextindex = $(this).index();
				var currentindex = g_showBox.find("li").first().attr("index");
				var curr = g_showBox.find("li").first().clone();
				if (nextindex > currentindex) {
					for (var i = 0; i < nextindex - currentindex; i++) {
						var firstItem = g_showBox.find("li").first();
						g_showBox.append(firstItem)
					}
					g_showBox.prepend(curr);
					var offset = (g_showBox.find("li").width()) * -1;
					if (animateEnd == 1) {
						animateEnd = 0;
						g_showBox.stop().animate({
							left: offset
						}, opts.moveTime, function() {
							g_showBox.find("li").first().remove();
							g_showBox.css("left", "0px");
							animateEnd = 1
						})
					}
				} else {
					var curt = g_showBox.find("li").last().clone();
					for (var i = 0; i < currentindex - nextindex; i++) {
						var lastItem = g_showBox.find("li").last();
						g_showBox.prepend(lastItem)
					}
					g_showBox.append(curt);
					var offset = (g_showBox.find("li").width()) * -1;
					g_showBox.css("left", offset);
					if (animateEnd == 1) {
						animateEnd = 0;
						g_showBox.stop().animate({
							left: "0px"
						}, opts.moveTime, function() {
							g_showBox.find("li").last().remove();
							animateEnd = 1
						})
					}
				}
			}).mouseout(function(){
				if (opts.autoPlay){
					auto();
				};
			});
		};

		if(opts.autoPlay){
			auto();
		};

		g_showBox.mouseover(function(){
			if (timer){
				clearInterval(timer);
			};
		}).mouseout(function(){
			if (opts.autoPlay){
				auto();
			};
		});
	}
})(jQuery);
/*
调用方法
$("#banner1").sliderBanner({
	next:".next",              //下一帧按钮
	prev:".prev",              //上一帧按钮
	showBox:".show ul",        //滑块区
	control:".control",	       //控制小点
	conliClass:"sel",          //控制小点当前帧样式
	moveTime:600,			   //每一帧变化时的滑动时间，不设置时默认600ms
	autoTime:3000,			   //自动播放间隔时间，不设置时默认3000ms
	autoPlay:true			   //是否自动播放，不设置时默认为true
});
*/