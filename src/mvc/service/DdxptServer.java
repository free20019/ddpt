package mvc.service;

import cn.com.activeMQ.Sender;
import com.google.gson.Gson;
import com.tw.cache.DataItem;
import com.tw.cache.GisData;
import com.tw.util.JedisUtil;
import helper.Cache;
import helper.CacheManager;
import helper.JacksonUtil;
import helper.MapUtils;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
public class DdxptServer {
	private static final String String = null;
	protected JdbcTemplate jdbcTemplate = null;
	private Gson gson = new Gson();
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

	public String findallcp() {
		String key=CacheManager.findAllEstate;
		Cache cache= CacheManager.getCacheInfo(key);
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		if (null == cache){
			String sql = "select t.vehi_no cphm,t.comp_name,t.mdt_no from vw_vehicle t order by t.vehi_no";
			list = jdbcTemplate.queryForList(sql);
	        cache = new Cache();
	        cache.setKey(key);
	        cache.setValue(list);
	        CacheManager.putCache(key, cache);
	    }else {
	    	list=(List<Map<String, Object>>) cache.getValue();
	    }
		return jacksonUtil.toJson(list);
	}
	
	public String findcp(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String keyword = String.valueOf(paramMap.get("keyword"));
		if(!keyword.equals("")){
			keyword = " and t.vehi_no like '%"+keyword+"%'";
		}
		String sql = "select t.vehi_no cphm,t.comp_name,t.mdt_no from vw_vehicle t where 1=1 "+keyword+"  order by t.vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);//,new Object[] {keyword});
		return jacksonUtil.toJson(list);
	}
	
	public String findcd() {
		String sql = "select t.* from tb_motorcade t";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);//,new Object[] {keyword});
		return jacksonUtil.toJson(list);
	}
	public String findcdcars(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String tm_id = String.valueOf(paramMap.get("tm_id"));
		String sql = "select t.vehi_no,t1.mdt_no from tb_motorcade_cars t,vw_vehicle t1 where t.vehi_no = t1.vehi_no and t.tm_id=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,tm_id);//,new Object[] {keyword});
		return jacksonUtil.toJson(list);
	}
	
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
		String sql = "select owner_id,owner_name from tb_owner t order by owner_id";
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
		String sql ="select t.*,t1.vehi_sim from tb_dispatch_"+db+" t"
						+" left join vw_vehicle t1 on t.VEHI_NO=t1.VEHI_NO where 1=1 "
						//+ "and t.disp_type='电话约车'"
						+ ""+cxtj
						+" and to_char(t.disp_time,'yyyy-dd-mm')=to_char(sysdate,'yyyy-dd-mm') order by t.disp_id desc";
