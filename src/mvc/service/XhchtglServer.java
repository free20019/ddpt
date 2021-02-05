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
public class XhchtglServer {
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

	/**
	 * 查询车辆
	 */
	public String findcl(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		String COMP_NAME = String.valueOf(paramMap.get("COMP_NAME"));
		String AREA_NAME = String.valueOf(paramMap.get("AREA_NAME"));
		String DLYS = String.valueOf(paramMap.get("DLYS"));
		String JYXK = String.valueOf(paramMap.get("JYXK"));
		String STATUS = String.valueOf(paramMap.get("STATUS"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(VEHI_NO!=null&&!VEHI_NO.isEmpty()&&!VEHI_NO.equals("null")&&VEHI_NO.length()>0&&!VEHI_NO.equals("请选择车牌号码")){
			tj += " and b.PLATE_NUMBER = '"+VEHI_NO+"'";
		}
		if(COMP_NAME!=null&&!COMP_NAME.isEmpty()&&!COMP_NAME.equals("null")&&COMP_NAME.length()>0&&!COMP_NAME.equals("请选择业户名称")){
			tj += " and b.COMPANY_NAME = '"+COMP_NAME+"'";
		}
		if(AREA_NAME!=null&&!AREA_NAME.isEmpty()&&!AREA_NAME.equals("null")&&AREA_NAME.length()>0&&!AREA_NAME.equals("请选择地市")){
			tj += " and b.AREA_NAME = '"+AREA_NAME+"'";
		}
		if(DLYS!=null&&!DLYS.isEmpty()&&!DLYS.equals("null")&&DLYS.length()>0){
			tj += " and b.LICENSE_NUMBER = '"+DLYS+"'";
		}
		if(JYXK!=null&&!JYXK.isEmpty()&&!JYXK.equals("null")&&JYXK.length()>0){
			tj += " and b.COMPANY_LICENSE_NUMBER = '"+JYXK+"'";
		}
		if(STATUS!=null&&!STATUS.isEmpty()&&!STATUS.equals("null")&&STATUS.length()>0){
			tj += " and b.STATUS = '"+STATUS+"'";
		}
		String sql = "select (select count(*) COUNT from (select * from (select * from tb_global_vehicle where industry=090 and business_scope_code = 1400  AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') b where 1=1 ";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, m.*,rownum as rn from (select"
				+ " b.* from (select * from tb_global_vehicle where industry=090 and business_scope_code = 1400  AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') b where 1=1";
		sql += tj;
		sql += " ) t left join (select HOLDER,HOLDER_PHONE,HOLDER_ID,VEHICLE_PLATE_NUMBER from TB_TAXI_MANAGE_RIGHT_OUT) m on m.VEHICLE_PLATE_NUMBER=t.PLATE_NUMBER  where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		sql +="order by PLATE_NUMBER";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		for(int i=0;i<list.size();i++){
			if(list.get(i).get("BUSINESS_SCOPE_NAME")!=null){
				String scope=list.get(i).get("BUSINESS_SCOPE_NAME").toString();
				if(scope.equals("网络预约出租汽车客运。")||scope.equals("客运：网络预约出租汽车客运。")){
					scope="";
				}
				list.get(i).put("BUSINESS_SCOPE_NAME", scope);
			}
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 查询驾驶员
	 */
	public String findjsy(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String ID_NUMBER = String.valueOf(paramMap.get("ID_NUMBER"));//身份证号
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));//车牌号
		String NAME = String.valueOf(paramMap.get("NAME"));//姓名
		String PHONE = String.valueOf(paramMap.get("PHONE"));//电话号码
		String COMP_NAME = String.valueOf(paramMap.get("COMP_NAME"));//公司名
		String VEHICLE_ID = String.valueOf(paramMap.get("VEHICLE_ID"));//服务证号
		String LICENSE_NO = String.valueOf(paramMap.get("LICENSE_NO"));//经营许可证
		String STATUS = String.valueOf(paramMap.get("STATUS"));//证照状态
		String AREA_NAME = String.valueOf(paramMap.get("AREA_NAME"));//所在地市

		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(ID_NUMBER!=null&&!ID_NUMBER.isEmpty()&&!ID_NUMBER.equals("null")&&ID_NUMBER.length()>0){
			tj += " and b.ID_NUMBER = '"+ID_NUMBER+"'";
		}
		if(VEHI_NO!=null&&!VEHI_NO.isEmpty()&&!VEHI_NO.equals("null")&&VEHI_NO.length()>0){
			tj += " and ( b.PLATE_NUMBER = '"+VEHI_NO+"' or REPLACE(b.PLATE_NUMBER,'.','')  = '"+VEHI_NO+"' ) ";
		}
		if(NAME!=null&&!NAME.isEmpty()&&!NAME.equals("null")&&NAME.length()>0){
			tj += " and b.NAME = '"+NAME+"'";
		}
		if(PHONE!=null&&!PHONE.isEmpty()&&!PHONE.equals("null")&&PHONE.length()>0){
			tj += " and b.MOBILE_PHONE like '%"+PHONE+"%'";
		}
		if(COMP_NAME!=null&&!COMP_NAME.isEmpty()&&!COMP_NAME.equals("null")&&COMP_NAME.length()>0&&!COMP_NAME.equals("请选择公司名称")){
			tj += " and b.COMPANY_NAME = '"+COMP_NAME+"'";
		}
		if(VEHICLE_ID!=null&&!VEHICLE_ID.isEmpty()&&!VEHICLE_ID.equals("null")&&VEHICLE_ID.length()>0){
			tj += " and b.VEHICLE_ID = '"+VEHICLE_ID+"'";
		}
		if(LICENSE_NO!=null&&!LICENSE_NO.isEmpty()&&!LICENSE_NO.equals("null")&&LICENSE_NO.length()>0){
			tj += " and b.COMPANY_LICENSE_NUMBER = '"+LICENSE_NO+"'";
		}
		if(STATUS!=null&&!STATUS.isEmpty()&&!STATUS.equals("null")&&STATUS.length()>0){
			tj += " and b.STATUS_NAME = '"+STATUS+"'";
		}
		if(AREA_NAME!=null&&!AREA_NAME.isEmpty()&&!AREA_NAME.equals("null")&&AREA_NAME.length()>0&&!AREA_NAME.equals("请选择地市")){
			tj += " and b.AREA_NAME = '"+AREA_NAME+"'";
		}
		String sql = "select (select count(*) COUNT from (select id_number from (select "
				+ " b.* from (select distinct gpc.* from"
//				+ " tb_global_vehicle gv,"
				+ " TB_GLOBAL_PERSON_CERTIFICATE gpc"
//				+ " where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%'"
				+ ") b where 1=1 and id_number is not null and (id,id_number) in (select max(id),id_number from"
				+ " (select gpc.* from"
//				+ " tb_global_vehicle gv,"
				+ " TB_GLOBAL_PERSON_CERTIFICATE gpc "
//				+ "where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%'"
				+ ") group by id_number) ";
		sql += tj;
		sql += " ) t";
		sql+=")) as count, tt.* from (select t.*,ti.ASSESS_SCORE,ti.ASSESS_YEAR, rownum as rn from (select"
				+ " b.* from (select distinct gpc.* from"
//				+ " tb_global_vehicle gv,"
				+ " TB_GLOBAL_PERSON_CERTIFICATE gpc"
//				+ " where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%'"
				+ ") b where 1=1 and id_number is not null and (id,id_number) in (select max(id),id_number from"
				+ " (select gpc.* from"
//				+ " tb_global_vehicle gv,"
				+ " TB_GLOBAL_PERSON_CERTIFICATE gpc "
//				+ "where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%'"
				+ ") group by id_number) ";
		sql += tj;
		sql += " ) t left join (select distinct ti.ASSESS_SCORE,ti.ASSESS_YEAR,ti.id_number from TB_TAXI_INTEGRITY_INFO_OUT ti "
				+ "where (ti.id_number,ti.ASSESS_YEAR,ASSESS_SCORE) in (select id_number,max(ti.ASSESS_YEAR),max(ti.ASSESS_SCORE) from TB_TAXI_INTEGRITY_INFO_OUT ti  group by id_number)) ti  "
				+ "on ti.id_number=t.id_number " 
				+ "where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		sql +=" order by PLATE_NUMBER";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("PLATE_NUMBER", String.valueOf(list.get(i).get("PLATE_NUMBER")).replace("null","").replace(".",""));
			}
		}
//		System.out.println("sql="+sql);
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 查询违章信息
	 */
	public String findwz(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String STIME = String.valueOf(paramMap.get("STIME"));//开始时间
		String ETIME = String.valueOf(paramMap.get("ETIME"));//结束时间
		String PARTY_NAME = String.valueOf(paramMap.get("PARTY_NAME"));//人员姓名
		String AUTO_NUM = String.valueOf(paramMap.get("AUTO_NUM"));//车牌号
		String AREA_NAME = String.valueOf(paramMap.get("AREA_NAME"));//所在区域
		String CERTI_NUM = String.valueOf(paramMap.get("CERTI_NUM"));//从业资格证
		String LIENCE_NUM = String.valueOf(paramMap.get("LIENCE_NUM"));//经营许可证
		String AREA = String.valueOf(paramMap.get("AREA"));//执法区域
		String ORGAN = String.valueOf(paramMap.get("ORGAN"));//执法部门

		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(STIME!=null&&!STIME.isEmpty()&&!STIME.equals("null")&&STIME.length()>0){
			tj += " and b.ILLEGAL_TIME >=to_date('"+STIME+"','yyyy-mm-dd hh24:mi:ss')";	
		}
		if(ETIME!=null&&!ETIME.isEmpty()&&!ETIME.equals("null")&&ETIME.length()>0){
			tj += " and b.ILLEGAL_TIME <=to_date('"+ETIME+"','yyyy-mm-dd hh24:mi:ss')";
		}
		if(PARTY_NAME!=null&&!PARTY_NAME.isEmpty()&&!PARTY_NAME.equals("null")&&PARTY_NAME.length()>0){
			tj += " and b.PARTY_NAME = '"+PARTY_NAME+"'";
		}
		if(AREA_NAME!=null&&!AREA_NAME.isEmpty()&&!AREA_NAME.equals("null")&&AREA_NAME.length()>0){
			tj += " and b.AREA_NAME = '"+AREA_NAME+"'";
		}
		if(AUTO_NUM!=null&&!AUTO_NUM.isEmpty()&&!AUTO_NUM.equals("null")&&AUTO_NUM.length()>0){
			tj += " and ( b.AUTO_NUM = '"+AUTO_NUM+"' or REPLACE(b.AUTO_NUM,'.','')  = '"+AUTO_NUM+"' ) ";
		}
		if(CERTI_NUM!=null&&!CERTI_NUM.isEmpty()&&!CERTI_NUM.equals("null")&&CERTI_NUM.length()>0){
			tj += " and b.CERTI_NUM = '"+CERTI_NUM+"'";
		}
		if(LIENCE_NUM!=null&&!LIENCE_NUM.isEmpty()&&!LIENCE_NUM.equals("null")&&LIENCE_NUM.length()>0){
			tj += " and b.LIENCE_NUM = '"+LIENCE_NUM+"'";
		}
		if(AREA!=null&&!AREA.isEmpty()&&!AREA.equals("null")&&AREA.length()>0&&!AREA.equals("请选择执法区域")){
			tj += " and b.AREA = '"+AREA+"'";
		}
		if(ORGAN!=null&&!ORGAN.isEmpty()&&!ORGAN.equals("null")&&ORGAN.length()>0&&!ORGAN.equals("请选择执法部门")){
			tj += " and b.ORGAN = '"+ORGAN+"'";
		}

		String sql = "select (select count(*) COUNT from (select * from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') b where 1=1 ";
		sql += tj;
		sql+=")) as count, tt.* from (select t.* ,rownum as rn from (select"
				+ " b.* from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') b where 1=1 ";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("AUTO_NUM", String.valueOf(list.get(i).get("AUTO_NUM")).replace(".",""));
			}
		}
		System.out.println("sql="+sql);
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 公司车辆违章查询
	 */
	public String findgs(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String COM_NAME = String.valueOf(paramMap.get("COM_NAME"));//公司名
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(COM_NAME!=null&&!COM_NAME.isEmpty()&&!COM_NAME.equals("null")&&COM_NAME.length()>0&&!COM_NAME.equals("请选择公司名称")){
			tj += " and b.COM_NAME = '"+COM_NAME+"'";
		}
		String sql = "select (select count(*) COUNT from (select distinct b.AUTO_NUM from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') b where 1=1 ";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*,b.COM_NAME,b.IC_SCORE ,rownum as rn from (select "
				+ "b.AUTO_NUM,count(b.AUTO_NUM) as count1 from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') b where 1=1 ";
		sql += tj;
		sql +="  group by b.AUTO_NUM";
		sql += " ) t left join ( select b.id,b.AUTO_NUM,b.COM_NAME ,b.IC_SCORE from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') b where "
				+ " (b.id,b.AUTO_NUM) in (select max(id),auto_num from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') group by auto_num) "
				+ " ) b on  b.AUTO_NUM=t.AUTO_NUM where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("AUTO_NUM", String.valueOf(list.get(i).get("AUTO_NUM")).replace(".",""));
			}
		}
		System.out.println("sql="+sql);
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 公司车辆违章信息
	 */
	public String findwzxx(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String COM_NAME = String.valueOf(paramMap.get("COM_NAME"));//公司名
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(COM_NAME!=null&&!COM_NAME.isEmpty()&&!COM_NAME.equals("null")&&COM_NAME.length()>0&&!COM_NAME.equals("请选择公司名称")){
			tj += " and b.COM_NAME = '"+COM_NAME+"'";
		}
		String sql = "select (select count(*) COUNT from (select * from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') b where 1=1 ";
		sql += tj;
		sql+=")) as count, tt.* from (select t.* ,rownum as rn from (select"
				+ " b.* from (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') b where 1=1 ";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("AUTO_NUM", String.valueOf(list.get(i).get("AUTO_NUM")).replace(".",""));
			}
		}
		System.out.println("sql="+sql);
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 公司车辆违章统计
	 */
	public String findtj(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String COM_NAME = String.valueOf(paramMap.get("COM_NAME"));//公司名
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(COM_NAME!=null&&!COM_NAME.isEmpty()&&!COM_NAME.equals("null")&&COM_NAME.length()>0&&!COM_NAME.equals("请选择公司名称")){
			tj += " and gv.COMPANY_NAME = '"+COM_NAME+"'";
		}
		String sql = "select (select count(*) COUNT from (select distinct  gv.COMPANY_ID from (select * from tb_global_vehicle where industry=090 and business_scope_code = 1400  AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') gv where 1=1 and gv.COMPANY_ID is not null ";
		sql += tj;
		sql+=")) as count, tt.* from (select t.* ,rownum as rn from (select distinct gv.COMPANY_ID,gv.COMPANY_NAME,count1,count2,count3 from (select * from tb_global_vehicle where industry=090 and business_scope_code = 1400  AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') gv"
				+" left join (select gv.COMPANY_ID,count( COMPANY_ID) as count1 from (select * from tb_global_vehicle where industry=090 and business_scope_code = 1400  AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') gv group by gv.COMPANY_ID) gv1 on gv1.COMPANY_ID = gv.COMPANY_ID "
				+" left join (select ti.COM_ID,count( COM_ID) as count2 from (select auto_num,com_id from"
				+ " (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') group by auto_num,com_id) ti  group by ti.COM_ID) ti on trim(ti.COM_ID)=gv.COMPANY_ID"
				+" left join (select ti.COM_ID,count( COM_ID) as count3 from"
				+ " (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') ti  group by ti.COM_ID) ti2 on trim(ti2.COM_ID)=gv.COMPANY_ID where 1=1 and gv.COMPANY_ID is not null ";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		System.out.println("sql="+sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("AUTO_NUM", String.valueOf(list.get(i).get("AUTO_NUM")).replace(".",""));
			}
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 公司统计车辆违章
	 */
	public String findallcl(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String id = String.valueOf(paramMap.get("id"));//公司id
		String tj = "";
		String tj2 = "";
		if(id!=null&&!id.isEmpty()&&!id.equals("null")&&id.length()>0){
			tj += " and gv.COMPANY_ID = '"+id+"'";
			tj2 += " and trim(ti.COM_ID) = '"+id+"'";
		}
		String sql = "select gv.PLATE_NUMBER,gv.ID from (select * from tb_global_vehicle where industry=090 and business_scope_code = 1400  AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') gv where 1=1 ";
		sql += tj;
		String sql2 = "select distinct(ti.AUTO_NUM) AUTO_NUM,count(AUTO_NUM) as num from"
				+ " (select ti.*,gv.AREA_NAME from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.industry=090 and gv.business_scope_code = 1400  AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') ti where 1=1 AND AUTO_NUM IS NOT NULL ";
		sql2 += tj2;
		sql2 +=" group by AUTO_NUM";

		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List<Map<String, Object>> list2 = jdbcTemplate.queryForList(sql2);
		String count = "";
		if( list!=null && list.size() >0){
			for(int i=0;i<list.size();i++){
				if(list.get(i).get("PLATE_NUMBER")!=null){
					count +=list.get(i).get("PLATE_NUMBER").toString().replace(".","")+",";
				}
			}
		}
		String count2 = "";
		if( list2!=null && list2.size() >0){
			for(int i=0;i<list2.size();i++){
				if(list2.get(i).get("AUTO_NUM")!=null){
					count2 +=list2.get(i).get("AUTO_NUM").toString().replace(".","");
				}
				if(list2.get(i).get("num")!=null){
					count2 +="("+list2.get(i).get("num").toString().replace(".","")+")"+",";
				}
			}
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("count2",count2);
        return jacksonUtil.toJson(map);
	}
}
