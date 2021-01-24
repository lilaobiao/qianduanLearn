var tz_dialog = (function(){
	var tzdialog = {
		templete:function(sure,cancel){
			var bodyDom = document.body;
			var html =  "<div id='dialog' class=''>"+
			"	<div id='' class='title'>"+
			"		消息框"+
			"	</div>"+
			"	<div id='' class='content'>"+
			"		我是一个弹出层哦"+
			"	</div>"+
			"	<div id='' class='buttons'>"+
			"		<a href='javascript:void(0);' class='sure'>"+sure+"</a>"+
			"		<a href='javascript:void(0);' class='cancel'>"+cancel+"</a>"+
			"	</div>"+
			"</div>";
			bodyDom.innerHTML += html;
		},
		confirm:function(sure,cancel){
			this.templete(sure,cancel);
		},
		alert:function(sure,cancel){
			this.templete(sure,cancel);
			var dialogDom = document.getElementById("dialog");
			var buttonDom = dialogDom.getElementsByClassName("buttons")[0];
			var cancelDom = buttonDom.getElementsByClassName("cancel")[0];
			buttonDom.removeChild(cancelDom);
		}
	};
	return tzdialog;
})();