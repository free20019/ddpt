package mvc.controllers;


import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import mvc.service.BackServer;
import mvc.service.XxfsServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/xxfs")
public class XxfsAction {
	private XxfsServer xxfsServer;

	public XxfsServer getXxfsServer() {
		return xxfsServer;
	}
	@Autowired
	public void setXxfsServer(XxfsServer xxfsServer) {
		this.xxfsServer = xxfsServer;
	}

	/**
	 * 查询所有车辆
	 */
	@RequestMapping("/findcl")
	@ResponseBody
	public String findcl(@RequestParam("postData") String postData){
		String msg = xxfsServer.findcl(postData);
		return msg;
	}
	/**
	 * 查询所有车辆
	 */
	@RequestMapping("/findjt")
	@ResponseBody
	public String findjt(@RequestParam("postData") String postData){
		String msg = xxfsServer.findjt(postData);
		return msg;
	}
	/**
	 * 查询所有车辆
	 */
	@RequestMapping("/findgs")
	@ResponseBody
	public String findgs(@RequestParam("postData") String postData){
		String msg = xxfsServer.findgs(postData);
		return msg;
	}
	/**
	 * 查询所有消息
	 */
	@RequestMapping("/findmsg")
	@ResponseBody
	public String findmsg(){
		String msg = xxfsServer.findmsg();
		return msg;
	}
	/**
	 * 删除消息内容
	 */
	@RequestMapping("/msgdel")
	@ResponseBody
	public String msgdel(@RequestParam("postData") String postData){
		String msg = xxfsServer.msgdel(postData);
		return msg;
	}
	/**
	 * 修改消息内容
	 */
	@RequestMapping("/msgupdate")
	@ResponseBody
	public String msgupdate(@RequestParam("postData") String postData){
		String msg = xxfsServer.msgupdate(postData);
		return msg;
	}
	/**
	 * 添加消息内容
	 */
	@RequestMapping("/msgadd")
	@ResponseBody
	public String msgadd(@RequestParam("postData") String postData){
		String msg = xxfsServer.msgadd(postData);
		return msg;
	}
	/**
	 * 消息发送
	 */
	@RequestMapping("/msgsend")
	@ResponseBody
	public String msgsend(@RequestParam("postData") String postData){
		String msg = xxfsServer.msgsend(postData);
		return msg;
	}
	
	/**
	 * 短信发送
	 */
	@RequestMapping("/dxmsgsend")
	@ResponseBody
	public String dxmsgsend(@RequestParam("postData") String postData)throws IOException{
		String msg = xxfsServer.dxmsgsend(postData);
		return msg;
	}
	
	/**
	 * 查询群组
	 */
	@RequestMapping("/findqz")
	@ResponseBody
	public String findqz(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.findqz(postData);
		return msg;
	}
	
	@RequestMapping("/findqzname")
	@ResponseBody
	public String findqzname(){
		String msg = xxfsServer.findqzname();
		return msg;
	}
	/**
	 * 删除群组
	 */
	@RequestMapping("/delqz")
	@ResponseBody
	public String delqz(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.delqz(postData);
		return msg;
	}
	/**
	 * 添加群组
	 */
	@RequestMapping("/addqz")
	@ResponseBody
	public String addqz(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.addqz(postData);
		return msg;
	}
	/**
	 * 修改群组
	 */
	@RequestMapping("/updqz")
	@ResponseBody
	public String updqz(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.updqz(postData);
		return msg;
	}
	
	/**
	 * 查询人员
	 */
	@RequestMapping("/findry")
	@ResponseBody
	public String findry(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.findry(postData);
		return msg;
	}
	@RequestMapping("/findryxx")
	@ResponseBody
	public String findryxx(){
		String msg = xxfsServer.findryxx();
		return msg;
	}
	/**
	 * 删除人员
	 */
	@RequestMapping("/delry")
	@ResponseBody
	public String delry(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.delry(postData);
		return msg;
	}
	/**
	 * 添加人员
	 */
	@RequestMapping("/addry")
	@ResponseBody
	public String addry(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.addry(postData);
		return msg;
	}
	/**
	 * 修改人员
	 */
	@RequestMapping("/updry")
	@ResponseBody
	public String updry(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = xxfsServer.updry(postData);
		return msg;
	}
}
