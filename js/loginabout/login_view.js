var reg = {
	email:/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
    pwd:/^[0-9a-zA-Z\,\.]{6,15}$/,
    phone:/^1[0-9]{10}$/
};

var show_status = '';
//记录邮箱
var register_mail;
var register_tm =  '<div class="login_box" id="register_box">'+
			      '<a class="be_photoer_register" href="/iamphotog">立刻成为摄影师</a>'+
			      '<div class="login_contet">'+
			        '<h1 class="regist_logo"></h1>'+
			        '<ul class="login_third_login">'+
			          '<span class="login_third_title"><h6 class="third_title_h6">使用社交帐号注册</h6></span>'+
			          '<li><a class="login_qq" href="https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101164290&redirect_uri=http://paiwo.co/login/qq&state=zzz"></a></li>'+
			          '<li><a class="login_xinlang" href="https://api.weibo.com/oauth2/authorize?client_id=2197733404&redirect_uri=http://paiwo.co/login/weibo"></a></li>'+
                      '<li><a class="login_weixin" href="https://open.weixin.qq.com/connect/qrconnect?appid=wxd804e40c6e964035&redirect_uri=http://paiwo.co/login/weixin&response_type=code&scope=snsapi_login#wechat_redirect"></a></li>'+
			        '</ul>'+
			        '<ul class="login_inputs inputs">'+
			          '<span class="login_inputs_title"><h6 class="inputs_title_h6">使用邮箱注册</h6></span>'+
			          '<li class="inputs_email">'+
			           ' <input class="email" type="email" id="r_email" placeholder="邮箱账号">'+
			            '<em class="email_error_em" id="r_email_err">邮箱格式错误！</em>'+
			           ' <i class="email_error_icon"></i>'+
			         ' </li>'+
			          '<li class="password_div">'+
			            '<input class="password" type="password" id="r_pwd" placeholder="密码">'+
			            '<em class="password_error_em" id="r_pwd_err">密码错误！</em>'+
			            '<i class="password_error_icon"></i>'+
			          '</li>'+
			          '<li class="ver_code">'+
			            '<input class="vcode" type="text" id="verify" placeholder="验证码">'+
			            '<em class="verify_error_em" id="r_verify_err">验证码错误！</em>'+
			            '<img id="r_image"/>'+
						'<i class="verify_error_icon"></i>'+
			          '</li>'+
			         ' <a class="login_botton" href="" id="r_btn">注册</a>'+
			       ' </ul>'+
			     ' <p class="my-font">我已阅读并同意 <a class="agreement" target="_blank" href="/protocol">拍我网用户服务协议</a> </p>'+
			      '<a class="go_login">已有账号？马上登录»</a>'+
			      '</div>'+
			    '</div>';

var login_tm =  '<div class="register_box"  id="login_box">'+
                 '<h1 class="loginbox_h1_text">最具格调的自由摄影师平台 － 免费为您推荐自由摄影师</h1>'+
		        '<h1 class="loginbox_logo"></h1>'+
				'<span class="login_white_line"><p>使用社交帐号登录</p></span>'+
		        '<ul class="login_third_login">'+
		          '<span class="login_third_title"><h6 class="third_title_h6">使用社交帐号注册</h6></span>'+
		          '<li><a class="login_qq" href="https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101164290&redirect_uri=http://paiwo.co/login/qq&state=zzz"></a></li>'+
		          '<li><a class="login_xinlang" href="https://api.weibo.com/oauth2/authorize?client_id=2197733404&redirect_uri=http://paiwo.co/login/weibo"></a></li>'+
                  '<li><a class="login_weixin" href="https://open.weixin.qq.com/connect/qrconnect?appid=wxd804e40c6e964035&redirect_uri=http://paiwo.co/login/weixin&response_type=code&scope=snsapi_login#wechat_redirect"></a></li>'+
		        '</ul>'+
		        '<ul class="inputs">'+
		          '<li class="inputs_email">'+
		            '<input class="email" type="text" placeholder="邮箱账号" id="login_email">'+
		           ' <em class="email_error_em" id="login_error_email">邮箱格式错误！</em>'+
		            '<i class="email_error_icon"></i>'+
		          '</li>'+
		          '<li class="password_div">'+
		            '<input class="password" type="password" placeholder="密码" id="login_pwd">'+
		            '<em class="password_error_em" id="login_error_pwd">密码错误！</em>'+
		            '<i class="password_error_icon"></i>'+
		          '</li>'+
		          '<a class="login_botton" href="" id="login_b">登录</a>'+
		        '</ul>'+
				'<div class="bottom_text">'+
		         '<a class="forget">忘记密码</a>&nbsp&nbsp&nbsp <a class="go_register">没有账号？去注册»</a>'+
				'</div>'+
				'<a class="be_photoer" href="/iamphotog">立刻成为摄影师</a>'
		    '</div>';

