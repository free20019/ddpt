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
import java.util.Random;
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

import com.service.GpsServicesDelegate;
import com.tw.util.JedisUtil;


@Service
public class BackServer {
	protected JdbcTemplate jdbcTemplate = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	private JedisUtil jedisUtil = JedisUtil.getInstance();  
	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();
	private static  String WS_URL = "http://192.168.0.102:9086/EWS/GpsServicesPort?WSDL";
	public String test() {
		String gsmc = "0";
		Map<String, Object> resultmap = new HashMap<String, Object>();
		resultmap.put("test", gsmc);
		return jacksonUtil.toJson(resultmap);
	}
	/**
	 * 终端状态查询
	 * @return
	 */
	public String findmdtstate(){
		String sql = "select * from tb_mdt_state";
		return jacksonUtil.toJson(jdbcTemplate.queryForList(sql));
	}
	/**
	 * 终端状态添加
	 */
	public String addmdtstate(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String MS_NAME = String.valueOf(paramMap.get("MS_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String id = UUID.randomUUID().toString();
		String sql = "insert into tb_mdt_state values(?,?,?)";
		int count = jdbcTemplate.update(sql,id,MS_NAME,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 终端状态修改
	 */
	public String editmdtstate(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String MS_NAME = String.valueOf(paramMap.get("MS_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update tb_mdt_state set MS_NAME=?,NOTE=? where MS_ID=?";
		int count = jdbcTemplate.update(sql,MS_NAME,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 终端状态删除
	 */
	public String delmdtstate(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from tb_mdt_state where MS_ID in ("+is.substring(0, is.length()-1)+")";
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
	 * 公司表查询
	 */
	public String findgsb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String COMP_NAME = String.valueOf(paramMap.get("COMP_NAME"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(COMP_NAME!=null&&!COMP_NAME.isEmpty()&&!COMP_NAME.equals("null")&&COMP_NAME.length()>0){
			tj += " and b.ba_name like '%"+COMP_NAME+"%'";
		}
		String sql = "select (select count(*) COUNT from (select * from TB_BUSI_AREA b"
				+ ",TB_COMPANY c,TB_OWNER o where b.ba_id = c.ba_id and"
				+ " b.owner_id = o.owner_id";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select"
				+ " b.ba_name,b.note,c.comp_name,o.owner_name,b.ba_id,b.owner_id,c.comp_id from "
				+ "TB_BUSI_AREA b,TB_COMPANY c,TB_OWNER o where b.ba_id = c.ba_id"
				+ " and b.owner_id = o.owner_id";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 公司表添加
	 */
	public String addgsb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String BA_NAME = String.valueOf(paramMap.get("BA_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String OWNER_ID = String.valueOf(paramMap.get("OWNER_ID"));
		String[] COMP_NAME = utils(String.valueOf(paramMap.get("COMP_NAME")));
		String[] AREA = utils(String.valueOf(paramMap.get("AREA")));
		String[] REPAIRUSER = utils(String.valueOf(paramMap.get("REPAIRUSER")));
		String[] FGS_NOTE = utils(String.valueOf(paramMap.get("FGS_NOTE")));
		String[] FGS_OWNER_ID = utils(String.valueOf(paramMap.get("FGS_OWNER_ID")));
		String[] FGS_RE_ID = utils(String.valueOf(paramMap.get("FGS_RE_ID")));
		String BA_ID = max_owner_id(OWNER_ID);
		String sql_ba = "insert into TB_BUSI_AREA(ba_id,ba_name,note,owner_id) values(?,?,?,?)";
		int c = jdbcTemplate.update(sql_ba,BA_ID,BA_NAME,NOTE,OWNER_ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			String sql_comp = "";
			for (int i = 0; i < COMP_NAME.length; i++) {
				sql_comp = "insert into TB_COMPANY(comp_id,comp_name,ba_id,area,repairuser,re_id,owner_id,note)"
						+ " values('"+(BA_ID+"00"+(i+1))+"','"+COMP_NAME[i].trim()+"','"+BA_ID+"','"
						+AREA[i].trim()+"','"+REPAIRUSER[i].trim()+"','"+FGS_RE_ID[i].trim()+"','"+FGS_OWNER_ID[i].trim()
						+"','"+FGS_NOTE[i].trim()+"')";
				jdbcTemplate.update(sql_comp);
			}
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 根据总公司id查询所有分公司
	 */
	public String findcompall(String ba_id){
		String sql = "select c.*,r.re_name,o.owner_name from tb_company c,TB_REGION r,tb_owner o where c.re_id=r.re_id and c.owner_id=o.owner_id and c.ba_id = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,ba_id);
		return jacksonUtil.toJson(list);
	}
	/**
	 * 公司表修改
	 */
	public String editgsb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String BA_ID = String.valueOf(paramMap.get("BA_ID"));
		String BA_NAME = String.valueOf(paramMap.get("BA_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String OWNER_ID = String.valueOf(paramMap.get("OWNER_ID"));
		String[] COMP_NAME = utils(String.valueOf(paramMap.get("COMP_NAME")));
		String[] AREA = utils(String.valueOf(paramMap.get("AREA")));
		String[] REPAIRUSER = utils(String.valueOf(paramMap.get("REPAIRUSER")));
		String[] FGS_NOTE = utils(String.valueOf(paramMap.get("FGS_NOTE")));
		String[] FGS_OWNER_ID = utils(String.valueOf(paramMap.get("FGS_OWNER_ID")));
		String[] FGS_RE_ID = utils(String.valueOf(paramMap.get("FGS_RE_ID")));
//		String sql_ba = "insert into TB_BUSI_AREA(ba_id,ba_name,note,owner_id) values(?,?,?,?)";
		String sql_ba = "update TB_BUSI_AREA set ba_name=?,note=?,owner_id=? where ba_id=?";
		int c = jdbcTemplate.update(sql_ba,BA_NAME,NOTE,OWNER_ID,BA_ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			int count = jdbcTemplate.update("delete from TB_COMPANY where ba_id = ?",BA_ID);
			if(c>0){
				String sql_comp = "";
				for (int i = 0; i < COMP_NAME.length; i++) {
					sql_comp = "insert into TB_COMPANY(comp_id,comp_name,ba_id,area,repairuser,re_id,owner_id,note)"
							+ " values('"+(BA_ID+"00"+(i+1))+"','"+COMP_NAME[i].trim()+"','"+BA_ID+"','"
							+AREA[i].trim()+"','"+REPAIRUSER[i].trim()+"','"+FGS_RE_ID[i].trim()+"','"+FGS_OWNER_ID[i].trim()
							+"','"+FGS_NOTE[i].trim()+"')";
					jdbcTemplate.update(sql_comp);
				}
				map.put("info", "添加成功");
			}else{
				map.put("info", "添加失败");
			}
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 根据owenr_id 查询下次添加的最大owner_id
	 */
	public String max_owner_id(String owner_id){
		String sql = "select ba_id from TB_BUSI_AREA t where ba_id like '"+owner_id+"%' order by ba_id desc";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		if(list.size()>0){
			return (Integer.parseInt(String.valueOf(list.get(0).get("ba_id")))+1)+"";
		}else{
			return owner_id+"001";
		}
	}
	/***
	 * 传入[余杭出租, 上泗出租]类型字符串，转成数组
	 */
	public String[] utils(String s){
		String s2 = "";
		if(s.indexOf(',')!=-1){
			s2 = s.substring(1,s.length()-1);
		}else{
			s2 = s;
		}
		String[] s1 = s2.split(",");
		return s1;
	}
	/**
	 * 公司表删除
	 */
	public String delgsb(String comp_id){
		String[] ids = comp_id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from tb_company where comp_id in ("+is.substring(0, is.length()-1)+")";
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 查询有无障碍车的区块表
	 */
	public String findzacqkb(){
		String sql = "select * from TB_VEHI_NO_TYPE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	/**
	 * 添加无障碍车的区块表
	 */
	public String addzacqkb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VNT_NAME = String.valueOf(paramMap.get("VNT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = UUID.randomUUID().toString();
		String sql = "insert into TB_VEHI_NO_TYPE values(?,?,?)";
		int c = jdbcTemplate.update(sql,ID,VNT_NAME,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 修改无障碍车区块表
	 */
	public String editzacqkb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VNT_NAME = String.valueOf(paramMap.get("VNT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_VEHI_NO_TYPE set VNT_NAME=?,NOTE=? where vnt_id=?";
		int c = jdbcTemplate.update(sql,VNT_NAME,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 删除无障碍车区块表
	 */
	public String delzacqkb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_VEHI_NO_TYPE where vnt_id in ("+is.substring(0, is.length()-1)+")";
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 终端表查询
	 */
	public String findzdb(){
		String sql = "select * from TB_MDT_TYPE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("NUM", zdbnum(list.get(i).get("MT_ID").toString()));
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 * 查询每种终端的数量
	 */
	public int zdbnum(String id){
		String sql = "select mdt_no from TB_MDT where mt_id = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,id);
		int c = list.size();
		return c;
	}
	/**
	 * 终端表增加
	 */
	public String addzdb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String MT_NAME = String.valueOf(paramMap.get("MT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(UUID.randomUUID());
		String sql = "insert into TB_MDT_TYPE (MT_ID,MT_NAME,NOTE) values(?,?,?)";
		int c = jdbcTemplate.update(sql,ID,MT_NAME,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 终端表修改
	 */
	public String editzdb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String MT_NAME = String.valueOf(paramMap.get("MT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_MDT_TYPE set MT_NAME=?,NOTE=? where MT_ID=?";
		int c = jdbcTemplate.update(sql,MT_NAME,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 终端表删除
	 */
	public String delzdb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_MDT_TYPE where MT_ID in ("+is.substring(0, is.length()-1)+")";
//		System.out.println(sql);
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 车型表查询
	 */
	public String findcxb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VT_NAME = String.valueOf(paramMap.get("VT_NAME"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(VT_NAME!=null&&!VT_NAME.isEmpty()&&!VT_NAME.equals("null")&&VT_NAME.length()>0){
			tj += " and VT_NAME like '%"+VT_NAME+"%'";
		}
		String sql = "select (select count(*) COUNT from (select * from TB_VEHI_TYPE"
				+ " where 1=1 ";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select"
				+ " * from "
				+ "TB_VEHI_TYPE where 1=1";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("NUM", findcxbnum(list.get(i).get("vt_id").toString()));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 根据车型id查询该车型有多少辆车
	 */
	public int findcxbnum(String id){
		String sql = "select vehi_no from TB_VEHICLE where vt_id = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,id);
		int c = list.size();
		return c;
	}
	/**
	 * 车型表增加
	 */
	public String addcxb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VT_NAME = String.valueOf(paramMap.get("VT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(UUID.randomUUID());
		String sql = "insert into TB_VEHI_TYPE(vt_id,vt_name,note) values (?,?,?)";
		int c = jdbcTemplate.update(sql,ID,VT_NAME,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 车型表修改
	 */
	public String editcxb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VT_NAME = String.valueOf(paramMap.get("VT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_VEHI_TYPE set vt_name = ?,note = ? where vt_id = ?";
		int c = jdbcTemplate.update(sql,VT_NAME,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 车型表删除
	 */
	public String delcxb(String vt_id){
		String[] ids = vt_id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_VEHI_TYPE where vt_id  in ("+is.substring(0, is.length()-1)+")";
//		System.out.println(sql);
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 颜色表查询
	 */
	public String findysb(){
		String sql = "select * from TB_VEHI_COLOR";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("NUM", ysbnum(list.get(i).get("VC_ID").toString()));
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 * 查询每种颜色的数量
	 */
	public int ysbnum(String id){
		String sql = "select VEHI_NO from TB_VEHICLE where vc_id = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,id);
		int c = list.size();
		return c;
	}
	/**
	 * 颜色表增加
	 */
	public String addysb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VC_NAME = String.valueOf(paramMap.get("VC_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(UUID.randomUUID());
		String sql = "insert into TB_VEHI_COLOR (VC_ID,VC_NAME,NOTE) values(?,?,?)";
		int c = jdbcTemplate.update(sql,ID,VC_NAME,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 颜色表修改
	 */
	public String editysb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VC_NAME = String.valueOf(paramMap.get("VC_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_VEHI_COLOR set VC_NAME=?,NOTE=? where VC_ID=?";
		int c = jdbcTemplate.update(sql,VC_NAME,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 颜色表删除
	 */
	public String delysb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_VEHI_COLOR where VC_ID in ("+is.substring(0, is.length()-1)+")";
//		System.out.println(sql);
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 通信表查询
	 */
	public String findtxb(){
		String sql = "select * from TB_COMM_TYPE";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).put("NUM", txbnum(list.get(i).get("CT_ID").toString()));
		}
		return jacksonUtil.toJson(list);
	}
	/**
	 * 查询每种通信类型的数量
	 */
	public int txbnum(String id){
		String sql = "select mdt_no from TB_MDT where ct_id = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,id);
		int c = list.size();
		return c;
	}
	/**
	 * 通信表增加
	 */
	public String addtxb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CT_NAME = String.valueOf(paramMap.get("CT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(UUID.randomUUID());
		String sql = "insert into TB_COMM_TYPE (CT_ID,CT_NAME,NOTE) values(?,?,?)";
		int c = jdbcTemplate.update(sql,ID,CT_NAME,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 通信表修改
	 */
	public String edittxb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CT_NAME = String.valueOf(paramMap.get("CT_NAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_COMM_TYPE set CT_NAME=?,NOTE=? where CT_ID=?";
		int c = jdbcTemplate.update(sql,CT_NAME,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 通信表删除
	 */
	public String deltxb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_COMM_TYPE where CT_ID in ("+is.substring(0, is.length()-1)+")";
//		System.out.println(sql);
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 调度表查询
	 */
	public String findddb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String STIME = String.valueOf(paramMap.get("STIME"));//开始时间
		String ETIME = String.valueOf(paramMap.get("ETIME"));//结束时间
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));//客户姓名
		String CUST_TEL = String.valueOf(paramMap.get("CUST_TEL"));//客户电话
		String ADDRESS_REF = String.valueOf(paramMap.get("ADDRESS_REF"));//参考地址
		String ADDRESS = String.valueOf(paramMap.get("ADDRESS"));//详细地址
		String DISP_TYPE = String.valueOf(paramMap.get("DISP_TYPE"));//调度类型
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String table = STIME.substring(2, 4)+STIME.substring(5, 7);
		String tj = "";
		if(CUST_NAME!=null&&!CUST_NAME.isEmpty()&&!CUST_NAME.equals("null")&&CUST_NAME.length()>0){
			tj += " and CUST_NAME like '%"+CUST_NAME+"%'";
		}
		if(CUST_TEL!=null&&!CUST_TEL.isEmpty()&&!CUST_TEL.equals("null")&&CUST_TEL.length()>0){
			tj += " and CUST_TEL like '%"+CUST_TEL+"%'";
		}
		if(ADDRESS_REF!=null&&!ADDRESS_REF.isEmpty()&&!ADDRESS_REF.equals("null")&&ADDRESS_REF.length()>0){
			tj += " and ADDRESS_REF like '%"+ADDRESS_REF+"%'";
		}
		if(ADDRESS!=null&&!ADDRESS.isEmpty()&&!ADDRESS.equals("null")&&ADDRESS.length()>0){
			tj += " and ADDRESS like '%"+ADDRESS+"%'";
		}
		if(DISP_TYPE!=null&&!DISP_TYPE.isEmpty()&&!DISP_TYPE.equals("请选择")){
			tj += " and DISP_TYPE like '%"+DISP_TYPE+"%'";
		}
		String sql = "select (select count(*) COUNT from (select * from TB_DISPATCH_"+table
				+ " where DISP_TIME >= to_date('"+STIME+"','yyyy-mm-dd hh24:mi:ss') and"
				+ " DISP_TIME <= to_date('"+ETIME+"','yyyy-mm-dd hh24:mi:ss')";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select"
				+ " * from "
				+ "TB_DISPATCH_"+table+" where DISP_TIME >= to_date('"+STIME+"','yyyy-mm-dd hh24:mi:ss')"
				+ " and DISP_TIME <= to_date('"+ETIME+"','yyyy-mm-dd hh24:mi:ss')";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 调度表修改
	 */
	public String editddb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String DISP_USER = String.valueOf(paramMap.get("DISP_USER"));//调度员编号
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));//派车车号
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));//乘客姓名
		String CUST_TEL = String.valueOf(paramMap.get("CUST_TEL"));//乘客电话
		String ADDRESS = String.valueOf(paramMap.get("ADDRESS"));//详细地址
		String ADDRESS_REF = String.valueOf(paramMap.get("ADDRESS_REF"));//参考地址
		String VEHI_NUM = String.valueOf(paramMap.get("VEHI_NUM"));//派车数量
		int VEHI_NUMS = 0;
		if(!VEHI_NUM.equals("null")){
			VEHI_NUMS = Integer.parseInt(VEHI_NUM);
		}
		String DEST_ADDRESS = String.valueOf(paramMap.get("DEST_ADDRESS"));//目的地
		String ISLONG = String.valueOf(paramMap.get("ISLONG"));//是否长途
		String is = "";
		if(ISLONG!=null&&ISLONG.length()>0){
			if(ISLONG.equals("是")){
				is = "0";
			}else{
				is = "1";
			}
		}
		String NOTE = String.valueOf(paramMap.get("NOTE"));//备注STIME
		String DISP_ID = String.valueOf(paramMap.get("DISP_ID"));//业务编号
		String STIME = String.valueOf(paramMap.get("STIME"));//备注
		String table = STIME.substring(2, 4)+STIME.substring(5, 7);
		String sql = "update TB_DISPATCH_"+table +" set DISP_USER='"+DISP_USER+"',VEHI_NO='"
				+VEHI_NO+"',CUST_NAME='"+CUST_NAME+"',CUST_TEL='"+CUST_TEL+"',"
				+ "ADDRESS='"+ADDRESS+"',ADDRESS_REF='"+ADDRESS_REF+"',VEHI_NUM="+VEHI_NUMS+",DEST_ADDRESS='"
				+DEST_ADDRESS+"',ISLONG="+is+",NOTE='"+NOTE+"' where DISP_ID='"+DISP_ID+"'";
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 调度表删除
	 */
	public String delddb(String id,String stime){
		String table = stime.substring(2, 4)+stime.substring(5, 7);
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_DISPATCH_"+table +" where DISP_ID in ("+is.substring(0, is.length()-1)+")";
//		System.out.println(sql);
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 定位表查询
	 */
	public String finddwb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String PNAME = String.valueOf(paramMap.get("PNAME"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(PNAME!=null&&!PNAME.isEmpty()&&!PNAME.equals("null")&&PNAME.length()>0){
			tj += " and PNAME like '%"+PNAME+"%'";
		}
		String sql = "select (select count(*) COUNT from (select * from TB_GPS_POINT"
				+ " where 1=1";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select"
				+ " * from TB_GPS_POINT where 1=1";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		System.out.println(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 定位表增加
	 */
	public String adddwb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String PNAME = String.valueOf(paramMap.get("PNAME"));
		String GPNAME = String.valueOf(paramMap.get("GPNAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(UUID.randomUUID());
		String sql = "insert into TB_GPS_POINT values(?,?,?,?)";
		int c = jdbcTemplate.update(sql,ID,PNAME,GPNAME,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 定位表修改
	 */
	public String editdwb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String PNAME = String.valueOf(paramMap.get("PNAME"));
		String GPNAME = String.valueOf(paramMap.get("GPNAME"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_GPS_POINT set PNAME=?,GPNAME=?,NOTE=? where GP_ID=?";
		int c = jdbcTemplate.update(sql,PNAME,GPNAME,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 定位表删除
	 */
	public String deldwb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_GPS_POINT where GP_ID in ("+is.substring(0, is.length()-1)+")";
//		System.out.println(sql);
		int c = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(c>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 区域表查询
	 * @return
	 */
	public String findqyb(){
		String sql = "select r.*,m.map_name from TB_REGION r,tb_map m where r.map_id=m.map_id";
		return jacksonUtil.toJson(jdbcTemplate.queryForList(sql));
	}
	/**
	 * 区域表添加
	 */
	public String addqyb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String RE_NAME = String.valueOf(paramMap.get("RE_NAME"));
		String RE_NUM = String.valueOf(paramMap.get("RE_NUM"));
		String RE_TYPE = String.valueOf(paramMap.get("RE_TYPE"));
		String MAP_ID = String.valueOf(paramMap.get("MAP_ID"));
		String PARENT_ID = String.valueOf(paramMap.get("PARENT_ID"));
		String PARE_PATH = String.valueOf(paramMap.get("PARE_PATH"));
		String LONGI = String.valueOf(paramMap.get("LONGI"));
		String a =null,b=null,c=null;
		if(!LONGI.equals("null")){
			a = LONGI;
		}
		String LATI = String.valueOf(paramMap.get("LATI"));
		if(!LATI.equals("null")){
			b = LONGI;
		}
		String ORDER_ID = String.valueOf(paramMap.get("ORDER_ID"));
		if(!ORDER_ID.equals("null")){
			c = LONGI;
		}
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = UUID.randomUUID().toString();
		String sql = "insert into TB_REGION (RE_ID,RE_NAME,RE_NUM,RE_TYPE,MAP_ID,PARENT_ID,"
				+ "PARE_PATH,LONGI,LATI,ORDER_ID,NOTE) values(?,?,?,?,?,?,?,?,?,?,?)";
		int count = jdbcTemplate.update(sql,ID,RE_NAME,RE_NUM,RE_TYPE,MAP_ID,PARENT_ID,PARE_PATH,a,b,c,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 区域表修改
	 */
	public String editqyb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String RE_NAME = String.valueOf(paramMap.get("RE_NAME"));
		String RE_NUM = String.valueOf(paramMap.get("RE_NUM"));
		String RE_TYPE = String.valueOf(paramMap.get("RE_TYPE"));
		String MAP_ID = String.valueOf(paramMap.get("MAP_ID"));
		String PARENT_ID = String.valueOf(paramMap.get("PARENT_ID"));
		String PARE_PATH = String.valueOf(paramMap.get("PARE_PATH"));
		String LONGI = String.valueOf(paramMap.get("LONGI"));
		String a =null,b=null,c=null;
		if(!LONGI.equals("null")){
			a = LONGI;
		}
		String LATI = String.valueOf(paramMap.get("LATI"));
		if(!LATI.equals("null")){
			b = LONGI;
		}
		String ORDER_ID = String.valueOf(paramMap.get("ORDER_ID"));
		if(!ORDER_ID.equals("null")){
			c = LONGI;
		}
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_REGION set RE_NAME=?,RE_NUM=?,RE_TYPE=?,MAP_ID=?,PARENT_ID=?,"
				+ "PARE_PATH=?,LONGI=?,LATI=?,ORDER_ID=?,NOTE=? where RE_ID=?";
		int count = jdbcTemplate.update(sql,RE_NAME,RE_NUM,RE_TYPE,MAP_ID,PARENT_ID,PARE_PATH,a,b,c,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 区域表删除
	 */
	public String delqyb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_REGION where RE_ID in ("+is.substring(0, is.length()-1)+")";
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
	 * 客户表查询
	 * @return
	 */
	public String findkhb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(CUST_NAME!=null&&!CUST_NAME.isEmpty()&&!CUST_NAME.equals("null")&&CUST_NAME.length()>0){
			tj += " and CUST_NAME like '%"+CUST_NAME+"%'";
		}
		String sql = "select (select count(*) COUNT from (select * from TB_ADDRESS_BOOK"
				+ " where 1=1";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select"
				+ " * from TB_ADDRESS_BOOK where 1=1";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 客户表添加
	 */
	public String addkhb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));
		String CUST_TEL = String.valueOf(paramMap.get("CUST_TEL"));
		String CUST_ADDR = String.valueOf(paramMap.get("CUST_ADDR"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String id = UUID.randomUUID().toString();
		String sql = "insert into TB_ADDRESS_BOOK values(?,?,?,?,?)";
		int count = jdbcTemplate.update(sql,id,CUST_NAME,CUST_TEL,CUST_ADDR,NOTE);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 客户表修改
	 */
	public String editkhb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));
		String CUST_TEL = String.valueOf(paramMap.get("CUST_TEL"));
		String CUST_ADDR = String.valueOf(paramMap.get("CUST_ADDR"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_ADDRESS_BOOK set CUST_NAME=?,CUST_TEL=?,CUST_ADDR=?,NOTE=? where AB_ID=?";
		int count = jdbcTemplate.update(sql,CUST_NAME,CUST_TEL,CUST_ADDR,NOTE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 客户表删除
	 */
	public String delkhb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_ADDRESS_BOOK where AB_ID in ("+is.substring(0, is.length()-1)+")";
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
	 * 车辆表查询
	 */
	public String findclb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String BA_ID = String.valueOf(paramMap.get("BA_ID"));
		String COMP_ID = String.valueOf(paramMap.get("COMP_ID"));
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		String GJZ = String.valueOf(paramMap.get("GJZ"));
		String STIME = String.valueOf(paramMap.get("STIME"));
		String ETIME = String.valueOf(paramMap.get("ETIME"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(BA_ID!=null&&!BA_ID.isEmpty()&&!BA_ID.equals("null")&&BA_ID.length()>0&&!BA_ID.equals("请选择公司")){
			tj += " and a.BA_NAME like '%"+BA_ID+"%'";
			if(COMP_ID!=null&&!COMP_ID.isEmpty()&&!COMP_ID.equals("null")&&COMP_ID.length()>0&&!COMP_ID.equals("请选择分公司")){
				tj += " and a.COMP_NAME like '%"+COMP_ID+"%'";
			}
		}
		if(VEHI_NO!=null&&!VEHI_NO.isEmpty()&&!VEHI_NO.equals("null")&&VEHI_NO.length()>0){
			tj += " and (a.VEHI_NO like '%"+VEHI_NO+"%' or a.mdt_no like '%"+VEHI_NO+"%' or a.sim_num like '%"+VEHI_NO+"%')";
		}
		if(GJZ!=null&&!GJZ.isEmpty()&&!GJZ.equals("null")&&GJZ.length()>0){
			tj += " and (a.VEHI_NUM like '%"+GJZ+"%' or a.mt_name like '%"+GJZ+"%'"
					+ " or a.own_name like '%"+GJZ+"%' or a.note like '%"+GJZ+"%'"
					+ " or a.VSIM_NUM like '%"+GJZ+"%' or sub_name like '%"+GJZ+"%')";
		}
		if(STIME!=null&&!STIME.isEmpty()&&!STIME.equals("null")&&STIME.length()>0){
			tj += " and MTN_TIME >= to_date('"+STIME+"','yyyy-mm-dd')";
		}
		if(ETIME!=null&&!ETIME.isEmpty()&&!ETIME.equals("null")&&ETIME.length()>0){
			tj += " and MTN_TIME <= to_date('"+ETIME+"','yyyy-mm-dd')";
		}
		String sql = "select (select count(*) COUNT from (select a.*,vt.vt_name,vnc_name,vs.vs_name,ct.CT_NAME"
				+ " from (select v.*,b.ba_name,c.comp_name,m.mdt_no,mt.mt_name,vc_name,m.MDT_SUB_TYPE,"
				+ "m.ct_id,m.subid,b.owner_id owner_id1 from TB_VEHICLE v, TB_BUSI_AREA b,TB_COMPANY c, TB_MDT m,TB_MDT_TYPE mt,"
				+ " TB_VEHI_COLOR vc where v.ba_id = b.ba_id and v.comp_id = c.comp_id"
				+ " and v.mdt_id = m.mdt_id and m.mt_id = mt.mt_id and v.vc_id = vc.vc_id) a left join TB_VEHI_TYPE vt"
				+ " on a.vt_id = vt.vt_id left join TB_VEHI_NO_COLOR vnc on a.vnc_id = vnc.vnc_id left join TB_VEHI_STATE vs"
				+ " on a.vs_id = vs.vs_id left join TB_COMM_TYPE ct on a.ct_id = ct.ct_id"
				+ " left join HZGPS_TAXI.TB_MDT_SUB_TYPE mst on a.SUBID=mst.SUBID left join tb_owner t on a.owner_id1 = t.owner_id  where 1=1";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select a.*,vt.vt_name,vnc_name,vs.vs_name,ct.CT_NAME,t.owner_name vnt_name"
				+ " from (select v.*,b.ba_name,c.comp_name,m.mdt_no,mt.mt_name,vc_name,m.MDT_SUB_TYPE,"
				+ "m.ct_id,m.subid,b.owner_id owner_id1 from TB_VEHICLE v, TB_BUSI_AREA b,TB_COMPANY c, TB_MDT m,TB_MDT_TYPE mt,"
				+ " TB_VEHI_COLOR vc where v.ba_id = b.ba_id and v.comp_id = c.comp_id"
				+ " and v.mdt_id = m.mdt_id and m.mt_id = mt.mt_id and v.vc_id = vc.vc_id) a left join TB_VEHI_TYPE vt"
				+ " on a.vt_id = vt.vt_id left join TB_VEHI_NO_COLOR vnc on a.vnc_id = vnc.vnc_id left join TB_VEHI_STATE vs"
				+ " on a.vs_id = vs.vs_id left join TB_COMM_TYPE ct on a.ct_id = ct.ct_id"
				+ " left join HZGPS_TAXI.TB_MDT_SUB_TYPE mst on a.SUBID=mst.SUBID left join tb_owner t on a.owner_id1 = t.owner_id where 1=1";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for (int i = 0; i < list.size(); i++) {
				list.get(i).put("MDTINFO", jdbcTemplate.queryForList("select a.*,mt.mt_name,ct.ct_name,ms.ms_name,mst.sub_name from"
						+ " (select m.* from HZGPS_TAXI.tb_mdt m where mdt_id = ?) a"
						+ " left join HZGPS_TAXI.TB_MDT_SUB_TYPE mst on a.SUBID=mst.SUBID left join HZGPS_TAXI.TB_MDT_TYPE mt"
						+ " on a.mt_id=mt.mt_id left join HZGPS_TAXI.TB_COMM_TYPE ct on a.ct_id=ct.ct_id left join"
						+ " HZGPS_TAXI.TB_MDT_STATE ms on a.ms_id=ms.ms_id",list.get(i).get("MDT_ID").toString()));
			}
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 车辆表终端表添加
	 */
	public String addclb(String postData,HttpServletRequest request){
		String LAST_UPDATE = String.valueOf(request.getSession().getAttribute("username"));
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String BA_ID = gP(String.valueOf(paramMap.get("BA_ID")));//公司
		String COMP_ID = gP(String.valueOf(paramMap.get("COMP_ID")));//分公司VEHI_NUM
//		String VEHI_NUM = gP(String.valueOf(paramMap.get("VEHI_NUM")));//车辆编号
		String VEHI_NUM = sdf.format(new Date());
		String SIM_NUM = gP(String.valueOf(paramMap.get("SIM_NUM")));//SIM卡号
		String VEHI_NO = gP(String.valueOf(paramMap.get("VEHI_NO")));//车牌号码
		String OWN_NAME = gP(String.valueOf(paramMap.get("OWN_NAME")));//车主姓名
		String VT_ID = gP(String.valueOf(paramMap.get("VT_ID")));//车辆类型
		String OWN_TEL = gP(String.valueOf(paramMap.get("OWN_TEL")));//车主电话
		String HOME_TEL = gP(String.valueOf(paramMap.get("HOME_TEL")));//白班电话
		String NIGHT_TEL = gP(String.valueOf(paramMap.get("NIGHT_TEL")));//晚班电话
		String VC_ID = gP(String.valueOf(paramMap.get("VC_ID")));//车辆颜色
		String MTN_TIME = String.valueOf(paramMap.get("MTN_TIME"));//初装时间
		String VNT_ID = gP(String.valueOf(paramMap.get("VNT_ID")));//车牌类型
		String QRY_PWD = gP(String.valueOf(paramMap.get("QRY_PWD")));//查询密码
		String BASIS_COMP = gP(String.valueOf(paramMap.get("BASIS_COMP")));//车辆子公司
		String OIL_TYPE = gP(String.valueOf(paramMap.get("OIL_TYPE")));//计价器类型
		String VS_ID = gP(String.valueOf(paramMap.get("VS_ID")));//车辆状态
		String SERVICE_STATUS = gP(String.valueOf(paramMap.get("SERVICE_STATUS"))).equals("null")?"":gP(String.valueOf(paramMap.get("SERVICE_STATUS")));//服务状态
		String VSIM_NUM = gP(String.valueOf(paramMap.get("VSIM_NUM")));//虚拟网
		String RECONSTRUCT_DATE = String.valueOf(paramMap.get("RECONSTRUCT_DATE"));//改造时间
		String UP_DATE = String.valueOf(paramMap.get("UP_DATE"));//升级时间
		String VNC_ID = gP(String.valueOf(paramMap.get("VNC_ID")));//车牌颜色
		String DR_NO = gP(String.valueOf(paramMap.get("DR_NO")));//应急车辆
		String CHANGE_BUI_TIME = String.valueOf(paramMap.get("CHANGE_BUI_TIME"));//交接班时间
		String CHANGE_BUI_ADDR = gP(String.valueOf(paramMap.get("CHANGE_BUI_ADDR")));//交接班地点
		String CL_NOTE = gP(String.valueOf(paramMap.get("CL_NOTE")));//备注
		String TC_RLLX = gP(String.valueOf(paramMap.get("TC-RLLX")));//燃料类型
		String VEHI_ID = UUID.randomUUID().toString();//车辆id
		String MDT_ID = UUID.randomUUID().toString();//终端id
		List<Map<String, Object>> abc = jdbcTemplate.queryForList("select vehi_no from tb_vehicle where vehi_no = '"+VEHI_NO+"'");
		Map<String, String> map = new HashMap<String, String>();
		if(abc.size()>0){
			map.put("info", "该车牌号已存在，请勿重复添加！");
			return jacksonUtil.toJson(map);
		}
		List<Map<String, Object>> sim = jdbcTemplate.queryForList("select vehi_no from tb_vehicle where SIM_NUM = '"+SIM_NUM+"'");
		if(sim.size()>0){
			map.put("info", "该SIM卡号已存在，请勿重复添加！");
			return jacksonUtil.toJson(map);
		}
		String sql = "insert into tb_vehicle (BA_ID,COMP_ID,VEHI_NUM,SIM_NUM,VEHI_NO,"
				+ "OWN_NAME,VT_ID,OWN_TEL,HOME_TEL,NIGHT_TEL,"
				+ "VC_ID,VNT_ID,QRY_PWD,BASIS_COMP,OIL_TYPE,VS_ID,SERVICE_STATUS,VSIM_NUM,"
				+ "VNC_ID,DR_NO,CHANGE_BUI_TIME,CHANGE_BUI_ADDR,NOTE,LAST_UPDATE,VEHI_ID,MDT_ID,RLLX,";
		if(RECONSTRUCT_DATE!=null&&!RECONSTRUCT_DATE.equals("null")){
			sql+="RECONSTRUCT_DATE,";
		}
		if(UP_DATE!=null&&!UP_DATE.equals("null")){
			sql+= "UP_DATE,";
		}
		if(MTN_TIME!=null&&!MTN_TIME.equals("null")){
			sql+= "MTN_TIME,";
		}
		sql = sql.substring(0, sql.length()-1);
		sql+=") values ('"+BA_ID+"','"+COMP_ID+"',"
				+ "'"+VEHI_NUM+"','"+SIM_NUM+"','"+VEHI_NO+"','"+OWN_NAME+"','"+VT_ID+"','"+OWN_TEL+"',"
				+ "'"+HOME_TEL+"','"+NIGHT_TEL+"','"+VC_ID+"','"+VNT_ID+"','"+QRY_PWD+"','"+BASIS_COMP+"',"
				+ "'"+OIL_TYPE+"','"+VS_ID+"','"+SERVICE_STATUS+"','"+VSIM_NUM+"',"
				+ "'"+VNC_ID+"','"+DR_NO+"','"+CHANGE_BUI_TIME+"','"+CHANGE_BUI_ADDR+"',"
				+ "'"+CL_NOTE+"','"+LAST_UPDATE+"','"+VEHI_ID+"','"+MDT_ID+"','"+TC_RLLX+"',";
		if(RECONSTRUCT_DATE!=null&&!RECONSTRUCT_DATE.equals("null")){
			sql+= "to_date('"+RECONSTRUCT_DATE+"','yyyy-mm-dd'),";
		}
		if(UP_DATE!=null&&!UP_DATE.equals("null")){
			sql+= "to_date('"+UP_DATE+"','yyyy-mm-dd'),";
		}
		if(MTN_TIME!=null&&!MTN_TIME.equals("null")){
			sql+= "to_date('"+MTN_TIME+"','yyyy-mm-dd'),";
		}
		sql = sql.substring(0, sql.length()-1);
		sql+=")";
//		System.out.println(sql);
		int c = jdbcTemplate.update(sql);
		String MT_ID = gP(String.valueOf(paramMap.get("MT_ID")));//终端类型名称
		String MDT_NO = gP(String.valueOf(paramMap.get("MDT_NO")));//终端编号
		String DISP_TYPE = gP(String.valueOf(paramMap.get("DISP_TYPE")));//调度类型
		String REPORT_IP = String.valueOf(paramMap.get("REPORT_IP"));//报告ip
		String TALK_FUNC = gP(String.valueOf(paramMap.get("TALK_FUNC")));//通话功能
		String INST_MAN = gP(String.valueOf(paramMap.get("INST_MAN")));//安装人员
		String CT_ID = gP(String.valueOf(paramMap.get("CT_ID")));//通信类型名
		String INST_TIME = String.valueOf(paramMap.get("INST_TIME"));//初创时间
		String MS_ID = gP(String.valueOf(paramMap.get("MS_ID")));//终端状态
		String SUBID = gP(String.valueOf(paramMap.get("SUBID")));//终端型号
		String ALERT_MALFUNC = gP(String.valueOf(paramMap.get("ALERT_MALFUNC")));//报警过滤
		String RCV_PORT = String.valueOf(paramMap.get("RCV_PORT"));//接受端口
		String GPS_PORT = String.valueOf(paramMap.get("GPS_PORT"));//gps端口
		String SEND_PORT = String.valueOf(paramMap.get("SEND_PORT"));//发送端口
		String MDT_MID = gP(String.valueOf(paramMap.get("MDT_MID")));//终端设备id
		String ZZ_NOTE = gP(String.valueOf(paramMap.get("ZZ_NOTE")));//终端备注
		
		if(c>0){
			String sql1 = "insert into tb_mdt (BA_ID,COMP_ID,MT_ID,MDT_NO,DISP_TYPE,REPORT_IP,"
					+ "TALK_FUNC,INST_MAN,CT_ID,"
					+ "MS_ID,SUBID,ALERT_MALFUNC,RCV_PORT,GPS_PORT,SEND_PORT,MDT_MID,NOTE,MDT_ID,";
			if(INST_TIME!=null&&!INST_TIME.equals("null")){
				sql1+="INST_TIME,";
			}
			sql1 = sql1.substring(0, sql1.length()-1);
			sql1+=") values ('"+BA_ID+"','"+COMP_ID+"',"
					+ "'"+MT_ID+"','"+MDT_NO+"','"+DISP_TYPE+"','"+REPORT_IP+"','"+TALK_FUNC+"','"+INST_MAN+"','"+CT_ID+"',"
					+ "'"+MS_ID+"','"+SUBID+"','"+ALERT_MALFUNC+"','"+RCV_PORT+"','"+GPS_PORT+"','"+SEND_PORT+"','"+MDT_MID+"','"+ZZ_NOTE+"','"+MDT_ID+"',";
			if(INST_TIME!=null&&!INST_TIME.equals("null")){
				sql1+="to_date('"+INST_TIME+"','yyyy-mm-dd hh24:mi:ss'),";
			}
			sql1 = sql1.substring(0, sql1.length()-1);
			sql1+=")";
//			System.out.println(sql1);
			jdbcTemplate.update(sql1);
			String status = "insert into TB_MDT_STATUS (mdt_id,vehi_id,mdt_no,longi,lati,px,py,insert_time) values ('"+MDT_ID+"','"+VEHI_ID+"','"+MDT_NO+"',0,0,0,0,sysdate)";
			jdbcTemplate.update(status);
			SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String rq = sdf1.format(new Date());
			jedisUtil.addjddsb(MDT_NO, "{\"isPrecise\":0,\"mdtType\":1,\"latitude\":0,\"px\":0,\"py\":0,\"vehi_id\":\""+VEHI_ID+"\",\"isu\":\""+MDT_NO+"\",\"mdt_id\":\""+MDT_ID+"\",\"speed\":0,\"lockState\":0,\"positionTime\":\""+rq+"\",\"vehi_no\":\""+VEHI_NO+"\",\"emptyOrHeavy\":0,\"longitude\":0,\"direction\":0}");
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editclb(String postData,HttpServletRequest request){
		String LAST_UPDATE = String.valueOf(request.getSession().getAttribute("username"));
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String BA_ID = gP(String.valueOf(paramMap.get("BA_ID")));//公司
		String COMP_ID = gP(String.valueOf(paramMap.get("COMP_ID")));//分公司VEHI_NUM
//		String VEHI_NUM = gP(String.valueOf(paramMap.get("VEHI_NUM")));//车辆编号
		String SIM_NUM = gP(String.valueOf(paramMap.get("SIM_NUM")));//SIM卡号
		String VEHI_NO = gP(String.valueOf(paramMap.get("VEHI_NO")));//车牌号码
		String OWN_NAME = gP(String.valueOf(paramMap.get("OWN_NAME")));//车主姓名
		String VT_ID = gP(String.valueOf(paramMap.get("VT_ID")));//车辆类型
		String OWN_TEL = gP(String.valueOf(paramMap.get("OWN_TEL")));//车主电话
		String HOME_TEL = gP(String.valueOf(paramMap.get("HOME_TEL")));//白班电话
		String NIGHT_TEL = gP(String.valueOf(paramMap.get("NIGHT_TEL")));//晚班电话
		String VC_ID = gP(String.valueOf(paramMap.get("VC_ID")));//车辆颜色
		String MTN_TIME = String.valueOf(paramMap.get("MTN_TIME"));//初装时间
		String VNT_ID = gP(String.valueOf(paramMap.get("VNT_ID")));//车牌类型
		String QRY_PWD = gP(String.valueOf(paramMap.get("QRY_PWD")));//查询密码
		String BASIS_COMP = gP(String.valueOf(paramMap.get("BASIS_COMP")));//车辆子公司
		String OIL_TYPE = gP(String.valueOf(paramMap.get("OIL_TYPE")));//计价器类型
		String VS_ID = gP(String.valueOf(paramMap.get("VS_ID")));//车辆状态
		String SERVICE_STATUS = gP(String.valueOf(paramMap.get("SERVICE_STATUS"))).equals("null")?"":gP(String.valueOf(paramMap.get("SERVICE_STATUS")));//服务状态
		String VSIM_NUM = gP(String.valueOf(paramMap.get("VSIM_NUM")));//虚拟网
		String RECONSTRUCT_DATE = String.valueOf(paramMap.get("RECONSTRUCT_DATE"));//改造时间
		String UP_DATE = String.valueOf(paramMap.get("UP_DATE"));//升级时间
		String VNC_ID = gP(String.valueOf(paramMap.get("VNC_ID")));//车牌颜色
		String DR_NO = gP(String.valueOf(paramMap.get("DR_NO")));//应急车辆
		String CHANGE_BUI_TIME = String.valueOf(paramMap.get("CHANGE_BUI_TIME"));//交接班时间
		String CHANGE_BUI_ADDR = gP(String.valueOf(paramMap.get("CHANGE_BUI_ADDR")));//交接班地点
		String CL_NOTE = gP(String.valueOf(paramMap.get("CL_NOTE")));//备注
		String VEHI_ID = gP(String.valueOf(paramMap.get("VEHI_ID")));//车辆id
		String TC_RLLX = gP(String.valueOf(paramMap.get("TC-RLLX")));//燃料类型
		List<Map<String, Object>> abc = jdbcTemplate.queryForList("select vehi_no from tb_vehicle where vehi_no = '"+VEHI_NO+"' and vehi_id <> '"+VEHI_ID+"'");
		Map<String, String> map = new HashMap<String, String>();
		if(abc.size()>0){
			map.put("info", "该车牌号已存在，请勿重复添加！");
			return jacksonUtil.toJson(map);
		}
		List<Map<String, Object>> sim = jdbcTemplate.queryForList("select vehi_no from tb_vehicle where SIM_NUM = '"+SIM_NUM+"' and vehi_id <> '"+VEHI_ID+"'");
		if(sim.size()>0){
			map.put("info", "该SIM卡号已存在，请勿重复添加！");
			return jacksonUtil.toJson(map);
		}
		String sql = "update tb_vehicle set BA_ID='"+BA_ID+"',COMP_ID='"+COMP_ID+"',SIM_NUM='"+SIM_NUM+"',VEHI_NO='"+VEHI_NO+"',"
				+ "OWN_NAME='"+OWN_NAME+"',VT_ID='"+VT_ID+"',OWN_TEL='"+OWN_TEL+"',HOME_TEL='"+HOME_TEL+"',NIGHT_TEL='"+NIGHT_TEL+"',"
				+ "VC_ID='"+VC_ID+"',VNT_ID='"+VNT_ID+"',QRY_PWD='"+QRY_PWD+"',BASIS_COMP='"+BASIS_COMP+"',OIL_TYPE='"+OIL_TYPE
				+"',VS_ID='"+VS_ID+"',SERVICE_STATUS='"+SERVICE_STATUS+"',VSIM_NUM='"+VSIM_NUM+"',RLLX='"+TC_RLLX+"',"
				+ "VNC_ID='"+VNC_ID+"',DR_NO='"+DR_NO+"',CHANGE_BUI_TIME='"+CHANGE_BUI_TIME+"',CHANGE_BUI_ADDR='"
				+CHANGE_BUI_ADDR+"',NOTE='"+CL_NOTE+"',LAST_UPDATE='"+LAST_UPDATE+"',VEHI_ID='"+VEHI_ID+"',"
				+ "RECONSTRUCT_DATE=to_date('"+RECONSTRUCT_DATE+"','yyyy-mm-dd'),UP_DATE=to_date('"
				+UP_DATE+"','yyyy-mm-dd'),MTN_TIME=to_date('"+MTN_TIME+"','yyyy-mm-dd') where VEHI_ID = '"+VEHI_ID+"'";
		int c = jdbcTemplate.update(sql);
		String MT_ID = gP(String.valueOf(paramMap.get("MT_ID")));//终端类型名称
		String MDT_NO = gP(String.valueOf(paramMap.get("MDT_NO")));//终端编号
		String DISP_TYPE = gP(String.valueOf(paramMap.get("DISP_TYPE")));//调度类型
		String REPORT_IP = String.valueOf(paramMap.get("REPORT_IP"));//报告ip
		String TALK_FUNC = gP(String.valueOf(paramMap.get("TALK_FUNC")));//通话功能
		String INST_MAN = gP(String.valueOf(paramMap.get("INST_MAN")));//安装人员
		String CT_ID = gP(String.valueOf(paramMap.get("CT_ID")));//通信类型名
		String MS_ID = gP(String.valueOf(paramMap.get("MS_ID")));//终端状态
		String SUBID = gP(String.valueOf(paramMap.get("SUBID")));//终端型号
		String ALERT_MALFUNC = gP(String.valueOf(paramMap.get("ALERT_MALFUNC")));//报警过滤
		String RCV_PORT = String.valueOf(paramMap.get("RCV_PORT"));//接受端口
		String GPS_PORT = String.valueOf(paramMap.get("GPS_PORT"));//gps端口
		String SEND_PORT = String.valueOf(paramMap.get("SEND_PORT"));//发送端口
		String MDT_MID = gP(String.valueOf(paramMap.get("MDT_MID")));//终端设备id
		String ZZ_NOTE = gP(String.valueOf(paramMap.get("ZZ_NOTE")));//终端备注
		String MDT_ID = gP(String.valueOf(paramMap.get("MDT_ID")));//终端id
		String sql1 = "update tb_mdt set BA_ID='"+BA_ID+"',COMP_ID='"+BA_ID+"',MT_ID='"+MT_ID+"',MDT_NO='"+MDT_NO+
				"',DISP_TYPE='"+DISP_TYPE+"',REPORT_IP='"+REPORT_IP+"',TALK_FUNC='"+TALK_FUNC+"',INST_MAN='"+INST_MAN+"',CT_ID='"+CT_ID+"',"
				+ "MS_ID='"+MS_ID+"',SUBID='"+SUBID+"',ALERT_MALFUNC='"+ALERT_MALFUNC+"',RCV_PORT='"+RCV_PORT+
				"',GPS_PORT='"+GPS_PORT+"',SEND_PORT='"+SEND_PORT+"',MDT_MID='"+MDT_MID+"',NOTE='"+ZZ_NOTE+"'"
				+ " where MDT_ID = '"+MDT_ID+"'";
		if(c>0){
			jdbcTemplate.update(sql1);
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 车辆表、终端表删除
	 */
	public String delclb(String cid,String mid){
		String[] ids = cid.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String[] mids = mid.split(",");
		String mis = "";
		for (int i = 0; i < mids.length; i++) {
			mis += "'"+mids[i]+"',";
		}
		String sql = "delete from tb_vehicle where vehi_id in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			String sql1 = "delete from tb_mdt where mdt_id in ("+mis.substring(0, mis.length()-1)+")";
			int a = jdbcTemplate.update(sql1);
//			System.out.println(a);
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	private String gP(String s) {
		if (null != s && !s.isEmpty()) {
			s = s.replaceAll(".*([';]+|(--)+).*", " ");
		} else {
			s = "";
		}
		return s;
	}
	public String findyhb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gjz = gP(String.valueOf(paramMap.get("gjz")));//公司
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(gjz!=null&&!gjz.equals("null")){
			tj += " and (user_name like '%"+gjz+"%' or r.rg_name like '%"+gjz
					+"%' or user_tel like '%"+gjz+"%' or real_name like '%"+gjz
					+"%' or ba_name like '%"+gjz+"%' or comp_name like '%"+gjz+"%')";
		}
		String sql = "select (select count(*) COUNT from (select u.*, b.ba_name, c.comp_name,"
				+ " r.rg_name from tb_user u left join TB_BUSI_AREA b on u.ba_id = b.ba_id"
				+ " left join TB_COMPANY c on u.comp_id = c.comp_id left join tb_owner o on u.owner_id=o.owner_id left join (select rg_id,"
				+ " rg_name from tb_priv_role t group by rg_id, rg_name) r on u.rg_id = r.rg_id"
				+ " where 1 = 1 ";
		sql+=tj;
		sql+=" )) as count, tt.* from (select t.*, rownum as rn from (select u.*, b.ba_name,o.owner_name,"
				+ " c.comp_name, r.rg_name from tb_user u left join TB_BUSI_AREA b on"
				+ " u.ba_id = b.ba_id left join TB_COMPANY c on u.comp_id = c.comp_id"
				+ " left join tb_owner o on u.owner_id=o.owner_id left join (select rg_id, rg_name from tb_priv_role t group by rg_id, rg_name) r"
				+ " on u.rg_id = r.rg_id where 1 = 1";
		sql +=tj;
		sql+=") t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for (int i = 0; i < list.size(); i++) {
				String qxs = list.get(i).get("VIEW_TYPE").toString().split("\\|")[2];
				String qx [] = qxs.split(";");
				List<Map<String, Object>> QXDATA = new ArrayList<Map<String,Object>>();
				for (int j = 0; j < qx.length; j++) {
					Map<String, Object> m = new HashMap<String, Object>();
					if(qx[j].length()<5){
						String sqlqx = "select * from tb_owner t where t.owner_id='"+qx[j]+"'";
						List<Map<String, Object>> listQX = jdbcTemplate.queryForList(sqlqx);
						if(listQX.size()>0){
							m.put("qxid", listQX.get(0).get("OWNER_ID").toString());
							m.put("qxmc", listQX.get(0).get("OWNER_NAME").toString());
							QXDATA.add(m);
						}
						
					}else if (qx[j].length()==5){
						String sqlqx = "select * from TB_BUSI_AREA t where t.ba_id='"+qx[j]+"'";
						List<Map<String, Object>> listQX = jdbcTemplate.queryForList(sqlqx);
						if(listQX.size()>0){
						m.put("qxid", listQX.get(0).get("BA_ID").toString());
						m.put("qxmc", listQX.get(0).get("BA_NAME").toString());
						QXDATA.add(m);
						}
					}else{
						String sqlqx = "select * from TB_COMPANY t where t.comp_id='"+qx[j]+"'";
						List<Map<String, Object>> listQX = jdbcTemplate.queryForList(sqlqx);
						if(listQX.size()>0){
						m.put("qxid", listQX.get(0).get("COMP_ID").toString());
						m.put("qxmc", listQX.get(0).get("COMP_NAME").toString());
						QXDATA.add(m);
						}
					}
				}
				list.get(i).put("QX",QXDATA);
			}
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	
	public List<Map<String, Object>> yhb_daochu(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gjz = gP(String.valueOf(paramMap.get("gjz")));//公司
		String tj = "";
		if(gjz!=null&&!gjz.equals("null")){
			tj += " and (user_name like '%"+gjz+"%' or r.rg_name like '%"+gjz
					+"%' or user_tel like '%"+gjz+"%' or real_name like '%"+gjz
					+"%' or ba_name like '%"+gjz+"%' or comp_name like '%"+gjz+"%')";
		}
		String sql = "select u.*, b.ba_name,"
				+ " c.comp_name, r.rg_name from tb_user u left join TB_BUSI_AREA b on"
				+ " u.ba_id = b.ba_id left join TB_COMPANY c on u.comp_id = c.comp_id"
				+ " left join (select rg_id, rg_name from tb_priv_role t group by rg_id, rg_name) r"
				+ " on u.rg_id = r.rg_id where 1 = 1";
		sql +=tj;
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return list;
	}
	
	//添加用户表
	public String addyhb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String USER_NAME = String.valueOf(paramMap.get("USER_NAME"));//用户名
		String OWNER_ID = String.valueOf(paramMap.get("OWNER_ID"));//区域
		String USER_PWD = String.valueOf(paramMap.get("USER_PWD"));//密码
		String REAL_NAME = String.valueOf(paramMap.get("REAL_NAME"));//姓名
		String BA_ID = String.valueOf(paramMap.get("BA_ID"));//公司
		String COMP_ID = String.valueOf(paramMap.get("COMP_ID"));//分公司
		String USER_TEL = String.valueOf(paramMap.get("USER_TEL"));//电话
		String RG_ID = String.valueOf(paramMap.get("RG_ID"));//用户组权限
		String ADDRESS = String.valueOf(paramMap.get("ADDRESS"));//地址
		String NOTE = String.valueOf(paramMap.get("NOTE"));//备注
		String IDSTR = String.valueOf(paramMap.get("IDSTR"));//权限
		String VIEW_TYPE = "0|"+IDSTR.split(";").length+"|"+IDSTR+"|";
		String USER_ID = UUID.randomUUID().toString();
		String sql = "insert into tb_user (USER_NAME,OWNER_ID,USER_PWD,REAL_NAME,BA_ID,"
				+ "COMP_ID,USER_TEL,RG_ID,ADDRESS,NOTE,VIEW_TYPE,USER_ID) values ('"+USER_NAME+
				"','"+OWNER_ID+"','"+USER_PWD+"','"+REAL_NAME+"','"+BA_ID+"','"+COMP_ID+"','"+USER_TEL+
				"','"+RG_ID+"','"+ADDRESS+"','"+NOTE+"','"+VIEW_TYPE+"','"+USER_ID+"')";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	//修改用户表
	public String edityhb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String USER_NAME = String.valueOf(paramMap.get("USER_NAME"));//用户名
		String OWNER_ID = String.valueOf(paramMap.get("OWNER_ID"));//区域
		String USER_PWD = String.valueOf(paramMap.get("USER_PWD"));//密码
		String REAL_NAME = String.valueOf(paramMap.get("REAL_NAME"));//姓名
		String BA_ID = String.valueOf(paramMap.get("BA_ID"));//公司
		String COMP_ID = String.valueOf(paramMap.get("COMP_ID"));//分公司
		String USER_TEL = String.valueOf(paramMap.get("USER_TEL"));//电话
		String RG_ID = String.valueOf(paramMap.get("RG_ID"));//用户组权限
		String ADDRESS = String.valueOf(paramMap.get("ADDRESS"));//地址
		String NOTE = String.valueOf(paramMap.get("NOTE"));//备注
		String IDSTR = String.valueOf(paramMap.get("IDSTR"));//权限
		String VIEW_TYPE = "0|"+IDSTR.split(";").length+"|"+IDSTR+"|";
		String USER_ID = String.valueOf(paramMap.get("USER_ID"));//用户id
		String sql = "update tb_user set USER_NAME='"+USER_NAME+"',OWNER_ID='"+OWNER_ID+
				"',USER_PWD='"+USER_PWD+"',REAL_NAME='"+REAL_NAME+"',BA_ID='"+BA_ID+"',"
				+ "COMP_ID='"+COMP_ID+"',USER_TEL='"+USER_TEL+"',RG_ID='"+RG_ID+
				"',ADDRESS='"+ADDRESS+"',NOTE='"+NOTE+"',VIEW_TYPE='"+VIEW_TYPE+"' where USER_ID='"+USER_ID+"'";
		int count = jdbcTemplate.update(sql);
//		System.out.println(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 用户表删除
	 */
	public String delyhb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from tb_user where user_id in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	//公司树结构
	public String gstree(){
		String owner = "select * from TB_OWNER";
		String ba = "select * from TB_BUSI_AREA";
		String comp = "select * from TB_COMPANY";
		List<Map<String, Object>> list1 = jdbcTemplate.queryForList(owner);
		List<Map<String, Object>> list2 = jdbcTemplate.queryForList(ba);
		List<Map<String, Object>> list3 = jdbcTemplate.queryForList(comp);
		List<Map<String, Object>> tree = new ArrayList<Map<String,Object>>();
		for (int i = 0; i < list1.size(); i++) {
			Map<String, Object> otree = new HashMap<String, Object>();
			otree.put("id", list1.get(i).get("owner_id"));
			otree.put("pId", "0");
			otree.put("name", list1.get(i).get("owner_name"));
			otree.put("click", "test('"+list1.get(i).get("owner_id")+"','"+list1.get(i).get("owner_name")+"')");
			tree.add(otree);
			for (int j = 0; j < list2.size(); j++) {
				if(String.valueOf(list2.get(j).get("owner_id")).equals(list1.get(i).get("owner_id"))){
					Map<String, Object> btree = new HashMap<String, Object>();
					btree.put("id", list2.get(j).get("ba_id"));
					btree.put("pId",list1.get(i).get("owner_id"));
					btree.put("name", list2.get(j).get("ba_name"));
					btree.put("click", "test('"+list2.get(j).get("ba_id")+"','"+list2.get(j).get("ba_name")+"')");
					tree.add(btree);
				}
			}
		}
		for (int j = 0; j < list2.size(); j++) {
			for (int j2 = 0; j2 < list3.size(); j2++) {
				if(String.valueOf(list3.get(j2).get("ba_id")).equals(list2.get(j).get("ba_id"))){
					Map<String, Object> ctree = new HashMap<String, Object>();
					ctree.put("id", list3.get(j2).get("comp_id"));
					ctree.put("pId", list2.get(j).get("ba_id"));
					ctree.put("name", list3.get(j2).get("comp_name"));
					ctree.put("click", "test('"+list3.get(j2).get("comp_id")+"','"+list3.get(j2).get("comp_name")+"')");
					tree.add(ctree);
				}
			}
		}
		return jacksonUtil.toJson(tree);
	}

	public String swcz(String qd_stime, String qd_etime, String zd_stime,
			String zd_etime, String zj_stime,
			String zj_etime, String qd_jwd, String zd_jwd, String zj_jwd) {
		List<String> list = new ArrayList<String>();
		String s1 = "",s2 = "",s3 = "";
		List<Vehicle> listqd = new ArrayList<Vehicle>();
		List<Vehicle> listzd = new ArrayList<Vehicle>();
		if(qd_jwd!=null&&qd_jwd.length()>0){
			s1=swczff(qd_stime,qd_etime,qd_jwd,"1");
			JSONObject json = JSONObject.fromObject(s1);
	        list.add(json.getString("result0"));
	        JSONObject json1 =  JSONObject.fromObject(json.getString("result0"));
	        Set setqd = json1.keySet();
	        Iterator it = setqd.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listqd.add(v);
	    	 }  
		}
		
		if(zd_jwd!=null&&zd_jwd.length()>0){
			s2=swczff(zd_stime,zd_etime,zd_jwd,"2");
			JSONObject json = JSONObject.fromObject(s2);
	        list.add(json.getString("result0"));
	        JSONObject json1 =  JSONObject.fromObject(json.getString("result0"));
	        Set setzd = json1.keySet();
	        Iterator it = setzd.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {  
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listzd.add(v);
	    	 }  
		}
		if(zj_jwd!=null&&zj_jwd.length()>0){
			s3=swczff(zj_stime,zj_etime,zj_jwd,"3");
			JSONObject json = JSONObject.fromObject(s3);
	        list.add(json.getString("result0"));
	        JSONObject json1 =  JSONObject.fromObject(json.getString("result0"));
	        Set setzj = json1.keySet();
	        Iterator it = setzj.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listzd.add(v);
	    	 }  
		}
		List<Vehicle> listjg = new ArrayList<Vehicle>();
		if(list.size()==2){
			Set aSet = new HashSet();
        	JSONObject json11=JSONObject.fromObject(list.get(0));
        	JSONObject json2;
        	 json2=JSONObject.fromObject(list.get(1));
        	 Set s11=json11.keySet();
        	 Set s22=json2.keySet();
        	 aSet.addAll(s11);
        	 aSet.retainAll(s22);
        	 Iterator it = aSet.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {  
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json11.get(a).toString().split("\\[")[0].substring(0, json11.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json11.get(a).toString().split("\\[")[1].substring(0, json11.get(a).toString().split("\\[")[1].length()-1));
	    		 listjg.add(v);
	    	 }  
        }else{
        	JSONObject json1;
        	JSONObject json2;
        	JSONObject json3;
        	json1=JSONObject.fromObject(list.get(0));
       	 	json2=JSONObject.fromObject(list.get(1));
       	 	json3=JSONObject.fromObject(list.get(2));
       	 	Set aSet = new HashSet();
	       	 Set s11=json1.keySet();
	    	 Set s22=json2.keySet();
	    	 Set s33=json3.keySet();
	    	 aSet.addAll(s11);
	    	 aSet.retainAll(s22);
	    	 aSet.retainAll(s33);
	    	 Iterator it = aSet.iterator();  
	    	 String a = "";
	    	 while(it.hasNext()) {  
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listjg.add(v);
	    	 }
        }
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("qd", listqd);
		map.put("zd", listzd);
		map.put("jg", listjg);
		return jacksonUtil.toJson(map);
	}
	public String swczexcle(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String qd_stime = String.valueOf(paramMap.get("qd_stime"));
		String qd_etime = String.valueOf(paramMap.get("qd_etime"));
		String zd_stime = String.valueOf(paramMap.get("zd_stime"));
		String zd_etime = String.valueOf(paramMap.get("zd_etime"));
		String zj_stime = String.valueOf(paramMap.get("zj_stime"));
		String zj_etime = String.valueOf(paramMap.get("zj_etime"));
		String qd_jwd = String.valueOf(paramMap.get("qd_jwd"));
		String zd_jwd = String.valueOf(paramMap.get("zd_jwd"));
		String zj_jwd = String.valueOf(paramMap.get("zj_jwd"));
		System.out.println(qd_stime+"  "+qd_etime+"  "+zd_stime+"  "+zd_etime+" "+qd_jwd+"  "+zd_jwd);
		List<String> list = new ArrayList<String>();
		String s1 = "",s2 = "",s3 = "";
		List<Vehicle> listqd = new ArrayList<Vehicle>();
		List<Vehicle> listzd = new ArrayList<Vehicle>();
		if(qd_jwd!=null&&qd_jwd.length()>0&&!qd_jwd.equals("null")){
			s1=swczff(qd_stime,qd_etime,qd_jwd,"1");
			JSONObject json = JSONObject.fromObject(s1);
	        list.add(json.getString("result0"));
	        JSONObject json1 =  JSONObject.fromObject(json.getString("result0"));
	        Set setqd = json1.keySet();
	        Iterator it = setqd.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listqd.add(v);
	    	 }  
		}
		
		if(zd_jwd!=null&&zd_jwd.length()>0&&!zd_jwd.equals("null")){
			s2=swczff(zd_stime,zd_etime,zd_jwd,"2");
			JSONObject json = JSONObject.fromObject(s2);
	        list.add(json.getString("result0"));
	        JSONObject json1 =  JSONObject.fromObject(json.getString("result0"));
	        Set setzd = json1.keySet();
	        Iterator it = setzd.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {  
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listzd.add(v);
	    	 }  
		}
		if(zj_jwd!=null&&zj_jwd.length()>0&&!zj_jwd.equals("null")){
			s3=swczff(zj_stime,zj_etime,zj_jwd,"3");
			JSONObject json = JSONObject.fromObject(s3);
	        list.add(json.getString("result0"));
	        JSONObject json1 =  JSONObject.fromObject(json.getString("result0"));
	        Set setzj = json1.keySet();
	        Iterator it = setzj.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {  
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listzd.add(v);
	    	 }  
		}
		List<Vehicle> listjg = new ArrayList<Vehicle>();
		if(list.size()==2){
			Set aSet = new HashSet();
        	JSONObject json11=JSONObject.fromObject(list.get(0));
        	JSONObject json2;
        	 json2=JSONObject.fromObject(list.get(1));
        	 Set s11=json11.keySet();
        	 Set s22=json2.keySet();
        	 aSet.addAll(s11);
        	 aSet.retainAll(s22);
        	 Iterator it = aSet.iterator();
	    	 String a = "";
	    	 while(it.hasNext()) {  
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json11.get(a).toString().split("\\[")[0].substring(0, json11.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json11.get(a).toString().split("\\[")[1].substring(0, json11.get(a).toString().split("\\[")[1].length()-1));
	    		 listjg.add(v);
	    	 }  
        }else{
        	JSONObject json1;
        	JSONObject json2;
        	JSONObject json3;
        	json1=JSONObject.fromObject(list.get(0));
       	 	json2=JSONObject.fromObject(list.get(1));
       	 	json3=JSONObject.fromObject(list.get(2));
       	 	Set aSet = new HashSet();
	       	 Set s11=json1.keySet();
	    	 Set s22=json2.keySet();
	    	 Set s33=json3.keySet();
	    	 aSet.addAll(s11);
	    	 aSet.retainAll(s22);
	    	 aSet.retainAll(s33);
	    	 Iterator it = aSet.iterator();  
	    	 String a = "";
	    	 while(it.hasNext()) {  
	    		 a=(String) it.next();
	    		 Vehicle v = new Vehicle();
	    		 v.setVehi_no(a);
	    		 v.setStime(json1.get(a).toString().split("\\[")[0].substring(0, json1.get(a).toString().split("\\[")[0].length()-1));
	    		 v.setPx(json1.get(a).toString().split("\\[")[1].substring(0, json1.get(a).toString().split("\\[")[1].length()-1));
	    		 listjg.add(v);
	    	 }  
        }
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("qd", listqd);
		map.put("zd", listzd);
		map.put("jg", listjg);
		return jacksonUtil.toJson(map);
	}
	public String swczff(String stime,String etime,String jwd,String obj){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		long st = 0,et = 0;
		try {
			st = sdf.parse(stime).getTime();
			et = sdf.parse(etime).getTime();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		URL url = null;
		try {
			url = new URL(WS_URL);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
        QName qname = new QName("http://service.com/", "GpsServicesService");
        javax.xml.ws.Service service = javax.xml.ws.Service.create(url, qname);
        GpsServicesDelegate gpsService = service.getPort(GpsServicesDelegate.class);
        Map<String, Object> req_ctx = ((BindingProvider)gpsService).getRequestContext();

        List qy = new ArrayList();
        Calendar calendar = Calendar.getInstance() ,calendar2 = Calendar.getInstance();
        calendar.set(2016, 4, 31, 18, 30, 22);
		calendar2.set(2016, 4,31, 18, 50, 22);
		
        qy.add(jwd);
        
//        qy.add("120.300654,30.10079;120.387349,30.24193;120.540643,30.238519;120.556092,30.1299;");
        
//        qy.add("120.350654,30.15079;120.387349,30.24193;120.540643,30.238519;120.556092,30.1299");
        String  result = gpsService.swcz3Day(qy, st, et);
//        String  result = gpsService.swcz(qy, calendar.getTimeInMillis(), calendar2.getTimeInMillis());
//        System.out.println("查询结果:\n"+result);
//        JSONObject json = JSONObject.fromObject(result);
//        if(obj.equals("1")){
//        	json1 = JSONObject.fromObject(result);
//        }
//        List<String> list = new ArrayList<String>();
//        list.add(json.getString("result0"));
//        JSONObject json1=JSONObject.fromObject(list.get(0));
        return result;
	}
	/**
	 * 查询实时监控
	 */
	public String findssjk(){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		long t = System.currentTimeMillis()-1000*60*30;
		Date d = new Date(t);
		String time = sdf.format(d);
		String sql = "select * from TB_MDT_STATUS t,vw_vehicle v where"
				+ " t.vehi_id = v.vehi_id and stime > to_date('"+time+"',"
				+ "'yyyy-mm-dd hh24:mi:ss') order by vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}

	public String findqxb(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gjz = gP(String.valueOf(paramMap.get("gjz")));//公司
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String sql = "select (select count(*) COUNT from (select t.*,t1.rg_name from TB_ROLE t,"+
					"(select t.rg_id ,rg_name from TB_PRIV_ROLE t group by t.rg_id ,rg_name) t1 where t.js=t1.rg_id"+
					" and t1.rg_name like '%"+gjz+"%'";
		sql+=" )) as count, tt.* from (select t.*, rownum as rn from (select t.*,t1.rg_name from TB_ROLE t,"+
					"(select t.rg_id ,rg_name from TB_PRIV_ROLE t group by t.rg_id ,rg_name) t1 where t.js=t1.rg_id"+
					" and t1.rg_name like '%"+gjz+"%'";
		sql+=") t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
//		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	public String findnewold(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gjz = gP(String.valueOf(paramMap.get("gjz")));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String STIME = String.valueOf(paramMap.get("stime"));
		String ETIME = String.valueOf(paramMap.get("etime"));
		System.out.println(STIME+"  "+ETIME);
		String tj = " and up_time >= to_date('"+STIME+"','yyyy-mm-dd hh24:mi:ss')  and up_time <= to_date('"+ETIME+"','yyyy-mm-dd hh24:mi:ss')";
		String sql = "select (select count(*) COUNT from (select * from TB_NEWOLD_VEHICLE where ("
				+ "new_vhic like '%"+gjz+"%' or new_comp_name like '%"+gjz+"%' or old_vhic like '%"+gjz+"%'"
				+ " or old_comp_name like '%"+gjz+"%')";
		sql += tj;
		sql +=")) as count, tt.* from (select t.*, rownum as rn from"
				+ " (select * from TB_NEWOLD_VEHICLE where (new_vhic like '%"+gjz+"%' or new_comp_name like '%"+gjz+"%'"
				+ " or old_vhic like '%"+gjz+"%' or old_comp_name like '%"+gjz+"%')";
		sql += tj;
		sql +=" order by up_time desc) t where rownum"
				+ " <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		System.out.println(sql);
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
			int count = 0;
			if(null !=list && list.size() >0){
				count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			}
			Map  map = new HashMap ();
			map.put("count", count);
			map.put("datas",list);
	        return jacksonUtil.toJson(map);
	}
	public String addnewold(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String NEW_VHIC = String.valueOf(paramMap.get("NEW_VHIC"));//用户名
		String NEW_COMP_NAME = String.valueOf(paramMap.get("NEW_COMP_NAME"));//区域
		String OLD_VHIC = String.valueOf(paramMap.get("OLD_VHIC"));//密码
		String OLD_COMP_NAME = String.valueOf(paramMap.get("OLD_COMP_NAME"));//姓名
		String UP_TIME = String.valueOf(paramMap.get("UP_TIME"));
		String ID = UUID.randomUUID().toString();
		String sql = "insert into TB_NEWOLD_VEHICLE (NEW_VHIC,NEW_COMP_NAME,OLD_VHIC,OLD_COMP_NAME,ID,UP_TIME) values ("
				+ "'"+NEW_VHIC+"','"+NEW_COMP_NAME+"','"+OLD_VHIC+"','"+OLD_COMP_NAME+"','"+ID+"',to_date('"+UP_TIME+"','yyyy-mm-dd hh24:mi:ss'))";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editnewold(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String NEW_VHIC = String.valueOf(paramMap.get("NEW_VHIC"));//用户名
		String NEW_COMP_NAME = String.valueOf(paramMap.get("NEW_COMP_NAME"));//区域
		String OLD_VHIC = String.valueOf(paramMap.get("OLD_VHIC"));//密码
		String OLD_COMP_NAME = String.valueOf(paramMap.get("OLD_COMP_NAME"));//姓名
		String UP_TIME = String.valueOf(paramMap.get("UP_TIME"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "UPDATE TB_NEWOLD_VEHICLE SET NEW_VHIC='"+NEW_VHIC+"',NEW_COMP_NAME='"+NEW_COMP_NAME+"'"
				+ ",OLD_VHIC='"+OLD_VHIC+"',OLD_COMP_NAME='"+OLD_COMP_NAME+"',"
						+ "UP_TIME=to_date('"+UP_TIME+"','yyyy-mm-dd hh24:mi:ss') where ID='"+ID+"'";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String delnewold(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_NEWOLD_VEHICLE where ID in ("+is.substring(0, is.length()-1)+")";
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
	 * 客户表2查询
	 * @return
	 */
	public String findkhb2(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(CUST_NAME!=null&&!CUST_NAME.isEmpty()&&!CUST_NAME.equals("null")&&CUST_NAME.length()>0){
			tj += " and (CUST_NAME like '%"+CUST_NAME+"%' or CUST_TEL like '%"+CUST_NAME+"%'"
					+ " or NOTE like '%"+CUST_NAME+"%' or CUST_SEX like '%"+CUST_NAME+"%'";
			if(CUST_NAME.equals("黑")){
				tj += " or CUST_GRADE = 'F')";
			}else if(CUST_NAME.equals("普")){
				tj += " or CUST_GRADE = '0')";
			}else if(CUST_NAME.equals("V")||CUST_NAME.equals("v")){
				tj += " or CUST_GRADE = '1')";
			}else if(CUST_NAME.equals("超")){
				tj += " or CUST_GRADE = '2')";
			}else{
				tj += ")";
			}
		}
		String sql = "select (select count(*) COUNT from (select * from tb_customer"
				+ " where 1=1";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select"
				+ " * from tb_customer where 1=1";
		sql += tj;
		sql += " ) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 客户表2添加
	 */
	public String addkhb2(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));
		String CUST_TEL = String.valueOf(paramMap.get("CUST_TEL"));
		String CUST_GRADE = String.valueOf(paramMap.get("CUST_GRADE"));
		String CUST_SEX = String.valueOf(paramMap.get("CUST_SEX"));
		String CUST_TEL_OTHER = String.valueOf(paramMap.get("CUST_TEL_OTHER"));
		String LOGINPASS = String.valueOf(paramMap.get("LOGINPASS"));
		String VALID_DAY = String.valueOf(paramMap.get("VALID_DAY"));
		String ADDRESS_KJ = String.valueOf(paramMap.get("ADDRESS_KJ"));
		String IS_LOVE = String.valueOf(paramMap.get("IS_LOVE"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String sql = "insert into tb_customer (CUST_NAME,CUST_TEL,CUST_GRADE,CUST_SEX,CUST_TEL_OTHER,LOGINPASS"
				+ ",VALID_DAY,ADDRESS_KJ,LAST_CHANGE_DATE,NOTE,IS_LOVE) values(?,?,?,?,?,?,?,?,sysdate,?,?)";
		int count = jdbcTemplate.update(sql,CUST_NAME,CUST_TEL,CUST_GRADE,CUST_SEX,CUST_TEL_OTHER,LOGINPASS,VALID_DAY,ADDRESS_KJ,NOTE,IS_LOVE);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 客户表2修改
	 */
	public String editkhb2(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String CUST_NAME = String.valueOf(paramMap.get("CUST_NAME"));
		String CUST_TEL = String.valueOf(paramMap.get("CUST_TEL"));
		String CUST_GRADE = String.valueOf(paramMap.get("CUST_GRADE"));
		String CUST_SEX = String.valueOf(paramMap.get("CUST_SEX"));
		String CUST_TEL_OTHER = String.valueOf(paramMap.get("CUST_TEL_OTHER"));
		String LOGINPASS = String.valueOf(paramMap.get("LOGINPASS"));
		String VALID_DAY = String.valueOf(paramMap.get("VALID_DAY"));
		String ADDRESS_KJ = String.valueOf(paramMap.get("ADDRESS_KJ"));
		String IS_LOVE = String.valueOf(paramMap.get("IS_LOVE"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String ID = String.valueOf(paramMap.get("ID"));
		String sql = "update tb_customer set CUST_NAME=?,CUST_TEL=?,CUST_GRADE=?,CUST_SEX=?,CUST_TEL_OTHER=?,LOGINPASS=?"
				+ ",VALID_DAY=?,ADDRESS_KJ=?,LAST_CHANGE_DATE=sysdate,NOTE=?,IS_LOVE=? where CUST_ID=?";
		int count = jdbcTemplate.update(sql,CUST_NAME,CUST_TEL,CUST_GRADE,CUST_SEX,CUST_TEL_OTHER,LOGINPASS,VALID_DAY,ADDRESS_KJ,NOTE,IS_LOVE,ID);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	/**
	 * 客户表2删除
	 */
	public String delkhb2(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from tb_customer where CUST_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/*优惠券查询*/
	public String findyhq(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gjz = String.valueOf(paramMap.get("gjz"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String stime =  String.valueOf(paramMap.get("stime"));
		String etime =  String.valueOf(paramMap.get("etime"));
		String tj = " and db_time>= to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and"
				+ " db_time<= to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
		if(gjz!=null&&!gjz.isEmpty()&&!gjz.equals("null")&&gjz.length()>0){
			tj += " and ( coupon_num like '%"+gjz+"%' or y.user_name like '"+gjz+"' or real_name like '"+gjz+"')";
		}
		String sql = "select (select count(1) COUNT from (select * from TB_YHQ y,TB_USER u"
				+ " where y.user_id = u.user_id";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select"
				+ " y.*,u.real_name from TB_YHQ y,TB_USER u where y.user_id = u.user_id";
		sql += tj;
		sql += " order by db_time desc) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for (int i = 0; i < list.size(); i++) {
				list.get(i).put("USER", list.get(i).get("USER_NAME")+"("+list.get(i).get("REAL_NAME")+")");
			}
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	/**
	 * 优惠券添加
	 */
	public String addyhq(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		Integer YHQ_NUM = Integer.parseInt(String.valueOf(paramMap.get("YHQ_NUM")));
		String YHQ_DB = String.valueOf(paramMap.get("YHQ_DB"));
		String YHQ_ST = String.valueOf(paramMap.get("YHQ_ST"));
		String YHQ_ET = String.valueOf(paramMap.get("YHQ_ET"));
		String user_name = String.valueOf(request.getSession().getAttribute("username"));
		String userid = String.valueOf(request.getSession().getAttribute("userid"));
		for (int i = 0; i < YHQ_NUM; i++) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
			StringBuffer rq = new StringBuffer (sdf.format(new Date()).substring(1));
			Random r = new Random();
			int sjs = (int)(Math.random()*(9999-1000+1))+1000;
			rq.append(sjs);
			jdbcTemplate.update("insert into TB_YHQ(ID,COUPON_NUM,DB_TIME,START_TIME,END_TIME,USER_NAME,USER_ID) values("
					+ "'"+UUID.randomUUID()+"','"+rq+"',to_date('"+YHQ_DB+"','yyyy-mm-dd hh24:mi:ss'),"
					+ "to_date('"+YHQ_ST+"','yyyy-mm-dd hh24:mi:ss'),to_date('"+YHQ_ET+"','yyyy-mm-dd hh24:mi:ss')"
							+ ",'"+user_name+"','"+userid+"')");
		}
		Map<String, String> map = new HashMap<String, String>();
		map.put("info", "添加成功");
		return jacksonUtil.toJson(map);
	}
	/*是否使用*/
	public String issy(String id,String issy){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "update TB_YHQ set is_use = '"+issy+"' where ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String delyhq(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_YHQ where ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String findaxcz(){
		String sql = "select a.*,ts.c from (select m.tm_name,wm_concat(mc.vehi_no) vehi_no,m.tm_id from HZGPS_TAXI.TB_MOTORCADE m, "
				+ "( select * from hzgps_taxi.tb_motorcade_cars order by vehi_no desc) mc where m.tm_id=mc.tm_id group by m.tm_name"
				+ ",m.tm_id) a left join ( select tm_id,count(1) c from hzgps_taxi.tb_motorcade_cars group by tm_id) ts"
				+ " on a.tm_id = ts.tm_id ";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String findvhic(String cphm){
		String sql = "select * from hzgps_taxi.vw_vehicle where 1=1 ";
		if(cphm!=null&&cphm.length()>0&&!cphm.equals("null")){
			sql += " and vehi_no like '%"+cphm+"%'";
		}
		sql += " and rownum <=500 order by vehi_no";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return jacksonUtil.toJson(list);
	}
	public String addaxcz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String NAME = String.valueOf(paramMap.get("NAME"));
		String VHIC = String.valueOf(paramMap.get("VHIC"));
		String userid = String.valueOf(request.getSession().getAttribute("userid"));
		String sql = "insert into TB_MOTORCADE(tm_name,create_gh,create_time) values ('"+NAME+"','"+userid+"',sysdate)";
		Map<String, String> map = new HashMap<String, String>();
		int count = jdbcTemplate.update(sql);
		if(count!=0){
			String id = jdbcTemplate.queryForObject("select tm_id from TB_MOTORCADE where tm_name = '"+NAME+"'", String.class);
			String[] cphm = VHIC.split(",");
			for (int i = 0; i < cphm.length; i++) {
				if(cphm[i].length()>1){
					jdbcTemplate.update("insert into TB_MOTORCADE_CARS(tm_id,vehi_no) values ('"+id+"','"+cphm[i]+"')");
				}
			}
			jdbcTemplate.update("delete from TB_MOTORCADE_CARS where (vehi_no) in "
					+ "(select vehi_no from TB_MOTORCADE_CARS where tm_id = '"+id+"'"
					+ " group by vehi_no having count(vehi_no) >1) and rowid not in"
					+ " (select min(rowid) from TB_MOTORCADE_CARS where tm_id = '"+id+"'"
					+ " group by vehi_no having count(vehi_no)>1)  and tm_id = '"+id+"'");
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editaxcz(String postData,HttpServletRequest request){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String NAME = String.valueOf(paramMap.get("NAME"));
		String VHIC = String.valueOf(paramMap.get("VHIC"));
		String ID = String.valueOf(paramMap.get("ID"));
		String userid = String.valueOf(request.getSession().getAttribute("userid"));
		String sql = "update TB_MOTORCADE set tm_name = '"+NAME+"',create_gh = '"+userid+"' where tm_id = '"+ID+"'";
		Map<String, String> map = new HashMap<String, String>();
		int count = jdbcTemplate.update(sql);
		if(count!=0){
			jdbcTemplate.update("delete from TB_MOTORCADE_CARS where tm_id = '"+ID+"'");
			String[] cphm = VHIC.split(",");
			for (int i = 0; i < cphm.length; i++) {
				if(cphm[i].length()>1){
					jdbcTemplate.update("insert into TB_MOTORCADE_CARS(tm_id,vehi_no) values ('"+ID+"','"+cphm[i]+"')");
				}
			}
			jdbcTemplate.update("delete from TB_MOTORCADE_CARS where (vehi_no) in "
					+ "(select vehi_no from TB_MOTORCADE_CARS where tm_id = '"+ID+"'"
					+ " group by vehi_no having count(vehi_no) >1) and rowid not in"
					+ " (select min(rowid) from TB_MOTORCADE_CARS where tm_id = '"+ID+"'"
					+ " group by vehi_no having count(vehi_no)>1)  and tm_id = '"+ID+"'");
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String delaxcz(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_MOTORCADE where tm_ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			jdbcTemplate.update("delete from TB_MOTORCADE_CARS where tm_ID in ("+is.substring(0, is.length()-1)+")");
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
	/*优惠券查询*/
	public String findsjb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String gjz = String.valueOf(paramMap.get("gjz"));
		int page = Integer.parseInt(String.valueOf(paramMap.get("page")));
		int pageSize = Integer.parseInt(String.valueOf(paramMap.get("pageSize")));
		String tj = "";
		if(gjz!=null&&!gjz.isEmpty()&&!gjz.equals("null")&&gjz.length()>0){
			tj += " and ( s.vehi_no like '%"+gjz+"%' or comp_name like '"+gjz+"' or name like '"+gjz+"'"
					+ " or phone like '"+gjz+"' or vt_name like '"+gjz+"' or rllx like '"+gjz+"')";
		}
		String sql = "select (select count(1) COUNT from (select s.*,v.COMP_NAME,v.vt_name,v.rllx from TB_SJB s,"
				+ "VW_VEHICLE v where s.vehi_no = v.VEHI_NO";
		sql += tj;
		sql+=")) as count, tt.* from (select t.*, rownum as rn from (select s.*,v.COMP_NAME,v.vt_name,v.rllx"
				+ " from TB_SJB s,VW_VEHICLE v where s.vehi_no = v.VEHI_NO";
		sql += tj;
		sql += " order by db_time desc) t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		System.out.println(sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		if(null !=list && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
		}
		Map  map = new HashMap ();
		map.put("count", count);
		map.put("datas",list);
        return jacksonUtil.toJson(map);
	}
	public String addsjb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		String NAME = String.valueOf(paramMap.get("NAME"));
		String PHONE = String.valueOf(paramMap.get("PHONE"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String id = UUID.randomUUID().toString();
		String sql = "insert into TB_SJB(VEHI_NO,NAME,PHONE,NOTE,ID) values ('"+VEHI_NO+"','"+NAME+"','"+PHONE+"','"+NOTE+"','"+id+"')";
		Map<String, String> map = new HashMap<String, String>();
		int count = jdbcTemplate.update(sql);
		if(count!=0){
			map.put("info", "添加成功");
		}else{
			map.put("info", "添加失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String editsjb(String postData){
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String VEHI_NO = String.valueOf(paramMap.get("VEHI_NO"));
		String NAME = String.valueOf(paramMap.get("NAME"));
		String PHONE = String.valueOf(paramMap.get("PHONE"));
		String NOTE = String.valueOf(paramMap.get("NOTE"));
		String id = String.valueOf(paramMap.get("ID"));
		String sql = "update TB_SJB set VEHI_NO='"+VEHI_NO+"',NAME='"+NAME+"',PHONE='"+PHONE+"',NOTE='"+NOTE+"' where ID='"+id+"'";
		Map<String, String> map = new HashMap<String, String>();
		int count = jdbcTemplate.update(sql);
		if(count!=0){
			map.put("info", "修改成功");
		}else{
			map.put("info", "修改失败");
		}
		return jacksonUtil.toJson(map);
	}
	public String delsjb(String id){
		String[] ids = id.split(",");
		String is = "";
		for (int i = 0; i < ids.length; i++) {
			is += "'"+ids[i]+"',";
		}
		String sql = "delete from TB_SJB where ID in ("+is.substring(0, is.length()-1)+")";
		int count = jdbcTemplate.update(sql);
		Map<String, String> map = new HashMap<String, String>();
		if(count>0){
			map.put("info", "删除成功");
		}else{
			map.put("info", "删除失败");
		}
		return jacksonUtil.toJson(map);
	}
}