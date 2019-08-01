package mvc.service;

import helper.JacksonUtil;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
public class KbServer {
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

	public String test(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gsmc = String.valueOf(paramMap.get("gsmc"));
		Map<String, Object> resultmap = new HashMap<String, Object>();
		return jacksonUtil.toJson(resultmap);
	}

	public String ywqk() {
		String sql = "select t.OWNER_ID,t.OWNER_NAME from tb_owner t";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		for (int i = 0; i < list.size(); i++) {
//			Map<String, Object> m = list.get(i);
//			m.put("id", m.get("OWNER_ID").toString());
//			m.put("name", m.get("OWNER_NAME").toString());
//		}
		return jacksonUtil.toJson(list);
	}

	public String zdlx() {
//		String sql = "select t.SUBID,t.SUB_NAME from tb_mdt_sub_type t";
		String sql = "select t.mt_name SUB_NAME from VW_VEHICLE t group by t.mt_name";
		
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		for (int i = 0; i < list.size(); i++) {
//			Map<String, Object> m = list.get(i);
//			m.put("id", m.get("MT_ID").toString());
//			m.put("name", m.get("MT_NAME").toString());
//		}
		return jacksonUtil.toJson(list);
	}

	public String cllx() {
		String sql = "select t.VT_ID,t.VT_NAME from TB_VEHI_TYPE t";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		for (int i = 0; i < list.size(); i++) {
//			Map<String, Object> m = list.get(i);
//			m.put("id", m.get("VT_ID").toString());
//			m.put("name", m.get("VT_NAME").toString());
//		}
		return jacksonUtil.toJson(list);
	}

	public String company() {
		String sql = "select distinct(t.fgs) COMP_NAME from jjq_company t";
		List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String company3() {
		String sql = "select comp_id,comp_name from tb_company t";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String company2(String keyword) {
		String sql = "select t.COMP_ID,t.COMP_NAME from TB_COMPANY t where t.comp_name like '%"+keyword+"%'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String simka(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String keyword = String.valueOf(paramMap.get("keyword"));
		String sql = "select t.sim_num from TB_VEHICLE t where t.comp_id = '"+keyword+"' order by t.sim_num";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public String vehino(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String keyword = String.valueOf(paramMap.get("keyword"));
		String sql = "select t.vehi_no from vw_VEHICLE t where t.comp_id = '"+keyword+"' order by t.vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String vehino2(String keyword) {
		String sql = "select t.cphm from jjq_company t where t.cphm like '%"+keyword+"%' order by t.cphm";
		List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String vsimka(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String keyword = String.valueOf(paramMap.get("keyword"));
		String sql = "select t.vsim_num from TB_VEHICLE t where t.comp_id = '"+keyword+"' and t.vsim_num is not null group by t.vsim_num";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public String querycl(String postData) {
//		System.out.println(postData);
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ywqk = String.valueOf(paramMap.get("ywqk"));
		String zdlx = String.valueOf(paramMap.get("zdlx"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String gs = String.valueOf(paramMap.get("gs"));
		String simka = String.valueOf(paramMap.get("simka"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String cp = String.valueOf(paramMap.get("cp"));
		String xnk = String.valueOf(paramMap.get("xnk"));
		String cxtj="";
		if(!ywqk.equals("")){
			cxtj+=" and t.owner_name='"+ywqk+"'";
		}
		if(!zdlx.equals("")){
			cxtj+=" and t.mt_name='"+zdlx+"'";
		}
		if(!cllx.equals("")){
			cxtj+=" and t.vt_name='"+cllx+"'";
		}
		if(!gs.equals("")){
			cxtj+=" and t.comp_name='"+gs+"'";
		}
		if(!simka.equals("")){
			cxtj+=" and t.vehi_sim='"+simka+"'";
		}
		if(!gjz.equals("")){
			cxtj+=" and (t.vehi_no like '%"+gjz+"%' or t.vehi_sim like '%"+gjz+"%' or t.comp_name like '%"+gjz+"%')";
		}
		if(!cp.equals("")){
			cxtj+=" and t.vehi_no='"+cp+"'";
		}
//		if(!xnk.equals("")){
//			cxtj+=" and t1.vsim_num='"+xnk+"'";
//		}
		String sql = "select * from vw_vehicle t where 1=1"+cxtj+" order by t.vehi_no";
		Map<String, Object> result =new HashMap<String,Object>();
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		result.put("data", list);
		return jacksonUtil.toJson(result);
	}
	
	public List<Map<String, Object>> querycl_daochu(String postData) {
//		System.out.println(postData);
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ywqk = String.valueOf(paramMap.get("ywqk"));
		String zdlx = String.valueOf(paramMap.get("zdlx"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String gs = String.valueOf(paramMap.get("gs"));
		String simka = String.valueOf(paramMap.get("simka"));
		String gjz = String.valueOf(paramMap.get("gjz"));
		String cp = String.valueOf(paramMap.get("cp"));
		String xnk = String.valueOf(paramMap.get("xnk"));
		String cxtj="";
		if(!ywqk.equals("")){
			cxtj+=" and t.owner_name='"+ywqk+"'";
		}
		if(!zdlx.equals("")){
			cxtj+=" and t.mt_name='"+zdlx+"'";
		}
		if(!cllx.equals("")){
			cxtj+=" and t.vt_name='"+cllx+"'";
		}
		if(!gs.equals("")){
			cxtj+=" and t.comp_name='"+gs+"'";
		}
		if(!simka.equals("")){
			cxtj+=" and t.vehi_sim='"+simka+"'";
		}
		if(!gjz.equals("")){
			cxtj+=" and (t.vehi_no like '%"+gjz+"%' or t.vehi_sim like '%"+gjz+"%' or t.comp_name like '%"+gjz+"%')";
		}
		if(!cp.equals("")){
			cxtj+=" and t.vehi_no='"+cp+"'";
		}
		String sql = "select * from vw_vehicle t where 1=1"+cxtj+" order by t.vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("INST_TIME", m.get("INST_TIME")==null?"":m.get("INST_TIME").toString().substring(0, 19));
			m.put("SIM_TIME", m.get("SIM_TIME")==null?"":m.get("SIM_TIME").toString().substring(0, 19));
		}
		return list;
	}
	
	public String querydh(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String khmz = String.valueOf(paramMap.get("dhkhmz"));
		String sql="select * from tb_address_book t where t.cust_name like '%"+khmz+"%' or t.cust_tel like '%"+khmz+"%' or t.cust_addr like '%"+khmz+"%'  or t.note like '%"+khmz+"%'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		Map<String, Object> resultmap = new HashMap<String, Object>();
//		resultmap.put("data", list);
		return jacksonUtil.toJson(list);
	}
	public String findonedh(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String id = String.valueOf(paramMap.get("id"));
		String sql="select * from tb_address_book t where t.ab_id = '"+id+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		Map<String, Object> resultmap = new HashMap<String, Object>();
//		resultmap.put("data", list);
		return jacksonUtil.toJson(list.get(0));
	}
	public int adddh(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String khmz = String.valueOf(paramMap.get("hkmz"));
		String khdh = String.valueOf(paramMap.get("khdh"));
		String khdz = String.valueOf(paramMap.get("khdz"));
		String khbz = String.valueOf(paramMap.get("khbz"));
		String sql="insert into tb_address_book t (cust_name,cust_tel,cust_addr,note)"
				+ " values('"+khmz+"','"+khdh+"','"+khdz+"','"+khbz+"')";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public int editdh(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String khmz = String.valueOf(paramMap.get("hkmz"));
		String khdh = String.valueOf(paramMap.get("khdh"));
		String khdz = String.valueOf(paramMap.get("khdz"));
		String khbz = String.valueOf(paramMap.get("khbz"));
		String id = String.valueOf(paramMap.get("id"));
		String sql="update tb_address_book t "
				+ "set t.cust_name='"+khmz+"',"
				+ "t.cust_tel='"+khdh+"',"
				+ "t.cust_addr='"+khdz+"',"
				+ "t.note='"+khbz+"'"
				+ " where t.ab_id='"+id+"'";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public int deldh(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ids = String.valueOf(paramMap.get("id"));
		String sql="delete tb_address_book t "
				+ " where t.ab_id in ("+ids.substring(0,ids.length()-1)+")";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public String queryjl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String jlcxgjz = String.valueOf(paramMap.get("jlcxgjz"));
		String sql="select * from tb_distance t where t.city like '%"+jlcxgjz+"%' or t.distance like '%"+jlcxgjz+"%' or t.fee like '%"+jlcxgjz+"%' or t.note like '%"+jlcxgjz+"%'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String findonejl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String id = String.valueOf(paramMap.get("id"));
		String sql="select * from tb_distance t where t.dis_id = '"+id.substring(0, id.length()-1)+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		Map<String, Object> resultmap = new HashMap<String, Object>();
//		resultmap.put("data", list);
		return jacksonUtil.toJson(list.get(0));
	}
	public int addjl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String city = String.valueOf(paramMap.get("city"));
		String distance = String.valueOf(paramMap.get("distance"));
		String fee = String.valueOf(paramMap.get("fee"));
		String note = String.valueOf(paramMap.get("note"));
		String sql="insert into tb_distance t (CITY,DISTANCE,FEE,NOTE)"
				+ " values('"+city+"','"+distance+"','"+fee+"','"+note+"')";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public int editjl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String city = String.valueOf(paramMap.get("city"));
		String distance = String.valueOf(paramMap.get("distance"));
		String fee = String.valueOf(paramMap.get("fee"));
		String note = String.valueOf(paramMap.get("note"));
		String id = String.valueOf(paramMap.get("id"));
		String sql="update tb_distance t "
				+ "set t.city='"+city+"',"
				+ "t.distance='"+distance+"',"
				+ "t.fee='"+fee+"',"
				+ "t.note='"+note+"'"
				+ " where t.dis_id='"+id.substring(0,id.length()-1)+"'";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public int deljl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ids = String.valueOf(paramMap.get("id"));
		String sql="delete tb_distance t "
				+ " where t.dis_id in ("+ids.substring(0,ids.length()-1)+")";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public String queryyw(String postData) {
//		System.out.println(postData);
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ywbh = String.valueOf(paramMap.get("ywbh"));
		String pcch = String.valueOf(paramMap.get("pcch"));
		String zdlx = String.valueOf(paramMap.get("zdlx"));
		String khdh = String.valueOf(paramMap.get("khdh"));
		String ddzt = String.valueOf(paramMap.get("ddzt"));
		String yclx = String.valueOf(paramMap.get("yclx"));
		String khxm = String.valueOf(paramMap.get("khxm"));
		String ssgs = String.valueOf(paramMap.get("ssgs"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String xxdz = String.valueOf(paramMap.get("xxdz"));
		String ddygh = String.valueOf(paramMap.get("ddygh"));
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		String whzt = String.valueOf(paramMap.get("whzt"));
		String jkygh = String.valueOf(paramMap.get("jkygh"));
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String szqy = String.valueOf(paramMap.get("szqy"));

		String ddlx = String.valueOf(paramMap.get("ddlx"));
		String db = stime.substring(2, 4)+stime.substring(5, 7);
		String cxtj="";
		if(!ywbh.equals("")){
			cxtj +=" and t.disp_id like '%"+ywbh+"%'";
		}
		if(!pcch.equals("")){
			cxtj +=" and t.vehi_no like '%"+pcch+"%'";
		}
		if(!khdh.equals("")){
			cxtj +=" and t.cust_tel like '%"+khdh+"%'";
		}
		if(!ddzt.equals("")){
			cxtj +=" and t.disp_state like '%"+ddzt+"%'";
		}
		if(!yclx.equals("")){
			cxtj +=" and t.disp_type like '%"+yclx+"%'";
		}
		if(!whzt.equals("-1")){
			cxtj +=" and t.call_state = '"+whzt+"'";
		}
		if(!khxm.equals("")){
			cxtj +=" and t.cust_name like '%"+khxm+"%'";
		}
		if(!cllx.equals("")){
			cxtj +=" and t.cust_vehi_type like '%"+cllx+"%'";
		}
		if(!xxdz.equals("")){
			cxtj +=" and t.address like '%"+xxdz+"%'";
		}
		if(!ddygh.equals("")){
			cxtj +=" and t.disp_user like '%"+ddygh+"%'";
		}
		if(!jkygh.equals("")){
			cxtj +=" and t.error_user like '%"+jkygh+"%'";
		}
		if(!cxgjz.equals("")){
			cxtj +=" and (t.disp_id like '%"+cxgjz+"%' or t.vehi_no like '%"+cxgjz+"%' or t.cust_tel like '%"+cxgjz+"%' or t.cust_name like '%"+cxgjz+"%')";
		}
		if(ddlx.equals("1")){
		    cxtj +=" and (t.YEWU_TYPE='0' or t.YEWU_TYPE is null)";
		}else if(ddlx.equals("2")){
		    cxtj +=" and t.YEWU_TYPE='1'";
		}else if(ddlx.equals("3")){
			cxtj +=" and t.DDQY='爱心出租'";
		}

		if(!szqy.equals("")){
			cxtj +=" and t.SZQY='"+szqy+"'";
		}
		List<String> yfs = kyset(stime,etime);
		List<Map<String, Object>> result =new ArrayList<Map<String,Object>>();
		
		for (int i = 0; i < yfs.size(); i++)
        {
//		    System.out.println(yfs.get(i));
            String tb = "tb_dispatch_"+yfs.get(yfs.size()-1-i);
            String sql = "select t.* from "+tb+" t where t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.disp_time desc";
            if(!zdlx.equals("")||!ssgs.equals("")){
                sql = "select t.*,t1.comp_name gsmc,t1.mt_name zdlx from "+tb+" t,vw_vehicle t1 where t.vehi_no=t1.vehi_no and t1.comp_name like '%"+ssgs+"%' and t1.mt_name like '%"+zdlx+"%' and t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.disp_time desc";
            }else{
                sql = "select tt.*,t1.comp_name gsmc,t1.mt_name zdlx from ("+sql+") tt left join vw_vehicle t1 on tt.vehi_no=t1.vehi_no";
            }
//            System.out.println(sql);
            List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
            result.addAll(list);
        }
		return jacksonUtil.toJson(result);
	}
	
	public List<Map<String, Object>> queryyw_daochu(String postData) {
//		System.out.println(postData);
	    Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String ywbh = String.valueOf(paramMap.get("ywbh"));
        String pcch = String.valueOf(paramMap.get("pcch"));
        String zdlx = String.valueOf(paramMap.get("zdlx"));
        String khdh = String.valueOf(paramMap.get("khdh"));
        String ddzt = String.valueOf(paramMap.get("ddzt"));
        String yclx = String.valueOf(paramMap.get("yclx"));
        String khxm = String.valueOf(paramMap.get("khxm"));
        String ssgs = String.valueOf(paramMap.get("ssgs"));
        String cllx = String.valueOf(paramMap.get("cllx"));
        String xxdz = String.valueOf(paramMap.get("xxdz"));
        String ddygh = String.valueOf(paramMap.get("ddygh"));
        String cxgjz = String.valueOf(paramMap.get("cxgjz"));
        String whzt = String.valueOf(paramMap.get("whzt"));
        String jkygh = String.valueOf(paramMap.get("jkygh"));
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));

		String szqy = String.valueOf(paramMap.get("szqy"));
        String ddlx = String.valueOf(paramMap.get("ddlx"));
        String db = stime.substring(2, 4)+stime.substring(5, 7);
        String cxtj="";
        if(!ywbh.equals("")){
            cxtj +=" and t.disp_id like '%"+ywbh+"%'";
        }
        if(!pcch.equals("")){
            cxtj +=" and t.vehi_no like '%"+pcch+"%'";
        }
        if(!khdh.equals("")){
            cxtj +=" and t.cust_tel like '%"+khdh+"%'";
        }
        if(!ddzt.equals("")){
            cxtj +=" and t.disp_state like '%"+ddzt+"%'";
        }
        if(!yclx.equals("")){
            cxtj +=" and t.disp_type like '%"+yclx+"%'";
        }
        if(!whzt.equals("-1")){
            cxtj +=" and t.call_state = '"+whzt+"'";
        }
        if(!khxm.equals("")){
            cxtj +=" and t.cust_name like '%"+khxm+"%'";
        }
        if(!cllx.equals("")){
            cxtj +=" and t.cust_vehi_type like '%"+cllx+"%'";
        }
        if(!xxdz.equals("")){
            cxtj +=" and t.address like '%"+xxdz+"%'";
        }
        if(!ddygh.equals("")){
            cxtj +=" and t.disp_user like '%"+ddygh+"%'";
        }
        if(!jkygh.equals("")){
            cxtj +=" and t.error_user like '%"+jkygh+"%'";
        }
        if(!cxgjz.equals("")){
            cxtj +=" and (t.disp_id like '%"+cxgjz+"%' or t.vehi_no like '%"+cxgjz+"%' or t.cust_tel like '%"+cxgjz+"%' or t.cust_name like '%"+cxgjz+"%')";
        }
        if(ddlx.equals("1")){
			cxtj +=" and (t.YEWU_TYPE='0' or t.YEWU_TYPE is null)";
		}else if(ddlx.equals("2")){
			cxtj +=" and t.YEWU_TYPE='1'";
		}else if(ddlx.equals("3")){
			cxtj +=" and t.DDQY='爱心出租'";
		}

		if(!szqy.equals("")){
			cxtj +=" and t.SZQY='"+szqy+"'";
		}
        List<String> yfs = kyset(stime,etime);
        List<Map<String, Object>> result =new ArrayList<Map<String,Object>>();
        
        for (int i = 0; i < yfs.size(); i++)
        {
//          System.out.println(yfs.get(i));
            String tb = "tb_dispatch_"+yfs.get(yfs.size()-1-i);
            String sql = "select t.* from "+tb+" t where t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.disp_time desc";
            if(!zdlx.equals("")||!ssgs.equals("")){
                sql = "select t.*,t1.comp_name gsmc,t1.mt_name zdlx from "+tb+" t,vw_vehicle t1 where t.vehi_no=t1.vehi_no and t1.comp_name like '%"+ssgs+"%' and t1.mt_name like '%"+zdlx+"%' and t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.disp_time desc";
            }else{
                sql = "select tt.*,t1.comp_name gsmc,t1.mt_name zdlx from ("+sql+") tt left join vw_vehicle t1 on tt.vehi_no=t1.vehi_no";
            }
//            System.out.println(sql);
            List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
            result.addAll(list);
        }
		
		for (int i = 0; i < result.size(); i++) {
			Map<String, Object> m = result.get(i);
			String callstate = m.get("CALL_STATE").toString();
			String aotuoutphone = m.get("AUTOOUTPHONE").toString();
			m.put("CALL_STATE", formatTZZT(callstate));
			m.put("AUTOOUTPHONE", formatSFWB(aotuoutphone));
			m.put("DISP_TIME",m.get("DISP_TIME").toString().substring(0, 19));
		}
		return result;
	}
	
	
	private String formatTZZT(String d){
		if (d.equals("0"))
			return "通知成功";
		else if (d.equals("3"))
			return "外拨失败";
		else if (d.equals("5"))
			return "确认收到";
		else if (d.equals("7"))
			return "7";
		else if (d.equals("255"))
			return "未外呼";
		else
			return "";
		
	}
	private String formatSFWB(String d){
		if (d.equals("0"))
			return "否";
		else if (d.equals("1"))
			return "是";
		else
			return "是";
	}
	
	public String querykhxx(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		String cxtj="";
		if(!cxgjz.equals("")){
			cxtj +=" and (t.ci_name like '%"+cxgjz+"%' or t.ci_tel like '%"+cxgjz+"%' or t.addres_ref like '%"+cxgjz+"%' or t.address like '%"+cxgjz+"%')";
		}
		String sql = "select t.* from tb_customer_info t where t.rec_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.rec_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.rec_time desc";
			
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	
	public List<Map<String, Object>> querykhxx_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		String cxtj="";
		if(!cxgjz.equals("")){
			cxtj +=" and (t.ci_name like '%"+cxgjz+"%' or t.ci_tel like '%"+cxgjz+"%' or t.addres_ref like '%"+cxgjz+"%' or t.address like '%"+cxgjz+"%')";
		}
		String sql = "select t.* from tb_customer_info t where t.rec_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.rec_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.rec_time desc";
			
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("REC_TIME",m.get("REC_TIME").toString().substring(0, 19));
		}
		return list;
	}
	public String querydz(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		String sql="select * from tb_gps_point t where t.pname like '%"+cxgjz+"%' or t.gpname like '%"+cxgjz+"%' or t.note like '%"+cxgjz+"%'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String findonedz(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String id = String.valueOf(paramMap.get("id"));
		String sql="select * from tb_gps_point t where t.gp_id = '"+id.substring(0, id.length()-1)+"'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
//		Map<String, Object> resultmap = new HashMap<String, Object>();
//		resultmap.put("data", list);
		return jacksonUtil.toJson(list.get(0));
	}
	public int adddz(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String dzmb = String.valueOf(paramMap.get("dzmb"));
		String dwdz = String.valueOf(paramMap.get("dwdz"));
		String note = String.valueOf(paramMap.get("note"));
		String sql="insert into tb_gps_point t (PNAME,GPNAME,NOTE)"
				+ " values('"+dzmb+"','"+dwdz+"','"+note+"')";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public int editdz(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String dzmb = String.valueOf(paramMap.get("dzmb"));
		String dwdz = String.valueOf(paramMap.get("dwdz"));
		String note = String.valueOf(paramMap.get("note"));
		String id = String.valueOf(paramMap.get("id"));
		String sql="update tb_gps_point t "
				+ "set t.PNAME='"+dzmb+"',"
				+ "t.GPNAME='"+dwdz+"',"
				+ "t.note='"+note+"'"
				+ " where t.gp_id='"+id.substring(0, id.length()-1)+"'";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public int deldz(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ids = String.valueOf(paramMap.get("id"));
		String sql="delete tb_gps_point t "
				+ " where t.gp_id in ("+ids.substring(0,ids.length()-1)+")";
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public String queryyy(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"))+" 00:00:00";
		String etime = String.valueOf(paramMap.get("etime"))+" 23:59:59";
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		
		
		String db = stime.substring(2, 4)+stime.substring(5, 7);
		String cxtj="";
		if(!cxgjz.equals("")){
			cxtj +=" and (t.disp_id like '%"+cxgjz+"%' or t.vehi_no like '%"+cxgjz+"%' or t.cust_tel like '%"+cxgjz+"%' or t.cust_name like '%"+cxgjz+"%')";
		}
		
		String sql = "select t.* from tb_dispatch_"+db+" t where t.sfyy='1' and t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.disp_time desc";
		
		sql = "select tt.*,t1.comp_name gsmc,t1.mt_name zdlx from ("+sql+") tt left join vw_vehicle t1 on tt.vehi_no=t1.vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	
	public List<Map<String, Object>> queryyy_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"))+" 00:00:00";
		String etime = String.valueOf(paramMap.get("etime"))+" 23:59:59";
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		
		
		String db = stime.substring(2, 4)+stime.substring(5, 7);
		String cxtj="";
		if(!cxgjz.equals("")){
			cxtj +=" and (t.disp_id like '%"+cxgjz+"%' or t.vehi_no like '%"+cxgjz+"%' or t.cust_tel like '%"+cxgjz+"%' or t.cust_name like '%"+cxgjz+"%')";
		}
		
		String sql = "select t.* from tb_dispatch_"+db+" t where t.sfyy='1' and t.disp_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.disp_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+cxtj+" order by t.disp_time desc";
		
		sql = "select tt.*,t1.comp_name gsmc,t1.mt_name zdlx from ("+sql+") tt left join vw_vehicle t1 on tt.vehi_no=t1.vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			String callstate = m.get("CALL_STATE").toString();
			String aotuoutphone = m.get("AUTOOUTPHONE").toString();
			m.put("CALL_STATE", formatTZZT(callstate));
			m.put("AUTOOUTPHONE", formatSFWB(aotuoutphone));
			m.put("DISP_TIME",m.get("DISP_TIME").toString().substring(0, 19));
			m.put("YC_TIME",m.get("YC_TIME").toString().substring(0, 19));
		}
		return list;
	}
	public int qxyy(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ids = String.valueOf(paramMap.get("id"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String db = sdf.format(new Date()).substring(2, 4)+sdf.format(new Date()).substring(5, 7);
		String sql="update tb_dispatch_"+db+" t set t.disp_state='调度取消'"
				+ " where t.disp_id in ("+ids.substring(0,ids.length()-1)+")";
//		System.out.println(sql);
		int a = jdbcTemplate.update(sql);
		return a;
	}
	
	public String queryzx(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String cldx = String.valueOf(paramMap.get("cldx"));
		String lddh = String.valueOf(paramMap.get("lddh"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String gh = String.valueOf(paramMap.get("gh"));
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		String tj="";
		if(!cldx.equals("")){
			tj +=" and t.cs_object like '%"+cldx+"%'";
		}
		if(!lddh.equals("")){
			tj +=" and t.cs_telnum like '%"+lddh+"%'";
		}
		if(!gh.equals("")){
			tj +=" and t.cs_workernum = '"+gh+"'";
		}
		if(!cxgjz.equals("")){
			tj +=" and (t.cs_memo like '%"+cxgjz+"%' or t.cs_vehiid like '%"+cxgjz+"%')";
		}
		if(!cllx.equals("")){
			tj +=" and t.cs_type = '"+cllx+"'";
		}
		String sql = "select * from tb_consultation t where t.cs_dealdatetime>= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.cs_dealdatetime <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+tj+" order by t.cs_dealdatetime desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("CS_DEALDATETIME", m.get("CS_DEALDATETIME").toString().substring(0, 19));
		}
		return jacksonUtil.toJson(list);
	}
	
	public List<Map<String, Object>> queryzx_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String cldx = String.valueOf(paramMap.get("cldx"));
		String lddh = String.valueOf(paramMap.get("lddh"));
		String cllx = String.valueOf(paramMap.get("cllx"));
		String gh = String.valueOf(paramMap.get("gh"));
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		String tj="";
		if(!cldx.equals("")){
			tj +=" and t.cs_object like '%"+cldx+"%'";
		}
		if(!lddh.equals("")){
			tj +=" and t.cs_telnum like '%"+lddh+"%'";
		}
		if(!gh.equals("")){
			tj +=" and t.cs_workernum = '"+gh+"'";
		}
		if(!cxgjz.equals("")){
			tj +=" and (t.cs_memo like '%"+cxgjz+"%' or t.cs_vehiid like '%"+cxgjz+"%')";
		}
		String sql = "select * from tb_consultation t where t.cs_dealdatetime>= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and t.cs_dealdatetime <= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "+tj+" order by t.cs_dealdatetime desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> m = list.get(i);
			m.put("CS_DEALDATETIME", m.get("CS_DEALDATETIME").toString().substring(0, 19));
		}
		return list;
	}
	
	public String queryjk(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
		String etime = String.valueOf(paramMap.get("etime"));
		String cxgjz = String.valueOf(paramMap.get("cxgjz"));
		String sql="select * from hzgps_taxi.tb_gps_point@taxilink t where t.pname like '%"+cxgjz+"%' or t.gpname like '%"+cxgjz+"%' or t.note like '%"+cxgjz+"%'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql  );
		return jacksonUtil.toJson(list);
	}
	
	
	public List<String> kyset(String stime,String etime){
        ArrayList<String> result = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");//格式化为年月
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyMM");//格式化为年月
        try{
            Calendar min = Calendar.getInstance();
            Calendar max = Calendar.getInstance();
            min.setTime(sdf.parse(stime));
            min.set(min.get(Calendar.YEAR), min.get(Calendar.MONTH), 1);
        
            max.setTime(sdf.parse(etime));
            max.set(max.get(Calendar.YEAR), max.get(Calendar.MONTH), 2);
        
            Calendar curr = min;
            while (curr.before(max)) {
                result.add(sdf2.format(curr.getTime()));
                curr.add(Calendar.MONTH, 1);
            }
        }catch(ParseException e){
            e.printStackTrace();
        }
        return result;
	}
}
