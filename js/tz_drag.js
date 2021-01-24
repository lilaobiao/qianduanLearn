/*
	案例:层的拖拽
	知识点：
		定位：position,
		鼠标的事件(mousedown,mousemove,mouseup),e.clientX .e.clientY,
		获取一个元素的offsetLeft和offsetTop坐标位置
		元素的宽度和高度:offsetWidth和offsetHeight
	改变的元素:left ,top的位置
	层级关系:z-index
*/
var  tzWindow = (function(){
	forbiddenSelect();
	Array.prototype.each = function(callback){
		var i=0,len = this.length;
		for(;i<len;i+=1){
			if(callback)callback(this[i],i);
		}
	};
	
	//获取数组里面最大的数字
	function maxArray(arr){
		return Math.max.apply({},arr) ;
	};
	
	//获取数组里面最小的数字
	function minArray(arr){
		return Math.min.apply({},arr) ;
	};

	return {
		//默认参数的设置
		defaults:{
			drag:true,
			width:600,
			height:360,
			title:"我是一个窗口"
		},
		////获取所有的窗口对象
		windoms :function(opts){
			var winDoms =  document.getElementsByClassName(opts.box);
			var winArr = Array.prototype.slice.call(winDoms);
			return winArr;
		},
		//窗口初始化的入口方法
		init:function(options){
			var opts = tzextend({},this.defaults,options);
			this.template(opts);//模板的初始化
			this.events(opts);//事件的初始化
			this.resize(opts);//窗口初始化
			if(opts.drag)this.drag(opts);//拖拽的初始化
			
		},
		template:function(opts){
			var html = "<div class='tzwindow' style='width:"+opts.width+"px;height:"+opts.height+"px'>"+
			"	<div class='title'>"+opts.title+"</div>"+
			"	<div class='buttons'>"+
			"		<a href='javascript:void(0);' class='max'>最大化</a>"+
			"		<a href='javascript:void(0);' class='close'>关闭</a>"+
			"	</div>"+
			//"<div><iframe src='"+opts.url+"'  style='position:absolute;top:0;left:0;width:100%;height:100%;'/></div>"+
			"<div class='resize br_resize'></div>"+
			"</div>";
			document.body.innerHTML += html;
		},
		//获取最大的层级
		getMaxZindex:function(opts){
			var windows = this.windoms(opts);
			var arr = [];
			windows.each(function(win){
				arr.push(win.style.zIndex);
			});
			return maxArray(arr);
		},
		//最大化和窗口改变事件
		events : function(opts){
			var $this = this;
			var windows = $this.windoms(opts);
			windows.each(function(win){
				var btndom = win.getElementsByClassName("buttons")[0];
				//最大化
				btndom.firstElementChild.onclick = function(){
					//获取窗口的最大宽度和最大高度
					var ww = window.innerWidth - 16;
					var wh = window.innerHeight- 16;
					//点击窗口之前缓存坐标位置和宽度和高度
					var tgg = this.dataset.params;
					//获取层级关于
					zIndex = $this.getMaxZindex(opts);
					zIndex++;
					//如果没有缓存坐标，代表点击是最大化
					if(!tgg){
						var html = "";
						html+= "left:"+win.offsetLeft+"px;";
						html+= "top:"+win.offsetTop+"px;";
						html+= "width:"+win.offsetWidth+"px;";
						html+= "height:"+win.offsetHeight+"px;";
						html+= "z-index:"+zIndex;
						//缓存坐标位置
						this.dataset.params  = html;
						win.style.left = "0px";
						win.style.top = "0px";
						win.style.zIndex = zIndex;
						win.style.width = ww+"px";
						win.style.height = wh+"px";
						this.innerText = "还原";
					}else{
						//缓存左边重新设置给窗口
						win.setAttribute("style",tgg);
						//缓存的数据情况
						this.dataset.params = "";
						//更改文件
						this.innerText = "最大化";
					}
				};


				//关闭
				btndom.lastElementChild.onclick = function(){
					//win.remove();
					document.body.removeChild(win);
				};


				//最小化
			});
		},
		//改变窗口事件
		resize:function(opts){
			var $this = this;
			//获取窗口对象
			var windows = $this.windoms(opts);
			windows.each(function(win){
				//窗口绑定事件
				win.onmousedown = function(e){
					var ev = e || window.event;
					//利用委托，获取目标元素
					var target = ev.target || ev.srcElement; 
					var className = target.className;
					//判断目标元素是不是拖动位置
					if(className.indexOf("br_resize")!=-1){
						win.cmark = false;	
						var x = ev.clientX ;//获取数据点击的x ,y位置
						var y = ev.clientY ;
						//获取窗口的宽度和高度
						var w = this.offsetWidth;
						var h = this.offsetHeight;
						//获取最大的层级数	
						zIndex = $this.getMaxZindex(opts);
						zIndex++;
						//更改层级关系
						win.style.zIndex = zIndex;
						//加锁
						win.cmark   = true;	
						//绑定document的移动事件
						document.addEventListener("mousemove",function(e){
							if(win.cmark){
								//更改元素的宽度和高度
								var nw = (e.clientX - x + w);
								var ny = (e.clientY - y + h);
								win.style.width = (nw<=200?200:nw)+"px";
								win.style.height = (ny<=200?200:ny)+"px"; 
							}
						},false);
						//释放元素
						document.addEventListener("mouseup",function(e){
							document.onmousemove = null;
							document.onmouseup = null;
							win.cmark = false;
						},false);
					}
					e.stopPropagation();
				}
			});
		},
		drag : function(opts){
			var windows = this.windoms(opts);
			//层级关系
			var zindex = 1;
			windows.each(function(win){
				var x ,y,x1,y1,l,t,mark = false;//关灯
				var ww = window.innerWidth;
				var wh = window.innerHeight;
				//获取窗口的title对象
				var titleDom = win.firstElementChild;
				//绑定title鼠标按下事件 
				titleDom.addEventListener("mousedown",function(e){
					//鼠标第一次点击的坐标位置
					x = e.clientX;
					y = e.clientY;
					//元素所在的left和top位置
					var pdom = this.parentElement;
					l = pdom.offsetLeft;
					t = pdom.offsetTop;
					//最大边界
					var maxW = ww - pdom.offsetWidth;
					var maxH = wh - pdom.offsetHeight;
					zindex++;
					pdom.style.zIndex = zindex;
					//绑定浏览器拖拽事件
					//var dragFlag = pdom.getAttribute("darg");
					//mark = dragFlag==null?true:false;
					mark = true;
					document.addEventListener("mousemove",function(e){//睡觉
						if(mark){
							 //鼠标移动位置
							 x1 = e.clientX;
							 y1 = e.clientY;
							 var nl = x1 - x + l;
							 var nt = y1 - y + t;
							 if(nl<=0)nl=1;
							 if(nt<=0)nt=1;
							 if(nl >=maxW)nl = maxW;
							 if(nt >=maxH)nt = maxH;
							 pdom.style.left = nl+"px";
							 pdom.style.top = nt+"px";
						}
					},false);

					//鼠标松开的事件
					document.addEventListener("mouseup",function(){//睡着了
						mark = false;//关灯
						document.onmousemove = null;
						document.onmouseup = null;
					},false);

					e.stopPropagation();
				});	
			});
		}
	};


	//tzWindow.init({url:"http://www.luoo.net",width:960,height:480,title:"keke老师房子",box:"tzwindow"});
	//tzWindow.init({title:"李明的房子",box:"tzwindow"});


	


	

})();

