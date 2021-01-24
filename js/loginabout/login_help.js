var regis_info = {};
regis_info.type = 0; //0是未选定 1是phone 2是email

//正则检验邮箱 密码是否错误
function check_val(val,type){
	if(type == 'email'){
		return reg.email.test(val);
	}else if(type = 'pwd'){
		return reg.pwd.test(val);
	}else{
		return false;
	}
}

//注册验证邮箱
function is_rEmail(){
	var rEmail_v = $('#r_email').val().trim();
	if(rEmail_v){
		if(reg.email.test(rEmail_v)){
			hideError('email');
			var res = null;
			$.ajax({
				async: false,
				type : "POST",
				url : "/rest",
				dataType : 'json',
				data:{
					data: JSON.stringify({
					email: rEmail_v,
					method: 'paiwo.account.register.check_email'})  
				},
				success : function(data) {
					res = data;
				},
				error : function(data) {
					res = data;
				}
			});
			if (res.error_id == 0 ){   
				hideError('#r_error_email');
				return true;
				
			}else{
				showError('#r_error_email','邮箱已经被注册');
				return false;
			}

		}else{
			showError('#r_error_email','邮箱格式错误');
			return false;
		}
	}else{
		hideError('#r_error_email');
		return false;
	}
}

//注册时候的手机
function is_rPhone(){
	var rEmail_v = $('#r_email').val().trim();
	if(rEmail_v){
		if(/^1[0-9]{10}$/.test(rEmail_v)){
			hideError('email');
			var res = null;
			$.ajax({
				async: false,
				type : "POST",
				url : "/rest",
				dataType : 'json',
				data:{
					data: JSON.stringify({
					email: rEmail_v,
					method: 'paiwo.account.register.check_email'})  
				},
				success : function(data) {
					res = data;
				},
				error : function(data) {
					res = data;
				}
			});
			if (res.error_id == 0 ){   
				hideError('#r_error_email');
				return true;
				
			}else{
				showError('#r_error_email','手机已经被注册');
				return false;
			}

		}else{
			showError('#r_error_email','手机格式错误');
			return false;
		}
	}else{
		hideError('#r_error_email');
		return false;
	}
}

//查看邮箱是否被注册
function is_rEmail2(){
	var rEmail_v = $('#f_email').val().trim();
	var flag;
	if(rEmail_v){
		if(reg.email.test(rEmail_v)){
			var res = null;
			$.ajax({
				async: false,
				type : "POST",
				url : "/rest",
				dataType : 'json',
				data:{
					data: JSON.stringify({
						email: rEmail_v,
						method: 'paiwo.account.register.check_email'})
				},
				success : function(data) {
					if(data.error_id == 0){
						flag = 1;	
					}else if(data.error_id==10002){
						flag = 1;
					}else{
						flag = 0;
					}
					
				}
			});
		
			if(flag == 1){
				hideError('#f_error_email');
				return true;
			}else{
			  showError('#f_error_email','邮箱未被注册');
			  return false;
			}
		}else{
			showError('#f_error_email','邮箱格式错误！')
			return false;
		}
	}else{
		hideError('#f_error_email');
		return false;
	}
}

//重置邮箱
function is_rEmail3(){
	var rEmail_v = f_email.value;
	var flag;
	if(rEmail_v){
		if(reg.email.test(rEmail_v)){
				var res = null;
			
				$.ajax({
					async: false,
					type : "POST",
					url : "/rest",
					dataType : 'json',
                    data:{
                        data: JSON.stringify({
                            email: rEmail_v,
                            method: 'paiwo.account.register.check_email'})
                    },
					success : function(data) {
						if(data.error_id == 0){ //邮箱未被注册
                            flag = 1;
						}else if(data.error_id==10002){ //邮箱已被注册
                            flag = 0;
						}	
					}
				});
			
				if(flag){
                    showError('#f_error_email','该邮箱未注册');
                    return false;
                }else{
				    hideError('#f_error_email');
                    return true;
                }
			}else{
				showError('#f_error_email','邮箱格式错误！')
				return false;
			}
		}else{
			hideError('#f_error_email');
			return false;
		}
}

