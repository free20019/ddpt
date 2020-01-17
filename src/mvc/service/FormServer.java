package mvc.service;

import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.xml.namespace.QName;
import javax.xml.ws.BindingProvider;

import helper.JacksonUtil;
import mvc.entity.Vehicle;
import net.sf.json.JSONObject;

import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


@Service
public class FormServer {
	protected JdbcTemplate jdbcTemplate = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();
	public String time(String time){
		return time.substring(2, 4)+time.substring(5, 7);
	}
	public String nextTime(String time){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date date = sdf.parse(time);
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			calendar.set(Calendar.DAY_OF_MONTH,1);
			calendar.add(Calendar.MONTH, -1);
			String riqi = sdf.format(calendar.getTime());
			return riqi.substring(2, 4)+riqi.substring(5, 7);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	DecimalFormat    df   = new DecimalFormat("######0.00");
	/**
	 * 公司车辆统计
	 */
	public String gscltj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String owner_name = String.valueOf(paramMap.get("owner_name"));
		String comp_name = String.valueOf(paramMap.get("comp_name"));
		String sql = "select a.*,t.comp_name,o.owner_name from( select comp_id,count(1) nums"
				+ " from TB_VEHICLE t where comp_id is not null group by comp_id) a,"
				+ "tb_owner o, tb_company t where a.comp_id=t.comp_id"
				+ " and t.owner_id=o.owner_id";
		if(comp_name!=null&&comp_name.length()>0&&!comp_name.equals("null")&&!comp_name.equals("选择分公司")){
			sql += " and t.comp_name = '"+comp_name+"'";
		}
		if(owner_name!=null&&owner_name.length()>0&&!owner_name.equals("null")){
			sql += " and o.owner_name = '"+owner_name+"'";
		}
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return jacksonUtil.toJson(list);
	}
	/**
	 * 叫车统计
	 */
	public String jctj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String type = String.valueOf(paramMap.get("type"));
		String time = time(etime);
		String nextTime = nextTime(etime);
		String sql = "select * from (select disp_type, COUNT(CASE WHEN vehi_no is not null THEN 1 ELSE NULL END) cg,"
				+ " count(1) zs from (select case when ddqy='爱心出租' then '爱心出租自动' else disp_type end disp_type"
				+ ",vehi_no from TB_DISPATCH_"+time+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		if(!type.equals("null")&&!type.equals("全部")){
			sql += " and disp_type = '"+type+"'";
		}
		sql += "union all select case when ddqy='爱心出租' then '爱心出租自动' else disp_type end disp_type,"
				+ "vehi_no from TB_DISPATCH_"+nextTime+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') union all "
			    + " select case when ddqy='爱心出租(人工)' then '爱心出租人工' else disp_type end disp_type,"
			    + "case when disp_state='调度完成' then vehi_no1 else null end vehi_no1 from" 
			    + " TB_DISPATCH_love t where disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
			    + " and disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		sql +=" and del_flag = '0') group by disp_type) where 1=1";
		if(!type.equals("null")&&!type.equals("全部")){
			sql += " and disp_type = '"+type+"'";
		}
