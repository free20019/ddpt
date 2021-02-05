package mvc.controllers;


import javax.servlet.http.HttpServletRequest;

import mvc.service.LoginServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
/**
* login
 */
@Controller
@RequestMapping(value = "/login")
public class LoginAction {
	private LoginServer loginServer;

	public LoginServer getLoginServer() {
		return loginServer;
	}

	@Autowired
	public void setLoginServer(LoginServer loginServer) {
		this.loginServer = loginServer;
	}

	@RequestMapping(value = "/login")
	@ResponseBody
	public String login(HttpServletRequest request
			,@RequestParam("username") String username
			,@RequestParam("password") String password
			,@RequestParam("fjh") String fjh
			) {
		String msg = loginServer.login(request,username,password,fjh);
		return "{\"msg\":\""+msg+"\"}";
	}
	
	@RequestMapping(value = "/checklogin")
	@ResponseBody
	public String checklogin(HttpServletRequest request) {
		String username = (String)request.getSession().getAttribute("username");
		String userfjh = (String)request.getSession().getAttribute("userfjh");
		String userrole = (String)request.getSession().getAttribute("userrole");
		String realname = (String)request.getSession().getAttribute("realname");
		String role = (String)request.getSession().getAttribute("role");
		if(username==null||username.equals("null")){
			return "{\"msg\":\"0\"}";
		}else{
			return "{\"msg\":\"1\",\"username\":\""+username+"\",\"userfjh\":\""+userfjh+"\",\"userrole\":\""+userrole+"\",\"role\":\""+role+"\",\"realname\":\""+realname+"\"}";
		}
	}
}
