package mvc.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import helper.Cache;
import helper.CacheManager;
import helper.JacksonUtil;

import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import cn.com.activeMQ.Sender;

import com.tw.cache.DataItem;
import com.tw.cache.GisData;


@Service
public class XhcddServer {
	private static final String String = null;
	protected JdbcTemplate jdbcTemplate = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

	
	
	
	public String addcd(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String cdmc = String.valueOf(paramMap.get("cdmc"));
		String cps = String.valueOf(paramMap.get("cps"));
		String gh = String.valueOf(paramMap.get("gh"));
		String sql = "select * from tb_motorcade t where  t.tm_name=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,cdmc);//,new Object[] {keyword});
		if(list.size()>0){
			return "{\"msg\":\"车队名称已存在\"}";
		}
		String sqlin = "insert into tb_motorcade t (TM_NAME,CREATE_GH,CREATE_TIME) values ('"+cdmc+"','"+gh+"',sysdate)";
		int a = jdbcTemplate.update(sqlin);
		if(a>0){
			String [] cars = cps.split(",");
			String sqlitem="";
			for (int i = 0; i < cars.length; i++) {
				sqlitem += " into tb_motorcade_cars values ('',(select tm_id from tb_motorcade where tm_name='"+cdmc+"'),'"+cars[i]+"')";
			}
			
			String sqlclin = "insert all "+sqlitem+" select 1 from dual";
			int b = jdbcTemplate.update(sqlclin);
			if(b>0){
				return "{\"msg\":\"添加车队成功\"}";
			}else{
				return "{\"msg\":\"添加车队失败\"}";
			}
		}else{
			return "{\"msg\":\"添加车队失败\"}";
		}
	}
	
	
	public String queryddqy() {
		String sql = "select owner_id,owner_name from tb_owner t";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public String queryorder(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gh = String.valueOf(paramMap.get("gh"));
//		String qx = String.valueOf(paramMap.get("qx"));
		String cp = String.valueOf(paramMap.get("cp"));
		String bh = String.valueOf(paramMap.get("bh"));
		String cxtj="";
		
		if(!cp.equals("")){
			cxtj = " and t.vehi_no like '%"+cp+"%'";
		}
		if(!bh.equals("")){
			cxtj = " and t.disp_id = '"+bh+"'";
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		String sql ="select t.*,t1.vehi_sim from tb_xhc_dispatch t"
						+" left join hzgps_other.vw_vehicle@taxilink44 t1 on t.VEHI_NO=t1.VEHI_NO where 1=1 "
						//+ "and t.disp_type='电话约车'"
						+ ""+cxtj
						+" and to_char(t.disp_time,'yyyy-dd-mm')=to_char(sysdate,'yyyy-dd-mm') order by t.disp_id desc";
//						+" and t.disp_time>sysdate-60/24/60 order by t.disp_id desc";

//				System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		Map<String, Object> resultlist=new HashMap<String, Object>();
		List<Map<String, Object>> zzddlist=new ArrayList<Map<String, Object>>();//正在调度
		List<Map<String, Object>> pcqrlist=new ArrayList<Map<String, Object>>();//派车确认
		List<Map<String, Object>> ddwclist=new ArrayList<Map<String, Object>>();//调度完成
		List<Map<String, Object>> rwclist=new ArrayList<Map<String, Object>>();//任务车监控
		int zzddxh=0,pcqrxh=0,ddwcxh=0,rwcxh=0,qtywxh=0;
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			if(m.get("DISP_TYPE").toString().equals("电话约车")&&m.get("DISP_USER")!=null){
				//派车确认
				if(!m.get("DISP_USER").toString().equals(gh)&&m.get("DISP_STATE").toString().equals("派车确认")&&m.get("VEHI_NO")!=null){
					Map<String, Object> rwc = getrwc(m.get("VEHI_NO").toString());
					rwcxh++;
					rwc.put("RWCXH", rwcxh);
					rwc.put("DISP_ID", m.get("DISP_ID").toString());
					rwclist.add(rwc);
					pcqrxh++;
					m.put("PCQRXH", pcqrxh);
					pcqrlist.add(m);
					continue;
				}
				if(m.get("DISP_STATE").toString().equals("调度完成")||m.get("DISP_STATE").toString().equals("调度取消")){
					ddwcxh++;
					m.put("DDWCXH", ddwcxh);
					ddwclist.add(m);
					continue;
				}
				
				if(m.get("DISP_USER").toString().equals(gh)){
					if(m.get("DISP_STATE").toString().equals("派车确认")&&m.get("VEHI_NO")!=null){
//						Map<String, Object> rwc = getrwc(m.get("VEHI_NO").toString());
//						rwcxh++;
//						rwc.put("RWCXH", rwcxh);
//						rwc.put("DISP_ID", m.get("DISP_ID").toString());
//						rwclist.add(rwc);
					}
					zzddxh++;
					m.put("ZZDDXH", zzddxh);
					zzddlist.add(m);
					continue;
				}
			}
		}
		resultlist.put("zzdd", zzddlist);
		resultlist.put("pcqr", pcqrlist);
		resultlist.put("ddwc", ddwclist);
		resultlist.put("rwc", rwclist);
		return jacksonUtil.toJson(resultlist);
	}
	
	
	private Map<String, Object> getrwc(String cp) {
		String sql1 = "select * from hzgps_other.vw_vehicle@taxilink44 t,TB_OTHER_STATUS@TAXILINK105 m"
				+ " where t.SIM_NUM = m.mdt_NO and t.vehi_no=?";
		
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql1,new Object[]{cp});
		if(list.size()>0){
			return list.get(0);
		}
		return null;
	}

