/*
 * dialog 1.0
 * Copyright (c) 2015 Veznlee 
 * Date: 2015-09-28
 * 弹出提示框，可自定义弹窗文字，宽，高及背景色。自适应居中，可拖动。
 */
;(function ($, window, document, undifined){
	$.dialog = {
		zindex:100,
		alert:function(options){
			var $dialog = this.init(options);
			$dialog.find(".cancle").remove();
		},
		sure:function(options){
			var $dialog = this.init(options);
			$dialog.find(".sure").remove();
			$dialog.find(".cancle").remove();
		},
		init:function(opts){
			opts = $.extend({},this.defaults,opts);
			var $dialog = this.templete(opts);
			this.zindex++;
			$dialog.css({
				width:opts.width,
				height:opts.height,
				zIndex:this.zindex,
				border:opts.border,
				background:opts.background
			}).next().css({
				zIndex:(this.zindex-1),
			});
			if(opts.autoHeight)$dialog.height("auto");
			this.position($dialog);
			if(opts.drag){this.drag($dialog);};
			this.resize($dialog);
			this.events($dialog,opts);
			return $dialog;
		},
		templete:function(opts){
			var $dialog = $("<div id='dialog'>"+
						"	<div class='title'>"+opts.title+"</div>"+
						"   <a href='javascript:void(0);' class='close'>×</a>"+
						"	<div class='content'>"+opts.content+"</div>"+
						"	<p>"+
						"		<a href='javascript:void(0);' class='btn sure'>"+opts.sure+"</a>"+
						"		<a href='javascript:void(0);' class='btn cancel'>"+opts.cancel+"</a>"+
						"	</p>"+
						"</div>");
			$("body").append($dialog).append("<div class='overlay'></div>");
			return $dialog;
		},
		position:function($dialog){
			var left = (window.innerWidth - $dialog.width())/2;
			var top = (window.innerHeight - $dialog.height())/2;
			$dialog.css({left:left,top:top});
		},
		drag:function($dialog){
			var $title = $dialog.find(".title");
			$title.mousedown(function(e){
				var ev = e||window.event;
				var x = ev.clientX - $dialog.offset().left;
				var y = ev.clientY - $dialog.offset().top;
				var maxl = window.innerWidth - $dialog.width();
				var maxt = window.innerHeight - $dialog.height();
				$(document).mousemove(function(e){
					var ev = e||window.event;
					var left = ev.clientX - x;
					var top = ev.clientY - y;
					if(left<=0){left=0;};
					if(left>=maxl){left=maxl;};
					if(top<=0){top=0;};
					if(top>=maxt){top=maxt;};
					$dialog.css({left:left,top:top});
				}).mouseup(function(){
					$(document).off("mousemove");
					$(document).off("mouseup");
				});
			});
		},
		resize:function($dialog){
			var $this = this;
			$(window).resize(function(){
				$this.position($dialog);
			});
		},
		events:function($dialog,opts){
			var _close = function($dialog){
				$dialog.next().remove();
				$dialog.remove();
			};
			if(opts.overlayClose){
				$dialog.next().click(function(){
					_close($dialog);
				});
			};
			$dialog.find(".sure").on("click",function(){
				if(opts.callback)opts.callback.call($dialog,true);
				_close($dialog);
			});
			$dialog.find(".cancel,.close").on("click",function(){
				if(opts.callback)opts.callback.call($dialog,false);
				_close($dialog);
			});
		}
	};
	//默认参数
	$.dialog.defaults = {
		width:260,
		height:150,
		background:"#1F53A0",
		border:"1px solid #111",
		title:"操作提示",
		sure:"确定",
		cancel:"取消",
		content:"您确定执行当前的操作吗?",
		drag:true,
		overlayClose:false,
		autoHeight:false
	};
})(jQuery, window, document);

/*调用方法：
$.dialog.init({
	width:260,							//宽
	height:150,							//高
	background:"#1F53A0",				//背景色
	border:"1px solid #111",			//边框
	title:"操作提示",					//弹出框title
	sure:"确定",						//确定按钮文字
	cancel:"取消",						//取消按钮文字
	content:"您确定执行当前的操作吗?",	//弹出框提示内容
	drag:true,							//是否可拖动
	overlayClose:false,					//是否点击阴影层关闭
	autoHeight:false					//是否自动高度，建议当弹出层文字较多时设置为true
	callback:function(ok){				//回调函数
		if(ok){
			alert("您点击的是确定按钮哦");
		}else{
			alert("您点击的是取消按钮哦");
		};
	}
});
*/
