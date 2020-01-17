package mvc.service;

import com.tw.cache.DataItem;
import com.tw.cache.GisData;
import com.tw.entity.Area;
import com.tw.entity.Vehicle;
import helper.JacksonUtil;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;


@Service
public class BjjkxServer {
	protected JdbcTemplate jdbcTemplate = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

	public List<Map<String, Object>> xxc_daochu() {
		
		String sql = "select MDT_NO,VEHI_NO,VEHI_SIM,COMP_NAME,PX,PY,DB_TIME from vw_vehi_mdt t where t.DB_TIME<sysdate-10/24/60";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("DB_TIME",list.get(i).get("DB_TIME")==null?"":list.get(i).get("DB_TIME").toString().substring(0, 19));
		}
//		System.out.println(jacksonUtil.toJson(list));
		return list;
	}
	
	public List<Area> bjqy(){
		String sql = "select * from tb_area";
		List<Area> arealist = new ArrayList<Area>();
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Area a=new Area();
			a.setId(list.get(i).get("AREA_ID").toString());
			a.setAreaname(list.get(i).get("AREA_NAME").toString());
			a.setAreasize(list.get(i).get("AREA_SIZE").toString());
			a.setAreams(list.get(i).get("AREA_DESCRIBE").toString());
			a.setAreazbs(list.get(i).get("AREA_COORDINATES").toString());
//			a.setOrderid(list.get(i).get("ORDERID").toString());
			a.setAll(new ArrayList<String>());
			String nums = list.get(i).get("ALARMNUM").toString();
			
			for(int j=0;j<nums.split(";").length;j++){
				a.setAreabjs(nums.split(";")[getybjnum()]+"");
			}
			
			arealist.add(a);
		}
		return arealist;
	}
	
	public int getybjnum(){
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		//System.out.println(sdf.format(new Date()));
		String t = sdf.format(new Date());
		int a = timenum(t);
		if(a==timenum("23:58")||a==timenum("23:59")||a==timenum("00:02")||a==timenum("00:01")){
			return 0;
		}else if(a>=timenum("00:03")&&a<=timenum("00:57")){
			return 1;
		}else if(a>=timenum("00:58")&&a<=timenum("01:02")){
			return 2;
		}else if(a>=timenum("01:03")&&a<=timenum("01:57")){
			return 3;
		}else if(a>=timenum("01:58")&&a<=timenum("02:02")){
			return 4;
		}else if(a>=timenum("02:03")&&a<=timenum("02:57")){
			return 5;
		}else if(a>=timenum("02:58")&&a<=timenum("03:02")){
			return 6;
		}else if(a>=timenum("03:03")&&a<=timenum("03:57")){
			return 7;
		}else if(a>=timenum("03:58")&&a<=timenum("04:02")){
			return 8;
		}else if(a>=timenum("04:03")&&a<=timenum("04:57")){
			return 9;
		}else if(a>=timenum("04:58")&&a<=timenum("05:02")){
			return 10;
		}else if(a>=timenum("05:03")&&a<=timenum("05:57")){
			return 11;
		}else if(a>=timenum("05:58")&&a<=timenum("06:02")){
			return 12;
		}else if(a>=timenum("06:03")&&a<=timenum("06:57")){
			return 13;
		}else if(a>=timenum("06:58")&&a<=timenum("07:02")){
			return 14;
		}else if(a>=timenum("07:03")&&a<=timenum("07:57")){
			return 15;
		}else if(a>=timenum("07:58")&&a<=timenum("08:02")){
			return 16;
		}else if(a>=timenum("08:03")&&a<=timenum("08:57")){
			return 17;
		}else if(a>=timenum("08:58")&&a<=timenum("09:02")){
			return 18;
		}else if(a>=timenum("09:03")&&a<=timenum("09:57")){
			return 19;
		}else if(a>=timenum("09:58")&&a<=timenum("10:02")){
			return 20;
		}else if(a>=timenum("10:03")&&a<=timenum("10:57")){
			return 21;
		}else if(a>=timenum("10:58")&&a<=timenum("11:02")){
			return 22;
		}else if(a>=timenum("11:03")&&a<=timenum("11:57")){
			return 23;
		}else if(a>=timenum("11:58")&&a<=timenum("12:02")){
			return 24;
		}else if(a>=timenum("12:03")&&a<=timenum("12:57")){
			return 25;
		}else if(a>=timenum("12:58")&&a<=timenum("13:02")){
			return 26;
		}else if(a>=timenum("13:03")&&a<=timenum("13:57")){
			return 27;
		}else if(a>=timenum("13:58")&&a<=timenum("14:02")){
			return 28;
		}else if(a>=timenum("14:03")&&a<=timenum("14:57")){
			return 29;
		}else if(a>=timenum("14:58")&&a<=timenum("15:02")){
			return 30;
		}else if(a>=timenum("15:03")&&a<=timenum("15:57")){
			return 31;
		}else if(a>=timenum("15:58")&&a<=timenum("16:02")){
			return 32;
		}else if(a>=timenum("16:03")&&a<=timenum("16:57")){
			return 33;
		}else if(a>=timenum("16:58")&&a<=timenum("17:02")){
			return 34;
		}else if(a>=timenum("17:03")&&a<=timenum("17:57")){
			return 35;
		}else if(a>=timenum("17:58")&&a<=timenum("18:02")){
			return 36;
		}else if(a>=timenum("18:03")&&a<=timenum("18:57")){
			return 37;
		}else if(a>=timenum("18:58")&&a<=timenum("19:02")){
			return 38;
		}else if(a>=timenum("19:03")&&a<=timenum("19:57")){
			return 39;
		}else if(a>=timenum("19:58")&&a<=timenum("20:02")){
			return 40;
		}else if(a>=timenum("20:03")&&a<=timenum("20:57")){
			return 41;
		}else if(a>=timenum("20:58")&&a<=timenum("21:02")){
			return 42;
		}else if(a>=timenum("21:03")&&a<=timenum("21:57")){
			return 43;
		}else if(a>=timenum("21:58")&&a<=timenum("22:02")){
			return 44;
		}else if(a>=timenum("22:03")&&a<=timenum("22:57")){
			return 45;
		}else if(a>=timenum("22:58")&&a<=timenum("23:02")){
			return 46;
		}else if(a>=timenum("23:03")&&a<=timenum("23:57")){
			return 47;
		}else{
			return 0;
		}
	}
	public int timenum(String arg){
		return Integer.parseInt(arg.split(":")[0])*60+Integer.parseInt(arg.split(":")[1]);
	}

	public List<Vehicle> bjallcar() {
		List<Vehicle> results = new ArrayList<Vehicle>();
		String sql="select * from VW_VEHI_MDT t order by t.vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Vehicle vehi = new Vehicle();
			vehi.setCompname(list.get(i).get("COMP_NAME").toString());
			vehi.setVehino(list.get(i).get("VEHI_NO").toString());
			vehi.setSimka(list.get(i).get("SIM_NUM")==null?"":list.get(i).get("SIM_NUM").toString());
			vehi.setCartype(list.get(i).get("VT_NAME")==null?"":list.get(i).get("VT_NAME").toString());
			vehi.setVehisim(list.get(i).get("VEHI_SIM")==null?"":list.get(i).get("VEHI_SIM").toString());
			vehi.setMdtno(list.get(i).get("MDT_NO")==null?"":list.get(i).get("MDT_NO").toString());
			vehi.setOwnname(list.get(i).get("OWN_NAME")==null?"":list.get(i).get("OWN_NAME").toString());
			vehi.setOwntel(list.get(i).get("OWN_TEL")==null?"":list.get(i).get("OWN_TEL").toString());
			vehi.setColor(list.get(i).get("VC_NAME")==null?"":list.get(i).get("VC_NAME").toString());
		    vehi.setDateTime(list.get(i).get("STIME")==null?"":list.get(i).get("STIME").toString().substring(0, 19));
     	    vehi.setCarStatus(list.get(i).get("STATE")==null?"":list.get(i).get("STATE").toString());
     	    vehi.setHeading(list.get(i).get("ANGLE")==null?"":list.get(i).get("ANGLE").toString());
     	    vehi.setGpsStatus(list.get(i).get("CARSTATE")==null?"":list.get(i).get("CARSTATE").toString().toString());
     	    vehi.setLati(Double.parseDouble(list.get(i).get("PY")==null?"0":list.get(i).get("PY").toString()));
			vehi.setLongi(Double.parseDouble(list.get(i).get("PX")==null?"0":list.get(i).get("PX").toString()));
			vehi.setSpeed(list.get(i).get("SPEED")==null?"":list.get(i).get("SPEED").toString());
			if(vehi.getDateTime()!=""&&jisuan(vehi.getDateTime())){
				vehi.setOnoffstate("1");
			}else{
				vehi.setOnoffstate("0");
			}
			vehi.setMtname(list.get(i).get("MT_NAME")==null?"":list.get(i).get("MT_NAME").toString());
			vehi.setQk(list.get(i).get("OWNER_NAME")==null?"":list.get(i).get("OWNER_NAME").toString());
			vehi.setDispnum(list.get(i).get("DISP_NUM")==null?"":list.get(i).get("DISP_NUM").toString());
			vehi.setComplnum(list.get(i).get("COMPL_NUM")==null?"":list.get(i).get("COMPL_NUM").toString());
			vehi.setJfzs(list.get(i).get("INTEGRAL")==null?"":list.get(i).get("INTEGRAL").toString());
			
			
			results.add(vehi);
		}
		return results;
	}
	
	public String bjgzcar() {
		String sql="select t.vehi_no from TB_OA_MALVEHI t where t.flag=0 and t.type=0";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		String cls = "";
		for (int i = 0; i < list.size(); i++) {
			cls+=list.get(i).get("VEHI_NO").toString()+",";
		}
		return cls;
	}

	public String lovecar() {
		String sql="select t.vehi_no from TB_MOTORCADE_CARS t where t.tm_id=1";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		String cls = "";
		for (int i = 0; i < list.size(); i++) {
			cls+=list.get(i).get("VEHI_NO").toString()+",";
		}
		return cls;
	}
	
	public String yjcbjcar() {
        String sql="select t.isu from TB_ALERT_JCLOG t where t.jctime>sysdate-1/48";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        String cls = "";
        for (int i = 0; i < list.size(); i++) {
            cls+=list.get(i).get("ISU").toString()+",";
        }
        return cls;
    }
	
	public static boolean jisuan(String date1){ 
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
        double result=0;
		try {
			Date start = sdf.parse(date1);
			Date end = new Date();
			long cha = end.getTime() - start.getTime(); 
			result = cha * 1.0 / (1000 * 60); 
			
		} catch (ParseException e) {
			e.printStackTrace();
		}
		if(result<=30){ 
			return true; 
		}else{ 
			return false; 
		} 
    }

	public String bjdata() {
		DataItem data = (DataItem) GisData.map.get("data");
//		System.out.println(data);
		Map<String, Object> result = new HashMap<String, Object>();
		if(null != data){
			result.put("arealist", data.getArealist());
//			System.out.println("#####data.getArealist()"+data.getArealist().size());
			result.put("num", data.getNum());
			result.put("vehilist", data.getVehilist());
			result.put("yjccj", data.getYjcvehino());
			result.put("gzlist", data.getGzlist());
			result.put("zxvehilist", data.getZxvehilist());
//			result.put("l2", data.getL2());
//			result.put("l3", data.getL3());
//			result.put("l4", data.getL4());
//			result.put("l5", data.getL5());
//			result.put("l6", data.getL6());
//			result.put("l7", data.getL7());
		}
		return jacksonUtil.toJson(result);
	}

	public String findcompname(String cp) {
		String sql = "select comp_name gsmc,mt_name zdlx from vw_vehicle t where t.vehi_no=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,cp);
		if(list.size()>0){
			return jacksonUtil.toJson(list.get(0));
		}else{
			return "{\"gsmc\":\"\",\"zdlx\":\"\"}";
		}
	}

	public String bjcl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ad_dealtime = String.valueOf(paramMap.get("ad_dealtime"));
		String ad_listentime = String.valueOf(paramMap.get("ad_dealtime"));
		String ad_userid = String.valueOf(paramMap.get("ad_userid"));
		String ad_car_no = String.valueOf(paramMap.get("ad_car_no"));
		String driver_tel = String.valueOf(paramMap.get("driver_tel"));
		String ad_listencase = String.valueOf(paramMap.get("ad_listencase"));
		String ad_gps = String.valueOf(paramMap.get("ad_gps"));
		String ad_result = String.valueOf(paramMap.get("ad_result"));
		String ad_lastdeal = String.valueOf(paramMap.get("ad_lastdeal"));
		String ad_alerttype = String.valueOf(paramMap.get("ad_alerttype"));
		String ad_condition = String.valueOf(paramMap.get("ad_condition"));
		String ad_memo = String.valueOf(paramMap.get("ad_memo"));
		String ad_dbtime = String.valueOf(paramMap.get("ad_dbtime"));
		String sql = "insert into TB_ALERTDEAL t (AD_DEALTIME,AD_USERID,AD_CAR_NO"
				+ ",DRIVER_TEL,AD_LISTENCASE,AD_GPS,AD_RESULT,AD_LASTDEAL,AD_ALERTTYPE"
				+ ",AD_CONDITION,AD_MEMO,AD_DBTIME,AD_LISTENTIME) values (to_date('"+ad_dealtime+"','yyyy-mm-dd hh24:mi:ss')"
						+ ",'"+ad_userid+"'"
						+ ",'"+ad_car_no+"'"
						+ ",'"+driver_tel+"'"
						+ ",'"+ad_listencase+"'"
						+ ",'"+ad_gps+"'"
						+ ",'"+ad_result+"'"
						+ ",'"+ad_lastdeal+"'"
						+ ",'"+ad_alerttype+"'"
						+ ",'"+ad_condition+"'"
						+ ",'"+ad_memo+"'"
						+ ",to_date('"+ad_dbtime+"','yyyy-mm-dd hh24:mi:ss')"
						+ ",to_date('"+ad_listentime+"','yyyy-mm-dd hh24:mi:ss'))";
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
		
	}
	public String bjcledit(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ad_id = String.valueOf(paramMap.get("ad_id"));
		String ad_dealtime = String.valueOf(paramMap.get("ad_dealtime"));
		String ad_listentime = String.valueOf(paramMap.get("ad_dealtime"));
		String ad_userid = String.valueOf(paramMap.get("ad_userid"));
		String ad_car_no = String.valueOf(paramMap.get("ad_car_no"));
		String driver_tel = String.valueOf(paramMap.get("driver_tel"));
		String ad_listencase = String.valueOf(paramMap.get("ad_listencase"));
		String ad_gps = String.valueOf(paramMap.get("ad_gps"));
		String ad_result = String.valueOf(paramMap.get("ad_result"));
		String ad_lastdeal = String.valueOf(paramMap.get("ad_lastdeal"));
		String ad_alerttype = String.valueOf(paramMap.get("ad_alerttype"));
		String ad_condition = String.valueOf(paramMap.get("ad_condition"));
		String ad_memo = String.valueOf(paramMap.get("ad_memo"));
		String sql = "update TB_ALERTDEAL t set "
				+ "AD_USERID='"+ad_userid+"',"
				+ "DRIVER_TEL='"+driver_tel+"',"
				+ "AD_LISTENCASE='"+ad_listencase+"',"
				+ "AD_GPS='"+ad_gps+"',"
				+ "AD_RESULT='"+ad_result+"',"
				+ "AD_LASTDEAL='"+ad_lastdeal+"',"
				+ "AD_ALERTTYPE='"+ad_alerttype+"',"
				+ "AD_CONDITION='"+ad_condition+"',"
				+ "AD_MEMO='"+ad_memo+"'"
				+ " where AD_ID='"+ad_id+"'";
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
		
	}
	public String findbjclitem(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String cp = String.valueOf(paramMap.get("cp"));
		String ts = String.valueOf(paramMap.get("ts"));
		 Date d=new Date();   
	   SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd");   
	   Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");  
	   if(ts.equals("")||!pattern.matcher(ts).matches()){
		   ts="1";
	   }
		   int days = Integer.parseInt(ts);
		   String stime = df.format(new Date(d.getTime() - (days-1) * 24 * 60 * 60 * 1000));  
		
		String sql = "select * from TB_ALERTDEAL t where t.AD_CAR_NO like '%"+cp+"%' and t.AD_DEALTIME>= to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') order by t.AD_DEALTIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	} 
	
	public String addarea(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String areaname = String.valueOf(paramMap.get("areaname"));
		String areabjs = String.valueOf(paramMap.get("areabjs"));
		String areams = String.valueOf(paramMap.get("areams"));
		String areazbs = String.valueOf(paramMap.get("areazbs"));
		String areasize = String.valueOf(paramMap.get("areasize"));
		String sql = "insert into TB_AREA t (AREA_NAME,AREA_DESCRIBE,AREA_COORDINATES,USER_ID,ALARMNUM,AREA_SIZE) values ('"+areaname+"','"+areams+"','"+areazbs+"','','"+areabjs+"','"+areasize+"')";
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"添加成功\"}";
		}else{
			return "{\"msg\":\"添加失败\"}";
		}
	}
	
	public String delarea(String areaid) {
		String sql = "delete TB_AREA t where t.area_id='"+areaid+"'";
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"删除成功\"}";
		}else{
			return "{\"msg\":\"删除失败\"}";
		}
	}

    public void jcbjlog(String postData)
    {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String isu = String.valueOf(paramMap.get("isu"));
        String sql = "insert into TB_ALERT_JCLOG t(ISU,JCTIME) values('"+isu+"',sysdate)";
        jdbcTemplate.update(sql);
    }
}
