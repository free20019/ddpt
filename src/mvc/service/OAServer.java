package mvc.service;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
public class OAServer {
	protected JdbcTemplate jdbcTemplate = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();
	/**
	 * 根据表名查询出租、非出租、工程车日志
	 */
	public String czrz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String table = String.valueOf(paramMap.get("table"));
		String day = lastMonthDay(time);
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from "+table+" where olo_time >=to_date('"+time+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and olo_time <=to_date('"+time+"-"+day+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (OLO_CONTENT like '%"+gjz+"%' or USER_NAME like '%"+gjz+"%' or GROUP_USER like '%"+gjz+"%')";
		}
		sql += " order by olo_time desc";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("OLO_TIME")));
			list.get(i).put("BC", timebc(list.get(i).get("OLO_TIME").toString()));
		}
		
		return jacksonUtil.toJson(list);
	}

	public String delczrz(String id,String table) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from "+table+" where OLO_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 根据表名添加出租、非出租、工程车日志
	 */
	public String addczrz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String OLO_CONTENT = String.valueOf(paramMap.get("OLO_CONTENT"));//日志内容
		String GROUP_USER = String.valueOf(paramMap.get("GROUP_USER"));//组长工号
		String BC = String.valueOf(paramMap.get("BC"));//班次
		String TIME = String.valueOf(paramMap.get("TIME"));//日志时间
		String table = String.valueOf(paramMap.get("table"));
		int OLO_ID = findMaxId(table,"OLO_ID");
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		String OLO_TIME = bctime(TIME.substring(0, 10), BC);
		Map<String, String> map = new HashMap<String, String>();
		int c = findIsBc(OLO_TIME,table);
		if(c>0){
			map.put("info", "已存在"+TIME+BC+"的日志[出租]");
			return jacksonUtil.toJson(map);
		}
		String sql = "insert into "+table+" (OLO_ID,OLO_CONTENT,OLO_TIME,OLO_STATE,USER_NAME,GROUP_USER) values ("
				+ "'"+OLO_ID+"','"+OLO_CONTENT+"',to_date('"+OLO_TIME+"','yyyy-mm-dd hh24:mi:ss'),'0','"+USER_NAME+"','"+GROUP_USER+"')";
		int count = jdbcTemplate.update(sql);
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editczrz(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String OLO_CONTENT = String.valueOf(paramMap.get("OLO_CONTENT"));//日志内容
		String GROUP_USER = String.valueOf(paramMap.get("GROUP_USER"));//组长工号
		String OLO_ID = String.valueOf(paramMap.get("OLO_ID"));
		String table = String.valueOf(paramMap.get("table"));
		String sql = "update "+table+" set OLO_CONTENT = ?,GROUP_USER=? where olo_id = ?";
		int count = jdbcTemplate.update(sql,OLO_CONTENT,GROUP_USER,OLO_ID);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	//根据年月查询该月中最大的一天
	public String lastMonthDay(String time){
		String[] b = time.split("-");
		int year = Integer.parseInt(b[0]);
		int days = Integer.parseInt(b[1]);
	    int day = 1;
	    Calendar cal = Calendar.getInstance();
	    cal.set(year,days-1 ,day);
	    int last = cal.getActualMaximum(Calendar.DATE);
	    return last+"";
	}
	//添加时判断该班次的日志是否已存在
	public int findIsBc(String OLO_TIME,String table){
		String sql = "select * from "+table+" where olo_time = to_date('"+OLO_TIME+"','yyyy-mm-dd hh24:mi:ss')";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list.size();
	}
	//根据时间，返回该班次和时间
	public String timebc(String sj){
		String bc = sj.substring(11, 13);
		if(bc.equals("07")){
			bc = "上午班";
		}else if(bc.equals("13")){
			bc = "下午班";
		}else if(bc.equals("19")){
			bc = "晚班";
		}
		return bc;
	}
	//根据时间班次，返回该班次的时间
	public String bctime(String TIME,String BC){
		String OLO_TIME = "";
		if(BC.equals("上午班")){
			OLO_TIME = TIME + " 07:00:00";
		}else if(BC.equals("下午班")){
			OLO_TIME = TIME + " 13:00:00";
		}else if(BC.equals("晚班")){
			OLO_TIME = TIME + " 19:00:00";
		}
		return OLO_TIME;
	}
	//根据表查询该表中id最大的数
	public int findMaxId(String table,String ids){
		int id = 1;
		String sql = "select "+ids+" from "+table +"  order by to_number("+ids+") desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		if(list.size()>0){
			id = Integer.parseInt(list.get(0).get(ids).toString())+1;
		}
		return id;
	}
	/**
	 * 特殊业务 出租业务查询
	 */
	public String findczyw(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String type = String.valueOf(paramMap.get("type"));
		String day = lastMonthDay(time);
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from (select t.*, u.real_name from TB_OA_WORKDISP t,"
				+ " tb_user u where t.user_name = u.user_name and"
				+ " owd_time >= to_date('"+time+"-01 00:00:00', 'yyyy-mm-dd hh24:mi:ss')"
				+ " and owd_time <= to_date('"+time+"-"+day+" 23:59:59', 'yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (t.disp_tel like '%"+gjz+"%' or t.USER_NAME like '%"+gjz+"%' or t.ci_name like '%"+gjz+"%'"
					+ " or t.address like '%"+gjz+"%' or t.vehi_no like '%"+gjz+"%' or t.note like '%"+gjz+"%')";
		}
		if(!type.equals("null")&&type.length()>0&&!type.equals("全部")){
			sql += " and t.type = '"+type+"'";
		}
		sql += " order by owd_time desc) a left join (select v.sim_num, c.comp_name,v.vehi_no"
				+ " from tb_vehicle v, TB_COMPANY c where  v.comp_id = c.comp_id) b on"
				+ " a.vehi_no= b.vehi_no";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("OWD_TIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String delczyw(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_WORKDISP where OWD_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addczyw(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String DISP_ID = String.valueOf(paramMap.get("DISP_ID"));
		String TYPE = String.valueOf(paramMap.get("TYPE"));
		String CI_NAME = String.valueOf(paramMap.get("CI_NAME"));
		String DISP_TEL = String.valueOf(paramMap.get("DISP_TEL"));
		String ADDRESS = String.valueOf(paramMap.get("ADDRESS"));
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		String OWD_TIME = String.valueOf(paramMap.get("OWD_TIME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		int OWD_ID = findMaxId("TB_OA_WORKDISP","OWD_ID");
		String sql = "insert into TB_OA_WORKDISP (DISP_ID,TYPE,CI_NAME,DISP_TEL,ADDRESS,VEHI_NO,OWD_TIME,NOTE,USER_NAME,OWD_ID) values("
				+ "'"+DISP_ID+"','"+TYPE+"','"+CI_NAME+"','"+DISP_TEL+"','"+ADDRESS+"','"+VEHI_NO+
				"',to_date('"+OWD_TIME+"','yyyy-mm-dd hh24:mi:ss'),'"+NOTE+"','"+USER_NAME+"','"+OWD_ID+"')";
		
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editczyw(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String DISP_ID = String.valueOf(paramMap.get("DISP_ID"));
		String TYPE = String.valueOf(paramMap.get("TYPE"));
		String CI_NAME = String.valueOf(paramMap.get("CI_NAME"));
		String DISP_TEL = String.valueOf(paramMap.get("DISP_TEL"));
		String ADDRESS = String.valueOf(paramMap.get("ADDRESS"));
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String OWD_ID = String.valueOf(paramMap.get("OWD_ID"));
		String sql = "update TB_OA_WORKDISP set DISP_ID='"+DISP_ID+"',TYPE='"+TYPE+"',CI_NAME='"+CI_NAME+"',DISP_TEL='"+DISP_TEL+
				"',ADDRESS='"+ADDRESS+"',VEHI_NO='"+VEHI_NO+"',NOTE='"+NOTE+"' where OWD_ID='"+OWD_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 短信业务
	 */
	public String finddxyw(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String type = String.valueOf(paramMap.get("type"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String day = lastMonthDay(time);
		String tj = "";
//		System.out.println(time+"  "+day);
		if(!gjz.equals("null")&&gjz.length()>0){
			tj += " and (OADX_ID like '%"+gjz+"%' or SIM_NO like '%"+gjz+"%' or CONTENT like '%"+gjz+"%'"
					+ " or VEHI_ID like '%"+gjz+"%' or GET_NO like '%"+gjz+"%' or USER_NAME like '%"+gjz+"%' or NOTE like '%"+gjz+"%')";
		}
		if(!type.equals("null")&&type.length()>0&&!type.equals("全部")){
			tj += " and status = '"+type+"'";
		}
		String sql = "select a.*,b.c from (SELECT * FROM (SELECT ROW_NUMBER() OVER(PARTITION BY rec_time ORDER BY content DESC) rn,"
				+ " TB_OA_DUANXIN.* FROM TB_OA_DUANXIN where rec_time >=to_date('"+time+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " rec_time <=to_date('"+time+"-"+day+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		sql += tj;
		sql +=") WHERE rn = 1) a,(select rec_time,count(1) c from TB_OA_DUANXIN where"
				+ " rec_time >=to_date('"+time+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and"
				+ " rec_time <=to_date('"+time+"-"+day+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		sql += tj;
		sql +="group by rec_time) b where a.rec_time=b.rec_time order by a.rec_time desc";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("REC_TIME")));
//			list.get(i).put("QDSJ", list.get(i).get("GET_DATE").toString());
			list.get(i).put("SIM_NO", Integer.parseInt(String.valueOf(list.get(i).get("C")))>1?"群发":list.get(i).get("SIM_NO"));
		}
		return jacksonUtil.toJson(list);
	}
	public String deldxyw(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_DUANXIN where OADX_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}

	public String editdxyw(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String GET_NO = String.valueOf(paramMap.get("GET_NO")).equals("null")?"":String.valueOf(paramMap.get("GET_NO"));
		String REC_TIME = String.valueOf(paramMap.get("REC_TIME")).equals("null")?"":String.valueOf(paramMap.get("REC_TIME"));
		String STATUS = String.valueOf(paramMap.get("STATUS")).equals("null")?"":String.valueOf(paramMap.get("STATUS"));
		String VEHI_ID = String.valueOf(paramMap.get("VEHI_ID")).equals("null")?"":String.valueOf(paramMap.get("VEHI_ID"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String NOTE = String.valueOf(paramMap.get("NOTE")).equals("null")?"":String.valueOf(paramMap.get("NOTE"));
		String OADX_ID = String.valueOf(paramMap.get("OADX_ID")).equals("null")?"":String.valueOf(paramMap.get("OADX_ID"));
		String sql = "update TB_OA_DUANXIN set GET_NO='"+GET_NO+"',REC_TIME=to_date('"
				+REC_TIME+"','yyyy-mm-dd hh24:mi:ss'),STATUS='"+STATUS+"',VEHI_ID='"+VEHI_ID+"',CONTENT='"
				+CONTENT+"',NOTE='"+NOTE+"' where OADX_ID='"+OADX_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 提醒注意
	 */
	public String findtxzy(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from TB_OA_REMIND t where ore_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and ore_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (t.ORE_ID like '%"+gjz+"%' or t.ORE_TITLE like '%"+gjz+"%' or t.ORE_CONTENT like '%"+gjz+"%'"
					+ " or t.LOCKED_USER like '%"+gjz+"%' or t.USER_NAME like '%"+gjz+"%')";
		}
		sql += " order by ore_time desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("ORE_TIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String deltxzy(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_REMIND where ORE_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addtxzy(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ORE_TITLE = String.valueOf(paramMap.get("ORE_TITLE"));
		String ORE_TIME = String.valueOf(paramMap.get("ORE_TIME"));
		String ORE_CONTENT = String.valueOf(paramMap.get("ORE_CONTENT"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		int ORE_ID = findMaxId("TB_OA_REMIND","ORE_ID");
		String sql = "insert into TB_OA_REMIND (ORE_TITLE,ORE_TIME,ORE_CONTENT,USER_NAME,ORE_ID) values ("
				+ "'"+ORE_TITLE+"',to_date('"+ORE_TIME+"','yyyy-mm-dd hh24:mi:ss'),'"+ORE_CONTENT+"','"+USER_NAME+"','"+ORE_ID+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String edittxzy(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ORE_TITLE = String.valueOf(paramMap.get("ORE_TITLE"));
		String ORE_TIME = String.valueOf(paramMap.get("ORE_TIME"));
		String ORE_CONTENT = String.valueOf(paramMap.get("ORE_CONTENT"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		String ORE_ID = String.valueOf(paramMap.get("ORE_ID"));
		String sql = "update TB_OA_REMIND set ORE_TITLE='"+ORE_TITLE+"',ORE_TIME=to_date('"+ORE_TIME+"','yyyy-mm-dd hh24:mi:ss'),ORE_CONTENT='"
		+ORE_CONTENT+"',USER_NAME='"+USER_NAME+"' where ORE_ID='"+ORE_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 好人好事
	 */
	public String findhrhs(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from TB_OA_GOODEGG t where OG_TIME >=to_date('"+time+"-01-01 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and OG_TIME <=to_date('"+time+"-12-31 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (t.OG_ID like '%"+gjz+"%' or t.OG_ADDR like '%"+gjz+"%' or t.OG_CONTENT like '%"+gjz+"%'"
					+ " or t.OG_TITLE like '%"+gjz+"%' or t.OG_STATE like '%"+gjz+"%' or t.LOCKED_USER like '%"+gjz+"%' or t.USER_NAME like '%"+gjz+"%')";
		}
		sql += " order by OG_TIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("OG_TIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String delhrhs(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_GOODEGG where OG_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addhrhs(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String OG_TITLE = String.valueOf(paramMap.get("OG_TITLE"));
		String OG_VEHI_NO = String.valueOf(paramMap.get("OG_VEHI_NO"));
		String OG_TIME = String.valueOf(paramMap.get("OG_TIME"));
		String OG_CONTENT = String.valueOf(paramMap.get("OG_CONTENT"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		int OG_ID = findMaxId("TB_OA_GOODEGG","OG_ID");
		String sql = "insert into TB_OA_GOODEGG (OG_TITLE,OG_VEHI_NO,OG_TIME,USER_NAME,OG_CONTENT,OG_ID) values ("
				+ "'"+OG_TITLE+"','"+OG_VEHI_NO+"',to_date('"+OG_TIME+"','yyyy-mm-dd hh24:mi:ss'),'"
				+USER_NAME+"','"+OG_CONTENT+"','"+OG_ID+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String edithrhs(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String OG_TITLE = String.valueOf(paramMap.get("OG_TITLE"));
		String OG_VEHI_NO = String.valueOf(paramMap.get("OG_VEHI_NO"));
		String OG_TIME = String.valueOf(paramMap.get("OG_TIME"));
		String OG_CONTENT = String.valueOf(paramMap.get("OG_CONTENT"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		String OG_ID = String.valueOf(paramMap.get("OG_ID"));
		String sql = "update TB_OA_GOODEGG set OG_TITLE='"+OG_TITLE+"',OG_VEHI_NO='"+OG_VEHI_NO+
				"',OG_TIME=to_date('"+OG_TIME+"','yyyy-mm-dd hh24:mi:ss'),USER_NAME='"+USER_NAME+
				"',OG_CONTENT='"+OG_CONTENT+"' where OG_ID='"+OG_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 路况信息
	 */
	public String findlkxx(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String day = lastMonthDay(time);
		String sql = "select * from TB_OA_ROADCIRCS t where DATETIME >=to_date('"+time+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and DATETIME <=to_date('"+time+"-"+day+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (t.ORC_ID like '%"+gjz+"%' or t.USER_NAME like '%"+gjz+"%' or t.USER_NAME like '%"+gjz+"%'"
					+ " or t.ORC_STATE like '%"+gjz+"%' or t.LOCKED_USER like '%"+gjz+"%' or t.VEHI_NO like '%"+gjz+"%' or t.TAXICOMP like '%"+gjz+"%')";
		}
		sql += " order by DATETIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("BC", timebc(list.get(i).get("DATETIME").toString()));
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("DATETIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String findclgs(String vhic){
		String sql = "select comp_name from VW_VEHICLE t where vehi_no = '"+vhic+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String dellkxx(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_ROADCIRCS where ORC_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addlkxx(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO")).equals("null")?"":String.valueOf(paramMap.get("VEHI_NO"));
		String TAXICOMP = String.valueOf(paramMap.get("TAXICOMP")).equals("null")?"":String.valueOf(paramMap.get("TAXICOMP"));
		String BC = String.valueOf(paramMap.get("BC")).equals("null")?"":String.valueOf(paramMap.get("BC"));
		String TIME = String.valueOf(paramMap.get("DATETIME")).equals("null")?"":String.valueOf(paramMap.get("DATETIME"));
		String NOTE = String.valueOf(paramMap.get("NOTE")).equals("null")?"":String.valueOf(paramMap.get("NOTE"));
		String DATETIME = bctime(TIME, BC);
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		int ORC_ID =  findMaxId("TB_OA_ROADCIRCS","ORC_ID");
		String sql= "insert into TB_OA_ROADCIRCS(ORC_ID,USER_NAME,NOTE,DATETIME,VEHI_NO,TAXICOMP,ORC_STATE) values ("
				+ "'"+ORC_ID+"','"+USER_NAME+"','"+NOTE+"',to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss'),'"+VEHI_NO+"','"+TAXICOMP+"','0')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editlkxx(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO")).equals("null")?"":String.valueOf(paramMap.get("VEHI_NO"));
		String TAXICOMP = String.valueOf(paramMap.get("TAXICOMP")).equals("null")?"":String.valueOf(paramMap.get("TAXICOMP"));
		String NOTE = String.valueOf(paramMap.get("NOTE")).equals("null")?"":String.valueOf(paramMap.get("NOTE"));
		String ORC_ID =  String.valueOf(paramMap.get("ORC_ID")).equals("null")?"":String.valueOf(paramMap.get("ORC_ID"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		String sql= "update TB_OA_ROADCIRCS set NOTE = '"+NOTE+"',VEHI_NO = '"+VEHI_NO+
					"',TAXICOMP = '"+TAXICOMP+"',USER_NAME = '"+USER_NAME+"' where ORC_ID = '"+ORC_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 失物登记
	 */
	public String findswdj(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from TB_OA_GUESTTELL t where DATETIME >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and DATETIME <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (t.OGT_ID like '%"+gjz+"%' or t.USER_NAME like '%"+gjz+"%' or t.VEHI_NO like '%"+gjz+"%'"
					+ " or t.TAXICOMP like '%"+gjz+"%' or t.GUEST like '%"+gjz+"%' or t.TEL like '%"+gjz+"%' or t.KIND like '%"+gjz+"%'"
					+ "or t.CONTENT like '%"+gjz+"%' or t.RESULT like '%"+gjz+"%' or t.NOTE like '%"+gjz+"%')";
		}
		sql += " order by DATETIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("JDHSJ", String.valueOf(list.get(i).get("DATETIME")));
			list.get(i).put("SCSJ", String.valueOf(list.get(i).get("UPTIME")));
			list.get(i).put("XCSJ", String.valueOf(list.get(i).get("DOWNTIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String delswdj(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_GUESTTELL where OGT_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addswdj(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO")).equals("null")?"":String.valueOf(paramMap.get("VEHI_NO"));
		String TAXICOMP = String.valueOf(paramMap.get("TAXICOMP")).equals("null")?"":String.valueOf(paramMap.get("TAXICOMP"));
		String GUEST = String.valueOf(paramMap.get("GUEST")).equals("null")?"":String.valueOf(paramMap.get("GUEST"));
		String TEL = String.valueOf(paramMap.get("TEL")).equals("null")?"":String.valueOf(paramMap.get("TEL"));
		String KIND = String.valueOf(paramMap.get("KIND")).equals("null")?"":String.valueOf(paramMap.get("KIND"));
		String DATETIME = String.valueOf(paramMap.get("DATETIME")).equals("null")?"":String.valueOf(paramMap.get("DATETIME"));
		String UPTIME = String.valueOf(paramMap.get("UPTIME")).equals("null")?"":String.valueOf(paramMap.get("UPTIME"));
		String DOWNTIME = String.valueOf(paramMap.get("DOWNTIME")).equals("null")?"":String.valueOf(paramMap.get("DOWNTIME"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String RESULT = String.valueOf(paramMap.get("RESULT")).equals("null")?"":String.valueOf(paramMap.get("RESULT"));
		String NOTE = String.valueOf(paramMap.get("NOTE")).equals("null")?"":String.valueOf(paramMap.get("NOTE"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		String itype = String.valueOf(paramMap.get("itype"));
		String OGT_ID = "";
		String sql= "";
		if(itype.equals("0")){
			OGT_ID = findMaxId("TB_OA_GUESTTELL", "OGT_ID")+"";
			sql = "insert into TB_OA_GUESTTELL (VEHI_NO,TAXICOMP,GUEST,TEL,KIND,DATETIME,UPTIME,DOWNTIME,CONTENT,RESULT,NOTE,USER_NAME,OGT_ID) values "
					+ "('"+VEHI_NO+"','"+TAXICOMP+"','"+GUEST+"','"+TEL+"','"+KIND+"',to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss'),"
					+ "to_date('"+UPTIME+"','yyyy-mm-dd hh24:mi:ss'),to_date('"+
					DOWNTIME+"','yyyy-mm-dd hh24:mi:ss'),'"+CONTENT+"','"+RESULT+"','"+NOTE+"','"+USER_NAME+"','"+OGT_ID+"')";
		}else{
			OGT_ID =  String.valueOf(request.getSession().getAttribute("OGT_ID").toString());
			sql= "update TB_OA_GUESTTELL set VEHI_NO='"+VEHI_NO+"',TAXICOMP='"+TAXICOMP+"',GUEST='"+GUEST+"',TEL='"+TEL+"',KIND='"+KIND
					+"',DATETIME=to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss'),UPTIME=to_date('"+UPTIME+"','yyyy-mm-dd hh24:mi:ss'),DOWNTIME=to_date('"+
					DOWNTIME+"','yyyy-mm-dd hh24:mi:ss'),CONTENT='"+CONTENT+"',RESULT='"+RESULT+"',NOTE='"+NOTE+"',USER_NAME='"+USER_NAME+"' where OGT_ID = '"+OGT_ID+"'";
		}
		System.out.println(sql);
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editswdj(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO")).equals("null")?"":String.valueOf(paramMap.get("VEHI_NO"));
		String TAXICOMP = String.valueOf(paramMap.get("TAXICOMP")).equals("null")?"":String.valueOf(paramMap.get("TAXICOMP"));
		String GUEST = String.valueOf(paramMap.get("GUEST")).equals("null")?"":String.valueOf(paramMap.get("GUEST"));
		String TEL = String.valueOf(paramMap.get("TEL")).equals("null")?"":String.valueOf(paramMap.get("TEL"));
		String KIND = String.valueOf(paramMap.get("KIND")).equals("null")?"":String.valueOf(paramMap.get("KIND"));
		String DATETIME = String.valueOf(paramMap.get("DATETIME")).equals("null")?"":String.valueOf(paramMap.get("DATETIME"));
		String UPTIME = String.valueOf(paramMap.get("UPTIME")).equals("null")?"":String.valueOf(paramMap.get("UPTIME"));
		String DOWNTIME = String.valueOf(paramMap.get("DOWNTIME")).equals("null")?"":String.valueOf(paramMap.get("DOWNTIME"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String RESULT = String.valueOf(paramMap.get("RESULT")).equals("null")?"":String.valueOf(paramMap.get("RESULT"));
		String NOTE = String.valueOf(paramMap.get("NOTE")).equals("null")?"":String.valueOf(paramMap.get("NOTE"));
		String USER_NAME = String.valueOf(request.getSession().getAttribute("username"));
		String OGT_ID = String.valueOf(paramMap.get("OGT_ID")).equals("null")?"":String.valueOf(paramMap.get("OGT_ID"));
		String sql= "update TB_OA_GUESTTELL set VEHI_NO='"+VEHI_NO+"',TAXICOMP='"+TAXICOMP+"',GUEST='"+GUEST+"',TEL='"+TEL
				+"',KIND='"+KIND+"',DATETIME=to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss'),UPTIME=to_date('"+UPTIME
				+"','yyyy-mm-dd hh24:mi:ss'),DOWNTIME=to_date('"+DOWNTIME+"','yyyy-mm-dd hh24:mi:ss'),CONTENT='"+CONTENT
				+"',RESULT='"+RESULT+"',NOTE='"+NOTE+"',USER_NAME='"+USER_NAME+"' where OGT_ID='"+OGT_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 翻译记录
	 */
	public String findfyjl(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from TB_OA_ENGTRAN t where DATE_TIME >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and DATE_TIME <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (t.ENG_ID like '%"+gjz+"%' or t.LANGUAGE_TYPE like '%"+gjz+"%' or t.CLICENT_NAME like '%"+gjz+"%'"
					+ " or t.CLICENT_TEL like '%"+gjz+"%' or t.SERVICE_TYPE like '%"+gjz+"%' or t.SERVICE_CONTENT like '%"+gjz+"%' or t.REMARK like '%"+gjz+"%'"
					+ "or t.RESULT like '%"+gjz+"%' or t.USER_NO like '%"+gjz+"%' or t.CLICENT_TYPE like '%"+gjz+"%' or t.RESULT_BREAK like '%"+gjz+"%')";
		}
		sql += " order by DATE_TIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("DATE_TIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String delfyjl(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_ENGTRAN where ENG_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addfyjl(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String SERVICE_TYPE = String.valueOf(paramMap.get("SERVICE_TYPE")).equals("null")?"":String.valueOf(paramMap.get("SERVICE_TYPE"));
		String LANGUAGE_TYPE = String.valueOf(paramMap.get("LANGUAGE_TYPE")).equals("null")?"":String.valueOf(paramMap.get("LANGUAGE_TYPE"));
		String CLICENT_TYPE = String.valueOf(paramMap.get("CLICENT_TYPE")).equals("null")?"":String.valueOf(paramMap.get("CLICENT_TYPE"));
		String RESULT = String.valueOf(paramMap.get("RESULT")).equals("null")?"":String.valueOf(paramMap.get("RESULT"));
		String CLICENT_NAME = String.valueOf(paramMap.get("CLICENT_NAME")).equals("null")?"":String.valueOf(paramMap.get("CLICENT_NAME"));
		String CLICENT_TEL = String.valueOf(paramMap.get("CLICENT_TEL")).equals("null")?"":String.valueOf(paramMap.get("CLICENT_TEL"));
		String DATE_TIME = String.valueOf(paramMap.get("DATE_TIME")).equals("null")?"":String.valueOf(paramMap.get("DATE_TIME"));
		String SERVICE_CONTENT = String.valueOf(paramMap.get("SERVICE_CONTENT")).equals("null")?"":String.valueOf(paramMap.get("SERVICE_CONTENT"));
		String REMARK = String.valueOf(paramMap.get("REMARK")).equals("null")?"":String.valueOf(paramMap.get("REMARK"));
		String RESULT_BREAK = String.valueOf(paramMap.get("RESULT_BREAK")).equals("null")?"":String.valueOf(paramMap.get("RESULT_BREAK"));
		String USER_NO = String.valueOf(request.getSession().getAttribute("username"));
		int ENG_ID =  findMaxId("TB_OA_ENGTRAN","ENG_ID");
		String sql= "insert into TB_OA_ENGTRAN(SERVICE_TYPE,LANGUAGE_TYPE,CLICENT_TYPE,RESULT,CLICENT_NAME"
				+ ",CLICENT_TEL,DATE_TIME,SERVICE_CONTENT,REMARK,RESULT_BREAK,USER_NO,ENG_ID) values ("
				+ "'"+SERVICE_TYPE+"','"+LANGUAGE_TYPE+"','"+CLICENT_TYPE+"','"+RESULT+"','"+CLICENT_NAME+"','"+CLICENT_TEL
				+"',to_date('"+DATE_TIME+"','yyyy-mm-dd hh24:mi:ss'),'"+SERVICE_CONTENT+"','"+REMARK+"','"+RESULT_BREAK+"','"+USER_NO+"','"+ENG_ID+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editfyjl(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String SERVICE_TYPE = String.valueOf(paramMap.get("SERVICE_TYPE")).equals("null")?"":String.valueOf(paramMap.get("SERVICE_TYPE"));
		String LANGUAGE_TYPE = String.valueOf(paramMap.get("LANGUAGE_TYPE")).equals("null")?"":String.valueOf(paramMap.get("LANGUAGE_TYPE"));
		String CLICENT_TYPE = String.valueOf(paramMap.get("CLICENT_TYPE")).equals("null")?"":String.valueOf(paramMap.get("CLICENT_TYPE"));
		String RESULT = String.valueOf(paramMap.get("RESULT")).equals("null")?"":String.valueOf(paramMap.get("RESULT"));
		String CLICENT_NAME = String.valueOf(paramMap.get("CLICENT_NAME")).equals("null")?"":String.valueOf(paramMap.get("CLICENT_NAME"));
		String CLICENT_TEL = String.valueOf(paramMap.get("CLICENT_TEL")).equals("null")?"":String.valueOf(paramMap.get("CLICENT_TEL"));
		String DATE_TIME = String.valueOf(paramMap.get("DATE_TIME")).equals("null")?"":String.valueOf(paramMap.get("DATE_TIME"));
		String SERVICE_CONTENT = String.valueOf(paramMap.get("SERVICE_CONTENT")).equals("null")?"":String.valueOf(paramMap.get("SERVICE_CONTENT"));
		String REMARK = String.valueOf(paramMap.get("REMARK")).equals("null")?"":String.valueOf(paramMap.get("REMARK"));
		String RESULT_BREAK = String.valueOf(paramMap.get("RESULT_BREAK")).equals("null")?"":String.valueOf(paramMap.get("RESULT_BREAK"));
		String USER_NO = String.valueOf(request.getSession().getAttribute("username"));
		String ENG_ID =  String.valueOf(paramMap.get("ENG_ID")).equals("null")?"":String.valueOf(paramMap.get("ENG_ID"));
		String sql= "update TB_OA_ENGTRAN set SERVICE_TYPE='"+SERVICE_TYPE+"',LANGUAGE_TYPE='"+LANGUAGE_TYPE+"',CLICENT_TYPE='"+CLICENT_TYPE+"',RESULT='"+RESULT+"',CLICENT_NAME='"+CLICENT_NAME+"'"
				+ ",CLICENT_TEL='"+CLICENT_TEL+"',DATE_TIME=to_date('"+DATE_TIME+"','yyyy-mm-dd hh24:mi:ss'),SERVICE_CONTENT='"+SERVICE_CONTENT+"',REMARK='"+REMARK+"',RESULT_BREAK='"+RESULT_BREAK+"',USER_NO='"+USER_NO+"' where ENG_ID='"+ENG_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 投诉记录
	 */
	public String findtsjl(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String day = lastMonthDay(time);
		String sql = "select * from TB_OA_COMPLAIN t where DB_TIME >=to_date('"+time+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and DB_TIME <=to_date('"+time+"-"+day+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (t.COMP_ID like '%"+gjz+"%' or t.USER_NO like '%"+gjz+"%' or t.COMP_TYPE like '%"+gjz+"%'"
					+ " or t.CONTENT like '%"+gjz+"%' or t.RESULT like '%"+gjz+"%' or t.REMARK like '%"+gjz+"%' or t.CLI_NAME like '%"+gjz+"%'"
					+ "or t.CLI_TEL like '%"+gjz+"%' or t.CAR_NO like '%"+gjz+"%' or t.COM_NAME like '%"+gjz+"%' or t.COMP_BTYPE like '%"+gjz+"%')";
		}
		sql += " order by DB_TIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("SLSJ", String.valueOf(list.get(i).get("DB_TIME")));
			list.get(i).put("YCSH", String.valueOf(list.get(i).get("ON_CAR_TIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String deltsjl(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_COMPLAIN where COMP_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addtsjl(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String BU_NO = String.valueOf(paramMap.get("BU_NO")).equals("null")?"":String.valueOf(paramMap.get("BU_NO"));
		String TO_BU_NO = String.valueOf(paramMap.get("TO_BU_NO")).equals("null")?"":String.valueOf(paramMap.get("TO_BU_NO"));
		String COMP_TYPE = String.valueOf(paramMap.get("COMP_TYPE")).equals("null")?"":String.valueOf(paramMap.get("COMP_TYPE"));
		String COMP_BTYPE = String.valueOf(paramMap.get("COMP_BTYPE")).equals("null")?"":String.valueOf(paramMap.get("COMP_BTYPE"));
		String SER_TYPE = String.valueOf(paramMap.get("SER_TYPE")).equals("null")?"":String.valueOf(paramMap.get("SER_TYPE"));
		String T_DCOM = String.valueOf(paramMap.get("T_DCOM")).equals("null")?"":String.valueOf(paramMap.get("T_DCOM"));
		String CLI_NAME = String.valueOf(paramMap.get("CLI_NAME")).equals("null")?"":String.valueOf(paramMap.get("CLI_NAME"));
		String CLI_TEL = String.valueOf(paramMap.get("CLI_TEL")).equals("null")?"":String.valueOf(paramMap.get("CLI_TEL"));
		String T_CARNO = String.valueOf(paramMap.get("T_CARNO")).equals("null")?"":String.valueOf(paramMap.get("T_CARNO"));
		String CAR_NO = String.valueOf(paramMap.get("CAR_NO")).equals("null")?"":String.valueOf(paramMap.get("CAR_NO"));
		String T_CNAME = String.valueOf(paramMap.get("T_CNAME")).equals("null")?"":String.valueOf(paramMap.get("T_CNAME"));
		String T_CTEL = String.valueOf(paramMap.get("T_CTEL")).equals("null")?"":String.valueOf(paramMap.get("T_CTEL"));
		String ON_CAR_TIME = String.valueOf(paramMap.get("ON_CAR_TIME")).equals("null")?"":String.valueOf(paramMap.get("ON_CAR_TIME"));
		String ON_CAR_TYPE = String.valueOf(paramMap.get("ON_CAR_TYPE")).equals("null")?"":String.valueOf(paramMap.get("ON_CAR_TYPE"));
		String ON_CAR_ADD = String.valueOf(paramMap.get("ON_CAR_ADD")).equals("null")?"":String.valueOf(paramMap.get("ON_CAR_ADD"));
//		String USER_NO = String.valueOf(paramMap.get("USER_NO")).equals("null")?"":String.valueOf(paramMap.get("USER_NO"));
		String AFERT_ACTION_YPE = String.valueOf(paramMap.get("AFERT_ACTION_YPE")).equals("null")?"":String.valueOf(paramMap.get("AFERT_ACTION_YPE"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String RESULT = String.valueOf(paramMap.get("RESULT")).equals("null")?"":String.valueOf(paramMap.get("RESULT"));
		String REMARK = String.valueOf(paramMap.get("REMARK")).equals("null")?"":String.valueOf(paramMap.get("REMARK"));
		String DB_TIME = String.valueOf(paramMap.get("DB_TIME")).equals("null")?"":String.valueOf(paramMap.get("DB_TIME"));
		String COM_NAME = String.valueOf(paramMap.get("COM_NAME")).equals("null")?"":String.valueOf(paramMap.get("COM_NAME"));
		int COMP_ID =  findMaxId("TB_OA_COMPLAIN","COMP_ID");
		String USER_NO = String.valueOf(request.getSession().getAttribute("username"));
		String sql= "insert into TB_OA_COMPLAIN(BU_NO,TO_BU_NO,COMP_TYPE,COMP_BTYPE,SER_TYPE,T_DCOM,CLI_NAME,"
				+ "CLI_TEL,T_CARNO,CAR_NO,T_CNAME,T_CTEL,ON_CAR_TIME,ON_CAR_TYPE,ON_CAR_ADD,USER_NO,AFERT_ACTION_YPE"
				+ ",CONTENT,RESULT,COMP_ID,REMARK,DB_TIME,COM_NAME) values ('"+BU_NO+"','"+TO_BU_NO+"','"+COMP_TYPE+"','"+COMP_BTYPE+
				"','"+SER_TYPE+"','"+T_DCOM+"','"+CLI_NAME+"','"+CLI_TEL+"','"+T_CARNO+"','"+CAR_NO+"','"+
				T_CNAME+"','"+T_CTEL+"',to_date('"+ON_CAR_TIME+"','yyyy-mm-dd hh24:mi:ss'),'"+ON_CAR_TYPE+"','"+ON_CAR_ADD+"','"+USER_NO
				+"','"+AFERT_ACTION_YPE+"','"+CONTENT+"','"+RESULT+"','"+COMP_ID+"','"+REMARK+"',to_date('"+DB_TIME+"','yyyy-mm-dd hh24:mi:ss'),'"+COM_NAME+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String edittsjl(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String BU_NO = String.valueOf(paramMap.get("BU_NO")).equals("null")?"":String.valueOf(paramMap.get("BU_NO"));
		String TO_BU_NO = String.valueOf(paramMap.get("TO_BU_NO")).equals("null")?"":String.valueOf(paramMap.get("TO_BU_NO"));
		String COMP_TYPE = String.valueOf(paramMap.get("COMP_TYPE")).equals("null")?"":String.valueOf(paramMap.get("COMP_TYPE"));
		String COMP_BTYPE = String.valueOf(paramMap.get("COMP_BTYPE")).equals("null")?"":String.valueOf(paramMap.get("COMP_BTYPE"));
		String SER_TYPE = String.valueOf(paramMap.get("SER_TYPE")).equals("null")?"":String.valueOf(paramMap.get("SER_TYPE"));
		String T_DCOM = String.valueOf(paramMap.get("T_DCOM")).equals("null")?"":String.valueOf(paramMap.get("T_DCOM"));
		String CLI_NAME = String.valueOf(paramMap.get("CLI_NAME")).equals("null")?"":String.valueOf(paramMap.get("CLI_NAME"));
		String CLI_TEL = String.valueOf(paramMap.get("CLI_TEL")).equals("null")?"":String.valueOf(paramMap.get("CLI_TEL"));
		String T_CARNO = String.valueOf(paramMap.get("T_CARNO")).equals("null")?"":String.valueOf(paramMap.get("T_CARNO"));
		String CAR_NO = String.valueOf(paramMap.get("CAR_NO")).equals("null")?"":String.valueOf(paramMap.get("CAR_NO"));
		String T_CNAME = String.valueOf(paramMap.get("T_CNAME")).equals("null")?"":String.valueOf(paramMap.get("T_CNAME"));
		String T_CTEL = String.valueOf(paramMap.get("T_CTEL")).equals("null")?"":String.valueOf(paramMap.get("T_CTEL"));
		String ON_CAR_TIME = String.valueOf(paramMap.get("ON_CAR_TIME")).equals("null")?"":String.valueOf(paramMap.get("ON_CAR_TIME"));
		String ON_CAR_TYPE = String.valueOf(paramMap.get("ON_CAR_TYPE")).equals("null")?"":String.valueOf(paramMap.get("ON_CAR_TYPE"));
		String ON_CAR_ADD = String.valueOf(paramMap.get("ON_CAR_ADD")).equals("null")?"":String.valueOf(paramMap.get("ON_CAR_ADD"));
		String USER_NO = String.valueOf(paramMap.get("USER_NO")).equals("null")?"":String.valueOf(paramMap.get("USER_NO"));
		String AFERT_ACTION_YPE = String.valueOf(paramMap.get("AFERT_ACTION_YPE")).equals("null")?"":String.valueOf(paramMap.get("AFERT_ACTION_YPE"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String RESULT = String.valueOf(paramMap.get("RESULT")).equals("null")?"":String.valueOf(paramMap.get("RESULT"));
		String REMARK = String.valueOf(paramMap.get("REMARK")).equals("null")?"":String.valueOf(paramMap.get("REMARK"));
		String DB_TIME = String.valueOf(paramMap.get("DB_TIME")).equals("null")?"":String.valueOf(paramMap.get("DB_TIME"));
		String COMP_ID = String.valueOf(paramMap.get("COMP_ID")).equals("null")?"":String.valueOf(paramMap.get("COMP_ID"));
		String COM_NAME = String.valueOf(paramMap.get("COM_NAME")).equals("null")?"":String.valueOf(paramMap.get("COM_NAME"));
		String sql= "update TB_OA_COMPLAIN set BU_NO='"+BU_NO+"',TO_BU_NO='"+TO_BU_NO+"',COMP_TYPE='"+COMP_TYPE+
				"',COMP_BTYPE='"+COMP_BTYPE+"',SER_TYPE='"+SER_TYPE+"',T_DCOM='"+T_DCOM+
				"',CLI_NAME='"+CLI_NAME+"',CLI_TEL='"+CLI_TEL+"',T_CARNO='"+T_CARNO+"',CAR_NO='"+CAR_NO+
				"',T_CNAME='"+T_CNAME+"',T_CTEL='"+T_CTEL+"',ON_CAR_TIME=to_date('"+ON_CAR_TIME
				+"','yyyy-mm-dd hh24:mi:ss'),ON_CAR_TYPE='"+ON_CAR_TYPE+"',ON_CAR_ADD='"+ON_CAR_ADD
				+"',USER_NO='"+USER_NO+"',AFERT_ACTION_YPE='"+
				AFERT_ACTION_YPE+"',CONTENT='"+CONTENT+"',RESULT='"+RESULT+"',REMARK='"+REMARK
				+"',COM_NAME='"+COM_NAME+"',DB_TIME=to_date('"+DB_TIME+"','yyyy-mm-dd hh24:mi:ss') where COMP_ID='"+COMP_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 根据表名查询出租、非出租、小货报警故障
	 */
	public String findbjgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String type = String.valueOf(paramMap.get("type"));
		String table = String.valueOf(paramMap.get("table"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from "+table+" where DATETIME >=to_date('"+time+"-01-01 00:00:00','yyyy-mm-dd hh24:mi:ss')"
				+ " and DATETIME <=to_date('"+time+"-12-31 23:59:59','yyyy-mm-dd hh24:mi:ss') and flag = '0'";
		if(type.equals("未修好"))
			sql += " and type = '0'";
		else if(type.equals("已修好"))
			sql += " and type = '1'";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (OMV_ID like '%"+gjz+"%' or OMV_USER like '%"+gjz+"%' or CONTENT like '%"+gjz+"%' or VEHI_NO like '%"+gjz+"%')";
		}
		sql += " order by DATETIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("DATETIME")));
			list.get(i).put("ZT", list.get(i).get("TYPE").toString().equals("1")?"已修好":"未修好");
		}
		return jacksonUtil.toJson(list);
	}
	public String delbjgz(String id,String table,HttpServletRequest request) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "update "+table+" set flag='1',deluser = '"+user+"' where OMV_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addbjgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO")).equals("null")?"":String.valueOf(paramMap.get("VEHI_NO"));
		String TYPE = String.valueOf(paramMap.get("TYPE")).equals("已修好")?"1":"0";
		String DATETIME = String.valueOf(paramMap.get("DATETIME")).equals("null")?"":String.valueOf(paramMap.get("DATETIME"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String OMV_USER = String.valueOf(request.getSession().getAttribute("username"));
		String table = String.valueOf(paramMap.get("table"));
		int OMV_ID =  findMaxId(table,"OMV_ID");
		String sql= "insert into "+table+"(VEHI_NO,TYPE,DATETIME,CONTENT,OMV_USER,OMV_ID,flag"
				+ ") values ('"+VEHI_NO+"','"+TYPE+"',to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss'),'"+CONTENT+
				"','"+OMV_USER+"','"+OMV_ID+"','0')";
		int count = jdbcTemplate.update(sql);
//		System.out.println(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editbjgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO")).equals("null")?"":String.valueOf(paramMap.get("VEHI_NO"));
		String TYPE = String.valueOf(paramMap.get("TYPE")).equals("已修好")?"1":"0";
		String DATETIME = String.valueOf(paramMap.get("DATETIME")).equals("null")?"":String.valueOf(paramMap.get("DATETIME"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String OMV_USER = String.valueOf(request.getSession().getAttribute("username"));
		String table = String.valueOf(paramMap.get("table"));
		String OMV_ID =  String.valueOf(paramMap.get("OMV_ID")).equals("null")?"":String.valueOf(paramMap.get("OMV_ID"));
		String sql= "update "+table+" set VEHI_NO='"+VEHI_NO+"',TYPE='"+TYPE+"',DATETIME=to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss')"
				+ ",CONTENT='"+CONTENT+"',OMV_USER='"+OMV_USER+"' where OMV_ID='"+OMV_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 系统故障之出租、非出租故障
	 */
	public String findxtgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String state = String.valueOf(paramMap.get("state"));
		String type = String.valueOf(paramMap.get("type"));
		String day = lastMonthDay(time);
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from TB_OA_SYSMAL where DATETIME >=to_date('"+time+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and DATETIME <=to_date('"+time+"-"+day+" 23:59:59','yyyy-mm-dd hh24:mi:ss')"
					+ " and flag = '0' and osm_type = '"+type+"'";
		if(state.equals("未修好"))
			sql += " and type = '0'";
		else if(state.equals("已修好"))
			sql += " and type = '1'";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (OSM_ID like '%"+gjz+"%' or OSM_USER like '%"+gjz+"%'"
					+ " or CONTENT like '%"+gjz+"%')";
		}
		sql += " order by DATETIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("DATETIME")));
			list.get(i).put("ZT", list.get(i).get("TYPE").toString().equals("1")?"已修好":"未修好");
		}
		return jacksonUtil.toJson(list);
	}
	public String delxtgz(String id,HttpServletRequest request) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "update TB_OA_SYSMAL set flag='1',deluser = '"+user+"' where OSM_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addxtgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String TYPE = String.valueOf(paramMap.get("TYPE")).equals("已修好")?"1":"0";
		String DATETIME = String.valueOf(paramMap.get("DATETIME")).equals("null")?"":String.valueOf(paramMap.get("DATETIME"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String OSM_USER = String.valueOf(request.getSession().getAttribute("username"));
		String OSM_TYPE = String.valueOf(paramMap.get("OSM_TYPE"));
		int OSM_ID =  findMaxId("TB_OA_SYSMAL","OSM_ID");
		String sql= "insert into TB_OA_SYSMAL (TYPE,DATETIME,CONTENT,OSM_USER,OSM_ID,flag,OSM_TYPE"
				+ ") values ('"+TYPE+"',to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss'),'"+CONTENT+
				"','"+OSM_USER+"','"+OSM_ID+"','0','"+OSM_TYPE+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editxtgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String TYPE = String.valueOf(paramMap.get("TYPE")).equals("已修好")?"1":"0";
		String DATETIME = String.valueOf(paramMap.get("DATETIME")).equals("null")?"":String.valueOf(paramMap.get("DATETIME"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String OSM_USER = String.valueOf(request.getSession().getAttribute("username"));
		String OSM_ID = String.valueOf(paramMap.get("OSM_ID"));
		String sql= "update TB_OA_SYSMAL set TYPE='"+TYPE+"',DATETIME=to_date('"+DATETIME+"','yyyy-mm-dd hh24:mi:ss')"
				+ ",CONTENT='"+CONTENT+"',OSM_USER='"+OSM_USER+"' where OSM_ID = '"+OSM_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 工程车故障
	 */
	public String findgccgz(String postData,HttpServletRequest request){
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>(){});
		String time = String.valueOf(paramMap.get("time"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String day = lastMonthDay(time);
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from TB_OA_PROJECT_VEHI where ON_TIME >=to_date('"+time+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss')"
					+ " and ON_TIME <=to_date('"+time+"-"+day+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (PV_ID like '%"+gjz+"%' or ON_USER_NO like '%"+gjz+"%'"
					+ " or CONTENT like '%"+gjz+"%')";
		}
		sql += " order by ON_TIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("ON_TIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String delgccgz(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_OA_PROJECT_VEHI where PV_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String addgccgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ON_TIME = String.valueOf(paramMap.get("ON_TIME")).equals("null")?"":String.valueOf(paramMap.get("ON_TIME"));
		String SERVER_TYPE = String.valueOf(paramMap.get("SERVER_TYPE")).equals("null")?"":String.valueOf(paramMap.get("SERVER_TYPE"));
		String CTYPE = String.valueOf(paramMap.get("CTYPE")).equals("null")?"":String.valueOf(paramMap.get("CTYPE"));
		String CNAME = String.valueOf(paramMap.get("CNAME").equals("null")?"":String.valueOf(paramMap.get("CNAME")));
		String CTEL = String.valueOf(paramMap.get("CTEL")).equals("null")?"":String.valueOf(paramMap.get("CTEL"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String ACTION_NO = String.valueOf(paramMap.get("ACTION_NO")).equals("null")?"":String.valueOf(paramMap.get("ACTION_NO"));
		String AFERT_ACTION = String.valueOf(paramMap.get("AFERT_ACTION")).equals("null")?"":String.valueOf(paramMap.get("AFERT_ACTION"));
		String ALERT_ACTION_CONTENT = String.valueOf(paramMap.get("ALERT_ACTION_CONTENT")).equals("null")?"":String.valueOf(paramMap.get("ALERT_ACTION_CONTENT"));
		String ON_USER_NO = String.valueOf(request.getSession().getAttribute("username"));
		int PV_ID =  findMaxId("TB_OA_PROJECT_VEHI","PV_ID");
		String sql= "insert into TB_OA_PROJECT_VEHI (ON_TIME,SERVER_TYPE,CTYPE,CNAME,CTEL,CONTENT"
				+ ",ACTION_NO,AFERT_ACTION,ALERT_ACTION_CONTENT,ON_USER_NO,PV_ID"
				+ ") values (to_date('"+ON_TIME+"','yyyy-mm-dd hh24:mi:ss'),'"+SERVER_TYPE+
				"','"+CTYPE+"','"+CNAME+"','"+CTEL+"','"+CONTENT+"','"+ACTION_NO+"','"+AFERT_ACTION+"','"+ALERT_ACTION_CONTENT+"'"
				+ ",'"+ON_USER_NO+"','"+PV_ID+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editgccgz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ON_TIME = String.valueOf(paramMap.get("ON_TIME")).equals("null")?"":String.valueOf(paramMap.get("ON_TIME"));
		String SERVER_TYPE = String.valueOf(paramMap.get("SERVER_TYPE")).equals("null")?"":String.valueOf(paramMap.get("SERVER_TYPE"));
		String CTYPE = String.valueOf(paramMap.get("CTYPE")).equals("null")?"":String.valueOf(paramMap.get("CTYPE"));
		String CNAME = String.valueOf(paramMap.get("CNAME").equals("null")?"":String.valueOf(paramMap.get("CNAME")));
		String CTEL = String.valueOf(paramMap.get("CTEL")).equals("null")?"":String.valueOf(paramMap.get("CTEL"));
		String CONTENT = String.valueOf(paramMap.get("CONTENT")).equals("null")?"":String.valueOf(paramMap.get("CONTENT"));
		String ACTION_NO = String.valueOf(paramMap.get("ACTION_NO")).equals("null")?"":String.valueOf(paramMap.get("ACTION_NO"));
		String AFERT_ACTION = String.valueOf(paramMap.get("AFERT_ACTION")).equals("null")?"":String.valueOf(paramMap.get("AFERT_ACTION"));
		String ALERT_ACTION_CONTENT = String.valueOf(paramMap.get("ALERT_ACTION_CONTENT")).equals("null")?"":String.valueOf(paramMap.get("ALERT_ACTION_CONTENT"));
		String ON_USER_NO = String.valueOf(request.getSession().getAttribute("username"));
		String PV_ID =  String.valueOf(paramMap.get("PV_ID")).equals("null")?"":String.valueOf(paramMap.get("PV_ID"));
		String sql= "update TB_OA_PROJECT_VEHI set ON_TIME=to_date('"+ON_TIME+"','yyyy-mm-dd hh24:mi:ss')"
				+ ",SERVER_TYPE='"+SERVER_TYPE+"',CTYPE='"+CTYPE+"',CNAME='"+CNAME+"',CTEL='"+CTEL+"',CONTENT='"+CONTENT+"'"
				+ ",ACTION_NO='"+ACTION_NO+"',AFERT_ACTION='"+AFERT_ACTION+"',ALERT_ACTION_CONTENT='"+ALERT_ACTION_CONTENT
				+"',ON_USER_NO='"+ON_USER_NO+"' where PV_ID='"+PV_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 报警记录统计
	 * @param postData
	 * @param request
	 * @return
	 */
	public String findjltj(String postData,HttpServletRequest request){
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>(){});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String user = String.valueOf(request.getSession().getAttribute("username"));
		String sql = "select * from TB_ALERTDEAL where ad_dbtime >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')"
					+ " and ad_dbtime <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
		if(!gjz.equals("null")&&gjz.length()>0){
			sql += " and (ad_gps like '%"+gjz+"%' or ad_userid like '%"+gjz+"%'"
					+ " or AD_LISTENCASE like '%"+gjz+"%' or AD_CONDITION like '%"+gjz+"%' or DRIVER_TEL like '%"+gjz+"%'"
					+ " or AD_RESULT like '%"+gjz+"%' or AD_LASTDEAL like '%"+gjz+"%' or AD_ALERTTYPE like '%"+gjz+"%'"
					+ " or AD_MEMO like '%"+gjz+"%' or AD_CAR_NO like '%"+gjz+"%' or AD_LISTENCASE like '%"+gjz+"%')";
		}
		sql += " order by ad_dbtime desc";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("USER", user);
			list.get(i).put("RIQI", String.valueOf(list.get(i).get("AD_DBTIME")));
		}
		return jacksonUtil.toJson(list);
	}
	public String addjltj(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String AD_USERID = String.valueOf(paramMap.get("AD_USERID").equals("null")?"":String.valueOf(paramMap.get("AD_USERID")));
		String AD_CAR_NO = String.valueOf(paramMap.get("AD_CAR_NO")).equals("null")?"":String.valueOf(paramMap.get("AD_CAR_NO"));
		String DRIVER_TEL = String.valueOf(paramMap.get("DRIVER_TEL")).equals("null")?"":String.valueOf(paramMap.get("DRIVER_TEL"));
		String AD_DBTIME = String.valueOf(paramMap.get("AD_DBTIME")).equals("null")?"":String.valueOf(paramMap.get("AD_DBTIME"));
		String AD_DEALTIME = String.valueOf(paramMap.get("AD_DEALTIME").equals("null")?"":String.valueOf(paramMap.get("AD_DEALTIME")));
		String AD_LISTENTIME = String.valueOf(paramMap.get("AD_LISTENTIME")).equals("null")?"":String.valueOf(paramMap.get("AD_LISTENTIME"));
		String AD_LISTENCASE = String.valueOf(paramMap.get("AD_LISTENCASE")).equals("null")?"":String.valueOf(paramMap.get("AD_LISTENCASE"));
		String AD_GPS = String.valueOf(paramMap.get("AD_GPS")).equals("null")?"":String.valueOf(paramMap.get("AD_GPS"));
		String AD_RESULT = String.valueOf(paramMap.get("AD_RESULT")).equals("null")?"":String.valueOf(paramMap.get("AD_RESULT"));
		String AD_LASTDEAL = String.valueOf(paramMap.get("AD_LASTDEAL")).equals("null")?"":String.valueOf(paramMap.get("AD_LASTDEAL"));
		String AD_ALERTTYPE = String.valueOf(paramMap.get("AD_ALERTTYPE")).equals("null")?"":String.valueOf(paramMap.get("AD_ALERTTYPE"));
		String AD_CONDITION = String.valueOf(paramMap.get("AD_CONDITION")).equals("null")?"":String.valueOf(paramMap.get("AD_CONDITION"));
		String AD_MEMO = String.valueOf(paramMap.get("AD_MEMO")).equals("null")?"":String.valueOf(paramMap.get("AD_MEMO"));
		String sql= "insert into TB_ALERTDEAL (AD_USERID,AD_CAR_NO,DRIVER_TEL,AD_DBTIME,AD_DEALTIME,AD_LISTENTIME"
				+ ",AD_LISTENCASE,AD_GPS,AD_RESULT,AD_LASTDEAL,AD_ALERTTYPE,AD_CONDITION,AD_MEMO"
				+ ") values ('"+AD_USERID+
				"','"+AD_CAR_NO+"','"+DRIVER_TEL+"',to_date('"+AD_DBTIME+"','yyyy-mm-dd hh24:mi:ss'),"
				+ "to_date('"+AD_DEALTIME+"','yyyy-mm-dd hh24:mi:ss'),to_date('"+AD_LISTENTIME+"','yyyy-mm-dd hh24:mi:ss'),"
				+ "'"+AD_LISTENCASE+"','"+AD_GPS+"','"+AD_RESULT+"','"+AD_LASTDEAL+"','"+AD_ALERTTYPE+"'"
				+ ",'"+AD_CONDITION+"','"+AD_MEMO+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editjltj(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String AD_USERID = String.valueOf(paramMap.get("AD_USERID").equals("null")?"":String.valueOf(paramMap.get("AD_USERID")));
		String AD_CAR_NO = String.valueOf(paramMap.get("AD_CAR_NO")).equals("null")?"":String.valueOf(paramMap.get("AD_CAR_NO"));
		String DRIVER_TEL = String.valueOf(paramMap.get("DRIVER_TEL")).equals("null")?"":String.valueOf(paramMap.get("DRIVER_TEL"));
		String AD_DBTIME = String.valueOf(paramMap.get("AD_DBTIME")).equals("null")?"":String.valueOf(paramMap.get("AD_DBTIME"));
		String AD_DEALTIME = String.valueOf(paramMap.get("AD_DEALTIME").equals("null")?"":String.valueOf(paramMap.get("AD_DEALTIME")));
		String AD_LISTENTIME = String.valueOf(paramMap.get("AD_LISTENTIME")).equals("null")?"":String.valueOf(paramMap.get("AD_LISTENTIME"));
		String AD_LISTENCASE = String.valueOf(paramMap.get("AD_LISTENCASE")).equals("null")?"":String.valueOf(paramMap.get("AD_LISTENCASE"));
		String AD_GPS = String.valueOf(paramMap.get("AD_GPS")).equals("null")?"":String.valueOf(paramMap.get("AD_GPS"));
		String AD_RESULT = String.valueOf(paramMap.get("AD_RESULT")).equals("null")?"":String.valueOf(paramMap.get("AD_RESULT"));
		String AD_LASTDEAL = String.valueOf(paramMap.get("AD_LASTDEAL")).equals("null")?"":String.valueOf(paramMap.get("AD_LASTDEAL"));
		String AD_ALERTTYPE = String.valueOf(paramMap.get("AD_ALERTTYPE")).equals("null")?"":String.valueOf(paramMap.get("AD_ALERTTYPE"));
		String AD_CONDITION = String.valueOf(paramMap.get("AD_CONDITION")).equals("null")?"":String.valueOf(paramMap.get("AD_CONDITION"));
		String AD_MEMO = String.valueOf(paramMap.get("AD_MEMO")).equals("null")?"":String.valueOf(paramMap.get("AD_MEMO"));
		String AD_ID = String.valueOf(paramMap.get("AD_ID")).equals("null")?"":String.valueOf(paramMap.get("AD_ID"));
		String sql= "update TB_ALERTDEAL set AD_USERID='"+AD_USERID+"',AD_CAR_NO='"+AD_CAR_NO+"',DRIVER_TEL='"+DRIVER_TEL+"'"
				+ ",AD_DBTIME=to_date('"+AD_DBTIME+"','yyyy-mm-dd hh24:mi:ss'),"
				+ "AD_DEALTIME=to_date('"+AD_DEALTIME+"','yyyy-mm-dd hh24:mi:ss'),"
				+ "AD_LISTENTIME=to_date('"+AD_LISTENTIME+"','yyyy-mm-dd hh24:mi:ss')"
				+ ",AD_LISTENCASE='"+AD_LISTENCASE+"',AD_GPS='"+AD_GPS+"',AD_RESULT='"+AD_RESULT+"'"
				+ ",AD_LASTDEAL='"+AD_LASTDEAL+"',AD_ALERTTYPE='"+AD_ALERTTYPE+"',AD_CONDITION='"+AD_CONDITION+"'"
				+ ",AD_MEMO='"+AD_MEMO+"' where AD_ID='"+AD_ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String deljltj(String id) {
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_ALERTDEAL where AD_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String lsgj(String stime,String etime,String vhic){
		String stimes = String.valueOf(stime);
		String etimes = String.valueOf(etime);
		String vhics = String.valueOf(vhic);
		Map<String, Object> map = new HashMap<String, Object>();
		if(stimes!=null&&!stimes.equals("null")&&etimes!=null&&!etimes.equals("null")&&vhics!=null&&!vhics.equals("null")){
			String riqi = stimes.substring(2, 4)+stimes.substring(5, 7);
			String sql = "select px,py,speed_time,vehicle_num,state,mdt_sub_type,speed,direction,v.BA_NAME,v.COMP_NAME from HZGPS_TAXI.TB_GPS_"+riqi+" t,vw_vehicle v where "
					+ " t.vehicle_num = v.VEHI_NO and speed_time >= to_date('"+stimes+"','yyyy-mm-dd hh24:mi:ss') and"
					+ " speed_time <= to_date('"+etimes+"','yyyy-mm-dd hh24:mi:ss') and vehicle_num = '"+vhics+"' and px>110 and py>25 and carstate = '0'  order by speed_time";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			for (int i = 0; i < list.size(); i++) {
				list.get(i).put("TIME", String.valueOf(list.get(i).get("SPEED_TIME")));
				list.get(i).put("INFO", String.valueOf(list.get(i).get("STATE")).equals("1")?"重车":"空车");
			}
//			System.out.println(sql);
			map.put("data", list);
			map.put("info", "0");
		}else{
			map.put("info", "1");
		}
		return jacksonUtil.toJson(map);
	}
	public String lsgjdc(String stime,String etime,String vhic){
		String stimes = String.valueOf(stime);
		String etimes = String.valueOf(etime);
		String vhics = String.valueOf(vhic);
		Map<String, Object> map = new HashMap<String, Object>();
		String riqi = stimes.substring(2, 4)+stimes.substring(5, 7);
		String sql = "select px,py,speed_time,vehicle_num,state,speed,v.BA_NAME,v.COMP_NAME from HZGPS_TAXI.TB_GPS_"+riqi+" t,vw_vehicle v where "
				+ " t.vehicle_num = v.VEHI_NO and speed_time >= to_date('"+stimes+"','yyyy-mm-dd hh24:mi:ss') and"
				+ " speed_time <= to_date('"+etimes+"','yyyy-mm-dd hh24:mi:ss') and vehicle_num = '"+vhics+"' and px>110 and py>25  order by speed_time";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("TIME", String.valueOf(list.get(i).get("SPEED_TIME")));
			list.get(i).put("INFO", String.valueOf(list.get(i).get("STATE")).equals("1")?"重车":"空车");
		}
//			System.out.println(sql);
		return jacksonUtil.toJson(list);
	}
	public String bbtj(String postData){
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>(){});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
//		String sql = "select * from(select ad_car_no,count(1) zcs,COUNT (CASE WHEN (ad_alerttype = '误报警'"
//				+ " or ad_alerttype='测试报警') THEN 1 ELSE NULL END) wbj,COUNT (CASE WHEN (ad_alerttype = '真实报警'"
//				+ " or ad_alerttype='报警开关故障') THEN 1 ELSE NULL END) zsbj from TB_ALERTDEAL where "
//				+ " ad_dbtime >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
//				+ " ad_dbtime <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by ad_car_no) a"
//				+ " , vw_vehicle v where a.ad_car_no=v.VEHI_NO";
//		String sql = "select * from (select vehi_id, count(1) zcs, COUNT(CASE WHEN alt_cause != '紧急报警'"
//				+ " THEN 1 ELSE NULL END) wbj, COUNT(CASE WHEN alt_cause = '紧急报警' THEN 1 ELSE NULL END) zsbj"
//				+ " from TB_ALERT_"+riqi+" where alt_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
//				+ " and alt_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by vehi_id) a,"
//				+ " vw_vehicle v where a.VEHI_id = v.VEHI_id order by zsbj desc";
		String sql = "select b.*,c.zsbj from(select a.*,v.ba_name,v.comp_name,v.vehi_no from (select vehi_id,"
				+ " count(1) zcs from TB_ALERT where alt_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " and alt_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " group by vehi_id) a, vw_vehicle v where a.VEHI_id = v.VEHI_id) b left join (select count(1) zsbj,ad_car_no"
				+ " from TB_ALERTDEAL where ad_alerttype='真实报警' and "
				+ " ad_dbtime >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and "
				+ "ad_dbtime <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by ad_car_no) c "
				+ "on b.vehi_no = c.ad_car_no";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("ZSBJ", String.valueOf(list.get(i).get("zsbj")).equals("null")?0:list.get(i).get("zsbj"));
			list.get(i).put("WBJ", String.valueOf(list.get(i).get("zsbj")).equals("null")?list.get(i).get("zcs"):Integer.parseInt(list.get(i).get("zcs").toString())-Integer.parseInt(list.get(i).get("zsbj").toString()));
		}
		return jacksonUtil.toJson(list);
	}
	public String gsbbtj(String postData){
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>(){});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
//		String riqi = stime.substring(2, 4)+stime.substring(5, 7);
//		String sql = "select ts.*,d.ad_car_no,tb.c from(select a.*,b.ba_name from(select v.comp_name, v.comp_id,count(1) zcs,"
//				+ " COUNT(CASE WHEN (ad_alerttype = '误报警' or ad_alerttype = '测试报警') THEN 1 ELSE NULL END) wbj,"
//				+ " COUNT(CASE WHEN (ad_alerttype = '真实报警' or ad_alerttype = '报警开关故障') THEN 1 ELSE NULL END) zsbj"
//				+ " from TB_ALERTDEAL t, vw_vehicle v where t.ad_car_no = v.vehi_no and"
//				+ " ad_dbtime >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
//				+ " ad_dbtime <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by comp_id, comp_name)a "
//				+ ",tb_company c,tb_busi_area b where a.comp_id=c.comp_id and c.ba_id=b.ba_id) ts left join"
//				+ " (select v.comp_id,wm_concat(ad_car_no) ad_car_no from TB_ALERTDEAL t, vw_vehicle v where"
//				+ " t.ad_car_no = v.vehi_no and (ad_alerttype = '真实报警' or ad_alerttype = '报警开关故障')"
//				+ " and ad_dbtime >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
//				+ " ad_dbtime <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by comp_id, comp_name) d"
//				+ " on ts.comp_id = d.comp_id left join (select comp_id,count(1) c from (select ad_car_no from"
//				+ " TB_ALERTDEAL where ad_dbtime >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
//				+ " ad_dbtime <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by ad_car_no) a,"
//				+ "vw_vehicle v where a.ad_car_no=v.VEHI_No group by comp_id) tb on ts.comp_id=tb.comp_id";
//		String sql = "select ts.*, d.ad_car_no, tb.c from (select a.*, b.ba_name from (select v.comp_name, v.comp_id,"
//				+ " count(1) zcs, COUNT(CASE WHEN alt_cause != '紧急报警' THEN 1 ELSE NULL END) wbj,"
//				+ " COUNT(CASE WHEN alt_cause = '紧急报警' THEN 1 ELSE NULL END) zsbj from TB_ALERT_"+riqi+" t,"
//				+ " vw_vehicle v where t.vehi_id = v.vehi_id and alt_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
//				+ " and alt_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by comp_id, comp_name) a,"
//				+ " tb_company c, tb_busi_area b where a.comp_id = c.comp_id and c.ba_id = b.ba_id) ts left join (select"
//				+ " wm_concat(vehi_no) ad_car_no,comp_id from (select vehi_id from TB_ALERT_"+riqi+" t where alt_cause = '紧急报警'"
//				+ " and alt_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and"
//				+ " alt_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by vehi_id) t1,vw_vehicle v1"
//				+ " where t1.vehi_id=v1.vehi_id group by comp_id) d on ts.comp_id = d.comp_id left join (select comp_id, count(1) c"
//				+ " from (select vehi_id from TB_ALERT_"+riqi+" where alt_time >= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')"
//				+ " and alt_time <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') group by vehi_id) a, vw_vehicle v"
//				+ " where a.vehi_id = v.vehi_id group by comp_id) tb on ts.comp_id = tb.comp_id order by zsbj desc";
		
		String sql = "select ts.*, d.ad_car_no,d.zsbj from (select a.*, b.ba_name from (select v.comp_name,"
				+ " v.comp_id, count(1) zcs, NVL(count(distinct(vehi_no)), 0) bjcl from TB_ALERT t,"
				+ " vw_vehicle v where t.vehi_id = v.vehi_id and alt_time >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss')"
				+ " and alt_time <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') "
				+ " group by comp_id, comp_name) a, tb_company c, tb_busi_area b where a.comp_id = c.comp_id and"
				+ " c.ba_id = b.ba_id) ts left join (select wm_concat(distinct(ad_car_no)) ad_car_no,comp_id,"
				+ "count(distinct(ad_car_no)) zsbj from TB_ALERTDEAL t,vw_vehicle v where t.ad_car_no = v.VEHI_NO"
				+ " and ad_alerttype='真实报警' and  ad_dbtime >= to_date('"+stime+"', 'yyyy-mm-dd hh24:mi:ss') and "
				+ "ad_dbtime <= to_date('"+etime+"', 'yyyy-mm-dd hh24:mi:ss') group by comp_id) d on ts.comp_id = d.comp_id";
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		System.out.println(list);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("ZSBJ", String.valueOf(list.get(i).get("zsbj")).equals("null")?0:list.get(i).get("zsbj"));
			list.get(i).put("WBJ", String.valueOf(list.get(i).get("zsbj")).equals("null")?list.get(i).get("zcs"):Integer.parseInt(list.get(i).get("zcs").toString())-Integer.parseInt(list.get(i).get("zsbj").toString()));
			list.get(i).put("C", String.valueOf(list.get(i).get("zsbj")).equals("null")?list.get(i).get("bjcl"):Integer.parseInt(list.get(i).get("bjcl").toString())+Integer.parseInt(list.get(i).get("zsbj").toString()));
		}
		return jacksonUtil.toJson(list);
	}
}