	public String queryldjl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ldhm = String.valueOf(paramMap.get("ldhm"));
		String sql1 = "select t.CUST_GRADE from tb_customer t where t.cust_tel=?";
		String sql2 ="select * from "
				+ "(select tt.*,rownum r from "
				+ "(select t.* from tb_customer_info t where t.ci_tel=? order by t.insert_time desc)tt"
				+ ")ttt where ttt.r<=10";
		String sql3 = "select sum(t.disp_num) yccs,sum(t.success_num) cgcs,sum(t.compl_num) kfcs"
				+ " from tb_customer_info t"
				+ " where t.ci_tel = ?";
		List<Map<String, Object>> list1 = jdbcTemplate.queryForList(sql1,new Object[]{ldhm});
		List<Map<String, Object>> list2 = jdbcTemplate.queryForList(sql2,new Object[]{ldhm});
		List<Map<String, Object>> list3 = jdbcTemplate.queryForList(sql3,new Object[]{ldhm});
		Map<String, Object> resultlist = new HashMap<String, Object>();
		if(list1.size()>0){
			resultlist.put("KHDJ", list1.get(0).get("CUST_GRADE"));
		}else{
			resultlist.put("KHDJ", "A");
		}
		if(list2.size()>0){
			resultlist.put("SCYC", list2.get(0).get("INSERT_TIME"));
		}else{
			resultlist.put("SCYC", "");
		}
		resultlist.put("LDLSJL", list2);
		resultlist.put("CS", (list3.get(0).get("YCCS")==null?"0":list3.get(0).get("YCCS"))+"/"+(list3.get(0).get("CGCS")==null?"0":list3.get(0).get("CGCS"))+"/"+(list3.get(0).get("KFCS")==null?"0":list3.get(0).get("KFCS")));
		return jacksonUtil.toJson(resultlist);
	}

	public String qxdd(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String dispid = String.valueOf(paramMap.get("dispid"));
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='调度取消' where t.DISP_ID='"+dispid+"'";
		int a = jdbcTemplate.update(sql_ddb);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	
	public String createHMD(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String custname = String.valueOf(paramMap.get("custname"));
		String custtel = String.valueOf(paramMap.get("custtel"));
		String sql = "update tb_customer t set t.cust_grade='F' where t.cust_tel=?";
		int a = jdbcTemplate.update(sql, new Object[]{custtel});
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			String sql1 = "insert into tb_customer t (t.cust_name,t.cust_tel,t.cust_sex,t.cust_grade,t.insert_time,t.last_change_date)"
					+ " values(?,?,'男','F',sysdate,sysdate)";
			int b = jdbcTemplate.update(sql1, new Object[]{custname,custtel});
			if(b>0){
				return "{\"msg\":\"1\"}";
			}else{
				return "{\"msg\":\"0\"}";
			}
		}
	}
		
	public String xdd(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String cksj = String.valueOf(paramMap.get("cksj"));//乘客手机
		String scjd = String.valueOf(paramMap.get("scjd"));//上车经度
		String scwd = String.valueOf(paramMap.get("scwd"));//上车纬度
		String qq_id = String.valueOf(paramMap.get("qq_id"));//请求编号
		String scdz = String.valueOf(paramMap.get("scdz"));//上车地址
		String mdd = String.valueOf(paramMap.get("mdd"));//目的地
		String yhm = String.valueOf(paramMap.get("yhm"));//乘客姓名
		String xb = String.valueOf(paramMap.get("xb"));//性别
		String fjxx = String.valueOf(paramMap.get("fjxx"));//附加信息
		String cllx = String.valueOf(paramMap.get("cllx"));//车辆类型
		String ywlx = String.valueOf(paramMap.get("ywlx"));//业务类型
		String ci_id = String.valueOf(paramMap.get("ci_id"));//客户信息id
		String disp_user = String.valueOf(paramMap.get("disp_user"));//调度员
		String yclx = String.valueOf(paramMap.get("yclx"));//约车类型
		String wbdh = String.valueOf(paramMap.get("wbdh"));//外拨电话
		String sfyy = String.valueOf(paramMap.get("sfyy"));//是否预约
		String ycsj = String.valueOf(paramMap.get("ycsj"));//用车时间
		String zdwb = String.valueOf(paramMap.get("zdwb"));//是否自动外拨
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		
		//查询用户信息
		String khsql="insert into tb_customer_info t (CI_NAME,CI_TEL,ADDRES_REF,ADDRESS,LONGI,LATI,REC_TIME,NOTE,DEST_ADDRESS)"
				+ " values ('"+yhm+"','"+cksj+"','"+scdz+"','"+scdz+"','"+scjd+"','"+scwd+"',sysdate,'"+fjxx+"','"+mdd+"')";
		int b = jdbcTemplate.update(khsql);
		if(b<1){
			return "{\"msg\":\"0\"}";
		}
		String maxciidsql = "select max(t.ci_id) ciid from tb_customer_info t where t.ci_tel='"+cksj+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(maxciidsql);
		if(list.size()>0){
			ci_id = list.get(0).get("ciid").toString();
		}
		String sql ="";
		if(sfyy.equals("0")){
			sql = "insert into tb_dispatch_"+db+" t (CI_ID,DEST_ADDRESS,DISP_USER,DISP_STATE,DISP_TYPE,DISP_TIME,"
					+ "NOTE,ADDRESS,ADDRESS_REF,CUST_NAME,CUST_TEL,LONGTI,LATI,CALL_STATE,AUTOOUTPHONE,OUTPHONE,QQ_ID,SFYY,YC_TIME) "
					+ "values ('"+ci_id+"','"+mdd+"','"+disp_user+"','正在调度','电话约车',sysdate,'"+fjxx+"','"+scdz+"','"+scdz+"','"+yhm+"','"+cksj+"','"+scjd+"','"+scwd+"',"
							+ "'255','"+zdwb+"','"+wbdh+"','"+qq_id+"','"+sfyy+"',sysdate)";
		}else{
			sql = "insert into tb_dispatch_"+db+" t (CI_ID,DEST_ADDRESS,DISP_USER,DISP_STATE,DISP_TYPE,DISP_TIME,"
					+ "NOTE,ADDRESS,ADDRESS_REF,CUST_NAME,CUST_TEL,LONGTI,LATI,CALL_STATE,AUTOOUTPHONE,OUTPHONE,QQ_ID,SFYY,YC_TIME) "
					+ "values ('"+ci_id+"','"+mdd+"','"+disp_user+"','正在调度','电话约车',sysdate,'"+fjxx+"','"+scdz+"','"+scdz+"','"+yhm+"','"+cksj+"','"+scjd+"','"+scwd+"',"
							+ "'255','"+zdwb+"','"+wbdh+"','"+qq_id+"','"+sfyy+"','"+ycsj+"')";
		}
		int a = jdbcTemplate.update(sql);
		if(a>0){
			String sqlorderid="select t.disp_id from tb_dispatch_"+db+" t where t.QQ_ID='"+qq_id+"'";
			List<Map<String, Object>> listid = jdbcTemplate.queryForList(sqlorderid);
			paramMap.put("disp_id", listid.get(0).get("DISP_ID").toString());
//			System.out.println(jacksonUtil.toJson(paramMap));
			Sender.StartSend("192.168.0.102","hz_paidan_1",jacksonUtil.toJson(paramMap));
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String cxdd(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String qq_id = String.valueOf(paramMap.get("qq_id"));
		String ci_id = String.valueOf(paramMap.get("ci_id"));
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		String sql = "update tb_dispatch_"+db+" t set t.DISP_STATE='正在调度' where t.QQ_ID=?";
		int a = jdbcTemplate.update(sql, new Object[]{qq_id});
		if(a>0){
			String sqlc = "update tb_customer_info t set t.DISP_NUM=to_number(t.DISP_NUM)+1,t.REC_TIME=sysdate where t.CI_ID=?";
			jdbcTemplate.update(sqlc, new Object[]{ci_id});
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	public String ddwc(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String dispid = String.valueOf(paramMap.get("dispid"));
		
		String sql = "update tb_xhc_dispatch t set t.DISP_STATE='调度完成' where t.DISP_ID=?";
		int a = jdbcTemplate.update(sql, new Object[]{dispid});
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String jcsc(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		//改改改改
		String sql = "update TB_OTHER_STATUS@taxilink105 t set t.lockstate='0' where t.mdt_no = (select t1.sim_num from hzgps_other.vw_vehicle@taxilink44 t1 where t1.vehi_no='"+VEHI_NO+"')"; //解除锁车sql  未完成
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String xhcdddw() {
		String sql ="select * from hzgps_other.vw_vehicle@taxilink44 t,TB_OTHER_STATUS@TAXILINK105 m"
				+ " where t.SIM_NUM = m.mdt_NO and t.vehi_no in (select t.vehi_no from "
				+ "hzgps_other.vw_vehicle@taxilink44 t,"
				+ "hzgps_other.tb_company@taxilink44 t1,"
				+ "hzgps_other.tb_owner@taxilink44 t2 "
				+ "where t.comp_id=t1.comp_id and t1.owner_id=t2.owner_id and t2.owner_id='20') "
				+ "order by t.vehi_no";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
		if(list.size()>0){
			for (int i = 0; i < list.size(); i++) {
				Map<String, Object> m = list.get(i);
				if(m.get("DATETIME")!=null&&jisuan(m.get("DATETIME").toString())){
					m.put("onoffstate", "1");
				}else{
					m.put("onoffstate", "0");
				}
				if(m.get("DATETIME")!=null){
					m.put("DATETIME",m.get("DATETIME").toString().substring(0, 19));
				}
			}
			
			return jacksonUtil.toJson(list);
		}else{
			return "{}";
		}
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
	public String addxyh(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String dh = String.valueOf(paramMap.get("dh"));
		String xm = String.valueOf(paramMap.get("xm"));
		String sql1 = "select * from tb_customer t  where t.CUST_TEL=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql1, new Object[]{dh});
		if(list.size()>0){
			return "{\"msg\":\"2\"}";
		}
		String sql = "insert into tb_customer t (CUST_NAME,CUST_TEL) values (?,?)";
		int a = jdbcTemplate.update(sql, new Object[]{xm,dh});
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String edityh(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CI_ID = String.valueOf(paramMap.get("CI_ID"));
		String CI_NAME = String.valueOf(paramMap.get("CI_NAME"));
		String CUST_SEX="男";
		if(CI_NAME.equals("女士")||CI_NAME.equals("小姐")){
			CUST_SEX = "女";
		}
		String CI_TEL = String.valueOf(paramMap.get("CI_TEL"));
		
		String sql = "update tb_customer t set t.CUST_NAME='"+CI_NAME+"',CUST_TEL='"+CI_TEL+"',t.CUST_SEX='"+CUST_SEX+"' where t.CUST_TEL='"+CI_TEL+"'";
		int a = jdbcTemplate.update(sql);
//		System.out.println(sql);
//		System.out.println(a);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String querycllx(String gjz) {
		String sql = "select distinct(t.cs_type) cs_type from tb_consultation t where t.cs_type like '%"+gjz+"%'";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		if(list.size()>0){
			return jacksonUtil.toJson(list.get(0));
		}else{
			return "{}";
		}
	}
	public String createZX(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
//		System.out.println(postData);
		String ldhm = String.valueOf(paramMap.get("ldhm"));
		String sldx = String.valueOf(paramMap.get("sldx"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String khxm = String.valueOf(paramMap.get("khxm"));
		String cphm = String.valueOf(paramMap.get("cphm"));
		String ssgs = String.valueOf(paramMap.get("ssgs"));
		String fwnr = String.valueOf(paramMap.get("fwnr"));
		String clgh = String.valueOf(paramMap.get("clgh"));
		String sql = "insert into tb_consultation t (CS_TELNUM,CS_CLIENT,CS_STATE,CS_DEALDATETIME,CS_TYPE,CS_WORKERNUM,CS_VEHIID,CS_MEMO,CS_OBJECT)"
				+ " values (?,?,?,sysdate,?,?,?,?,?)";
		int a = jdbcTemplate.update(sql, new Object[]{ldhm,khxm,"已处理",cllx,clgh,cphm,fwnr,sldx});
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String findbyld(String zxld) {
		String sql = "select * from tb_consultation t where t.cs_telnum =? order by t.cs_dealdatetime desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,new Object[]{zxld});
		return jacksonUtil.toJson(list);
	}
	
	public String findallzx(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
//		System.out.println(postData);
		String cphm = String.valueOf(paramMap.get("cphm"));
		String dhhm = String.valueOf(paramMap.get("dhhm"));
		String clgh = String.valueOf(paramMap.get("clgh"));
		String fwnr = String.valueOf(paramMap.get("fwnr"));
		String tj="";
		if(!cphm.equals("")){
			tj +=" and t.cs_vehiid like '%"+cphm+"%'";
		}
		if(!dhhm.equals("")){
			tj +=" and t.cs_telnum like '%"+dhhm+"%'";
		}
		if(!clgh.equals("")){
			tj +=" and t.cs_workernum = '"+clgh+"'";
		}
		if(!fwnr.equals("")){
			tj +=" and t.cs_memo like '%"+fwnr+"%'";
		}
		String sql = "select * from tb_consultation t where to_char(t.cs_dealdatetime,'yyyy-dd-mm')=to_char(sysdate,'yyyy-dd-mm') "+tj+" order by t.cs_dealdatetime desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("CS_DEALDATETIME", m.get("CS_DEALDATETIME").toString().substring(0, 19));
		}
		return jacksonUtil.toJson(list);
	}
	
	public List<Map<String, Object>> findallzx_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
//		System.out.println(postData);
		String cphm = String.valueOf(paramMap.get("cphm"));
		String dhhm = String.valueOf(paramMap.get("dhhm"));
		String clgh = String.valueOf(paramMap.get("clgh"));
		String fwnr = String.valueOf(paramMap.get("fwnr"));
		String tj="";
		if(!cphm.equals("")){
			tj +=" and t.cs_vehiid like '%"+cphm+"%'";
		}
		if(!dhhm.equals("")){
			tj +=" and t.cs_telnum like '%"+dhhm+"%'";
		}
		if(!clgh.equals("")){
			tj +=" and t.cs_workernum = '"+clgh+"'";
		}
		if(!fwnr.equals("")){
			tj +=" and t.cs_memo like '%"+fwnr+"%'";
		}
		String sql = "select * from tb_consultation t where to_char(t.cs_dealdatetime,'yyyy-dd-mm')=to_char(sysdate,'yyyy-dd-mm') "+tj+" order by t.cs_dealdatetime desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("CS_DEALDATETIME", m.get("CS_DEALDATETIME").toString().substring(0, 19));
		}
		return list;
	}
	
	public String delbyzxid(String zxids) {
		String sql = "delete tb_consultation t where t.cs_id in ("+zxids+")";
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String findonezx(String zxids) {
		String sql = "select * from tb_consultation t where t.cs_id ='"+zxids+"'";
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list.get(0));
	}
	public String editzx(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ywbh = String.valueOf(paramMap.get("ywbh"));
		String ldhm = String.valueOf(paramMap.get("ldhm"));
		String cldx = String.valueOf(paramMap.get("cldx"));
		String khxm = String.valueOf(paramMap.get("khxm"));
		String cphm = String.valueOf(paramMap.get("cphm"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String fwnr = String.valueOf(paramMap.get("fwnr"));
		
		String sql = "update tb_consultation t set CS_TELNUM=?,CS_CLIENT=?,CS_TYPE=?,CS_VEHIID=?,CS_MEMO=?,CS_OBJECT=? where CS_ID=?";
		int a = jdbcTemplate.update(sql, new Object[]{ldhm,khxm,cllx,cphm,fwnr,cldx,ywbh});
		if(a>0){
			return "{\"msg\":\"修改成功\"}";
		}else{
			return "{\"msg\":\"修改失败\"}";
		}
		
	}
	public String jfgl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
//		System.out.println(postData);
		int a=0;
		String jflx = String.valueOf(paramMap.get("jflx"));
		String DISP_ID = String.valueOf(paramMap.get("DISP_ID"));
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		String CI_ID = String.valueOf(paramMap.get("CI_ID"));
		int addjf = Integer.parseInt(String.valueOf(paramMap.get("addjf")));
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		if(jflx.equals("1")){//未接到客人
			//客户表：投诉+1  
			//车辆表：投诉+1，积分+0->addjf
			//调度表：调度状态改为，未接到客人(乘客)；原因改为，输入值；积分+0
			String sql_khb = "update tb_customer_info t set t.COMPL_NUM=to_number(t.COMPL_NUM)+1 where t.CI_ID='"+CI_ID+"'";
			String sql_clb = "update tb_vehicle t set t.COMPL_NUM=to_number(t.COMPL_NUM)+1,t.INTEGRAL=to_number(t.INTEGRAL)+"+addjf+" where t.VEHI_NO='"+VEHI_NO+"'";
			String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='未接到客人(乘客)' where t.DISP_ID='"+DISP_ID+"'";
//			System.out.println(sql_khb+sql_clb+sql_ddb);
			jdbcTemplate.update(sql_khb);
			jdbcTemplate.update(sql_clb);
			a = jdbcTemplate.update(sql_ddb);
		}else if(jflx.equals("2")){
//			未接到客人-技术原因：
//			客户表：投诉+1
//			车辆表：不变
//			调度表：调度状态改为，未接到客人(技术)；原因改为，输入值；积分+0
			String sql_khb = "update tb_customer_info t set t.COMPL_NUM=to_number(t.COMPL_NUM)+1 where t.CI_ID='"+CI_ID+"'";
			String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='未接到客人(技术)' where t.DISP_ID='"+DISP_ID+"'";
			jdbcTemplate.update(sql_khb);
			a = jdbcTemplate.update(sql_ddb);
		}else if(jflx.equals("3")){
//			未接到客人-服务原因：
//			客户表：投诉+1
//			车辆表：不变
//			调度表：调度状态改为，未接到客人(服务)；原因改为，输入值；积分+0
			String sql_khb = "update tb_customer_info t set t.COMPL_NUM=to_number(t.COMPL_NUM)+1 where t.CI_ID='"+CI_ID+"'";
			String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='未接到客人(服务)' where t.DISP_ID='"+DISP_ID+"'";
			jdbcTemplate.update(sql_khb);
			a = jdbcTemplate.update(sql_ddb);
		}else if(jflx.equals("4")){
//			未接到客人-其它：
//			客户表：投诉+1
//			车辆表：不变
//			调度表：调度状态改为，未接到客人(其它)；原因改为，输入值；积分+0
			String sql_khb = "update tb_customer_info t set t.COMPL_NUM=to_number(t.COMPL_NUM)+1 where t.CI_ID='"+CI_ID+"'";
			String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='未接到客人(其它)' where t.DISP_ID='"+DISP_ID+"'";
			jdbcTemplate.update(sql_khb);
			a = jdbcTemplate.update(sql_ddb);
		}else if(jflx.equals("5")){//接错客人
//			客户表：不变
//			车辆表：投诉+1，积分+(-1)
//			调度表：调度状态改为，接错客人；原因改为，输入值；积分+(-1)
			String sql_clb = "update tb_vehicle t set t.COMPL_NUM=to_number(t.COMPL_NUM)+1,t.INTEGRAL=to_number(t.INTEGRAL)-"+addjf+" where t.VEHI_NO='"+VEHI_NO+"'";
			String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='接错客人' where t.DISP_ID='"+DISP_ID+"'";
			jdbcTemplate.update(sql_clb);
			a = jdbcTemplate.update(sql_ddb);
		}else if(jflx.equals("6")){//客人投诉
//			客户表：不变
//			车辆表：不变
//			调度表：调度状态改为，客人投诉；原因改为，输入值；积分+0
			String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='客人投诉' where t.DISP_ID='"+DISP_ID+"'";
			a = jdbcTemplate.update(sql_ddb);
		}else if(jflx.equals("7")){//接错客人
//			客户表：不变
//			车辆表：投诉+1，积分-0
//			调度表：调度状态改为，不去接客人；原因改为，输入值；积分-0

			String sql_clb = "update tb_vehicle t set t.COMPL_NUM=to_number(t.COMPL_NUM)+1,t.INTEGRAL=to_number(t.INTEGRAL)-"+addjf+" where t.VEHI_NO='"+VEHI_NO+"'";
			String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='不去接客人' where t.DISP_ID='"+DISP_ID+"'";
			jdbcTemplate.update(sql_clb);
			a = jdbcTemplate.update(sql_ddb);
		}
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}

	public String getdxxx(String dxlx) {
		String sql ="";
		if(dxlx.equals("1")){
			sql ="select * from tb_msg_ck";
		}else if(dxlx.equals("2")){
			sql ="select * from tb_msg_sj";
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	
	public Map<String,Object> forMap(String postData){
		return jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
	}
	
	
	
	
	public String schc(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String cp = String.valueOf(paramMap.get("cp"));
		String dispid = String.valueOf(paramMap.get("dispid"));
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		//查询车辆信息
		String clsql="select mdt_no from vw_vehicle where vehi_no=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(clsql,cp.toUpperCase());
		if(list.size()==0){
			return "{\"msg\":\"2\"}";
		}
		String mdt_no = list.get(0).get("MDT_NO").toString();
		
		String sql ="update tb_dispatch_"+db+" t set t.vehi_no='"+cp.toUpperCase()+"',t.sim_num='"+mdt_no+"',t.disp_state='派车确认' where t.disp_id='"+dispid+"'";
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}

	public String jfql(String vehi_no) {
		String sql = "select t.INTEGRAL from TB_VEHICLE t where t.VEHI_NO='"+vehi_no+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		String jf = list.get(0).get("INTEGRAL").toString();
		
		String sql_clb = "update TB_VEHICLE t set t.INTEGRAL=0 where t.VEHI_NO='"+vehi_no+"'";
		int a = jdbcTemplate.update(sql_clb);
		if(a>0){
			String sql_bd = "insert into tb_jifen_budan t (vehi_no,)";
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}

	public String jfbd(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String vehi_no = String.valueOf(paramMap.get("vehi_no"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String cklx = String.valueOf(paramMap.get("cklx"));
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxtj="";
		if(!gjz.equals("")){
			cxtj +=" and (t.VEHI_NO like '%"+gjz+"%' or t.DISP_ID ='"+gjz+"' or t.CLEAR_USER ='"+gjz+"' or t.CUST_NAME ='"+gjz+"' or t.CUST_TEL ='"+gjz+"') ";
		}
		if(!stime.equals("")){
			cxtj +=" and t.clear_time >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')";
		}
		if(!etime.equals("")){
			cxtj +=" and t.clear_time <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
		}
		if(!cklx.equals("")){
			cxtj +=" and jf_type='"+cklx+"'";
		}
		String sql = "select t.*  from tb_jifen_budan t where t.vehi_no ='"+vehi_no+"'"+cxtj+" order by clear_time desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public String jkcl(String cp) {
		String sql = "select VEHI_NO,PX,PY,"
				+ "STIME,SPEED,STATE,VEHI_SIM,"
				+ "ANGLE,MT_NAME,VT_NAME,"
				+ "OWN_TEL,COMP_NAME, "
				+ "OWNER_NAME,OWN_NAME,"
				+ "DISP_NUM,INTEGRAL,COMPL_NUM "
				+ "from vw_vehi_mdt t "
				+ "where instr('"+cp+"', t.VEHI_NO) > 0";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public String jfmx(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String vehi_no = String.valueOf(paramMap.get("vehi_no"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxtj="";
		if(!gjz.equals("")){
			cxtj +=" and (t.EVENT_DETAIL like '%"+gjz+"%' or t.USER_ID ='"+gjz+"' or t.EVENT_TYPE ='"+gjz+"' or t.REMARK ='"+gjz+"') ";
		}
		if(!stime.equals("")){
			cxtj +=" and t.EVENT_TIME >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')";
		}
		if(!etime.equals("")){
			cxtj +=" and t.EVENT_TIME <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
		}
//		if(!cklx.equals("")){
//			cxtj +=" and jf_type='"+cklx+"'";
//		}
		String sql = "select t.*  from TB_JIFEN_DETAIL t where t.VEHI_NO ='"+vehi_no+"'"+cxtj+" order by EVENT_TIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		String sqlcl = "select t.vehi_no cp,t.disp_num ddzs,t.integral jfzs,t.compl_num tszs from tb_vehicle t where t.vehi_no=?";
		List<Map<String, Object>> listcl = jdbcTemplate.queryForList(sqlcl,vehi_no);
		Map<String, Object> resultmap = new HashMap<String, Object>();
		resultmap.put("mx", list);
		resultmap.put("zs", listcl.get(0));
		return jacksonUtil.toJson(resultmap);
	}
	
	
	
	public List<Map<String, Object>> jfmx_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String vehi_no = String.valueOf(paramMap.get("vehi_no"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxtj="";
		if(!gjz.equals("")){
			cxtj +=" and (t.EVENT_DETAIL like '%"+gjz+"%' or t.USER_ID ='"+gjz+"' or t.EVENT_TYPE ='"+gjz+"' or t.REMARK ='"+gjz+"') ";
		}
		if(!stime.equals("")){
			cxtj +=" and t.EVENT_TIME >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss')";
		}
		if(!etime.equals("")){
			cxtj +=" and t.EVENT_TIME <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
		}
		String sql = "select t.*  from TB_JIFEN_DETAIL t where t.VEHI_NO ='"+vehi_no+"'"+cxtj+" order by EVENT_TIME desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			String jflx = m.get("JF_CLASS").toString();
			if(jflx.equals("1")){
				m.put("JF_CLASS", "奖励积分");
			}else{
				m.put("JF_CLASS", "普通积分");
			}
			m.put("EVENT_TIME", m.get("EVENT_TIME")==null?"":m.get("EVENT_TIME").toString().substring(0, 19));
		}
		return list;
	}

	public String fjcl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String zjd = String.valueOf(paramMap.get("zjd"));
		String yjd = String.valueOf(paramMap.get("yjd"));
		String swd = String.valueOf(paramMap.get("swd"));
		String xwd = String.valueOf(paramMap.get("xwd"));
		
		String sql = "select VEHI_NO,PX,PY "
				+ ",STIME,SPEED,STATE,VEHI_SIM"
				+ ",ANGLE "
				+ ",MT_NAME,VT_NAME"
				+ ",OWN_TEL,COMP_NAME"
				+ ",OWNER_NAME,OWN_NAME"
				+ ",DISP_NUM,INTEGRAL,COMPL_NUM "
				+ "from vw_vehi_mdt t "
				+ "where PY<"+swd+" and PY>"+xwd+" and PX>"+zjd+" and PX<"+yjd
				+ " and t.STATE='0' and t.stime>sysdate-5/24/60 ";
//				+ "and vehi_no='浙AT6012'";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		System.out.println("空车数   num="+list.size());
		return jacksonUtil.toJson(list);
		
		
//		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
//		String db = sdf1.format(new Date());
//		String sql = "select c.vehi_no, a.px, a.py, a.MDT_NO, a.STATE,a.angle from TB_MDT_STATUS a left join (select * from (select disp_time,rank()over(partition by sim_num order by disp_time desc) dp,sim_num,disp_state from  "
//				+ "tb_dispatch_"+db
//					+ " )  where dp=1) b on a.MDT_NO=b.sim_num left join VW_VEHICLE c on a.MDT_NO=c.MDT_NO where  "
//					+ "sqrt(( (('"
//					+ px
//					+ "'-px)*ACOS(-1)*12656*cos((('"
//					+ px
//					+ "'+px)/2)*ACOS(-1)/180)/180) *  (('"
//					+ px
//					+ "'-px)*ACOS(-1)*12656*cos ((('"
//					+ px
//					+ "'+px)/2)*ACOS(-1)/180)/180))+ ( (('"
//					+ py
//					+ "'-py)*ACOS(-1)*12656/180)* (('"
//					+ py
//					+ "'-py)*ACOS(-1)*12656/180)))<'"
//					+ 1
//					+ "' and a.STATE='"
//					+ 0
//					+ "'   and a.stime>sysdate-5/24/60 and (b.disp_time<sysdate-5/24/60 or (b.disp_time>sysdate-5/24/60 and a.LOCKSTATE='"
//					+ 0 + "')  or b.disp_time is null) ";
//		
////		System.out.println(sql);
//		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		return jacksonUtil.toJson(list);
	}

	public String kcdata() {
		DataItem data = (DataItem) GisData.map.get("data");
		Map<String, Object> result = new HashMap<String, Object>();
		if(null != data){
			result.put("zxvehilist", data.getZxvehilist());
		}
		return jacksonUtil.toJson(result);
	}
}