//		String sql = "select disp_type,COUNT (CASE WHEN vehi_no is not null THEN 1 ELSE NULL END) cg,"
//				+ "count(1) zs from TB_DISPATCH_"+time+" t where disp_time >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')"
//				+ " and  disp_time <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
//		if(!type.equals("null")&&!type.equals("全部")){
//			sql += " and disp_type = '"+type+"'";
//		}
//		sql += " group by disp_type";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		DecimalFormat    df   = new DecimalFormat("######0.00"); 
		int wccs=0,ddzs=0;
		for (int i = 0; i < list.size(); i++) {
			wccs += Integer.parseInt(list.get(i).get("CG").toString());
			ddzs += Integer.parseInt(list.get(i).get("ZS").toString());
			list.get(i).put("lv", df.format(Double.parseDouble(String.valueOf(list.get(i).get("cg")))
					/Double.parseDouble(String.valueOf(list.get(i).get("zs")))*100)+"%");
		}
		if(list.size()>0){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("DISP_TYPE", "总计");
			map.put("CG", wccs);
			map.put("ZS", ddzs);
			map.put("lv", df.format((double)wccs/(double)ddzs*100)+"%");
			list.add(0,map);
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 * 坐席调度统计
	 */
	public String zxddtj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String type = String.valueOf(paramMap.get("type"));
		String time = time(etime);
		String nextTime = nextTime(etime);
		String sql = "select disp_user, COUNT(CASE WHEN vehi_no is not null THEN 1 ELSE NULL END) cg,"
				+ " count(1) zs from (select CASE WHEN YEWU_TYPE = '1' THEN '小货调度' WHEN DISP_TYPE = '平板扬招' THEN '平板扬招' ELSE NVL(disp_user, disp_type) END disp_user"
				+ ",vehi_no from TB_DISPATCH_"+time+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		sql += "union all select CASE WHEN YEWU_TYPE = '1' THEN '小货调度' WHEN DISP_TYPE = '平板扬招' THEN '平板扬招' ELSE NVL(disp_user, disp_type) END disp_user,vehi_no from TB_DISPATCH_"+nextTime+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')"
	           + " union all select disp_user,case when disp_state='调度完成' then vehi_no1 else null"
	           + " end vehi_no1 from tb_dispatch_love t where"
	           + " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
	           + " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		sql +=" and del_flag = '0') group by disp_user";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		DecimalFormat    df   = new DecimalFormat("######0.00"); 
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("DISP_USER", String.valueOf(list.get(i).get("DISP_USER")).equals("null")?"其他":list.get(i).get("DISP_USER"));
			list.get(i).put("lv", df.format(Double.parseDouble(String.valueOf(list.get(i).get("cg")))
					/Double.parseDouble(String.valueOf(list.get(i).get("zs")))*100)+"%");
		}
		int wccs=0,ddzs=0;
		for (int i = 0; i < list.size(); i++) {
			wccs += Integer.parseInt(list.get(i).get("CG").toString());
			ddzs += Integer.parseInt(list.get(i).get("ZS").toString());
		}
		if(list.size()>0){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("DISP_USER", "总计");
			map.put("CG", wccs);
			map.put("ZS", ddzs);
			map.put("lv", df.format((double)wccs/(double)ddzs*100)+"%");
			list.add(0,map);
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 *公司接单排名
	 */
	public String gsjdpm(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String owner_name = String.valueOf(paramMap.get("owner_name"));
		String comp_name = String.valueOf(paramMap.get("comp_name"));
		String num = String.valueOf(paramMap.get("num"));
		String time = time(etime);
		String nextTime = nextTime(etime);
		String sql = "select * from(select comp_name ,count(1) zs from(select c.comp_name from tb_dispatch_"+time+" d,"
				+ " tb_vehicle v, tb_company c, tb_owner o where d.vehi_no = v.vehi_no and c.comp_id = v.comp_id and"
				+ " c.owner_id = o.owner_id and disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " and disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') ";
		if(owner_name!=null&&owner_name.length()>0&&!owner_name.equals("null")){
			sql += " and owner_name = '"+owner_name+"'";
		}
		if(comp_name!=null&&comp_name.length()>0&&!comp_name.equals("null")){
			sql += " and c.comp_name = '"+comp_name+"'";
		}
		sql += "union all select c.comp_name from tb_dispatch_"+nextTime+" d, tb_vehicle v, tb_company c, tb_owner o"
				+ " where d.vehi_no = v.vehi_no and c.comp_id = v.comp_id and c.owner_id = o.owner_id and"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		if(owner_name!=null&&owner_name.length()>0&&!owner_name.equals("null")){
			sql += " and owner_name = '"+owner_name+"'";
		}
		if(comp_name!=null&&comp_name.length()>0&&!comp_name.equals("null")){
			sql += " and c.comp_name = '"+comp_name+"'";
		}
		sql += " union all select v.comp_name from tb_dispatch_love l,vw_vehicle v where l.vehi_no1 = v.vehi_no and"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and" 
			+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') and l.del_flag = '0') group by comp_name) where 1=1";
//		String sql = " select * from (select c.comp_name,count(1) zs from tb_dispatch_"+time+" d,"
//				+ "tb_vehicle v,tb_company c,tb_owner o where d.vehi_no = v.vehi_no "
//				+ "and c.comp_id = v.comp_id and c.owner_id = o.owner_id and "
//				+ "disp_time >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')"
//				+ " and  disp_time <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
//		if(owner_name!=null&&owner_name.length()>0&&!owner_name.equals("null")){
//			sql += " and owner_name = '"+owner_name+"'";
//		}
//		if(comp_name!=null&&comp_name.length()>0&&!comp_name.equals("null")){
//			sql += " and c.comp_name = '"+comp_name+"'";
//		}
//		sql += " group by c.comp_name order by comp_name) where 1=1";
		if(num!=null&&num.length()>0&&!num.equals("null")){
			sql += " and zs > "+num;
		}
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int zs =0;
		for (int i = 0; i < list.size(); i++) {
			zs += Integer.parseInt(list.get(i).get("ZS").toString());
		}
		if(list.size()>0){
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("COMP_NAME", "总计");
			map.put("ZS", zs);
			list.add(0,map);
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 *车辆接单排名
	 */
	public String cljdpm(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String time = time(etime);
		String nextTime = nextTime(etime);
//		String sql = "select a.*,v.vsim_num,c.comp_name from (select d.vehi_no,count(1) cs from tb_dispatch_"+time+" d"
//				+ " where disp_time >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')"
//				+ " and  disp_time <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')"
//				+ "  group by d.vehi_no) a,tb_vehicle v,tb_company c "
//				+ " where a.vehi_no = v.vehi_no and c.comp_id = v.comp_id order by cs desc";
		String sql = "select a.*, v.vsim_num, c.comp_name from (select s.vehi_no, count(1) cs"
				+ " from(select d.vehi_no from tb_dispatch_"+time+" d where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') "
				+ " union all select d.vehi_no from tb_dispatch_"+nextTime+" d where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') union all select vehi_no1"
				+ " from tb_dispatch_love where disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') and del_flag = '0' ) s group by s.vehi_no) a,"
				+ " tb_vehicle v, tb_company c where a.vehi_no = v.vehi_no and c.comp_id = v.comp_id order by cs desc";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	/**
	 *分时段统计
	 */
	public String fsdtj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String z_stime = String.valueOf(paramMap.get("z_stime"));//早
		String z_etime = String.valueOf(paramMap.get("z_etime"));
		String w_stime = String.valueOf(paramMap.get("w_stime"));//晚
		String w_etime = String.valueOf(paramMap.get("w_etime"));
		String wgf_stime = String.valueOf(paramMap.get("wgf_stime"));//午
		String wgf_etime = String.valueOf(paramMap.get("wgf_etime"));
		String t_stime = String.valueOf(paramMap.get("t_stime"));//通宵
		String t_etime = String.valueOf(paramMap.get("t_etime"));
		String zdy_stime = String.valueOf(paramMap.get("zdy_stime"));//自定义
		String zdy_etime = String.valueOf(paramMap.get("zdy_etime"));
		String time = time(etime);
		String nextTime = nextTime(etime);
//		String sql = "select * from tb_dispatch_"+time+" d"
//				+ " where disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
//				+ " and  disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		String sql = "select disp_time,disp_state from tb_dispatch_"+time+" d where"
				+ " disp_time >= to_date('"+stime+" 00:00:00', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+" 23:59:59', 'yyyy-mm-dd hh24:mi:ss') union all"
				+ " select disp_time,disp_state from tb_dispatch_"+nextTime+" d where"
				+ " disp_time >= to_date('"+stime+" 00:00:00', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+" 23:59:59', 'yyyy-mm-dd hh24:mi:ss')";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int zgfcg = 0,zgfsb = 0,wgfcg = 0,wgfsb = 0,wgfcg1 = 0,wgfsb1 = 0,txcg = 0,txsb = 0,zdycg = 0,zdysb = 0;
		String disp_stime = "",disp_etime = "";
		for (int i = 0; i < list.size(); i++) {
			disp_stime = list.get(i).get("disp_time").toString().substring(0, 10);
			disp_etime = list.get(i).get("disp_time").toString().substring(0, 16);
			if(zhuanhuan(disp_stime+" "+z_stime)<zhuanhuan(disp_etime)&&zhuanhuan(disp_stime+" "+z_etime)>zhuanhuan(disp_etime)){
				if(list.get(i).get("disp_state").toString().equals("调度完成")){
					zgfcg += 1;
				}else{
					zgfsb += 1;
				}
			}else if(zhuanhuan(disp_stime+" "+w_stime)<zhuanhuan(disp_etime)&&zhuanhuan(disp_stime+" "+w_etime)>zhuanhuan(disp_etime)){
				if(list.get(i).get("disp_state").toString().equals("调度完成")){
					wgfcg += 1;
				}else{
					wgfsb += 1;
				}
			}else if(zhuanhuan(disp_stime+" "+wgf_stime)<zhuanhuan(disp_etime)&&zhuanhuan(disp_stime+" "+wgf_etime)>zhuanhuan(disp_etime)){
				if(list.get(i).get("disp_state").toString().equals("调度完成")){
					wgfcg1 += 1;
				}else{
					wgfsb1 += 1;
				}
			}else if(zhuanhuan(disp_stime+" "+t_stime)<zhuanhuan(disp_etime)&&zhuanhuan(disp_stime+" "+t_etime)*1000*60*60*24>zhuanhuan(disp_etime)){
				if(list.get(i).get("disp_state").toString().equals("调度完成")){
					txcg += 1;
				}else{
					txsb += 1;
				}
			}else{
				if(zdy_stime!=null&&zdy_stime.length()>0&&!zdy_stime.equals("null")
					&&zdy_etime!=null&&zdy_etime.length()>0&&!zdy_etime.equals("null")){
					if(zhuanhuan(disp_stime+" "+zdy_stime)<zhuanhuan(disp_etime)&&zhuanhuan(disp_stime+" "+zdy_etime)>zhuanhuan(disp_etime)){
						if(list.get(i).get("disp_state").toString().equals("调度完成")){
							zdycg += 1;
						}else{
							zdysb += 1;
						}
					}
				}
			}
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("zgfcg", zgfcg);
		map.put("zgfsb", zgfsb);
		map.put("wgfcg", wgfcg);
		map.put("wgfsb", wgfsb);
		map.put("wgfcg1", wgfcg1);
		map.put("wgfsb1", wgfsb1);
		map.put("txcg", txcg);
		map.put("txsb", txsb);
		map.put("zdycg", zdycg);
		map.put("zdysb", zdysb);
		return jacksonUtil.toJson(map);
	}
	public long zhuanhuan(String time){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		long l = 0;
		try {
			l = sdf.parse(time).getTime();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return l;
	}
	/**
	 * 未上线车辆统计
	 */
	public String wsxcl(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String comp = String.valueOf(paramMap.get("comp"));
		long ts = getDaySub(stime, etime)+1;
		String sql = "select * from (select vehi_no,count(1) c,max(online_time) online_time"
				+ " from TB_TAXI_NOT_ONLINE t  where db_time >= to_date('"+stime+" 00:00:00', 'yyyy-mm-dd hh24:mi:ss')"
				+ " and db_time <=to_date('"+etime+" 23:59:59', 'yyyy-mm-dd hh24:mi:ss')  group by vehi_no) o,VW_VEHICLE v where o.vehi_no = v.VEHI_NO"
				+ " and c >="+ts;
//		String sql = "select * from (select vehi_no,max(online_time) online_time from Tb_taxi_not_online where"
//				+ " db_time >= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
//				+ " db_time <= to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') group by vehi_no) o,VW_VEHICLE v where o.vehi_no = v.VEHI_NO";
		if(comp!=null&&!comp.equals("null")&&comp.length()>0){
			sql += " and comp_name = '"+comp+"'";
		}
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("TIME", String.valueOf(list.get(i).get("ONLINE_TIME")));
		}
		return jacksonUtil.toJson(list);
	}
	 public static long getDaySub(String beginDateStr,String endDateStr)
	  {
	      long day=0;
	      java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyy-MM-dd");    
	      java.util.Date beginDate;
	      java.util.Date endDate;
	      try
	      {
	          beginDate = format.parse(beginDateStr);
	          endDate= format.parse(endDateStr);    
	          day=(endDate.getTime()-beginDate.getTime())/(24*60*60*1000);    
	          //System.out.println("相隔的天数="+day);   
	      } catch (ParseException e)
	      {
	          // TODO 自动生成 catch 块
	          e.printStackTrace();
	      }   
	      return day;
	  }
	/**
	 * 车辆上线率统计
	 */
	public String sxltj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime")) +" 00:00:00";
		String etime = String.valueOf(paramMap.get("etime")) +" 23:59:59";
		String comp = String.valueOf(paramMap.get("comp"));
		String quyu = String.valueOf(paramMap.get("quyu"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		int days = 0;
		try {
			Date s = sdf.parse(stime);
			Date e = sdf.parse(etime);
			days = differentDaysByMillisecond(s, e);
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		String riqi = stime.substring(2, 4)+stime.substring(5, 7);
//		String sql = "select * from (select comp_id,max(online_num) online_num,max(vehi_num) vehi_num from tb_taxi_online where"
//				+ " db_time >= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
//				+ " db_time <= to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') group by comp_id) o,"
//				+ "tb_company v,TB_BUSI_AREA b where o.comp_id = v.comp_id and v.ba_id=b.ba_id";
		String sql = "select xx.*,nvl(bt.c,0) bt,nvl(yy.c,0) wyyc from (select b.ba_name,c.comp_name,d.* from(select a.*,aa.online_num from (select c.comp_id,count(1) VEHI_NUM"
				+ " from tb_company c,vw_vehicle v where c.comp_id=v.comp_id group by c.comp_id) a left join"
				+ " (select v.comp_id,count(1) ONLINE_NUM from vw_vehicle v,(select vehi_no from TB_TAXI_ONLINE_"+riqi
				+ " where db_time >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')  group by vehi_no) t where v.VEHI_NO=t.vehi_no";
		if(comp!=null&&!comp.equals("null")&&comp.length()>0){
			sql += " and comp_name = '"+comp+"'";
		}
		sql += " group by comp_id) aa on a.comp_id=aa.comp_id) d,tb_company c,tb_busi_area b where c.comp_id = d.comp_id";
		String qyid="";
        if(quyu.equals("主城区")){
            qyid = "11";
        }else if(quyu.equals("余杭区")){
            qyid = "87";
        }else if(quyu.equals("萧山区")){
            qyid = "88";
        }else if(quyu.equals("临安区")){
            qyid = "90";
        }else if(quyu.equals("富阳区")){
            qyid = "89";
        }else if(quyu.equals("淳安区")){
            qyid = "12";
        }else if(quyu.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
        	sql += " and b.owner_id='"+qyid+"'";
        }
		sql += " and c.ba_id = b.ba_id) xx left join "
				+ " (select comp_id,count(1) c from TB_VEHICLE_STOP s,vw_vehicle v where s.vehicle_no=v.VEHI_NO"
				+ " and audit_status = '0' group by comp_id) bt"
				+ " on xx.comp_id=bt.comp_id"
				+ " left join "
				+ " ( select comp_id,count(1) c from (select vehi_no from (select vehi_no,count(1) c from TB_TAXI_NOT_ONLINE where"
				+ "  db_time >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by vehi_no) where c >="+days+") o,"
				+ " (select vhic from(select vhic,count(1) c from TB_JJQ_STATIC where \"Y/N\" = 'N' and "
				+ " db_time >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
				+ "  db_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by vhic) where"
				+ " c>="+days+") y,vw_vehicle v where o.vehi_no = '浙'||y.vhic"
				+ " and v.vehi_no = o.vehi_no group by comp_id) yy on xx.comp_id=yy.comp_id";
		System.out.println(sql);
		int sxs=0,zs=0,bt=0,wyy=0;
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("ONLINE", String.valueOf(list.get(i).get("online_num")).equals("null")?"0":
				Integer.parseInt(list.get(i).get("online_num").toString()));
			zs += Integer.parseInt(list.get(i).get("VEHI_NUM").toString());
			sxs+= Integer.parseInt(list.get(i).get("ONLINE").toString());
			bt += Integer.parseInt(list.get(i).get("BT").toString());
			wyy += Integer.parseInt(list.get(i).get("WYYC").toString());
			list.get(i).put("SXL", df.format(Double.parseDouble(list.get(i).get("ONLINE").toString())
					/(Double.parseDouble(list.get(i).get("vehi_num").toString())
							- Double.parseDouble(list.get(i).get("BT").toString())
							-Double.parseDouble(list.get(i).get("WYYC").toString()))*100)+"%");
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("COMP_NAME", "总计");
		map.put("VEHI_NUM", zs);
		map.put("BT", bt);
		map.put("WYYC", wyy);
		map.put("ONLINE", sxs);
		map.put("SXL", df.format((double)sxs/(double)(zs-bt-wyy)*100)+"%");
		list.add(0,map);
		return jacksonUtil.toJson(list);
	}
	/**
	 * 车辆上线率统计
	 */
	public String sxlmxtj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime")) +" 00:00:00";
		String etime = String.valueOf(paramMap.get("etime")) +" 23:59:59";
		String quyu = String.valueOf(paramMap.get("quyu"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String tj = "";
		String qyid="";
        if(quyu.equals("主城区")){
            qyid = "11";
        }else if(quyu.equals("余杭区")){
            qyid = "87";
        }else if(quyu.equals("萧山区")){
            qyid = "88";
        }else if(quyu.equals("临安区")){
            qyid = "90";
        }else if(quyu.equals("富阳区")){
            qyid = "89";
        }else if(quyu.equals("淳安区")){
            qyid = "12";
        }else if(quyu.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
        	tj = " and owner_id='"+qyid+"'";
        }
		String riqi = stime.substring(2, 4)+stime.substring(5, 7);
		String sql = "select xx.*, nvl(bt.c, 0) bt, nvl(yy.c, 0) wyyc from (select aa.* from"
				+ " (select count(1) ONLINE_NUM,db_time from vw_vehicle v,"
				+ " (select db_time,vehi_no from TB_TAXI_ONLINE_"+riqi+" where"
				+ " db_time >=  to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " and db_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " group by db_time,vehi_no) t where v.VEHI_NO = t.vehi_no";
		sql += tj;
		sql += " group by db_time) aa ) xx left join (select to_char(stop_time,'yyyy-mm-dd') stop_time,count(1) c"
			+ " from TB_VEHICLE_STOP s, vw_vehicle v  where s.vehicle_no = v.VEHI_NO and audit_status = '0'";
		sql += tj;
		sql += " group by to_char(stop_time,'yyyy-mm-dd')) bt on xx.db_time = bt.stop_time left join"
		+ " (select to_date(y.db_time,'yyyy-mm-dd') db_time, count(1) c from (select to_char(db_time,'yyyy-mm-dd') db_time"
		+ ",vehi_no from TB_TAXI_NOT_ONLINE where db_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
		+ " and db_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by to_char(db_time,'yyyy-mm-dd')"
		+ ",vehi_no) o, (select to_char(db_time,'yyyy-mm-dd') db_time,vhic from TB_JJQ_STATIC where \"Y/N\" = 'N'"
		+ " and db_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
		+ " db_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by to_char(db_time,'yyyy-mm-dd'),vhic) y,"
		+ " vw_vehicle v where o.vehi_no = '浙' || y.vhic and o.db_time = y.db_time and v.vehi_no = o.vehi_no";
		sql += tj;
		sql += " group by y.db_time) yy on xx.db_time = yy.db_time order by xx.db_time desc";
		System.out.println(sql);
		String num = "select count(1) c from vw_vehicle where 1=1";
		num += tj;
		int vehi_num = jdbcTemplate.queryForObject(num, Integer.class);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("VEHI_NUM", vehi_num);
			list.get(i).put("DB_TIME", String.valueOf(list.get(i).get("db_time")).substring(0, 10));
			list.get(i).put("ONLINE", String.valueOf(list.get(i).get("online_num")).equals("null")?"0":
				Integer.parseInt(list.get(i).get("online_num").toString()));
			list.get(i).put("SXL", df.format(Double.parseDouble(list.get(i).get("ONLINE").toString())
					/(Double.parseDouble(list.get(i).get("vehi_num").toString())
							- Double.parseDouble(list.get(i).get("BT").toString())
							-Double.parseDouble(list.get(i).get("WYYC").toString()))*100)+"%");
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 * 营运率统计
	 */
	public String yyltj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime")) +" 00:00:00";
		String etime = String.valueOf(paramMap.get("etime")) +" 23:59:59";
		String comp = String.valueOf(paramMap.get("comp"));
		String quyu = String.valueOf(paramMap.get("quyu"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		int days = 0;
		try {
			Date s = sdf.parse(stime);
			Date e = sdf.parse(etime);
			days = differentDaysByMillisecond(s, e);
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		String st = String.valueOf(paramMap.get("stime")).replaceAll("-", "");
		String et = String.valueOf(paramMap.get("etime")).replaceAll("-", "");
		String riqi = stime.substring(2, 4)+stime.substring(5, 7);
		String sql = "select xx.*,nvl(bt.c,0) btcl,nvl(yy.c,0) wsj from(select ba.ba_name,v.comp_name,v.comp_id,"
				+ "s.yycl,s.vehi_num from tb_company v,tb_busi_area ba,(select a.comp_id,a.vehi_num,nvl(b.c,0) yycl"
				+ " from(select c.comp_id,count(1) VEHI_NUM from vw_vehicle c group by c.comp_id) a left join " 
				+ " (select comp_id,count(1) c from (select cphm_new from jjq.JJQ_TJ_"+st.substring(0, 6)+"_DAY@jjq89 where type = 5"
				+ " and day>='"+st+"' and day<='"+et+"' group by cphm_new) j,vw_vehicle v where '浙'||j.cphm_new = v.vehi_no"
				+ " group by comp_id) b on a.comp_id=b.comp_id) s where v.comp_id=s.comp_id and v.ba_id=ba.ba_id";
				if(comp!=null&&!comp.equals("null")&&comp.length()>0){
					sql += " and comp_name = '"+comp+"'";
				}
		        String qyid="";
		        if(quyu.equals("主城区")){
		            qyid = "11";
		        }else if(quyu.equals("余杭区")){
		            qyid = "87";
		        }else if(quyu.equals("萧山区")){
		            qyid = "88";
		        }else if(quyu.equals("临安区")){
		            qyid = "90";
		        }else if(quyu.equals("富阳区")){
		            qyid = "89";
		        }else if(quyu.equals("淳安区")){
		            qyid = "12";
		        }else if(quyu.equals("建德市")){
		            qyid = "21";
		        }
		        if(!qyid.equals("")){
		        	sql += " and ba.owner_id='"+qyid+"'";
		        }
				sql += " ) xx  left join (select comp_id,count(1) c from TB_VEHICLE_STOP s,vw_vehicle v"
					+ " where s.vehicle_no=v.VEHI_NO and audit_status = '0' group by comp_id) bt "
				+ " on xx.comp_id=bt.comp_id left join ( select comp_id,count(1) c from (select vehi_no from (select vehi_no,count(1) c from"
				+ " TB_TAXI_NOT_ONLINE where  db_time >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and "
				+ " db_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by vehi_no) where c >="+days+") o, "
				+ " (select vhic from(select vhic,count(1) c from TB_JJQ_STATIC where "
				+ " db_time >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and "
				+ " db_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by vhic) where c>="+days+") y"
						+ ",vw_vehicle v where o.vehi_no = '浙'||y.vhic "
				+ " and v.vehi_no = o.vehi_no group by comp_id) yy on xx.comp_id=yy.comp_id";
		
		System.out.println(sql);
		int sxs=0,zs=0,bt=0,wyy=0;
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			zs += Integer.parseInt(list.get(i).get("VEHI_NUM").toString());
			sxs+= Integer.parseInt(list.get(i).get("YYCL").toString());
			bt += Integer.parseInt(list.get(i).get("BTCL").toString());
			wyy += Integer.parseInt(list.get(i).get("WSJ").toString());
			list.get(i).put("SXL", df.format(Double.valueOf(list.get(i).get("YYCL").toString())/(
					Double.valueOf(list.get(i).get("VEHI_NUM").toString()) -
					Double.valueOf(list.get(i).get("BTCL").toString()) -
					Double.valueOf(list.get(i).get("WSJ").toString())
					)*100)+"%");
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("COMP_NAME", "总计");
		map.put("VEHI_NUM", zs);
		map.put("YYCL", sxs);
		map.put("BTCL", bt);
		map.put("WSJ", wyy);
		map.put("SXL", df.format((double)sxs/(double)(zs-bt-wyy)*100)+"%");
		list.add(0,map);
		return jacksonUtil.toJson(list);
	}
	public String yylmxtj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime")) +" 00:00:00";
		String etime = String.valueOf(paramMap.get("etime")) +" 23:59:59";
		String quyu = String.valueOf(paramMap.get("quyu"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		int days = 0;
		try {
			Date s = sdf.parse(stime);
			Date e = sdf.parse(etime);
			days = differentDaysByMillisecond(s, e);
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		 String qyid="";
		 String tj = "";
        if(quyu.equals("主城区")){
            qyid = "11";
        }else if(quyu.equals("余杭区")){
            qyid = "87";
        }else if(quyu.equals("萧山区")){
            qyid = "88";
        }else if(quyu.equals("临安区")){
            qyid = "90";
        }else if(quyu.equals("富阳区")){
            qyid = "89";
        }else if(quyu.equals("淳安区")){
            qyid = "12";
        }else if(quyu.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
        	tj = " and owner_id='"+qyid+"'";
        }
		String st = String.valueOf(paramMap.get("stime")).replaceAll("-", "");
		String et = String.valueOf(paramMap.get("etime")).replaceAll("-", "");
		String riqi = stime.substring(2, 4)+stime.substring(5, 7);
		System.out.println(riqi);
		String sql = "select xx.*, nvl(bt.c, 0) btcl, nvl(yy.c, 0) wsj from (select day, count(1) yycl from"
				+ " (select to_date(day,'yyyymmdd') day,cphm_new from jjq.JJQ_TJ_"+st.substring(0, 6)+"_DAY@jjq89 where type = 5 and"
				+ " day >= '"+st+"' and day <= '"+et+"' group by to_date(day,'yyyymmdd'),cphm_new) j, vw_vehicle v"
				+ " where '浙' || j.cphm_new = v.vehi_no ";
		sql += tj;
		sql += "group by day) xx left join (select to_char(stop_time, 'yyyy-mm-dd') stop_time, count(1) c"
				+ " from TB_VEHICLE_STOP s, vw_vehicle v where s.vehicle_no = v.VEHI_NO and audit_status = '0'";
		sql += tj;
		sql += " group by to_char(stop_time, 'yyyy-mm-dd')) bt on xx.day = bt.stop_time left join (select"
				+ " to_date(y.db_time, 'yyyy-mm-dd') db_time, count(1) c from (select to_char(db_time, 'yyyy-mm-dd') db_time,"
				+ " vehi_no from TB_TAXI_NOT_ONLINE where db_time >=  to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " and db_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by to_char(db_time, 'yyyy-mm-dd'),"
				+ " vehi_no) o, (select to_char(db_time, 'yyyy-mm-dd') db_time, vhic from TB_JJQ_STATIC where"
				+ " \"Y/N\" = 'N' and db_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by to_char(db_time, 'yyyy-mm-dd'),"
				+ " vhic) y, vw_vehicle v where o.vehi_no = '浙' || y.vhic and o.db_time = y.db_time and"
				+ " v.vehi_no = o.vehi_no ";
		sql += tj;
		sql += "group by y.db_time) yy on xx.day = yy.db_time order by day desc";
		System.out.println(sql);String num = "select count(1) c from vw_vehicle where 1=1";
		num += tj;
		int vehi_num = jdbcTemplate.queryForObject(num, Integer.class);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("VEHI_NUM", vehi_num);
			list.get(i).put("DAY", String.valueOf(list.get(i).get("day")).substring(0, 10));
			list.get(i).put("SXL", df.format(Double.valueOf(list.get(i).get("YYCL").toString())/(
					Double.valueOf(list.get(i).get("VEHI_NUM").toString()) -
					Double.valueOf(list.get(i).get("BTCL").toString()) -
					Double.valueOf(list.get(i).get("WSJ").toString())
					)*100)+"%");
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 * 新装车辆统计
	 * @param postData
	 * @return
	 */
	public String xzcltj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String sql = "select t.*,c.comp_name from TB_VEHICLE t,tb_company c where t.comp_id=c.comp_id and"
				+ " mtn_time >= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " mtn_time <= to_date('"+etime+" 00:00:00','yyyy-mm-dd hh24:mi:ss')";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	/**
	 * 在线时长统计
	 * @param postData
	 * @return
	 */
	public String zxsctj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String comp = String.valueOf(paramMap.get("comp"));
		String sim = String.valueOf(paramMap.get("sim"));
		String vhic = String.valueOf(paramMap.get("vhic"));
		String sql = "select * from (select vehi_no,sum(Location_num) Location_num,min(sx_time) sx_time"
				+ ",max(xx_time) xx_time,sum(duration) duration from tb_duration where"
				+ " sx_time >= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " sx_time <= to_date('"+etime+" 00:00:00','yyyy-mm-dd hh24:mi:ss')  group by vehi_no) s"
				+ ",vw_vehicle v where s.vehi_no = v.vehi_no";
		if(comp!=null&&!comp.equals("null")&&comp.length()>0){
			sql += " and comp_name = '"+comp+"'";
		}
		if(sim!=null&&!sim.equals("null")&&sim.length()>0){
			sql += " and vehi_sim = '"+sim+"'";
		}
		if(vhic!=null&&!vhic.equals("null")&&vhic.length()>0){
			sql += " and v.vehi_no = '"+vhic+"'";
		}
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("DURATION", df.format(Double.parseDouble(list.get(i).get("DURATION").toString())));
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 * 报警车辆统计
	 * @param postData
	 * @return
	 */
	public String bjcltj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String comp = String.valueOf(paramMap.get("comp"));
		String sim = String.valueOf(paramMap.get("sim"));
		String vhic = String.valueOf(paramMap.get("vhic"));
		String sql = "select * from (select vehi_no,sum(cs_alarm) cs_alarm,sum(pl_alarm) pl_alarm,sum(jj_alarm) jj_alarm"
				+ " from tb_vehi_alarm a where cs_alarm>0 and pl_alarm>0 and jj_alarm>0 and"
				+ " s_time >= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " s_time <= to_date('"+etime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') group by a.vehi_no ) a,"
				+ "vw_vehicle v where a.vehi_no=v.VEHI_NO ";
		if(comp!=null&&!comp.equals("null")&&comp.length()>0){
			sql += " and comp_name = '"+comp+"'";
		}
		if(sim!=null&&!sim.equals("null")&&sim.length()>0){
			sql += " and vehi_sim = '"+sim+"'";
		}
		if(vhic!=null&&!vhic.equals("null")&&vhic.length()>0){
			sql += " and v.vehi_no = '"+vhic+"'";
		}
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	/**
	 * 未营运车辆统计
	 */
	public String wyycl(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"))+" 00:00:00";
		String etime = String.valueOf(paramMap.get("etime"))+" 23:59:59";
		String comp = String.valueOf(paramMap.get("comp"));
		String cphm = String.valueOf(paramMap.get("cphm"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		int days = 0;
		try {
			Date s = sdf.parse(stime);
			Date e = sdf.parse(etime);
			days = differentDaysByMillisecond(s, e);
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
//		SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd");  
//	        Date today,eoday;
//	        String s1 = "",e1 = "";
//			try {
//				today = f.parse(stime);
//				Calendar c = Calendar.getInstance();  
//		        c.setTime(today);  
//		        c.add(Calendar.DAY_OF_MONTH, 1);// 今天+1天  
//		        Date tomorrow = c.getTime();  
//		        s1 = f.format(tomorrow);
//		        
//		        eoday = f.parse(etime);
//		        Calendar c1 = Calendar.getInstance();  
//		        c1.setTime(today);  
//		        c1.add(Calendar.DAY_OF_MONTH, 1);// 今天+1天  
//		        Date tomorrow1 = c1.getTime();  
//		        e1 = f.format(tomorrow1);
//			} catch (ParseException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}  
		String sql = "select * from (select vhic,max(shangche) shangche,count(1) c from TB_JJQ_STATIC where \"Y/N\" = 'N'"
				+ " and db_time >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by vhic) o,VW_VEHICLE v where '浙'||o.vhic = v.VEHI_NO"
				+ " and c >= "+days;
		if(comp!=null&&!comp.equals("null")&&comp.length()>0){
			sql += " and comp_name = '"+comp+"'";
		}
		if(cphm!=null&&!cphm.equals("null")&&cphm.length()>0){
			sql += " and vehi_no like '%"+cphm+"%'";
		}
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("TIME", String.valueOf(list.get(i).get("SHANGCHE")));
		}
		return jacksonUtil.toJson(list);
	}
	public static int differentDaysByMillisecond(Date date1,Date date2)
	  {
	      int days = (int) ((date2.getTime()+5000 - date1.getTime()) / (1000*3600*24));
	      return days;
	  }
	/**
	 * 空重车状态无变化车辆
	 */
	public String kzcztwbhcl(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String owner = String.valueOf(paramMap.get("owner"));
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	    Date dBegin = null,dEnd = null;
		try {
			dBegin = sdf.parse(stime);
			dEnd = sdf.parse(etime);  
		} catch (ParseException e) {
			e.printStackTrace();
		}  
	      
        List<Date> lDate = findDates(dBegin, dEnd);  
        String riqi = "";
        for (Date date : lDate) { 
    	    riqi += sdf.format(date)+",";
        }  
        String[] a = riqi.substring(0, riqi.length()-1).split(",");
		String sql = "select x.*,v.comp_name,v.mt_name,v.mdt_sub_type from(select VEHICLE_NO vehi_no,";
		for (int i = 0; i < a.length; i++) {
			sql += " (select DECODE(EMPTY_HEAVY,'1','全天空重车','') EMPTY_HEAVY from tb_taxi_gzfx_history A where"
					+ " db_time=to_date('"+a[i]+"','yyyy-mm-dd') and A.VEHICLE_NO=tb_taxi_gzfx_history.VEHICLE_NO)as m"+(i+1)+",";
		}
		sql = sql.substring(0, sql.length()-1);
		sql += " from tb_taxi_gzfx_history group by VEHICLE_NO) x,vw_vehicle v where x.vehi_no = v.VEHI_NO ";
		if(!owner.equals("全部")&&!owner.equals("null")&&owner.length()>1){
			sql+= " and v.owner_name = '"+owner+"'";
		}
		sql += "and (";
		for (int i = 0; i < a.length; i++) {
			if(i==0){
				sql += " nvl(m1,'0' ) != '0'";
			}else{
				sql += " or nvl(m"+(i+1)+",'0' ) != '0'";
			}
		}
		sql += ")";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		System.out.println(sql);
		return jacksonUtil.toJson(list);
	}
	private static List<Date> findDates(Date begin, Date end) {
      List<Date> result = new ArrayList<Date>();
      Calendar tempStart = Calendar.getInstance();
	      tempStart.setTime(begin);
	   while(begin.getTime()<=end.getTime()){
	       result.add(tempStart.getTime());
	       tempStart.add(Calendar.DAY_OF_YEAR, 1);
	       begin = tempStart.getTime();
	   }
      return result;
   }
	public String[] ll(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		 Date dBegin = null,dEnd = null;
			try {
				dBegin = sdf.parse(stime);
				dEnd = sdf.parse(etime);  
			} catch (ParseException e) {
				e.printStackTrace();
			}  
		 List<Date> lDate = findDates(dBegin, dEnd);  
	        String riqi = "";
	        for (Date date : lDate) { 
	    	    riqi += sdf.format(date)+",";  
	        }  
	        String a[] = {"公司名","车牌号码","终端类型","终端子类型"};//导出列明
	  	  String[] b = riqi.split(",");
	  	  for (int i = 0; i < b.length; i++) {
	  		  a=Arrays.copyOf(a, a.length+1);//数组扩容
	  		  a[a.length-1]=b[i];  
	  	  }
	  	  return a;
	}
	public String[] lll(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
		 Date dBegin = null,dEnd = null;
			try {
				dBegin = sdf.parse(stime);
				dEnd = sdf.parse(etime);  
			} catch (ParseException e) {
				e.printStackTrace();
			}  
		 List<Date> lDate = findDates(dBegin, dEnd);  
	        String riqi = "";
	        for (Date date : lDate) { 
	    	    riqi += sdf.format(date)+",";  
	        }  
	        String a[] = {"COMP_NAME","VEHI_NO","MT_NAME","MDT_SUB_TYPE"};//导出列明
	  	  String[] b = riqi.split(",");
	  	  for (int i = 0; i < b.length; i++) {
	  		  a=Arrays.copyOf(a, a.length+1);//数组扩容
	  		  a[a.length-1]="M"+(i+1);  
	  	  }
	  	  return a;
	}
	public String yyyw(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String time = time(etime);
		String nextTime = nextTime(etime);
		String sql = "select sum(zs) zs,sum(qx) qx,sum(cg) cg from (select count(1) zs,"
				+ "COUNT(CASE WHEN disp_state = '调度取消' THEN 1 ELSE NULL END) qx,"
				+ "COUNT(CASE WHEN (vehi_no is not null and disp_state <> '调度取消') THEN 1 ELSE NULL END) cg"
				+ " from TB_DISPATCH_"+time+" t where sfyy = '1' and"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " union all select count(1) zs,"
				+ "COUNT(CASE WHEN disp_state = '调度取消' THEN 1 ELSE NULL END) qx,"
				+ "COUNT(CASE WHEN (vehi_no is not null and disp_state <> '调度取消') THEN 1 ELSE NULL END) cg"
				+ " from TB_DISPATCH_"+nextTime+" t where sfyy = '1' and"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ ")";
		DecimalFormat df = new DecimalFormat("0.00");
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		System.out.println(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("QXL", df.format(Double.parseDouble(list.get(i).get("qx").toString())/Double.parseDouble(list.get(i).get("zs").toString())*100)+"%");
			list.get(i).put("CGL", df.format(Double.parseDouble(list.get(i).get("cg").toString())/Double.parseDouble(list.get(i).get("zs").toString())*100)+"%");
		}
		return jacksonUtil.toJson(list);
	}
	/*OD流向统计*/
	public String getodlxtj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String STIME = String.valueOf(paramMap.get("STIME"));
		String ETIME = String.valueOf(paramMap.get("ETIME"));
		String SJD = String.valueOf(paramMap.get("SJD"));
		String QD = String.valueOf(paramMap.get("QD"));
		String flag = "0";
		if(!SJD.equals("全天"))
			flag = "1";
		String qyid = "3288";
		if(QD.equals("火车东站"))
			qyid = "3288";
		else if(QD.equals("萧山机场"))
			qyid = "3289";
		else if(QD.equals("城站火车站"))
			qyid = "3290";
		String sql = "select area_name,sum(count_num) count_num,a.area_id from TB_ORDER_DETAIL_OD t,TB_ORDER_AREA_PLUS a"
				+ " where t.dest_id = a.area_id and db_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and flag = '"+flag+"'"
				+ " and dep_id = '"+qyid+"' group by a.area_id,a.area_name order by count_num desc";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	/*od流向图*/
	public String getodlxt(HttpServletRequest request){
		String STIME = request.getParameter("STIME");
		String ETIME = request.getParameter("ETIME");
		String SJD = request.getParameter("SJD");
		String QD = request.getParameter("QD");
		String flag = "0";
		if(!SJD.equals("全天"))
			flag = "1";
		String qyid = "3288";
		if(QD.equals("火车东站"))
			qyid = "3288";
		else if(QD.equals("萧山机场"))
			qyid = "3289";
		else if(QD.equals("城站火车站"))
			qyid = "3290";
		String sql = "select t1.*,a1.area_coordinates from(select * from (select area_name,sum(count_num) count_num"
				+ ",A.AREA_ID from TB_ORDER_DETAIL_OD t,TB_ORDER_AREA_PLUS a where t.dest_id = a.area_id"
				+ " and db_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and flag = '"+flag+"'"
				+ " and dep_id = '"+qyid+"' group by area_name,A.AREA_ID order by count_num desc) t2 where rownum <=20) t1,"
				+ "TB_ORDER_AREA_PLUS a1 where t1.AREA_ID = a1.area_id order by count_num desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		System.out.println(sql);
		String qd = "select * from TB_ORDER_AREA_PLUS where area_id = '"+qyid+"'";
		List<Map<String, Object>> qdlist = jdbcTemplate.queryForList(qd);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("qd", qdlist);
		map.put("zd", list);
		return jacksonUtil.toJson(map);
	}
	/*od营运数据分析*/
	public String getodyysjfx(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String STIME = String.valueOf(paramMap.get("STIME"));
		String ETIME = String.valueOf(paramMap.get("ETIME"));
		String SJD = String.valueOf(paramMap.get("SJD"));
		String QD = String.valueOf(paramMap.get("QD"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String qyid = "3288";
		if(QD.equals("火车东站"))
			qyid = "3288";
		else if(QD.equals("萧山机场"))
			qyid = "3289";
		else if(QD.equals("城站火车站"))
			qyid = "3290";
		String table = STIME.substring(0, 4) + STIME.substring(5, 7);
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		List<Map<String, Object>> list1 = new ArrayList<Map<String,Object>>();
		int count = 0;
		if(SJD.equals("全天")){
			String sql = "select tjcs,cphm,ROUND(yssc/tjcs,2) yssc,ROUND(dhsj/tjcs,2) dhsj,ROUND(jine/tjcs,2) jine,"
					+ "ROUND(szlc/tjcs,2) szlc from (select sum(tjcs) tjcs,count(distinct(cphm)) cphm,sum(yssc) yssc,sum(dhsj) dhsj"
					+ ",sum(jine) jine,sum(szlc) szlc"
					+ " from jjq.JJQ_TJ_"+table+"_DAY@db89.twkj where cphm in(select vhic from TB_ORDER_DETAIL"
					+ " where dep_id = '"+qyid+"' and dep_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and dep_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss')) and type = '5'"
					+ " and day >= '"+STIME.replaceAll("-", "")+"' and day <= '"+ETIME.replaceAll("-", "")+"')";
			list1 = jdbcTemplate.queryForList(sql);
			String sql1 = "select * from (select t.*,rownum rn from jjq.JJQ"+table+"_1@DB89.TWKJ t where cbid in (select cbid from"
					+ " TB_ORDER_DETAIL t where dep_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and dep_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and dep_id = '"+qyid+"')"
					+ " and flag = '1000000000' and rownum <="+(page*pageSize)+") where rn >"+((page-1)*pageSize);
			list = jdbcTemplate.queryForList(sql1);
			count = jdbcTemplate.queryForObject("select count(1) c from jjq.JJQ"+table+"_1@DB89.TWKJ t where cbid in (select cbid from"
					+ " TB_ORDER_DETAIL t where dep_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and dep_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and dep_id = '"+qyid+"')"
					+ " and flag = '1000000000'", Integer.class);
			for (int i = 0; i < list.size(); i++) {
				list.get(i).put("JICHENG", Double.parseDouble(list.get(i).get("JICHENG").toString())/10);
				list.get(i).put("DENGHOU", (Integer.parseInt(list.get(i).get("DENGHOU").toString().substring(0, 2))*3600+
											Integer.parseInt(list.get(i).get("DENGHOU").toString().substring(2, 4))*60+
											Integer.parseInt(list.get(i).get("DENGHOU").toString().substring(4, 6)))/60);
				list.get(i).put("JINE", Integer.parseInt(list.get(i).get("JINE").toString())/100);
				list.get(i).put("KONGSHI", Double.parseDouble(list.get(i).get("KONGSHI").toString())/10);
				list.get(i).put("SCSJ", list.get(i).get("SHANGCHE").toString());
				list.get(i).put("XCSJ", list.get(i).get("XIACHE").toString());
			}
		}else{
			String sql = "select tjcs,cphm,ROUND(yssc/tjcs,2) yssc,ROUND(dhsj/tjcs,2) dhsj,ROUND(jine/tjcs,2) jine,"
					+ "ROUND(szlc/tjcs,2) szlc from (select count(1) tjcs,count(distinct(vhic)) cphm,sum(to_number(jine))/100 jine"
					+ ",sum((xiache-shangche)*24*60) yssc,sum(jicheng)/10 szlc,"
					+ "sum(substr(denghou,0,2)*60+substr(denghou,2,4)+substr(denghou,4,6)/60) dhsj"
					+ " from jjq.JJQ"+table+"_1@DB89.TWKJ t where cbid in (select cbid from TB_ORDER_DETAIL t where"
					+ " flag = '1' and dep_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
					+ " dep_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and dep_id = '"+qyid+"')"
					+ " and flag = '1000000000')";
			list1 = jdbcTemplate.queryForList(sql);
			String sql1 = "select * from (select t.*,rownum rn from jjq.JJQ"+table+"_1@DB89.TWKJ t where cbid in (select cbid from"
					+ " TB_ORDER_DETAIL t where flag = '1' and dep_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and dep_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and dep_id = '"+qyid+"')"
					+ " and flag = '1000000000' and rownum <="+(page*pageSize)+") where rn >"+((page-1)*pageSize);
			list = jdbcTemplate.queryForList(sql1);
			count = jdbcTemplate.queryForObject("select count(1) c from jjq.JJQ"+table+"_1@DB89.TWKJ t where cbid in (select cbid from"
					+ " TB_ORDER_DETAIL t where flag = '1' and dep_time >= to_date('"+STIME+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and dep_time <= to_date('"+ETIME+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and dep_id = '"+qyid+"')"
					+ " and flag = '1000000000'", Integer.class);
			for (int i = 0; i < list.size(); i++) {
				list.get(i).put("JICHENG", Double.parseDouble(list.get(i).get("JICHENG").toString())/10);
				list.get(i).put("DENGHOU", (Integer.parseInt(list.get(i).get("DENGHOU").toString().substring(0, 2))*3600+Integer.parseInt(list.get(i).get("DENGHOU").toString().substring(2, 4))*60+Integer.parseInt(list.get(i).get("DENGHOU").toString().substring(4, 6)))/60);
				list.get(i).put("JINE", Integer.parseInt(list.get(i).get("JINE").toString())/100);
				list.get(i).put("KONGSHI", Double.parseDouble(list.get(i).get("KONGSHI").toString())/10);
				list.get(i).put("SCSJ", list.get(i).get("SHANGCHE").toString());
				list.get(i).put("XCSJ", list.get(i).get("XIACHE").toString());
			}
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("mx", list);
		map.put("tj", list1);
		map.put("count", count);
		return jacksonUtil.toJson(map);
	}

	public String hwlzb(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = getPastDate(stime, -6);
		String table = time(stime);
		List<String> day = getday(stime, etime);
		String nextmonti = nextTimes(stime);
		List<Map<String, Object>> ddyw = new ArrayList<Map<String,Object>>();
		try {
			String ddywsql = "select to_char(disp_time,'yy-mm-dd') disp_time,sum(case ddqy when '爱心出租' then 1 else 0 end) axzd"
					+ ",sum(case ddqy when '爱心出租' then 0 else 1 end) ddyw from TB_DISPATCH_"+table+" where "
					+ "disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
					+ " disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
					+ " group by to_char(disp_time,'yy-mm-dd')"
					+ "union all "
					+ " select to_char(disp_time,'yy-mm-dd') disp_time,sum(case ddqy when '爱心出租' then 1 else 0 end) axzd,"
					+ " sum(case ddqy when '爱心出租' then 0 else 1 end) ddyw from TB_DISPATCH_"+nextmonti+""
					+ " where disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') group by to_char(disp_time,'yy-mm-dd')";
			System.out.println("dd:"+ddywsql);
			ddyw = jdbcTemplate.queryForList(ddywsql);
		} catch (Exception e) {
			String ddywsql = "select to_char(disp_time,'yy-mm-dd') disp_time,sum(case ddqy when '爱心出租' then 1 else 0 end) axzd"
					+ ",sum(case ddqy when '爱心出租' then 0 else 1 end) ddyw from TB_DISPATCH_"+table+" where "
					+ "disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
					+ " disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
					+ " group by to_char(disp_time,'yy-mm-dd')";
			System.out.println("dd:"+ddywsql);
			ddyw = jdbcTemplate.queryForList(ddywsql);
		}
		String axczsql = "select to_char(disp_time,'yy-mm-dd') disp_time,count(1) axrg from tb_dispatch_love where"
				+ " disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
				+ " group by to_char(disp_time,'yy-mm-dd')";
		String zxtssql = "select to_char(cs_dealdatetime,'yy-mm-dd') cs_dealdatetime,count(1) zxts  from TB_CONSULTATION"
				+ " where cs_dealdatetime >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " cs_dealdatetime <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
				+ " group by to_char(cs_dealdatetime,'yy-mm-dd')";
		System.out.println("ax:"+axczsql);
		System.out.println("zx:"+zxtssql);
		List<Map<String, Object>> axcz = jdbcTemplate.queryForList(axczsql);
		List<Map<String, Object>> zxts = jdbcTemplate.queryForList(zxtssql);
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		int DDYC = 0,AXZD = 0,AXSD = 0,ZXTS = 0;
		for (int i = 0; i < day.size(); i++) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("TIME", day.get(i));
			map.put("DDYC", "0");
			map.put("AXZD", "0");
			map.put("AXSD", "0");
			map.put("ZXTS", "0");
			list.add(map);
			for (int j = 0; j < ddyw.size(); j++) {
				if(String.valueOf(list.get(i).get("TIME")).equals(String.valueOf(ddyw.get(j).get("DISP_TIME")))){
					list.get(i).put("DDYC", ddyw.get(j).get("DDYW"));
					list.get(i).put("AXZD", ddyw.get(j).get("AXZD"));
				}
			}
			for (int j = 0; j < axcz.size(); j++) {
				if(String.valueOf(list.get(i).get("TIME")).equals(String.valueOf(axcz.get(j).get("DISP_TIME")))){
					list.get(i).put("AXSD", axcz.get(j).get("AXRG"));
				}
			}
			for (int j = 0; j < zxts.size(); j++) {
				if(String.valueOf(list.get(i).get("TIME")).equals(String.valueOf(zxts.get(j).get("CS_DEALDATETIME")))){
					list.get(i).put("ZXTS", zxts.get(j).get("ZXTS"));
				}
			}
			list.get(i).put("ZJ", Integer.parseInt(String.valueOf(list.get(i).get("DDYC")).equals("null")?"0":String.valueOf(list.get(i).get("DDYC")))+
					Integer.parseInt(String.valueOf(list.get(i).get("AXZD")).equals("null")?"0":String.valueOf(list.get(i).get("AXZD")))+
					Integer.parseInt(String.valueOf(list.get(i).get("AXSD")).equals("null")?"0":String.valueOf(list.get(i).get("AXSD")))+
					Integer.parseInt(String.valueOf(list.get(i).get("ZXTS")).equals("null")?"0":String.valueOf(list.get(i).get("ZXTS"))));
		}
		for (int j = 0; j < ddyw.size(); j++) {
			DDYC += Integer.parseInt(String.valueOf(ddyw.get(j).get("DDYW")).equals("null")?"0":String.valueOf(ddyw.get(j).get("DDYW")));
			AXZD += Integer.parseInt(String.valueOf(ddyw.get(j).get("AXZD")).equals("null")?"0":String.valueOf(ddyw.get(j).get("AXZD")));
		}
		for (int j = 0; j < axcz.size(); j++) {
			AXSD += Integer.parseInt(String.valueOf(axcz.get(j).get("AXRG")).equals("null")?"0":String.valueOf(axcz.get(j).get("AXRG")));
		}
		for (int j = 0; j < zxts.size(); j++) {
			ZXTS += Integer.parseInt(String.valueOf(zxts.get(j).get("ZXTS")).equals("null")?"0":String.valueOf(zxts.get(j).get("ZXTS")));
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("TIME", "合计");
		map.put("DDYC", DDYC);
		map.put("AXZD", AXZD);
		map.put("AXSD", AXSD);
		map.put("ZXTS", ZXTS);
		map.put("ZJ", DDYC+AXZD+AXSD+ZXTS);
		list.add(map);
		return jacksonUtil.toJson(list);
	}
	public static String nextTimes(String time){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date date = sdf.parse(time);
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			calendar.set(Calendar.DAY_OF_MONTH,1);
			calendar.add(Calendar.MONTH, 1);
			String riqi = sdf.format(calendar.getTime());
			return riqi.substring(2, 4)+riqi.substring(5, 7);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	public String getPastDate(String d ,int past) {
        SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
		try {
			date = sdf.parse(d);
		} catch (ParseException e) {
			e.printStackTrace();
		}
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_YEAR, calendar.get(Calendar.DAY_OF_YEAR) - past);
        Date today = calendar.getTime();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String result = format.format(today);
        return result;
    }
	public List<String> getday(String dateFirst,String dateSecond){
		SimpleDateFormat dateFormat = new SimpleDateFormat("yy-MM-dd");
		List<String> list = new ArrayList<String>();
        try{
            Date startDate = dateFormat.parse(dateFirst);
            Date endDate = dateFormat.parse(dateSecond);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            while(calendar.getTime().before(endDate)){   
                list.add(dateFormat.format(calendar.getTime()));
                calendar.add(Calendar.DAY_OF_MONTH, 1); 
               
            }
            list.add(dateFormat.format(endDate));
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return list;
	}
	public String getMonthLastDay(String d){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); 
    	Date date = new Date();
		try {
			date = sdf.parse(d);
		} catch (ParseException e) {
			e.printStackTrace();
		}
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
    	String lastDay = sdf.format(calendar.getTime());
    	return lastDay;
	}
	public String hwlyb(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		String time = sdf.format(new Date());
		String etime = "";
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd"); 
		if(stime.equals(time)) etime = sdf1.format(new Date());
		else etime = getMonthLastDay(stime+"-01");
		stime = String.valueOf(paramMap.get("stime"))+"-01";
		List<String> day = getday(stime, etime);
		System.out.println(day);
		String table = time(stime+"-01");
		String ddywsql = "select to_char(disp_time,'yy-mm-dd') disp_time,sum(case ddqy when '爱心出租' then 1 else 0 end) axzd"
				+ ",sum(case ddqy when '爱心出租' then 0 else 1 end) ddyw from TB_DISPATCH_"+table+" where "
				+ "disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
				+ " group by to_char(disp_time,'yy-mm-dd')";
		String axczsql = "select to_char(disp_time,'yy-mm-dd') disp_time,count(1) axrg from tb_dispatch_love where"
				+ " disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
				+ " group by to_char(disp_time,'yy-mm-dd')";
		String zxtssql = "select to_char(cs_dealdatetime,'yy-mm-dd') cs_dealdatetime,count(1) zxts  from TB_CONSULTATION"
				+ " where cs_dealdatetime >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " cs_dealdatetime <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
				+ " group by to_char(cs_dealdatetime,'yy-mm-dd')";
		System.out.println("dd:"+ddywsql);
		System.out.println("ax:"+axczsql);
		System.out.println("zx:"+zxtssql);
		List<Map<String, Object>> ddyw = jdbcTemplate.queryForList(ddywsql);
		List<Map<String, Object>> axcz = jdbcTemplate.queryForList(axczsql);
		List<Map<String, Object>> zxts = jdbcTemplate.queryForList(zxtssql);
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		int DDYC = 0,AXZD = 0,AXSD = 0,ZXTS = 0;
		for (int i = 0; i < day.size(); i++) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("TIME", day.get(i));
			map.put("DDYC", "0");
			map.put("AXZD", "0");
			map.put("AXSD", "0");
			map.put("ZXTS", "0");
			list.add(map);
			for (int j = 0; j < ddyw.size(); j++) {
				if(String.valueOf(list.get(i).get("TIME")).equals(String.valueOf(ddyw.get(j).get("DISP_TIME")))){
					list.get(i).put("DDYC", ddyw.get(j).get("DDYW"));
					list.get(i).put("AXZD", ddyw.get(j).get("AXZD"));
				}
			}
			for (int j = 0; j < axcz.size(); j++) {
				if(String.valueOf(list.get(i).get("TIME")).equals(String.valueOf(axcz.get(j).get("DISP_TIME")))){
					list.get(i).put("AXSD", axcz.get(j).get("AXRG"));
				}
			}
			for (int j = 0; j < zxts.size(); j++) {
				if(String.valueOf(list.get(i).get("TIME")).equals(String.valueOf(zxts.get(j).get("CS_DEALDATETIME")))){
					list.get(i).put("ZXTS", zxts.get(j).get("ZXTS"));
				}
			}
			list.get(i).put("ZJ", Integer.parseInt(String.valueOf(list.get(i).get("DDYC")).equals("null")?"0":String.valueOf(list.get(i).get("DDYC")))+
					Integer.parseInt(String.valueOf(list.get(i).get("AXZD")).equals("null")?"0":String.valueOf(list.get(i).get("AXZD")))+
					Integer.parseInt(String.valueOf(list.get(i).get("AXSD")).equals("null")?"0":String.valueOf(list.get(i).get("AXSD")))+
					Integer.parseInt(String.valueOf(list.get(i).get("ZXTS")).equals("null")?"0":String.valueOf(list.get(i).get("ZXTS"))));
		}
		for (int j = 0; j < ddyw.size(); j++) {
			DDYC += Integer.parseInt(String.valueOf(ddyw.get(j).get("DDYW")).equals("null")?"0":String.valueOf(ddyw.get(j).get("DDYW")));
			AXZD += Integer.parseInt(String.valueOf(ddyw.get(j).get("AXZD")).equals("null")?"0":String.valueOf(ddyw.get(j).get("AXZD")));
		}
		for (int j = 0; j < axcz.size(); j++) {
			AXSD += Integer.parseInt(String.valueOf(axcz.get(j).get("AXRG")).equals("null")?"0":String.valueOf(axcz.get(j).get("AXRG")));
		}
		for (int j = 0; j < zxts.size(); j++) {
			ZXTS += Integer.parseInt(String.valueOf(zxts.get(j).get("ZXTS")).equals("null")?"0":String.valueOf(zxts.get(j).get("ZXTS")));
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("TIME", "合计");
		map.put("DDYC", DDYC);
		map.put("AXZD", AXZD);
		map.put("AXSD", AXSD);
		map.put("ZXTS", ZXTS);
		map.put("ZJ", DDYC+AXZD+AXSD+ZXTS);
		list.add(map);
		return jacksonUtil.toJson(list);
	}

	public String hwlnb(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String time = stime;
		String etime = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		SimpleDateFormat sdf1 = new SimpleDateFormat("M");
		String table = "";
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		int ii = 0;
		if(stime.equals(sdf.format(new Date()))) ii = Integer.parseInt(sdf1.format(new Date()));
		else ii = 12;
		for (int i = 0; i < ii; i++) {
			int x = i+1;
			stime = time;
			if(x<10){
				stime = stime+"-0"+x+"-01";
				table = stime.substring(2, 4)+"0"+x;
			}
			else{
				stime = stime+"-"+x+"-01";
				table = stime.substring(2, 4)+x;
			}
			etime = getMonthLastDay(stime);
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("TIME", time+"-"+x);
			map.put("DDYC", "0");
			map.put("AXZD", "0");
			map.put("AXSD", "0");
			map.put("ZXTS", "0");
			list.add(map);
			String ddywsql = "select to_char(disp_time,'yyyy-mm') disp_time,sum(case ddqy when '爱心出租' then 1 else 0 end) axzd"
					+ ",sum(case ddqy when '爱心出租' then 0 else 1 end) ddyw from TB_DISPATCH_"+table+" where "
					+ "disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
					+ " disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
					+ " group by to_char(disp_time,'yyyy-mm')";
			String axczsql = "select to_char(disp_time,'yyyy-mm') disp_time,count(1) axrg from tb_dispatch_love where"
					+ " disp_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
					+ " disp_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
					+ " group by to_char(disp_time,'yyyy-mm')";
			String zxtssql = "select to_char(cs_dealdatetime,'yyyy-mm') cs_dealdatetime,count(1) zxts  from TB_CONSULTATION"
					+ " where cs_dealdatetime >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
					+ " cs_dealdatetime <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
					+ " group by to_char(cs_dealdatetime,'yyyy-mm')";
			List<Map<String, Object>> ddyw = jdbcTemplate.queryForList(ddywsql);
			List<Map<String, Object>> axcz = jdbcTemplate.queryForList(axczsql);
			List<Map<String, Object>> zxts = jdbcTemplate.queryForList(zxtssql);
			if (ddyw.size()>0) {
				list.get(i).put("DDYC", ddyw.get(0).get("DDYW"));
				list.get(i).put("AXZD", ddyw.get(0).get("AXZD"));
			}
			if(axcz.size()>0){
				list.get(i).put("AXSD", axcz.get(0).get("AXRG"));
			}
			if(zxts.size()>0){
				list.get(i).put("ZXTS", zxts.get(0).get("ZXTS"));
			}
			list.get(i).put("ZJ", Integer.parseInt(String.valueOf(list.get(i).get("DDYC")).equals("null")?"0":String.valueOf(list.get(i).get("DDYC")))+
					Integer.parseInt(String.valueOf(list.get(i).get("AXZD")).equals("null")?"0":String.valueOf(list.get(i).get("AXZD")))+
					Integer.parseInt(String.valueOf(list.get(i).get("AXSD")).equals("null")?"0":String.valueOf(list.get(i).get("AXSD")))+
					Integer.parseInt(String.valueOf(list.get(i).get("ZXTS")).equals("null")?"0":String.valueOf(list.get(i).get("ZXTS"))));
		
		}
		int DDYC = 0,AXZD = 0,AXSD = 0,ZXTS = 0;
		for (int j = 0; j < list.size(); j++) {
			DDYC += Integer.parseInt(String.valueOf(list.get(j).get("DDYC")).equals("null")?"0":String.valueOf(list.get(j).get("DDYC")));
			AXZD += Integer.parseInt(String.valueOf(list.get(j).get("AXZD")).equals("null")?"0":String.valueOf(list.get(j).get("AXZD")));
			AXSD += Integer.parseInt(String.valueOf(list.get(j).get("AXSD")).equals("null")?"0":String.valueOf(list.get(j).get("AXSD")));
			ZXTS += Integer.parseInt(String.valueOf(list.get(j).get("ZXTS")).equals("null")?"0":String.valueOf(list.get(j).get("ZXTS")));
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("TIME", "合计");
		map.put("DDYC", DDYC);
		map.put("AXZD", AXZD);
		map.put("AXSD", AXSD);
		map.put("ZXTS", ZXTS);
		map.put("ZJ", DDYC+AXZD+AXSD+ZXTS);
		list.add(map);
		return jacksonUtil.toJson(list);
	}
	/*节假日终端分析*/
	public String getOwner(){
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("name", "全部");
		map.put("id", "0");
		list.add(map);
		String sql = "select owner_id,owner_name from tb_owner";
		List<Map<String, Object>> list1 = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list1.size(); i++) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("id", list1.get(i).get("OWNER_ID"));
			m.put("name", list1.get(i).get("OWNER_NAME"));
			list.add(m);
		}
		return jacksonUtil.toJson(list);
	}

	public String jjrzdfx(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String jr_name = String.valueOf(paramMap.get("jr_name"));
		String owner_name = String.valueOf(paramMap.get("owner_name"));
		String sql = "select j.*,o.owner_name from TB_JGPT_RATE j left join tb_owner o on j.owner_id = o.owner_id"
				+ " where h_name = '"+jr_name+"' ";
		if(owner_name.equals("全部")){
			sql+= " and j.owner_id is null";
		}else{
			sql+= " and owner_name = '"+owner_name+"'";
		}
		sql+= " order by h_date desc";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for(int i=0; i<list.size(); i++){
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("MARK")).equals("1")?(String.valueOf(list.get(i).get("H_DATE")).substring(0, 10)+"(正)"):String.valueOf(list.get(i).get("H_DATE")).substring(0, 10));
		}
		return jacksonUtil.toJson(list);
	}
}