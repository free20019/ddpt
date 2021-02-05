package mvc.controllers;


import helper.DownloadAct;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.service.BackServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/back")
public class BackAction {
	private BackServer backServer;

	public BackServer getBackServer() {
		return backServer;
	}
	@Autowired
	public void setBackServer(BackServer backServer) {
		this.backServer = backServer;
	}

	/**
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/test")
	@ResponseBody
	public String ywqk(HttpServletRequest request) {
		String msg = backServer.test();
		return msg;
	}
	/**
	 * 终端状态查询
	 */
	@RequestMapping("/findmdtstate")
	@ResponseBody
	public String findmdtstate(){
		String msg = backServer.findmdtstate();
		return msg;
	}
	/**
	 * 终端状态添加
	 */
	@RequestMapping("/addmdtstate")
	@ResponseBody
	public String addmdtstate(@RequestParam("postData") String postData){
		String msg = backServer.addmdtstate(postData);
		return msg;
	}
	/**
	 * 终端状态修改
	 */
	@RequestMapping("/editmdtstate")
	@ResponseBody
	public String editmdtstate(@RequestParam("postData") String postData){
		String msg = backServer.editmdtstate(postData);
		return msg;
	}
	/**
	 * 终端状态删除
	 */
	@RequestMapping("/delmdtstate")
	@ResponseBody
	public String delmdtstate(@RequestParam("id") String id){
		String msg = backServer.delmdtstate(id);
		return msg;
	}
	/**
	 * 公司表查询
	 */
	@RequestMapping("/findgsb")
	@ResponseBody
	public String findgsb(@RequestParam("postData") String postData){
		String msg = backServer.findgsb(postData);
		return msg;
	}
	/**
	 * 公司表添加
	 */
	@RequestMapping("/addgsb")
	@ResponseBody
	public String addgsb(@RequestParam("postData") String postData){
		String msg = backServer.addgsb(postData);
		return msg;
	}
	/**
	 * 根据公司id查询所有分公司
	 */
	@RequestMapping("/findcompall")
	@ResponseBody
	public String findcompall(@RequestParam("ba_id") String ba_id){
		String msg = backServer.findcompall(ba_id);
		return msg;
	}
	/**
	 * 公司表修改
	 */
	@RequestMapping("/editgsb")
	@ResponseBody
	public String editgsb(@RequestParam("postData") String postData){
		String msg = backServer.editgsb(postData);
		return msg;
	}
	/**
	 * 公司表删除
	 */
	@RequestMapping("/delgsb")
	@ResponseBody
	public String delgsb(@RequestParam("comp_id") String comp_id){
		String msg = backServer.delgsb(comp_id);
		return msg;
	}
	/**
	 * 有障碍车的区块表查询
	 */
	@RequestMapping("/findzacqkb")
	@ResponseBody
	public String findzacqkb(){
		String msg = backServer.findzacqkb();
		return msg;
	}
	/**
	 * 有障碍车区块表添加
	 */
	@RequestMapping("/addzacqkb")
	@ResponseBody
	public String addzacqkb(@RequestParam("postData") String postData){
		String msg = backServer.addzacqkb(postData);
		return msg;
	}
	/**
	 * 障碍车区块表修改
	 */
	@RequestMapping("/editzacqkb")
	@ResponseBody
	public String editzacqkb(@RequestParam("postData") String postData){
		String msg = backServer.editzacqkb(postData);
		return msg;
	}
	/**
	 * 障碍车区块表删除
	 */
	@RequestMapping("/delzacqkb")
	@ResponseBody
	public String delzacqkb(@RequestParam("id") String id){
		String msg = backServer.delzacqkb(id);
		return msg;
	}
	/**
	 * 终端表查询
	 */
	@RequestMapping("/findzdb")
	@ResponseBody
	public String findzdb(){
		String msg = backServer.findzdb();
		return msg;
	}
	/**
	 * 终端表增加
	 */
	@RequestMapping("/addzdb")
	@ResponseBody
	public String addzdb(@RequestParam("postData") String postData){
		String msg = backServer.addzdb(postData);
		return msg;
	}
	/**
	 * 终端表修改
	 */
	@RequestMapping("/editzdb")
	@ResponseBody
	public String editzdb(@RequestParam("postData") String postData){
		String msg = backServer.editzdb(postData);
		return msg;
	}
	/**
	 * 终端表删除
	 */
	@RequestMapping("/delzdb")
	@ResponseBody
	public String delzdb(@RequestParam("id") String id){
		String msg = backServer.delzdb(id);
		return msg;
	}
	/**
	 * 车型表查询
	 */
	@RequestMapping("/findcxb")
	@ResponseBody
	public String findcxb(@RequestParam("postData") String postData){
		String msg = backServer.findcxb(postData);
		return msg;
	}
	/**
	 * 车型表增加
	 */
	@RequestMapping("/addcxb")
	@ResponseBody
	public String addcxb(@RequestParam("postData") String postData){
		String msg = backServer.addcxb(postData);
		return msg;
	}
	/**
	 * 车型表修改
	 */
	@RequestMapping("/editcxb")
	@ResponseBody
	public String editcxb(@RequestParam("postData") String postData){
		String msg = backServer.editcxb(postData);
		return msg;
	}
	/**
	 * 车型表删除
	 */
	@RequestMapping("/delcxb")
	@ResponseBody
	public String delcxb(@RequestParam("vt_id") String vt_id){
		String msg = backServer.delcxb(vt_id);
		return msg;
	}
	/**
	 * 颜色表查询
	 */
	@RequestMapping("/findysb")
	@ResponseBody
	public String findysb(){
		String msg = backServer.findysb();
		return msg;
	}
	/**
	 * 颜色表增加
	 */
	@RequestMapping("/addysb")
	@ResponseBody
	public String addysb(@RequestParam("postData") String postData){
		String msg = backServer.addysb(postData);
		return msg;
	}
	/**
	 * 颜色表修改
	 */
	@RequestMapping("/editysb")
	@ResponseBody
	public String editysb(@RequestParam("postData") String postData){
		String msg = backServer.editysb(postData);
		return msg;
	}
	/**
	 * 颜色表删除
	 */
	@RequestMapping("/delysb")
	@ResponseBody
	public String delysb(@RequestParam("id") String id){
		String msg = backServer.delysb(id);
		return msg;
	}
	/**
	 * 通信表查询
	 */
	@RequestMapping("/findtxb")
	@ResponseBody
	public String findtxb(){
		String msg = backServer.findtxb();
		return msg;
	}
	/**
	 * 通信表增加
	 */
	@RequestMapping("/addtxb")
	@ResponseBody
	public String addtxb(@RequestParam("postData") String postData){
		String msg = backServer.addtxb(postData);
		return msg;
	}
	/**
	 * 通信表修改
	 */
	@RequestMapping("/edittxb")
	@ResponseBody
	public String edittxb(@RequestParam("postData") String postData){
		String msg = backServer.edittxb(postData);
		return msg;
	}
	/**
	 * 通信表删除
	 */
	@RequestMapping("/deltxb")
	@ResponseBody
	public String deltxb(@RequestParam("id") String id){
		String msg = backServer.deltxb(id);
		return msg;
	}
	/**
	 * 调度表查询
	 */
	@RequestMapping("/findddb")
	@ResponseBody
	public String findddb(@RequestParam("postData") String postData){
		String msg = backServer.findddb(postData);
		return msg;
	}
	/**
	 * 调度表修改
	 */
	@RequestMapping("/editddb")
	@ResponseBody
	public String editddb(@RequestParam("postData") String postData){
		String msg = backServer.editddb(postData);
		return msg;
	}
	/**
	 * 调度表删除
	 */
	@RequestMapping("/delddb")
	@ResponseBody
	public String delddb(@RequestParam("id") String id,@RequestParam("stime") String stime){
		String msg = backServer.delddb(id, stime);
		return msg;
	}
	/**
	 * 定位表查询
	 */
	@RequestMapping("/finddwb")
	@ResponseBody
	public String finddwb(@RequestParam("postData") String postData){
		String msg = backServer.finddwb(postData);
		return msg;
	}
	/**
	 * 定位表增加
	 */
	@RequestMapping("/adddwb")
	@ResponseBody
	public String adddwb(@RequestParam("postData") String postData){
		String msg = backServer.adddwb(postData);
		return msg;
	}
	/**
	 * 定位表修改
	 */
	@RequestMapping("/editdwb")
	@ResponseBody
	public String editdwb(@RequestParam("postData") String postData){
		String msg = backServer.editdwb(postData);
		return msg;
	}
	/**
	 * 定位表删除
	 */
	@RequestMapping("/deldwb")
	@ResponseBody
	public String deldwb(@RequestParam("id") String id){
		String msg = backServer.deldwb(id);
		return msg;
	}
	/**
	 * 区域表查询
	 */
	@RequestMapping("/findqyb")
	@ResponseBody
	public String findqyb(){
		String msg = backServer.findqyb();
		return msg;
	}
	/**
	 * 区域表增加
	 */
	@RequestMapping("/addqyb")
	@ResponseBody
	public String addqyb(@RequestParam("postData") String postData){
		String msg = backServer.addqyb(postData);
		return msg;
	}
	/**
	 * 区域表修改
	 */
	@RequestMapping("/editqyb")
	@ResponseBody
	public String editqyb(@RequestParam("postData") String postData){
		String msg = backServer.editqyb(postData);
		return msg;
	}
	/**
	 * 区域表删除
	 */
	@RequestMapping("/delqyb")
	@ResponseBody
	public String delqyb(@RequestParam("id") String id){
		String msg = backServer.delqyb(id);
		return msg;
	}
	/**
	 * 客户表查询
	 */
	@RequestMapping("/findkhb")
	@ResponseBody
	public String findkhb(@RequestParam("postData") String postData){
		String msg = backServer.findkhb(postData);
		return msg;
	}
	/**
	 * 客户表增加
	 */
	@RequestMapping("/addkhb")
	@ResponseBody
	public String addkhb(@RequestParam("postData") String postData){
		String msg = backServer.addkhb(postData);
		return msg;
	}
	/**
	 * 客户表修改
	 */
	@RequestMapping("/editkhb")
	@ResponseBody
	public String editkhb(@RequestParam("postData") String postData){
		String msg = backServer.editkhb(postData);
		return msg;
	}
	/**
	 * 客户表删除
	 */
	@RequestMapping("/delkhb")
	@ResponseBody
	public String delkhb(@RequestParam("id") String id){
		String msg = backServer.delkhb(id);
		return msg;
	}
	/**
	 * 车辆表查询
	 */
	@RequestMapping("/findclb")
	@ResponseBody
	public String findclb(@RequestParam("postData") String postData){
		String msg = backServer.findclb(postData);
		return msg;
	}
	/**
	 * 车辆表\终端表添加
	 */
	@RequestMapping("/addclb")
	@ResponseBody
	public String addclb(HttpServletRequest reqiest,@RequestParam("postData") String postData){
		String msg = backServer.addclb(postData,reqiest);
		return msg;
	}
	/**
	 * 车辆表\终端表修改
	 */
	@RequestMapping("/editclb")
	@ResponseBody
	public String editclb(HttpServletRequest reqiest,@RequestParam("postData") String postData){
		String msg = backServer.editclb(postData,reqiest);
		return msg;
	}
	/**
	 * 车辆表\终端表删除
	 */
	@RequestMapping("/delclb")
	@ResponseBody
	public String delclb(@RequestParam("cid") String cid,@RequestParam("mid") String mid){
		String msg = backServer.delclb(cid,mid);
		return msg;
	}
	/**
	 * 公司树结构
	 */
	@RequestMapping("gstree")
	@ResponseBody
	public String gstree(){
		String msg = backServer.gstree();
		return msg;
	}
	/**
	 * 查询用户表
	 */
	@RequestMapping("/findyhb")
	@ResponseBody
	public String findyhb(@RequestParam("postData") String postData){
		String msg = backServer.findyhb(postData);
		return msg;
	}
	
