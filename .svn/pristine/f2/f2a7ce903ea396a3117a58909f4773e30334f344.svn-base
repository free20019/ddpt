package mvc.service;

import helper.InterfaceUtil;
import helper.JacksonUtil;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;

import static jdk.nashorn.internal.runtime.regexp.joni.Syntax.Java;

/**
 * Create By donghb on 2020-05-28
 */
@Service
public class XxywServer {
    protected JdbcTemplate jdbcTemplate = null;
	protected JdbcTemplate jdbcTemplate2 = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public JdbcTemplate getJdbcTemplate2() {
		return jdbcTemplate2;
	}

	@Autowired
	public void setJdbcTemplate2(JdbcTemplate jdbcTemplate2) {
		this.jdbcTemplate2 = jdbcTemplate2;
	}

	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

	public String queryxxyw(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String xxyw_ywbh = String.valueOf(paramMap.get("xxyw_ywbh"));
		String xxyw_cphm = String.valueOf(paramMap.get("xxyw_cphm"));
		String xxyw_sjdh = String.valueOf(paramMap.get("xxyw_sjdh"));
		String xxyw_ddzt = String.valueOf(paramMap.get("xxyw_ddzt"));
		String xxyw_lrxm = String.valueOf(paramMap.get("xxyw_lrxm"));
		String xxyw_lrdh = String.valueOf(paramMap.get("xxyw_lrdh"));
		String xxyw_cxgjz = String.valueOf(paramMap.get("xxyw_cxgjz"));
		String xxyw_stime = String.valueOf(paramMap.get("xxyw_stime"));
		String xxyw_etime = String.valueOf(paramMap.get("xxyw_etime"));
		List<String> wlist = new ArrayList<String>();
		String sql = "select * from tb_order where TRIP_START_TIME>=to_date(?,'yyyy-mm-dd hh24:mi:ss') and TRIP_START_TIME<=to_date(?,'yyyy-mm-dd hh24:mi:ss') ";
		wlist.add(xxyw_stime);
		wlist.add(xxyw_etime);
		if(!"".equals(xxyw_ywbh)){
			sql += "and ORDER_NR=? ";
			wlist.add(xxyw_ywbh);
		}
		if(!"".equals(xxyw_cphm)){
			sql += "and VECHICLE_PLATE like ? ";
			wlist.add("%"+xxyw_cphm+"%");
		}
		if(!"".equals(xxyw_sjdh)){
			sql += "and DRIVER_PHONE like ? ";
			wlist.add("%"+xxyw_sjdh+"%");
		}
		if(!"".equals(xxyw_ddzt)){
			sql += "and DIAODU_STATUS = ? ";
			wlist.add(xxyw_ddzt);
		}
		if(!"".equals(xxyw_lrxm)){
			sql += "and ELDERLY_MAME like ? ";
			wlist.add("%"+xxyw_lrxm+"%");
		}
		if(!"".equals(xxyw_lrdh)){
			sql += "and ELDERLY_PHONE like ? ";
			wlist.add("%"+xxyw_lrdh+"%");
		}
		if(!"".equals(xxyw_cxgjz)){
			sql += "and (EMERGENCY_PHONE like ? or STARTING_POINT like ? or ENDING_POINT like ?) ";
			wlist.add("%"+xxyw_cxgjz+"%");
			wlist.add("%"+xxyw_cxgjz+"%");
			wlist.add("%"+xxyw_cxgjz+"%");
		}
		sql+="order by TRIP_START_TIME desc";
//		System.out.println(sql);
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql,wlist.toArray());
		return jacksonUtil.toJson(list);
    }

	public List<Map<String, Object>> queryxxyw_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String xxyw_ywbh = String.valueOf(paramMap.get("xxyw_ywbh"));
		String xxyw_cphm = String.valueOf(paramMap.get("xxyw_cphm"));
		String xxyw_sjdh = String.valueOf(paramMap.get("xxyw_sjdh"));
		String xxyw_ddzt = String.valueOf(paramMap.get("xxyw_ddzt"));
		String xxyw_lrxm = String.valueOf(paramMap.get("xxyw_lrxm"));
		String xxyw_lrdh = String.valueOf(paramMap.get("xxyw_lrdh"));
		String xxyw_cxgjz = String.valueOf(paramMap.get("xxyw_cxgjz"));
		String xxyw_stime = String.valueOf(paramMap.get("xxyw_stime"));
		String xxyw_etime = String.valueOf(paramMap.get("xxyw_etime"));
		List<String> wlist = new ArrayList<String>();
		String sql = "select * from tb_order where TRIP_START_TIME>=to_date(?,'yyyy-mm-dd hh24:mi:ss') and TRIP_START_TIME<=to_date(?,'yyyy-mm-dd hh24:mi:ss') ";
		wlist.add(xxyw_stime);
		wlist.add(xxyw_etime);
		if(!"".equals(xxyw_ywbh)){
			sql += "and ORDER_NR=? ";
			wlist.add(xxyw_ywbh);
		}
		if(!"".equals(xxyw_cphm)){
			sql += "and VECHICLE_PLATE like ? ";
			wlist.add("%"+xxyw_cphm+"%");
		}
		if(!"".equals(xxyw_sjdh)){
			sql += "and DRIVER_PHONE like ? ";
			wlist.add("%"+xxyw_sjdh+"%");
		}
		if(!"".equals(xxyw_ddzt)){
			sql += "and DIAODU_STATUS = ? ";
			wlist.add(xxyw_ddzt);
		}
		if(!"".equals(xxyw_lrxm)){
			sql += "and ELDERLY_MAME like ? ";
			wlist.add("%"+xxyw_lrxm+"%");
		}
		if(!"".equals(xxyw_lrdh)){
			sql += "and ELDERLY_PHONE like ? ";
			wlist.add("%"+xxyw_lrdh+"%");
		}
		if(!"".equals(xxyw_cxgjz)){
			sql += "and (EMERGENCY_PHONE like ? or STARTING_POINT like ? or ENDING_POINT like ?) ";
			wlist.add("%"+xxyw_cxgjz+"%");
			wlist.add("%"+xxyw_cxgjz+"%");
			wlist.add("%"+xxyw_cxgjz+"%");
		}
		sql+="order by TRIP_START_TIME desc";
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql,wlist.toArray());

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (int i = 0; i < list.size(); i++) {
			String zfzt = list.get(i).get("PAY_STATUS").toString();
			String ddzt = list.get(i).get("LATEST_STATUS").toString();
			String qxddzt = list.get(i).get("ORDER_VALID").toString();
			String dozt = list.get(i).get("DIAODU_STATUS").toString();

			//支付状态：0未支付 1已支付
			if("0".equals(zfzt)){
				list.get(i).put("PAY_STATUS","未支付");
			}else{
				list.get(i).put("PAY_STATUS","已支付");
			}
			//订单状态：1.已接单  2.已开始  3.已结束
			if("1".equals(ddzt)){
				list.get(i).put("LATEST_STATUS","已接单");
			}else if("2".equals(ddzt)){
				list.get(i).put("LATEST_STATUS","已开始");
			}else{
				list.get(i).put("LATEST_STATUS","已结束");
			}
			//取消订单状态：0未取消 1取消中 2取消同意 4取消拒绝
			if("0".equals(qxddzt)){
				list.get(i).put("ORDER_VALID","未取消");
			}else if("1".equals(qxddzt)){
				list.get(i).put("ORDER_VALID","取消中");
			}else if("2".equals(qxddzt)){
				list.get(i).put("ORDER_VALID","取消同意");
			}else{
				list.get(i).put("ORDER_VALID","取消拒绝");
			}
			//调度状态 0未调度  1已调度
			if("0".equals(dozt)){
				list.get(i).put("DIAODU_STATUS","未调度");
			}else{
				list.get(i).put("PAY_STATUS","已调度");
			}

			//时间格式化
			list.get(i).put("ORDER_START_TIME",list.get(i).get("ORDER_START_TIME")==null?"":sdf.format(list.get(i).get("ORDER_START_TIME")));
			list.get(i).put("TRIP_START_TIME",list.get(i).get("TRIP_START_TIME")==null?"":sdf.format(list.get(i).get("TRIP_START_TIME")));
			list.get(i).put("TRIP_END_TIME",list.get(i).get("TRIP_END_TIME")==null?"":sdf.format(list.get(i).get("TRIP_END_TIME")));
		}
		return list;
	}

	public String xxywZpcl(String postData) throws Exception{
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String xxyw_ywbh = String.valueOf(paramMap.get("ywd"));
		String xxyw_cphm = String.valueOf(paramMap.get("cphm"));
		String xxyw_cllx = String.valueOf(paramMap.get("cllx"));
		String xxyw_sjxm = String.valueOf(paramMap.get("sjxm"));
		String xxyw_sjdh = String.valueOf(paramMap.get("sjdh"));
		String cp = java.net.URLEncoder.encode(xxyw_cphm,"utf-8");
		String lx = java.net.URLEncoder.encode(xxyw_cllx,"utf-8");
		String xm = java.net.URLEncoder.encode(xxyw_sjxm,"utf-8");
		String dh = java.net.URLEncoder.encode(xxyw_sjdh,"utf-8");
		String url="http://192.168.0.140:14008/carDispatch/dispatchResult?order_nr="+xxyw_ywbh+"&diaodu_status=1&vechicle_plate="+cp+"&vechicle_catag="+lx+"&driver="+xm+"&phone="+dh;
//		String url="http://220.189.215.98:14008/carDispatch/dispatchResult?order_nr="+xxyw_ywbh+"&diaodu_status=1&vechicle_plate="+cp;
		System.out.println("孝心指派车辆url="+url);
		try {
			String resultStr = helper.InterfaceUtil.FilialInterface(url);
			System.out.println("孝心指派车辆返回结果=" + resultStr);
			Map<String, Object> resultMap = jacksonUtil.toObject(resultStr, new TypeReference<Map<String, Object>>() {
			});
			String state = String.valueOf(resultMap.get("state"));
			String msg = String.valueOf(resultMap.get("msg"));
			if ("200".equals(state)) {
				//			String sql = "update tb_order set driver_name=?,driver_phone=?,vechicle_catag=?,vechicle_plate=? where order_nr=?";
				//			int a = jdbcTemplate.update(sql,xxyw_sjxm,xxyw_sjdh,xxyw_cllx,xxyw_cphm,xxyw_ywbh);
				return "{\"msg\":\"1\"}";
			} else {
				return "{\"msg\":\"0\"}";
			}

		}catch (Exception e){
			System.out.println("孝心指派车辆异常"+e.getMessage());
			return "{\"msg\":\"0\"}";
		}


//		String sql = "update tb_order set driver_name=?,driver_phone=?,vechicle_catag=?,vechicle_plate=? where order_nr=?";
//		int a = jdbcTemplate.update(sql,xxyw_sjxm,xxyw_sjdh,xxyw_cllx,xxyw_cphm,xxyw_ywbh);
//		if(a>=1){
//			String cp = java.net.URLEncoder.encode(xxyw_cphm,"utf-8");
//			String url="http://192.168.0.140:14008/carDispatch/dispatchResult?order_nr="+xxyw_ywbh+"&diaodu_status=1&vechicle_plate="+cp;
//			System.out.println("孝心指派车辆url="+url);
//			String resultStr = helper.InterfaceUtil.FilialInterface(url);
//			System.out.println("孝心指派车辆返回结果="+resultStr);
//			Map<String,Object> resultMap = jacksonUtil.toObject(resultStr,new TypeReference<Map<String,Object>>() {});
//			String state = String.valueOf(resultMap.get("state"));
//			String msg = String.valueOf(resultMap.get("msg"));
//			if("400".equals(state)){
//				return "{\"msg\":\""+msg+"\"}";
//			}else {
//				return "{\"msg\":\"0\"}";
//			}
//		}
//	    return "{\"msg\":\"0\"}";
	}

    public String xxywQxdd(String postData) throws Exception{

		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ywbh = String.valueOf(paramMap.get("ywbh"));
//		String yhid = String.valueOf(paramMap.get("yhid"));//用户id
//		double yfje = Double.parseDouble(String.valueOf(paramMap.get("yfje")));//金额
		String qxyy = String.valueOf(paramMap.get("qxyy"));
		String yy = java.net.URLEncoder.encode(qxyy, "utf-8");
		String url = "http://192.168.0.140:14008/carDispatch/cancelOrder?order_nr=" + ywbh + "&cancel_reason=" + yy;
//		String url = "http://220.189.215.98:14008/carDispatch/cancelOrder?order_nr=" + ywbh + "&customer_id=" + yhid + "&payed_amount=" + yfje + "&cancel_reason=" + yy;
		System.out.println("取消孝心订单url=" + url);
		try {
			String resultStr = helper.InterfaceUtil.FilialInterface(url);
			System.out.println("取消孝心订单返回结果=" + resultStr);
			Map<String, Object> resultMap = jacksonUtil.toObject(resultStr, new TypeReference<Map<String, Object>>() {
			});
			String state = String.valueOf(resultMap.get("state"));
			String msg = String.valueOf(resultMap.get("msg"));
			if ("200".equals(state)) {
				//			String sql = "update tb_order set order_valid=1,CANCEL_REASON=? where order_nr=?";
				//			int a = jdbcTemplate.update(sql, qxyy, ywbh);
				return "{\"msg\":\"1\"}";
			} else {
				return "{\"msg\":\"0\"}";
			}
		}catch (Exception e){
			System.out.println("取消孝心订单异常"+e.getMessage());
			return "{\"msg\":\"0\"}";
		}


//		String sql = "update tb_order set order_valid=1,CANCEL_REASON=? where order_nr=?";
//		int a = jdbcTemplate.update(sql,qxyy,ywbh);
//		if(a>=1){
//			String yy = java.net.URLEncoder.encode(qxyy,"utf-8");
//			String url="http://192.168.0.140:14008/carDispatch/cancelOrder?order_nr="+ywbh+"&customer_id="+yhid+"&payed_amount="+yfje+"&cancel_reason="+yy;
//			System.out.println("取消孝心订单url="+url);
//			String resultStr = helper.InterfaceUtil.FilialInterface(url);
//			System.out.println("取消孝心订单返回结果="+resultStr);
//			Map<String,Object> resultMap = jacksonUtil.toObject(resultStr,new TypeReference<Map<String,Object>>() {});
//			String state = String.valueOf(resultMap.get("state"));
//			String msg = String.valueOf(resultMap.get("msg"));
//			if("400".equals(state)){
//				return "{\"msg\":\""+msg+"\"}";
//			}else {
//				return "{\"msg\":\"0\"}";
//			}
//		}
//	    return "{\"msg\":\"0\"}";
    }

	public String queryorder(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gh = String.valueOf(paramMap.get("gh"));
		String cp = String.valueOf(paramMap.get("cp"));
		String bh = String.valueOf(paramMap.get("bh"));
		String cxtj="";

		if(!cp.equals("")){
			cxtj = " and t.VECHICLE_PLATE like '%"+cp+"%'";
		}
		if(!bh.equals("")){
			cxtj = " and t.ORDER_NR = '"+bh+"'";
		}
		String sql ="select t.*,t1.vehi_sim from tb_order@DB69 t"
						+" left join vw_vehicle@DB69 t1 on t.VECHICLE_PLATE=t1.VEHI_NO where 1=1 "
						+ ""+cxtj
						+" and to_char(t.ORDER_START_TIME,'yyyy-dd-mm')=to_char(sysdate,'yyyy-dd-mm') order by t.ORDER_START_TIME desc";

//				System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		Map<String, Object> resultlist=new HashMap<String, Object>();
		List<Map<String, Object>> zzddlist=new ArrayList<Map<String, Object>>();//正在调度
		List<Map<String, Object>> rwclist=new ArrayList<Map<String, Object>>();//任务车监控
		int zzddxh=0,rwcxh=0;
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			if((!m.get("LATEST_STATUS").toString().equals("3"))&&m.get("DIAODU_STATUS").toString().equals("1")&&m.get("VECHICLE_PLATE")!=null&&m.get("ORDER_VALID").toString().equals("0")){
				Map<String, Object> rwc = getrwc(m.get("VECHICLE_PLATE").toString());
				if(rwc==null){
//					continue;
				}else{
					rwcxh++;
					rwc.put("RWCXH", rwcxh);
					rwc.put("DISP_ID", m.get("ORDER_NR").toString());
					rwclist.add(rwc);
				}

			}
			zzddxh++;
			m.put("XXYWXH", zzddxh);
			zzddlist.add(m);
		}
		resultlist.put("xxyw", zzddlist);
		resultlist.put("rwc", rwclist);
		return jacksonUtil.toJson(resultlist);
	}

	private Map<String, Object> getrwc(String cp) {
		String sql1 = "select VEHI_NO,PX,PY,STIME,SPEED,STATE,VEHI_SIM,ANGLE,MT_NAME,VT_NAME,OWN_TEL,COMP_NAME, OWNER_NAME,OWN_NAME,DISP_NUM,INTEGRAL,COMPL_NUM from vw_vehi_mdt@DB69 t where t.VEHI_NO=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql1,cp);
		if(list.size()>0){
			return list.get(0);
		}
		return null;
	}


}