//注册密码验证
function is_rPwd(){
	var rPwd_v = $('#r_pwd').val().trim();
	if(rPwd_v){
		if((reg.pwd).test(rPwd_v)){
			hideError('#r_error_pwd');
			return true;
		}else{
			showError('#r_error_pwd','密码为6-15位');
			return false;
		}
	}else{
		hideError('#r_error_pwd');
		return false;
	}
}

//验证码验证
function is_rVerify(){
  var rVerify_v = $('#r_verify').val().trim();
	if(rVerify_v){
		if(rVerify_v.length!=4){
			showError('#r_error_verify', '验证码为4位');
			return false;
		}else{
			hideError('#r_error_verify');
			return true;
		}
	}else{
		   hideError('#r_error_verify');
		    return false;
	}
}

function is_rVerify2(){
 var rVerify_v = $('#f_verify').val().trim();
	if(rVerify_v){
		if(rVerify_v.length!=4){
			showError('#f_error_verify', '验证码为4位');
			return false;
		}else{
			hideError('#f_error_verify');
			return true;
		}
	}else{
		    hideError('#f_error_verify');
		    return false;
	}
}

// 显示错误 
function showError(target,content){
	var t = $(target);
	t.html(content).show();
	t.next().show();
}

// 隐藏错误信息
function hideError(target){
	var t = $(target);
	t.hide();
	t.next().hide();
}

//切换页面清数据
function clearLogin(){
	$('#login_email').val('');
	$('#login_pwd').val('');
	hideError('#login_error_email');
	hideError('#login_error_pwd');
	$('#login_box').hide();
}

function clearRegister(){
	$('#r_email').val('');
	$('#r_pwd').val('');
	$('#r_verify').val('');
	hideError('#r_error_email');
	hideError('#r_error_pwd');
	hideError('#r_error_verify');
	$('#register_box').hide();
}

function clearForget(){
	$('#f_email').val();
	$('#f_verify').val();
	hideError('#f_error_email');
	hideError('#f_error_verify');
	$('#forgetbox').hide();
	$('#forgetbox2').hide();//手机找回框

}

function clearAll(){
	clearLogin();
	clearRegister();
	clearForget();
	$('#mailbox2').hide();
	$('#mailbox').hide();	
}

function checkPhoneOrEmail(data){
	/* email  1
	 * phone 2
	 * 都不满足 0
	 */
    if(reg.email.test(data)){
        return 2;
    }else if(reg.phone.test(data)){
        return 1;
    }else{
        return 0;
    }
}

//获取手机验证码
var photo_set = {};
    photo_set.time = null;
    photo_set.count = 0;
function setPhotoTime(type){
    if(type){
        var url = '#r_phone';
    }else{
        var url = '#f_phone';
    }
    
    $(url).addClass('ver-code-none');
    $(url).html('(60)再次获取');
    photo_set.count = 60;
    clearInterval(photo_set.time);
    photo_set.time = setInterval(function(){
        photo_set.count--;
        if(photo_set.count < 0){
            clearInterval(photo_set.time);
            $(url).html('获取验证码').removeClass('ver-code-none');
        }else{
            $(url).html('('+photo_set.count+')再次获取');
        }
    },1000)
}



function checkPhoneE(phone){
	//弹出验证码
    var flag;
    $.ajax({
        async: false,
		url: '/rest',
		type: 'POST',
		dataType: 'json',
		data: {
			data: JSON.stringify({
				phone: phone,
				method: 'paiwo.account.register.phone_check'})
        },
        success: function(data){
            flag = data.response.is_exist
        }
	});
	if(flag){
		//存在
		showError('#r_error_email', '手机已经被注册');
		return false;
	}else{
		//不存在
		var pwd = $('#r_pwd').val().trim();
		if(!reg.pwd.test(pwd)){
			if(pwd){
				showError('#r_error_pwd', '请输入密码');
			}else{
				showError('#r_error_pwd', '请输入6-15位字符的密码')
			}
			return false
		}else{
		//账号 密码 验证成功	
			return true;
		}
	}
}

