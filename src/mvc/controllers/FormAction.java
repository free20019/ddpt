package mvc.controllers;


import helper.DownloadAct;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.service.BackServer;
import mvc.service.FormServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/form")
public class FormAction {
	private FormServer formServer;

	public FormServer getFormServer() {
		return formServer;
	}
	@Autowired
	public void setFormServer(FormServer formServer) {
		this.formServer = formServer;
	}
	@RequestMapping("/gscltj")
	@ResponseBody
	public String gscltj(@RequestParam("postData") String postData){
		String msg = formServer.gscltj(postData);
		return msg;
	}
	@RequestMapping("gscltjexcle")
	@ResponseBody
	public String gscltjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"业务区块","公司名称","车辆总数"};//导出列明
		String b[] = {"OWNER_NAME","COMP_NAME","NUMS"};//导出map中的key
		String gzb = "公司车辆统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.gscltj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/jctj")
	@ResponseBody
	public String jctj(@RequestParam("postData") String postData){
		String msg = formServer.jctj(postData);
		return msg;
	}
	@RequestMapping("jctjexcle")
	@ResponseBody
	public String jctjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"叫车类型","调度完成次数","调度总数","成功率"};//导出列明
		String b[] = {"DISP_TYPE","CG","ZS","lv"};//导出map中的key
		String gzb = "叫车统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.jctj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/zxddtj")
	@ResponseBody
	public String zxddtj(@RequestParam("postData") String postData){
		String msg = formServer.zxddtj(postData);
		return msg;
	}
	@RequestMapping("zxddtjexcle")
	@ResponseBody
	public String zxddtjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"调度人员","调度成功次数","调度总数","成功率"};//导出列明
		String b[] = {"DISP_USER","CG","ZS","lv"};//导出map中的key
		String gzb = "坐席调度统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.zxddtj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/gsjdpm")
	@ResponseBody
	public String gsjdpm(@RequestParam("postData") String postData){
		String msg = formServer.gsjdpm(postData);
		return msg;
	}
	@RequestMapping("gsjdpmexcle")
	@ResponseBody
	public String gsjdpmexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","接单数"};//导出列明
		String b[] = {"COMP_NAME","ZS"};//导出map中的key
		String gzb = "公司接单排名";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.gsjdpm(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/cljdpm")
	@ResponseBody
	public String cljdpm(@RequestParam("postData") String postData){
		String msg = formServer.cljdpm(postData);
		return msg;
	}
	@RequestMapping("cljdpmexcle")
	@ResponseBody
	public String cljdpmexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"车牌号码","虚拟网号","次数","所属公司"};//导出列明
		String b[] = {"VEHI_NO","VSIM_NUM","CS","COMP_NAME"};//导出map中的key
		String gzb = "车辆接单排名";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.cljdpm(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/fsdtj")
	@ResponseBody
	public String fsdtj(@RequestParam("postData") String postData){
		String msg = formServer.fsdtj(postData);
		return msg;
	}
	@RequestMapping("/wsxcl")
	@ResponseBody
	public String wsxcl(@RequestParam("postData") String postData){
		String msg = formServer.wsxcl(postData);
		return msg;
	}
	@RequestMapping("wsxclexcle")
	@ResponseBody
	public String wsxclexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","车牌号码","SIM卡号","终端类型","联系人","联系电话","最后上线时间"};//导出列明
		String b[] = {"COMP_NAME","VEHI_NO","VEHI_SIM","MT_NAME","OWN_NAME","OWN_TEL","TIME"};//导出map中的key
		String gzb = "未上线车辆统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.wsxcl(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/sxltj")
	@ResponseBody
	public String sxltj(@RequestParam("postData") String postData){
		String msg = formServer.sxltj(postData);
		return msg;
	}
	@RequestMapping("sxltjexcle")
	@ResponseBody
	public String sxltjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","车辆总数","上线总数","上线率"};//导出列明
		String b[] = {"COMP_NAME","VEHI_NUM","ONLINE","SXL"};//导出map中的key
		String gzb = "车辆上线率统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.sxltj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/xzcltj")
	@ResponseBody
	public String xzcltj(@RequestParam("postData") String postData){
		String msg = formServer.xzcltj(postData);
		return msg;
	}
	@RequestMapping("xzcltjexcle")
	@ResponseBody
	public String xzcltjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","车号","SIM卡号","联系人","联系电话","安装时间"};//导出列明
		String b[] = {"COMP_NAME","VEHI_NO","SIM_NUM","OWN_NAME","OWN_TEL","MTN_TIME"};//导出map中的key
		String gzb = "新安装车辆统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.xzcltj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/zxsctj")
	@ResponseBody
	public String zxsctj(@RequestParam("postData") String postData){
		String msg = formServer.zxsctj(postData);
		return msg;
	}
	@RequestMapping("zxsctjexcle")
	@ResponseBody
	public String zxsctjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","车牌号码","上线时间","下线时间","定位次数","在线时间（分）"};//导出列明
		String b[] = {"COMP_NAME","VEHI_NO","ZX_TIME","XX_TIME","LOCATION_NUM","DURATION"};//导出map中的key
		String gzb = "在线时间统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.zxsctj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/bjcltj")
	@ResponseBody
	public String bjcltj(@RequestParam("postData") String postData){
		String msg = formServer.bjcltj(postData);
		return msg;
	}
	@RequestMapping("bjcltjexcle")
	@ResponseBody
	public String bjcltjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","车牌号码","SIM卡号","超速报警次数","疲劳报警次数","紧急报警次数","联系人","联系电话"};//导出列明
		String b[] = {"COMP_NAME","VEHI_NO","VEHI_SIM","CS_ALARM","PL_ALARM","JJ_ALARM","OWN_NAME","OWN_TEL"};//导出map中的key
		String gzb = "报警车辆统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.bjcltj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/wyycl")
	@ResponseBody
	public String wyycl(@RequestParam("postData") String postData){
		String msg = formServer.wyycl(postData);
		return msg;
	}
	@RequestMapping("wyyclexcle")
	@ResponseBody
	public String wyyclexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","车牌号码","SIM卡号","终端类型","联系人","联系电话","最后上线时间"};//导出列明
		String b[] = {"COMP_NAME","VEHI_NO","VEHI_SIM","MT_NAME","OWN_NAME","OWN_TEL","TIME"};//导出map中的key
		String gzb = "未营运车辆统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.wyycl(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/kzcztwbhcl")
	@ResponseBody
	public String kzcztwbhcl(@RequestParam("postData") String postData){
		String msg = formServer.kzcztwbhcl(postData);
		return msg;
	}
	@RequestMapping("kzcztwbhclexcle")
	@ResponseBody
	public String kzcztwbhclexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String a[] = formServer.ll(postData);//导出列明
		String b[] = formServer.lll(postData);//导出map中的key
		String gzb = "无空重车变化车辆统计";//导出sheet名和导出的文件名
		String msg = formServer.kzcztwbhcl(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/yyyw")
	@ResponseBody
	public String yyyw(@RequestParam("postData") String postData){
		String msg = formServer.yyyw(postData);
		return msg;
	}
	@RequestMapping("yyywexcle")
	@ResponseBody
	public String yyywexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"受理预约总数","乘客取消预约数","预约取消率","派单成功数","派单成功率"};//导出列明
		String b[] = {"ZS","QX","QXL","CG","CGL"};//导出map中的key
		String gzb = "预约业务统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.yyyw(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/getodlxtj")
	@ResponseBody
	public String getodlxtj(@RequestParam("postData") String postData){
		String msg = formServer.getodlxtj(postData);
		return msg;
	}
	@RequestMapping("odlxtjexcle")
	@ResponseBody
	public String odlxtjexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"目的地","车辆数量"};//导出列明
		String b[] = {"AREA_NAME","COUNT_NUM"};//导出map中的key
		String gzb = "OD流向统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.getodlxtj(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("/getodlxt")
	@ResponseBody
	public String getodlxt(HttpServletRequest request){
		String msg = formServer.getodlxt(request);
		return msg;
	}
	@RequestMapping("/getodyysjfx")
	@ResponseBody
	public String getodyysjfx(@RequestParam("postData") String postData){
		String msg = formServer.getodyysjfx(postData);
		return msg;
	}
	@RequestMapping("yysjfxexcle")
	@ResponseBody
	public String yysjfxexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"总营运次数","营运车辆数","平均营收时长","平均等候时间","平均营收情况","平均实载里程"};//导出列明
		String b[] = {"TJCS","CPHM","YSSC","DHSJ","JINE","SZLC"};//导出map中的key
		String c[] = {"车号","终端编号","营运资格服务证","上车时间","下车时间","计程(公里)","等候时间","交易金额","空驶(公里)","接收时间","卡原额","城市代码"
				,"唯一代码","卡留水号","保留位","交易类型","终端交易流水号","卡类型","钱包累计交易次数","启用时间","存钱时间","TAC交易认证码","POS机号","企业编号"};//导出列明
		String d[] = {"VHIC","SIM","YINGYUN","SCSJ","XCSJ","JICHENG","DENGHOU","JINE","KONGSHI","ZHONGXINTIME","YUANE","CITY"
				,"XIAOFEI","KAHAO","BAOLIU","ZHONGDUANNO","JIAOYI","KATYPE","QIANBAO","QIYONG","JIAKUAN","TAC","POS","QIYE"};//导出map中的key
		String gzb = "OD营运数据分析";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = formServer.getodyysjfx(postData);
		List<Map<String, Object>>tj = DownloadAct.parseJSON2Listx(msg, "tj");
		List<Map<String, Object>>mx = DownloadAct.parseJSON2Listx(msg, "mx");
		DownloadAct.downloadod(request,response,a,b,c,d,gzb,tj,mx);
		return null;
	}
}
