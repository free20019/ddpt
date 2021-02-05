package mvc.controllers;


import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import helper.DownloadAct;
import mvc.service.BackExcelServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/backExcel")
public class BackExcelAction {
	private BackExcelServer backExcelServer;

	public BackExcelServer getBackExcelServer() {
		return backExcelServer;
	}
	@Autowired
	public void setBackExcelServer(BackExcelServer backExcelServer) {
		this.backExcelServer = backExcelServer;
	}
	@RequestMapping("findqkbexcle")
	@ResponseBody
	public String findqkbexcle(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"车牌类型","备注"};//导出列明
		String b[] = {"VNT_NAME","NOTE"};//导出map中的key
		String gzb = "区块表";//导出sheet名和导出的文件名
		String msg = backExcelServer.findzacqkb();
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findgsbexcle")
	@ResponseBody
	public String findgsbexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"业务区块","公司名称","分公司名称","备注"};//导出列明
		String b[] = {"OWNER_NAME","BA_NAME","COMP_NAME","NOTE"};//导出map中的key
		String gzb = "公司表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findgsb(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findzdbexcle")
	@ResponseBody
	public String findzdbexcle(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"终端类型名称","总数","备注"};//导出列明
		String b[] = {"MT_NAME","NUM","NOTE"};//导出map中的key
		String gzb = "终端表表";//导出sheet名和导出的文件名
		String msg = backExcelServer.findzdb();
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findcxbexcle")
	@ResponseBody
	public String findcxbexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"车辆类型","总数","备注"};//导出列明
		String b[] = {"VT_NAME","NUM","NOTE"};//导出map中的key
		String gzb = "车型表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findcxb(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findysbexcle")
	@ResponseBody
	public String findysbexcle(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"车辆颜色","总数","备注"};//导出列明
		String b[] = {"VC_NAME","NUM","NOTE"};//导出map中的key
		String gzb = "颜色表";//导出sheet名和导出的文件名
		String msg = backExcelServer.findysb();
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findtxbexcle")
	@ResponseBody
	public String findtxbexcle(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"通信类型名","总数","备注"};//导出列明
		String b[] = {"CT_NAME","NUM","NOTE"};//导出map中的key
		String gzb = "通信表";//导出sheet名和导出的文件名
		String msg = backExcelServer.findtxb();
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findddbexcle")
	@ResponseBody
	public String findddbexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"客户编号","客户名","调度类型","客户电话","参考地址","详细地址","叫车数量","目的地","派车车号","SIM卡号","所属公司","调度状态","调度员编号","调度时间","备注"};//导出列明
		String b[] = {"CI_ID","CUST_NAME","DISP_TYPE","CUST_TEL","ADDRESS_REF","ADDRESS","VEHI_NUM","DEST_ADDRESS","VEHI_NO","SIM_NUM","COMP_NAME","DISP_STATE","DISP_USER","DISP_TIME","NOTE"};//导出map中的key
		String gzb = "调度表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findddb(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("finddwbexcle")
	@ResponseBody
	public String finddwbexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"地点","定位点","备注"};//导出列明
		String b[] = {"PNAME","GPNAME","NOTE"};//导出map中的key
		String gzb = "定位表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.finddwb(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findqybexcle")
	@ResponseBody
	public String findqybexcle(HttpServletRequest request,
			HttpServletResponse response) throws IOException{
		String a[] = {"区域名称","区域代码","区域类型","地图名称","父节点编号","父节点路径","经度","纬度","排序号","备注"};//导出列明
		String b[] = {"RE_NAME","RE_NUM","RE_TYPE","MAP_NAME","PARENT_ID","PARE_PATH","LONGI","LATI","ORDER_ID","NOTE"};//导出map中的key
		String gzb = "区域表";//导出sheet名和导出的文件名
		String msg = backExcelServer.findqyb();
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("finddkhexcle")
	@ResponseBody
	public String finddkhexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"客户名","客户电话","客户地址","备注"};//导出列明
		String b[] = {"CUST_NAME","CUST_TEL","CUST_ADDR","NOTE"};//导出map中的key
		String gzb = "客户表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findkhb(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("clbdcexcle")
	@ResponseBody
	public String clbdcexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"业务区块","公司名称","分公司名","车辆编号","车辆号码","终端编号","终端类型","通信类型名","SIM卡号","燃料类型","车主姓名","车主电话","白班电话",
				"晚班电话","车辆类型","查询密码","车辆颜色","车牌颜色","车辆子公司","初装时间","改造时间","升级时间","车辆状态","车辆子型号","终端型号","虚拟网","备注"};//导出列明
		String b[] = {"VNT_NAME","BA_NAME","COMP_NAME","VEHI_NUM","VEHI_NO","MDT_NO","MT_NAME","CT_NAME","SIM_NUM","RLLX","OWN_NAME","OWN_TEL",
				"HOME_TEL","NIGHT_TEL","VT_NAME","QRY_PWD","VC_NAME","VNC_NAME","BASIS_COMP","CZSJ","RECONSTRUCT_DATE","UP_DATE",
				"VS_NAME","VIRWEB","MDT_SUB_TYPE","VSIM_NUM","NOTE"};//导出map中的key
		String gzb = "车辆表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.clbdc(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findclxxexcle")
	@ResponseBody
	public String findclxxexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"车牌号码","车辆类型","业户名称","经营许可证号","道路运输证号","核发日期","有效日期","经营范围","状态","车身颜色","行政区划","证照是否过期","燃料类型","排放标准"};//导出列明
		String b[] = {"PLATE_NUMBER","VEHICLE_TYPE_NAME","COMPANY_NAME","COMPANY_LICENSE_NUMBER","LICENSE_NUMBER","HFSJ","YXSJ","BUSINESS_SCOPE_NAME","STATUS_NAME","COLOR","AREA_NAME","IS_EXPIRED","FUEL_NAME","EMISSION_STANDARD"};//导出map中的key
		String gzb = "车辆信息";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findclxx(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findwzexcle")
	@ResponseBody
	public String findwzexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"当事人姓名","车号","扣分","违章时间","执法时间","录入时间","案件原因","执法部门","执法区域","业户名称","经营许可证号"};//导出列明
		String b[] = {"PARTY_NAME","AUTO_NUM","INTEGRAL","WFSJ","ZFSJ","LRSJ","CASE_REASON","ORGAN","AREA","COM_NAME","LIENCE_NUM"};//导出map中的key
		String gzb = "小货车车辆违章信息";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findwz(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findjsyexcle")
	@ResponseBody
	public String findjsyexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"身份证号","姓名","电话号码","公司","经营许可证号","服务证号","车号","资格证有效期止","分值","证照状态"};//导出列明
		String b[] = {"ID_NUMBER","NAME","MOBILE_PHONE","COMPANY_NAME","COMPANY_LICENSE_NUMBER","SERVER_CARD_NUM","PLATE_NUMBER","ZGZSJ","ASSESS_SCORE","STATUS_NAME"};//导出map中的key
		String gzb = "小货车驾驶员信息";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findjsy(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findgswzbexcle")
	@ResponseBody
	public String findgswzbexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"车牌号","公司名称","违章次数","IC卡分值"};//导出列明
		String b[] = {"AUTO_NUM","COM_NAME","COUNT1","IC_SCORE"};//导出map中的key
		String gzb = "公司违章车辆";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findgswz(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findwzxxexcle")
	@ResponseBody
	public String findwzxxexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"当事人姓名","公司名","车号","扣分","违章时间","案件原因","执法部门","执法区域"};//导出列明
		String b[] = {"PARTY_NAME","COM_NAME","AUTO_NUM","INTEGRAL","WZSJ","CASE_REASON","ORGAN","AREA"};//导出map中的key
		String gzb = "公司违章车辆信息";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findwzxx(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findtjbexcle")
	@ResponseBody
	public String findtjbexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司名","公司所有车辆","公司违章车辆","公司所有车辆总违章次数"};//导出列明
		String b[] = {"COMPANY_NAME","COUNT1","COUNT2","COUNT3"};//导出map中的key
		String gzb = "公司违章车辆统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findtjb(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findnewoldexcle")
	@ResponseBody
	public String findnewoldexcle(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"新车牌","新车牌所属公司","旧车牌","旧车牌所属公司","时间"};//导出列明
		String b[] = {"NEW_VHIC","NEW_COMP_NAME","OLD_VHIC","OLD_COMP_NAME","TIME"};//导出map中的key
		String gzb = "新旧车牌";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findnewoldexcle(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findkhb2excel")
	@ResponseBody
	public String findkhb2excel(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"客户名","客户电话","用户级别","性别","是否爱心用户","其他联系电话","地址","备注"};//导出列明
		String b[] = {"CUST_NAME","CUST_TEL","JB","CUST_SEX","IS_LOVE","CUST_TEL_OTHER","ADDRESS_KJ","NOTE"};//导出map中的key
		String gzb = "客户表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findkhb2excel(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findyhqexcel")
	@ResponseBody
	public String findyhqexcel(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"优惠券编号","生成日期","开始日期","结束日期","添加人","是否使用","是否有效"};//导出列明
		String b[] = {"COUPON_NUM","ATIME","STIME","ETIME","USER","USE","YX"};//导出map中的key
		String gzb = "优惠券";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = backExcelServer.findyhq(postData);
		List<Map<String, Object>>list = DownloadAct.parseJSON2List2(msg);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
	@RequestMapping("findsjbexcel")
	@ResponseBody
	public String findsjbexcel(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"公司","车号","司机姓名","联系电话","燃料类型","车型","备注"};//导出列明
		String b[] = {"COMP_NAME","VEHI_NO","NAME","PHONE","RLLX","VT_NAME","NOTE"};//导出map中的key
		String gzb = "司机表";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>> list = backExcelServer.findsjb(postData);
		DownloadAct.download(request,response,a,b,gzb,list);
		return null;
	}
}
