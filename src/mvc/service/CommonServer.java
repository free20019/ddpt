package mvc.service;

import helper.JacksonUtil;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;


@Service
public class CommonServer {
	protected JdbcTemplate jdbcTemplate = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	

	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

	public String ssjk(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gsmc = String.valueOf(paramMap.get("gsmc"));
		Map<String, Object> resultmap = new HashMap<String, Object>();
		return jacksonUtil.toJson(resultmap);
	}
	/**
	 * 公共基础类，通用方法
	 * 公司、分公司、车辆等下拉框
	 */
	//区块下拉框
	public String findqk(){
		String sql = "select owner_id,owner_name from TB_OWNER";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
//		Map map1 = new HashMap();
//		map1.put("name", "所有公司");
//		map1.put("id", "0");
//		al.add(map1);
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("owner_name"));
			map.put("id", list.get(i).get("owner_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//公司下拉框
	public String findba(){
		String sql = "select ba_id,ba_name from TB_BUSI_AREA order by NLSSORT(ba_name,'NLS_SORT = SCHINESE_PINYIN_M')";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("ba_name"));
			map.put("id", list.get(i).get("ba_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//公司下拉框
		public String findbatj(String comp_name){
			String sql = "select ba_id,ba_name from TB_BUSI_AREA where 1=1";
			if(comp_name!=null&&comp_name.length()>0&&!comp_name.equals("null")){
				sql += " and ba_name like '%"+comp_name+"%'";
			}
			sql += " order by NLSSORT(ba_name,'NLS_SORT = SCHINESE_PINYIN_M')";
			System.out.println(sql);
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("ba_name"));
				map.put("id", list.get(i).get("ba_id"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
	//分公司下拉框
	public String findcomp(String ba_id){
		String sql = "select comp_id,comp_name from TB_COMPANY where 1=1";
		if(ba_id!=null&&!ba_id.isEmpty()){
			sql += " and ba_id = '"+ba_id+"'";
		}
		sql += " order by comp_name";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		Map map1 = new HashMap();
		map1.put("name", "选择分公司");
		map1.put("id", "0");
		al.add(map1);
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("comp_name"));
			map.put("id", list.get(i).get("comp_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	public String findcomp_tj(String comp_name){
		String sql = "select comp_id,comp_name from TB_COMPANY where 1=1";
		if(comp_name!=null&&!comp_name.isEmpty()){
			sql += " and comp_name like '%"+comp_name+"%'";
		}
		sql += " order by comp_name";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("comp_name"));
			map.put("id", list.get(i).get("comp_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//车辆下拉框
	public String findvhic(String ba_id,String comp_id){
		String sql = "select comp_id,comp_name from TB_VEHICLE where 1=1";
		if(ba_id!=null&&!ba_id.isEmpty()){
			sql += " and ba_id = ?";
		}
		if(comp_id!=null&&!comp_id.isEmpty()){
			sql += " and comp_id = ?";
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,ba_id,comp_id);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vehi_no"));
			map.put("id", list.get(i).get("vehi_no"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	public String findvhictj(String vhic){
		String sql = "select vehi_no,vehi_no from TB_VEHICLE where 1=1";
		if(vhic!=null&&!vhic.isEmpty()){
			sql += " and vehi_no like '%"+vhic+"%'";
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vehi_no"));
			map.put("id", list.get(i).get("vehi_no"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//区域
	public String findqy(){
		String sql = "select re_id,re_name from TB_REGION";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("re_name"));
			map.put("id", list.get(i).get("re_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//地图
	public String finddt(){
		String sql = "select map_id,map_name from TB_MAP";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("map_name"));
			map.put("id", list.get(i).get("map_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//车辆类型
	public String findcllx(){
		String sql = "select vt_id,vt_name from TB_VEHI_TYPE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vt_name"));
			map.put("id", list.get(i).get("vt_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	public String findcllxtj(String info){
		String sql = "select vt_id,vt_name from TB_VEHI_TYPE where 1=1";
		if(info!=null&&info.length()>0){
			 sql += " and vt_name like '%"+info+"%'";
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vt_name"));
			map.put("id", list.get(i).get("vt_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//车牌号码
	public String fingcp(){
		String sql = "select ID,PLATE_NUMBER from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%')";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("id", list.get(i).get("ID"));
			map.put("name", list.get(i).get("PLATE_NUMBER"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//车牌号码
		public String findcptj(String cp_name){
			String sql = "select ID,PLATE_NUMBER from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') where 1=1 ";
			if(cp_name!=null&&cp_name.length()>0){
				 sql += " and PLATE_NUMBER like '%"+cp_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("id", list.get(i).get("ID"));
				map.put("name", list.get(i).get("PLATE_NUMBER"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
	//市区
		public String findsq(){
			String sql = "select distinct AREA_NAME from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA_NAME"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findsqtj(String sq_name){
			String sql = "select distinct AREA_NAME from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') where 1=1 ";
			if(sq_name!=null&&sq_name.length()>0){
				 sql += " and AREA_NAME like '%"+sq_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA_NAME"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
	//业户名称
	public String findyh(){
		String sql = "select distinct COMPANY_NAME from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') ";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("COMPANY_NAME"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	public String findyhtj(String yh_name){
		String sql = "select distinct COMPANY_NAME from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%')  where 1=1 ";
		if(yh_name!=null&&yh_name.length()>0){
			 sql += " and COMPANY_NAME like '%"+yh_name+"%'";
		}
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("COMPANY_NAME"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//小货车营运范围
		public String findjyfw(){
			String sql = "select distinct BUSINESS_SCOPE_NAME,BUSINESS_SCOPE_CODE from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') ";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("BUSINESS_SCOPE_NAME"));
				map.put("id", list.get(i).get("BUSINESS_SCOPE_CODE"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//小货车车辆类型
		public String findcllxxh(){
			String sql = "select distinct VEHICLE_TYPE_CODE,VEHICLE_TYPE_NAME from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') ";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("VEHICLE_TYPE_NAME"));
				map.put("id", list.get(i).get("VEHICLE_TYPE_CODE"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//小货车车辆型号
		public String findxh(){
			String sql = "select distinct MODEL from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("MODEL"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findxhtj(String cp_name){
			String sql = "select distinct MODEL from (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%') where 1=1 ";
			if(cp_name!=null&&cp_name.length()>0){
				 sql += " and MODEL like '%"+cp_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("MODEL"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//小货车燃料类型
		public String findrllx(){
			String sql = "select distinct FUEL_NAME,FUEL_TYPE from"
					+ " (select * from tb_global_vehicle where BUSINESS_SCOPE_NAME='客运：出租车客运。' AND STATUS_NAME='营运' AND PLATE_NUMBER LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("FUEL_NAME"));
				map.put("id", list.get(i).get("FUEL_TYPE"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//驾驶员所在区块
		public String findsqm(){
			String sql = "select distinct AREA_NAME,AREA_CODE from"
					+ " (select gpc.* from tb_global_vehicle gv,TB_GLOBAL_PERSON_CERTIFICATE gpc where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA_NAME"));
				map.put("id", list.get(i).get("AREA_CODE"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findsqmtj(String sqm_name){
			String sql = "select distinct AREA_NAME,AREA_CODE from"
					+ " (select gpc.* from tb_global_vehicle gv,TB_GLOBAL_PERSON_CERTIFICATE gpc where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%') where 1=1 ";
			if(sqm_name!=null&&sqm_name.length()>0){
				 sql += " and AREA_NAME like '%"+sqm_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA_NAME"));
				map.put("id", list.get(i).get("AREA_CODE"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//驾驶员电话号码
		public String findphone(){
			String sql = "select MOBILE_PHONE from"
					+ " (select gpc.* from tb_global_vehicle gv,TB_GLOBAL_PERSON_CERTIFICATE gpc where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%')"
					+ "where MOBILE_PHONE is not null";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("MOBILE_PHONE"));
				map.put("id", list.get(i).get("MOBILE_PHONE"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findphonetj(String phone_name){
			String sql = "select distinct MOBILE_PHONE from"
					+ " (select gpc.* from tb_global_vehicle gv,TB_GLOBAL_PERSON_CERTIFICATE gpc where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%')"
					+ " where 1=1 and MOBILE_PHONE is not null";
			if(phone_name!=null&&phone_name.length()>0){
				 sql += " and MOBILE_PHONE like '%"+phone_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("MOBILE_PHONE"));
				map.put("id", list.get(i).get("MOBILE_PHONE"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//驾驶员所在公司名
		public String findgsm(){
			String sql = "select distinct COMPANY_NAME,COMPANY_ID from"
					+ " (select gpc.* from tb_global_vehicle gv,TB_GLOBAL_PERSON_CERTIFICATE gpc where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("COMPANY_NAME"));
				map.put("id", list.get(i).get("COMPANY_ID"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findgsmtj(String cp_name){
			String sql = "select  distinct COMPANY_NAME,COMPANY_ID from"
					+ " (select gpc.* from tb_global_vehicle gv,TB_GLOBAL_PERSON_CERTIFICATE gpc where REPLACE(gpc.plate_number,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND gpc.plate_number LIKE '浙A%') where 1=1 ";
			if(cp_name!=null&&cp_name.length()>0){
				 sql += " and COMPANY_NAME like '%"+cp_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("COMPANY_NAME"));
				map.put("id", list.get(i).get("COMPANY_ID"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//违章执法区域
		public String fingzfqy(){
			String sql = "select distinct AREA from"
					+ " (select ti.* from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findzfqytj(String qy_name){
			String sql = "select distinct AREA from"
					+ " (select ti.* from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') where 1=1 ";
			if(qy_name!=null&&qy_name.length()>0){
				 sql += " and AREA like '%"+qy_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//违章执法机构
		public String fingzfbm(){
			String sql = "select distinct ORGAN from"
					+ " (select ti.* from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("ORGAN"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findzfbmtj(String bm_name){
			String sql = "select distinct ORGAN from"
					+ " (select ti.* from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') where 1=1 ";
			if(bm_name!=null&&bm_name.length()>0){
				 sql += " and ORGAN like '%"+bm_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("ORGAN"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//违章执法机构
		public String fingzfxq(){
			String sql = "select distinct AREA_NAME from"
					+ " (select ti.*,gv.* from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%')";
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA_NAME"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findzfxqtj(String xq_name){
			String sql = "select distinct AREA_NAME from"
					+ " (select ti.*,gv.* from tb_global_vehicle gv,TB_TAXI_ILLEGAL_INFO_OUT ti where REPLACE(ti.AUTO_NUM,'.','')=gv.plate_number and gv.BUSINESS_SCOPE_NAME='客运：出租车客运。' AND gv.STATUS_NAME='营运' AND ti.AUTO_NUM LIKE '浙A%') where 1=1 ";
			if(xq_name!=null&&xq_name.length()>0){
				 sql += " and AREA_NAME like '%"+xq_name+"%'";
			}
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("AREA_NAME"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		//违章车辆所在公司
		public String findgsmc(){
			String sql = "select distinct NAME,ID from TB_GLOBAL_COMPANY";
			System.out.println("统计sql="+sql);
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("NAME"));
				map.put("id", list.get(i).get("ID"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
		public String findgsmctj(String gsm_name){
			String sql = "select distinct NAME,ID from TB_GLOBAL_COMPANY where 1=1 ";
			if(gsm_name!=null&&gsm_name.length()>0){
				 sql += " and NAME like '%"+gsm_name+"%'";
			}
			System.out.println("统计sql="+sql);
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			List al = new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map = new HashMap();
				map.put("name", list.get(i).get("NAME"));
				map.put("id", list.get(i).get("ID"));
				al.add(map);
			}
			Map m = new HashMap();
			m.put("datas", al);
			return  jacksonUtil.toJson(m);
		}
	//车辆颜色
	public String findclys(){
		String sql = "select vc_id,vc_name from TB_VEHI_COLOR";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vc_name"));
			map.put("id", list.get(i).get("vc_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//车牌类型TB_VEHI_STATE
	public String findcplx(){
		String sql = "select vnt_id,vnt_name from TB_VEHI_NO_TYPE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vnt_name"));
			map.put("id", list.get(i).get("vnt_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//车辆状态
	public String findclzt(){
		String sql = "select vs_id,vs_name from TB_VEHI_STATE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vs_name"));
			map.put("id", list.get(i).get("vs_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//车牌颜色
	public String findcpys(){
		String sql = "select vnc_id,vnc_name from TB_VEHI_NO_COLOR";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("vnc_name"));
			map.put("id", list.get(i).get("vnc_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//终端类型
	public String findzdlx(){
		String sql = "select mt_id,mt_name from TB_MDT_TYPE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("mt_name"));
			map.put("id", list.get(i).get("mt_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//终端型号
	public String findzdxh(){
		String sql = "select * from TB_MDT_SUB_TYPE t";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("sub_name"));
			map.put("id", list.get(i).get("subid"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//通信类型
	public String findtxlx(){
		String sql = "select ct_id,ct_name from TB_COMM_TYPE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("ct_name"));
			map.put("id", list.get(i).get("ct_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//终端状态
	public String findzdzt(){
		String sql = "select ms_id,ms_name from TB_MDT_STATE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("ms_name"));
			map.put("id", list.get(i).get("ms_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}
	//用户权限列表
	public String findqxlb(){
		String sql = "select rg_id,rg_name from tb_priv_role t group by rg_id, rg_name";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		List al = new ArrayList();
		for(int i=0;i<list.size();i++){
			Map map = new HashMap();
			map.put("name", list.get(i).get("rg_name"));
			map.put("id", list.get(i).get("rg_id"));
			al.add(map);
		}
		Map m = new HashMap();
		m.put("datas", al);
		return  jacksonUtil.toJson(m);
	}

	public List<Map<String, Object>> kq(String rq) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");  
		 Calendar calendar = Calendar.getInstance();  
        try {
			calendar.setTime(sdf.parse(rq));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
        int a = calendar.getActualMaximum(Calendar.DAY_OF_MONTH); 
		
		String rysql = "select distinct(t.username) username from QYKP.TB_SIGNIN t order by t.username";
		List<Map<String, Object>> rylist = jdbcTemplate.queryForList(rysql);
		List<Map<String, Object>> result = new ArrayList<Map<String,Object>>();
		for (int k = 0; k < rylist.size(); k++) {
			if(rylist.get(k).get("USERNAME")==null){continue;}
			String username = rylist.get(k).get("USERNAME").toString();
			for (int i = 1; i <= a; i++) {
				String sj = rq+i;
				if(i<10){
					sj = rq+"0"+i;
				}
				String rz = "select t1.qdtime,t1.cdyy,t2.ztyy ,t2.qttime "
				+ "from (select * from QYKP.TB_SIGNIN t where t.yeartime = '"+sj+"' and t.username='"+username+"')t1 full join (select * from QYKP.tb_signout t where t.yeartime = '"+sj+"' and t.username='"+username+"')t2 on "
				+ "t1.username=t2.username and "
				+ "t1.yeartime=t2.yeartime";
				List<Map<String, Object>> rzlist = jdbcTemplate.queryForList(rz);
				if(rzlist.size()>0){
					rzlist.get(0).put("USERNAME", username);
					rzlist.get(0).put("QDTIME", rzlist.get(0).get("QDTIME")==null?"":rzlist.get(0).get("QDTIME").toString().substring(0, 19));
					rzlist.get(0).put("QTTIME", rzlist.get(0).get("QTTIME")==null?"":rzlist.get(0).get("QTTIME").toString().substring(0, 19));
					result.add(rzlist.get(0));
				}
			}
		}
		return result;
	}
	public int findMaxId(String table,String ids){
		int id = 1;
		String sql = "select "+ids+" from "+table +"  order by to_number("+ids+") desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		if(list.size()>0){
			id = Integer.parseInt(list.get(0).get(ids).toString())+1;
		}
		return id;
	}
	public String upload(HttpServletRequest request, HttpServletResponse response, String type) {
		Map<String, Object> map = new HashMap<String, Object>();
		List<String> filenames = new ArrayList<String>();
		int tp = 0;
		if (ServletFileUpload.isMultipartContent(request)) {
			String saveAsFileName = "";
			ServletFileUpload uploadHandler = new ServletFileUpload(new DiskFileItemFactory());
			PrintWriter writer = null;
			response.setContentType("application/json");
			try {
				// writer = response.getWriter();
				List<FileItem> items = uploadHandler.parseRequest(request);
				String SQBH = "";
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				Date d = new Date();
				String date = sdf.format(d).replaceAll("-", "");
				int OGT_ID =  findMaxId("TB_OA_GUESTTELL","OGT_ID");
				request.getSession().setAttribute("OGT_ID", OGT_ID);
				for (FileItem item : items) {

					/**
					 * 提交的时候有图片的才上传保存至数据库
					 */
					if (item.getName() != null && item.getName().length() > 0) {
					
						if (!item.isFormField()) {
							String fp = "C:\\upload\\";
							File f = new File(fp);
							if (!f.exists()) {
								f.mkdirs();
							}
							if (item.getName().isEmpty() || item.getSize() == 0) {
								continue;
							}
							saveAsFileName = System.currentTimeMillis() + item.getFieldName()
									+ item.getName().substring(item.getName().lastIndexOf("."));

							File file = new File(fp + saveAsFileName + ".tmp");
							item.write(file);
							file.renameTo(new File(fp + saveAsFileName));
							try {
								String in = fp + saveAsFileName;

								if (item.getFieldName().equals("swdj-puct")) {
									int a = 0;
									a = jdbcTemplate.update(
											"insert into TB_OA_GUESTTELL (OGT_ID,puct) values (?,?)",
											new Object[] { OGT_ID ,in});
									if (a == 0) {
										return "{\"code\":400,\"data\":\"图片提交失败\"}";
									} else {
										tp = 1;
									}
								}
							} catch (Exception e) {
								return "{\"code\":400,\"data\":\"图片提交失败\"}";
							}
							filenames.add(saveAsFileName);
						}
					}
				}
			} catch (FileUploadException e) {
				return "{\"code\":400,\"data\":\"" + e.getMessage() + "\"}";
				
			} catch (Exception e) {
				return "{\"code\":400,\"data\":\"" + e.getMessage() + "\"}";
			} finally {
			}
		}
		if (tp == 0) {
			return "{\"code\":400,\"data\":\"图片提交未提交，请重新提交\"}";
		}
		map.put("data", "OK");
		return jacksonUtil.toJson(map);
	}
	public void query_pic(HttpServletRequest request, HttpServletResponse response) {
		try {
					String dz = request.getSession().getAttribute("dz").toString();
					File pf = new File(dz);
					if (!pf.exists()) {
						return;
					}
					double rate = 0.5;
					int[] results = getImgWidth(pf);
					int widthdist = 0;
					int heightdist = 0;
					if (results == null || results[0] == 0 || results[1] == 0) {
						return;
					} else {
						if (results[0]>126) {
							rate = (double)126/(double)results[0];
						}
						
						widthdist = (int) (results[0] * rate);
						heightdist = (int) (results[1] * rate);
					}
					Image src = javax.imageio.ImageIO.read(pf);
					BufferedImage tag = new BufferedImage((int) widthdist, (int) heightdist,
							BufferedImage.TYPE_INT_RGB);

					tag.getGraphics().drawImage(src.getScaledInstance(widthdist, heightdist, Image.SCALE_SMOOTH), 0, 0,
							null);
					ServletOutputStream fout = response.getOutputStream();
					ImageIO.write(tag, "jpg", fout);
					fout.close();
		} catch (Exception e) {
		}

	}
	public String dz(HttpServletRequest request,String dz){
		request.getSession().setAttribute("dz", dz);
		return "{\"code\":400,\"info\":\"图片超过4M,无法添加,请选择不超过4M的图片!\"}";
	}
	public static int[] getImgWidth(File file) {
		InputStream is = null;
		BufferedImage src = null;
		int result[] = { 0, 0 };
		try {
			is = new FileInputStream(file);
			src = javax.imageio.ImageIO.read(is);
			result[0] = src.getWidth(null); // 得到源图宽
			result[1] = src.getHeight(null); // 得到源图高
			is.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
