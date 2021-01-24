String.prototype.replaceAll  = function(s1,s2){   
	return this.replace(new RegExp(s1,"gm"),s2);   
} 

String.prototype.trim = function() 
{ 
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.prototype.len=function(){  
	  return this.replace(/[^\x00-\xff]/g,"**").length  
} 

String.prototype.replaceAt=function(index, c) {
    return this.substr(0, index) + c + this.substr(index, this.length);
}


/**
 * 
 * @param {Object} text 原始串
 * @param {Object} width 容器宽度,单位px
 * @param {Object} suffix 省略符号
 * @param {Object} enWidth 英语字符的宽度，单位px
 * @param {Object} chWidth 中文字符的宽度，单位px
 */
function textOmitor(text, width,suffix,enWidth,chWidth){
	var e = 7,c = 12;
	var intCount = 0;
	var i = 0
	var flag =false;
	if(suffix)
		intCount +=10;
	if(enWidth) 
		e = enWidth;	
	if(chWidth)
		c = chWidth;
	for (; Math.min(i, text.length) != text.length; i++) {
		if (text.charCodeAt(i) > 255) {
			intCount += c;
		} else {
			intCount += e;
		}
		if (intCount > width) {
			flag = true;
			break;
		}
	}
	var result = text.substring(0, i);
	if(flag && suffix)
		result +="....";
	return result;
}

//显示日期 n可以为正负，负表示几天前，正表示几天后
function showdate(n)  
{  
	var uom = new Date();
	uom.setDate(uom.getDate()+n);  
	uom = uom.getFullYear() + "-" +   (uom.getMonth()+1) + "-" + uom.getDate();  
	return uom;  
} 
     
//转义<>字符
function arrowFilter(s){
    if(!s)return "";
    var html = "";
    var buffer = "";
    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        switch (c) {
        case '<':
            buffer += "&lt;";
            break;
        case '>':    
			buffer += "&gt;";
            break;
        case '&':
			buffer += "&amp;";
            break;
        case '"':
			buffer += "&quot;";
            break;
        case "'":
			buffer += "\'";
            break;
        default:
            buffer +=c;
        }
    }
    html = buffer.toString();
    return html;
}


//格式化数字
function formatNumberByComma(num)
{
	if(isNaN(num))return num;
	var numArry = String(num).split(".");
    var ss=numArry[0];
    
    var strFormat="";
    while(ss.length>3)
    {
        strFormat=","+ss.substring(ss.length-3,ss.length)+strFormat;
        ss=ss.substring(0,ss.length-3);
    }
    if(ss.length>0)
    {
        strFormat=ss+strFormat;
        if(numArry[1]){
        	strFormat+="."+numArry[1];
        }
    }
    return strFormat;
}
var fileUrlPath = "http://static.tanzhouedu.com/";


//验证上传文件类型
function validUploadFlieType(value,type){
	var rxAccept = new RegExp('\\.('+(type?type:'')+')$','gi');
   	return value.match(rxAccept);
}

//定义图片位置
function setImagePosition(t){
	t = $(t);
	if(t.width()/1.5 > t.parent().width()){
		t.css({left:-t.parent().width()/2});
	}
	if(t.height()/1.5 > t.parent().height() && t.width()/1.5 > t.parent().width()){
		t.css({top:-t.parent().height()/2});
	}
}

/**
 * 获取图片路径地址
 * @param {Object} path
 * @param suffix 后辍
 * return path 大图全路径，min 小图全路径 
 */
function getPhotoUrl(path,size){
	if(typeof(path) != 'string'){
        return {path:"",min:""};
	}
	if(!path || path.trim()=="")return {path:"",min:""};
	path = fileUrlPath + path;
	var index = path.lastIndexOf('.');
	var suffix = path.substr(index);
	var min = path.substr(0, index)+"_"+size+suffix;
	return {path:path,min:min};
}


/**
 * 等比压缩图片
 */
function suitableImage(iW, iH, cW, cH, flag){
			if(iW <= cW && iH <= cH){
				return {w:iW,h:iH};
			}
            var w = iW / cW;
            var h = iH / cH;
            if (w > h) {
                var zoom = cW / iW;
                if (flag) {
                    w = iH * zoom;
                    h = cW
                }
                else {
                    w = cW;
                    h = iH * zoom
                }
                
            }
            else {
                var zoom = cH / iH;
                if (flag) {
                    w = cH;
                    h = iW * zoom
                }
                else {
                    w = iW * zoom;
                    h = cH
                }
            }
		return {w:w,h:h};
}

/**
 * 重新加载图片
 */
function resetPhotoLoad(obj,cW,cH){
	obj.unbind('error').bind('error',function(){
		obj.attr("src",'/tp/images/center/IDCard_back.jpg');
	}).unbind('load').load(function(){
		var size = suitableImage(obj.width(),obj.height(),cW,cH);
	    obj.css({
	        width: size.w,
	        height: size.h
	    });
	});
}

/**
 * 延迟加载图片
 */
