var canvas = document.getElementById("cas");
var ctx = canvas.getContext("2d");
var ocas = document.createElement("canvas");
var octx = ocas.getContext("2d");
ocas.width = canvas.width = window.innerWidth;
ocas.height = canvas.height = window.innerHeight;
var bigbooms = [];
window.onload = function(){
	initAnimate()
}
function initAnimate(){
	drawBg();
	lastTime = new Date();
	animate();
}

var lastTime;
function animate(){
	ctx.save();//暂时将当前的状态保存到堆中
	ctx.globalCompositeOperation = 'destination-out';
	//globalCompositeOperation 属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上。 destination-out在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
	ctx.globalAlpha = 0.1;
	//globalAlpha 属性设置或返回绘图的当前透明值（alpha 或 transparency）。globalAlpha 属性值必须是介于 0.0（完全透明） 与 1.0（不透明） 之间的数字。
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();//将上一个保存的状态从堆中再次取出，恢复该状态的所有设置。

	var newTime = new Date();
	if(newTime-lastTime>200+(window.innerHeight-767)/2){
		var random = Math.random()*100>2?true:false;
		//爆炸范围
		var x = getRandom(canvas.width/5 , canvas.width*4/5);
		var y = getRandom(50 , 200);
		if(random){
			//制造发射点，x轴在1/3 - 2/3之间
			var bigboom = new Boom(getRandom(canvas.width/3,canvas.width*2/3) ,2,"#FFF" , {x:x , y:y});
			bigbooms.push(bigboom)
		}
		else {
			//显示文字
			var bigboom = new Boom(getRandom(canvas.width/3,canvas.width*2/3) ,2,"#FFF" , {x:canvas.width/2 , y:200} , document.querySelectorAll(".shape")[parseInt(getRandom(0, document.querySelectorAll(".shape").length))]);
			bigbooms.push(bigboom)
		}
		lastTime = newTime;
	}

	stars.foreach(function(){
		this.paint();
	})
	drawMoon();

	bigbooms.foreach(function(index){
		var that = this;
		//发射点如果没死，则移动
		if(!this.dead){
			this._move();
			//绘制发散光
			this._drawLight();
		}
		//发射点如果死了，则爆炸
		else{
			this.booms.foreach(function(index){
				//爆炸点如果没死，则移动
				if(!this.dead) {
					this.moveTo(index);
				}
				//爆炸点如果死了，则消失
				else if(index === that.booms.length-1){
					bigbooms.splice(bigbooms.indexOf(that) , 1);
				}
			})
		}
	});
	//循环动画
	raf(animate);
}


//绘制月亮
function drawMoon(){
	var moon = document.getElementById("moon");
	//月亮位置和直径
	var centerX = canvas.width-200 , centerY = 100 , width = 80;
	if(moon.complete){
		//context.drawImage(img,x,y,width,height);
		ctx.drawImage(moon , centerX , centerY , width , width )
	}
	else {
		moon.onload = function(){
			ctx.drawImage(moon ,centerX , centerY , width , width)
		}
	}
	var index = 0;
	//绘制月亮的外发光
	for(var i=0;i<10;i++){
		ctx.save();
		ctx.beginPath();
		ctx.arc(centerX+width/2 , centerY+width/2 , width/2+index , 0 , 2*Math.PI);
		ctx.fillStyle="rgba(240,219,120,0.005)";
		index+=2;
		ctx.fill();
		ctx.restore();
	}
	
}

Array.prototype.foreach = function(callback){
	for(var i=0;i<this.length;i++){
		if(this[i]!==null) callback.apply(this[i] , [i])
	}
}

var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };

canvas.onclick = function(){
	var x = event.clientX;
	var y = event.clientY;
	var bigboom = new Boom(getRandom(canvas.width/3,canvas.width*2/3) ,2,"#FFF" , {x:x , y:y});
	bigbooms.push(bigboom)
}

