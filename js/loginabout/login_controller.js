$(function(){	
	var content = $('#content_box');
	var login_box = $('#login_box');
	var register_box = $('#register_box');
	//登陆-->注册
	content.on('click', '#t_register', function(event) {
		window.history.pushState({}, '', 'register.html');
            clearAll();
			showregister();	
	 });
	 //登陆-->忘记密码
	content.on('click', '#t_forget', function(event) {
        window.history.pushState({}, '', 'password.html');
            clearAll();
			showforget();
	 });
    //注册-->登陆
	content.on('click', '#t_login', function(event) {
        window.history.pushState({}, '', 'login.html');
            clearAll();
            showlogin();
	 });
	//从忘记密码-->为登陆
	 content.on('click', '#forget_back,#forget_close,#forget_close2', function(event) {
         $('#forgetbox2 input').val('');
         window.history.pushState({}, '', 'login.html');
           clearAll();
           showlogin();
	 });
	
	//从忘记密码验证 -->登陆
	content.on('click', '#forget_verify_close', function(event) {
	    window.history.pushState({}, '', 'login.html');
           clearAll();
           showlogin();
	 });
	//从注册验证 -->登陆
	content.on('click', '#register_close', function(event) {
	      window.history.pushState({}, '', 'login.html');        
           clearAll();
           showlogin();
	 });
	
	window.onpopstate = hash_check;
	
	/****************以上是页面跳转相关*******************/
	
	
	 //登陆失去焦点时判断
	var set1;
	content.on('input propertychange','#login_email',function(){
		clearTimeout(set1);
		set1 = setTimeout(loginE, 1200);	
     });
	function loginE(){
	  var email = document.getElementById('login_email').value;
		if(email.length==0){
			hideError('#login_error_email');
			return;
		}

		if(check_val(email,'email')|| reg.phone.test(email)){	
			hideError('#login_error_email');
		}else{
			showError('#login_error_email','账号格式错误');
		}	
	}
	
	
	var set2;
	content.on('input propertychange','#login_pwd',function() {
		clearTimeout(set2);
		set2 = setTimeout(loginP, 1200);
     });
	function loginP(){
		var pwd = document.getElementById('login_pwd').value;
		if(pwd.length==0){
			hideError('#login_error_pwd');
			return;
		}
		if(check_val(pwd,'pwd')){
			hideError('#login_error_pwd');
		}else{
			showError('#login_error_pwd','请输入6-15位字符的密码');
		}
	}
	
	 
	//点击登陆  
	content.on('click', '#login_b', function(event) {
	 	event.preventDefault();
	 	login();
	 });
	
	
	
	/****************以上是登陆相关*******************/
	
	
	


   var set3; 
    content.on('input propertychange', '#r_email', function(event) {
			//clearTimeout(set3);
           var val = $('#r_email').val().trim();
           if(checkPhoneOrEmail(val) == 0){
              //showError('#r_error_email','格式错误');
              $('.ver_code').hide();
              regis_info.type = 0;
           }else if(checkPhoneOrEmail(val) == 2){
                //eamil  
               $('#r_phone').hide();
               $('#r_image').show();
               $('.ver_code').show();
               regis_info.type = 2;
                hideError('#r_error_email');
           }else{
           		//phone
           		$('#r_image').hide();
           		$('#r_phone').show();
           	    $('.ver_code').show();
           	    regis_info.type = 1;
           	     hideError('#r_error_email');
           };
	 });
	
	var set4;
	content.on('input propertychange', '#r_pwd', function(event) {
		clearTimeout(set4);
		set4 = setTimeout(is_rPwd, 1200);
	 });
	
	var set5;
	
	 //点击注册
	content.on('click','#register_b',function(event){
		event.preventDefault();
	   if(regis_info.type == 2){
			//邮箱
			   register_submit();
	   }else if(regis_info.type == 1){

		var phone = $('#r_email').val().trim();

			if(checkPhoneE(phone)){
				if($('#r_verify').val().length == 6){
					register_phone_end();
				}else{
					showError('#r_error_verify', '验证码为6位');
				}
			}

	   }else{
			showError('#r_error_email','请输入手机号码/邮箱');
	   }
		//register_submit();
		return false;
	 }); 
	
	
	/****************以上是注册相关*******************/
	
	var set6;
	//忘记密码时候的邮箱验证
	content.on('blur', '#f_email', function(event) {
		clearTimeout(set6);
//		set6 = setTimeout(is_rEmail2, 700);
        is_rEmail3();
	 });
	
	
	var set7;
	content.on('input propertychange', '#f_verify', function(event) {
	 	clearTimeout(set6);
		set6 = setTimeout(is_rVerify2, 1200);
	 });

	
     //注册页 点击验证码变化验证码图片
	content.on('click', '#r_image', function() {
     	$("#r_image").attr("src", "/a/captcha/register?v=" + Math.random());
     });
    $('#r2_image').on('click', function() {
     	$("#r2_image").attr("src", "/a/captcha/register?v=" + Math.random());
     });
    $('#r3_image').on('click', function(){
    	$("#r3_image").attr("src", "/a/captcha/password?v=" + Math.random());
    });

	content.on('click', '#f_image', function() {
     	$("#f_image").attr("src", "/a/captcha/password?v=" + Math.random());
     });
	
	
     //重新发送验证邮件 
	content.on('click','#resend_mail',function(event){
		event.preventDefault();
		re_send();
		return false;
	 });
	
	
	
     //发送重置密码邮件
	content.on('click', '#reset_email', function(event) {
     	event.preventDefault();
        resetEmail();

     });
     //重新发送重置密码邮件
	content.on('click', '#resend_setmail', function(event) {
		event.preventDefault();
		resetEmailTime();
		return false;
     });

	//验证邮箱关闭按钮
	content.on('click','#verify',function(){
		$('#mailbox').hide();
	 	window.location.hash = '/login';
	 });

	
	 //初始化函数
	 function init(){
		 hash_check();	
	 }

	 init();

	 //手机验证码相关
     $('#r_phone').on('click', function(){
     	if($(this).hasClass('ver-code-none')){
     		return;
     	}

     	var phone = $('#r_email').val().trim();
     	if(checkPhoneE(phone)){
	     	 $('#phone-1').fadeIn(400);
	         $('#r2_image').trigger('click');
	         $('#register_code_b').addClass('phone-defined-forbid');
	         $('#r_phone_code').val('');
            $('#phone-1 .verify_error_icon').hide();
            $('#phone-1 .verify_error_em').hide();
     	 }

     });

    
     $('#phone_close,#phone_close2').on('click', function(){
          $('.phone-defined').hide();
     });

     $('#r_phone_code').on('input propertychange', function(){
     	if(this.value.length == 4){
     		$('#register_code_b').removeClass('phone-defined-forbid');
     	}else{
     		$('#register_code_b').addClass('phone-defined-forbid');
     	}

     });

     $('#f_phone_code').on('input propertychange', function(){
 		if(this.value.length == 4){
     		$('#forget_code_b').removeClass('phone-defined-forbid');
     	}else{
     		$('#forget_code_b').addClass('phone-defined-forbid');
     	}
     });



     $('#register_code_b').on('click', function(){
     		var t = $('#register_code_b');
     		if(	t.hasClass('phone-defined-forbid')){
     				//不能

     		}else{
				var phone  = $('#r_email').val().trim();
				var pwd = $('#r_pwd').val().trim();
				var verify = $('#r_phone_code').val().trim();
				register_phone(phone, verify);
     		}
      });

      $('.forget-way').eq(1).on('click', function(){
      		//切换手机找回密码
      		$('#forgetbox').hide()
      		$('#forgetbox2').fadeIn(400);
            $('#forgetbox2 input').val('');
      });

      $('.forget-way').eq(0).on('click', function(){
       		//切换邮箱找回密码
       		$('#forgetbox2').hide()
      		$('#forgetbox').fadeIn(400);

      });

      $('#f_phone').on('click', function(){
          if($(this).hasClass('ver-code-none')){
                return;
          }
          
          var val = $('#forgetbox2 .forget_email').val();
          if(!reg.phone.test(val)){
            if(val == ''){
                showError('#f_error_phone','手机不能为空');
            }else{
                 showError('#f_error_phone','手机格式错误');
            }
            return;
          }
          var flag;
           $.ajax({
        async: false,
		url: '/rest',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify({
				phone: val,
				method: 'paiwo.account.register.phone_check'})
        },
        success: function(data){
            flag = data.response.is_exist
        }
	});
          if(!flag){
              showError('#f_error_phone','手机未注册');
              return;
          }
          	hideError('#f_error_phone');
     
     	    $('#phone-2').show();
            $('#r3_image').trigger('click');
            $('#forget_code_b').addClass('phone-defined-forbid');
            $('#f_phone_code').val('');
            $('#phone-2 .verify_error_em').hide();
      });

      $('#forget_code_b').on('click', function(){
      	if($(this).hasClass('phone-defined-forbid')){
      		return ;
      	}
          forgetGetCode();
      });
    
      $('#f_phone_end').on('click', function(e){
          e.preventDefault();
          var t = $('#forgetbox2 .forget_email');
          var val = t.eq(0).val();
          if(!reg.phone.test(val)){
            if(val == ''){
                showError('#f_error_phone','手机不能为空');
            }else{
                 showError('#f_error_phone','手机格式错误');
            }
            return;
          }
          var flag;
           $.ajax({
                async: false,
                url: '/rest',
                type: 'POST',
                dataType: 'json',
                data: {
                        data: JSON.stringify({
                            phone: val,
                            method: 'paiwo.account.register.phone_check'})
                },
                success: function(data){
                    flag = data.response.is_exist
                }
	             });
          if(!flag){
              showError('#f_error_phone','手机未注册');
              return;
          }
          
        var p1 = t.eq(1).val();
        var p2 = t.eq(2).val();
          
        if(!p1){
            showError('#f_error_pwd', '请输入密码');
            return;
        }
        if(!reg.pwd.test(p1)){
            showError('#f_error_pwd', '请输入6-15位字符的密码');
            return;
        }
                   
        if(!p2){
            showError('#f_error_pwd2', '请输入密码');
            return;
        }
        if(!reg.pwd.test(p2)){
             showError('#f_error_pwd2', '请输入6-15位字符的密码');
            return;
        }   
        if(p1 != p2){
             showError('#f_error_pwd2', '两次密码不一致');
        }    
         phone_find_end(val,p1, p2);   
          
            //fogetSent();
      });
    
    $('#forget_close3').on('click', function(){
        $('.box_password').hide();
        window.history.pushState({}, '', '/login');        
           clearAll();
           showlogin(); 
    });
}); //主要的ready函数





