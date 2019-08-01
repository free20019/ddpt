package mvc.controllers;


import helper.Client;
import helper.DownloadAct;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.service.XhcddServer;
import net.sf.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.com.activeMQ.Sender;
import cn.com.activeMQ.SenderJDSB;


@Controller
@RequestMapping(value = "/xhcdd")
public class XhcddAction {
	private XhcddServer xhcddServer;

	public XhcddServer getXhcddServer() {
		return xhcddServer;
	}

	@Autowired
	public void setXhcddServer(XhcddServer xhcddServer) {
		this.xhcddServer = xhcddServer;
	}
	
	/**
	 * 查询业务单
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryorder")
	@ResponseBody
	public String queryorder(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = xhcddServer.queryorder(postData);
		return msg;
	}
	/**
	 * 查询调度区域
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryddqy")
	@ResponseBody
	public String queryddqy(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = xhcddServer.queryddqy();
		return msg;
	}
	/**
	 * 查询来电叫车记录
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryldjl")
	@ResponseBody
	public String queryldjl(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = xhcddServer.queryldjl(postData);
		return msg;
	}
	/**
	 * 发送调度请求
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/xdd")
	@ResponseBody
	public String xdd(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
//		System.out.println(postData);//小货车调度
//		Sender.StartSend("192.168.0.102","hz_paidan_1",postData);
		SenderJDSB.StartSendTopic("192.168.0.102",61626, "hz_paidan_1",postData);
		return "{\"msg\":\"1\"}";
	}
	/**
	 * 重新调度请求
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/cxdd")
	@ResponseBody
	public String cxdd(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
//		System.out.println(postData);
//		Sender.StartSend("192.168.0.102","hz_paidan_1",postData);
		SenderJDSB.StartSendTopic("192.168.0.102",61626, "hz_paidan_1",postData);
//	Sender.StartSend("192.168.0.102","hz_paidan_1",postData);
//		String msg = xhcddServer.cxdd(postData);
//		return msg;
		return "{\"msg\":\"1\"}";
	}
	/**
	 * 发送取消调度请求
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/qxdd")
	@ResponseBody
	public String qxdd(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		SenderJDSB.StartSendTopic("192.168.0.102",61626, "hz_quxiaoyueche_02",postData);
		return "{\"msg\":\"1\"}";
	}
	/**
	 * 黑名单生成
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/createHMD")
	@ResponseBody
	public String createHMD(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.createHMD(postData);
		return msg;
	}
	
	/**
	 * 右键调度完成
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/ddwc")
	@ResponseBody
	public String ddwc(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.ddwc(postData);
		return msg;
	}
	/**
	 * 右键解除锁车
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/jcsc")
	@ResponseBody
	public String jcsc(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.jcsc(postData);
		return msg;
	}
	/**
	 * 右键手动催单
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/sdcd")
	@ResponseBody
	public String sdcd(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
//		Sender.StartSend("192.168.0.102", "hz_dindangxinxi_721",postData);
		SenderJDSB.StartSendTopic("192.168.0.102",61626, "hz_dindangxinxi_721",postData);
		return "{\"msg\":\"1\"}";
	}
	
	/**
	 * 右键短信通知，电话通知
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/dxtz")
	@ResponseBody
	public String dxtz(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
//System.out.println(postData);
		//SenderJDSB.StartSendTopic("192.168.0.102",61626, "hz_quxiaoyueche_02",postData);
		return "{\"msg\":\"1\"}";
	}
	@RequestMapping(value = "/dhtz")
	@ResponseBody
	public String dhtz(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
//		Sender.StartSend("192.168.0.102","hz_quxiaoyueche_02",postData);
		return "{\"msg\":\"1\"}";
	}
	
	/**
	 * 生成回程
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/schc")
	@ResponseBody
	public String schc(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.schc(postData);
		return msg;
	}
	/**
	 * 车辆监控定位
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/xhcdddw")
	@ResponseBody
	public String xhcdddw(HttpServletRequest request
			) throws IOException {
		String msg = xhcddServer.xhcdddw();
		return msg;
	}
	
	/**
	 * 生成新用户
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/addxyh")
	@ResponseBody
	public String addxyh(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.addxyh(postData);
		return msg;
	}
	
	/**
	 * 更新用户
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/edityh")
	@ResponseBody
	public String edityh(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.edityh(postData);
		return msg;
	}
	
	//----------------------------咨询----------------------------
	
	/**
	 * 过滤处理类型
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/querycllx")
	@ResponseBody
	public String querycllx(HttpServletRequest request,@RequestParam("gjz") String gjz
			) throws IOException {
		gjz = java.net.URLDecoder.decode(gjz, "UTF-8");
		String msg = xhcddServer.querycllx(gjz);
		return msg;
	}
	
	/**
	 * 生成咨询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/createZX")
	@ResponseBody
	public String createZX(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.createZX(postData);
		return msg;
	}
	
	/**
	 * 查询来电历史记录
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findbyld")
	@ResponseBody
	public String findbyld(HttpServletRequest request,@RequestParam("zxld") String zxld
			) throws IOException {
		String msg = xhcddServer.findbyld(zxld);
		return msg;
	}
	
	/**
	 * 查询当日咨询历史记录
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findallzx")
	@ResponseBody
	public String findallzx(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.findallzx(postData);
		return msg;
	}
	
	/**
	 * 当日咨询历史记录导出
	 * @return
	 */
	@RequestMapping(value = "/findallzx_daochu")
	@ResponseBody
	public String jybg_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"业务编号","来电号码","姓名","处理状态","处理时间","处理类型","工号","车牌号码","服务内容","处理对象"};//导出列明
		String b[] = {"CS_ID","CS_TELNUM","CS_CLIENT","CS_STATE","CS_DEALDATETIME","CS_TYPE","CS_WORKERNUM","CS_VEHIID","CS_MEMO","CS_OBJECT"};//导出map中的key
		String gzb = "咨询电话记录";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = xhcddServer.findallzx_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 查询one咨询
	 * @param request
	 * @param zxids
	 * @return
	 * @throws IOException
	 */
	
	@RequestMapping(value = "/findonezx")
	@ResponseBody
	public String findonezx(HttpServletRequest request,@RequestParam("zxids") String zxids
			) throws IOException {
		String msg = xhcddServer.findonezx(zxids);
		return msg;
	}
	
	/**
	 * 
	 * @param request
	 * @param postData
	 * @return
	 * @throws IOException
	 */
	
	@RequestMapping(value = "/editzx")
	@ResponseBody
	public String editzx(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		String msg = xhcddServer.editzx(postData);
		return msg;
	}
	/**
	 * 删除咨询
	 * 
	 * @param request
	 * @param zxids
	 * @return
	 */
	@RequestMapping(value = "/delbyzxid")
	@ResponseBody
	public String delbyzxid(HttpServletRequest request,@RequestParam("zxids") String zxids
			) throws IOException {
		String msg = xhcddServer.delbyzxid(zxids.substring(0, zxids.length()-1));
		return msg;
	}
	
	/**
	 * 发送短信
	 * 
	 * @param request
	 * @param msg
	 * @return
	 */
	@RequestMapping(value = "/sendmsg")
	@ResponseBody
	public String sendmsg(HttpServletRequest request,@RequestParam("phone") String phone
			,@RequestParam("message") String message
			) throws IOException {
		Client client = new Client();
		String a = client.start(phone, message);
		return a;
	}
	
	/**
	 * 短息信息
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/getdxxx")
	@ResponseBody
	public String getdxxx(HttpServletRequest request,@RequestParam("dxlx") String dxlx
			) throws IOException {
		String a = xhcddServer.getdxxx(dxlx);
		return a;
	}
	/**
	 * 乘客短息信息
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/senddx")
	@ResponseBody
	public String senddx(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		Map<String,Object> m = xhcddServer.forMap(postData);
		String dh = String.valueOf(m.get("dh"));
		String nr = String.valueOf(m.get("nr"));
//		System.out.println(dh+"    "+nr);
		Client client = new Client();
		String a = client.start(dh, nr);
		return a;
	}
	
	/**
	 * 发送车载短息信息
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/sendcldx")
	@ResponseBody
	public String sendcldx(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
//		System.out.println(postData);
//		Sender.StartSend("192.168.0.102","hz_taxi_905_gj",postData);//小货车调度
		SenderJDSB.StartSendTopic("192.168.0.102",61626, "hz_taxi_905_gj",postData);
		return "{\"msg\":\"1\"}";
	}
	/**
	 * 积分管理
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/jfgl")
	@ResponseBody
	public String jfgl(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String a = xhcddServer.jfgl(postData);
		return a;
	}
	
	/**
	 * 积分清零
	 * 
	 * @param request
	 * @param vehi_no
	 * @return
	 */
	@RequestMapping(value = "/jfql")
	@ResponseBody
	public String jfql(HttpServletRequest request,@RequestParam("vehi_no") String vehi_no
			) throws IOException {
		String msg = xhcddServer.jfql(vehi_no);
		return msg;
	}
	
	/**
	 * 积分补单
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/jfbd")
	@ResponseBody
	public String jfbd(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String a = xhcddServer.jfbd(postData);
		return a;
	}
	
	/**
	 * 积分明细
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/jfmx")
	@ResponseBody
	public String jfmx(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String a = xhcddServer.jfmx(postData);
		return a;
	}
	
	/**
	 * 积分明细导出
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/jfmx_daochu")
	@ResponseBody
	public String jfmx_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"编号","车牌","积分类型","数量","积分余额","生成类型","生成明细","生成时间","工号"};//导出列明
		String b[] = {"JD_ID","VEHI_NO","JF_CLASS","JF_AMOUNT","JF_BALANCE","EVENT_TYPE","EVENT_DETAIL","EVENT_TIME","USER_ID"};//导出map中的key
		String gzb = "积分明细";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = xhcddServer.jfmx_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
	}
	/**
	 * 监控车辆
	 * 
	 * @param request
	 * @param cp
	 * @return
	 */
	@RequestMapping(value = "/jkcl")
	@ResponseBody
	public String jkcl(HttpServletRequest request,@RequestParam("cp") String cp
			) throws IOException {
//		System.out.println(cp);
		String msg = xhcddServer.jkcl(cp);
		return msg;
	}
	
	/**
	 * 附近车辆
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/fjcl")
	@ResponseBody
	public String fjcl(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xhcddServer.fjcl(postData);
		return msg;
	}
	
	/**
	 * 附近空车辆
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/kcdata")
	@ResponseBody
	public String kcdata(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		String msg = xhcddServer.kcdata();
		return msg;
	}
}