//						+" and t.disp_time>sysdate-60/24/60 order by t.disp_id desc";

		//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		Map<String, Object> resultlist=new HashMap<String, Object>();
		List<Map<String, Object>> zzddlist=new ArrayList<Map<String, Object>>();//正在调度
		List<Map<String, Object>> pcqrlist=new ArrayList<Map<String, Object>>();//派车确认
		List<Map<String, Object>> ddwclist=new ArrayList<Map<String, Object>>();//调度完成
		List<Map<String, Object>> rwclist=new ArrayList<Map<String, Object>>();//任务车监控
		List<Map<String, Object>> qtywlist=new ArrayList<Map<String, Object>>();//其他业务
		int zzddxh=0,pcqrxh=0,ddwcxh=0,rwcxh=0,qtywxh=0;
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			if(m.get("DISP_TYPE").toString().equals("电话约车")&&m.get("DISP_USER")!=null){
				//派车确认
				if(!m.get("DISP_USER").toString().equals(gh)&&m.get("DISP_STATE").toString().equals("派车确认")&&m.get("VEHI_NO")!=null){
					Map<String, Object> rwc = getrwc(m.get("VEHI_NO").toString());
					rwcxh++;
					rwc.put("RWCXH", rwcxh);
					rwc.put("DDQY", m.get("DDQY")==null?"":m.get("DDQY").toString());
					rwc.put("DISP_ID", m.get("DISP_ID").toString());
					rwclist.add(rwc);
					pcqrxh++;
					m.put("PCQRXH", pcqrxh);
					pcqrlist.add(m);
					continue;
				}
				if(m.get("DISP_STATE").toString().equals("调度完成")||m.get("DISP_STATE").toString().equals("调度取消")||m.get("DISP_STATE").toString().indexOf("客人")>-1){
					ddwcxh++;
					m.put("DDWCXH", ddwcxh);
					ddwclist.add(m);
					continue;
				}
				if(m.get("DISP_USER").toString().equals(gh)){
					if(m.get("DISP_STATE").toString().equals("派车确认")&&m.get("VEHI_NO")!=null){
						Map<String, Object> rwc = getrwc(m.get("VEHI_NO").toString());
						rwcxh++;
						rwc.put("RWCXH", rwcxh);
						rwc.put("DDQY", m.get("DDQY")==null?"":m.get("DDQY").toString());
						rwc.put("DISP_ID", m.get("DISP_ID").toString());
						rwclist.add(rwc);
					}
					zzddxh++;
					m.put("ZZDDXH", zzddxh);
					zzddlist.add(m);
					continue;
				}
//				try{
//					if((m.get("AUTOOUTPHONE").toString().equals("0")&&m.get("CALL_STATE").toString().equals("0"))&&!m.get("DISP_USER").toString().equals("gh")){
//						//人工
//						if(m.get("DISP_STATE").toString().equals("派车确认")&&m.get("VEHI_NO")!=null){
//							Map<String, Object> rwc = getrwc(m.get("VEHI_NO").toString());
//							rwcxh++;
//							rwc.put("RWCXH", rwcxh);
//							rwc.put("DISP_ID", m.get("DISP_ID").toString());
//							rwclist.add(rwc);
//						}
//						Date otime = sdf.parse(m.get("DISP_TIME").toString());
//						Date ntime = new Date();
//						long diff = ntime.getTime() - otime.getTime();
//						long mins = diff / (1000 * 60);
//						if(mins<30){
//							zzddxh++;
//							m.put("ZZDDXH", zzddxh);
//							zzddlist.add(m);
//							continue;
//						}
//					}
//				}catch(Exception e){
//					e.printStackTrace();
//				}
			}else{
				qtywxh++;
				m.put("QTYWXH", qtywxh);
				qtywlist.add(m);
			}
		}
		resultlist.put("zzdd", zzddlist);
		resultlist.put("pcqr", pcqrlist);
		resultlist.put("ddwc", ddwclist);
		resultlist.put("rwc", rwclist);
		resultlist.put("qtyw", qtywlist);
		return jacksonUtil.toJson(resultlist);
	}
	
	
	private Map<String, Object> getrwc(String cp) {
		String sql1 = "select VEHI_NO,PX,PY,STIME,SPEED,STATE,VEHI_SIM,ANGLE,MT_NAME,VT_NAME,OWN_TEL,COMP_NAME, OWNER_NAME,OWN_NAME,DISP_NUM,INTEGRAL,COMPL_NUM from vw_vehi_mdt t where t.VEHI_NO=?";
		
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql1,new Object[]{cp});
		if(list.size()>0){
			return list.get(0);
		}
		return null;
	}

	public String queryldjl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ldhm = String.valueOf(paramMap.get("ldhm"));
		String sql1 = "select t.CUST_GRADE,t.IS_LOVE from tb_customer t where t.cust_tel=?";
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
			if(list1.get(0).get("IS_LOVE").toString().equals("是")){
				resultlist.put("KHDJ", list1.get(0).get("CUST_GRADE")+"(爱心用户)");
			}else{
				resultlist.put("KHDJ", list1.get(0).get("CUST_GRADE"));
			}
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
		String isu = String.valueOf(paramMap.get("isu"));
		return isu;
