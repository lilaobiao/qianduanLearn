/*
 * 插件封装示范
 */
;(function($){
	$.fn.extend({
		"color":function(value){
			if(value == undifined){
				return this.css("color");
			}else{
				return this.css("color",value);
			}
		},
		"tableUI":function(options){
			options = $.extend({
				odd:"odd",
				even:"even",
				selected:"selected"
			},options);
			$("tbody>tr:odd",this).addClass(options.odd);//tr:odd指代所有奇数行，this指当前对象
			$("tbody>tr:even",this).addClass(options.even);
			$("tbody>tr",this).click(function(){
				var hasSelected = $(this).hasClass(options.selected);
				$(this)[hasSelected?"removeClass":"addClass"](options.selected).find(":checkbox").attr("checked",!hasSelected);
			});
			$("tbody>tr:has(:checked)",this).addClass(options.selected);
			return this;
		}
	});
})(jQuery);
//$(".aa").color();

(function($){
	$.extend({
		ltrim:function(text){
			return (text || "").replace(/^\s+/g,"");
		},
		rtrim:function(){
			return (text || "").replace(/\s+$/g,"");
		}
	})
})(jQuery);
//jQuery.ltrim("      hehehh");


//自定义选择器,between返回两个值之间的部分元素
(function($){
	$.extend(jQuery.expr[":"],{
		between:function(a,i,m){
			var tmp = m[3].split(",");//将M[3]以逗号分割，切成一个数组
			return tmp[0]-0 < i && i < tmp[1]-0;
		}
	})
})(jQuery);
//$(".aaa:between(2,5)").css("color","#f00");

