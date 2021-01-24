var navObj=null;
var As=document.getElementById('nav').getElementsByTagName('a');
navObj = As[0];
for(i=1;i<As.length;i++){
	if(window.location.href.indexOf(As[i].href)>=0)
	navObj=As[i];
}
navObj.id='nav_current';