//		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
//		String db = sdf1.format(new Date());
//		String sql_ddb = "update tb_dispatch_"+db+" t set t.DISP_STATE='调度取消' where t.DISP_ID='"+dispid+"'";
//		int a = jdbcTemplate.update(sql_ddb);
//		if(a>0){
//			return "{\"msg\":\"1\"}";
//		}else{
//			return "{\"msg\":\"0\"}";
//		}
	}
	public Boolean ishq(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String isu = String.valueOf(paramMap.get("isu"));
		if(isu.equals("")){
			return false;
		}
		String sql = "select t.mt_name from VW_VEHICLE t where t.mdt_no = '"+isu+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		if(list.size()<1){
		    return false;
		}
		String mtname = (String) list.get(0).get("MT_NAME");
		if(mtname.indexOf("华强")>-1){
			return true;
		}else{
			return false;
		}
	}
	public String getisu(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String isu = String.valueOf(paramMap.get("isu"));
		return isu;
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
//		String sql = "update tb_dispatch_"+db+" t set t.DISP_STATE='正在调度' where t.QQ_ID=?";
//		int a = jdbcTemplate.update(sql, new Object[]{qq_id});
		
		String sql = "select * from tb_dispatch_"+db+" t where t.QQ_ID=?";
		List<Map<String,Object>> list = jdbcTemplate.queryForList(sql, qq_id);
		String vehino = list.get(0).get("VEHI_NO")==null?"":list.get(0).get("VEHI_NO").toString();
		if(vehino.equals("")){
		    return "0";
		}else{
		    return "1";
		}
		
//		if(a>0){
//			String sqlc = "update tb_customer_info t set t.DISP_NUM=to_number(t.DISP_NUM)+1,t.REC_TIME=sysdate where t.CI_ID=?";
//			jdbcTemplate.update(sqlc, new Object[]{ci_id});
//			return "{\"msg\":\"1\"}";
//		}else{
//			return "{\"msg\":\"0\"}";
//		}
	}
	public String ddwc(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String dispid = String.valueOf(paramMap.get("dispid"));
		
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		String sql = "update tb_dispatch_"+db+" t set t.DISP_STATE='调度完成' where t.DISP_ID=?";
		int a = jdbcTemplate.update(sql, new Object[]{dispid});
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String ddqx(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String dispid = String.valueOf(paramMap.get("dispid"));
		
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		String sql = "update tb_dispatch_"+db+" t set t.DISP_STATE='调度取消' where t.DISP_ID=?";
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
		String sql = "update tb_mdt_status t set t.lockstate='0' where t.mdt_id = (select t1.mdt_id from tb_vehicle t1 where t1.vehi_no='"+VEHI_NO+"')"; //解除锁车sql  未完成
		int a = jdbcTemplate.update(sql);
		if(a>0){
			return "{\"msg\":\"1\"}";
		}else{
			return "{\"msg\":\"0\"}";
		}
	}
	
	public String dwjkcl(String cp) {
		//车牌，经度，纬度，定位时间，速度，空重车，sim卡，方向，终端类型，车型，车主电话，公司，区块，车主姓名，备注
		String sql = "select MDT_NO,VEHI_NO,VEHI_SIM,MT_NAME,VT_NAME,OWN_TEL,COMP_NAME, OWNER_NAME,OWN_NAME,DISP_NUM,INTEGRAL,COMPL_NUM,MDT_SUB_TYPE from vw_vehi_mdt t where t.VEHI_NO='"+cp+"'";
		if(cp.length()==4){
			sql = "select MDT_NO,VEHI_NO,VEHI_SIM,MT_NAME,VT_NAME,OWN_TEL,COMP_NAME, OWNER_NAME,OWN_NAME,DISP_NUM,INTEGRAL,COMPL_NUM,MDT_SUB_TYPE from vw_vehi_mdt t where t.VEHI_NO like '%"+cp+"%'";
		}
//		System.out.println(sql);
		String isxh="0";
		if(cp.indexOf("A1T")>0||cp.indexOf("A0T")>0){
		    isxh="1";
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
		if(list.size()>0){
			Map<String, Object> m = list.get(0);
			String mdtno = m.get("MDT_NO").toString();
//			System.out.println(mdtno);
			try{
			    JedisUtil jedisUtil = JedisUtil.getInstance();  
		        String dwxx = jedisUtil.getValueByKey(mdtno);
//		        System.out.println(dwxx);
		        Map<String, Object> map = new HashMap<String, Object>();
                map = gson.fromJson(dwxx, map.getClass());
                m.put("PX", map.get("px"));
                m.put("ISXH", isxh);
                m.put("PY", map.get("py"));
                m.put("STIME", map.get("positionTime"));
                m.put("SPEED", map.get("speed"));
                m.put("STATE", map.get("isPrecise"));
                m.put("CARSTATE", map.get("emptyOrHeavy"));
                m.put("ANGLE", map.get("direction"));
                if(m.get("STIME")!=null&&jisuan(m.get("STIME").toString())){
                      m.put("onoffstate", "1");
                }else{
                  m.put("onoffstate", "0");
                }
	        }catch(Exception e){
	            System.out.println("redis连接失败1");
	            return "{}";
	        }
			return jacksonUtil.toJson(list.get(0));
		}else{
			return "{}";
		}
	}
	
	
//	public String dwjkcl(String cp) {
//        //车牌，经度，纬度，定位时间，速度，空重车，sim卡，方向，终端类型，车型，车主电话，公司，区块，车主姓名，备注
//        String sql = "select MDT_NO,VEHI_NO,PX,PY,STIME,SPEED,STATE,CARSTATE,VEHI_SIM,ANGLE,MT_NAME,VT_NAME,OWN_TEL,COMP_NAME, OWNER_NAME,OWN_NAME,DISP_NUM,INTEGRAL,COMPL_NUM from vw_vehi_mdt t where t.VEHI_NO='"+cp+"'";
//        if(cp.length()==4){
//            sql = "select MDT_NO,VEHI_NO,PX,PY,STIME,SPEED,STATE,CARSTATE,VEHI_SIM,ANGLE,MT_NAME,VT_NAME,OWN_TEL,COMP_NAME, OWNER_NAME,OWN_NAME,DISP_NUM,INTEGRAL,COMPL_NUM from vw_vehi_mdt t where t.VEHI_NO like '%"+cp+"%'";
//        }
////      System.out.println(sql);
//        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
//        if(list.size()>0){
//            Map<String, Object> m = list.get(0);
//            if(m.get("STIME")!=null&&jisuan(m.get("STIME").toString())){
//                m.put("onoffstate", "1");
//            }else{
//                m.put("onoffstate", "0");
//            }
//            if(m.get("STIME")!=null){
//                m.put("STIME",m.get("STIME").toString().substring(0, 19));
//            }
//            return jacksonUtil.toJson(list.get(0));
//        }else{
//            return "{}";
//        }
//    }
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
		String tslx = String.valueOf(paramMap.get("tslx"));
		String sldx = String.valueOf(paramMap.get("sldx"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String clzt = String.valueOf(paramMap.get("clzt"));
		String khxm = String.valueOf(paramMap.get("khxm"));
		String cphm = String.valueOf(paramMap.get("cphm"));
		String ssgs = String.valueOf(paramMap.get("ssgs"));
		String fwnr = String.valueOf(paramMap.get("fwnr"));
		String clgh = String.valueOf(paramMap.get("clgh"));
		String sql = "insert into tb_consultation t (CS_TELNUM,CS_CLIENT,CS_STATE,CS_DEALDATETIME,CS_TYPE,CS_WORKERNUM,CS_VEHIID,CS_MEMO,CS_OBJECT,CS_TSLX,COMPANY)"
				+ " values (?,?,?,sysdate,?,?,?,?,?,?,?)";
		int a = jdbcTemplate.update(sql, ldhm,khxm,clzt,cllx,clgh,cphm,fwnr,sldx,tslx,ssgs);
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
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String sldx = String.valueOf(paramMap.get("sldx"));
		String cphm = String.valueOf(paramMap.get("cphm"));
		String dhhm = String.valueOf(paramMap.get("dhhm"));
		String clgh = String.valueOf(paramMap.get("clgh"));
		String fwnr = String.valueOf(paramMap.get("fwnr"));
		String clzt = String.valueOf(paramMap.get("clzt"));
		String tj="";
		List<String> wlist = new ArrayList<String>();
		if(!stime.equals("")&&!etime.equals("")){
			tj +=" and t.cs_dealdatetime>=to_date(?,'yyyy-mm-dd hh24:mi:ss') and t.cs_dealdatetime<=to_date(?,'yyyy-mm-dd hh24:mi:ss')";
			wlist.add(stime);
			wlist.add(etime);
		}else{
			tj +=" and trunc(t.cs_dealdatetime)=trunc(sysdate)";
		}
		if(!sldx.equals("")){
			tj +=" and t.cs_object = ?";
			wlist.add(sldx);
		}
		if(!cphm.equals("")){
			tj +=" and t.cs_vehiid like ?";
			wlist.add("%"+cphm+"%");
		}
		if(!dhhm.equals("")){
			tj +=" and t.cs_telnum like ?";
			wlist.add("%"+dhhm+"%");
		}
		if(!clgh.equals("")){
			tj +=" and t.cs_workernum = ?";
			wlist.add(clgh);
		}
		if(!fwnr.equals("")){
			tj +=" and t.cs_memo like ?";
			wlist.add("%"+fwnr+"%");
		}
		if(!clzt.equals("")){
			tj +=" and t.cs_state= ?";
			wlist.add(clzt);
		}
		String sql = "select * from tb_consultation t where 1=1 "+tj+" order by t.cs_dealdatetime desc";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,wlist.toArray());
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("CS_DEALDATETIME", m.get("CS_DEALDATETIME").toString().substring(0, 19));
		}
		return jacksonUtil.toJson(list);
	}
	
	public List<Map<String, Object>> findallzx_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
//		System.out.println(postData);
		String ids = String.valueOf(paramMap.get("ids"));
		String sql = "select * from tb_consultation t where cs_id in ("+ids+") order by t.cs_dealdatetime desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("CS_DEALDATETIME", m.get("CS_DEALDATETIME").toString().substring(0, 19));
		}
		return list;
	}

