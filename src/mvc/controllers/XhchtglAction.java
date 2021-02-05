package mvc.controllers;


import helper.Client;
import helper.DownloadAct;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.service.XhchtglServer;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.com.activeMQ.Sender;
import cn.com.activeMQ.SenderJDSB;


@Controller
@RequestMapping(value = "/xhchtgl")
public class XhchtglAction {
	private XhchtglServer xhchtglServer;

	
	public XhchtglServer getXhchtglServer() {
		return xhchtglServer;
	}
	@Autowired
	public void setXhchtglServer(XhchtglServer xhchtglServer) {
		this.xhchtglServer = xhchtglServer;
	}
	/**
	 * 查询业务单
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	/**
	 * 查询车辆
	 */
	@RequestMapping(value = "/findcl")
	@ResponseBody
	public String findcl(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xhchtglServer.findcl(postData);
		return msg;
	}
	/**
	 * 查询驾驶员
	 */
	@RequestMapping(value = "/findjsy")
	@ResponseBody
	public String findjsy(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xhchtglServer.findjsy(postData);
		return msg;
	}
	/**
	 * 查询违章信息
	 */
	@RequestMapping(value = "/findwz")
	@ResponseBody
	public String findwz(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xhchtglServer.findwz(postData);
		return msg;
	}
	/**
	 * 公司车辆违章查询
	 */
	@RequestMapping(value = "/findgs")
	@ResponseBody
	public String findgs(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xhchtglServer.findgs(postData);
		return msg;
	}
	/**
	 * 公司车辆违章信息
	 */
	@RequestMapping(value = "/findwzxx")
	@ResponseBody
	public String findwzxx(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xhchtglServer.findwzxx(postData);
		return msg;
	}
	/**
	 * 公司车辆违章统计
	 */
	@RequestMapping(value = "/findtj")
	@ResponseBody
	public String findtj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xhchtglServer.findtj(postData);
		return msg;
	}
	/**
	 * 公司统计违章车辆
	 */
	@RequestMapping(value = "/findallcl")
	@ResponseBody
	public String findallcl(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xhchtglServer.findallcl(postData);
		return msg;
	}
}