var Boom = function(x,r,c,boomArea,shape){//x轴,半径，颜色，爆炸范围，是否文字
	this.booms = [];
	this.x = x;
	this.y = (canvas.height+r);
	this.r = r;
	this.c = c;
	this.shape = shape || false;
	this.boomArea = boomArea;
	this.theta = 0;
	this.dead = false;
	this.ba = parseInt(getRandom(80 , 200));
	
	//添加爆炸音乐
	var audio = document.getElementsByTagName("audio");
	for(var i=0;i<audio.length;i++){
		if(audio[i].src.indexOf("shotfire")>=0&&(audio[i].paused||audio[i].ended)){
			audio[i].play();
			break;
		}
	}
}
Boom.prototype = {
	_paint:function(){
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fillStyle = this.c;
		ctx.fill();
		ctx.restore();
	},
	_move:function(){
		//var Boom = function(x,r,c,boomArea,shape) x轴,半径，颜色，爆炸范围，是否文字this.y = (canvas.height+r);
		//dx:x轴移动的距离 dy：y轴移动的距离
		var dx = this.boomArea.x - this.x , dy = this.boomArea.y - this.y;
		this.x = this.x+dx*0.01;
		this.y = this.y+dy*0.01;

		if(Math.abs(dx)<=this.ba && Math.abs(dy)<=this.ba){
			if(this.shape){
				this._shapBoom();
			}
			else this._boom();
			this.dead = true;
		}
		else {
			this._paint();
		}
	},
	_drawLight:function(){
		ctx.save();
		ctx.fillStyle = "rgba(255,228,150,0.3)";
		ctx.beginPath();
		ctx.arc(this.x , this.y , this.r+3*Math.random()+1 , 0 , 2*Math.PI);
		ctx.fill();
		ctx.restore();
	},
	_boom:function(){
		var fragNum = getRandom(100 , 300);
		var style = getRandom(0,10)>=5? 1 : 2;
		var color;
		if(style===1){
			color = {
				a:parseInt(getRandom(128,255)),
				b:parseInt(getRandom(128,255)),
				c:parseInt(getRandom(128,255))
			}
		}
		//范围100-300
		var fanwei = fragNum;
		var audio = document.getElementsByTagName("audio");
		//播放音乐
		for(var i=0;i<audio.length;i++){
			if(audio[i].src.indexOf("boom")>=0&&(audio[i].paused||audio[i].ended)){
				audio[i].play();
				break;
			}
		}
		for(var i=0;i<fragNum;i++){
			if(style===2){
				color = {
					a:parseInt(getRandom(128,255)),
					b:parseInt(getRandom(128,255)),
					c:parseInt(getRandom(128,255))
				}
			}
			var a = getRandom(-Math.PI, Math.PI);
			var x = getRandom(0, fanwei) * Math.cos(a) + this.x;
			var y = getRandom(0, fanwei) * Math.sin(a) + this.y; 
			var radius = getRandom(0 , 2)
			//x轴，y轴，半径，颜色，爆炸范围x，爆炸范围y
			var frag = new Frag(this.x , this.y , radius , color , x , y );
			this.booms.push(frag);
		}
	},
	_shapBoom:function(){
		var that = this;
		putValue(ocas , octx , this.shape , 5, function(dots){
			var dx = canvas.width/2-that.x;
			var dy = canvas.height/2-that.y;
			for(var i=0;i<dots.length;i++){
				color = {a:dots[i].a,b:dots[i].b,c:dots[i].c}
				var x = dots[i].x;
				var y = dots[i].y;
				var radius = 1;
				var frag = new Frag(that.x , that.y , radius , color , x-dx , y-dy);
				that.booms.push(frag);
			}
		})
	}
}
/*
var canvas = document.getElementById("cas");
var ctx = canvas.getContext("2d");
var ocas = document.createElement("canvas");
var octx = ocas.getContext("2d");*/
function putValue(canvas , context , ele , dr , callback){
	context.clearRect(0,0,canvas.width,canvas.height);
	var img = new Image();
	if(ele.innerHTML.indexOf("img")>=0){
		img.src = ele.getElementsByTagName("img")[0].src;
		imgload(img , function(){
			context.drawImage(img , canvas.width/2 - img.width/2 , canvas.height/2 - img.width/2);
			//context.drawImage(img,x,y);在画布上定位图像
			dots = getimgData(canvas , context , dr);
			callback(dots);
		})
	}
	else {
		var text = ele.innerHTML;
		context.save();
		var fontSize =200;
		context.font = fontSize+"px 宋体 bold";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "rgba("+parseInt(getRandom(128,255))+","+parseInt(getRandom(128,255))+","+parseInt(getRandom(128,255))+" , 1)";
		context.fillText(text , canvas.width/2 , canvas.height/2);
		context.restore();
		dots = getimgData(canvas , context , dr);
		callback(dots);
	}
}