//	public List<Map<String, Object>> findallzx_daochu(String postData) {
//		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
//		String cphm = String.valueOf(paramMap.get("cphm"));
//		String dhhm = String.valueOf(paramMap.get("dhhm"));
//		String clgh = String.valueOf(paramMap.get("clgh"));
//		String fwnr = String.valueOf(paramMap.get("fwnr"));
//		String tj="";
//		if(!cphm.equals("")){
//			tj +=" and t.cs_vehiid like '%"+cphm+"%'";
//		}
//		if(!dhhm.equals("")){
//			tj +=" and t.cs_telnum like '%"+dhhm+"%'";
//		}
//		if(!clgh.equals("")){
//			tj +=" and t.cs_workernum = '"+clgh+"'";
//		}
//		if(!fwnr.equals("")){
//			tj +=" and t.cs_memo like '%"+fwnr+"%'";
//		}
//		String sql = "select * from tb_consultation t where to_char(t.cs_dealdatetime,'yyyy-dd-mm')=to_char(sysdate,'yyyy-dd-mm') "+tj+" order by t.cs_dealdatetime desc";
//		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		for (int i = 0; i < list.size(); i++) {
//			Map<String, Object> m = list.get(i);
//			m.put("CS_DEALDATETIME", m.get("CS_DEALDATETIME").toString().substring(0, 19));
//		}
//		return list;
//	}
	
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
		String tslx = String.valueOf(paramMap.get("tslx"));
		String fwnr = String.valueOf(paramMap.get("fwnr"));
		String comp = String.valueOf(paramMap.get("comp"));
		String clzt = String.valueOf(paramMap.get("clzt"));

		String sql = "update tb_consultation t set CS_TELNUM=?,CS_CLIENT=?,CS_STATE=?,CS_TYPE=?,CS_VEHIID=?,CS_MEMO=?,CS_OBJECT=?,CS_TSLX=?,COMPANY=? where CS_ID=?";
		int a = jdbcTemplate.update(sql, ldhm,khxm,clzt,cllx,cphm,fwnr,cldx,tslx,comp,ywbh);
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
//		System.out.println(data.getZxvehilist().size()+"  99999999");
		if(null != data){
			result.put("zxvehilist", data.getZxvehilist());
			result.put("lovecls", data.getLovelist());
			result.put("num", data.getNum());
			result.put("yjccl", data.getYjcvehino());
			result.put("gzlist", data.getGzlist());
		}
		return jacksonUtil.toJson(result);
	}

	public String queryaxddorder(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = paramMap.get("stime").toString();
		String etime = paramMap.get("etime").toString();
		String dh = paramMap.get("dh").toString();
		String cp = paramMap.get("cp").toString();
		String bh = paramMap.get("bh").toString();
		String dz = paramMap.get("dz").toString();
		String cxtj="";
		if(!dh.equals("")){
			cxtj = " and t.cust_tel like '%"+dh+"%'";
		}
		if(!cp.equals("")){
			cxtj = " and (t.vehi_no1 like '%"+cp+"%' or t.vehi_no2 like '%"+cp+"%' or t.vehi_no3 like '%"+cp+"%')";
		}
		if(!bh.equals("")){
			cxtj = " and t.disp_id = '"+bh+"'";
		}
		if(!dz.equals("")){
			cxtj = " and (t.address like '%"+dz+"%' or t.dest_address like '%"+dz+"%' or t.disp_state like '%"+dz+"%' or t.note like '%"+dz+"%' or t.szqy like '%"+dz+"%')";
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
//		String sql ="select t.*,t1.vehi_sim,t1.comp_name,to_char(t.disp_time,'hh24:mi:ss') sfm from tb_dispatch_love t"
//						+" left join vw_vehicle t1 on t.VEHI_NO=t1.VEHI_NO where 1=1 "
//						//+ "and t.disp_type='电话约车'"
//						+ ""+cxtj
//						+" and t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')  and t.ddqy='爱心出租(人工)' order by t.disp_time";
////						+" and t.disp_time>sysdate-60/24/60 order by t.disp_id desc";

		String sql ="select t.*,to_char(t.disp_time,'hh24:mi:ss') sfm from tb_dispatch_love t"
						+" where t.DEL_FLAG='0' "
						+ ""+cxtj
						+" and t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')  and t.ddqy='爱心出租(人工)' order by t.disp_time";

//				System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		Map<String, Object> resultlist=new HashMap<String, Object>();
		List<Map<String, Object>> zzddlist=new ArrayList<Map<String, Object>>();//正在调度
		List<Map<String, Object>> rwclist=new ArrayList<Map<String, Object>>();//任务车监控
		int zzddxh=0,rwcxh=0;
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			zzddxh++;
			m.put("ZZDDXH", zzddxh);
			zzddlist.add(m);
		}
		resultlist.put("zzdd", zzddlist);
//		resultlist.put("rwc", rwclist);
		return jacksonUtil.toJson(resultlist);
	}

	public String qxaxddorder(String postData) {
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>() {});
		String ids = paramMap.get("ids").toString();
		String QXDDLX = paramMap.get("QXDDLX").toString();
		String QXDDYY = paramMap.get("QXDDYY").toString();
		String sql = "update tb_dispatch_love set disp_state='调度取消',QXDDLX=?,QXDDYY=? where disp_id in ("+ids+")";
		int a = jdbcTemplate.update(sql,QXDDLX,QXDDYY);
		Map<String,Object> result = new HashMap();
		if(a>0){
			result.put("msg","1");
		}else{
			result.put("msg","0");
		}
		return jacksonUtil.toJson(result);
	}

	public String editaxddorder(String postData) {
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>() {});
		String ids = paramMap.get("ids").toString();
		String khxm = paramMap.get("khxm").toString();
		String khdh = paramMap.get("khdh").toString();
		String vehino1 = paramMap.get("vehino1").toString();
		String simnum1 = paramMap.get("simnum1").toString();
		String sjdh1 = paramMap.get("sjdh1").toString();
		String compname1 = paramMap.get("compname1").toString();
		String vehino2 = paramMap.get("vehino2").toString();
		String simnum2 = paramMap.get("simnum2").toString();
		String sjdh2 = paramMap.get("sjdh2").toString();
		String compname2 = paramMap.get("compname2").toString();
		String vehino3 = paramMap.get("vehino3").toString();
		String simnum3 = paramMap.get("simnum3").toString();
		String sjdh3 = paramMap.get("sjdh3").toString();
		String compname3 = paramMap.get("compname3").toString();

		String sql = "update tb_dispatch_love set cust_name=?,cust_tel=?," +
				"vehi_no1=?,sim_num1=?,sjdh1=?,comp_name1=?," +
				"vehi_no2=?,sim_num2=?,sjdh2=?,comp_name2=?," +
				"vehi_no3=?,sim_num3=?,sjdh3=?,comp_name3=?" +
				" where disp_id in ("+ids+")";
		int a = jdbcTemplate.update(sql,khxm,khdh,vehino1,simnum1,sjdh1,compname1,vehino2,simnum2,sjdh2,compname2,vehino3,simnum3,sjdh3,compname3);
		Map<String,Object> result = new HashMap();
		if(a>0){
			result.put("msg","1");
		}else{
			result.put("msg","0");
		}
		return jacksonUtil.toJson(result);
	}

	public String delaxddorder(String postData) {
		System.out.println(postData);
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>() {});
		String ids = paramMap.get("ids").toString();
		String sql = "update tb_dispatch_love set del_flag='1' where disp_id in ("+ids+")";
		int a = jdbcTemplate.update(sql);
		Map<String,Object> result = new HashMap();
		if(a>0){
			result.put("msg","1");
		}else{
			result.put("msg","0");
		}
		return jacksonUtil.toJson(result);
	}
	public String pjaxddorder(String postData) {
		System.out.println(postData);
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>() {});
		String DISP_ID = paramMap.get("DISP_ID").toString();
		String CK_MYD = paramMap.get("CK_MYD").toString();
		String CK_PJ = paramMap.get("CK_PJ").toString();
		String SJ_MYD = paramMap.get("SJ_MYD").toString();
		String SJ_PJ = paramMap.get("SJ_PJ").toString();
