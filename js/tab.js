function Tab(style, scope){
this.oItem = this.getByClass(style, scope);
this.init();
}
Tab.prototype = {
init: function(){
  var that = this, menu, m;
  for(var i = 0, len = this.oItem.length; i < len; i++){
	menu = this.oItem[i].getElementsByTagName('li');
	for(var j = 0, mLen = menu.length; j < mLen; j++){
	  m = menu[j];
	  m.index = j;
	  m.onmouseover = function(){that.focus(this);}
	}
  }
},
focus: function(o){
  var par = o.parentNode.parentNode, panel = par.getElementsByTagName('div'), 
	btn = par.getElementsByTagName('li'), len = btn.length;
  for(var i = 0; i < len; i++){
	btn[i].className = '';
	panel[i].className = this.changeClass(panel[i].className, 'tab-none', true);
  }
  o.className = 'active';
  panel[o.index].className = this.changeClass(panel[o.index].className, 'tab-none', false);
},
changeClass: function(cl, cl2, add){
  var flag;
  if(cl.match(cl2) != null) flag = true;
  if(add ^ flag) return flag ? cl.replace(cl2, '') : cl += ' ' + cl2;
  return cl;
},
getByClass: function(cla, obj){
  var obj = obj || document, arr = [];
  if(document.getElementsByClassName){
	return document.getElementsByClassName(cla);
  } else {
	var all = obj.getElementsByTagName('*');
	for(var i = 0, len = all.length; i < len; i++){
	  if(all[i].className.match(cla) != null) arr.push(all[i]);
	}
	return arr;
  }
}
}