	@RequestMapping(value = "/yhb_daochu")
	@ResponseBody
	public String yhb_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"用户名","密码","权限","电话","用户姓名","公司","分公司","备注"};//导出列明
		String b[] = {"USER_NAME","USER_PWD","RG_NAME","USER_TEL","REAL_NAME","BA_NAME","COMP_NAME","NOTE"};//导出map中的key
		String gzb = "用户表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = backServer.yhb_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	/**
	 * 添加用户表
	 */
	@RequestMapping("/addyhb")
	@ResponseBody
	public String addyhb(@RequestParam("postData") String postData){
		String msg = backServer.addyhb(postData);
		return msg;
	}
	/**
	 * 修改用户表
	 */
	@RequestMapping("/edityhb")
	@ResponseBody
	public String edityhb(@RequestParam("postData") String postData){
		String msg = backServer.edityhb(postData);
		return msg;
	}
	/**
	 * 修改公司表
	 */
	@RequestMapping("/delyhb")
	@ResponseBody
	public String delyhb(@RequestParam("id") String id){
		String msg = backServer.delyhb(id);
		return msg;
	}
	/**
	 * 失物查找
	 */
	@RequestMapping("/swcz")
	@ResponseBody
	public String swcz(String qd_stime,String qd_etime,
			String zd_stime,String zd_etime,
			String zj_stime,String zj_etime,
			String qd_jwd,String zd_jwd,String zj_jwd){
		String msg = backServer.swcz(qd_stime,qd_etime,zd_stime,zd_etime,zj_stime,zj_etime,qd_jwd,zd_jwd,zj_jwd);
		return msg;
	}
	@RequestMapping("swczexcle")
	@ResponseBody
	public String swczexcle(HttpServletRequest request,
			HttpServletResponse response,String qd_stime,String qd_etime,
			String zd_stime,String zd_etime,
			String zj_stime,String zj_etime,
			String qd_jwd,String zd_jwd,String zj_jwd) throws IOException{
		String a[] = {"车牌号码","经纬度","时间"};//导出列明
		String b[] = {"vehi_no","px","stime"};//导出map中的key
		String gzb = "车辆信息";//导出sheet名和导出的文件名
		String gzb1 = "起点车辆";//导出sheet名和导出的文件名
		String gzb2 = "终点车辆";//导出sheet名和导出的文件名
//		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backServer.swcz(qd_stime,qd_etime,zd_stime,zd_etime,zj_stime,zj_etime,qd_jwd,zd_jwd,zj_jwd);
		List<Map<String, Object>>jg = DownloadAct.parseJSON2Listx(msg,"jg");
		List<Map<String, Object>>qd = DownloadAct.parseJSON2Listx(msg,"qd");
		List<Map<String, Object>>zd = DownloadAct.parseJSON2Listx(msg,"zd");
		DownloadAct.downloadx(request,response,a,b,gzb,gzb1,gzb2,jg,qd,zd);
		return null;
	}