//		String CK_PJSJ="";
//		String SJ_PJSJ="";
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//		if(!"".equals(CK_MYD)){
//			CK_PJSJ=sdf.format(new Date());
//		}
//		if(!"".equals(SJ_MYD)){
//			SJ_PJSJ=sdf.format(new Date());
//		}
		String sql = "update tb_dispatch_love set CK_MYD=?,CK_PJ=?,SJ_MYD=?,SJ_PJ=? where disp_id=?";
		int a = jdbcTemplate.update(sql,CK_MYD,CK_PJ,SJ_MYD,SJ_PJ,DISP_ID);
		Map<String,Object> result = new HashMap();
		if(a>0){
			result.put("msg","1");
		}else{
			result.put("msg","0");
		}
		return jacksonUtil.toJson(result);
	}

	public String axkcdata() {
		DataItem data = (DataItem) GisData.map.get("data");
		Map<String, Object> result = new HashMap<String, Object>();
		if(null != data){
			result.put("axvehilist", data.getAxvehilist());
			result.put("lovecls", data.getLovelist());
			result.put("axnum", data.getAxnum());
		}
		return jacksonUtil.toJson(result);
	}
	public String queryCompByVehino(String cp) {
	    String sql="select t.*,c.TMC_ID from VW_VEHICLE t LEFT JOIN TB_MOTORCADE_CARS c on t.VEHI_NO=c.VEHI_NO and c.tm_id='1' where t.VEHI_NO=?";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,cp.toUpperCase());
