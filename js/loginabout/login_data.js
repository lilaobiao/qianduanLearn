// 登陆
function login(){
	var email = $('#login_email').val().trim();
	var pwd = $('#login_pwd').val().trim();
	if(!email){
		showError('#login_error_email','请输入账号');
		return;
	}
	if(!check_val(email,'email')&& !reg.phone.test(email)){
		showError('#login_error_email','账号格式错误');
		return false;
	}
	if(!pwd){
		showError('#login_error_pwd','请输入密码');
		return;
	}
	if(!check_val(pwd,'pwd')){
        showError('#login_error_pwd','请输入6-15位字符的密码');
		return false;
	}
	
	email = email.toLocaleLowerCase();
	pwd = $.md5("paiwo_" + pwd);

	if(!reg.phone.test(email)){
		$.ajax({
			 url: '/rest',
			 type: 'POST',
			 dataType: 'json',
			 data:{
					data:JSON.stringify({
						email: email,
						password: pwd,
						method: 'paiwo.account.login.email_login'})
				},
			success: function(data){
				if(data.error_id == 0){
					window.location.href="/";
					}else if(data.error_id == 100007){
							showError('#login_error_email',data.error_code);
					 }else{
						showError('#login_error_pwd',data.error_code);
						return false;
					}
				} 
		});

	}else{
		//手机登录
	    $.ajax({
         url: '/rest',
         type: 'POST',
         dataType: 'json',
         data:{
			data:JSON.stringify({
				phone: email,
				password: pwd,
				method: 'paiwo.account.login.phone_login'})
		},
        success: function(data){
            if(data.error_id == 0){
                window.location.href="/";
                }else if(data.error_id == 100007){
                        showError('#login_error_email',data.error_code);
                 }else{
                    showError('#login_error_pwd',data.error_code);
                    return false;
                }
            } 
		});
	}
	return false;	
}







//手机注册提交获取短信
function register_phone(phone, verify){
	$.ajax({ 
		type: "POST",
		url: "/rest",
		dataType: "json",
		data:{
			data: JSON.stringify({
				phone: phone,
				verify: verify,
				method: 'paiwo.account.register.phone_register_send_code'})
		},
		success: function(data){
		   if(data.error_id ==0){ 
			setPhotoTime(true);
			$('#phone_close').trigger('click');
		   }else{
			 $('#phone-1 .verify_error_em').html('验证码错误').show();
			 $('#r2_image').trigger('click');   
		   }
		}
	});
}
//完全提交
function register_phone_end(){
	var phone = $('#r_email').val().trim();
	var pwd = $('#r_pwd').val().trim();
	var verify = $('#r_verify').val().trim();
	$.ajax({ 
		type: "POST",
		url: "/rest",
		dataType: "json",
		data:{
			data: JSON.stringify({
				phone: phone,
				password: $.md5("paiwo_" + pwd),
				code: verify,
				method: 'paiwo.account.register.phone_register'
			})
		},
		success: function(data){
			if(data.error_id == 0){
				window.location.href = '/register_recommend';
			}else{	
				showError('#r_error_verify', '验证码错误');
			}
		}
	});
}

//邮箱注册提交
function register_submit(){
		var	email   = $('#r_email').val().toLocaleLowerCase().trim();
		var pwd     = $('#r_pwd').val().trim();
		var verify  = $('#r_verify').val().trim();
	if(!email){
		showError('#r_error_email', '请填写邮箱');
		return;
	}
	if(!pwd){
		showError('#r_error_pwd', '请填写密码');
		return;
	}
	if(!verify){
		showError('#r_error_verify', '验证码');
		return;
	}
    
    
    if(is_rEmail() && is_rPwd() && is_rVerify()){   //表单正确
		var rPwd = $.md5("paiwo_" + pwd);
		register_mail = email;
		//ajax请求
		$.ajax({ 
			type: "POST",
			async:false,
			url: "/rest",
			dataType: "json",
			data:{
				data: JSON.stringify({
					email: email,
					password: rPwd,
					verify: verify,
					method: 'paiwo.account.register.email_register'
				})
			},
			success: function(data){
				if (data.error_id == 0){

					showmailaddress(register_mail);

				}else if(data.error_id == 801){
					
					showError('#r_error_verify', '验证码有误');
					
					$("#r_image").attr("src", "/a/captcha/register?v=" + Math.random());  //验证码

				}else{
					showError('#r_error_verify',decodeURIComponent(data.error_code));
					$("#r_image").attr("src", "/a/captcha/register?v=" + Math.random());  //验证码
				}
			},
			error: function(data){
				//alert("注册错误");
			}
		});
	}
	return false;	
}