var mailbox_tm = '<div id="mailbox">'+
			'<i class="mail_close"></i>'+
			'<h3>验证邮箱</h3>'+
			'<p><span class="mail-span">${mail}</span></p>'+
			'<a class="mail-btn" href="${mailurl}" target="_blank">进入邮箱</a>'+
			'<div class="mailbox-line"></div>'+
		'<p>没有收到验证邮件？</p>'+
		'<p>建议您检查邮件垃圾箱</p>'+
		'<p id="resend_p"><a class="mail-url" href="" id="resend_mail">重新发送验证邮件</a></p>'+
		'<p>若仍未收到，<a class="mail-url" href="javascript:void(0);" onclick="window.location.reload(false);">请更换另一个邮箱地址注册</a></p>'+
	'</div>';
var forget_tm =     '<div id="forgetbox" class="forgetbox">'+
 					  '<i class="forgetbox_i"></i>'+
					  '<i class="forgetbox_return" id="forget_back"></i>'+
                     '<ul class="forgetbox_ul login_inputs inputs">'+
			          '<h3 class="forget-title">找回密码</h3>'+
			          '<li class="inputs_email">'+
			           ' <input class="forget_email" type="email" id="r_email" placeholder="邮箱账号">'+
			            '<em class="email_error_em" id="r_email_err">邮箱格式错误！</em>'+
			           ' <i class="email_error_icon"></i>'+
			         ' </li>'+
			          '<li class="ver_code">'+
			            '<input class="forget_vcode" type="text" id="verify" placeholder="验证码">'+
			            '<em class="verify_error_em" id="r_verify_err">验证码错误！</em>'+
			            '<img id="f_image"/>'+
						'<i class="verify_error_icon"></i>'+
			          '</li>'+
			         ' <a class="login_botton" href="" id="reset_email">下一步</a>'+
			       ' </ul>'+
			       '</div>';

var resetbox_tm = '<div id="mailbox">'+
					'<i class="forgetbox_i"></i>'+
					'<h3>验证邮箱</h3>'+
			'<p><span class="mail-span">${mail}'+
			'<a class="mail-btn" href="${mailurl}" target="_blank">进入邮箱</a>'+
			'<div class="mailbox-line"></div>'+
		'<ul class="bp_compelet_ul">'+
          '<li>没有收到验证邮件？</li>'+
          '<li>建议您检查邮件垃圾箱</li>'+
          '<li id="resend_p"><a id="resend_setmail">重新发送验证邮件</a></li>'+
          '<li>若仍未收到，请联系客服<a href="mailto:help@paiwo.co">help@paiwo.co</a></li>'+
       ' </ul>'+
	'</div>';			       
var is_first = 1;
//常用的邮箱
var EMAIL_MAP = {
    'qq.com': 'http://mail.qq.com/',
    'gmail.com': 'http://mail.google.com/',
    'sina.com': 'http://mail.sina.com.cn/',
    '163.com': 'http://mail.163.com/',
    '126.com': 'http://mail.126.com/',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.coom': 'http://www.foxmail.com/'
}
//显示注册框
function showregister(){
	if(is_first == 0){
		is_first = 1;
		var t = $('#register_box');
		t.show();
		$("#r_image").attr("src", "/a/captcha/register?v=" + Math.random());
		return;
	}else{
		$("#r_image").attr("src", "/a/captcha/register?v=" + Math.random());
		$('#register_box').fadeIn(400);
   }
}

//显示登陆框
function showlogin(flag){
	if(is_first == 0){
		is_first = 1;
		var t = $('#login_box');
   		t.show();
		return;
	}else{
        $('#login_box').fadeIn(400);
    }

}

//显示邮件接收框
function showmailaddress(mail){
	 var mail_addr = mail.split('@')[1];
     var m = EMAIL_MAP[mail_addr] || 'http://mail.'+mail_addr;
 	 var data = {'mail':mail,'mailurl':m};
 	clearRegister();
 	 var t = $('#mailbox');
 	 t.find('.mail-span').html(mail);
 	 t.find('.mail-btn').attr('href', m);
 	 $('#mailbox').fadeIn(400);
}

//显示忘记密码框
function showforget(){
   if(is_first == 0){
   		is_first =1;
        $('.forgetbox').show();
		$("#f_image").attr("src", "/a/captcha/password?v=" + Math.random());
	}else{
        $('#forgetbox').fadeIn(400);
        $("#f_image").attr("src", "/a/captcha/password?v=" + Math.random());
	}
}

//显示忘记密码发送邮件后的信息
function showforget2(mail){
	 var mail_addr = mail.split('@')[1];
     var m = EMAIL_MAP[mail_addr] || 'http://mail.'+mail_addr;
 	 var data = {'mail':mail,'mailurl':m};
 	 clearForget();
 	 var t = $('#mailbox2');
 	 t.find('.mail-span').html(mail);
 	 t.find('.mail-btn').attr('href', m);
 	 $('#mailbox2').fadeIn(400);
}

var setM;
function showMessage(str){
  clearTimeout(setM);
	$('.setting_succeed').html(str).animate({top: 0}, 400, function(){
		setM = setTimeout(hideMessage, 1800);
    });
}
function hideMessage(){
	$('.setting_succeed').animate({top: -40}, 400);
}



