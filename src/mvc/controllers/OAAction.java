package mvc.controllers;


import helper.DownloadAct;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.service.BackServer;
import mvc.service.OAServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/OA")
public class OAAction {
	private OAServer oaServer;
	
	public OAServer getOaServer() {
		return oaServer;
	}
	@Autowired
	public void setOaServer(OAServer oaServer) {
		this.oaServer = oaServer;
	}
	/**
	 * 出租日志查询
	 */
	@RequestMapping("/czrz")
	@ResponseBody
	public String czrz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.czrz(postData,request);
		return msg;
	}
	@RequestMapping("czrzexcle")
	@ResponseBody
	public String czrzexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"记录编号","日期","班次","组长工号","内容"};//导出列明
		String b[] = {"OLO_ID","RIQI","BC","GROUP_USER","OLO_CONTENT"};//导出map中的key
		String gzb = "热线日志";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.czrz(postData,request);
		System.out.println(msg);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delczrz")
	@ResponseBody
	public String delczrz(@RequestParam("id") String id,@RequestParam("table") String table){
		String msg = oaServer.delczrz(id,table);
		return msg;
	}
	@RequestMapping("/addczrz")
	@ResponseBody
	public String addczrz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addczrz(postData,request);
		return msg;
	}
	@RequestMapping("/editczrz")
	@ResponseBody
	public String editczrz(@RequestParam("postData") String postData){
		String msg = oaServer.editczrz(postData);
		return msg;
	}
	/**
	 * 出租业务
	 */
	@RequestMapping("/findczyw")
	@ResponseBody
	public String findczyw(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findczyw(postData,request);
		return msg;
	}
	@RequestMapping("czywexcle")
	@ResponseBody
	public String czywexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"业务编号","业务类型","调度时间","客户姓名","客户电话","调度员工号","详细地址","车牌号","SIM卡号","所属公司","备注"};//导出列明
		String b[] = {"DISP_ID","TYPE","RIQI","CI_NAME","DISP_TEL","USER_NAME","ADDRESS","VEHI_NO","SIM_NUM","COMP_NAME","NOTE"};//导出map中的key
		String gzb = "出租业务";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findczyw(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delczyw")
	@ResponseBody
	public String delczyw(@RequestParam("id") String id){
		String msg = oaServer.delczyw(id);
		return msg;
	}
	@RequestMapping("/addczyw")
	@ResponseBody
	public String addczyw(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addczyw(postData,request);
		return msg;
	}
	@RequestMapping("/editczyw")
	@ResponseBody
	public String editczyw(@RequestParam("postData") String postData){
		String msg = oaServer.editczyw(postData);
		return msg;
	}
	/**
	 * 短信业务
	 */
	@RequestMapping("/finddxyw")
	@ResponseBody
	public String finddxyw(@RequestParam("postData") String postData){
		String msg = oaServer.finddxyw(postData);
		return msg;
	}
	@RequestMapping("dxywexcle")
	@ResponseBody
	public String dxywexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"手机号码","业务单号","状态","所派车牌号","通知客户时间","调度员工号","抢单时间","内容","备注"};//导出列明
		String b[] = {"SIM_NO","GET_NO","STATUS","VEHI_ID","RIQI","USER_NAME","QDSJ","CONTENT","NOTE"};//导出map中的key
		String gzb = "短信业务";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.finddxyw(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/deldxyw")
	@ResponseBody
	public String deldxyw(@RequestParam("id") String id){
		String msg = oaServer.deldxyw(id);
		return msg;
	}
	@RequestMapping("editdxyw")
	@ResponseBody
	public String editdxyw(@RequestParam("postData") String postData){
		String msg = oaServer.editdxyw(postData);
		return msg;
	}
	/**
	 * 提醒注意addtxzy
	 */
	@RequestMapping("/findtxzy")
	@ResponseBody
	public String findtxzy(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findtxzy(postData,request);
		return msg;
	}
	@RequestMapping("txzyexcle")
	@ResponseBody
	public String txzyexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"发布时间","发布人","标题","内容"};//导出列明
		String b[] = {"RIQI","USER_NAME","ORE_TITLE","ORE_CONTENT"};//导出map中的key
		String gzb = "提醒注意";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findtxzy(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/deltxzy")
	@ResponseBody
	public String deltxzy(@RequestParam("id") String id){
		String msg = oaServer.deltxzy(id);
		return msg;
	}
	@RequestMapping("/addtxzy")
	@ResponseBody
	public String addtxzy(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addtxzy(postData,request);
		return msg;
	}
	@RequestMapping("/edittxzy")
	@ResponseBody
	public String edittxzy(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.edittxzy(postData,request);
		return msg;
	}
	/**
	 * 好人好事
	 * @param postData
	 * @param request
	 * @return
	 */
	@RequestMapping("/findhrhs")
	@ResponseBody
	public String findhrhs(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findhrhs(postData,request);
		return msg;
	}
	@RequestMapping("hrhsexcle")
	@ResponseBody
	public String hrhsexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"发布时间","记录人","标题","车牌","内容"};//导出列明
		String b[] = {"RIQI","USER_NAME","OG_TITLE","OG_VEHI_NO","OG_CONTENT"};//导出map中的key
		String gzb = "好人好事";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findhrhs(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delhrhs")
	@ResponseBody
	public String delhrhs(@RequestParam("id") String id){
		String msg = oaServer.delhrhs(id);
		return msg;
	}
	@RequestMapping("/addhrhs")
	@ResponseBody
	public String addhrhs(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addhrhs(postData,request);
		return msg;
	}
	@RequestMapping("/edithrhs")
	@ResponseBody
	public String edithrhs(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.edithrhs(postData,request);
		return msg;
	}
	/**
	 * 路况信息
	 */
	@RequestMapping("/findlkxx")
	@ResponseBody
	public String findlkxx(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findlkxx(postData, request);
		return msg;
	}
	@RequestMapping("/findclgs")
	@ResponseBody
	public String findclgs(@RequestParam("vhic") String vhic){
		String msg = oaServer.findclgs(vhic);
		return msg;
	}
	@RequestMapping("lkxxexcle")
	@ResponseBody
	public String lkxxexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"日期","班次","车牌号","公司","调度员工号","备注"};//导出列明
		String b[] = {"RIQI","BC","VEHI_NO","TAXICOMP","USER_NAME","NOTE"};//导出map中的key
		String gzb = "路况信息";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findlkxx(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/dellkxx")
	@ResponseBody
	public String dellkxx(@RequestParam("id") String id){
		String msg = oaServer.dellkxx(id);
		return msg;
	}
	@RequestMapping("/addlkxx")
	@ResponseBody
	public String addlkxx(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addlkxx(postData, request);
		return msg;
	}
	@RequestMapping("/editlkxx")
	@ResponseBody
	public String editlkxx(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.editlkxx(postData, request);
		return msg;
	}
	/**
	 * 失物登记
	 */
	@RequestMapping("/findswdj")
	@ResponseBody
	public String findswdj(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findswdj(postData, request);
		return msg;
	}
	@RequestMapping("swdjexcle")
	@ResponseBody
	public String swdjexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"接电话时间","上车时间","下车时间","调度员工号","车牌号","车辆公司名称","客人姓名","客人联系电话","事件性质","事件内容","处理结果","内容"};//导出列明
		String b[] = {"JDHSJ","SCSJ","XCSJ","USER_NAME","VEHI_NO","TAXICOMP","GUEST","TEL","KIND","CONTENT","RESULT","NOTE"};//导出map中的key
		String gzb = "失物登记";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findswdj(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delswdj")
	@ResponseBody
	public String delswdj(@RequestParam("id") String id){
		String msg = oaServer.delswdj(id);
		return msg;
	}
	@RequestMapping("/addswdj")
	@ResponseBody
	public String addswdj(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addswdj(postData, request);
		return msg;
	}
	@RequestMapping("/editswdj")
	@ResponseBody
	public String editswdj(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.editswdj(postData, request);
		return msg;
	}
	/**
	 * 翻译记录
	 */
	@RequestMapping("/findfyjl")
	@ResponseBody
	public String findfyjl(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findfyjl(postData, request);
		return msg;
	}
	@RequestMapping("fyjlexcle")
	@ResponseBody
	public String fyjlexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"时间","接待工号","语种","服务对象","服务类别","处理结果","服务反馈","车牌号码","司机电话","服务内容","备注"};//导出列明
		String b[] = {"RIQI","USER_NO","LANGUAGE_TYPE","CLICENT_TYPE","SERVICE_TYPE","RESULT","RESULT_BREAK","CLICENT_NAME","CLICENT_TEL","SERVICE_CONTENT","REMARK"};//导出map中的key
		String gzb = "翻译记录";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findfyjl(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delfyjl")
	@ResponseBody
	public String delfyjl(@RequestParam("id") String id){
		String msg = oaServer.delfyjl(id);
		return msg;
	}
	@RequestMapping("/addfyjl")
	@ResponseBody
	public String addfyjl(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addfyjl(postData, request);
		return msg;
	}
	@RequestMapping("/editfyjl")
	@ResponseBody
	public String editfyjl(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.editfyjl(postData, request);
		return msg;
	}
	/**
	 * 投诉记录
	 */
	@RequestMapping("/findtsjl")
	@ResponseBody
	public String findtsjl(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findtsjl(postData, request);
		return msg;
	}
	@RequestMapping("tsjlexcle")
	@ResponseBody
	public String tsjlexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"受理时间","受理工号","投诉类型","乘客姓名","电话","约车时间","约车地点","投诉车牌","所属公司","投诉类别","事件内容"};//导出列明
		String b[] = {"SLSJ","USER_NO","COMP_TYPE","CLI_NAME","CLI_TEL","YCSJ","ON_CAR_ADD","T_CARNO","T_DCOM","COMP_BTYPE","CONTENT"};//导出map中的key
		String gzb = "投诉记录";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findtsjl(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/deltsjl")
	@ResponseBody
	public String deltsjl(@RequestParam("id") String id){
		String msg = oaServer.deltsjl(id);
		return msg;
	}
	@RequestMapping("/addtsjl")
	@ResponseBody
	public String addtsjl(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addtsjl(postData, request);
		return msg;
	}
	@RequestMapping("/edittsjl")
	@ResponseBody
	public String edittsjl(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.edittsjl(postData, request);
		return msg;
	}
	/**
	 * 报警故障
	 */
	@RequestMapping("/findbjgz")
	@ResponseBody
	public String findbjgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findbjgz(postData, request);
		return msg;
	}
	@RequestMapping("bjgzexcle")
	@ResponseBody
	public String bjgzexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"车牌号","时间","记录人","状态","内容"};//导出列明
		String b[] = {"VEHI_NO","RIQI","OMV_USER","ZT","CONTENT"};//导出map中的key
		String gzb = "报警故障";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findbjgz(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delbjgz")
	@ResponseBody
	public String delbjgz(@RequestParam("id") String id,@RequestParam("table") String table,HttpServletRequest request){
		String msg = oaServer.delbjgz(id, table, request);
		return msg;
	}
	@RequestMapping("/addbjgz")
	@ResponseBody
	public String addbjgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addbjgz(postData, request);
		return msg;
	}
	@RequestMapping("/editbjgz")
	@ResponseBody
	public String editbjgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.editbjgz(postData, request);
		return msg;
	}
	/**
	 * 系统故障
	 */
	@RequestMapping("/findxtgz")
	@ResponseBody
	public String findxtgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findxtgz(postData, request);
		return msg;
	}
	@RequestMapping("xtgzexcle")
	@ResponseBody
	public String xtgzexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"时间","记录人","状态","内容"};//导出列明
		String b[] = {"RIQI","OSM_USER","ZT","CONTENT"};//导出map中的key
		String gzb = "系统故障";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findxtgz(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delxtgz")
	@ResponseBody
	public String delxtgz(@RequestParam("id") String id,HttpServletRequest request){
		String msg = oaServer.delxtgz(id, request);
		return msg;
	}
	@RequestMapping("/addxtgz")
	@ResponseBody
	public String addxtgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addxtgz(postData, request);
		return msg;
	}
	@RequestMapping("/editxtgz")
	@ResponseBody
	public String editxtgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.editxtgz(postData, request);
		return msg;
	}
	/**
	 * 工程车故障
	 */
	@RequestMapping("/findgccgz")
	@ResponseBody
	public String findgccgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findgccgz(postData,request);
		return msg;
	}
	@RequestMapping("gccgzexcle")
	@ResponseBody
	public String gccgzexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"受理时间","受理工号","服务类型","事件内容"};//导出列明
		String b[] = {"RIQI","ON_USER_NO","SERVER_TYPE","CONTENT"};//导出map中的key
		String gzb = "工程车故障";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findgccgz(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/delgccgz")
	@ResponseBody
	public String delgccgz(@RequestParam("id") String id){
		String msg = oaServer.delgccgz(id);
		return msg;
	}
	@RequestMapping("/addgccgz")
	@ResponseBody
	public String addgccgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addgccgz(postData, request);
		return msg;
	}
	@RequestMapping("/editgccgz")
	@ResponseBody
	public String editgccgz(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.editgccgz(postData, request);
		return msg;
	}
	/**
	 * 报警统计记录查询
	 */
	@RequestMapping("/findjltj")
	@ResponseBody
	public String findjltj(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.findjltj(postData,request);
		return msg;
	}
	@RequestMapping("jltjexcle")
	@ResponseBody
	public String jltjexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"报警时间","处理工号","车牌号码","定位情况","监听情况","司机电话","事件内容"};//导出列明
		String b[] = {"RIQI","AD_USERID","AD_CAR_NO","AD_GPS","AD_LISTENCASE","DRIVER_TEL","AD_CONDITION"};//导出map中的key
		String gzb = "记录统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.findjltj(postData,request);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/addjltj")
	@ResponseBody
	public String addjltj(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.addjltj(postData, request);
		return msg;
	}
	@RequestMapping("/editjltj")
	@ResponseBody
	public String editjltj(@RequestParam("postData") String postData,HttpServletRequest request){
		String msg = oaServer.editjltj(postData, request);
		return msg;
	}
	@RequestMapping("/deljltj")
	@ResponseBody
	public String deljltj(@RequestParam("id") String id){
		String msg = oaServer.deljltj(id);
		return msg;
	}
	@RequestMapping("/lsgj")
	@ResponseBody
	public String lsgj(@RequestParam("stime") String stime,@RequestParam("etime") String etime,@RequestParam("vhic") String vhic){
		String msg = oaServer.lsgj(stime,etime,vhic);
		return msg;
	}
	@RequestMapping("lsgjexcle")
	@ResponseBody
	public String lsgjexcle(@RequestParam("stime") String stime,@RequestParam("etime") String etime,@RequestParam("vhic") String vhic
			,HttpServletRequest request,HttpServletResponse response) throws IOException{
		String a[] = {"车牌号码","精度","维度","时间","速度","状态"};//导出列明
		String b[] = {"VEHICLE_NUM","PX","PY","TIME","SPEED","INFO"};//导出map中的key
		String gzb = "历史轨迹";//导出sheet名和导出的文件名
		String msg = oaServer.lsgjdc(stime,etime,vhic);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	/**
	 * 报警记录报表统计
	 */
	@RequestMapping("/bbtj")
	@ResponseBody
	public String bbtj(@RequestParam("postData") String postData){
		String msg = oaServer.bbtj(postData);
		return msg;
	}
	@RequestMapping("bbtjexcle")
	@ResponseBody
	public String bbtjexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"公司","分公司","车牌号码","报警总次数","真实报警次数","误报警次数"};//导出列明
		String b[] = {"BA_NAME","COMP_NAME","VEHI_NO","ZCS","ZSBJ","WBJ"};//导出map中的key
		String gzb = "报表统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.bbtj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/gsbbtj")
	@ResponseBody
	public String gsbbtj(@RequestParam("postData") String postData){
		String msg = oaServer.gsbbtj(postData);
		return msg;
	}
	@RequestMapping("gsbbtjexcle")
	@ResponseBody
	public String gsbbtjexcle(@RequestParam("postData") String postData,HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"公司","分公司","报警车辆","总报警次数","真实报警次数","真实报警车牌号","误报警次数"};//导出列明
		String b[] = {"BA_NAME","COMP_NAME","C","ZCS","ZSBJ","AD_CAR_NO","WBJ"};//导出map中的key
		String gzb = "公司报表统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = oaServer.gsbbtj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
}