function imgload(img , callback){
	if(img.complete){
		callback.call(img);
	}
	else {
		img.onload = function(){
			callback.call(this);
		}
	}
}

function getimgData(canvas , context , dr){
	var imgData = context.getImageData(0,0,canvas.width , canvas.height);
	//getImageData(x,y,width,height) 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。
	context.clearRect(0,0,canvas.width , canvas.height);
	var dots = [];
	for(var x=0;x<imgData.width;x+=dr){
		for(var y=0;y<imgData.height;y+=dr){
			var i = (y*imgData.width + x)*4;
			if(imgData.data[i+3] > 128){
				var dot = {x:x , y:y , a:imgData.data[i] , b:imgData.data[i+1] , c:imgData.data[i+2]};
				dots.push(dot);
			}
		}
	}
	return dots;
}

function getRandom(a , b){//获取a到b之间的随机数
	return Math.random()*(b-a)+a;
}




//随机绘制100个最大半径为1的小圆点
var maxRadius = 1 , stars=[];
function drawBg(){
	for(var i=0;i<100;i++){
		var r = Math.random()*maxRadius;//小圆点半径
		var x = Math.random()*canvas.width;//小圆点x  0<=x<=width
		var y = Math.random()*2*canvas.height - canvas.height;//小圆点y -height <= y <= height
		var star = new Star(x , y , r);
		stars.push(star);
		star.paint()//绘制小圆点
	}
}

var Star = function(x,y,r){
	this.x = x;this.y=y;this.r=r;
}
Star.prototype = {
	paint:function(){
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x , this.y , this.r , 0 , 2*Math.PI);
		ctx.fillStyle = "rgba(255,255,255,"+this.r+")";
		ctx.fill();
		ctx.restore();
	}
}


//绘制点的移动
var focallength = 250;
var Frag = function(centerX , centerY , radius , color ,tx , ty){
	this.tx = tx;
	this.ty = ty;
	this.x = centerX;
	this.y = centerY;
	this.dead = false;
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
	this.color = color;
}

Frag.prototype = {
	paint:function(){
		// ctx.beginPath();
		// ctx.arc(this.x , this.y , this.radius , 0 , 2*Math.PI);
		ctx.fillStyle = "rgba("+this.color.a+","+this.color.b+","+this.color.c+",1)";
		ctx.fillRect(this.x-this.radius , this.y-this.radius , this.radius*2 , this.radius*2)
	},
	moveTo:function(index){
		this.ty = this.ty+0.3;
		var dx = this.tx - this.x , dy = this.ty - this.y;
		this.x = Math.abs(dx)<0.1 ? this.tx : (this.x+dx*0.1);
		this.y = Math.abs(dy)<0.1 ? this.ty : (this.y+dy*0.1);
		if(dx===0 && Math.abs(dy)<=80){
			this.dead = true;
		}
		this.paint();
	}
}