//        Vehicle vehi = new Vehicle();
        Map<String, Object> m = new HashMap<String, Object>();
        if(list.size()>0){
        	if(list.get(0).get("TMC_ID")==null){
        		m.put("result","1");
			}else{
        		m.put("result","2");
			}
        	m.put("compname",list.get(0).get("COMP_NAME").toString());
        	m.put("vehino",list.get(0).get("VEHI_NO").toString());
        	m.put("simnum",list.get(0).get("MDT_NO").toString());
		}else{
        	m.put("result","0");
		}
        return jacksonUtil.toJson(m);
    }
	public String axdd(String postData){
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String DEST_ADDRESS = paramMap.get("DESP_ADDRESS").toString();
        String DISP_USER = paramMap.get("DISP_USER").toString();

        String NOTE = paramMap.get("NOTE").toString();

        String ADDRESS = paramMap.get("ADDRESS").toString();
        String ADDRESS_REF = paramMap.get("ADDRESS_REF").toString();
        String CUST_NAME = paramMap.get("CUST_NAME").toString();
        String CUST_TEL = paramMap.get("CUST_TEL").toString();
        String LONGTI = paramMap.get("LONGTI").toString();
        String LATI = paramMap.get("LATI").toString();
        String QQ_ID = paramMap.get("QQ_ID").toString();
        List<String> YC_TIME = (List<String>) paramMap.get("YC_TIME");
        String SZQY = paramMap.get("SZQY").toString();
        String DDQY = paramMap.get("DDQY").toString();
        String JSYXM = paramMap.get("JSYXM").toString();


        String VEHI_NO1 = paramMap.get("VEHI_NO1").toString();
         String SIM_NUM1 = paramMap.get("SIM_NUM1").toString();
         String COMP_NAME1 = paramMap.get("COMP_NAME1").toString();
         String SJDH1 = paramMap.get("SJDH1").toString();

        String VEHI_NO2 = paramMap.get("VEHI_NO2").toString();
         String SIM_NUM2 = paramMap.get("SIM_NUM2").toString();
         String COMP_NAME2 = paramMap.get("COMP_NAME2").toString();
         String SJDH2 = paramMap.get("SJDH2").toString();

        String VEHI_NO3 = paramMap.get("VEHI_NO3").toString();
         String SIM_NUM3 = paramMap.get("SIM_NUM3").toString();
         String COMP_NAME3 = paramMap.get("COMP_NAME3").toString();
         String SJDH3 = paramMap.get("SJDH3").toString();

         String YCMS = paramMap.get("YCMS").toString();
         String TSRQ = paramMap.get("TSRQ").toString();
         String PTQK = paramMap.get("PTQK").toString();
         String YCXQ = paramMap.get("YCXQ").toString();

         Map<String,Object> result = new HashMap<java.lang.String, Object>();

		for (int i = 0; i < YC_TIME.size(); i++) {
			String DISP_TIME = YC_TIME.get(i);
			String cisql = "insert into TB_CUSTOMER_INFO(CI_NAME,CI_TEL,ADDRES_REF,ADDRESS,LONGI,LATI,REC_TIME,NOTE,DEST_ADDRESS,CI_GRADE,QQ_ID,SZQY) values" +
					" (?,?,?,?,?,?,to_date(?,'yyyy-mm-dd HH24:mi:ss'),?,?,?,?,?)";
			int a = jdbcTemplate.update(cisql, CUST_NAME, CUST_TEL, ADDRESS_REF, ADDRESS, LONGTI, LATI, DISP_TIME, NOTE, DEST_ADDRESS, "普通", QQ_ID, SZQY);
			if (a == 1) {
				String ciidsql = "select ci_id from TB_CUSTOMER_INFO t where t.ci_tel=? ORDER BY REC_TIME DESC";
				List<Map<String, Object>> ciidList = jdbcTemplate.queryForList(ciidsql, CUST_TEL);
				String CI_ID = ciidList.get(0).get("CI_ID").toString();
//				String table = "tb_dispatch_" + DISP_TIME.substring(2, 4) + DISP_TIME.substring(5, 7);
				String dispsql = "insert into tb_dispatch_love (CI_ID,DEST_ADDRESS,DISP_USER,DISP_STATE,DISP_TYPE,DISP_TIME," +
						"NOTE,ADDRESS,ADDRESS_REF,CUST_NAME,CUST_TEL,LONGTI,LATI,YEWU_TYPE,QQ_NUMBER,CALL_STATE," +
						"AUTOOUTPHONE,OUTPHONE,QQ_ID,SFYY,YC_TIME,SZQY,DDQY,VEHI_NO1,SIM_NUM1,COMP_NAME1,SJDH1" +
						",VEHI_NO2,SIM_NUM2,COMP_NAME2,SJDH2" +
						",VEHI_NO3,SIM_NUM3,COMP_NAME3,SJDH3" +
						",YCMS,TSRQ,PTQK,YCXQ,JSYXM) values (" +
						"?,?,?,?,?," +
						"to_date(?,'yyyy-mm-dd HH24:mi:ss'),?,?,?,?,?," +
						"?,?,?,?,?,?," +
						"?,?,?,to_date(?,'yyyy-mm-dd HH24:mi:ss'),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
				int b = jdbcTemplate.update(dispsql, CI_ID, DEST_ADDRESS, DISP_USER, "调度完成", "电话约车", DISP_TIME, NOTE,
						ADDRESS, ADDRESS_REF, CUST_NAME, CUST_TEL, LONGTI, LATI, "0", "0", "255", "0", CUST_TEL, QQ_ID, "0",
						DISP_TIME, SZQY, DDQY,VEHI_NO1,SIM_NUM1,COMP_NAME1,SJDH1,VEHI_NO2,SIM_NUM2,COMP_NAME2,SJDH2,VEHI_NO3,SIM_NUM3,COMP_NAME3,SJDH3,YCMS,TSRQ,PTQK,YCXQ,JSYXM);
				if (b != 1) {
					String hgsql = "delete from TB_CUSTOMER_INFO where ci_id=?";
					jdbcTemplate.update(hgsql, CI_ID);
					result.put("error", "1");
					result.put("etime", DISP_TIME);
					return jacksonUtil.toJson(result);
				}
			}
		}
		result.put("error", "0");
		return jacksonUtil.toJson(result);
	}
	public String findclxx(String mdtno) {
	    String sql="select * from VW_VEHI_MDT t where t.MDT_NO='"+mdtno+"'";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//        Vehicle vehi = new Vehicle();
        Map<String, Object> m = new HashMap<String, Object>();
        
        
        for (int i = 0; i < list.size(); i++) {
            m.put("compname", list.get(i).get("COMP_NAME").toString());
            m.put("vehino", list.get(i).get("VEHI_NO").toString());
            m.put("simka", list.get(i).get("SIM_NUM")==null?"":list.get(i).get("SIM_NUM").toString());
            m.put("cartype", list.get(i).get("VT_NAME")==null?"":list.get(i).get("VT_NAME").toString());
            m.put("vehisim", list.get(i).get("VEHI_SIM")==null?"":list.get(i).get("VEHI_SIM").toString());
            m.put("ownname", list.get(i).get("OWN_NAME")==null?"":list.get(i).get("OWN_NAME").toString());
            m.put("owntel", list.get(i).get("OWN_TEL")==null?"":list.get(i).get("OWN_TEL").toString());
            m.put("color", list.get(i).get("VC_NAME")==null?"":list.get(i).get("VC_NAME").toString());
            m.put("mtname", list.get(i).get("MT_NAME")==null?"":list.get(i).get("MT_NAME").toString());
            m.put("qk", list.get(i).get("OWNER_NAME")==null?"":list.get(i).get("OWNER_NAME").toString());
            m.put("dispnum", list.get(i).get("DISP_NUM")==null?"":list.get(i).get("DISP_NUM").toString());
            m.put("complnum", list.get(i).get("COMPL_NUM")==null?"":list.get(i).get("COMPL_NUM").toString());
            m.put("jfzs", list.get(i).get("INTEGRAL")==null?"":list.get(i).get("INTEGRAL").toString());
            m.put("MDT_SUB_TYPE", list.get(i).get("MDT_SUB_TYPE")==null?"":list.get(i).get("MDT_SUB_TYPE").toString());
        }
        return jacksonUtil.toJson(m);
    }

    public void xxck(String postData)
    {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String isu = String.valueOf(paramMap.get("isu"));
        String content = String.valueOf(paramMap.get("content"));
        String [] isus = isu.split(",");
        String idSql  = "select max(oadx_id) as oadx_id from tb_oa_duanxin t where length(oadx_id)=8";
        List<Map<String, Object>> resultList = jdbcTemplate.queryForList(idSql);
        int id = Integer.valueOf(String.valueOf(resultList.get(0).get("oadx_id")));
        id = id+100;
        for (int i = 0; i < isus.length; i++)
        {
            id++;
            String sql = "insert into TB_OA_DUANXIN(oadx_id,sim_no,rec_time,content,status) values ('"+id+"','"+isus[i]+"',sysdate,'"+content+"','短信下发')";
            jdbcTemplate.update(sql);
        }
        
    }

	public String findyhq(String num) {
		String sql = "select id,coupon_num from tb_yhq t where is_use=0 and is_yx=0 and coupon_num like '%"+num+"%'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public boolean queryYhq(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String yhq = String.valueOf(paramMap.get("yhq"));
		if("".equals(yhq)){
			return true;
		}
		String sql = "select * from tb_yhq t where is_use=0 and is_yx=0 and coupon_num='"+yhq+"'";
		//String sql = "update tb_yhq t where t.is_use=1 where coupon_num='"+yhq+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		int a = jdbcTemplate.update(sql);
		if(list.size()==1){
			return true;
		}else{
			return false;
		}
	}

	public String updateYhqIsuse(String dispid) {
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		String sql = "update tb_yhq t set t.is_use=1 where coupon_num=(select t.yhq from tb_dispatch_"+db+" t where t.disp_id='"+dispid+"')";
		int a = jdbcTemplate.update(sql);
		return "";
	}

	public String findaxddfjcl(java.lang.String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		double lng1 = Double.parseDouble(String.valueOf(paramMap.get("lo")));
		double lat1 = Double.parseDouble(String.valueOf(paramMap.get("la")));
		DecimalFormat df = new DecimalFormat("0.00");
		String sql = "select t3.* "+//VEHI_NO,PX,PY,STIME,SPEED,STATE,VEHI_SIM,ANGLE,MT_NAME,VT_NAME,OWN_TEL,COMP_NAME, OWNER_NAME,OWN_NAME,DISP_NUM,INTEGRAL,COMPL_NUM " +
				"from TB_MOTORCADE_CARS t1,TB_MOTORCADE t2,vw_vehi_mdt t3 " +
				"where t1.tm_id=t2.tm_id and t2.tm_name='爱心出租' and t1.vehi_no=t3.vehi_no and t3.stime>=sysdate-1/24/60*5 " +
				"order by abs(6371.004 * acos(sin("+lat1+") *sin(t3.py) * cos("+lng1+" - t3.px) +cos("+lat1+") * cos(t3.py)) * acos(-1) / 180)";
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		for (int i = 0; i < list.size(); i++) {
			double lng2 = Double.parseDouble(list.get(i).get("PX").toString());
			double lat2 = Double.parseDouble(list.get(i).get("PY").toString());
			double distance = MapUtils.getDistance(lng1,lat1,lng2,lat2);
			list.get(i).put("RWCXH",i+1);
			list.get(i).put("JL",df.format(distance) + "公里");
			result.add(list.get(i));
			if(i==9){
				break;
			}
		}
		return jacksonUtil.toJson(result);
	}

	public String zxrgaxdd(String postData) {
		System.out.println(postData);
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>() {
		});
		String dispid = String.valueOf(paramMap.get("dispid"));
		String cp = String.valueOf(paramMap.get("cp"));
		String yhq = String.valueOf(paramMap.get("yhq"));
		String mdtno = String.valueOf(paramMap.get("mdtno"));
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyMM");
		String db = sdf1.format(new Date());
		String sql = "update tb_dispatch_" + db + " t set t.disp_state='调度完成',t.vehi_no='" + cp + "',t.sim_num='" + mdtno + "' where t.disp_id='" + dispid + "'";
		int a = jdbcTemplate.update(sql);
		if (a == 1) {
			String sql1 = "update tb_yhq t set t.is_use=1 where coupon_num=(select t.yhq from tb_dispatch_"+db+" t where t.disp_id='"+dispid+"')";
			jdbcTemplate.update(sql1);
			return "{\"msg\":\"1\"}";
		} else {
			return "{\"msg\":\"0\"}";
		}
	}


	public String findTsmb() {
		String sql = "select * from tb_tsmb";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public String delTsmb(java.lang.String tsmbid) {
		String sql = "delete from tb_tsmb where mbid=?";
		int a = jdbcTemplate.update(sql,tsmbid);
		if (a == 1) {
			return "{\"msg\":\"1\"}";
		} else {
			return "{\"msg\":\"0\"}";
		}

	}

	public String addTsmb(String postData) {
		Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>() {});
		String type = String.valueOf(paramMap.get("type"));
		String content = String.valueOf(paramMap.get("content"));
		String sql = "insert into tb_tsmb(type,content) values (?,?)";
		int a = jdbcTemplate.update(sql,type,content);
		if (a == 1) {
			return "{\"msg\":\"1\"}";
		} else {
			return "{\"msg\":\"0\"}";
		}
	}
}
