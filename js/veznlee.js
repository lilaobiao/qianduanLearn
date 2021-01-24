;(function(){
	var jsUtil = {
		name:"jsUtil",
		getName:function(){
			return this.name;
		},
		addfn:function(str,fn){
			this[str] = fn;
		}
	};

	jsUtil.addfn("randomColor",function(){
		//0-255	
		var r = random(255).toString(16);
		var g = random(255).toString(16);
		var b = random(255).toString(16);
		//255的数字转换成十六进制
		if(r.length<2)r = "0"+r;
		if(g.length<2)g = "0"+g;
		if(b.length<2)b = "0"+b;
		return "#"+r+g+b;
	});

	jsUtil.addfn("randomNum",function(num){
		return Math.floor(Math.random()*(num+1));
	});

	jsUtil.addfn("randomAtoB",function(start,end){
		return Math.floor(Math.random()*(end-start+1))+start;
	});

})();
