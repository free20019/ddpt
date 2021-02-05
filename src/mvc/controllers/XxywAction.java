package mvc.controllers;

import helper.DownloadAct;
import mvc.service.KbServer;
import mvc.service.XxywServer;
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

/**
 * Create By donghb on 2020-05-28
 */
@Controller
@RequestMapping(value = "/xxyw")
public class XxywAction {

	@Autowired
    private XxywServer xxywService;


    // 孝心出租业务

	/**
	 * 查询孝心业务
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryxxyw")
	@ResponseBody
	public String queryxxyw(HttpServletRequest request,@RequestParam("postData") String postData) {
		String msg = xxywService.queryxxyw(postData);
		return msg;
	}


	/**
	 * 孝心业务导出
	 * @param request
	 * @param postData
	 * @return
	 */
	@RequestMapping(value = "/queryxxyw_daochu")
	@ResponseBody
	public String queryxxyw_daochu(HttpServletRequest request, HttpServletResponse response, @RequestParam("postData") String postData) throws IOException {
		String a[] = {"95128平台订单号", "订单价格", "实付金额", "老人姓名", "老人联系电话", "紧急联系人", "紧急联系人电话", "出行开始时间", "出行预订时长", "订单出行起点", "订单出行终点", "支付状态", "订单状态", "取消订单状态", "行程开始时间", "行程结束时间", "行程开始图片", "行程结束图片", "调度状态", "司机姓名", "司机电话", "车辆类型", "车辆号牌", "取消订单原因"};//导出列明
		String b[] = {"ORDER_NR", "ORDER_PRICE", "PAY_PRICE", "ELDERLY_MAME", "ELDERLY_PHONE", "EMERGENCY_CONTACT", "EMERGENCY_PHONE", "ORDER_START_TIME", "ORDERED_HOURS", "STARTING_POINT", "ENDING_POINT", "PAY_STATUS", "LATEST_STATUS", "ORDER_VALID", "TRIP_START_TIME", "TRIP_END_TIME", "START_PIC_URL", "END_PIC_URL", "DIAODU_STATUS", "DRIVER_NAME", "DRIVER_PHONE", "VECHICLE_CATAG", "VECHICLE_PLATE", "CANCEL_REASON"};//导出map中的key
		String gzb = "孝心业务";//导出sheet名和导出的文件名
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		List<Map<String, Object>> list = xxywService.queryxxyw_daochu(postData);
		new DownloadAct().download(request,response,a,b,gzb,list);
		return null;
    }

	/**
	 * 孝心业务指派车辆
	 * @param request
	 * @param postData
	 * @return
	 */

	@RequestMapping(value = "/xxywZpcl")
	@ResponseBody
	public String xxywZpcl(HttpServletRequest request,@RequestParam("postData") String postData) throws Exception{
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xxywService.xxywZpcl(postData);
		return msg;
	}

	/**
	 * 孝心业务取消订单
	 * @param request
	 * @param postData
	 * @return
	 */

	@RequestMapping(value = "/xxywQxdd")
	@ResponseBody
	public String xxywQxdd(HttpServletRequest request,@RequestParam("postData") String postData) throws Exception{
		postData = java.net.URLDecoder.decode(postData, "UTF-8");
		String msg = xxywService.xxywQxdd(postData);
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
		String msg = xxywService.queryorder(postData);
		return msg;
	}
}
