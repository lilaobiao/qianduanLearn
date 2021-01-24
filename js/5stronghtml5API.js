/*===========   1   =============
全屏API（Fullscreen API） 
该API允许开发者以编程方式将Web应用程序全屏运行，使Web应用程序更像本地应用程序。 
Javascript代码 找到适合浏览器的全屏方法  
==========================*/
function launchFullScreen(element) {  
  if(element.requestFullScreen) {  
    element.requestFullScreen();  
  } else if(element.mozRequestFullScreen) {  
    element.mozRequestFullScreen();  
  } else if(element.webkitRequestFullScreen) {  
    element.webkitRequestFullScreen();  
  }  
}  
// 启动全屏模式  
launchFullScreen(document.documentElement); // the whole page  
launchFullScreen(document.getElementById("videoElement")); // any individual element  


/*===========   2   =============
页面可见性API（Page Visibility API） 
该API可以用来检测页面对于用户的可见性，即返回用户当前浏览的页面或标签的状态变化。 
==========================*/
// 设置隐藏属性和可见改变事件的名称，属性需要加浏览器前缀  
// since some browsers only offer vendor-prefixed support  
var hidden, state, visibilityChange;   
if (typeof document.hidden !== "undefined") {  
  hidden = "hidden";  
  visibilityChange = "visibilitychange";  
  state = "visibilityState";  
} else if (typeof document.mozHidden !== "undefined") {  
  hidden = "mozHidden";  
  visibilityChange = "mozvisibilitychange";  
  state = "mozVisibilityState";  
} else if (typeof document.msHidden !== "undefined") {  
  hidden = "msHidden";  
  visibilityChange = "msvisibilitychange";  
  state = "msVisibilityState";  
} else if (typeof document.webkitHidden !== "undefined") {  
  hidden = "webkitHidden";  
  visibilityChange = "webkitvisibilitychange";  
  state = "webkitVisibilityState";  
}   
// 添加一个标题改变的监听器  
document.addEventListener(visibilityChange, function(e) {  
  // 开始或停止状态处理  
}, false);  


/*===========   3   =============
 getUserMedia API 
该API允许Web应用程序访问摄像头和麦克风，而无需使用插件。 
==========================*/
// 设置事件监听器  
window.addEventListener("DOMContentLoaded", function() {  
  // 获取元素  
  var canvas = document.getElementById("canvas"),  
    context = canvas.getContext("2d"),  
    video = document.getElementById("video"),  
    videoObj = { "video": true },  
    errBack = function(error) {  
      console.log("Video capture error: ", error.code);   
    };  
  
  // 设置video监听器  
  if(navigator.getUserMedia) { // Standard  
    navigator.getUserMedia(videoObj, function(stream) {  
      video.src = stream;  
      video.play();  
    }, errBack);  
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed  
    navigator.webkitGetUserMedia(videoObj, function(stream){  
      video.src = window.webkitURL.createObjectURL(stream);  
      video.play();  
    }, errBack);  
  }  
}, false);  


/*===========   4   =============
电池API（Battery API） 
这是一个针对移动设备应用程序的API，主要用于检测设备电池信息。 
==========================*/
var battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;  
// 电池属性  
console.warn("Battery charging: ", battery.charging); // true  
console.warn("Battery level: ", battery.level); // 0.58  
console.warn("Battery discharging time: ", battery.dischargingTime);  
// 添加事件监听器  
battery.addEventListener("chargingchange", function(e) {  
  console.warn("Battery charge change: ", battery.charging);  
}, false);  


/*===========   5   =============
Link Prefetching 
预加载网页内容，为浏览者提供一个平滑的浏览体验。 
==========================*/
//ull page
<link rel="prefetch" href="http://davidwalsh.name/css-enhancements-user-experience" />  
//just an image
<link rel="prefetch" href="http://davidwalsh.name/wp-content/themes/walshbook3/images/sprite.png" />  