function photoLazyload(){
    $("img[data-original]").lazyload({
        event: "scroll"
    });
    $(window).triggerHandler("scroll");
}
var zindex = 100;
var timerInterval = null;
var isMouseDownDoing = false;
var ajaxTimeout = null;
(function($){
	$.tmUtil = {
		dialogHtml : function(opts){
			if(opts.single){
				$(".tmui-modal").remove();
				$(".tmui-overlay").remove();
			};
			var dialogHtml = "<div class='b_l w460'><div class='bcom_ti'>"+
			                 "<a href='javascript:void(0)' class='bide layer_icon fr tmui-modal-close'></a>"+
			                 "<span>"+opts.title+"</span></div>"+
			                 "<div class='bcom_cent'>"+
	                 	     "<p class='bcomti'>"+opts.content+"</p>"+
	                 	     "<p class='bcoma'><a href='javascript:void(0)' class='bc_abut1 tmui-modal-sure'>"+opts.sureText+"</a>"+
	                 	     "<a href='javascript:void(0)' class='bc_abut2 tmui-modal-cancle'>"+opts.cancleText+"</a></p>"+
	                 	     "</div>";
			return $(dialogHtml);
		},
		_position : function($obj,opts){
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();
			var left =opts.left || (windowWidth - $obj.width())/2;
			var top = opts.top || (windowHeight - $obj.height())/2;
			if(opts.open=="top"){
				$obj.css("left",left).stop().animate({top:top});
			}else if(opts.open=="left"){
				$obj.css("top",top).stop().animate({left:left});
			}else if(opts.open=="fade"){
				$obj.hide().css({left:left,top:top}).stop().fadeIn("slow");
			}else if(opts.open=="slide"){
				$obj.hide().css({left:left,top:top}).stop().slideDown("slow");
			}else if(opts.open=="message"){
				var left = $.tmUtil._getClientWidth()-opts.width-3;
				var top = $.tmUtil._getClientHeight()-opts.height-3;
				$obj.css({left:left,top:$.tmUtil._getClientHeight()}).stop().animate({top:"+"+top+"px"});
			}else{
				$obj.css({"left":left,"top":top});
			}
		},
		_resize : function($obj,opts){
			$(window).on("resize",function(){
				$.tmUtil._position($obj,opts);
				$obj.next(".tmui-overlay").height($.tmUtil._getScrollHeight());
			});
		},
		_overlay:function($dialog){
	    	var height = this._getScrollHeight();
	    	var zindexc = $dialog.css("z-index");
	    	zindexc--;
    		var $overLayObj = $('<div class="tmui-overlay" style="height:'+height+'px;z-index:'+zindexc+'"></div>');
    		$dialog.after($overLayObj);
	    },
		_getClientHeight : function() {
		    var clientHeight = 0;
		    if (document.body.clientHeight && document.documentElement.clientHeight) {
		        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
		    } else {
		        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight: document.documentElement.clientHeight;
		    }
		    return clientHeight;
		},
		_getClientWidth : function() {
		    var clientWidth = 0;
		    if (document.body.clientWidth && document.documentElement.clientWidth) {
		        clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth: document.documentElement.clientWidth;
		    } else {
		        clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth: document.documentElement.clientWidth;
		    }
		    return clientWidth;
		},
		_getScrollHeight : function (){
			return  Math.max(this._getClientHeight(),document.body.scrollHeight,document.documentElement.scrollHeight);
		},
		_getHeight: function() {
	        return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight;
	    },
	    _getWidth: function() {
	        return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body.clientWidth;
	    },
		_showOpen : function($dialog,opts){
			zindex++;
			$dialog.css("zIndex",zindex);
			if(opts.open !="other"){
				$dialog.show().css({width:opts.width,height:opts.height,"margin":"none"});
				$("body").append($dialog);
				$.tmUtil._position($dialog,opts);
				$.tmUtil._resize($dialog,opts);
			}
			if(opts.open=="other"){
				if(opts.animateBefore=="before"){
					$dialog.css("margin","auto").show().stop().animate({width:opts.width,height:opts.height});
					$("body").append($dialog);
				}
				if(opts.animateBefore=="after"){
					$("body").append($dialog);
					$dialog.css("margin","auto").show().stop().animate({width:opts.width,height:opts.height});
				}
			}
		},
		_animateClose : function($obj,opts){
			var height = $obj.offset().top+$obj.height()*2;
			var width = $obj.offset().left+$obj.width()*2;
			if(opts.open=="top"){
				$obj.stop().animate({top:"-"+height+"px"},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="left"){
				$obj.stop().animate({left:"-"+width+"px"},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open =="fade"){
				$obj.stop().fadeOut("slow",function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="slide"){
				$obj.stop().slideUp("slow",function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="other"){
				$obj.stop().animate({width:0,height:0},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else if(opts.open=="message"){
				$obj.stop().animate({top:$.tmUtil._getClientHeight()},function(){
					if(opts.showOverlay)$(this).next().remove();
					$(this).remove();
				});
			}else{
				if(opts.showOverlay)$obj.next().remove();
				$obj.remove();
			}
		},
		_shake : function (obj){
		    var style = obj.style,
		        p = [14, 18, 14, 10, -14, -18, -14, 10,12,0,-12,11],
		        fx = function () {
		            style.marginLeft = p.shift() + 'px';
		            if (p.length <= 0) {
		                style.marginLeft = 0;
		                clearInterval(timerId);
		            };
		        };
		    p = p.concat(p.concat(p));
		    timerId = setInterval(fx, 13);
		},
		_overlayClick:function($dialog,opts){
			$dialog.next().click(function(e){
				$.tmUtil._animateClose($dialog,opts);
				stopBubble(e);
			});
		}
	};
	
	$.tmDialog = {
		confirm :function(options){
			if(isEmpty(options.icon))options.icon = "warn";
			this._init(options);
		},
		_init:function(options){
			var opts = $.extend({},$.tmDialog,$.tmDialog.defaults,options);
			var $dialog = $.tmUtil.dialogHtml(opts);
			if(isNotEmpty(opts.id))$dialog.attr("id",opts.id);
			$dialog.data("options",opts);
			$.tmUtil._showOpen($dialog,opts);//打开特效
			this._bindEvent($dialog,opts);//绑定事件
			if(!eval(opts.showIcon))$dialog.find(".tmui-modal-icon").remove();
			if(opts.drag)$dialog.tmDrag({handle:$dialog.find(".tmui-modal-header")});//是否允许拖动
			if(opts.width<=360)opts.width = 360;
			if(opts.height<=200)opts.height = 260;
			if(opts.showOverlay)$.tmUtil._overlay($dialog);//是否有阴影层
			if(opts.showHeader){$dialog.find(".tmui-modal-header").hide();}
			
			if(eval(opts.showIcon)){
				$dialog.find(".tmui-modal-content").width(opts.width-148);
			}else{
				$dialog.find(".tmui-modal-content").css({"width":(opts.width-100),"textAlign":opts.arrow||"center","padding":0,"padding":50});
			}
			
			if(!eval(opts.showBottom)){
				$dialog.find(".tmui-modal-bottom").remove();
				var h = opts.height-55;
				$dialog.height(h).find(".tmui-modal-body").height(h);
			}else{
				$dialog.find(".tmui-modal-body").height(opts.height-125);
			}
			if(!eval(opts.showClose)){
				$dialog.find(".tmui-modal-close").remove();
				$dialog.find(".tmui-modal-cancle").remove();
			}
			
			if(eval(opts.overlayHide))$.tmUtil._overlayClick($dialog,opts);
			if(eval(opts.colors).length>0){
				var colorx = eval(opts.colors);
				$dialog.find(".tmui-modal-header").css({"background":colorx[0]});
				$dialog.find(".tmui-modal-sure").css({"background":colorx[1]||colorx[0]});
				$dialog.find(".tmui-modal-cancle").css({"background":colorx[2]||colorx[0]});
			}
			if(isNotEmpty(opts.timer))this._timer($dialog,opts);
			if(eval(opts.shake))$.tmUtil._shake($dialog.get(0));
			if(isNotEmpty(opts.left))$dialog.css("left",opts.left);
			if(isNotEmpty(opts.top)){$dialog.css("top",opts.top);}
			if(isNotEmpty(opts.zindex)){
				$dialog.css("zIndex",opts.zindex).next().css("zIndex",opts.zindex-1);
			}
			return $dialog;
		},
		
		_limitRandom : function (begin,end){
			 return Math.floor(Math.random()*(end-begin))+begin;
		},
		_bindEvent :function($dialog,opts){
			$dialog.find(".tmui-modal-cancle,.tmui-modal-close").off().on("click",function(e){
				if(opts.callback)opts.callback(false);
				$.tmDialog._remove($dialog,opts);
				if(opts.content instanceof jQuery){
					$("body").append(opts.content.hide());
				}
			});
			
			$dialog.find(".tmui-modal-sure").off().on("click",function(){
				if(opts.callback)opts.callback(true);
				$.tmDialog._remove($dialog,opts);
			});
		},
		_timer : function($dialog,opts){
			var timecount = opts.timer*1000 / 1000;
			clearInterval(timerInterval);
			timerInterval = setInterval(function(){
				$dialog.find(".tmui-modal-timer").html("("+timecount+")");
				if(timecount<=1){
					$.tmUtil._animateClose($dialog,opts);
					clearInterval(timerInterval);
				}
				timecount--;
			},1000);
		},
		_remove : function($dialog,opts){
			if(timerInterval)clearInterval(timerInterval);
			$.tmUtil._animateClose($dialog,opts);
		},
		_zindex:function(){
			var arr = [];
			$(".tmui-modal").each(function(){
				arr.push($(this).css("z-index"));
			});
			var max = Math.max.apply({},arr)*1 || 100;
			max++;
			return max;
		},
		window : function(options){
			options = $.extend({},$.tmDialog.defaults,options);
			var $wp = $("#tm_window_"+options.id);
			if(isNotEmpty($wp.html())){
				var max = $.tmDialog._zindex();
				$wp.show().css({"zIndex":max});
				$wp.next().css({"zIndex":(max-1)});
				return;
			}
			options.id = "tm_window_"+options.id;/*给id重命名*/
			options.showBottom = false;
			options.showIcon = false;
			if(!options.showCenter){//是否居中显示
				options.top = this._limitRandom(30,60);
				options.left = this._limitRandom(300,400);
			}
			var $window = this._init(options);
			$window.find(".tmui-modal-body").html("<div id='tmDialog_loading' style='position:absolute;top:50%;left:45%;'><img src='images/loading.gif'><label style='font-size:12px;'>数据马上就来...</label></div>");
			if(!options.ajax){
				var iframe=document.createElement("iframe");
				iframe.id = "tmiframe_"+options.id ;
				iframe.width= options.width;
				iframe.height = options.height;
				iframe.scrolling = "auto";
				iframe.frameborder = "no";
				iframe.src = options.content;
				iframe.style.display ="none";
				iframe.style.border ="0";
				$(iframe).attr("frameborder","no");
				$window.find(".tmui-modal-body").css({"overflowX":"hidden","overflowY":"auto","height":options.height}).append(iframe);
				$(iframe).load(function(){
					$window.find("#tmDialog_loading").remove();
					iframe.style.display ="block";
				});
			}else{
				$window.find(".tmui-modal-body").css({"height":options.height}).load(options.content,function(){
					$window.find(".tmui-modal-close-proxy").on("click",function(){
						$window.fadeOut("slow",function(){
							$window.next().remove();
							$window.remove();
						});
					});
					$window.tmDrag({handle:$window.find(".tmui-drag-header")});//是否允许拖动
				});
			}
			
			$window.find(".tmui-modal-header").css("paddingLeft",3).prepend("<div class='fl' style='padding-top:4px;padding-right:5px;'><img src='"+options.wicon+"' width='22' height='23'/></div>&nbsp;");
			$window.find(".tmui-modal-toolbars").append("<button type='button' title='最大化' class='tmui-modal-max'><span class='tmui-modal-span'>□</span></button><button type='button' title='最大小化' class='tmui-modal-min'><span class='tmui-modal-span'>-</span></button>");
			$window.find(".tmui-modal-min").on("click",function(){
				$window.tmDrag({handle:$window.find(".tmui-modal-header")});//是否允许拖动
			});
			var max = $.tmDialog._zindex();
			$window.show().css("zIndex",max);
			$window.next().css({"zIndex":(max-1)});
			/*附加代理层*/
			$("#tmui_resizable").remove();
			$("body").append("<div id='tmui_resizable'></div>");
			/*添加resize边角*/
			$window.append("<div class='tmui-resize tmui-resize-ll'></div>" +
					"<div class='tmui-resize tmui-resize-tt'></div>" +
					"<div class='tmui-resize tmui-resize-rr'></div>" +
					"<div class='tmui-resize tmui-resize-bb'></div>" +
					"<div class='tmui-resize tmui-resize-tr'></div>" +
					"<div class='tmui-resize tmui-resize-tl'></div>" +
					"<div class='tmui-resize tmui-resize-br'></div>" +
					"<div class='tmui-resize tmui-resize-bl'></div>");
			/*最大化*/
			$window.find(".tmui-modal-max").off().on("click",function(){
				var open = $(this).data("open");
				var max = $.tmDialog._zindex();
				$window.css("zIndex",max);
				var width = $.tmUtil._getClientWidth();
				var height = $.tmUtil._getClientHeight();
				if(isEmpty(open)){
					var styleData = $window.attr("style");
					$(this).data({"open":"open","style":styleData});
					$window.css({left:0,top:1,width:"100%",height:height-70});
					$(this).find("span").text("■");
					$window.find(".tmui-modal-header").css("cursor","default").off();
					$window.find("iframe").height(height).width(width);
					$window.find(".tmui-modal-body").height(height).width(width);
				}else{
					$window.attr("style",$(this).data("style"));
					$window.find("iframe").height($window.height()).width($window.width());
					$window.find(".tmui-modal-body").height(height).width(width);
					$window.tmDrag({handle:$window.find(".tmui-modal-header")});//是否允许拖动
					$(this).find("span").text("□");
					$(this).removeData("open");
					$(this).removeData("style");
				}
				if(options.maxcallback)options.maxcallback($window,options);
			});
			
			$window.find(".tmui-modal-min").off().on("click",function(){
				if(options.mincallback)options.mincallback($window,options);
				var max = $.tmDialog._zindex();
				$window.css("zIndex",max);
			});
			
			if(!options.showMax){
				$window.find(".tmui-modal-min").css("right",45);
				$window.find(".tmui-modal-max").remove();
			}
			
			if(!options.showMin)$window.find(".tmui-modal-min").remove();
			if(!options.showHeader){
				$window.find(".tmui-modal-header").css({"position":"absolute","width":"100%","height":47,"zIndex":2});
				$window.hover(function(){
					$(this).find(".tmui-modal-header").show();
				},function(){
					$(this).find(".tmui-modal-header").hide();
				});
			}
			
			if(!options.removeHeader){
				$window.find(".tmui-modal-header").remove();
			}
			if(options.showResize){
				var windowDom = $window.get(0);
				var oL = $window.find(".tmui-resize-ll").get(0);
				var oT = $window.find(".tmui-resize-tt").get(0);
				var oR = $window.find(".tmui-resize-rr").get(0);
				var oB = $window.find(".tmui-resize-bb").get(0);
				var oLT = $window.find(".tmui-resize-tr").get(0);
				var oTR = $window.find(".tmui-resize-tl").get(0);
				var oBR = $window.find(".tmui-resize-br").get(0);
				var oLB = $window.find(".tmui-resize-bl").get(0);
				
	
				/*四角*/
				this._windowResize(windowDom, oLT, true, true, false, false,options);
				this._windowResize(windowDom, oTR, false, true, false, false,options);
				this._windowResize(windowDom, oBR, false, false, false, false,options);
				this._windowResize(windowDom, oLB, true, false, false, false,options);
				/*四边*/
				this._windowResize(windowDom, oL, true, false, false, true,options);
				this._windowResize(windowDom, oT, false, true, true, false,options);
				this._windowResize(windowDom, oR, false, false, false, true,options);
				this._windowResize(windowDom, oB, false, false, true, false,options);
			}else{
				$window.find(".tmui-resize").remove();
			}
		},
		_windowResize : function(oParent, handle, isLeft, isTop, lockX, lockY,opts){
			var dragMinWidth = opts.limitWidth;
			var dragMinHeight = opts.limitHeight;
			handle.onmousedown = function (event){
				var max = $.tmDialog._zindex();
				$(oParent).css("zIndex",max);
				var e = event || window.event;
				var disX = e.clientX - handle.offsetLeft;
				var disY = e.clientY - handle.offsetTop;
				var iParentTop = oParent.offsetTop;
				var iParentLeft = oParent.offsetLeft;
				var iParentWidth = oParent.offsetWidth;
				var iParentHeight = oParent.offsetHeight;
				document.onmousemove = function (event){
					var e = event || window.event;
					var iL = e.clientX - disX;
					var iT = e.clientY - disY;
					var maxW = document.documentElement.clientWidth - oParent.offsetLeft - 2;
					var maxH = document.documentElement.clientHeight - oParent.offsetTop - 2;
					var iW = isLeft ? iParentWidth - iL : handle.offsetWidth + iL;
					var iH = isTop ? iParentHeight - iT : handle.offsetHeight + iT;
					isLeft && (oParent.style.left = iParentLeft + iL + "px");
					isTop && (oParent.style.top = iParentTop + iT + "px");
					iW < dragMinWidth && (iW = dragMinWidth);
					iW > maxW && (iW = maxW);
					lockX || (oParent.style.width = iW + "px");
					iH < dragMinHeight && (iH = dragMinHeight);
					iH > maxH && (iH = maxH);
					lockY || (oParent.style.height = iH + "px");
					if((isLeft && iW == dragMinWidth) || (isTop && iH == dragMinHeight)) document.onmousemove = null;
					$(oParent).find("iframe").height(iH).width(iW);
					$(oParent).find(".tmui-modal-body").height(iH).width(iW);
					return false;
				};
				document.onmouseup = function (){
					document.onmousemove = null;
					document.onmouseup = null;
				};
				return false;
			};
		}
	};
	
	$.fn.tmDrag = function (settings) {
		return this.each(function () {
			var $drag = $(this),options = $.extend({},$.fn.tmDrag.defaults,$.fn.tmDrag.defaults.parseOptions(this),settings),
			// 拖动对象
			$handle = options.handle ? $drag.find(options.handle) : $drag,
			// 拖动区域对象
			$zoom = $(options.zoom),
			// 拖动开始的位置
			startPos = {},
			dragFix = {},
			// body 默认 cursor
			cursor = $("body").css("cursor"),
			// 默认的 zIndex 值
			zIndex = $drag.css("z-index"),
			// 是否正在拖动
			isDraging = 0,ghsotDiv;
			$handle.css("cursor", "move");
			_checkPosition($drag);
			if(!options.isDrag)return;
			// html4 拖拽
			$handle.mousedown(function (e) {
				var evt = e || event;
				if(evt.which==3 || evt.button==2)return;
				var left = $drag.offset().left;
				var top = $drag.offset().top;
				$drag.css({top:top,left:left,"margin":0,"position":"absolute"});
				if(options.ghsot){ghsotDiv = options.ghsotEvent($drag);}
				if (!isDraging) {
					_ondragstrart(e);
					return false;
				}
			});
			
			$(document).mousemove(function (e) {
				if (isDraging) {
					_ondragpos(e);
					return false;
				}
			}).mouseup(function (e) {
				if (isDraging) {
					_ondragpos(e, true);
					return false;
				}
			});

			/**
			 * 检查拖动对象的position
			 * @return {undefined}
			 */
			function _checkPosition() {
				if (!$drag.css("position")) {
					$drag.css({
						position: "absolute",
						left: 0,
						top: 0
					});
				}
			}
			
			/**
			 * 开始拖动
			 * @param  {Object} event对象
			 * @return {undefined}
			 */

			function _ondragstrart(e) {
				isDraging = 1;
				startPos.screenX = e.screenX;
				startPos.screenY = e.screenY;
				startPos.left = $drag.offset().left;
				startPos.top = $drag.offset().top;
				$parentbox = options.parent;
				boxHeight = $(window).height()+$(window).scrollTop()-($drag.height()/5);
			    boxWidth = $.tmUtil._getClientWidth()-($drag.width()/5);
				if($parentbox){
					limitLeft =$parentbox.offset().left;
					limitTop = $parentbox.offset().top;
					//limitWidth = $parentbox.width();
					//limitHeight = $parentbox.height();
				}
				var max = $.tmDialog._zindex();
				$drag.css("zIndex",max);
				options.ondragstart.call($drag, e);
				$("body").css("cursor", "move");
			}
			
			/**
			 * 改变拖拽位置
			 * @param  {Object} event对象
			 * @return {undefined}
			 */

			function _ondragpos(e, isStop) {
				// 正在拖动并且不支持html5
				if (isDraging) {
					var _left = e.screenX - startPos.screenX + startPos.left;
					var _top = e.screenY - startPos.screenY + startPos.top;
					if($parentbox){
						if(_left<limitLeft)_left=limitLeft+3;
						if(_top<limitTop)_top=limitTop+3;
						if(_top>boxHeight)_top = boxHeight+8;
						if(_left>boxWidth)_left=boxWidth+8;
					}else{
						if(_left<(boxWidth*-1))_left= boxWidth*-1;
						if(_top<2)_top=2;
						if(_left>boxWidth)_left = boxWidth;
						if(_top>boxHeight)_top=boxHeight-options.arrowTop;
					}
					
					if(isNotEmpty(options.arrow) && options.arrow=="left"){
						_top = $drag.offset().top;
					}
					if(isNotEmpty(options.arrow) && options.arrow=="top"){
						_left = $drag.offset().left;
					}
					
					dragFix.left = _left;
					dragFix.top = _top;
					/*镜像处理*/
					if(options.ghsot){
						ghsotDiv.css({left:_left+"px",top:_top+"px"});
					}else{
						/*普通处理*/
						$drag.offset({left: _left,top: _top});
					}
				}
				// 停止
				if (isStop && isDraging) {
					if(options.ghsot){
						$drag.css({left:dragFix.left,top:dragFix.top});
						ghsotDiv.remove();
					}
					//$drag.css("z-index", zIndex);
					isDraging = 0;
					options.ondragend.call($drag, e);
					$("body").css("cursor", cursor);
				} else {
					options.ondrag.call($drag, e);
				}
			}
		});
	};
	
	$.fn.tmDrag.defaults = {
		// 鼠标操作区域
		handle: "",
		parent:"",
		arrow:"",
		arrowTop:30,
		isDrag:true,
		// 拖动的时候层级的高度
		zIndex: 999,
		// 拖动开始回调
		ondragstart: function () {},
		// 拖动中回调
		ondrag: function () {},
		// 拖动结束回调
		ondragend: function () {},
		ghsot:true,
		ghsotEvent:function($this){
			var ghsotDiv = $("<div class='ghsot'><div>");
			var selfHeight = $this.outerHeight(true);//容器自身的高度加border
			var selfWidth = $this.outerWidth(true);//容器自身的宽度加border
			var $offset = $this.offset();
			$("body").append(ghsotDiv);
			ghsotDiv.css({zIndex:999,border:"2px dotted #f9f9f9","boxShadow":"0px 0px 1.5em #111",opacity:0.35,position:"absolute",width:selfWidth,height:selfHeight,left:$offset.left,top:$offset.top});
			return ghsotDiv;
		}
	};
	
	$.fn.tmDrag.defaults.parseOptions = function(target){
		var $this = $(target);
		var ghsot = true;
		var arrow = "";
		var parent = "";
		var handle = "";
		var ghsotp = $this.attr("ghsot");
		var arrowp = $this.attr("arrow");
		var parentp = $this.attr("parent");
		var handlep = $this.attr("handle");
		if(isNotEmpty(ghsotp) && ghsotp=="false")ghsot=false;
		if(isNotEmpty(arrowp))arrow = arrowp;
		if(isNotEmpty(parentp))parent = $("#"+parentp);
		if(isNotEmpty(handlep))handle = $("#"+handlep);
		return {
			ghsot:ghsot,
			arrow:arrow,
			parent:parent,
			handle:handle
		};
	};
	
	
	$.tmDialog.defaults = {
		id:"",//标示符
		ajax:false,
	    open:"top",//打开方式。如果是default的话没有动画效果 //关闭动画的效果 fade left top default slide,other
	    animateBefore:"before",//如果open不是默认的动画效果，如果为true打开为前置动画，false为后置动画
		position:"fixed",//定位方式
		single:false,//是否采用单例模式
		width:358,//宽度
		height:228,//高度
		colors:[],//换肤
		drag:true,//是否允许拖拽
		shake:false,//是否抖动代开
		showIcon:true,//是否显示图标
		showBottom:true,//是否显示底部
		showHeader:false,//是否显示头部
		showResize:true,//是否resize
		showMin:true,//是否显示最小化
		showMax:true,//是否显示最大化
		showClose:true,//是否显示关闭
		showCenter:false,//默认随机显示位置
		showOverlay:true,//是否需要阴影层
		removeHeader:true,//删除头
		zindex:"",
		overlayHide:false,//
		icon:"success",//默认按钮
		limitWidth :360,//resize限制宽度
		limitHeight:88,//resize限制宽度
		wicon:"",//窗体图标
		message:false,//消息设置
		title:"提示",//标题
		value:"",//prompt的值
		left:"",//设定left
		top:"",//设定top
		timer:"",//几秒关闭
		content:"请输入内容....",//显示的内容
		cancleText:"取消",//取消按钮文件
		sureText :"确定",//确定按钮文件
		textarea:false,//prompt的展示
		finish:function(){
			
		},
		loadSuccess:function(){
			
		},
		validator:function($input){
			return true;
		},
		callback:function(ok){
			
		},
		mincallback:function(){
			
		},
		maxcallback:function(){
			
		}
	};
	
	$.tmLoading = function(content,options){
		var opts = $.extend({},$.tmLoading.defaults,options);
		if($(".tmui-loading").length==0)$("body").append('<div class="tmui-loading" title="click close me!"><span id="tm-loading-content"></span></div>');
		var $loading = 	$(".tmui-loading");
		if(opts.skin=="black"){
			$(".tmui-loading").css({background:"#3e4146","color":"#fff","border":"1px solid #555"});
		}
		if(opts.overlay){
			var overlayHeight = Math.max($.tmUtil._getClientHeight(),document.body.scrollHeight,document.documentElement.scrollHeight);
			$("body").append("<div class=\"tmui_loading_overlay\" style=\"z-index: 1001; height: 100%; display: none;\"></div>");
			$(".tmui_loading_overlay").on("click",function(){
				$loading.slideUp(250,function(){
					$(this).remove();
					clearInterval(loadingTimer);
				});
				$(this).remove();
			}).css({"opacity":"0.6","z-index":"999","height":overlayHeight}).show();
		}
		if(!opts.showLoad)$loading.find("#tm-loading-content").css("background","none");
		if(content=="remove"){
			$loading.slideUp(250,function(){
				opts.timeSuccess($loading);
				$(".tmui_loading_overlay").remove();
				if(opts._remove)$loading.remove();
			});
		}else{
			if(isEmpty(content))content = opts.content ;
			$loading.show().find("#tm-loading-content").html(content);
			var selfWidth = $loading.width();
			var selfHeight = $loading.height();
			var left = ($.tmUtil._getClientWidth()-selfWidth)/2;
			var top = ($.tmUtil._getHeight()-selfHeight)/2;
			if(isNotEmpty(opts.left))left= opts.left;
			if(isNotEmpty(opts.top))top = opts.top;
			$loading.css({left:left,top:top});
			opts.callback($loading,opts);
			var loadingTimer = null;
			if(opts.timer>0){
				loadingTimer = setTimeout(function(){
					$loading.slideUp(250,function(){
						clearInterval(loadingTimer);
						opts.timeSuccess($loading);
						$(".tmui_loading_overlay").remove();
						if(opts._remove)$loading.remove();
				});},opts.timer*1000);
			}else{
				$(".tmui_loading_overlay").remove();
				if(opts._remove)$loading.remove();
			}
		}
	};
	
	$.tmLoading.defaults = {
		top:"",
		left:"",
		timer:0,
		_remove:false,
		skin:"black",
		content:"loading...",
		showLoad:true,
		overlay:false,
		timeSuccess:function(){
			
		},
		callback:function($this,opts){
			if(opts._remove){
				$this.on("click",function(){
					$this.slideUp(250,function(){
						$(this).remove();
					});
					$(".tmui_loading_overlay").remove();
				});
			}else{
				$this.on("click",function(){
					$this.slideUp(250,function(){
						$(this).hide();
					});
					$(".tmui_loading_overlay").remove();
				});
			}
		}
	};
	/*loading plugin end*/
	/*tpAjax*/
	$.tpAjax = {
		request : function(options,dataJson){
			var opts = $.extend({},{limit:true,beforeSend:function(){
				//tmLoading("数据处理中,请稍后...",1);
			},error:function(){
				
			},callback:function(data){
				
			}},options);
			var _url = opts.url;
			if(isEmpty(_url)){
				_url = jsonPath+"/"+opts.model+"/"+opts.method+"?ajax=true";
			}
			if(isNotEmpty(opts.params)){
				_url+="&"+opts.params;
			}
			
			if(opts.limit){
				clearTimeout(ajaxTimeout);
				ajaxTimeout = setTimeout(function(){
					$.tpAjax.ajaxMain(opts,_url,dataJson);
				},200);
			}else{
				$.tpAjax.ajaxMain(opts,_url, dataJson);
			}
		},
		ajaxMain:function(opts,_url,dataJson){
			$.ajax({
				type:"post",
				data : dataJson,
				url : _url,
				beforeSend:function(){opts.beforeSend();},
				error:function(){tpLoading("抱歉！因为操作不能够及时响应，请稍后在试...",1);opts.error();clearTimeout(ajaxTimeout);},
				success:function(data){
					if(data.result=="logout"){
						$.tmLogin._dialogLogin();
					}else if(data.result=="frontLogout"){
						tp_login_dialog();
					}else{
						if(opts.callback)opts.callback(data);
					}
					clearTimeout(ajaxTimeout);
				}
			});
		}
	};
})(jQuery);

//回到顶部 js
$(function(){
    /* 置顶 */
    $(window).scroll(function() {
        if ($(window).scrollTop() >= 60) $(".rfl_backup").fadeIn(300);
        else $(".rfl_backup").stop(true, true).fadeOut(300);
	});
    $("body").on("click",".rfl_backup",function(){
        $('html, body').animate({
            scrollTop: 0
        },'slow');
        return false;
    });
});

function getHeight() {
	return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body.clientHeight;
};

function getWidth() {
	return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body.clientWidth;
};

function getTop() {
	return window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
};

function getLeft() {
	window.pageXOffset || document.documentElement && document.documentElement.scrollLeft || document.body.scrollLeft;
};

function getRight() {
	return windowPosition.left() + windowPosition.width();
};
/**
 * 获取窗体可见度高度
 * 
 * @returns
 */
function getClientHeight() {
	var clientHeight = 0;
	if (document.body.clientHeight && document.documentElement.clientHeight) {
		clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight
				: document.documentElement.clientHeight;
	} else {
		clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight
				: document.documentElement.clientHeight;
	}
	return clientHeight;
}
/**
 * 获取窗体可见度宽度
 * 
 * @returns
 */
function getClientWidth() {
	var clientWidth = 0;
	if (document.body.clientWidth && document.documentElement.clientWidth) {
		clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth
				: document.documentElement.clientWidth;
	} else {
		clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth
				: document.documentElement.clientWidth;
	}
	return clientWidth;
}

/* 获取文件后缀 */
function tp_getExt(fileName) {
	if (fileName.lastIndexOf(".") == -1)
		return fileName;
	var pos = fileName.lastIndexOf(".") + 1;
	return fileName.substring(pos, fileName.length).toLowerCase();
}

/* 获取文件名称 */
function tp_getFileName(fileName) {
	var pos = fileName.lastIndexOf(".");
	if (pos == -1) {
		return fileName;
	} else {
		return fileName.substring(pos,fileName.length);
	}
}
/**
 * 判断非空
 * 
 * @param val
 * @returns {Boolean}
 */
function isEmpty(val) {
	val = $.trim(val);
	if (val == null)
		return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
}

function isNotEmpty(val) {
	return !isEmpty(val);
}
/* 刷新当前 */
function tp_refreash() {
	window.location.href = window.location.href;
}

/* loading快速加载方法 */
function tpLoading(content, timeout, overlay) {
	$.tmLoading(content, {
		timer : timeout,
		skin : "black",
		overlay : overlay
	});
};
/* 获取浏览器的版本 */
function tp_getBroswerVersion() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	if (ua) {
		window.ActiveXObject ? Sys.version = "ie_"
				+ ua.match(/msie ([\d]+)/)[1]
				: document.getBoxObjectFor ? Sys.version = "firefox_"
						+ ua.match(/firefox\/([\d.]+)/)[1]
						: window.MessageEvent && !document.getBoxObjectFor ? Sys.version = "chrome"
								: window.opera ? Sys.version = "opera_"
										+ ua.match(/opera.([\d.]+)/)[1]
										: window.openDatabase ? Sys.version = ua
												.match(/version\/([\d.]+)/)[1]
												: 0;
	}
	return Sys;
}

function tp_getBrowse() {  
    var sUA=navigator.userAgent;
     //检测IE浏览器  
    if ((navigator.appName == "Microsoft Internet Explorer")) {  
        //检测模拟IE浏览的OPERA。edit at 2006-11-08(ver 0.1.2)  
        if (sUA.indexOf('Opera')!=-1) {  
            this.browseKernel='Presto';  
            if(window.opera && document.childNodes ) {  
                return 'Opera 7+';  
            } else {  
                return 'Opera 6-';  
            }  
        }  
        this.browseKernel='Trident';  
        if(sUA.indexOf('Maxthon')!=-1) {  
            return 'Maxthon';  
        }  
        if(sUA.indexOf('TencentTraveler')!=-1) { //ver 0.1.3  
            return '腾迅TT';  
        }  
        if(document.getElementById) {  
            return "IE5+";  
        } else {  
             return "IE4-";  
        }  
    }  
    //检测Gecko浏览器  
    if(sUA.indexOf('Gecko')!=-1) {
        this.browseKernel='Gecko';  
        if(navigator.vendor=="Mozilla") {return "Mozilla";}  
        if(navigator.vendor=="Firebird") {return "Firebird"; }  
        if (navigator.vendor.indexOf('Google')!=-1 || sUA.indexOf('Google')!=-1) {return 'Google';  }  
        if (sUA.indexOf('Firefox')!=-1) {return 'Firefox';  }
        return "Gecko";  
    }  
    //Netscape浏览器  
    if(sUA.indexOf('Netscape')!=-1) {  
        this.browseKernel='Gecko';  
        if(document.getElementById) {  
            return "Netscape 6+";  
        } else {  
            return 'Netscape 5-';  
        }  
    }  
    //检测Safari浏览器  
    if(sUA.indexOf('Safari') != -1) {this.browseKernel='KHTML';return 'Safari';}  
    if(sUA.indexOf('konqueror')!=-1) {this.browseKernel='KHTML';return 'Konqueror';}  
    //目前世界公认浏览网页速度最快的浏览器，但它占用的系统资源也很大。  
    if(sUA.indexOf('Opera') != -1) {  
        this.browseKernel='Presto';  
        if(window.opera && document.childNodes ) {  
            return 'Opera 7+';  
        } else {  
            return 'Opera 6-';  
        }  
        return 'Opera';  
    }  
    if((sUA.indexOf( 'hotjava' )!=-1) && typeof( navigator.accentColorName ) == 'undefined' ) {return 'HotJava';}  
    if( document.all && document.getElementById && navigator.savePreferences && (sUA.indexOf( 'netfront' ) < 0 ) && navigator.appName != 'Blazer' ) {return 'Escape 5'; }  
    //Konqueror / Safari / OmniWeb 4.5+  
    if( navigator.vendor == 'KDE' || ( document.childNodes && ( !document.all || navigator.accentColorName ) && !navigator.taintEnabled ) ) {this.browseKernel='KHTML';return 'KDE';}  
    if( navigator.__ice_version ) { return 'ICEbrowser';}  
    if( window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) {  
        if( document.createElement ) {  
            return 'iCab 3+';  
        } else {  
            return 'iCab 2-';  
        }  
    }  
    if(document.layers && !document.classes ) {return 'Omniweb 4.2-';}  
    if(document.layers && !navigator.mimeTypes['*'] ) {return 'Escape 4';}  
    if(navigator.appName.indexOf( 'WebTV' ) + 1 ) {return 'WebTV';}  
    if(sUA.indexOf( 'netgem' )!=-1 ) {return 'Netgem NetBox';}  
    if(sUA.indexOf( 'opentv' )!=-1 ) {return 'OpenTV';}  
    if(sUA.indexOf( 'ipanel' )!=-1) {return 'iPanel MicroBrowser';}  
    if(document.getElementById && !document.childNodes) {return 'Clue browser';}  
    if(document.getElementById && ( (sUA.indexOf( 'netfront' ) !=-1) || navigator.appName == 'Blazer' ) ) {return 'NetFront 3+';}  
    if((sUA.indexOf( 'msie' ) + 1 ) && window.ActiveXObject ) {return 'Pocket Internet Explorer'; }  
    return "Unknown";  
}  
/*字符串转日期格式，strDate要转为日期格式的字符串*/
function getDate(strDate){
  var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, 
   function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
  return date;
}
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}
$(function(){
	//免费课程关闭
	$("body").on("click","#close_div_free",function(){
		$(".class_free_categoryId").remove();
	});
	$("body").on("click",".freeclass_con li",function(){
        var index = $(this).hasClass("onselect");
		if(index == true){
			return;
		}else{
			$(this).addClass("onselect");
		}
		$(this).siblings().removeClass("onselect");
    });
    $("body").on("click","#freeclassBtn a",function(){
    	$(this).html("加载中...");
		var btn = $(".freeclass_con li").hasClass("onselect");
		var url = "";
		if(btn == true){
			$(".freeclass_con").find("li").each(function(){
				 if($(this).hasClass("onselect")){
				 	  url = $(this).find("a").data("url")+"?pid="+$(this).find("a").data("id");
				 }
			});
			window.open("/tp"+"/"+url);
			$(".class_free_categoryId").remove();
			$(this).html("开始体验");
		}else{
			$(this).html("开始体验");
			tpLoading("请选择类目.",1);
			return false;
		}
	});
	
	
	
	//按回车登陆注册
	$(document).keydown(function(e){
		if(e.keyCode == 13){
           var open = $(".tpui-overlay-proxy").data("open");	
           if("register" == open){
           	   register($(".register"));
           }else if("login" == open){
           	   login($("#login"));
           }
		}
	});
	
	//登陆检查 并且加载头部信息
	var id = $.cookie("id");
	var username = $.cookie("nick");
	var account = $.cookie("userName");
	var isAdmin = $.cookie("typeStatus");
	if(isNotEmpty(username) && isNotEmpty(account) && isNotEmpty(id)){
		if(isNotEmpty(isAdmin) && isAdmin != 0){
			$("#org").show();
		}else{
			$("#org").hide();
		}
		$.ajax({
			url:"/tp/json/tpFront/login/loadUser",
			data:{"id":id,"account":account},
			dataType:"json",
			success:function(data){
				if(data.result != "fail"){
					$("#userName").html(data.result.userName);
			        if(isNotEmpty(data.result.icon)){
			        	$(".user-img").attr("src",getPhotoUrl(data.result.icon,100).min);
			        }else{
			        	$(".user-img").attr("src","/tp/static/images/global/touxiang.jpg");
			        }
			        if("1" == data.result.type){
			        	$("#org").attr("href","/tpManager/category/categoryManager");
			        }else if("2" == data.result.type || "3" == data.result.type){
			        	$("#org").attr("href","/tpManager/customerAndQQManager");
			        }else if("4" == data.result.type){
			        	$("#org").attr("href","/tpManager/transfer/orderTransferManager");
			        }else if("5" == data.result.type){
			        	$("#org").attr("href","/tpManager/ppdai/listPpdaiDetail");
			        }else{
			        	$("#org").hide();
			        }
				}
	   		}
	  });
	  $("#tp_loginsuccess").show();
	  $("#tp_loginreg").hide();
	  $("#shopping").show();
	}else{
	   $("#tp_loginsuccess").hide();
	   $("#tp_loginreg").show();
	}
});

function weixin(){
	 window.location = "https://open.weixin.qq.com/connect/qrconnect?appid=wx12dc6d9ac84db8fc&redirect_uri=http://www.tanzhouedu.com/tp/weixin&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
}
function qq(){
	window.location = "http://openapi.qzone.qq.com/oauth/show?which=ConfirmPage&display=pc&client_id=101207099&response_type=code&scope=all&redirect_uri=http://www.tanzhouedu.com/tp/qq";
}
/*弹出登陆*/
function tp_login_dialog(obj){
	var broswer = tp_getBroswerVersion().version;
    if(broswer=="ie_7" || broswer=="ie_8" || broswer=="ie_6"){
    	tpLoading("您的浏览器版本过低,请升级您的浏览器。",2);
    	return false;
    }
    $(".tpui-overlay-proxy").remove();
    $("#loginbox").remove();
	$("body").append("<div id='loginbox' style='position:fixed;z-index:100' class='l_c clearfix upfly_in'>");
	var contnet = "";
	var flag = "";
	if("register" == $(obj).data("open")){
		 flag = "register";
		 content = "<div class='register_content'>"+
				   "<div class='newlogin'>"+
     			   "<div class='newlogin_content'>"+
          		   "<div class='newlogin_title margin_b22'>"+
                   "<span><a href='javascript:void(0);' data-open='login' onclick='tp_login_dialog(this);'>登录</a></span>"+
                   "<span>|</span>"+
                   "<span class='oncurrent'><a href='javascript:void(0);' onclick='tp_login_dialog(this);' data-open='register'>注册</a></span>"+
                   "<div class='close_div transition'><a href='javascript:void(0);' class='main_icon'></a></div>"+
                   "</div>"+
		           "<!--正常状态-->"+
		           "<div class='newlogin_box margin_b22 bor_gray clearfix' id='regAccountBox'>"+
                   "<div class='newlogin_icon'><i class='main_icon account_login'></i></div>"+
                   "<input type='text' class='textbox' id='regAccount' placeholder='输入账号'>"+
                   "<div class='error_prompt' style='display:none;'>"+
                   "<div class='error_prompt_box borlight_red color_red bglight_red'></div>"+
                   "<i class='main_icon error_prompt_red'></i>"+
                   "</div>"+
		           "</div>"+
		           "<!--正常状态-->"+
		           "<div class='newlogin_box margin_b22 bor_gray clearfix' id='regUsernameBox'>"+
	               "<div class='newlogin_icon'><i class='main_icon username_icon'></i></div>"+
	               "<input type='text' class='textbox' id='regUsername' placeholder='请输入昵称'>"+
	               "<div class='error_prompt' style='display:none;'>"+
                   "<div class='error_prompt_box borlight_red color_red bglight_red'></div>"+
                   "<i class='main_icon error_prompt_red'></i>"+
                   "</div>"+ 
		           "</div>"+
		           "<!--正常状态-->"+
		           "<div class='newlogin_box margin_b22 bor_gray clearfix' id='regPasswordBox'>"+
	               "<div class='newlogin_icon'><i class='main_icon password_icon'></i></div>"+
	               "<input type='password' class='textbox' id='regPassword' placeholder='请输入密码'>"+
	               "<div class='error_prompt' style='display:none;'>"+
                   "<div class='error_prompt_box borlight_red color_red bglight_red'></div>"+
                   "<i class='main_icon error_prompt_red'></i>"+
                   "</div>"+
		           "</div>"+
		           "<!--正常状态-->"+     
		           "<div class='newlogin_box margin_b22 bor_gray clearfix' id='regConPasswordBox'>"+
	               "<div class='newlogin_icon'><i class='main_icon password_icon'></i></div>"+
	               "<input type='password' class='textbox' id='regConPassword' placeholder='请输入确认密码'>"+
	               "<div class='error_prompt' style='display:none;'>"+
                   "<div class='error_prompt_box borlight_red color_red bglight_red'></div>"+
                   "<i class='main_icon error_prompt_red'></i>"+
                   "</div>"+
		           "</div>"+
		           "<div class='newlogin_box margin_b22 clearfix' id='regCodeBox'>"+
              	   "<div class='verify_box bor_gray fl clearfix'>"+
                   "<div class='newlogin_icon'><i class='main_icon verify_icon'></i></div>"+
                   "<input type='text' class='textbox1' id='regCode' maxlength='5' placeholder='请输入验证码'>"+
                   "<div class='error_prompt' style='display:none;'>"+
				   "<div class='error_prompt_box borlight_red color_red bglight_red'></div>"+
				   "<i class='main_icon error_prompt_red'></i>"+
                   "</div>"+
	               "</div>"+
	               "<div class='verify_img bor_gray fr'><a href='javascript:void(0);'><img onclick='changeImg(this);' id='image' src='/tp/rand/code' width='125'></a></div>"+
		           "</div>"+
		           "<input type='button' class='login_btn loginbtn_bg transition register' onclick='register(this);' value='立即注册'>"+
		           "<div class='prompt'><span class='color_gray'>——  注册登录潭州教育后，即您已同意用户使用条款  ——</span></div>"+
		           "<div class='quick_login clearfix none'>"+
                   "<a href='javascript:void(0);' class='login_qq fl'><i class='main_icon'></i><span>QQ快捷登录</span></a>"+
                   "<a href='javascript:void(0);' class='login_wx fr'><i class='main_icon'></i><span>微信快捷登录</span></a>"+
         		   "</div></div></div></div>";
	}else{
		flag = "login";
		content = "<div class='login_content'>"+
    			  "<div class='newlogin'>"+
         		  "<div class='newlogin_content'>"+
                  "<div class='newlogin_title margin_b22'>"+
                  "<span class='oncurrent'><a href='javascript:void(0);' data-open='login' onclick='tp_login_dialog(this);'>登录</a></span>"+
                  "<span>|</span>"+
                  "<span><a href='javascript:void(0);' onclick='tp_login_dialog(this)' data-open='register'>注册</a></span>"+
                  "<div class='close_div transition'><a href='javascript:void(0);' class='main_icon'></a></div>"+
              	  "</div>"+
                  "<!--正常状态-->"+
                  "<div class='newlogin_box margin_b22 bor_gray clearfix' id='logAccountBox'>"+
                  "<div class='newlogin_icon'><i class='main_icon account_login'></i></div>"+
                  "<input type='text' class='textbox' id='logAccount' placeholder='输入账号'>"+
                  "<div class='error_prompt' style='display:none;'>"+
                  "<div class='error_prompt_box borlight_red color_red bglight_red'></div>"+
                  "<i class='main_icon error_prompt_red'></i>"+
                  "</div>"+
              	  "</div>"+
                  "<div class='newlogin_box margin_b22 bor_gray clearfix' id='logPasswordBox'>"+
                  "<div class='newlogin_icon'><i class='main_icon password_icon'></i></div>"+
                  "<input type='password' class='textbox' id='logPassword' placeholder='请输入密码'>"+
                  "<div class='error_prompt' style='display:none;'>"+
                  "<div class='error_prompt_box borlight_red color_red bglight_red'></div>"+
                  "<i class='main_icon error_prompt_red'></i>"+
                  "</div>"+
                  "</div>"+
                  "<!--默认状态下验证码框隐藏，密码输入错误3次后弹出验证码框-->"+
                  "<div class='newlogin_box margin_b22 bor_gray clearfix' id='logCodeBox' style='display:none;'>"+
                  "<div class='newlogin_icon'><i class='main_icon verify_icon'></i></div>"+
                  "<input type='text' class='textbox' id='logCode' maxlength='5' placeholder='请输入验证码'>"+
                  "<!--光标移到验证码框，弹出验证码层-->"+
                  "<div class='verify_code'>"+
                  "<div class='verify_box1 clearfix'><a href='javascript:void(0);'><img id='image' onclick='changeImg(this);' src='/tp/rand/code'/></a></div>"+
                  "<i class='main_icon verify_gray'></i>"+
                  "</div>"+
                  "</div>"+
                  "<input type='button' class='login_btn loginbtn_bg transition' id='login' onclick='login(this);' value='登录'>"+
                  "<div class='choose'><span class='n_color_gray'>注：登录后，即您已同意用户使用条款</span><a href='/tp/retrieve/fillBasic'>忘记密码？</a><a>|</a></div>"+
                  "<div class='quick_login clearfix'>"+
                  "<a href='javascript:void(0);' onclick='qq();' class='login_qq transition fl'><i class='main_icon'></i><span>QQ快捷登录</span></a>"+
                  "<a href='javascript:void(0);' onclick='weixin();' class='login_wx transition fr'><i class='main_icon'></i><span>微信快捷登录</span></a>"+
                  "</div></div></div></div>";
	}
	$(".pop_login").hide();//关闭首页底部弹出的登陆注册导航
	$("#loginbox").html(content);
	$("body").append("<div class='tpui-overlay-proxy' data-open="+flag+"></div>");
	tp_center_dialog($("#loginbox"));
	$(window).resize(function(){
		tp_center_dialog($("#loginbox"));
	});
	$("#loginbox").find(".close_div").click(function(){
		$("#loginbox").removeClass("upfly_in").addClass("upfly_out").fadeOut("slow",function(){
			$(this).next().remove();
			$(this).remove();
		});
	});
};

//加载免费体验课弹出层
function loadFree(){
	var freeContent = sessionStorage.getItem("freeContent");
	if(isEmpty(freeContent)){
		$.tpAjax.request({
			url:basePath+"/json/tpFront/freeLectures/loadFreePop",
			callback:function(data){
				var data = eval("("+data+")");
				var categoryContent = "";
				$.each(data.result,function(i,item){
					categoryContent += "<li><a href='javascript:void(0);' data-id="+item.id+" data-url="+item.url+"><img src='/tp/static/images/freeLectures/freepic"+(i+1)+".jpg' alt=''></a><i class='main_icon'></i></li>";
				});
				var  content = "<div class='class_free_categoryId'>"+
					  "<div class='freeclass bor_radius'>"+
	    			  "<a href='javascript:void(0);' class='close_div_free' id='close_div_free'><i class='main_icon'></i></a>"+
	    		      "<div id='freeclass'>"+
	                  "<div class='freeclass_title'>"+
	            	  "<i></i>"+
	           		  "<span class='color_gray'>梦想的起点，需要你的选择！</span>"+
	                  "<i></i></div> <div class='freeclass_con clearfix'>"+
	                  "<ul>"+categoryContent+
	                  "</ul>"+
	                  "</div> <div class='freeclass_btn' id='freeclassBtn'>"+
			          "<a href='javascript:void(0);' class='startBtn'>开始体验</a>"+
	                  "</div></div></div></div>";
	           sessionStorage.setItem("freeContent",content); 
	           $("body").append(content);
			}
	   });
	}else{
	  $("body").append(freeContent);
	}
	
}

/*用户退出*/
function tp_logout(){
	$.tmDialog.confirm({title:"您确定退出吗",height:"180px",content:"真的要离开了吗?",callback:function(ok){
		if(ok){
			$.ajax({
				type:"post",
				url:"/tp/json/tpFront/login/logout",
				success:function(data){
					$("#tp_loginreg").show();
					$("#tp_loginsuccess").hide();
					window.location = "/";
				}
			});
		}
	}});
};

function tp_center_dialog($dialog){
	var windowWidth = $(window).width();
	var windowHeight = document.body.clientHeight;
	var left = (windowWidth-390)/2;
	var top =  (windowHeight-460)/2;
	$dialog.css({left:left,top:400});
};

function changeImg(obj){
	$(obj).attr("src","/tp/rand/code?data="+Math.random());
}

//header js
$(function(){
	//Course Dropdown list js
	$(".allcourse").mouseenter(function(){
		$(this).find(".headdownlist").animate({ top: 54},300).css("display","block");
	});
	$(".allcourse").mouseleave(function(){
		$(this).find(".headdownlist").animate({ top: 32},300).css("display","none");
	});
	
	$(".personinfor").mouseenter(function(){
		$(this).find(".headdownlist").animate({ top: 54},300).css("display","block");
	});
	$(".personinfor").mouseleave(function(){
		$(this).find(".headdownlist").animate({ top: 32},300).css("display","none");
	});
	
	//search js
	$(".homesearch_box").focus(function(){
		$(this).next(".homesearch_tag").hide();
	});	
	$(".homesearch_box").blur(function(){
		var content =  $(this).val();
		if(content== null || content == "" || content == "undefined"){
			$(this).next(".homesearch_tag").show();
		}else{
			$(this).next(".homesearch_tag").hide();
		}
	});
});

$(function(){
	//账号得到焦点
	$("body").on("focus","#regAccount",function(){
		$(this).parent(".newlogin_box").addClass("bor_green").removeClass("bor_gray borlight_red");
	});
	//账号失去焦点
	$("body").on("blur","#regAccount",function(){
		var account = $(this).val();
		if(isEmpty(account)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("请输入用户帐号.");
			return;
		}
		if(!account.match(/^[A-Za-z0-9]{6,15}$/)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("6-15位字符，支持字母、数字.");
			return;
		}
		account_validator(account);//检测账号是否被注册
	});
	
	//昵称得到焦点
	$("body").on("focus","#regUsername",function(){
		$(this).parent(".newlogin_box").addClass("bor_green").removeClass("bor_gray borlight_red");
	});
	//昵称失去焦点
	$("body").on("blur","#regUsername",function(){
		var username = $(this).val();
		if(isEmpty(username)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("请输入昵称.");
			return;
		}
		if(username.length < 2 || username.length > 15){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("2-15位字符，支持汉字、字母、数字、特殊符号.");
			return;
		}
		$(this).parent(".newlogin_box").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
	});
	
	//密码得到焦点
	$("body").on("focus","#regPassword",function(){
		$(this).parent(".newlogin_box").addClass("bor_green").removeClass("bor_gray borlight_red");
	});
	//密码失去焦点
	$("body").on("blur","#regPassword",function(){
		var password = $(this).val();
		var conPassword = $("#regConPassword").val();
		if(isEmpty(password)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("请输入密码.");
			return;
		}
		if(!password.match(/^[A-Za-z0-9\S]{6,50}$/)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("6-50位字符，建议由字母，数字和符号两种以上组合.");
			return;
		}
		$(this).parent(".newlogin_box").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
		if(isNotEmpty(conPassword)){
			if(conPassword != password){
				$("#regConPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
				.find(".error_prompt").show().find(".error_prompt_box").html("两次密码输入不一致.");
				return;
			}
			$("#regConPasswordBox").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
		}
	});
	
	//确认密码得到焦点
	$("body").on("focus","#regConPassword",function(){
		$(this).parent(".newlogin_box").addClass("bor_green").removeClass("bor_gray borlight_red");
	});
	//确认密码失去焦点
	$("body").on("blur","#regConPassword",function(){
		var password = $("#regPassword").val();
		var conPassword = $(this).val();
		if(isEmpty(conPassword)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("请输入确认密码.");
			return;
		}
		if(!conPassword.match(/^[A-Za-z0-9\S]{6,50}$/)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("密码需在6-50位字符之间.");
			return;
		}
		$(this).parent(".newlogin_box").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
		if(isNotEmpty(password)){
			if(conPassword != password){
				$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
				.find(".error_prompt").show().find(".error_prompt_box").html("两次密码输入不一致.");
				return;
			}
			$(this).parent(".newlogin_box").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
		}
	});
	
	//验证码得到焦点
	$("body").on("focus","#regCode",function(){
		$(this).parents(".newlogin_box").find(".verify_box").addClass("bor_green").removeClass("bor_gray bor_red");
	});
	//验证码失去焦点
	$("body").on("blur","#regCode",function(){
		var code = $(this).val();
		if(isEmpty(code)){
			$(this).parents(".newlogin_box").find(".verify_box").addClass("bor_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("请输入验证码.");
			return;
		}
		$(this).parents(".newlogin_box").find(".verify_box").addClass("bor_gray").removeClass("bor_red bor_green").find(".error_prompt").hide();
	});
});

var registerTime = null;//防止连续点击.
//注册
function register(obj){
   var account = $("#regAccount").val();
   var username = $("#regUsername").val();
   var password = $("#regPassword").val();
   var code = $("#regCode").val();
   if(!validator())return;
   $(obj).val("请稍后,正在注册...");
   $(obj).removeAttr("onclick");
   password = b64_md5(password);/*MD5加密*/
   clearTimeout(registerTime);//如果不到200毫秒则清空
   registerTime = setTimeout(function() {//每过200毫秒 提交一次
		$.ajax({
			type : "post",
			url : "/tp/json/tpFront/register/register",
			error:function(){
				clearTimeout(registerTime);
				tpLoading("remove");
				$(obj).val("立即注册");
				$(obj).attr("onclick","register($('.register'))");
			},
			data : {
				"username":username,
				"password" : password,
				"account":account,
				"regCode":code,
			},
			success : function(data) {
				var data = eval("("+data+")");
				clearTimeout(registerTime)
				$(obj).val("立即注册");
				$(obj).attr("onclick","register($('.register'))");
				tpLoading("remove");
				if ("success" == data.result) {
					 tpLoading("注册成功.",1);
					 window.location='/';
				}else if("fail" == data.result){
					if("account_is_null" == data.errorCode){
						$("#regAccount").focus();
   	   					$("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	   					.find(".error_prompt").show().find(".error_prompt_box").html("请输入用户帐号.");
					}else if("account_exist_error" == data.errorCode){
						$("#regAccount").select();
						$("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
				        .find(".error_prompt").show().find(".error_prompt_box").html("该用户帐号已被使用.");
					}else if("account_format_error" == data.errorCode){
						$("#regAccount").select();
						$("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	   					.find(".error_prompt").show().find(".error_prompt_box").html("6-15位字符，支持字母、数字.");
					}else if("valid_code_is_null" == data.errorCode){
						$("#regCode").focus();
						$("#regCodeBox").find(".verify_box").addClass("bor_red").removeClass("bor_gray bor_green")
	  					.find(".error_prompt").show().find(".error_prompt_box").html("请输入验证码.");
					}else if("valid_code_error" == data.errorCode){
						$("#regCode").select();
						$("#image").attr("src","/tp/rand/code?date="+Math.random());
						$("#regCodeBox").find(".verify_box").addClass("bor_red").removeClass("bor_gray bor_green")
	  					.find(".error_prompt").show().find(".error_prompt_box").html("输入验证码错误.");
					}
				}
			}
		});
	}, 200);
}

//注册验证
function validator() {
   var account = $("#regAccount").val();
   var username = $("#regUsername").val();
   var password = $("#regPassword").val();
   var conPassword = $("#regConPassword").val();
   var code = $("#regCode").val();
   
   if(isEmpty(account)){
   	   $("#regAccount").focus();
   	   $("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	   .find(".error_prompt").show().find(".error_prompt_box").html("请输入用户帐号.");
	   return false;
   }
   if(!account.match(/^[A-Za-z0-9]{6,15}$/)){
   	   $("#regAccount").select();
	   $("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	   .find(".error_prompt").show().find(".error_prompt_box").html("6-15位字符，支持字母、数字.");
	   return false;
   }
   
   if(isEmpty(username)){
   	  $("#regUsername").focus();
	  $("#regUsernameBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	  .find(".error_prompt").show().find(".error_prompt_box").html("请输入昵称.");
	  return false;
   }
   if(username.length < 2 || username.length > 15){
      $("#regUsername").select();
	  $("#regUsernameBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	  .find(".error_prompt").show().find(".error_prompt_box").html("2-15位字符，支持汉字、字母、数字、特殊符号.");
	  return false;
  }
  
  if(isEmpty(password)){
  	 $("#regPassword").focus();
	 $("#regPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	 .find(".error_prompt").show().find(".error_prompt_box").html("请输入密码.");
	 return false;
  }
  if(!password.match(/^[A-Za-z0-9\S]{6,50}$/)){
  	 $("#regPassword").select();
	 $("#regPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	 .find(".error_prompt").show().find(".error_prompt_box").html("6-50位字符，建议由字母，数字和符号两种以上组合.");
	 return false;
  }
	
  if(isEmpty(conPassword)){
  	 $("#regConPassword").focus();
	 $("#regConPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	 .find(".error_prompt").show().find(".error_prompt_box").html("请输入确认密码.");
	 return false;
  }
  if(!conPassword.match(/^[A-Za-z0-9\S]{6,50}$/)){
  	 $("#regConPassword").select();
	 $("#regConPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	 .find(".error_prompt").show().find(".error_prompt_box").html("密码需在6-15位字符之间.");
	 return false;
  }
  if(conPassword != conPassword){
  	 $("#regConPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
	 .find(".error_prompt").show().find(".error_prompt_box").html("两次密码输入不一致.");
	 return false;
  }
  
  if(isEmpty(code)){
  	  $("#regCode").focus();
	  $("#regCodeBox").find(".verify_box").addClass("bor_red").removeClass("bor_gray bor_green")
	  .find(".error_prompt").show().find(".error_prompt_box").html("请输入验证码.");
	  return false;
   }
   return true;
}

/*验证账号是否存在*/
function account_validator(account){
	$.ajax({
		type : "post",
		url : "/tp/json/tpFront/register/validatorAccount",
		data : {"account" : account},
		success:function(data){
			var data = eval("("+data+")");
			if("fail" == data.result){
			   if("account_is_null" == data.errorCode){
				 	$("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
				 	.find(".error_prompt").show().find(".error_prompt_box").html("请输入用户帐号.");
			   }else if("account_exist_error" == data.errorCode){
			   	   $("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
				   .find(".error_prompt").show().find(".error_prompt_box").html("该用户帐号已被使用.");
			   }else if("account_format_error" == data.errorCode){
			   	   $("#regAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
				   .find(".error_prompt").show().find(".error_prompt_box").html("6-15位字符，支持字母、数字.");
			   }
			}else if("success" == data.result){
				$("#regAccountBox").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
			}
		}
	});
}

$(function(){
	//账号得到焦点
	$("body").on("focus","#logAccount",function(){
		$(this).parent(".newlogin_box").addClass("bor_green").removeClass("bor_gray borlight_red");
	});
	//账号失去焦点
	$("body").on("blur","#logAccount",function(){
		var account = $(this).val();
		if(isEmpty(account)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("请输入用户帐号.");
			return;
		}
		if(!account.match(/^[A-Za-z0-9]{6,15}$/)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("6-15位字符，支持字母、数字.");
			return;
		}
		$(this).parent(".newlogin_box").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
	});
	
	//密码得到焦点
	$("body").on("focus","#logPassword",function(){
		$(this).parent(".newlogin_box").addClass("bor_green").removeClass("bor_gray borlight_red");
	});
	//密码失去焦点
	$("body").on("blur","#logPassword",function(){
		var password = $(this).val();
		if(isEmpty(password)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("请输入密码.");
			return;
		}
		if(!password.match(/^[A-Za-z0-9\S]{6,50}$/)){
			$(this).parent(".newlogin_box").addClass("borlight_red").removeClass("bor_gray bor_green")
			.find(".error_prompt").show().find(".error_prompt_box").html("6-50位字符，建议由字母，数字和符号两种以上组合.");
			return;
		}
		$(this).parent(".newlogin_box").addClass("bor_gray").removeClass("borlight_red bor_green").find(".error_prompt").hide();
	});
	
	//验证码得到焦点
	$("body").on("focus","#logCode",function(){
		$(this).parent(".newlogin_box").addClass("bor_green").removeClass("bor_gray borlight_red");
	});
	//验证码失去焦点
	$("body").on("blur","#logCode",function(){
		$(this).parent(".newlogin_box").addClass("bor_gray").removeClass("borlight_red bor_green");
	});
});

//登陆
var loginTime = null;
function login(obj){
	var account = $("#logAccount").val();
	var password = $("#logPassword").val();
	var code = $("#logCode").val();
	var display = $("#logCodeBox").css("display");
	if(isEmpty(account)){
		$("#logAccount").focus();
		$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
		.find(".error_prompt").show().find(".error_prompt_box").html("请输入用户帐号.");
		return;
	}
	if(!account.match(/^[A-Za-z0-9]{6,15}$/)){
		$("#logAccount").select();
		$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
		.find(".error_prompt").show().find(".error_prompt_box").html("6-15位字符，支持字母、数字.");
		return;
	}
	if(isEmpty(password)){
		$("#logPassword").focus();
		$("#logPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
		.find(".error_prompt").show().find(".error_prompt_box").html("请输入密码.");
		return;
	}
	if(!password.match(/^[A-Za-z0-9\S]{6,50}$/)){
		$("#logPassword").select();
		$("#logPasswordBox").addClass("borlight_red").removeClass("bor_gray bor_green")
		.find(".error_prompt").show().find(".error_prompt_box").html("6-50位字符，建议由字母，数字和符号两种以上组合.");
		return;
	}
	if(display == "block" && isEmpty(code)){
		$("#logCode").focus();
		$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
		.find(".error_prompt").show().find(".error_prompt_box").html("请输入验证码.");
		return;
	}
	$(obj).val("请稍后,正在登录...");
    $(obj).removeAttr("onclick");
    password = b64_md5(password);/*MD5加密*/
	clearTimeout(loginTime);	
	loginTime =  setTimeout(function(){
		 $.ajax({
				type : "post",
				url : "/tp/json/tpFront/login/ajaxLogin",
				data : {
					"account" :  account,
					"password" : password,
					"code" : code,
				},
				error:function(){
					clearTimeout(loginTime);
					tpLoading("remove");
					$(obj).val("登录");
					$(obj).attr("onclick","login($('#login'))");	
				},
				success : function(data) {
					var data = eval("("+data+")");
					clearTimeout(loginTime);
					if ("success" == data.result) {
						 location.reload();
					}else if("fail" == data.result){
						tpLoading("remove");
						$(obj).val("登录");
						$(obj).attr("onclick","login($('#login'))");
						if("user_not_exist" == data.errorCode){
							$("#logAccount").focus();
							changeImg($("#image"));//更换验证码
							$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
							.find(".error_prompt").show().find(".error_prompt_box").html("账户名和密码不匹配，请重新输入.");
						}else if("param_is_null" == data.errorCode){
							$("#logAccount").focus();
							$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
							.find(".error_prompt").show().find(".error_prompt_box").html("用户名或密码不能为空.");
						}else if("param_too_length" == data.errorCode){
							$("#logAccount").focus();
							$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
							.find(".error_prompt").show().find(".error_prompt_box").html("6-15位字符，支持字母、数字");
						}else if("valid_code_is_null" == data.errorCode){
							$("#logCode").focus();
							$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
							.find(".error_prompt").show().find(".error_prompt_box").html("请输入验证码.");
						}else if("valid_code_error" == data.errorCode){
							$("#logCode").select();
							changeImg($("#image"));//更换验证码
							$("#logAccountBox").addClass("borlight_red").removeClass("bor_gray bor_green")
							.find(".error_prompt").show().find(".error_prompt_box").html("验证码不正确或验证码已过期.");
						}else if("valid_code_show" == data.errorCode){
							$("#logCodeBox").show();
						}
					}
				}
			});
	 }, 200);
}
//bannernav js
$(function(){
	setTimeout(function(){
		$(".home_ad").slideUp(300);
	},60000);
	
	$(".home_ad").click(function(){
		$(this).slideUp(300);
	});
    //bannav_nav js
	$('.bannav_content').hover(function(){
		$(this).children(".current_nav").removeClass("current_nav").addClass("current_navon").children(".updown").css("display","none");
		$(this).children(".bannav_pop").show();
    },function(){
		$(this).children(".current_navon").removeClass("current_navon").addClass("current_nav").children(".updown").css("display","block");
		$(this).children(".bannav_pop").hide();
	});	
	
	//banner_img js
	var length=$(".banner_img .btn ul li").length;
		var a=0;
		var timestat;
		start();
		function start(){
				timestat=setInterval(function(){
				a++
				if(a>=length) a=0;
				$(".banner_img .btn ul li").eq(a).addClass("sel").siblings().removeClass("sel");
				$(".centend").hide().eq(a).animate({opacity: 0.6},100).fadeTo(600,1);
			},4000);
		};
		$(".banner_img .btn ul li").hover(function(){
				if(timestat)clearInterval(timestat);
				a=$(this).index();
				$(".centend").hide().eq(a).animate({opacity: 0.6},100).fadeTo(600,1);
				$(this).addClass("sel").siblings().removeClass("sel");
		},function(){
			start();
	});	
	
	$(".contenttitle_nav li").click(function(){
		$(this).addClass("oncurrent").siblings().removeClass("oncurrent");
		var index = $(this).index();
		var $parent = $(this).parents(".content_title");
		$parent.children("a.more_course").eq(index).fadeIn(200).siblings("a").hide();
		$parent.nextAll("div:lt(3)").hide().filter(":eq("+index+")").fadeIn(200);
	});
	
	//ad
	$(".home_ad a").click(function(){
		$(".home_ad").slideUp(300);
	});
	
	 var userId=$.cookie("id");
	 if(isEmpty(userId)){
		$(window).on("load",function(){
			$(".pop_login").slideDown(400);
		})
		$(".popclose").click(function(){
			$(".pop_login").slideUp(200);
		})
	 }
});	

$('#IT_div li').click(function(){
		$("#"+this.id).addClass("oncurrent").siblings().removeClass("oncurrent");
		var index = $(this).index();
		$("#IT_div li").each(function(index2) {
            if(index2 == index){
			  $(".more_course").eq(index2).fadeIn(200);
			  $(".connr").eq(index2).fadeIn(200);
			}else{
			  $(".more_course").eq(index2).hide();
			  $(".connr").eq(index2).hide();
			}
        });		
    });	
    
//课程、学员风采、师资力量 图片轮换 js
$(function(){
	$("body").on("click",".dvshow li",function(){
		$(this).addClass("oncurrent").siblings().removeClass("oncurrent");
		var index = $(this).index();
		var pindex=$(this).parents(".cstBox").index();
		 if(index==0){
		 	$(this).parents(".clearfix").find(".more_ke").eq(0).fadeIn(200);
		 	$(this).parents(".clearfix").find(".more_ke").eq(1).hide();
		 	$(this).parents(".clearfix").find(".more_ke").eq(2).hide();
			 $(".cstBox").eq(pindex+index+1).fadeIn(200);
			 $(".cstBox").eq(pindex+index+2).hide();
	    	 $(".cstBox").eq(pindex+index+3).hide();
		 }else if(index==1){
		 	$(this).parents(".clearfix").find(".more_ke").eq(1).fadeIn(200);
		 	$(this).parents(".clearfix").find(".more_ke").eq(0).hide();
		 	$(this).parents(".clearfix").find(".more_ke").eq(2).hide();
		 	$(".cstBox").eq(pindex+index+1).fadeIn(200);
			 $(".cstBox").eq(pindex+index).hide();
	    	 $(".cstBox").eq(pindex+index+2).hide();
		 }else{
		 	$(this).parents(".clearfix").find(".more_ke").eq(2).fadeIn(200);
		 	$(this).parents(".clearfix").find(".more_ke").eq(0).hide();
		 	$(this).parents(".clearfix").find(".more_ke").eq(1).hide();
		 	$(".cstBox").eq(pindex+index+1).fadeIn(200);
			 $(".cstBox").eq(pindex+index).hide();
	    	 $(".cstBox").eq(pindex+index-1).hide();
		 }
		  photoLazyload();
     });
 });	