/*
	作用：对象参数的继承和覆盖
	用法: var opts = tzextend(target,json1,json2,json3....,mark);
	mark的默认值是:true.代表的是,后面具有相同属性值会进行合并/覆盖,
	如果false代表target对象里值追加
*/
function tzextend(target,source){
	//arguments是一个动态参数转换成一个数组
	var args = Array.prototype.slice.call(arguments);
	//删除最后一个元素并弹出
	var mark = typeof args[args.length-1] ==="boolean"?args.pop():true;
	var i = 1;
	if(args.length===1){
		i = -1;
	}
	//循环覆盖里面对象
	while((source = args[i++])){
		for(var key in source){
			if(mark  || !(callback in target)){
				target[key] = source[key];
			}
		}
	}
	return target;
};

/*讲对象转换成json字符串*/
function jsonToString(obj) {
	var THIS = this;
	switch (typeof (obj)) {
	case 'string':
		return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
	case 'array':
		return '[' + obj.map(THIS.jsonToString).join(',') + ']';
	case 'object':
		if (obj instanceof Array) {
			var strArr = [];
			var len = obj.length;
			for (var i = 0; i < len; i++) {
				strArr.push(THIS.jsonToString(obj[i]));
			}
			return '[' + strArr.join(',') + ']';
		} else if (obj == null) {
			return 'null';

		} else {
			var string = [];
			for ( var property in obj)
				string.push(THIS.jsonToString(property) + ':'
						+ THIS.jsonToString(obj[property]));
			return '{' + string.join(',') + '}';
		}
	case 'number':
		return obj;
	case false:
		return obj;
	}
};


/**
 * 禁止窗体选中
 */
function forbiddenSelect() {
	document.onselectstart = new Function("event.returnValue=false;");
}

/* 窗体允许选中 */
function autoSelect() {
	document.onselectstart = new Function("event.returnValue=true;");
};