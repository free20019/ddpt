package mvc.controllers;


import helper.DownloadAct;
import helper.JacksonUtil;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mvc.service.ZhywServer;

import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/zhyw")
public class ZhywAction {
	private ZhywServer zhywServer;

	public ZhywServer getZhywServer() {
		return zhywServer;
	}

	@Autowired
	public void setZhywServer(ZhywServer zhywServer) {
		this.zhywServer = zhywServer;
	}
	
    private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

	/**
	 * 车辆现金交易查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryclxjjy")
	@ResponseBody
	public String queryclxjjy(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryclxjjy(postData);
		return msg;
	}
	
	/**
	 * 车辆现金交易导出
	 * @return
	 */
	@RequestMapping(value = "/clxjjy_daochu")
	@ResponseBody
	public String jybg_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"营运类型","区域","公司","车牌号码","终端编号","营运资格服务证","上车时间","下车时间","计程(公里)","等候时间","交易金额(元)","空驶(公里)","接收时间"};//导出列明
		String b[] = {"JIAOYITYPE","QY","FGS","CPHM","SIM","YINGYUN","SHANGCHE","XIACHE","JICHENG","DENGHOU","JINE","KONGSHI","ZHONGXINTIME"};//导出map中的key
		String gzb = "车辆现金交易";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.clxjjy_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆刷卡交易查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryclskjy")
	@ResponseBody
	public String queryclskjy(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryclskjy(postData);
		return msg;
	}
	
	/**
	 * 车辆刷卡交易导出
	 * @return
	 */
	@RequestMapping(value = "/clskjy_daochu")
	@ResponseBody
	public String clskjy_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"营运类型","区域","公司","车牌号码","终端编号","营运资格服务证","上车时间","下车时间","计程(公里)","等候时间","交易金额(元)","空驶(公里)","接收时间","卡原额","城市代码","唯一代码","卡留水号","保留位","终端交易流水号","交易类型","卡类型","钱包累计交易次数","启用时间","存钱时间","TAC交易认证码","POS机号","企业编号"};//导出列明
		String b[] = {"JIAOYITYPE","QY","FGS","CPHM","SIM","YINGYUN","SHANGCHE","XIACHE","JICHENG","DENGHOU","JINE","KONGSHI","ZHONGDUAN","YUANE","CITY","XIAOFEI","KAHAO","BAOLIU","ZHONGDUANNO","JIAOYI","KATYPE","QIANBAO","QIYONG","JIAKUAN","TAC","POS","QIYE"};//导出map中的key
		String gzb = "车辆刷卡交易";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.clskjy_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryclyyjy")
	@ResponseBody
	public String queryclyyjy(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryclyyjy(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易导出
	 * @return
	 */
	@RequestMapping(value = "/clyyjy_daochu")
	@ResponseBody
	public String clyyjy_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"营运类型","区域","公司","车牌号码","终端类型","终端编号","营运资格服务证","上车时间","下车时间","计程(公里)","等候时间","交易金额(元)","空驶(公里)","接收时间","卡原额","城市代码","唯一代码","卡留水号","保留位","终端交易流水号","交易类型","卡类型","钱包累计交易次数","启用时间","存钱时间","TAC交易认证码","POS机号","企业编号"};//导出列明
		String b[] = {"JIAOYITYPE","QY","FGS","CPHM","ZDLX","SIM","YINGYUN","SHANGCHE","XIACHE","JICHENG","DENGHOU","JINE","KONGSHI","ZHONGDUAN","YUANE","CITY","XIAOFEI","KAHAO","BAOLIU","ZHONGDUANNO","JIAOYI","KATYPE","QIANBAO","QIYONG","JIAKUAN","TAC","POS","QIYE"};//导出map中的key
		String gzb = "车辆营运交易";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.clyyjy_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆最新营运交易时间查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryclzxyysj")
	@ResponseBody
	public String queryclzxyysj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryclzxyysj(postData);
		return msg;
	}
	
	/**
	 * 车辆最新营运交易时间导出
	 * @return
	 */
	@RequestMapping(value = "/clzxyysj_daochu")
	@ResponseBody
	public String clzxyysj_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司","车牌号码","最新营运交易时间"};//导出列明
		String b[] = {"QY","FGS","CPHM","SHANGCHE"};//导出map中的key
		String gzb = "车辆最新营运交易时间";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list  = zhywServer.clzxyysj_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	
	/**
	 * 车辆营运交易异常数据查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryycsjcx")
	@ResponseBody
	public String queryycsjcx(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryycsjcx(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易异常数据导出
	 * @return
	 */
	@RequestMapping(value = "/ycsjcx_daochu")
	@ResponseBody
	public String ycsjcx_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"营运类型","区域","公司","车牌号码","终端编号","营运资格服务证","上车时间","下车时间","计程(公里)","等候时间","交易金额(元)","空驶(公里)","接收时间","卡原额","城市代码","唯一代码","卡留水号","保留位","终端交易流水号","交易类型","卡类型","钱包累计交易次数","启用时间","存钱时间","TAC交易认证码","POS机号","企业编号"};//导出列明
		String b[] = {"JIAOYITYPE","QY","FGS","CPHM","SIM","YINGYUN","SHANGCHE","XIACHE","JICHENG","DENGHOU","JINE","KONGSHI","ZHONGDUAN","YUANE","CITY","XIAOFEI","KAHAO","BAOLIU","ZHONGDUANNO","JIAOYI","KATYPE","QIANBAO","QIYONG","JIAKUAN","TAC","POS","QIYE"};//导出map中的key
		String gzb = "车辆营运交易异常数据";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.ycsjcx_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易次数统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjycs")
	@ResponseBody
	public String queryjycs(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjycs(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易次数统计查询
	 * @return
	 */
	@RequestMapping(value = "/jycs_daochu")
	@ResponseBody
	public String jycs_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"车牌号码","公司名称","交易次数"};//导出列明
		String b[] = {"CP","FGS","JYCS"};//导出map中的key
		String gzb = "车辆交易次数统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list  = zhywServer.jycs_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易金额统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjyje")
	@ResponseBody
	public String queryjyje(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjyje(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易金额统计查询
	 * @return
	 */
	@RequestMapping(value = "/jyje_daochu")
	@ResponseBody
	public String jyje_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"车牌号码","公司名称","交易金额"};//导出列明
		String b[] = {"CP","FGS","JYJE"};//导出map中的key
		String gzb = "车辆交易金额统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.jyje_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易计程统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjyjc")
	@ResponseBody
	public String queryjyjc(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjyjc(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易计程统计查询
	 * @return
	 */
	@RequestMapping(value = "/jyjc_daochu")
	@ResponseBody
	public String jyjc_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"车牌号码","公司名称","交易计程(公里)"};//导出列明
		String b[] = {"CP","FGS","JYJC"};//导出map中的key
		String gzb = "车辆交易计程统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.jyjc_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易等待时间统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjyddsj")
	@ResponseBody
	public String queryjyddsj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjyddsj(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易等待时间统计查询
	 * @return
	 */
	@RequestMapping(value = "/jyddsj_daochu")
	@ResponseBody
	public String jyddsj_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"车牌号码","公司名称","交易等待时间(分)"};//导出列明
		String b[] = {"CP","FGS","JYDDSJ"};//导出map中的key
		String gzb = "车辆交易等待时间统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list= zhywServer.jyddsj_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易空驶统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjyks")
	@ResponseBody
	public String queryjyks(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjyks(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易空驶统计查询
	 * @return
	 */
	@RequestMapping(value = "/jyks_daochu")
	@ResponseBody
	public String jyks_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"车牌号码","公司名称","交易空驶(公里)"};//导出列明
		String b[] = {"CP","FGS","JYKS"};//导出map中的key
		String gzb = "车辆交易空驶统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.jyks_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易营运时间统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjyyysj")
	@ResponseBody
	public String queryjyyysj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjyyysj(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易营运时间统计查询
	 * @return
	 */
	@RequestMapping(value = "/jyyysj_daochu")
	@ResponseBody
	public String jyyysj_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"车牌号码","公司名称","交易营运时间(分)"};//导出列明
		String b[] = {"CP","FGS","JYYYSJ"};//导出map中的key
		String gzb = "车辆交易营运时间统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.jyyysj_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	//---------------------------------------------------------//
	/**
	 * 车辆营运交易综合统计统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyyjycsz")
	@ResponseBody
	public String queryyyjycsz(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryyyjycsz(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易综合统计统计导出
	 * @return
	 */
	@RequestMapping(value = "/yyjycsz_daochu")
	@ResponseBody
	public String yyjycsz_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司","车牌号码","现金交易次数","刷卡交易次数","营运交易次数"};//导出列明
		String b[] = {"QY","FGS","CH","XJJYCS","SKJYCS","YYJYCS"};//导出map中的key
		String gzb = "车辆营运交易次数综合统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.yyjycsz_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易金额综合统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyyjyjez")
	@ResponseBody
	public String queryyyjyjez(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryyyjyjez(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易金额综合统计导出
	 * @return
	 */
	@RequestMapping(value = "/yyjyjez_daochu")
	@ResponseBody
	public String yyjyjez_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司","车牌号码","现金交易金额","刷卡交易金额","营运交易金额"};//导出列明
		String b[] = {"QY","FGS","CH","XJJYJE","SKJYJE","YYJYJE"};//导出map中的key
		String gzb = "车辆营运交易金额综合统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.yyjyjez_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易计程综合统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyyjyjcz")
	@ResponseBody
	public String queryyyjyjcz(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryyyjyjcz(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易计程综合统计导出
	 * @return
	 */
	@RequestMapping(value = "/yyjyjcz_daochu")
	@ResponseBody
	public String yyjyjcz_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司","车牌号码","现金交易计程(公里)","刷卡交易计程(公里)","营运交易计程(公里)"};//导出列明
		String b[] = {"QY","FGS","CH","XJJYJC","SKJYJC","YYJYJC"};//导出map中的key
		String gzb = "车辆营运交易计程综合统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.yyjyjcz_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易等待时间综合统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyyjyddsjz")
	@ResponseBody
	public String queryyyjyddsjz(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryyyjyddsjz(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易等待时间综合统计导出
	 * @return
	 */
	@RequestMapping(value = "/yyjyddsjz_daochu")
	@ResponseBody
	public String yyjyddsjz_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司","车牌号码","现金交易等待时间","刷卡交易等待时间","营运交易等待时间"};//导出列明
		String b[] = {"QY","FGS","CH","XJJYDDSJ","SKJYDDSJ","YYJYDDSJ"};//导出map中的key
		String gzb = "车辆营运交易等待时间综合统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.yyjyddsjz_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	/**
	 * 车辆营运交易空驶综合统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyyjyksz")
	@ResponseBody
	public String queryyyjyksz(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryyyjyksz(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易空驶综合统计导出
	 * @return
	 */
	@RequestMapping(value = "/yyjyksz_daochu")
	@ResponseBody
	public String yyjyksz_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司","车牌号码","现金交易空驶","刷卡交易空驶","营运交易空驶"};//导出列明
		String b[] = {"QY","FGS","CH","XJJYKS","SKJYKS","YYJYKS"};//导出map中的key
		String gzb = "车辆营运交易空驶综合统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.yyjyksz_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 车辆营运交易营运时间综合统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryyyjyyysjz")
	@ResponseBody
	public String queryyyjyyysjz(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryyyjyyysjz(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易营运时间综合统计导出
	 * @return
	 */
	@RequestMapping(value = "/yyjyyysjz_daochu")
	@ResponseBody
	public String yyjyyysjz_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司","车牌号码","现金交易营运时间","刷卡交易营运时间","营运交易营运时间"};//导出列明
		String b[] = {"QY","FGS","CH","XJJYYYSJ","SKJYYYSJ","YYJYYYSJ"};//导出map中的key
		String gzb = "车辆营运交易营运时间综合统计";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>>list = zhywServer.yyjyyysjz_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
//---------------------------------------------------------//
	/**
	 * 车辆营运交易日营运时段综合统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryrtj")
	@ResponseBody
	public String queryrtj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryrtj(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易日营运时段综合统计查询导出
	 * @return
	 */
	@RequestMapping(value = "/rtj_daochu")
	@ResponseBody
	public String rtj_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"","区域","总营运次数(次)","车辆总数(辆)","营运车辆数(辆)","总行驶里程(公里)","载客行驶里程(公里)","空驶里程(公里)","总营收金额(元)","营运时长(小时)","周转次数(次/辆)","平均营收(元/辆)","平均行驶速度(公里/小时)","平均营运时长(小时/辆)","平均等候时间(分/辆)","上路率"};//导出列明
		String b[] = {"TJSD","QY","RYYCS","CLZS","RYYCL","RZLC","RZKLC","RKSLC","RYSJE","RYYSC","ZZCS","PJYS","PJXSSD","PJYYSC","PJDHSJ","SLL"};//导出map中的key
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String stime = zhywServer.getstime(postData);
		String gzb = "交易时段统计(按日"+stime+")";//导出sheet名和导出的文件名
		List<Map<String, Object>>list= zhywServer.rtj_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	/**
	 * 交易数据汇总统计
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjysjhz")
	@ResponseBody
	public String queryjysjhz(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjysjhz(postData);
		return msg;
	}
	
	/**
	 * 交易数据汇总统计导出
	 * @return
	 */
	@RequestMapping(value = "/jysjhz_daochu")
	@ResponseBody
	public String jysjhz_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		
		String a[] = {"区域","公司名称","车牌号码","交易次数","交易金额(元)","交易计程(公里)","交易空驶(公里)","交易等待时间(分钟)","交易营运时间(分钟)"};//导出列明
		String b[] = {"QY","FGS","CP","JYCS","JYJE","JYJC","JYKS","JYDDSJ","JYYYSJ"};//导出map中的key
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String sj =zhywServer. jysjhz_getsj(postData);
		String gzb = "交易数据汇总统计("+sj+")";//导出sheet名和导出的文件名
		List<Map<String, Object>>list = zhywServer.jysjhz_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }
	
	//2017-11-09 15:50
	/**
	 * 车辆营运交易月营运时段综合统计查询
	 * 
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryytj")
	@ResponseBody
	public String queryytj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryytj(postData);
		return msg;
	}
	
	/**
	 * 车辆营运交易月营运时段综合统计查询导出
	 * @return
	 */
	@RequestMapping(value = "/ytj_daochu")
	@ResponseBody
	public String ytj_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"序号","日期","时间段","区域","总营运次数(次)","车辆总数(辆)","营运车辆数(辆)","总行驶里程(公里)","载客行驶里程(公里)","空驶里程(公里)","总营收金额(元)","营运时长(小时)","周转次数(次/辆)","平均营收(元/辆)","平均行驶速度(公里/小时)","平均营运时长(小时/辆)","平均等候时间(分/辆)","上路率"};//导出列明
		String b[] = {"dojoId","DAY","SJD","QY","RYYCS","CLZS","RYYCL","RZLC","RZKLC","RKSLC","RYSJE","RYYSC","ZZCS","PJYS","PJXSSD","PJYYSC","PJDHSJ","SLL"};//导出map中的key
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String sj =zhywServer.jysjhz_getytjsj(postData);
		String gzb = "交易时段统计(按月"+sj+")";//导出sheet名和导出的文件名
		List<Map<String, Object>>list= zhywServer.ytj_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }

    /**
	 * 车辆营运交易周营运时段综合统计查询
	 *
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryztj")
	@ResponseBody
	public String queryztj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryztj(postData);
		return msg;
	}

	/**
	 * 车辆营运交易周营运时段综合统计查询导出
	 * @return
	 */
	@RequestMapping(value = "/ztj_daochu")
	@ResponseBody
	public String ztj_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"序号","日期","时间段","区域","总营运次数(次)","车辆总数(辆)","营运车辆数(辆)","总行驶里程(公里)","载客行驶里程(公里)","空驶里程(公里)","总营收金额(元)","营运时长(小时)","周转次数(次/辆)","平均营收(元/辆)","平均行驶速度(公里/小时)","平均营运时长(小时/辆)","平均等候时间(分/辆)","上路率"};//导出列明
		String b[] = {"dojoId","DAY","SJD","QY","RYYCS","CLZS","RYYCL","RZLC","RZKLC","RKSLC","RYSJE","RYYSC","ZZCS","PJYS","PJXSSD","PJYYSC","PJDHSJ","SLL"};//导出map中的key
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String sj =zhywServer.jysjhz_getztjsj(postData);
		String gzb = "交易时段统计(按周"+sj+")";//导出sheet名和导出的文件名
		List<Map<String, Object>>list= zhywServer.ztj_daochu(postData);
		helper.DownloadAct.download(request,response,a,b,gzb,list);
		return null;
    }
/**
	 * 车辆营运交易年营运时段综合统计查询
	 *
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryntj")
	@ResponseBody
	public String queryntj(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryntj(postData);
		return msg;
	}

	/**
	 * 车辆营运交易年营运时段综合统计查询导出
	 * @return
	 */
	@RequestMapping(value = "/ntj_daochu")
	@ResponseBody
	public String ntj_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"序号","月份","时间段","区域","总营运次数(次)","车辆总数(辆)","营运车辆数(辆)","总行驶里程(公里)","载客行驶里程(公里)","空驶里程(公里)","总营收金额(元)","营运时长(小时)","周转次数(次/辆)","平均营收(元/辆)","平均行驶速度(公里/小时)","平均营运时长(小时/辆)","平均等候时间(分/辆)","上路率"};//导出列明
		String b[] = {"dojoId","YF","SJD","QY","RYYCS","CLZS","RYYCL","RZLC","RZKLC","RKSLC","RYSJE","RYYSC","ZZCS","PJYS","PJXSSD","PJYYSC","PJDHSJ","SLL"};//导出map中的key
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String sj =zhywServer.jysjhz_getntjsj(postData);
		String gzb = "交易时段统计(按年"+sj+")";//导出sheet名和导出的文件名
		List<Map<String, Object>>list= zhywServer.ntj_daochu(postData);
		helper.DownloadAct.download(request,response,a,b,gzb,list);
		return null;
    }

    /**
	 * 车辆营运交易年营运时段综合统计查询
	 *
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryjjr")
	@ResponseBody
	public String queryjjr(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = zhywServer.queryjjr(postData);
		return msg;
	}

	/**
	 * 车辆营运交易年营运时段综合统计查询导出
	 * @return
	 */
	@RequestMapping(value = "/jjr_daochu")
	@ResponseBody
	public String jjr_daochu(HttpServletRequest request,
			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
		String a[] = {"序号","节假日","日期","时间段","区域","总营运次数(次)","车辆总数(辆)","营运车辆数(辆)","总行驶里程(公里)","载客行驶里程(公里)","空驶里程(公里)","总营收金额(元)","营运时长(小时)","周转次数(次/辆)","平均营收(元/辆)","平均行驶速度(公里/小时)","平均营运时长(小时/辆)","平均等候时间(分/辆)","上路率"};//导出列明
		String b[] = {"dojoId","JJR","YF","SJD","QY","RYYCS","CLZS","RYYCL","RZLC","RZKLC","RKSLC","RYSJE","RYYSC","ZZCS","PJYS","PJXSSD","PJYYSC","PJDHSJ","SLL"};//导出map中的key
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String gzb = "交易时段统计(节假日)";//导出sheet名和导出的文件名
		List<Map<String, Object>>list= zhywServer.jjr_daochu(postData);
		helper.DownloadAct.download(request,response,a,b,gzb,list);
		return null;
    }
	//2017-11-10 08:50
		/**
		 * 车辆营运交易按公司统计查询
		 * 
		 * @param request
		 * @param postData
		 * @return
		 */
		@RequestMapping(value = "/gstj")
		@ResponseBody
		public String gstj(HttpServletRequest request,@RequestParam("postData") String postData) {
			String msg = zhywServer.gstj(postData);
			return msg;
		}
		
		/**
		 * 车辆营运交易按公司统计查询导出
		 * @return
		 */
		@RequestMapping(value = "/gstj_daochu")
		@ResponseBody
		public String gstj_daochu(HttpServletRequest request,
				HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
			String a[] = {"区域","公司","总营运次数(次)","营运车辆数(辆)","总营收金额(元)","载客行驶里程(公里)","空驶里程(公里)","总行驶里程(公里)","营运时长(小时)","等候时间(分钟)"};//导出列明
			String b[] = {"QY","FGS","RYYCS","RYYCL","RYSJE","RZKLC","RKSLC","RZLC","RYYSC","DHSJ"};//导出map中的key
			postData = java.net.URLDecoder.decode(postData, "UTF-8");
			String sj =zhywServer. jysjhz_getsj(postData);
			String gzb = "公司统计("+sj+")";//导出sheet名和导出的文件名
			List<Map<String, Object>>list= zhywServer.gstj_daochu(postData);
			new DownloadAct().download(request,response,a,b,gzb,list);
			return null;
	    }
		
		/**
		 * 车辆营运交易按公司平均查询
		 * 
		 * @param request
		 * @param postData
		 * @return
		 */
		@RequestMapping(value = "/gspj")
		@ResponseBody
		public String gspj(HttpServletRequest request,@RequestParam("postData") String postData) {
			String msg = zhywServer.gspj(postData);
			return msg;
		}
		
		/**
		 * 车辆营运交易按公司平均查询导出
		 * @return
		 */
		@RequestMapping(value = "/gspj_daochu")
		@ResponseBody
		public String gspj_daochu(HttpServletRequest request,
				HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
			String a[] = {"区域","公司","总营运次数(次)","营运车辆数(辆)","周转次数(次/辆)","平均营运时长(小时/辆)","平均等候时间(分/辆)","平均营收(元/辆)","平均总里程(公里)","平均实载里程(公里)","平均空驶里程(公里)","平均行驶速度(公里/小时)"};//导出列明
			String b[] = {"QY","FGS","RYYCS","RYYCL","ZZCS","PJYYSC","PJDHSJ","PJYS","PJZLC","PJZKLC","PJKSLC","PJXSSD"};//导出map中的key
			postData = java.net.URLDecoder.decode(postData, "UTF-8");
			String sj =zhywServer. jysjhz_getsj(postData);
			String gzb = "公司平均("+sj+")";//导出sheet名和导出的文件名
			List<Map<String, Object>>list= zhywServer.gspj_daochu(postData);
			new DownloadAct().download(request,response,a,b,gzb,list);
			return null;
	    }
		
		
		/**
		 * 车辆统计查询
		 * 
		 * @param request
		 * @param postData
		 * @return
		 */
		@RequestMapping(value = "/cltj")
		@ResponseBody
		public String cltj(HttpServletRequest request,@RequestParam("postData") String postData) {
			String msg = zhywServer.cltj(postData);
			return msg;
		}
		
		/**
		 * 车辆统计查询导出
		 * @return
		 */
		@RequestMapping(value = "/cltj_daochu")
		@ResponseBody
		public String cltj_daochu(HttpServletRequest request,
				
				HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
			String a[] = {"区域","公司","车牌","终端类型","总营运次数(次)","营运车辆数(辆)","总营收金额(元)","载客行驶里程(公里)","空驶里程(公里)","总行驶里程(公里)","营运时长(小时)","等候时间(分钟)","开始营运时间","结束营运时间"};//导出列明
			String b[] = {"QY","FGS","CPHM","ZDLX","RYYCS","RYYCL","RYSJE","RZKLC","RKSLC","RZLC","RYYSC","DHSJ","KSYYSJ","JSYYSJ"};//导出map中的key
			postData = java.net.URLDecoder.decode(postData, "UTF-8");
			String gzb = "车辆统计";//导出sheet名和导出的文件名
			List<Map<String, Object>>list= zhywServer.cltj_daochu(postData);
			new DownloadAct().download(request,response,a,b,gzb,list);
			return null;
	    }
		
		//2018-03-28 15:50
		/**
		 * 公司月统计
		 * 
		 * @param request
		 * @param postData
		 * @return
		 */
		@RequestMapping(value = "/gsytj")
		@ResponseBody
		public String gsytj(HttpServletRequest request,@RequestParam("postData") String postData) {
			String msg = zhywServer.gsytj(postData);
			return msg;
		}
		
		/**
		 * 公司月统计导出
		 * @return
		 */
		@RequestMapping(value = "/gsytj_daochu")
		@ResponseBody
		public String gsytj_daochu(HttpServletRequest request,
				HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
			String a[] = {"日期","公司","总营运次数(次)","营运车辆数(辆)","总营收金额(元)","载客行驶里程(公里)","空驶里程(公里)","总行驶里程(公里)","营运时长(小时)","等候时间(分钟)"};//导出列明
			String b[] = {"DAY","FGS","RYYCS","RYYCL","RYSJE","RZKLC","RKSLC","RZLC","RYYSC","DHSJ"};//导出map中的key
			postData = java.net.URLDecoder.decode(postData, "UTF-8");
			String gzb = "公司按月统计";//导出sheet名和导出的文件名
			List<Map<String, Object>>list= zhywServer.gsytj_daochu(postData);
			new DownloadAct().download(request,response,a,b,gzb,list);
			return null;
	    }
		
		
		/**
         * 营运天数统计
         * 
         * @param request
         * @param postData
         * @return
         */
        @RequestMapping(value = "/queryyyts")
        @ResponseBody
        public String queryyyts(HttpServletRequest request,@RequestParam("postData") String postData) {
            String msg = zhywServer.queryyyts(postData);
            return msg;
        }
        
        /**
         * 营运天数统计导出
         * @return
         */
        @RequestMapping(value = "/yyts_daochu")
        @ResponseBody
        public String yyts_daochu(HttpServletRequest request,
                HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
            String a[] = {"月份","区域","公司","车牌号码","营运天数"};//导出列明
            String b[] = {"YF","QY","FGS","CPHM","YYTS"};//导出map中的key
            postData = java.net.URLDecoder.decode(postData, "UTF-8");
            String gzb = "营运天数统计";//导出sheet名和导出的文件名
            List<Map<String, Object>>list= zhywServer.yyts_daochu(postData);
            new DownloadAct().download(request,response,a,b,gzb,list);
            return null;
        }
        
        /**
         * 营运数据分析
         * 
         * @param request
         * @param postData
         * @return
         */
        @RequestMapping(value = "/queryyysjfx")
        @ResponseBody
        public String queryyysjfx(HttpServletRequest request,@RequestParam("postData") String postData) {
            String msg =jacksonUtil.toJson(zhywServer.queryyysjfx(postData));
            return msg;
        }
        
        /**
         * 营运数据分析导出
         * @return
         */
        @RequestMapping(value = "/queryyysjfxdc")
        @ResponseBody
        public String queryyysjfxdc(HttpServletRequest request,
                HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
            String a[] = {"时间","00:00","01:00", "02:00","03:00", "04:00", "05:00", "06:00","07:00", "08:00", "09:00", "10:00","11:00", "12:00", "13:00", "14:00","15:00", "16:00", "17:00", "18:00","19:00", "20:00", "21:00", "22:00","23:00"};//导出列明
            String b[] = {"message","y0","y1","y2","y3","y4","y5","y6","y7","y8","y9","y10","y11","y12","y13","y14","y15","y16","y17","y18","y19","y20","y21","y22","y23"};//导出map中的key
            postData = java.net.URLDecoder.decode(postData, "UTF-8");
            Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
            String module = String.valueOf(paramMap.get("module"));
            String gzb = "";//导出sheet名和导出的文件名
            if(module.equals("zxyylfx")){		
            	gzb ="在线营运率分析";		
    		}else if(module.equals("lclylfx")){				
    			gzb	="里程利用率分析";		
    		}else if(module.equals("dcpjlcfx")){				
    			gzb	="单车平均里程分析";		
    		}else if(module.equals("sxlfx")){				
    			gzb	="上线率分析";		
    		}else if(module.equals("zclfx")){				
    			gzb	="重车率分析";		
    		}          
            List<Map<String, Object>>list= zhywServer.queryyysjfx(postData);
            new DownloadAct().download(request,response,a,b,gzb,list);
            return null;
        }
        
        /**
         * 营运日报
         * @return
         */
        @RequestMapping(value = "/yyrb")
        @ResponseBody
        public String yyrb(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.queryyyrb(postData);
        	return msg;
        }
        
        /**
         * 
         * 营运日报导出
         * @return
         */
        @RequestMapping(value = "/yyrb_daochu")
    	@ResponseBody
    	public String yyrb_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"日期","营运车辆数","车辆总数","周转次数","营收金额(元)","平均实载率","重车时间(分钟)","载客等候时间(分钟)","载客里程(公里)","空驶里程(公里)"};//导出列明
    		String b[] = {"DB_TIME","RUN_TAXIS","COUNT","RUN_TIMES","RUN_PROFIT","ACTUAL_LOAD_RATE","RUN_TIME","WAITTING_TIME","ACTUAL_LOAD_MILEAGE","NO_LOAD_MILEAGE"};//导出map中的key
    		String gzb = "营运日报";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>>list = zhywServer.queryyyrb_daochu(postData);
    		new DownloadAct().download(request,response,a,b,gzb,list);
    		return null;
        }
        
        /**
         * 营运月报
         * @return
         */
        @RequestMapping(value = "/yyyb")
        @ResponseBody
        public String yyyb(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.queryyyyb(postData);
        	return msg;
        }
        
        /**
         * 
         * 营运月报导出
         * @return
         */
        @RequestMapping(value = "/yyyb_daochu")
    	@ResponseBody
    	public String yyyb_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"日期","参与营运车辆","营运总次数","车辆总数","平均周转次数","平均上路率","平均营收金额","平均实载率","平均出车时间(分钟)","平均重车时间(分钟)","平均等候时间(分钟)","平均总里程(公里)","平均实载里程(公里)","平均空驶里程(公里)"};//导出列明
    		String b[] = {"TIME","REPORE_VHIC","REPORE_NO","REPORE_VHICNO","REPORE_TURNOVER","REPORE_RADE","REPORE_AMOUNT_REVENUE","REPORE_ACTUAL_LOADING","REPORE_CAR_TIME","REPROE_REVENUE_TIME","REPORE_WAIT_TIME","REPORE_MILEAGE","REPORE_ACTUAL_MILEAGE","REPORE_EMPTY_MILEAGE"};//导出map中的key
    		String gzb = "营运月报";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>>list = zhywServer.queryyyyb_daochu(postData);
    		new DownloadAct().download(request,response,a,b,gzb,list);
    		return null;
        }
        
        /**
         * 5次/日同点
         * @return
         */
        @RequestMapping(value = "/querywcmrtd")
        @ResponseBody
        public String querywcmrtd(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.querywcmrtd(postData);
        	return msg;
        }
        
        /**
         * 5次/日同点excel
         * @return
         */
    	@RequestMapping(value = "/wcmrtd_daochu")
    	@ResponseBody
    	public String wcmrtd_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"车牌号码","点位名称","进入时间","出去时间","当日营运次数","当日等候时长/分钟","当日时间"};//导出列明
    		String b[] = {"VEHICLENUM","POINT_NAME","JRSJ","LKSJ","YYCS","DHSJ","SJ"};//导出map中的key
    		String gzb = "5次每日同点";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>> list = DownloadAct.parseJSON2List(zhywServer.querywcmrtd(postData));
    		DownloadAct.download(request,response,a,b,gzb,list);
    		return null;
        }
    	
    	/**
         * 10分钟以上停留
         * @return
         */
        @RequestMapping(value = "/querysfzystl")
        @ResponseBody
        public String querysfzystl(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.querysfzystl(postData);
        	return msg;
        }
        
        /**
         * 10分钟以上停留excel
         * @return
         */
    	@RequestMapping(value = "/sfzystl_daochu")
    	@ResponseBody
    	public String sfzystl_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"车牌号码","停留点位","停留时长（分钟）","总次数","当日营运次数","当日等候时长/分钟","当日时间"};//导出列明
    		String b[] = {"VEHICLENUM","POINT_NAME","STOPTIME","STOPCOUNT","YYCS","DHSJ","SJ"};//导出map中的key
    		String gzb = "10分钟以上停留";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>> list = new DownloadAct().parseJSON2List(zhywServer.querysfzystl(postData));
    		new DownloadAct().download(request,response,a,b,gzb,list);
    		return null;
        }
    	
    	/**
         * 3日同点位
         * @return
         */
        @RequestMapping(value = "/querysrtdw")
        @ResponseBody
        public String querysrtdw(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.querysrtdw(postData);
        	return msg;
        }
        
        /**
         * 3日同点位excel
         * @return
         */
    	@RequestMapping(value = "/srtdw_daochu")
    	@ResponseBody
    	public String srtdw_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"车牌号码","点位名称","当日营运次数","当日等候时长/分钟","当日时间"};//导出列明
    		String b[] = {"VEHICLENUM","POINT_NAME","YYCS","DHSJ","SJ"};//导出map中的key
    		String gzb = "3日同点位";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>> list = new DownloadAct().parseJSON2List(zhywServer.querysrtdw(postData));
    		new DownloadAct().download(request,response,a,b,gzb,list);
    		return null;
        }

        /**
         * 轨迹缺失大于30分钟
         * @return
         */
        @RequestMapping(value = "/querygjqsdyssfz")
        @ResponseBody
        public String querygjqsdyssfz(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.querygjqsdyssfz(postData);
        	return msg;
        }
        
        /**
         * 轨迹缺失大于30分钟excel
         * @return
         */
    	@RequestMapping(value = "/gjqsdyssfz_daochu")
    	@ResponseBody
    	public String gjqsdyssfz_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"车牌号码","缺失时长","当日营运次数","当日等候时长/分钟","当日时间"};//导出列明
    		String b[] = {"VEHICLENUM","ERRORTYPE","YYCS","DHSJ","SJ"};//导出map中的key
    		String gzb = "轨迹缺失大于30分钟";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>> list = new DownloadAct().parseJSON2List(zhywServer.querygjqsdyssfz(postData));
    		new DownloadAct().download(request,response,a,b,gzb,list);
    		return null;
        }
    	
    	/**
         * 景区绕圈的车辆
         * @return
         */
        @RequestMapping(value = "/queryjqrqdcl")
        @ResponseBody
        public String queryjqrqdcl(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.queryjqrqdcl(postData);
        	return msg;
        }
        
        /**
         * 景区绕圈的车辆excel
         * @return
         */
    	@RequestMapping(value = "/jqrqdcl_daochu")
    	@ResponseBody
    	public String jqrqdcl_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"车牌号码","景区内GPS点占比","当日营运次数","当日等候时长/分钟","当日时间"};//导出列明
    		String b[] = {"VEHICLENUM","RATIO","YYCS","DHSJ","SJ"};//导出map中的key
    		String gzb = "景区绕圈的车辆";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>> list = new DownloadAct().parseJSON2List(zhywServer.queryjqrqdcl(postData));
    		new DownloadAct().download(request,response,a,b,gzb,list);
    		return null;
        }
    	
    	/**
         * 疑似模子车辆
         * @return
         */
        @RequestMapping(value = "/queryysmzcl")
        @ResponseBody
        public String queryysmzcl(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.queryysmzcl(postData);
        	return msg;
        }
        
        /**
         * 疑似模子车辆excel
         * @return
         */
    	@RequestMapping(value = "/ysmzcl_daochu")
    	@ResponseBody
    	public String ysmzcl_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"车牌号码","当日时间"};//导出列明
    		String b[] = {"VEHICLENUM","SJ"};//导出map中的key
    		String gzb = "疑似模子车辆";//导出sheet名和导出的文件名
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		List<Map<String, Object>> list = DownloadAct.parseJSON2List(zhywServer.queryysmzcl(postData));
    		DownloadAct.download(request,response,a,b,gzb,list);
    		return null;
        }
    	
    	/**
         * 汇总表
         * @return
         */
        @RequestMapping(value = "/queryhzb")
        @ResponseBody
        public String queryhzb(HttpServletRequest request,@RequestParam("postData") String postData){
        	String msg = zhywServer.queryhzb(postData);
        	return msg;
        }
        
        /**
         * 汇总表excel
         * @return
         */
    	@RequestMapping(value = "/hzb_daochu")
    	@ResponseBody
    	public String hzb_daochu(HttpServletRequest request,
    			HttpServletResponse response,@RequestParam("postData") String postData) throws IOException{
    		String a[] = {"车号","点位","出现次数","累计时长(分钟)","点位","停留次数","累计时长(分钟)","点位","次数","累计时长(分钟)","缺失次数","累计时长(分钟)","景区内GPS点占比","营运次数","等候时长(分钟)"};//导出列明
    		String b[] = {"VEHICLE_NO","POINTA","COUNTA","TIMEA","POINTB","COUNTB","TIMEB","POINTC","COUNTC","KONG","COUNTD","KONG","RATIO","YYCS","DHSJ"};//导出map中的key
    		String c[] = {"5次/日同点","10分钟以上停留/日","3日同点位","轨迹缺失大于30分钟","景区绕圈的车辆"};
    		postData = java.net.URLDecoder.decode(postData, "UTF-8");
    		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
            String time = String.valueOf(paramMap.get("time"));
            String gzb = "汇总表("+time+")";//导出sheet名和导出的文件名
    		List<Map<String, Object>> list = DownloadAct.parseJSON2List(zhywServer.queryhzb(postData));
    		DownloadAct.downloadCustomer(request,response,a,b,c,gzb,list);
    		return null;
        }

	/**
	 * 查询重点区域
	 */
	@RequestMapping(value = "/findKeyArea")
	@ResponseBody
	public String findKeyArea(){
		String msg = zhywServer.findKeyArea();
		return msg;
	}

	/**
	 * 查询重点区域节假日营运数据
	 */
	@RequestMapping(value = "/queryjjrqy")
	@ResponseBody
	public String queryjjrqy(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = zhywServer.queryjjrqy(postData);
		return msg;
	}
	/**
	 * 查询重点区域节车辆月报
	 */
	@RequestMapping(value = "/queryclyb")
	@ResponseBody
	public String queryclyb(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = zhywServer.queryclyb(postData);
		return msg;
	}

	/**
	 * 查询重点区域节车辆年报
	 */
	@RequestMapping(value = "/queryclnb")
	@ResponseBody
	public String queryclnb(HttpServletRequest request,@RequestParam("postData") String postData){
		String msg = zhywServer.queryclnb(postData);
		return msg;
	}

}
