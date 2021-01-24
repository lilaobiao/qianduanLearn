/*
 * sliderBanner 1.0
 * Copyright (c) 2015 Veznlee 
 * Date: 2015-09-23
 * 简单的图片轮播，可控制自动播放与否及时间，左右点击功能，小图控制功能可控
 */
;(function($, window, document,undefined){
	$.fn.sliderBanner = function(cjson){
		var defaults = {		
			autoPlay:true,		//默认自动播放
			autoTime:3000,		//间隔时间3000
			moveTime:600		//播放时间600
		};
		var opts = $.extend({},defaults, cjson);
		var g_next = opts.next;					//下一张
		var g_prev = opts.prev;					//上一张
		var g_showBox = opts.showBox;			//轮播区
		var g_control = opts.control;			//控制小图
		var g_conliClass = opts.conliClass;		//控制小图选中样式
		var animateEnd = 1;
		var timer = null;

		function addIndex(){
			var showli = g_showBox.find("li");
			for (var i=0; i<showli.length; i+=1){
				showli.eq(i).attr("index",i);
			};
		};
		addIndex();

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

		function nextscroll() {
			var offset = (g_showBox.find("li").width()) * -1;
			g_showBox.stop().animate({
				left: offset
			}, opts.moveTime, function() {
				var firstItem = g_showBox.find("li").first();
				g_showBox.find("ul").append(firstItem);
				$(this).css("left", "0px");
				if (g_control){
					circle();
				};
			});
		};

		function circle() {
			var currentItem = g_showBox.find("ul li").first();
			var currentIndex = currentItem.attr("index");
			g_control.find("li").removeClass(g_conliClass);
			g_control.find("li").eq(currentIndex).addClass(g_conliClass);
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

		g_prev.click(function() {
			if (timer){
				clearInterval(timer);
			};
			g_showBox.stop(true,true);
			var offset = (g_showBox.find("li").width() * -1);
			var lastItem = g_showBox.find("li").last();
			g_showBox.find("ul").prepend(lastItem);
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
						g_showBox.find("ul").append(firstItem)
					}
					g_showBox.find("ul").prepend(curr);
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
						g_showBox.find("ul").prepend(lastItem)
					}
					g_showBox.find("ul").append(curt);
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

		function auto(){
			timer = setInterval(function(){
				nextscroll();
			},opts.autoTime);
		};

		if(opts.autoPlay){
			auto();
		};
	}
})($, window, document);
/*
调用方法
$(".v_out").sliderBanner({
	next:$(".next a"),
	prev:$(".prev a"),
	showBox:$(".v_cont"),
	control:$(".circle"),	小图，可有可无
	conliClass:"circle-cur"	小图，可有可无
});
*/