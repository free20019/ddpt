package mvc.controllers;


import helper.DownloadAct;
import mvc.service.KbServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(value = "/kb")
public class KbAction {
	private KbServer kbService;

	public KbServer getKbServer() {
		return kbService;
	}

	@Autowired
	public void setKbServer(KbServer kbService) {
		this.kbService = kbService;
	}
	
	/**
	 * 业务区块
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/ywqk")
	@ResponseBody
	public String ywqk(HttpServletRequest request) {
		String msg = kbService.ywqk();
		return msg;
	}
	
	/**
	 * 终端类型
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/zdlx")
	@ResponseBody
	public String zdlx(HttpServletRequest request
			) {
		String msg = kbService.zdlx();
		return msg;
	}
	
	/**
	 * 车辆类型
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/cllx")
	@ResponseBody
	public String cllx(HttpServletRequest request
			) {
		String msg = kbService.cllx();
		return msg;
	}
	
	/**
	 * 公司
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/company")
	@ResponseBody
	public String company(HttpServletRequest request) {
		String msg = kbService.company();
		return msg;
	}
	@RequestMapping(value = "/company2")
	@ResponseBody
	public String company2(HttpServletRequest request,@RequestParam("keyword") String keyword) {
		String msg = kbService.company2(keyword);
		return msg;
	}
	@RequestMapping(value = "/company3")
	@ResponseBody
	public String company3(HttpServletRequest request) {
		String msg = kbService.company3();
		return msg;
	}
	/**
	 * SIM卡
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/simka")
	@ResponseBody
	public String simka(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.simka(postData);
		return msg;
	}
	
	/**
	 * 车牌号码
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/vehino")
	@ResponseBody
	public String vehino(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.vehino(postData);
		return msg;
	}
	@RequestMapping(value = "/vehino2")
	@ResponseBody
	public String vehino2(HttpServletRequest request,@RequestParam("keyword") String keyword
			) {
		String msg = kbService.vehino2(keyword);
		return msg;
	}
	/**
	 * 虚拟卡号
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/vsimka")
	@ResponseBody
	public String vsimka(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.vsimka(postData);
		return msg;
	}
	
	/**
	 * 查询车辆
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/querycl")
	@ResponseBody
	public String querycl(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.querycl(postData);
		return msg;
	}
	
	/**
	 * 查询车辆导出
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/querycl_daochu")
	@ResponseBody
	public String querycl_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"业务区块","分公司","车牌号码","SIM卡号","车主姓名","车主电话","白班电话","晚班电话","终端号","车号","终端名","终端子类型","车型","虚拟卡号","调度类型","查询密码","安装时间","安装人员","主机安装位置","LCD安装位置","电源类型","有无通话功能","开通时间","备注","调度总数","投诉总数","积分","驻点积分"};//导出列明
		String b[] = {"OWNER_NAME","COMP_NAME","VEHI_NO","VEHI_SIM","OWN_NAME","OWN_TEL","HOME_TEL","NIGHT_TEL","MDT_NO","VEHI_NUM","MT_NAME","MDT_SUB_TYPE","VT_NAME","VSIM_NUM","DISP_TYPE","QRY_PWD","INST_TIME","INST_MAN","INST_POSITION","LCD_INST_POSITION","ELEC_TYPE","TALK_FUNC","SIM_TIME","NOTE","DISP_NUM","COMPL_NUM","INTEGRAL","INTEGRALYANGZHAO"};//导出map中的key
		String gzb = "车辆查询数据";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = kbService.querycl_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	/**
	 * 查询电话客户
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/querydh")
	@ResponseBody
	public String querydh(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.querydh(postData);
		return msg;
	}
	
	/**
	 * 查询单个电话客户
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findonedh")
	@ResponseBody
	public String findonedh(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.findonedh(postData);
		return msg;
	}
	/**
	 * 添加电话客户
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/adddh")
	@ResponseBody
	public String adddh(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.adddh(postData);
		if(msg>=1){
			return "{\"msg\":\"添加成功\"}";
		}else{
			return "{\"msg\":\"添加失败\"}";
		}
	}
	
	/**
	 * 修改电话客户
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/editdh")
	@ResponseBody
	public String editdh(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.editdh(postData);
		if(msg>=1){
			return "{\"msg\":\"修改成功\"}";
		}else{
			return "{\"msg\":\"修改失败\"}";
		}
	}
	
	/**
	 * 删除电话客户
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/deldh")
	@ResponseBody
	public String deldh(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.deldh(postData);
		if(msg>=1){
			return "{\"msg\":\"删除成功\"}";
		}else{
			return "{\"msg\":\"删除失败\"}";
		}
	}
	
	/**
	 * 查询距离
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjl")
	@ResponseBody
	public String queryjl(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.queryjl(postData);
		return msg;
	}
	
	/**
	 * 查询单个距离
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findonejl")
	@ResponseBody
	public String findonejl(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.findonejl(postData);
		return msg;
	}
	/**
	 * 添加距离
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/addjl")
	@ResponseBody
	public String addjl(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.addjl(postData);
		if(msg>=1){
			return "{\"msg\":\"添加成功\"}";
		}else{
			return "{\"msg\":\"添加失败\"}";
		}
	}
	
	/**
	 * 修改距离
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/editjl")
	@ResponseBody
	public String editjl(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.editjl(postData);
		if(msg>=1){
			return "{\"msg\":\"修改成功\"}";
		}else{
			return "{\"msg\":\"修改失败\"}";
		}
	}
	
	/**
	 * 删除距离
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/deljl")
	@ResponseBody
	public String deljl(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.deljl(postData);
		if(msg>=1){
			return "{\"msg\":\"删除成功\"}";
		}else{
			return "{\"msg\":\"删除失败\"}";
		}
	}
	
	/**
	 * 查询业务
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyw")
	@ResponseBody
	public String queryyw(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.queryyw(postData);
		return msg;
	}
	
	/**
	 * 查询业务导出
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyw_daochu")
	@ResponseBody
	public String queryyw_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"业务编号","客户姓名","联系电话","调度区域","详细地址","调度员","所派车辆","调度状态","调度时间","约车类型","附加信息","目的地址","公司","终端类型","是否投诉","下单时间","是否自动外拨","外拨号码","外呼状态"};//导出列明
		String b[] = {"DISP_ID","CUST_NAME","CUST_TEL","SZQY","ADDRESS","DISP_USER","VEHI_NO","DISP_STATE","DISP_TIME","DISP_TYPE","NOTE","DEST_ADDRESS","GSMC","ZDLX","ISCOMPL","DISP_TIME","AUTOOUTPHONE","OUTPHONE","CALL_STATE"};//导出map中的key
		String gzb = "调度业务数据";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = kbService.queryyw_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	/**
	 * 查询客户信息
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/querykhxx")
	@ResponseBody
	public String querykhxx(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.querykhxx(postData);
		return msg;
	}
	
	/**
	 * 查询客户信息导出
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/querykhxx_daochu")
	@ResponseBody
	public String querykhxx_daochu(HttpServletRequest request,HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"客户姓名","客户电话","客户地址","客户参考地址","投诉数量","叫车总数","成功总数","客户等级","最后叫车时间","备注"};//导出列明
		String b[] = {"CI_NAME","CI_TEL","ADDRESS","ADDRES_REF","COMPL_NUM","DISP_NUM","SUCCESS_NUM","CI_GRADE","REC_TIME","NOTE"};//导出map中的key
		String gzb = "客户信息";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = kbService.querykhxx_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	/**
	 * 查询地址
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/querydz")
	@ResponseBody
	public String querydz(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.querydz(postData);
		return msg;
	}
	
	/**
	 * 查询单个地址
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findonedz")
	@ResponseBody
	public String findonedz(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.findonedz(postData);
		return msg;
	}
	/**
	 * 添加地址
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/adddz")
	@ResponseBody
	public String adddz(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.adddz(postData);
		if(msg>=1){
			return "{\"msg\":\"添加成功\"}";
		}else{
			return "{\"msg\":\"添加失败\"}";
		}
	}
	
	/**
	 * 修改地址
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/editdz")
	@ResponseBody
	public String editdz(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.editdz(postData);
		if(msg>=1){
			return "{\"msg\":\"修改成功\"}";
		}else{
			return "{\"msg\":\"修改失败\"}";
		}
	}
	
	/**
	 * 删除地址
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/deldz")
	@ResponseBody
	public String deldz(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.deldz(postData);
		if(msg>=1){
			return "{\"msg\":\"删除成功\"}";
		}else{
			return "{\"msg\":\"删除失败\"}";
		}
	}
	
	/**
	 * 查询预约
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyy")
	@ResponseBody
	public String queryyy(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.queryyy(postData);
		return msg;
	}
	
	/**
	 * 预约业务导出
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyy_daochu")
	@ResponseBody
	public String queryyy_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"业务编号","约车时间","客户姓名","联系电话","详细地址","调度员","所派车辆","调度状态","调度时间","约车类型","附加信息","目的地址","公司","终端类型","是否投诉","下单时间","是否自动外拨","外拨号码","外呼状态"};//导出列明
		String b[] = {"DISP_ID","YC_TIME","CUST_NAME","CUST_TEL","ADDRESS","DISP_USER","VEHI_NO","DISP_STATE","DISP_TIME","DISP_TYPE","NOTE","DEST_ADDRESS","GSMC","ZDLX","ISCOMPL","DISP_TIME","AUTOOUTPHONE","OUTPHONE","CALL_STATE"};//导出map中的key
		String gzb = "预约调度业务数据";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = kbService.queryyy_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 取消预约
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/qxyy")
	@ResponseBody
	public String qxyy(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		int msg = kbService.qxyy(postData);
		if(msg>=1){
			return "{\"msg\":\"取消成功\"}";
		}else{
			return "{\"msg\":\"取消失败\"}";	
		}
	}
	
	/**
	 * 查询咨询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryzx")
	@ResponseBody
	public String queryzx(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.queryzx(postData);
		return msg;
	}
	/**
	 * 查询咨询导出
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryzx_daochu")
	@ResponseBody
	public String queryzx_daochu(HttpServletRequest request,HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"来电电话","客户姓名","处理时间","处理状态","处理类型","工号","车辆","服务内容","处理对象"};//导出列明
		String b[] = {"CS_TELNUM","CS_CLIENT","CS_DEALDATETIME","CS_STATE","CS_TYPE","CS_WORKERNUM","CS_VEHIID","CS_MEMO","CS_OBJECT"};//导出map中的key
		String gzb = "咨询记录";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = kbService.queryzx_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	/**
	 * 查询监控
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjk")
	@ResponseBody
	public String queryjk(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = kbService.queryjk(postData);
		return msg;
	}
}
