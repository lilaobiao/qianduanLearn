// JavaScript Document
/*
 * 带箭头、缩略图幻灯片
 * Author: Lynn <742051933@qq.com>
 * Time: 2014-7-17
 * Version: 1.0
 */

;(function($){
	$.fn.slider = function(s, c){
		if (!this.length){return;}
		if (typeof s == "function") {
			c = s;
			s = {};
		}
		var s = $.extend({
			panel: null								// 图片面板
			,thumb: null							// 索引面板
			,clsCurrent: "current"		// 当前样式
			,time: 3000								// 自动播放时间间隔
			,isAuto: true							// 是否自动播放
			,effect: null							// 特效 null, fade
			,arrow: null					    // 是否显示箭头
			,index: 0									// 当前值
			,scrollPage: ".item"			// 滚动的元素单位
		},s || {});
		
		var $this = $(this);
		var t = 0;
		var index = s.index;
		var panel = $this.find(s.panel);	
		var len = panel.find(s.scrollPage).length;
		
		
		//* 自动播放
		var autoSlider = function(index){
				t = setInterval(function(){
					if( index < len ){
						if( s.effect == 'fade' ){
							panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
						}else{
							panel.find(s.scrollPage).eq(index).show().siblings().hide();
						}						
						thumb.find("li").eq(index).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
					}else{
						index = 0;
						if( s.effect == 'fade' ){
							panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
						}else{
							panel.find(s.scrollPage).eq(index).show().siblings().hide();
						}
						thumb.find("li").eq(index).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
					}
					index++;
					s.index = index;
				},s.time);
		}
		
		//* 效果
		var effect = function(index){
					
		}
		
		//* 鼠标经过显示
		if( s.thumb ){
			var thumb = $this.find(s.thumb);
			
			thumb.find("li").mouseover(function(){
				clearInterval(t);
				index = $(this).index();
				
				if( index < len ){
					if( s.effect == 'fade' ){
						panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
					}else{
						panel.find(s.scrollPage).eq(index).show().siblings().hide();
					}
					$(this).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
				}else{
					index = 0;
					if( s.effect == 'fade' ){
						panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
					}else{
						panel.find(s.scrollPage).eq(index).show().siblings().hide();
					}
					$(this).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
				}
				index++;
			});
			
			//* 鼠标移开后，自动播放
			thumb.find("li").mouseout(function(){
				clearInterval(t);
				index = $(this).index();
				
				autoSlider(index);		
			});
		}
		
		//* 点击左右滑动
		if( s.arrow ){
			var btnLeft = $this.find(s.arrow.left);
			var btnRight = $this.find(s.arrow.right);
			
			btnLeft.click(function(){		//往左滑动
				clearInterval(t);
				index = s.index;
				
				if( index < len ){
					if( s.effect == 'fade' ){
						panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
					}else{
						panel.find(s.scrollPage).eq(index).show().siblings().hide();
					}
					$(this).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
				}else{
					index = 0;
					if( s.effect == 'fade' ){
						panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
					}else{
						panel.find(s.scrollPage).eq(index).show().siblings().hide();
					}
					$(this).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
				}
				index--;
				s.index = index;
			});
			
			
			btnRight.click(function(){		//往右滑动
				clearInterval(t);
				index = s.index;
				
				if( index < len ){
					if( s.effect == 'fade' ){
						panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
					}else{
						panel.find(s.scrollPage).eq(index).show().siblings().hide();
					}
					$(this).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
				}else{
					index = 0;
					if( s.effect == 'fade' ){
						panel.find(s.scrollPage).eq(index).fadeIn().siblings().fadeOut();
					}else{
						panel.find(s.scrollPage).eq(index).show().siblings().hide();
					}
					$(this).addClass(s.clsCurrent).siblings().removeClass(s.clsCurrent);
				}
				index++;
				s.index = index;
			});
		}
		
		
		
		if( s.isAuto ){autoSlider(index);}
	}	
})(jQuery);