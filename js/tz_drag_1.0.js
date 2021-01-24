/*
	案例:层的拖拽
	知识点：
		position,鼠标的事件(mousedown,mousemove,mouseup),e.clientX .e.clientY,
		获取一个元素的offsetLeft和offsetTop坐标位置
	改变的元素:left ,top的位置
*/

(function(){
	var winDom =  document.getElementsByClassName("window")[0];
	var x ,y,x1,y1,l,t,mark = false;//关灯

	winDom.addEventListener("mousedown",function(e){
		//鼠标第一次点击的坐标位置
		x = e.clientX;
		y = e.clientY;
		//元素所在的left和top位置
		l = this.offsetLeft;
		t = this.offsetTop;
		//绑定浏览器拖拽事件
		mark = true;//开灯
		document.addEventListener("mousemove",function(e){//睡觉
			if(mark){
				 //鼠标移动位置
				 x1 = e.clientX;
				 y1 = e.clientY;
				 var nl = x1 - x + l;
				 var nt = y1 - y + t;
				 winDom.style.left = nl+"px";
				 winDom.style.top = nt+"px";
			}
		},false);

		//鼠标松开的事件
		document.addEventListener("mouseup",function(){//睡着了
			mark = false;//关灯
			document.removeEventListner("mousemove");
		},false);
	});
	
})();