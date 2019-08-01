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
//	public String nextTime(String time){
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//		try {
//			Date date = sdf.parse(time);
//			Calendar calendar = Calendar.getInstance();
//			calendar.setTime(date);
//			calendar.set(Calendar.DAY_OF_MONTH,1);
//			calendar.add(Calendar.MONTH, -1);
//			String riqi = sdf.format(calendar.getTime());
//			return riqi.substring(2, 4)+riqi.substring(5, 7);
//		} catch (ParseException e) {
//			e.printStackTrace();
//		}
//		return null;
//	}
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
		String time = time(stime);
		String nextTime = time(etime);
		String sql = "select disp_type, COUNT(CASE WHEN vehi_no is not null THEN 1 ELSE NULL END) cg,"
				+ " count(1) zs from (select disp_type,vehi_no from TB_DISPATCH_"+time+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		if(!type.equals("null")&&!type.equals("全部")){
			sql += " and disp_type = '"+type+"'";
		}
		sql += "union all select disp_type,vehi_no from TB_DISPATCH_"+nextTime+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		if(!type.equals("null")&&!type.equals("全部")){
			sql += " and disp_type = '"+type+"'";
		}
		sql +=") group by disp_type";
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
		String time = time(stime);
		String nextTime = time(etime);
		String sql = "select disp_user, COUNT(CASE WHEN vehi_no is not null THEN 1 ELSE NULL END) cg,"
				+ " count(1) zs from (select CASE WHEN YEWU_TYPE = '1' THEN '小货调度' WHEN DISP_TYPE = '平板扬招' THEN '平板扬招' ELSE NVL(disp_user, disp_type) END disp_user"
				+ ",vehi_no from TB_DISPATCH_"+time+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		if(!type.equals("null")&&!type.equals("全部")){
			sql += " and disp_type = '"+type+"'";
		}
		sql += "union all select CASE WHEN YEWU_TYPE = '1' THEN '小货调度' WHEN DISP_TYPE = '平板扬招' THEN '平板扬招' ELSE NVL(disp_user, disp_type) END disp_user,vehi_no from TB_DISPATCH_"+nextTime+" t where"
				+ " disp_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')";
		if(!type.equals("null")&&!type.equals("全部")){
			sql += " and disp_type = '"+type+"'";
		}
		sql +=") group by disp_user";
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
		String time = time(stime);
		String nextTime = time(etime);
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
		sql += ") group by comp_name) where 1=1";
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
		String time = time(stime);
		String nextTime = time(etime);
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
				+ " disp_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') ) s group by s.vehi_no) a,"
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
		String time = time(stime);
		String nextTime = time(etime);
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
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String comp = String.valueOf(paramMap.get("comp"));
		String riqi = stime.substring(2, 4)+stime.substring(5, 7);
//		String sql = "select * from (select comp_id,max(online_num) online_num,max(vehi_num) vehi_num from tb_taxi_online where"
//				+ " db_time >= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
//				+ " db_time <= to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') group by comp_id) o,"
//				+ "tb_company v,TB_BUSI_AREA b where o.comp_id = v.comp_id and v.ba_id=b.ba_id";
		String sql = "select b.ba_name,c.comp_name,d.* from(select a.*,aa.online_num from (select c.comp_id,count(1) VEHI_NUM"
				+ " from tb_company c,vw_vehicle v where c.comp_id=v.comp_id group by c.comp_id) a left join"
				+ " (select v.comp_id,count(1) ONLINE_NUM from vw_vehicle v,(select vehi_no from TB_TAXI_ONLINE_"+riqi
				+ " where db_time >= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time <= to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')  group by vehi_no) t where v.VEHI_NO=t.vehi_no";
		if(comp!=null&&!comp.equals("null")&&comp.length()>0){
			sql += " and comp_name = '"+comp+"'";
		}
		sql += " group by comp_id) aa on a.comp_id=aa.comp_id) d,tb_company c,tb_busi_area b where c.comp_id = d.comp_id"
				+ " and c.ba_id = b.ba_id";
		System.out.println(sql);
		int sxs=0,zs=0;
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("ONLINE", String.valueOf(list.get(i).get("online_num")).equals("null")?"0":String.valueOf(list.get(i).get("online_num")));
			zs += Integer.parseInt(list.get(i).get("VEHI_NUM").toString());
			sxs+= Integer.parseInt(list.get(i).get("ONLINE").toString());
			list.get(i).put("SXL", df.format(Double.parseDouble(list.get(i).get("ONLINE").toString())/Double.parseDouble(list.get(i).get("vehi_num").toString())*100)+"%");
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("COMP_NAME", "总计");
		map.put("VEHI_NUM", zs);
		map.put("ONLINE", sxs);
		map.put("SXL", df.format((double)sxs/(double)zs*100)+"%");
		list.add(0,map);
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
		String sql = "select x.*,v.comp_name,v.mt_name,v.mdt_sub_type from(select vehi_no,";
		for (int i = 0; i < a.length; i++) {
			sql += " (select state from TB_TJ A where xztime=to_date('"+a[i]+"','yyyy-mm-dd') and A.vehi_no=TB_TJ.vehi_no)as m"+(i+1)+",";
		}
		sql = sql.substring(0, sql.length()-1);
		sql += " from TB_TJ group by vehi_no) x,vw_vehicle v where x.vehi_no = v.VEHI_NO and (";
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
		String time = time(stime);
		String nextTime = time(etime);
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
}