//	@RequestMapping("swczexcle")
//	@ResponseBody
//	public String swczexcle(HttpServletRequest request,
//			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
//		String a[] = {"车牌号码","经纬度","时间"};//导出列明
//		String b[] = {"vehi_no","px","stime"};//导出map中的key
//		String gzb = "车辆信息";//导出sheet名和导出的文件名
//		String gzb1 = "起点车辆";//导出sheet名和导出的文件名
//		String gzb2 = "终点车辆";//导出sheet名和导出的文件名
//		postData = java.net.URLDecoder.decode(postData, "UTF-8");
//		String msg = backServer.swczexcle(postData);
//		List<Map<String, Object>>jg = DownloadAct.parseJSON2Listx(msg,"jg");
//		List<Map<String, Object>>qd = DownloadAct.parseJSON2Listx(msg,"qd");
//		List<Map<String, Object>>zd = DownloadAct.parseJSON2Listx(msg,"zd");
//		DownloadAct.downloadx(request,response,a,b,gzb,gzb1,gzb2,jg,qd,zd);
//		return null;
//	}
	@RequestMapping("/findssjk")
	@ResponseBody
	public String findssjk(){
		String msg = backServer.findssjk();
		return msg;
	}
	
	/**
	 * 查询权限
	 */
	@RequestMapping("/findqxb")
	@ResponseBody
	public String findqxb(@RequestParam("postData") String postData){
		String msg = backServer.findqxb(postData);
		return msg;
	}
	/**
	 * 新旧车牌
	 */
	@RequestMapping("/findnewold")
	@ResponseBody
	public String findnewold(@RequestParam("postData") String postData){
		String msg = backServer.findnewold(postData);
		return msg;
	}
	@RequestMapping("/addnewold")
	@ResponseBody
	public String addnewold(@RequestParam("postData") String postData){
		String msg = backServer.addnewold(postData);
		return msg;
	}
	@RequestMapping("/editnewold")
	@ResponseBody
	public String editnewold(@RequestParam("postData") String postData){
		String msg = backServer.editnewold(postData);
		return msg;
	}
	@RequestMapping("/delnewold")
	@ResponseBody
	public String delnewold(@RequestParam("id") String id){
		String msg = backServer.delnewold(id);
		return msg;
	}
	/**
	 * 客户表查询
	 */
	@RequestMapping("/findkhb2")
	@ResponseBody
	public String findkhb2(@RequestParam("postData") String postData){
		String msg = backServer.findkhb2(postData);
		return msg;
	}
	/**
	 * 客户表增加
	 */
	@RequestMapping("/addkhb2")
	@ResponseBody
	public String addkhb2(@RequestParam("postData") String postData){
		String msg = backServer.addkhb2(postData);
		return msg;
	}
	/**
	 * 客户表修改
	 */
	@RequestMapping("/editkhb2")
	@ResponseBody
	public String editkhb2(@RequestParam("postData") String postData){
		String msg = backServer.editkhb2(postData);
		return msg;
	}
	/**
	 * 客户表删除
	 */
	@RequestMapping("/delkhb2")
	@ResponseBody
	public String delkhb2(@RequestParam("id") String id){
		String msg = backServer.delkhb2(id);
		return msg;
	}
	/**
	 * 优惠券查询
	 */
	@RequestMapping("/findyhq")
	@ResponseBody
	public String findyhq(@RequestParam("postData") String postData){
		String msg = backServer.findyhq(postData);
		return msg;
	}
	/**
	 * 优惠券增加
	 */
	@RequestMapping("/addyhq")
	@ResponseBody
	public String addyhq(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = backServer.addyhq(postData,request);
		return msg;
	}
	@RequestMapping("/issy")
	@ResponseBody
	public String issy(@RequestParam("id") String id,@RequestParam("issy") String issy){
		String msg = backServer.issy(id,issy);
		return msg;
	}
	@RequestMapping("/delyhq")
	@ResponseBody
	public String delyhq(@RequestParam("id") String id){
		String msg = backServer.delyhq(id);
		return msg;
	}
	/*
	 *爱心出租 
	*/
	@RequestMapping("/findaxcz")
	@ResponseBody
	public String findaxcz(){
		String msg = backServer.findaxcz();
		return msg;
	}
	@RequestMapping(value = "/axcz_daochu")
	@ResponseBody
	public String axcz_daochu(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		
		String a[] = {"车辆组名称","组内车辆"};//导出列明
		String b[] = {"TM_NAME","VEHI_NO"};//导出map中的key
		String gzb = "车辆组";//导出sheet名和导出的文件名
		String msg = backServer.findaxcz();
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
    }
	@RequestMapping("/findvhic")
	@ResponseBody
	public String findvhic(@RequestParam("cphm") String cphm){
		String msg = backServer.findvhic(cphm);
		return msg;
	}
	@RequestMapping("/addaxcz")
	@ResponseBody
	public String addaxcz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = backServer.addaxcz(postData,request);
		return msg;
	}
	@RequestMapping("/editaxcz")
	@ResponseBody
	public String editaxcz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = backServer.editaxcz(postData,request);
		return msg;
	}
	@RequestMapping("/delaxcz")
	@ResponseBody
	public String delaxcz(@RequestParam("id") String id){
		String msg = backServer.delaxcz(id);
		return msg;
	}
	/**
	 *司机表
	 */
	@RequestMapping("/findsjb")
	@ResponseBody
	public String findsjb(@RequestParam("postData") String postData){
		String msg = backServer.findsjb(postData);
		return msg;
	}
	@RequestMapping("/addsjb")
	@ResponseBody
	public String addsjb(@RequestParam("postData") String postData){
		String msg = backServer.addsjb(postData);
		return msg;
	}
	@RequestMapping("/editsjb")
	@ResponseBody
	public String editsjb(@RequestParam("postData") String postData){
		String msg = backServer.editsjb(postData);
		return msg;
	}
	@RequestMapping("/delsjb")
	@ResponseBody
	public String delsjb(@RequestParam("id") String id){
		String msg = backServer.delsjb(id);
		return msg;
	}
}
