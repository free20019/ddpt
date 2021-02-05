package mvc.controllers;


import helper.DownloadAct;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.service.CommonServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
/**
 * 公共基础类，通用方法
 * 公司、分公司、车辆等下拉框
 */
@Controller
@RequestMapping(value = "/common")
public class CommonAction {
	private CommonServer commonService;

	public CommonServer getCommonServer() {
		return commonService;
	}

	@Autowired
	public void setCommonServer(CommonServer commonService) {
		this.commonService = commonService;
	}

	@RequestMapping(value = "/ssjk")
	@ResponseBody
	public String ssjk(HttpServletRequest request,@RequestParam("postData") String postData
			) {
		String msg = commonService.ssjk(postData);
		return msg;
	}
	//区块
	@RequestMapping("/findqk")
	@ResponseBody
	public String findqk(){
		String msg = commonService.findqk();
		return msg;
	}
	//公司
	@RequestMapping("findba")
	@ResponseBody
	public String findba(){
		String msg = commonService.findba();
		return msg;
	}
	@RequestMapping("findbatj")
	@ResponseBody
	public String findbatj(@RequestParam("comp_name") String comp_name){
		String msg = commonService.findbatj(comp_name);
		return msg;
	}
	//分公司
	@RequestMapping("/findcomp")
	@ResponseBody
	public String fingcomp(@RequestParam("ba_id") String ba_id){
		String msg = commonService.findcomp(ba_id);
		return msg;
	}
	@RequestMapping("/findcomp_tj")
	@ResponseBody
	public String findcomp_tj(@RequestParam("comp_name") String comp_name){
		String msg = commonService.findcomp_tj(comp_name);
		return msg;
	}
	//车辆
	@RequestMapping("/findvhic")
	@ResponseBody
	public String findvhic(@RequestParam("ba_id") String ba_id,@RequestParam("comp_id") String comp_id){
		String msg = commonService.findvhic(ba_id, comp_id);
		return msg;
	}
	@RequestMapping("/findvhictj")
	@ResponseBody
	public String findvhictj(@RequestParam("vhic") String vhic){
		String msg = commonService.findvhictj(vhic);
		return msg;
	}
	//区域
	@RequestMapping("/findqy")
	@ResponseBody
	public String findqy(){
		String msg = commonService.findqy();
		return msg;
	}
	//地图
	@RequestMapping("/finddt")
	@ResponseBody
	public String finddt(){
		String msg = commonService.finddt();
		return msg;
	}
	//车型
	@RequestMapping("/findcllx")
	@ResponseBody
	public String findcllx(){
		String msg = commonService.findcllx();
		return msg;
	}
	@RequestMapping("/findcllxtj")
	@ResponseBody
	public String findcllxtj(@RequestParam("info") String info){
		String msg = commonService.findcllxtj(info);
		return msg;
	}
	//车辆颜色
	@RequestMapping("/findclys")
	@ResponseBody
	public String findclys(){
		String msg = commonService.findclys();
		return msg;
	}
	//车牌类型
	@RequestMapping("/findcplx")
	@ResponseBody
	public String findcplx(){
		String msg = commonService.findcplx();
		return msg;
	}
	//车辆类型
	@RequestMapping("/findclzt")
	@ResponseBody
	public String findclzt(){
		String msg = commonService.findclzt();
		return msg;
	}
	//车牌颜色
	@RequestMapping("/findcpys")
	@ResponseBody
	public String findcpys(){
		String msg = commonService.findcpys();
		return msg;
	}
	//车牌号码
	@RequestMapping("/findcptj")
	@ResponseBody
	public String findcptj(@RequestParam("cp_name") String cp_name){
		String msg = commonService.findcptj(cp_name);
		return msg;
	}
	//小货车车牌号码
		@RequestMapping("/fingcp")
		@ResponseBody
		public String fingcp(){
			String msg = commonService.fingcp();
			return msg;
		}
	//市区
	@RequestMapping("/findsqtj")
	@ResponseBody
	public String findsqtj(@RequestParam("sq_name") String sq_name){
		String msg = commonService.findsqtj(sq_name);
		return msg;
	}
	@RequestMapping("/findsq")
	@ResponseBody
	public String findsq(){
		String msg = commonService.findsq();
		return msg;
	}
	//业户名称
	@RequestMapping("/findyh")
	@ResponseBody
	public String findyh(){
		String msg = commonService.findyh();
		return msg;
	}
	@RequestMapping("/findyhtj")
	@ResponseBody
	public String findyhtj(@RequestParam("yh_name") String yh_name){
		String msg = commonService.findyhtj(yh_name);
		return msg;
	}
	//小货车经营范围
		@RequestMapping("/findjyfw")
		@ResponseBody
		public String findjyfw(){
			String msg = commonService.findjyfw();
			return msg;
		}
		//小货车车辆类型
		@RequestMapping("/findcllxxh")
		@ResponseBody
		public String findcllxxh(){
			String msg = commonService.findcllxxh();
			return msg;
		}
		//小货车车辆型号
		@RequestMapping("/findxh")
		@ResponseBody
		public String findxh(){
			String msg = commonService.findxh();
			return msg;
		}
		@RequestMapping("/findxhtj")
		@ResponseBody
		public String findxhtj(@RequestParam("cp_name") String cp_name){
			String msg = commonService.findxhtj(cp_name);
			return msg;
		}
	//小货车燃料类型
		@RequestMapping("/findrllx")
		@ResponseBody
		public String findrllx(){
			String msg = commonService.findrllx();
			return msg;
		}
	//驾驶员所在区块
		@RequestMapping("/findsqm")
		@ResponseBody
		public String findsq1(){
			String msg = commonService.findsqm();
			return msg;
		}
		@RequestMapping("/findsqmtj")
		@ResponseBody
		public String findsqmtj(@RequestParam("sqm_name") String sqm_name){
			String msg = commonService.findsqmtj(sqm_name);
			return msg;
		}
	//驾驶员电话号码
		@RequestMapping("/findphone")
		@ResponseBody
		public String findphone(){
			String msg = commonService.findphone();
			return msg;
		}
		@RequestMapping("/findphonetj")
		@ResponseBody
		public String findphonetj(@RequestParam("phone_name") String phone_name){
			String msg = commonService.findphonetj(phone_name);
			return msg;
		}
	//驾驶员所在公司名
		@RequestMapping("/findgsm")
		@ResponseBody
		public String findgsm(){
			String msg = commonService.findgsm();
			return msg;
		}
		@RequestMapping("/findgsmtj")
		@ResponseBody
		public String findgsmtj(@RequestParam("cp_name") String cp_name){
			String msg = commonService.findgsmtj(cp_name);
			return msg;
		}
	//违章执法区域
		@RequestMapping("/fingzfqy")
		@ResponseBody
		public String fingzfqy(){
			String msg = commonService.fingzfqy();
			return msg;
		}
		@RequestMapping("/findzfqytj")
		@ResponseBody
		public String findzfqytj(@RequestParam("qy_name") String qy_name){
			String msg = commonService.findzfqytj(qy_name);
			return msg;
		}
	//违章执法机构
		@RequestMapping("/fingzfbm")
		@ResponseBody
		public String fingzfbm(){
			String msg = commonService.fingzfbm();
			return msg;
		}
		@RequestMapping("/findzfbmtj")
		@ResponseBody
		public String findzfbmtj(@RequestParam("bm_name") String bm_name){
			String msg = commonService.findzfbmtj(bm_name);
			return msg;
		}
		//所在县区
			@RequestMapping("/fingzfxq")
			@ResponseBody
			public String fingzfxq(){
				String msg = commonService.fingzfxq();
				return msg;
			}
			@RequestMapping("/findzfxqtj")
			@ResponseBody
			public String findzfxqtj(@RequestParam("xq_name") String xq_name){
				String msg = commonService.findzfxqtj(xq_name);
				return msg;
			}
	//违章车辆所在公司
		@RequestMapping("/findgsmc")
		@ResponseBody
		public String findgsmc(){
			String msg = commonService.findgsmc();
			return msg;
		}
		@RequestMapping("/findgsmctj")
		@ResponseBody
		public String findgsmctj(@RequestParam("gsm_name") String gsm_name){
			String msg = commonService.findgsmctj(gsm_name);
			return msg;
		}
	//终端类型
	@RequestMapping("/findzdlx")
	@ResponseBody
	public String findzdlx(){
		String msg = commonService.findzdlx();
		return msg;
	}
	//终端型号
	@RequestMapping("/findzdxh")
	@ResponseBody
	public String findzdxh(){
		String msg = commonService.findzdxh();
		return msg;
	}
	//通信类型
	@RequestMapping("/findtxlx")
	@ResponseBody
	public String findtxlx(){
		String msg = commonService.findtxlx();
		return msg;
	}
	//终端状态
	@RequestMapping("/findzdzt")
	@ResponseBody
	public String findzdzt(){
		String msg = commonService.findzdzt();
		return msg;
	}
	//权限列表
	@RequestMapping("/findqxlb")
	@ResponseBody
	public String findqxlb(){
		String msg = commonService.findqxlb();
		return msg;
	}
	
	
	//考勤导出forwyy
	@RequestMapping(value = "/kq")
	@ResponseBody
	public String kq(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("rq") String rq) throws IOException{
		String a[] = {"姓名","签到时间","原因","签退时间","原因"};//导出列明
		String b[] = {"USERNAME","QDTIME","CDYY","QTTIME","ZTYY"};//导出map中的key
		String gzb = "考勤记录("+rq+")";//导出sheet名和导出的文件名
		List<Map<String, Object>>list = commonService.kq(rq);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	@RequestMapping(value = "/upload")
	@ResponseBody
	public String upload(HttpServletRequest request,HttpServletResponse response) {
		String msg = "";
	  msg = commonService.upload(request, response,"1");
	  return msg;
	}
	@RequestMapping(value = "/dz")
	@ResponseBody
	public String dz(HttpServletRequest request,@RequestParam("dz") String dz) {
		String msg = commonService.dz(request, dz);
		return msg;
	}
	@RequestMapping(value = "/query_pic")
	@ResponseBody
	public String query_pic(HttpServletRequest request,HttpServletResponse response) {
		String msg = "";
		commonService.query_pic(request, response);
	    return msg;
	}
}