var st ;
var x = 60; 
function re_send(){
    //重新发送注册
	 $.ajax({
		type: "POST",
		url: "/rest",
		data: {
			data: JSON.stringify({method: 'paiwo.account.register.send_email'})
		}
            
     });
     x=60;
     $('#resend_p').text(x+'秒后可再次发送');
	 st= setInterval(leavetime,1000)
}

function leavetime (){
	x--;
	if(x<1){
		$('#resend_p').html('<a class="mail-url" id="resend_mail">重新发送验证邮件</a>');
		clearInterval(st);
	}else{
		$('#resend_p').text(x+'秒后可再次发送');
	}
}
function leavetime2(){
	x--;
	if(x<1){
		$('#resend_p2').html('<a class="mail-url" id="resend_setmail">重新发送重置密码邮件</a>');
		clearInterval(st);
	}else{
		$('#resend_p2').html(x+'秒后可再次发送');
	}
}
//发送重置密码邮件
function resetEmail(){

	var email = $('#f_email').val().toLocaleLowerCase().trim();
	var verify = $('#f_verify').val().trim();
	if(!email){
		showError('#f_error_email', '请填写账号邮箱');	
		return;
	}
	if(!verify){
		showError('#f_error_verify', '请填写验证码');	
		return;
	}

	if(is_rEmail3()&&is_rVerify2()){
		register_mail = email;
		$.ajax({
			url: '/rest',
			type: 'POST',
			dataType: 'json',
			data: { 
				data: JSON.stringify({
					email: email,
					verify: verify,
					method: 'paiwo.account.password.send_email'
				})
			},
			success:resetEmailResult
		});
	}
}
function forgetGetCode(){
	// 忘记密码获取验证码
    var phone = $('#forgetbox2 .forget_email').val().trim();
    var verify = $('#f_phone_code').val().trim();
    
	$.ajax({
		url: '/rest',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify({
				phone: phone,
				verify: verify,
				method: 'paiwo.account.password.phone_send_sms'
			})
        },
        success: function(data){
			if(data.error_id == 0){
				$('#phone_close2').trigger('click');
				setPhotoTime(false);
			}else{
				$('#phone-2 .verify_error_em').html('验证码错误').show();
			}        
        }
	});
}

function fogetSent(){
	// 忘记密码重置
    var code = $('#forgetbox2 .forget_vcode').val();
    var phone = $('#forgetbox2 .forget_email').val();
	$.ajax({
		url: '/rest',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify({
				phone: phone,
				code: code,
				method: 'paiwo.account.password.phone_find_password'
			})
        },
        success: function(data){
			if(data.error_id == 0){
				$('.box_password').show();
			}else{
				$('#f_error_ver').html('验证码错误').show();   
			}
        }
	});
}

function phone_find_end(phone,p1,p2){
    var code = $('#forgetbox2 .forget_vcode').val();
    $.ajax({
		url: '/rest',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify({
				phone: phone,
				password1: $.md5('paiwo_'+p1),
				password2: $.md5('paiwo_'+p2),
				code: code,
				method: 'paiwo.account.password.phone_find_password'
			})
        },
        success: function(data){
			if(data.error_id == 0){
			   $('#forget_close2').trigger('click');
			   $('#forgetbox2 input').val('');
			   showMessage('密码修改成功');
			}else{
				$('#f_error_ver').html('验证码错误').show();
			}
        }
	});
}

//第一次发送重置密码的回调
function resetEmailResult(data){
	if(data.error_id==0){
		var mail = $('#f_email').val();
		showforget2(mail);

	}else if(data.error_id == 800){
		showError('#f_error_verify', '验证码错误');
		$("#f_image").trigger('click');
	}else{
		$("#f_image").trigger('click');
		showError('#f_error_email', '邮件已经发送过了');
	}
}
//第二次以后发送的重置密码
function resetEmailTime(){
	$.ajax({
		url: '/rest',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify({
				email: register_mail,
				verify: '0',
				method: 'paiwo.account.password.send_email'
			})
        }
	});
	  x=60;
     $('#resend_p2').html(x+'秒后可再次发送');
	 st= setInterval(leavetime2,1000);
}


