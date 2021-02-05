package mvc.controllers;


import cn.com.activeMQ.Sender;
import helper.Client;
import helper.DownloadAct;
import mvc.service.DdxptServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping(value = "/ddxpt")
public class DdxptAction {
	private DdxptServer ddxptService;

	public DdxptServer getDdxptServer() {
		return ddxptService;
	}

	@Autowired
	public void setDdxptServer(DdxptServer ddxptService) {
		this.ddxptService = ddxptService;
	}
	
	/**
	 * 车牌号码
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findcp")
	@ResponseBody
	public String findcp(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = ddxptService.findcp(postData);
		return msg;
	}
	
	@RequestMapping(value = "/findallcp")
	@ResponseBody
	public String findallcp(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = ddxptService.findallcp();
		return msg;
	}
	/**
	 * 车队
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findcd")
	@ResponseBody
	public String findcd(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = ddxptService.findcd();
		return msg;
	}
	/**
	 * 车队cps
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findcdcars")
	@ResponseBody
	public String findcdcars(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = ddxptService.findcdcars(postData);
		return msg;
	}
	/**
	 * add车队
	 * 
	 * @param request
	 * @param postData
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	@RequestMapping(value = "/addcd")
	@ResponseBody
	public String addcd(HttpServletRequest request,@RequestParam("postData") String postData
			) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = ddxptService.addcd(postData);
		return msg;
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
		String msg = ddxptService.queryorder(postData);
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
		String msg = ddxptService.queryddqy();
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
		String msg = ddxptService.queryldjl(postData);
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
//		System.out.println(postData);
		boolean msg = ddxptService.queryYhq(postData);
		if(msg){
			Sender.StartSend("192.168.0.102","hz_paidan_1",postData);
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"2\"}";//没有该优惠券
		}

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
		String msg = ddxptService.cxdd(postData);
		if(msg.equals("0")){
		    Sender.StartSend("192.168.0.102","hz_paidan_1",postData);
		    return "{\"msg\":\"0\"}";
		}else{
		    return "{\"msg\":\"1\"}";
		}
		

	//	Sender.StartSend("192.168.0.102","hz_paidan_1",postData);
//		String msg = ddxptService.cxdd(postData);
//		return msg;
		
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
		boolean a = ddxptService.ishq(postData);
		if(a){
			String isu = ddxptService.getisu(postData);
			String xx = "{\"cmd\":\"0x8300\",\"isu\":\""+isu+"\",\"content\":\"不好意思，客人已取消用车，您不用过去接乘客!\",\"flag\":\"0\"}";
			Sender.StartSend("192.168.0.102","hz_taxi_905_gj",xx);
		}else{
			Sender.StartSend("192.168.0.102","hz_quxiaoyueche_02",postData);
		}
		ddxptService.ddqx(postData);
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
		String msg = ddxptService.createHMD(postData);
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
		String msg = ddxptService.ddwc(postData);
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
		String msg = ddxptService.jcsc(postData);
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
		Sender.StartSend("192.168.0.102", "hz_dindangxinxi_721",postData);
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
		Sender.StartSend("192.168.0.102","hz_quxiaoyueche_02",postData);
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
		String msg = ddxptService.schc(postData);
		return msg;
	}
	/**
	 * 车辆监控定位
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/dwjkcl")
	@ResponseBody
	public String dwjkcl(HttpServletRequest request,@RequestParam("cp") String cp
			) throws IOException {
		String msg = ddxptService.dwjkcl(cp);
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
		String msg = ddxptService.addxyh(postData);
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
		String msg = ddxptService.edityh(postData);
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
		String msg = ddxptService.querycllx(gjz);
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
		String msg = ddxptService.createZX(postData);
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
		String msg = ddxptService.findbyld(zxld);
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
		String msg = ddxptService.findallzx(postData);
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
		List<Map<String, Object>>list = ddxptService.findallzx_daochu(postData);
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
		String msg = ddxptService.findonezx(zxids);
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
		String msg = ddxptService.editzx(postData);
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
		String msg = ddxptService.delbyzxid(zxids.substring(0, zxids.length()-1));
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
		String a = ddxptService.getdxxx(dxlx);
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
		Map<String,Object> m = ddxptService.forMap(postData);
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
//		Sender.StartSend("192.168.0.102","hz_taxi_905_gj",postData);
//		return "{\"msg\":\"1\"}";
		
		
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		Sender.StartSend("192.168.0.102","hz_taxi_905_gj",postData);
		ddxptService.xxck(postData);
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
		String a = ddxptService.jfgl(postData);
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
		String msg = ddxptService.jfql(vehi_no);
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
		String a = ddxptService.jfbd(postData);
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
		String a = ddxptService.jfmx(postData);
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
		List<Map<String, Object>>list = ddxptService.jfmx_daochu(postData);
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
		String msg = ddxptService.jkcl(cp);
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
		String msg = ddxptService.fjcl(postData);
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
		String msg = ddxptService.kcdata();
		return msg;
	}
	
	/**
	 * 查找车辆信息
	 * 
	 * @param request
	 * @param mdtno
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/findclxx")
    @ResponseBody
    public String findclxx(HttpServletRequest request,@RequestParam("mdtno") String mdtno
            ) throws IOException {
        String msg = ddxptService.findclxx(mdtno);
        return msg;
    }
	/**
	 * 查找优惠券
	 *
	 * @param num
	 * @return
	 */
	@RequestMapping(value = "/findyhq")
    @ResponseBody
    public String findyhq(HttpServletRequest request,@RequestParam("num") String num
            ){
        String msg = ddxptService.findyhq(num);
        return msg;
    }

	/**
	 * 修改优惠券已使用
	 *
	 * @param dispid
	 * @return
	 */
	@RequestMapping(value = "/updateYhqIsuse")
	@ResponseBody
	public String updateYhqIsuse(HttpServletRequest request,@RequestParam("dispid") String dispid
	){
		String msg = ddxptService.updateYhqIsuse(dispid);
		return msg;
	}

	/**
	 * 查找附近车辆
	 *
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/findaxddfjcl")
	@ResponseBody
	public String findaxddfjcl(HttpServletRequest request,@RequestParam("postData") String postData
	){
		String msg = ddxptService.findaxddfjcl(postData);
		return msg;
	}


	/**
	 * 人工爱心调度
	 *
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/zxrgaxdd")
	@ResponseBody
	public String zxrgaxdd(HttpServletRequest request,@RequestParam("postData") String postData
	) throws IOException {
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = ddxptService.zxrgaxdd(postData);
		return msg;
	}
}