var is_first = 0;
//路径判断
function hash_check(){
        
    var hash = window.location.pathname;
	if('/register' == hash){
		    //注册页面
			clearAll();
			showregister();	
	}else if('/password' == hash){
			//忘记密码
            clearAll();
			showforget();
	}else{
			//显示登陆
            clearAll();
            showlogin();
    }		
}

 //首页加载效果
function indexLoad(oImgBg,oCont){
	if(oImgBg.complete){//img.complete判断图片是否加载完毕
		oCont.animate({opacity:0.4},200,'linear',function(){
			oCont.css('backgroundImage','url('+oImgBg.src+')');
			oCont.animate({opacity:1},500,'linear');
		});
		
	}else{
		$(oImgBg).on('load',function(){
			oCont.animate({opacity:0.4},200,'linear',function(){
				oCont.css('backgroundImage','url('+oImgBg.src+')');
				oCont.animate({opacity:1},500,'linear');
			});
		});
	};
}
		
var lBox = $('#login_box');
var oCont = $('#background'); 
var oImgBgUrl = 'images/register_bac.jpg';
var oImgBg = new Image();
oImgBg.src = oImgBgUrl;
indexLoad(oImgBg,oCont);
	
//键盘登录
$(document).on('keydown',function(event){
	//window.location.pathname获取对象指定的文件名或路径
	if(window.location.pathname=='/login' ||window.location.pathname==''){
		if(event.keyCode ==13){
			login();
			return false;
		}
	}
});

//IE6兼容处理
if(window.navigator.userAgent.indexOf('MSIE 6.0')!=-1){
	$('#login_box').css({'background':'#ad929a'});
}