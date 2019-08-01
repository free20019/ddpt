package mvc.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import helper.JacksonUtil;

import org.apache.ibatis.annotations.Param;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

@Service
public class ZhywServer {
    protected JdbcTemplate jdbcTemplate = null;
    protected JdbcTemplate jdbcTemplate2 = null;
    protected java.text.DecimalFormat   df   =new   java.text.DecimalFormat("#.00");  
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

    public static int daysBetween(String stime)    
    {    
        long between_days=0;
        try{
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");  
        Date sdate=sdf.parse(stime);
        Date today=new Date();
        Calendar cal = Calendar.getInstance();    
        cal.setTime(sdate);    
        long time1 = cal.getTimeInMillis();                 
        cal.setTime(today);    
        long time2 = cal.getTimeInMillis();         
        between_days=(time2-time1)/(1000*3600*24);  
        }catch(Exception e){
            System.out.println("日期相减报错！！！");
        }
       return Integer.parseInt(String.valueOf(between_days));           
    } 
    public String queryclxjjy(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" and substr(t.flag,5, 1) = '0'";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" and substr(t.flag,6, 1) = '0'";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" and substr(t.flag,7, 1) = '0'";
                    }
                    if(lxs[i].equals("4")){
                        tj+=" and substr(t.flag,3, 1) = '0'";
                    }
                }
            }
            String sql = "select * from (select tt.*,rownum r from (select t.*,t2.fgs,t2.cphm from jjq"+db+"_1 t, "
                    + "jjq_company t2 where "
                    + "JIAOYITYPE='现金交易' and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "
                    +tj+" order by t.shangche desc)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr;
            List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            String sql1 = "select count(*) c from jjq"+db+"_1 t, "
                    + "jjq_company t2 where "
                    + "JIAOYITYPE='现金交易' and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "+tj+"";
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            
            for (int i = 0; i < list.size(); i++) {
                Map<String, Object> m = list.get(i);
                m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
                m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
                m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
                m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
                m.put("QY", setqy(m.get("CPHM").toString()));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    
    private String setDhsj(String dhsj) {
        if(dhsj.indexOf("F")>=0){
            return dhsj;
        }
        return (Integer.parseInt(dhsj.substring(0,2))*3600+Integer.parseInt(dhsj.substring(2,4))*60+Integer.parseInt(dhsj.substring(4,6)))+"";
    }

    public List<Map<String, Object>> clxjjy_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" and substr(t.flag,5, 1) = '0'";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" and substr(t.flag,6, 1) = '0'";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" and substr(t.flag,7, 1) = '0'";
                    }
                    if(lxs[i].equals("4")){
                        tj+=" and substr(t.flag,3, 1) = '0'";
                    }
                }
            }
            String sql = "select t.*,t2.fgs,t2.cphm from jjq"+db+"_1 t, "
                    + "jjq_company t2 where "
                    + "JIAOYITYPE='现金交易' and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "
                    +tj+" order by t.shangche desc";
            List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
//          List<Map<String, Object>> list = jdbcTemplate2.query(sql, new ResultSetExtractor() {  
//              public Object extractData(ResultSet rs) throws SQLException, DataAccessException {  
//                  while (rs.next()) {  
//                  }  
//              } 
//          });
            for (int i = 0; i < list.size(); i++) {
                Map<String, Object> m = list.get(i);
                m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
                m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
                m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
                m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
                m.put("QY", setqy(m.get("CPHM").toString()));
            }
            
//      result.put("data", list);
        return list;
    }
    
    
    public String queryclskjy(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" and substr(t.flag,5, 1) = '0'";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" and substr(t.flag,6, 1) = '0'";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" and substr(t.flag,7, 1) = '0'";
                    }
                    if(lxs[i].equals("4")){
                        tj+=" and substr(t.flag,3, 1) = '0'";
                    }
                }
            }
        Map<String, Object> result =new HashMap<String,Object>();
        String sql = "select * from (select tt.*,rownum r from (select t.*,t2.cphm,t2.fgs from jjq"+db+"_1 t, "
                + "jjq_company t2 where "
                + "JIAOYITYPE='刷卡交易' and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "+tj+" order by t.shangche desc)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from jjq"+db+"_1 t, "
                + "jjq_company t2 where "
                + "JIAOYITYPE='刷卡交易' and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "+tj;
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
            m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
            m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
            m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
            m.put("QY", setqy(m.get("CPHM").toString()));
        }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    
    public List<Map<String, Object>>  clskjy_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" and substr(t.flag,5, 1) = '0'";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" and substr(t.flag,6, 1) = '0'";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" and substr(t.flag,7, 1) = '0'";
                    }
                    if(lxs[i].equals("4")){
                        tj+=" and substr(t.flag,3, 1) = '0'";
                    }
                }
            }
            String sql = "select t.*,t2.fgs,t2.cphm from jjq"+db+"_1 t, "
                    + "jjq_company t2 where "
                    + "JIAOYITYPE='刷卡交易' and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "
                    +tj+" order by t.shangche desc";
            List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
                for (int i = 0; i < list.size(); i++) {
                    Map<String, Object> m = list.get(i);
                    m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
                    m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
                    m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
                    m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
                    m.put("QY", setqy(m.get("CPHM").toString()));
                }
        return list;
    }
    
    public String queryclyyjy(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String zdlx = String.valueOf(paramMap.get("zdlx"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        String fwzgz = String.valueOf(paramMap.get("fwzgz"));
        String minje = "0000"+String.valueOf(paramMap.get("minje"))+"00";
        String maxje = "0000"+String.valueOf(paramMap.get("maxje"))+"00";

		minje=minje.substring(minje.length()-6);
		maxje=maxje.substring(maxje.length()-6);

        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        
        if(!zdlx.equals("")){
            tj+=" and t2.zdxh = '"+zdlx+"'";
        }
        
        if(!fwzgz.equals("")){
            tj+=" and t.YINGYUN like '%"+fwzgz+"%'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" and substr(t.flag,5, 1) = '0'";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" and substr(t.flag,6, 1) = '0'";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" and substr(t.flag,7, 1) = '0'";
                    }
                    if(lxs[i].equals("4")){
                        tj+=" and substr(t.flag,3, 1) = '0'";
                    }
                }
            }
            Map<String, Object> result =new HashMap<String,Object>();
        String sql = "select * from (select tt.*,rownum r from (select t.*,t2.cphm,t2.fgs,t2.zdxh zdlx from jjq"+db+"_1 t, "
                + "jjq_company t2 where "
				+ "t.jine>='"+minje+"' and t.jine<='"+maxje+"' "
                + "and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "+tj+" order by t.shangche desc)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from jjq"+db+"_1 t, "
                + "jjq_company t2 where "
				+ "t.jine>='"+minje+"' and t.jine<='"+maxje+"' "
				+ "and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "+tj;
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
            m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
            m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
            m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
            m.put("QY", setqy(m.get("CPHM").toString()));
        }
        
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    
    public List<Map<String, Object>> clyyjy_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String zdlx = String.valueOf(paramMap.get("zdlx"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        String fwzgz = String.valueOf(paramMap.get("fwzgz"));
		String minje = "0000"+String.valueOf(paramMap.get("minje"))+"00";
		String maxje = "0000"+String.valueOf(paramMap.get("maxje"))+"00";

		minje=minje.substring(minje.length()-6);
		maxje=maxje.substring(maxje.length()-6);
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!fwzgz.equals("")){
            tj+=" and t.YINGYUN like '%"+fwzgz+"%'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        if(!zdlx.equals("")){
            tj+=" and t2.zdxh = '"+zdlx+"'";
        }
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" and substr(t.flag,5, 1) = '0'";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" and substr(t.flag,6, 1) = '0'";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" and substr(t.flag,7, 1) = '0'";
                    }
                    if(lxs[i].equals("4")){
						tj+=" and substr(t.flag,3, 1) = '0'";
					}
                }
            }
            String sql = "select t.*,t2.fgs,t2.cphm,t2.zdxh zdlx from jjq"+db+"_1 t, "
                    + "jjq_company t2 where "
					+ "t.jine>='"+minje+"' and t.jine<='"+maxje+"' "
					+ "and t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "
                    +tj+" order by t.shangche desc";
            List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
                for (int i = 0; i < list.size(); i++) {
                    Map<String, Object> m = list.get(i);
                    m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
                    m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
                    m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
                    m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
                    m.put("QY", setqy(m.get("CPHM").toString()));
                }
        return list;
    }
    
    public String queryycsjcx(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                
                tj+=" and (";
                //tj+=" and t1.vehi_no = '"+cp+"'";
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" substr(t.flag,5, 1) = '1' or";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" substr(t.flag,6, 1) = '1' or";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" substr(t.flag,7, 1) = '1' or";
                    }
                    if(lxs[i].equals("4")){
                        tj+=" substr(t.flag,3, 1) = '1' or";
                    }
                }
                tj=tj.substring(0, tj.length()-2)+")";
            }
            String sql = "select * from (select t.*,t2.cphm,t2.fgs,rownum r from jjq"+db+"_1 t, "
                    + "jjq_company t2 where "
                    + "t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm"+tj+")tt where tt.r<="+er+" and tt.r>="+sr;
            List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            String sql1 = "select count(*) c from jjq"+db+"_1 t, "
                            + "jjq_company t2 where "
                            + "t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                            + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                            + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm"+tj;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            for (int i = 0; i < list.size(); i++) {
                Map<String, Object> m = list.get(i);
                m.put("QY", setqy(m.get("CPHM").toString()));
                String yczd = m.get("FLAG").toString();
                String yclx="";
                if(yczd.charAt(4)=='1'){
//                  System.out.println("上车时间<下车时间");
                    yclx+="4,";
                }
                if(yczd.charAt(5)=='1'){
//                  System.out.println("实载里程<时差*120km／h");
                    yclx+="5,";
                }
                if(yczd.charAt(6)=='1'){
//                  System.out.println("时差<12h");
                    yclx+="6,";
                }
                if(yczd.charAt(3)=='1'){
//                  System.out.println("金额英文");
                    yclx+="3,";
                }else{
                    m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
                }
                if(yczd.charAt(7)=='1'){
//                  System.out.println("计程英文");
                    yclx+="7,";
                }else{
                    m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
                }
                if(yczd.charAt(8)=='1'){
//                  System.out.println("空驶英文");
                    yclx+="8,";
                }else{
                    m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
                }
                if(yczd.charAt(9)=='1'){
//                  System.out.println("等候英文");
                    yclx+="9,";
                }else{
                    m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
                }
                m.put("YCLX", yclx);
            }
            result.put("data", list);
            result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    
    public List<Map<String, Object>> ycsjcx_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String yjlx = String.valueOf(paramMap.get("yjlx"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
            if(!yjlx.equals("")){
                String [] lxs = yjlx.split(",");
                
                tj+=" and (";
                //tj+=" and t1.vehi_no = '"+cp+"'";
                for (int i = 0; i < lxs.length; i++) {
                    if(lxs[i].equals("1")){
                        tj+=" substr(t.flag,5, 1) = '1' or";
                    }
                    if(lxs[i].equals("2")){
                        tj+=" substr(t.flag,6, 1) = '1' or";
                    }
                    if(lxs[i].equals("3")){
                        tj+=" substr(t.flag,7, 1) = '1' or";
                    }
                    if(lxs[i].equals("4")){
                        tj+=" substr(t.flag,3, 1) = '1' or";
                    }
                }
                tj=tj.substring(0, tj.length()-2)+")";
            }
            String sql = "select t.*,t2.cphm,t2.fgs,rownum r from jjq"+db+"_1 t, "
                    + "jjq_company t2 where "
                    + "t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                    + "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm"+tj;
            List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            for (int i = 0; i < list.size(); i++) {
                Map<String, Object> m = list.get(i);
                m.put("QY", setqy(m.get("CPHM").toString()));
                String yczd = m.get("FLAG").toString();
                String yclx="";
                if(yczd.charAt(4)=='1'){
                    yclx+="4,";
                }
                if(yczd.charAt(5)=='1'){
                    yclx+="5,";
                }
                if(yczd.charAt(6)=='1'){
                    yclx+="6,";
                }
                if(yczd.charAt(3)=='1'){
                    yclx+="3,";
                }else{
                    m.put("JINE", Integer.parseInt(m.get("JINE").toString())/100);
                }
                if(yczd.charAt(7)=='1'){
//                  System.out.println("计程英文");
                    yclx+="7,";
                }else{
                    m.put("JICHENG", df.format(Double.parseDouble(m.get("JICHENG").toString())/10));
                }
                if(yczd.charAt(8)=='1'){
                    yclx+="8,";
                }else{
                    m.put("KONGSHI", df.format(Double.parseDouble(m.get("KONGSHI").toString())/10));
                }
                if(yczd.charAt(9)=='1'){
                    yclx+="9,";
                }else{
                    m.put("DENGHOU", setDhsj(m.get("DENGHOU").toString()));
                }
                m.put("YCLX", yclx);
            }
        return list;
    }

    public String queryclzxyysj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM");
        String etime = sdf.format(new Date());
        String stime = sdf1.format(new Date());
        String db = etime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select ttt.* from(select tt.*,rownum r from(select max(t.shangche) shangche,t2.cphm,t2.fgs FROM jjq"+db+"_1 t, "+
                        "jjq_company t2 where "+
                        "t.shangche <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') "+
                        "and t.shangche >=to_date('"+stime+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss') "+
                        "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "+tj+"  group by t2.cphm,t2.fgs )tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(distinct(t.cphm_new)) c FROM jjq"+db+"_1 t, "+
                        "jjq_company t2 where "+
                        "t.shangche <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') "+
                        "and t.shangche >=to_date('"+stime+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss') "+
                        "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm"+tj+"";
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);

            for (int i = 0; i < list.size(); i++) {
                Map<String, Object> m = list.get(i);
                m.put("QY", setqy(m.get("CPHM").toString()));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
        
    }

    public List<Map<String, Object>> clzxyysj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String tj="";
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t2.qyid = '"+qyid+"'";
        }
        if(!gs.equals("")){
            tj+=" and t2.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM");
        String etime = sdf.format(new Date());
        String stime = sdf1.format(new Date());
        String db = etime.substring(0,4)+stime.substring(5, 7);
        String sql = "select max(t.shangche) shangche,t2.cphm,t2.fgs FROM jjq"+db+"_1 t, "+
                        "jjq_company t2 where "+
                        "t.shangche <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') "+
                        "and t.shangche >=to_date('"+stime+"-01 00:00:00','yyyy-mm-dd hh24:mi:ss') "+
                        "and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm "+tj+"  group by t2.cphm,t2.fgs"; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        for (int i = 0; i < list.size(); i++) {
            list.get(i).put("SHANGCHE", list.get(i).get("SHANGCHE").toString().substring(0, 19));
            list.get(i).put("QY", setqy(list.get(i).get("CPHM").toString()));
        }
        return list;
    }

    public String queryjycs(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String mincs = String.valueOf(paramMap.get("mincs"));
        String maxcs = String.valueOf(paramMap.get("maxcs"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.tjcs) jycs from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jycs>="+mincs+" and tt.jycs<="+maxcs+")ttt where ttt.r<="+er+" and ttt.r>="+sr;
//      System.out.println(sql);
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from (select t.cphm_new,sum(t.tjcs) jycs from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new)tt  where tt.jycs>="+mincs+" and tt.jycs<="+maxcs;
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> jycs_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String mincs = String.valueOf(paramMap.get("mincs"));
        String maxcs = String.valueOf(paramMap.get("maxcs"));
        String tj="";
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        String sql = "select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.tjcs) jycs from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jycs>="+mincs+" and tt.jycs<="+maxcs;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        return list;
    }
    
    public String queryjyje(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.jine) jyje from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyje"+fh+cs+")ttt where ttt.r<="+er+" and ttt.r>="+sr; 
//      System.out.println(sql);
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from (select t.cphm_new,sum(t.jine) jyje from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new)tt  where tt.jyje"+fh+cs;
        
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> jyje_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        String tj="";
        
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.jine) jyje from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyje"+fh+cs;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        return list;
    }
    
    public String queryjyjc(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.szlc) jyjc from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyjc"+fh+cs+")ttt where ttt.r<="+er+" and ttt.r>="+sr; 
//      System.out.println(sql);
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from (select t.cphm_new,sum(t.szlc) jyjc from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new)tt  where tt.jyjc"+fh+cs;
        
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> jyjc_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        String tj="";
        
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.szlc) jyjc from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyjc"+fh+cs;
        
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        return list;
    }
    
    public String queryjyddsj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.dhsj) jyddsj from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyddsj"+fh+cs+")ttt where ttt.r<="+er+" and ttt.r>="+sr; 
//      System.out.println(sql);
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from (select t.cphm_new,sum(t.dhsj) jyddsj from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new)tt  where tt.jyddsj"+fh+cs;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> jyddsj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        String tj="";
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.dhsj) jyddsj from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyddsj"+fh+cs;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        return list;
    }
    
    public String queryjyks(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.kslc) jyks from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyks"+fh+cs+")ttt where ttt.r<="+er+" and ttt.r>="+sr; 
//      System.out.println(sql);
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from (select t.cphm_new,sum(t.kslc) jyks from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new)tt  where tt.jyks"+fh+cs;
        
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>>  jyks_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        String tj="";
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.kslc) jyks from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyks"+fh+cs;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        return list;
    }

    public String queryjyyysj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.yssc) jyyysj from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyyysj"+fh+cs+")ttt where ttt.r<="+er+" and ttt.r>="+sr; 
//      System.out.println(sql);
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from (select t.cphm_new,sum(t.yssc) jyyysj from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new)tt  where tt.jyyysj"+fh+cs;
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> jyyysj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String fh = String.valueOf(paramMap.get("fh"));
        String cs = String.valueOf(paramMap.get("cs"));
        String tj="";
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select tt.*,t1.fgs,rownum r from (select CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END cp,sum(t.yssc) jyyysj from jjq_tj_"+db+"_day t where "
                + "t.type=5 and to_date(t.day,'yyyymmdd')<=to_date('"+etime+"','yyyy-mm-dd') and "
                + " to_date(t.day,'yyyymmdd')>=to_date('"+stime+"','yyyy-mm-dd') "+tj
                + " group by t.cphm_new,t.fgs)tt,jjq_company t1 where tt.cp=t1.cphm and tt.jyyysj"+fh+cs;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        return list;
    }

    public String queryyyjycsz(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,rownum r from (select t1.cphm ch,t1.fgs,sum(t.xjjycs) xjjycs,sum(t.skjycs) skjycs,sum(t.tjcs) yyjycs from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(distinct(t.cphm_new)) c from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> yyjycsz_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        
        String sql = "select t1.cphm ch,t1.fgs,sum(t.xjjycs) xjjycs,sum(t.skjycs) skjycs,sum(t.tjcs) yyjycs from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm"; 
//        System.out.println(sql);
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        return list;
    }
    public String queryyyjyjez(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,rownum r from (select t1.cphm ch,t1.fgs,sum(t.xjjine) xjjyje,sum(t.skjine) skjyje,sum(t.jine) yyjyje from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(distinct(t.cphm_new)) c from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> yyjyjez_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String sql = "select t1.cphm ch,t1.fgs,sum(t.xjjine) xjjyje,sum(t.skjine) skjyje,sum(t.jine) yyjyje from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm"; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        return list;
    }
    
    public String queryyyjyjcz(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,rownum r from (select t1.cphm ch,t1.fgs,sum(t.xjszlc) xjjyjc,sum(t.skszlc) skjyjc,sum(t.szlc) yyjyjc from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(distinct(t.cphm_new)) c from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> yyjyjcz_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        
        String sql = "select t1.cphm ch,t1.fgs,sum(t.xjszlc) xjjyjc,sum(t.skszlc) skjyjc,sum(t.szlc) yyjyjc from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm"; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        return list;
    }
    
    //------------
    public String queryyyjyddsjz(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
        java.text.DecimalFormat   df   =new   java.text.DecimalFormat("#.00");  
        String sql = "select * from (select tt.*,rownum r from (select t1.cphm ch,t1.fgs,sum(t.xjdhsj) xjjyddsj,sum(t.skdhsj) skjyddsj,sum(t.dhsj) yyjyddsj from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(distinct(t.cphm_new)) c from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
                list.get(i).put("XJJYDDSJ", df.format(Double.parseDouble((list.get(i).get("XJJYDDSJ").toString()))));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> yyjyddsjz_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        java.text.DecimalFormat   df   =new   java.text.DecimalFormat("#.00");  
        String sql = "select t1.cphm ch,t1.fgs,sum(t.xjdhsj) xjjyddsj,sum(t.skdhsj) skjyddsj,sum(t.dhsj) yyjyddsj from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm"; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
                list.get(i).put("XJJYDDSJ", df.format(Double.parseDouble((list.get(i).get("XJJYDDSJ").toString()))));
            }
        return list;
    }
    public String queryyyjyksz(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,rownum r from (select t1.cphm ch,t1.fgs,sum(t.xjkslc) xjjyks,sum(t.skkclc) skjyks,sum(t.kslc) yyjyks from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(distinct(t.cphm_new)) c from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> yyjyksz_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        
        String sql = "select t1.cphm ch,t1.fgs,sum(t.xjkslc) xjjyks,sum(t.skkclc) skjyks,sum(t.kslc) yyjyks from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm"; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        return list;
    }
    public String queryyyjyyysjz(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,rownum r from (select t1.cphm ch,t1.fgs,sum(t.xjyysc) xjjyyysj,sum(t.skyysc) skjyyysj,sum(t.yssc) yyjyyysj from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(distinct(t.cphm_new)) c from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj;
            List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> yyjyyysjz_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String tj="";
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj=" and t1.qyid = '"+qyid+"'";
        }
        
        if(!gs.equals("")){
            tj=" and t.fgs = '"+gs+"'";
        }
        if(!cp.equals("")){
            tj=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END = '"+cp+"'";
        }
        String sql = "select t1.cphm ch,t1.fgs,sum(t.xjyysc) xjjyyysj,sum(t.skyysc) skjyyysj,sum(t.yssc) yyjyyysj from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + "t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm"+tj
                + " group by t1.cphm, t1.fgs order by t1.cphm"; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
            for (int i = 0; i < list.size(); i++) {
                list.get(i).put("QY", setqy(list.get(i).get("CH").toString()));
            }
        return list;
    }
    //-------------

    public String queryrtj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String qutj="";
        String qyname=qy;
        String cltj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            qutj = " t1.qyid='"+qyid+"' and ";
            cltj = " and t.owner_id='"+qyid+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql1 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                        ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                        ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                        ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                        " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type=5 and t.day='"+stime.replaceAll("-", "")+"'"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
//        System.out.println(sql1);
        String sql2 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type=1 and t.day='"+stime.replaceAll("-", "")+"'"; 
        List<Map<String, Object>> list2 = jdbcTemplate2.queryForList(sql2);
        
        String sql3 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type=2 and t.day='"+stime.replaceAll("-", "")+"'"; 
        List<Map<String, Object>> list3 = jdbcTemplate2.queryForList(sql3);
        
        //车辆总数查询
        String clzssql = "select count(1) c from VW_VEHICLE t where t.vehi_date<=to_date('"+stime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and (t.vehistatus<>'报停' or t.vehistatus is null) and t.vehi_no is not null "+cltj;
        List<Map<String, Object>> clzslist = jdbcTemplate.queryForList(clzssql);
        
        Map<String, Object> result =new HashMap<String,Object>();
        String clzs = clzslist.get(0).get("C").toString();
        double sll1 = Double.parseDouble(list1.get(0).get("RYYCL").toString())/Double.parseDouble(clzslist.get(0).get("C").toString());
        list1.get(0).put("CLZS", clzs);
        list1.get(0).put("SLL", new DecimalFormat("##.0").format(sll1*100)+"%");
        list1.get(0).put("QY", qyname);
        double sll2 = Double.parseDouble(list2.get(0).get("RYYCL").toString())/Double.parseDouble(clzslist.get(0).get("C").toString());
        list2.get(0).put("CLZS", clzs);
        list2.get(0).put("SLL", new DecimalFormat("##.0").format(sll2*100)+"%");
        list2.get(0).put("QY", qyname);
        double sll3 = Double.parseDouble(list3.get(0).get("RYYCL").toString())/Double.parseDouble(clzslist.get(0).get("C").toString());
        list3.get(0).put("CLZS", clzs);
        list3.get(0).put("SLL", new DecimalFormat("##.0").format(sll3*100)+"%");
        list3.get(0).put("QY", qyname);
        result.put("data1", list1);
        result.put("data2", list2);
        result.put("data3", list3);
        return jacksonUtil.toJson(result);
    }

    public String getstime(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        return stime;
    }
    public List<Map<String, Object>> rtj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String qutj="";
        String qyname=qy;
        String cltj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            qutj = " t1.qyid='"+qyid+"' and ";
            cltj = " and t.owner_id='"+qyid+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql1 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                        ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                        ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                        ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                        " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type=5 and t.day='"+stime.replaceAll("-", "")+"'"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        
        String sql2 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type=1 and t.day='"+stime.replaceAll("-", "")+"'"; 
        List<Map<String, Object>> list2 = jdbcTemplate2.queryForList(sql2);
        
        String sql3 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type=2 and t.day='"+stime.replaceAll("-", "")+"'"; 
        List<Map<String, Object>> list3 = jdbcTemplate2.queryForList(sql3);
        
        
        //车辆总数查询
        String clzssql = "select count(1) c from VW_VEHICLE t where t.vehi_date<=to_date('"+stime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and (t.vehistatus<>'报停' or t.vehistatus is null) and t.vehi_no is not null "+cltj;
        List<Map<String, Object>> clzslist = jdbcTemplate.queryForList(clzssql);
        List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
        String clzs = clzslist.get(0).get("C").toString();
        double sll1 = Double.parseDouble(list1.get(0).get("RYYCL").toString())/Double.parseDouble(clzslist.get(0).get("C").toString());
        list1.get(0).put("TJSD", "全天");
        list1.get(0).put("CLZS", clzs);
        list1.get(0).put("SLL", new DecimalFormat("##.0").format(sll1*100)+"%");
        list1.get(0).put("QY", qyname);
        double sll2 = Double.parseDouble(list2.get(0).get("RYYCL").toString())/Double.parseDouble(clzslist.get(0).get("C").toString());
        list2.get(0).put("TJSD", "早高峰");
        list2.get(0).put("CLZS", clzs);
        list2.get(0).put("SLL", new DecimalFormat("##.0").format(sll2*100)+"%");
        list2.get(0).put("QY", qyname);
        double sll3 = Double.parseDouble(list3.get(0).get("RYYCL").toString())/Double.parseDouble(clzslist.get(0).get("C").toString());
        list3.get(0).put("TJSD", "晚高峰");
        list3.get(0).put("CLZS", clzs);
        list3.get(0).put("SLL", new DecimalFormat("##.0").format(sll3*100)+"%");
        list3.get(0).put("QY", qyname);
        list.add(list1.get(0));
        list.add(list2.get(0));
        list.add(list3.get(0));
        return list;
    }
    
    public String queryjysjhz(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String qy = String.valueOf(paramMap.get("qy"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj = " and t1.qyid='"+qyid+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm,1,1)='A' THEN '浙'||t.cphm ELSE '浙A'||t.cphm END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,rownum r from (select t1.cphm cp,t1.fgs,sum(t.tjcs) jycs,sum(t.jine) jyje,sum(t.szlc) jyjc,sum(t.kslc) jyks,sum(t.dhsj) jyddsj,sum(t.yssc) jyyysj from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + " t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm,1,1)='A' THEN '浙'||t.cphm ELSE '浙A'||t.cphm END=t1.cphm "+tj
                + " group by t1.cphm,t1.fgs)tt)ttt where ttt.r<="+er+" and ttt.r>="+sr; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(*) c from (select t.cphm,sum(t.yssc) jyyysj from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + " t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm,1,1)='A' THEN '浙'||t.cphm ELSE '浙A'||t.cphm END=t1.cphm "+tj
                + " group by t.cphm)tt";
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("QY", setqy(m.get("CP").toString()));
        }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> jysjhz_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        String qy = String.valueOf(paramMap.get("qy"));
        String tj="";
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj = " and t1.qyid='"+qyid+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm,1,1)='A' THEN '浙'||t.cphm ELSE '浙A'||t.cphm END = '"+cp+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select t1.cphm cp,t1.fgs,sum(t.tjcs) jycs,sum(t.jine) jyje,sum(t.szlc) jyjc,sum(t.kslc) jyks,sum(t.dhsj) jyddsj,sum(t.yssc) jyyysj from jjq_tj_"+db+"_day t,jjq_company t1 where "
                + " t.type=5 and t.jsyysj<=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss') and "
                + " t.jsyysj>=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and CASE WHEN SUBSTR(t.cphm,1,1)='A' THEN '浙'||t.cphm ELSE '浙A'||t.cphm END=t1.cphm "+tj
                + " group by t1.cphm,t1.fgs"; 
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("QY", setqy(m.get("CP").toString()));
        }
        return list;
    }
    
    public String jysjhz_getsj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        return stime+"-"+etime;
    }
    public String jysjhz_getytjsj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        return stime.substring(0,7);
    }
    private String setqy(String cp){
        if(cp.indexOf("AT")>0){
            return "主城区";
        }else if(cp.indexOf("AH")>0||cp.indexOf("AAT")>0||cp.indexOf("AQT")>0||cp.indexOf("AUT")>0){
            return "余杭区";
        }else if(cp.indexOf("APT")>0||cp.indexOf("ALT")>0){
            return "萧山区";
        }else if(cp.indexOf("AB")>0||cp.indexOf("AEQ")>0){
            return "临安区";
        }else if(cp.indexOf("ACT")>0){
            return "富阳区";
        }else if(cp.indexOf("AFT")>0){
            return "淳安区";
        }else{
            return "其他"; 
        }
    }
    
    //20171109 15:50
    public String queryytj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String sjd = String.valueOf(paramMap.get("sjd"));
        String qutj="";
        String qyname=qy;
        String cltj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            qutj = " t1.qyid='"+qyid+"' and ";
            cltj = " and t.owner_id='"+qyid+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql1 = "select t.day,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                        ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                        ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                        ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                        " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type="+sjd+" group by t.day order by t.day"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        
        //车辆总数查询
        
        
        Map<String, Object> result =new HashMap<String,Object>();
        String clzgzs = "";
        
        if(list1.size()>0){
            for (int i = 0; i < list1.size(); i++) {
                String clzssql = "select count(1) c from vw_vehicle t where t.vehi_date<=to_date('"+list1.get(i).get("DAY").toString()+" 23:59:59','yyyymmdd hh24:mi:ss') and (t.vehistatus<>'报停' or t.vehistatus is null) and t.vehi_no is not null "+cltj;
                List<Map<String, Object>> clzslist = jdbcTemplate.queryForList(clzssql);
                String clzs = clzslist.get(0).get("C").toString();
                if(i==list1.size()-1){
                    clzgzs = clzs;
                }
                double sll1 = Double.parseDouble(list1.get(i).get("RYYCL").toString())/Double.parseDouble(clzs);
                list1.get(i).put("dojoId", i+1);
                list1.get(i).put("CLZS", clzs);
                list1.get(i).put("SLL", new DecimalFormat("##.0").format(sll1*100)+"%");
                list1.get(i).put("QY", qyname);
                list1.get(i).put("SJD", ythsjd(sjd));
            }
        }else{
            String clzssql = "select count(1) c from vw_vehicle t where t.vehi_date<=sysdate and (t.vehistatus<>'报停' or t.vehistatus is null) and t.vehi_no is not null "+cltj;
            List<Map<String, Object>> clzslist = jdbcTemplate.queryForList(clzssql);
            String clzs = clzslist.get(0).get("C").toString();
            clzgzs = clzs;
        }
        
        String sql2 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type="+sjd; 
        List<Map<String, Object>> list2 = jdbcTemplate2.queryForList(sql2);
        double sll2 = Double.parseDouble(list2.get(0).get("RYYCL").toString())/Double.parseDouble(clzgzs);
        list2.get(0).put("CLZS", clzgzs);
        list2.get(0).put("SLL", new DecimalFormat("##.0").format(sll2*100)+"%");
        list2.get(0).put("QY", qyname);
        list2.get(0).put("SJD", ythsjd(sjd));
        list2.get(0).put("dojoId", "总计");
        list2.get(0).put("DAY", "");
        list1.add(0,list2.get(0)); 
        
        result.put("data", list1);
        return jacksonUtil.toJson(result);
    }
    
    private String ythsjd(String sjd){
        if(sjd.equals("1")){
            return "早高峰";
        }else if(sjd.equals("2")){
            return "晚高峰";
        }else if(sjd.equals("5")){
            return "全天";
        }else if(sjd.equals("4")){
            return "17:00-5:00";
        }else if(sjd.equals("3")){
            return "5:00-17:00";
        }else{
            return "";
        }
    }
    
    public List<Map<String, Object>> ytj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String sjd = String.valueOf(paramMap.get("sjd"));
        String qutj="";
        String qyname=qy;
        String cltj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            qutj = " t1.qyid='"+qyid+"' and ";
            cltj = " and t.owner_id='"+qyid+"'";
        }
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql1 = "select t.day,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                        ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                        ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                        ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                        " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type="+sjd+" group by t.day order by t.day"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        
        //车辆总数查询
        
        
        Map<String, Object> result =new HashMap<String,Object>();
        String clzgzs = "";
        
        if(list1.size()>0){
            for (int i = 0; i < list1.size(); i++) {
                String clzssql = "select count(1) c from vw_vehicle t where t.vehi_date<=to_date('"+list1.get(i).get("DAY").toString()+" 23:59:59','yyyymmdd hh24:mi:ss') and (t.vehistatus<>'报停' or t.vehistatus is null) and t.vehi_no is not null "+cltj;
                List<Map<String, Object>> clzslist = jdbcTemplate.queryForList(clzssql);
                String clzs = clzslist.get(0).get("C").toString();
                if(i==list1.size()-1){
                    clzgzs = clzs;
                }
                double sll1 = Double.parseDouble(list1.get(i).get("RYYCL").toString())/Double.parseDouble(clzs);
                list1.get(i).put("dojoId", i+1);
                list1.get(i).put("CLZS", clzs);
                list1.get(i).put("SLL", new DecimalFormat("##.0").format(sll1*100)+"%");
                list1.get(i).put("QY", qyname);
                list1.get(i).put("SJD", ythsjd(sjd));
            }
        }else{
            String clzssql = "select count(1) c from vw_vehicle t where t.vehi_date<=sysdate and (t.vehistatus<>'报停' or t.vehistatus is null) and t.vehi_no is not null "+cltj;
            List<Map<String, Object>> clzslist = jdbcTemplate.queryForList(clzssql);
            String clzs = clzslist.get(0).get("C").toString();
            clzgzs = clzs;
        }
        
        
        String sql2 = "select sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc,round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                " from jjq_tj_"+db+"_day t,JJQ_COMPANY t1 where "+qutj+" CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm and t.type="+sjd; 
        List<Map<String, Object>> list2 = jdbcTemplate2.queryForList(sql2);
        double sll2 = Double.parseDouble(list2.get(0).get("RYYCL").toString())/Double.parseDouble(clzgzs);
        list2.get(0).put("CLZS", clzgzs);
        list2.get(0).put("SLL", new DecimalFormat("##.0").format(sll2*100)+"%");
        list2.get(0).put("QY", qyname);
        list2.get(0).put("SJD", ythsjd(sjd));
        list2.get(0).put("dojoId", "总计");
        list2.get(0).put("DAY", "");
        list1.add(0,list2.get(0)); 
        return list1;
    }

    public String gstj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String tj="";
        String qyid="";
        String compsql="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj = " t2.qyid='"+qyid+"' and ";
        }
        String gstj="";
        if(!gs.equals("")){
            tj="";
            gstj =" t2.fgs='"+gs+"' and ";
        }
        
        String db = stime.substring(0,4)+stime.substring(5, 7);
        
        String sql = "select t2.fgs,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc "+ 
                        " from jjq_tj_"+db+"_day t,jjq_company t2 where CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm and"+tj+gstj+" t.type=5 and  t.day <='"+etime.replaceAll("-", "")+"' and t.day >='"+stime.replaceAll("-", "")+"' group by t2.fgs"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql);
        
        Map<String, Object> result =new HashMap<String,Object>();
        for (int i = 0; i < list1.size(); i++) {
            list1.get(i).put("dojoId", i+1);
            list1.get(i).put("QY", qy);
        }
        result.put("data", list1);
        return jacksonUtil.toJson(result);
    }

    public List<Map<String, Object>> gstj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String tj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj = " t2.qyid='"+qyid+"' and ";
        }
        String gstj="";
        if(!gs.equals("")){
            tj="";
            gstj =" t2.fgs='"+gs+"' and ";
        }
        
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select t2.fgs,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc "+ 
                        " from jjq_tj_"+db+"_day t,jjq_company t2 where CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm and"+tj+gstj+" t.type=5 and  t.day <='"+etime.replaceAll("-", "")+"' and t.day >='"+stime.replaceAll("-", "")+"' group by t2.fgs"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql);
        
        Map<String, Object> result =new HashMap<String,Object>();
        for (int i = 0; i < list1.size(); i++) {
            String fgs = list1.get(i).get("FGS").toString();
            String clzssql = "select count(1) c from jjq_company t2 where t2.fgs='"+fgs+"'";
            List<Map<String, Object>> clzslist = jdbcTemplate2.queryForList(clzssql);
            String clzs = clzslist.get(0).get("C").toString();
            
            double sll1 = Double.parseDouble(list1.get(i).get("RYYCL").toString())/Double.parseDouble(clzs);
            list1.get(i).put("dojoId", i+1);
            list1.get(i).put("CLZS", clzs);
            list1.get(i).put("SLL", new DecimalFormat("##.0").format(sll1*100)+"%");
            list1.get(i).put("QY", qy);
        }
        return list1;
    }
    
    
    public String gspj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String tj="",cltj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj = " t2.qyid='"+qyid+"' and ";
        }
        String gstj="";
        if(!gs.equals("")){
            tj="";
            gstj =" t2.fgs='"+gs+"' and ";
        }
        
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select t2.fgs, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl"+
                        ",round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                        ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                        ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                        ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                        ",round(sum(t.zlc)/count(distinct(t.cphm_new)),2) pjzlc"+
                        ",round(sum(t.szlc)/count(distinct(t.cphm_new)),2) pjzklc"+
                        ",round(sum(t.kslc)/count(distinct(t.cphm_new)),2) pjkslc"+
                        " from jjq_tj_"+db+"_day t,jjq_company t2 where CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm and"+tj+gstj+" t.type=5 and  t.day <='"+etime.replaceAll("-", "")+"' and t.day >='"+stime.replaceAll("-", "")+"' group by t2.fgs"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql);
        
        Map<String, Object> result =new HashMap<String,Object>();
        for (int i = 0; i < list1.size(); i++) {
            list1.get(i).put("dojoId", i+1);
            list1.get(i).put("QY", qy);
        }
        result.put("data", list1);
        return jacksonUtil.toJson(result);
    }

    public List<Map<String, Object>> gspj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String tj="",cltj="";
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj = " t2.qyid='"+qyid+"' and ";
        }
        String gstj="";
        if(!gs.equals("")){
            tj="";
            gstj =" t2.fgs='"+gs+"' and ";
        }
        
        String db = stime.substring(0,4)+stime.substring(5, 7);
        String sql = "select t2.fgs, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl"+
                ",round(sum(t.tjcs)/count(distinct(t.cphm_new)),0) zzcs,round(sum(t.jine)/count(distinct(t.cphm_new)),2) pjys"+
                ",round(sum(t.szlc)/(sum(t.yssc)/60),2) pjxssd"+
                ",round(sum(t.yssc)/60/count(distinct(t.cphm_new)),2) pjyysc"+
                ",round(sum(t.dhsj)/count(distinct(t.cphm_new)),2) pjdhsj"+
                ",round(sum(t.zlc)/count(distinct(t.cphm_new)),2) pjzlc"+
                ",round(sum(t.szlc)/count(distinct(t.cphm_new)),2) pjzklc"+
                ",round(sum(t.kslc)/count(distinct(t.cphm_new)),2) pjkslc"+
                " from jjq_tj_"+db+"_day t,jjq_company t2 where CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t2.cphm and"+tj+gstj+" t.type=5 and  t.day <='"+etime.replaceAll("-", "")+"' and t.day >='"+stime.replaceAll("-", "")+"' group by t2.fgs"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql);
        
        Map<String, Object> result =new HashMap<String,Object>();
        for (int i = 0; i < list1.size(); i++) {
            list1.get(i).put("dojoId", i+1);
            list1.get(i).put("QY", qy);
        }
        return list1;
    }

    public String cltj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String zdlx = String.valueOf(paramMap.get("zdlx"));
        String xs = String.valueOf(paramMap.get("xs"));
        String ds = String.valueOf(paramMap.get("ds"));
        if(ds.equals("∞")){
            ds="9999999";
        }
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t1.qyid='"+qyid+"'";
        }
        
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END= '"+cp+"'";
        }
        if(!gs.equals("")){
            tj+=" and t1.fgs = '"+gs+"'";
        }
        if(!zdlx.equals("")){
            tj+=" and t1.zdxh = '"+zdlx+"'";
        }
        
        String cpddtj="CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm";
        
        String db = stime.substring(0,4)+stime.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        

        String sql = "select * from (select tt.*,rownum r from (select t1.fgs fgs,t1.cphm cphm,t1.zdxh zdlx,"
                + "sum(to_number(substr(t.denghou,1,2))*60+to_number(substr(t.denghou,3,2))+round(to_number(substr(t.denghou,5,2))/60,2)) dhsj, "
                + "count(t.cphm_new) ryycs,"
                + "to_number(1) ryycl,"
                + "sum(to_number(t.jicheng)/10+to_number(t.kongshi)/10) rzlc, "
                + "sum(to_number(t.jicheng)/10) rzklc, "
                + "sum(to_number(t.kongshi)/10) rkslc, "
                + "sum(to_number(t.jine)/100) rysje, "
                + "round(sum((t.xiache-t.shangche)*24),2) ryysc, "
                + "to_char(min(shangche),'yyyy-mm-dd hh24:mi:ss') ksyysj, "
                + "to_char(max(shangche),'yyyy-mm-dd hh24:mi:ss') jsyysj "
                + "from jjq"+db+"_1 t, "
                + "jjq_company t1"// where t.mdt_sub_type='通用移动4G'"
                + " where t.flag='1000000000' and "
                + " t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and "+cpddtj+" "
                +tj+" group by t1.cphm,t1.fgs,t1.zdxh)tt where tt.ryycs>="+xs+" and tt.ryycs<="+ds+")ttt where ttt.r<="+er+" and ttt.r>="+sr;
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(1) c from (select "
                + "count(t.cphm_new) ryycs "
                + "from jjq"+db+"_1 t, "
                + "jjq_company t1"// where t.mdt_sub_type='通用移动4G'"
                + " where t.flag='1000000000' and "
                + " t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and "+cpddtj+" "
                +tj+" group by t1.cphm,t1.fgs)tt where tt.ryycs>="+xs+" and tt.ryycs<="+ds;
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("QY", setqy(m.get("CPHM").toString()));
        }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    public List<Map<String, Object>> cltj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
        String zdlx = String.valueOf(paramMap.get("zdlx"));
        String xs = String.valueOf(paramMap.get("xs"));
        String ds = String.valueOf(paramMap.get("ds"));
        if(ds.equals("∞")){
            ds="9999999";
        }
        String tj="";
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t1.qyid='"+qyid+"'";
        }
        if(!cp.equals("")){
            tj+=" and CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END= '"+cp+"'";
        }
        if(!gs.equals("")){
            tj+=" and t1.fgs = '"+gs+"'";
        }
        if(!zdlx.equals("")){
            tj+=" and t1.zdxh = '"+zdlx+"'";
        }
        String cpddtj="CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END=t1.cphm";
        
        String db = stime.substring(0,4)+stime.substring(5, 7);

        String sql = "select tt.* from (select t1.fgs fgs,t1.cphm cphm,t1.zdxh zdlx,"
                + "sum(to_number(substr(t.denghou,1,2))*60+to_number(substr(t.denghou,3,2))+round(to_number(substr(t.denghou,5,2))/60,2)) dhsj, "
                + "count(t.cphm_new) ryycs,"
                + "to_number(1) ryycl,"
                + "sum(to_number(t.jicheng)/10+to_number(t.kongshi)/10) rzlc, "
                + "sum(to_number(t.jicheng)/10) rzklc, "
                + "sum(to_number(t.kongshi)/10) rkslc, "
                + "sum(to_number(t.jine)/100) rysje, "
                + "round(sum((t.xiache-t.shangche)*24),2) ryysc, "
                + "to_char(min(shangche),'yyyy-mm-dd hh24:mi:ss') ksyysj, "
                + "to_char(max(shangche),'yyyy-mm-dd hh24:mi:ss') jsyysj "
                + "from jjq"+db+"_1 t, "
                + "jjq_company t1"// where t.mdt_sub_type='通用移动4G'"
                + " where t.flag='1000000000' and "
                + " t.shangche <=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and t.shangche >=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') "
                + "and "+cpddtj+" "
                +tj+" group by t1.cphm,t1.fgs,t1.zdxh)tt where tt.ryycs>="+xs+" and tt.ryycs<="+ds;
        
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("QY", setqy(m.get("CPHM").toString()));
        }
        return list;
    }
    
    
    public String gsytj(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String yf = String.valueOf(paramMap.get("yf"));
        String gs = String.valueOf(paramMap.get("gs"));
        
        String db = yf.substring(0,4)+yf.substring(5, 7);
        String sql = "select t.fgs,t.day,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc "+ 
                        " from jjq_tj_"+db+"_day t where t.fgs='"+gs+"' and t.type=5 and substr(t.day, 0, 6)='"+yf.replaceAll("-", "")+"' group by t.day,t.fgs order by t.day"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql);
        for (int i = 0; i < list1.size(); i++) {
            list1.get(i).put("dojoId", i+1);
        }
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql2 = "select t.fgs,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc "+ 
                " from jjq_tj_"+db+"_day t where t.fgs='"+gs+"' and t.type=5 and substr(t.day, 0, 6)='"+yf.replaceAll("-", "")+"' group by t.fgs"; 
        List<Map<String, Object>> list2 = jdbcTemplate2.queryForList(sql2);
        if(list2.size()>0){
            list2.get(0).put("dojoId", "总计");
            list2.get(0).put("DAY", "");
            list1.add(0,list2.get(0)); 
        }else{
            Map<String, Object> m = new HashMap<String, Object>();
            m.put("dojoId", "总计");
            m.put("DAY", "");
            m.put("fgs", gs);
            list1.add(0,m); 
        }
        
        result.put("data", list1);
        return jacksonUtil.toJson(result);
    }
    
    public List<Map<String, Object>> gsytj_daochu(String postData) {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String yf = String.valueOf(paramMap.get("yf"));
        String gs = String.valueOf(paramMap.get("gs"));
        
        String db = yf.substring(0,4)+yf.substring(5, 7);
        String sql = "select t.fgs,t.day,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                        ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc "+ 
                        " from jjq_tj_"+db+"_day t where t.fgs='"+gs+"' and t.type=5 and substr(t.day, 0, 6)='"+yf.replaceAll("-", "")+"' group by t.day,t.fgs order by t.day"; 
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql);
        String sql2 = "select t.fgs,sum(t.dhsj) dhsj, sum(t.tjcs) ryycs,count(distinct(t.cphm_new)) ryycl,sum(t.zlc) rzlc,sum(t.szlc) rzklc,sum(t.kslc) rkslc"+
                ",sum(t.jine) rysje,round(sum(t.yssc)/60,2) ryysc "+ 
                " from jjq_tj_"+db+"_day t where t.fgs='"+gs+"' and t.type=5 and substr(t.day, 0, 6)='"+yf.replaceAll("-", "")+"' group by t.fgs"; 
        List<Map<String, Object>> list2 = jdbcTemplate2.queryForList(sql2);
        list2.get(0).put("DAY", "总计");
        list1.add(0,list2.get(0)); 
        return list1;
    }

    public String queryyyts(String postData)
    {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String yf = String.valueOf(paramMap.get("yf"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
//        String cllx = String.valueOf(paramMap.get("cllx"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        int sr = (page-1)*pageSize+1;
        int er = page*pageSize;
        String tj="";
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t.qyid='"+qyid+"'";
        }
        if(!cp.equals("")){
            tj+=" and t.cphm = '"+cp+"'";
        }
        if(!gs.equals("")){
            tj+=" and t.fgs = '"+gs+"'";
        }
        
//        String cpddtj="'浙'||t.cphm_new";
//        if(cllx.equals("新能源车")){
//            cpddtj = "'浙A'||t.cphm_new";
//        }
        
        String db = yf.substring(0,4)+yf.substring(5, 7);
        Map<String, Object> result =new HashMap<String,Object>();
        
        String sql = "select * from (select tt.*,'"+yf+"' yf,rownum r from (select * from (select * from jjq_company t where t.fgs not like '%测试%' and  t.cphm not like '%测%' "+tj+" order by t.cphm)t1 left join (select "
                    + "CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END ch,"
                    + "NVL(count(*),0) yyts "+
                      "from JJQ_TJ_"+db+"_DAY t where t.type = '5' group by t.cphm_new) t on t.ch = t1.cphm "
                          + ")tt)ttt where ttt.r<="+er+" and ttt.r>="+sr;

        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        String sql1 = "select count(1) c "+
                      "from jjq_company t where t.fgs not like '%测试%' and  t.cphm not like '%测%'"+tj;
//        System.out.println(sql);
        List<Map<String, Object>> list1 = jdbcTemplate2.queryForList(sql1);
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("QY", setqy2(m.get("QYID").toString()));
            String ts = m.get("YYTS")==null?"0":m.get("YYTS").toString();
            m.put("YYTS", ts);
        }
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    public List<Map<String, Object>> yyts_daochu(String postData)
    {
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String yf = String.valueOf(paramMap.get("yf"));
        String qy = String.valueOf(paramMap.get("qy"));
        String gs = String.valueOf(paramMap.get("gs"));
        String cp = String.valueOf(paramMap.get("cp"));
//        String cllx = String.valueOf(paramMap.get("cllx"));
        String tj="";
        
        String qyid="";
        if(qy.equals("主城区")){
            qyid = "11";
        }else if(qy.equals("余杭区")){
            qyid = "87";
        }else if(qy.equals("萧山区")){
            qyid = "88";
        }else if(qy.equals("临安区")){
            qyid = "90";
        }else if(qy.equals("富阳区")){
            qyid = "89";
        }else if(qy.equals("淳安区")){
            qyid = "12";
        }else if(qy.equals("建德市")){
            qyid = "21";
        }
        if(!qyid.equals("")){
            tj+=" and t.qyid='"+qyid+"'";
        }
        if(!cp.equals("")){
            tj+=" and t.cphm = '"+cp+"'";
        }
        if(!gs.equals("")){
            tj+=" and t.fgs = '"+gs+"'";
        }
//        String cpddtj="'浙'||t.cphm_new";
//        if(cllx.equals("新能源车")){
//            cpddtj = "'浙A'||t.cphm_new";
//        }
        String db = yf.substring(0,4)+yf.substring(5, 7);

        String sql = "select tt.*,'"+yf+"' yf,rownum r from (select * from (select * from jjq_company t where t.fgs not like '%测试%' and  t.cphm not like '%测%' "+tj+" order by t.cphm)t1 left join (select "
                    + "CASE WHEN SUBSTR(t.cphm_new,1,1)='A' THEN '浙'||t.cphm_new ELSE '浙A'||t.cphm_new END ch,"
                    + "NVL(count(*),0) yyts "+
                      "from JJQ_TJ_"+db+"_DAY t where t.type = '5' group by t.cphm_new) t on t.ch = t1.cphm "
                          + ")tt";
        List<Map<String, Object>> list = jdbcTemplate2.queryForList(sql);
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> m = list.get(i);
            m.put("QY", setqy2(m.get("QYID").toString()));
            String ts = m.get("YYTS")==null?"0":m.get("YYTS").toString();
            m.put("YYTS", ts);
        }
        return list;
    }
    
    public List<Map<String, Object>> queryyysjfx(String postData){
        Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String module = String.valueOf(paramMap.get("module"));
        String field1 = String.valueOf(paramMap.get("field1"));
        String field2 = String.valueOf(paramMap.get("field2"));
        String field3 = String.valueOf(paramMap.get("field3"));
        String time = String.valueOf(paramMap.get("time"));
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
   		//今天，昨天
   		for (int i = 0; i < 2; i++) {
   			Map<String, Object> map1=toMap(i,finddcpjfx(module,i,field1,time));
   			if(i==0){
   				map1.put("message", "今天");
   			}else if(i==1){
   				map1.put("message", "昨天");
   			}
   			list.add(map1);
		}
   		//前天，上周
   		for (int i = 2; i < 4; i++){
   			Map<String, Object> map2=toMap(i,findday(module,i,field2,time));
   			if(i==2){
   				map2.put("message", "前天");
   			}else if(i==3){
   				map2.put("message", "上周");
   			}
   			list.add(map2);
   		}
   		//上周平均
   		Map<String, Object> map3=toMap(4,findaverage(module,field2,time));
   		map3.put("message", "上周平均");
		list.add(map3);
		//上半月最大最小
		tolist(findmaxmin(module,field3,time),list,field3);
		//上月，上年
		for (int i = 7; i < 9; i++){
   			Map<String, Object> map4=toMap(i,findday(module,i,field2,time));
   			if(i==7){
   				map4.put("message", "上月");
   			}else if(i==8){
   				map4.put("message", "上年");
   			}
   			list.add(map4);
   		}
		return list;
    }
    public List<Map<String, Object>> finddcpjfx(String module, Integer i, String field1, String time){
		String tj="";
		String sql ="";
		time=findtime(i,time);
		if(module.equals("zxyylfx")){		
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select "+field1+" COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_RUN_RATE@taxilink105 where 1=1 and  to_char(db_time, 'mi')='00'";
	        sql += tj ;		
		}else if(module.equals("lclylfx")){				
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select replace("+field1+",'%','')||'%' COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_RUN_INFO_RECORD_TEST@taxilink105 where 1=1 ";
	        sql += tj ;		
		}else if(module.equals("dcpjlcfx")){				
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select "+field1+" COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_RUN_INFO_RECORD_TEST@taxilink105 where 1=1 ";
	        sql += tj ;	
		}else if(module.equals("sxlfx")||module.equals("zclfx")){				
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select "+field1+" COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_LOAD_ONLINE_RATE@taxilink105 where 1=1 and  to_char(db_time, 'mi')='00'  and ba_id=0";
	        sql += tj ;	
		}
		System.out.println("今天昨天="+sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
		
	}
	public List<Map<String, Object>> findday(String module, Integer i, String field2, String time){
		String tj="";
		String sql ="";
		time=findtime(i,time);
		if(module.equals("zxyylfx")){		
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select "+field2+" COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_RUN_RATE@taxilink105 where 1=1 and  to_char(db_time, 'mi')='00'";
	        sql += tj ;		
		}else if(module.equals("lclylfx")){			
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select replace("+field2+",'%','')||'%' COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_RUN_INFO_RECORD_TEST@taxilink105 where 1=1 ";
	        sql += tj ;		
		}else if(module.equals("dcpjlcfx")){			
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select "+field2+" COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_RUN_INFO_RECORD_TEST@taxilink105 where 1=1 ";
	        sql += tj ;		
		}else if(module.equals("sxlfx")||module.equals("zclfx")){				
			if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
				tj += " and db_time >=to_date('"+time+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+time+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
			}
			sql += "select "+field2+" COUNT,to_char(db_time,'hh24') TIME from TB_TAXI_LOAD_ONLINE_RATE@taxilink105 where 1=1 and  to_char(db_time, 'mi')='00'  and ba_id=0";
	        sql += tj ;	
		}
		System.out.println("前天上周 上月上年="+sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
		
	}
	public List<Map<String, Object>> findaverage(String module, String field2, String time){
		String tj="";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar calendar = Calendar.getInstance();
		if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
//			time = time.replaceAll("-","");
		}else{
			time=sdf.format(new Date());
		}
		try {
			calendar.setTime(sdf.parse(time));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		calendar.setFirstDayOfWeek(Calendar.MONDAY);
		calendar.add(Calendar.DATE, -7);
	    calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
	    String stime = sdf.format(calendar.getTime());
	    calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
	    String etime = sdf.format(calendar.getTime());
	    String sql = "";
	    if(module.equals("zxyylfx")){
			tj += " and db_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
	    	sql+= "select ROUND(sum(replace("+field2+",'%',''))/count("+field2+"))||'%' COUNT,to_char(db_time, 'hh24') TIME from TB_TAXI_RUN_RATE@taxilink105 "
	    			+ " where 1=1  and  to_char(db_time, 'mi')='00'";
	    	sql+=tj;
	    	sql+= " group by to_char(db_time, 'hh24') order by to_char(db_time, 'hh24')";
	    }else if(module.equals("lclylfx")){	    	
	    	tj += " and db_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
	    	sql+= "select ROUND(sum(replace("+field2+",'%',''))/count("+field2+"))||'%' COUNT,to_char(db_time, 'hh24') TIME from TB_TAXI_RUN_INFO_RECORD_TEST@taxilink105 "
	    			+ " where 1=1  and  to_char(db_time, 'mi')='00'";
	    	sql+=tj;
	    	sql+= " group by to_char(db_time, 'hh24') order by to_char(db_time, 'hh24')";
	    }else if(module.equals("dcpjlcfx")){	    	
	    	tj += " and db_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
	    	sql+= "select ROUND(sum("+field2+")/count("+field2+"),2) COUNT,to_char(db_time, 'hh24') TIME from TB_TAXI_RUN_INFO_RECORD_TEST@taxilink105 "
	    			+ " where 1=1  and  to_char(db_time, 'mi')='00'";
	    	sql+=tj;
	    	sql+= " group by to_char(db_time, 'hh24') order by to_char(db_time, 'hh24')";
	    }else if(module.equals("sxlfx")||module.equals("zclfx")){	    	
	    	tj += " and db_time >=to_date('"+stime+" 00:00:00','yyyy-mm-dd hh24:mi:ss') and db_time <=to_date('"+etime+" 23:59:59','yyyy-mm-dd hh24:mi:ss')";
	    	sql+= "select ROUND(sum(replace("+field2+",'%',''))/count("+field2+"))||'%' COUNT,to_char(db_time, 'hh24') TIME from TB_TAXI_LOAD_ONLINE_RATE@taxilink105 "
	    			+ " where 1=1  and  to_char(db_time, 'mi')='00'  and ba_id=0";
	    	sql+=tj;
	    	sql+= " group by to_char(db_time, 'hh24') order by to_char(db_time, 'hh24')";
	    }
	    
		System.out.println("平均  " + sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
		
	}
	public List<Map<String, Object>> findmaxmin(String module,String field3, String time){
		String tj="";
		time=findtime(1,time);
		String sql = "";		
		if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
			tj += " and to_char(enddate, 'yyyy-mm-dd') ='"+time+"'";
		}
		if(module.equals("sxlfx")||module.equals("zclfx")){			
			sql += "select * from TB_AREA_HALF_MONTH_ONLINE_RATE@taxilink105  where 1=1 and ba_id=0 and rownum<2";
			sql += tj;
			sql +=" order by id desc";
		}else if(module.equals("zxyylfx")||module.equals("lclylfx")||module.equals("dcpjlcfx")){		
			sql += "select * from TB_HALF_MONTH_ONLINE_RUN_RATE@taxilink105  where 1=1";
			sql += tj;
		}
		System.out.println("findmaxmin="+sql);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;
	}
	private String findtime(Integer i, String time) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar calendar = Calendar.getInstance();
		if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0&&!time.equals("时间")){
//			time = time.replaceAll("-","");
		}else{
			calendar.setTime(new Date());
			time=sdf.format(calendar.getTime());
		}
		
		try {
			calendar.setTime(sdf.parse(time));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		if(i==0){
			return time;
		}else if(i==1){
			calendar.add(Calendar.DATE, -1);
			Date date = calendar.getTime();
			time=sdf.format(date);
			return time;
		}else if(i==2){
			calendar.add(Calendar.DATE, -2);
			Date date = calendar.getTime();
			time=sdf.format(date);
			return time;
		}else if(i==3){
			calendar.add(Calendar.DATE, -7);
			Date date = calendar.getTime();
			time=sdf.format(date);
			return time;
		}else if(i==7){
			calendar.add(Calendar.MONDAY, -1);
			Date date = calendar.getTime();
			time=sdf.format(date);
			return time;
		}else if(i==8){
			calendar.add(Calendar.YEAR, -1);
			Date date = calendar.getTime();
			time=sdf.format(date);
			return time;
		}
		return null;
	}
    private void tolist(List<Map<String, Object>> listmaxmin,
			List<Map<String, Object>> list, String field3) {
		String[] max = { "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
				"0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0" };
		String[] min = { "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
				"0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0" };
		if (listmaxmin.size() != 0) {
			max = String.valueOf(listmaxmin.get(0).get(field3+"_MAX")).split(
					";");
			min = String.valueOf(listmaxmin.get(0).get(field3+"_MIN")).split(
					";");
		}
		Map<String, Object> maxMap = new HashMap<String, Object>();
		for (int j = 0; j < max.length; j++) {
			maxMap.put("y" + j, max[j]);
		}
		maxMap.put("message", "前半月最大");

		Map<String, Object> minMap = new HashMap<String, Object>();
		for (int j = 0; j < min.length; j++) {
			minMap.put("y" + j, min[j]);
		}
		minMap.put("message", "前半月最小");
		list.add(maxMap);
		list.add(minMap);	
	}
	private Map<String, Object> toMap(int m,List<Map<String, Object>> list) {
		String[] str = { "00", "01", "02", "03", "04", "05",
				"06", "07", "08", "09", "10", "11", "12", "13",
				"14", "15", "16", "17", "18", "19", "20", "21",
				"22", "23", };
		Map<String, Object> map = new HashMap<String, Object>();
		int a = 0;
		for (int i = 0; i < list.size(); i++) {
			if ((a=Arrays.asList(str).indexOf(list.get(i).get("TIME")))>-1) {
				map.put("y" + a, list.get(i).get("COUNT"));
			}
		}
		for (int i = 0; i < 24; i++) {
			if (map.get("y" + i) == null) {
				map.put("y" + i, "");
			}
		}
		return map;
	}
    private String setqy2(String qyid)
    {
        if(qyid.equals("11")){
            return "主城区";
        }else if(qyid.equals("87")){
            return "余杭区";
        }else if(qyid.equals("88")){
            return "萧山区";
        }else if(qyid.equals("90")){
            return "临安区";
        }else if(qyid.equals("89")){
            return "富阳区";
        }else if(qyid.equals("12")){
            return "淳安区";
        }else if(qyid.equals("21")){
            return "建德市";
        }else{
            return "未知";
        }
    }

	public String queryyyrb(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String ba_name = String.valueOf(paramMap.get("gs"));
        
        String sss = "select * from (select count(1) count from ( select * from HZGPS_TAXI.VW_VEHICLE@db69 where 1 = 1";
        if(ba_name!=null&&!"".equals(ba_name)){
        	sss += " and comp_name in ('"+ba_name+"')";
        }
        sss  += ")),(";
        
        String str = "select BA_NAME from TB_TAXI_DAY@db69 GROUP BY BA_NAME";
        List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(str);
        String comp = "'";
        for(int i=0;i<queryForList.size()-1;i++){
        	comp += queryForList.get(i).get("BA_NAME") + "','";
        }
        comp += queryForList.get(queryForList.size()-1).get("BA_NAME") + "'";
        
        String pageSql = "select * from (select A.*,ROWNUM RN from (";
        String sql = "";
        
        String countSql = "select count(1) from (";
        
        if(ba_name!=null&&!"".equals(ba_name)){
        	sql="select * from TB_TAXI_DAY@db69 where " +
        			"db_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and  " +
        			" db_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') and " +
        					"ba_name='"+ba_name+"' order by db_time desc";
        }else{
        	int gss = comp.split(",").length;
			sql="select db_time,sum(run_taxis) run_taxis,round(sum(run_times)/"+gss+",2) run_times, " +
			"round(sum(run_profit)/"+gss+",2) run_profit ,round(sum(rtrim(actual_load_rate,'%'))/"+gss+",2) actual_load_rate," +
			"round(sum(run_time)/"+gss+",2) run_time, round(sum(waitting_time)/"+gss+",2) waitting_time," +
			"round(sum(actual_load_mileage)/"+gss+",2) actual_load_mileage," +
			"round(sum(no_load_mileage)/"+gss+",2) no_load_mileage " +
			"from (select trunc(db_time,'hh') db_time,run_taxis,run_times,run_profit ,actual_load_rate," +
			"run_time,waitting_time,actual_load_mileage,no_load_mileage from" +
			" TB_TAXI_DAY@db69 t where " +
			"db_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and " +
			" db_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
			sql+=" and ba_name in ("+comp+")";
			sql+=") where 1=1 group by db_time  order by db_time desc";
        }
        
        int ss = (page-1)*pageSize+1;
        
        sss += sql +")";
        
        pageSql += sss + ")A where ROWNUM <= "+page*pageSize+") where RN >= "+ss;
        
        countSql += sql + ")";
        
        List<Map<String, Object>> list = jdbcTemplate.queryForList(pageSql);
        Integer count = jdbcTemplate.queryForObject(countSql, Integer.class);
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("data", list);
        map.put("count", count);
		return jacksonUtil.toJson(map);
	}
	
	public List<Map<String, Object>> queryyyrb_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String ba_name = String.valueOf(paramMap.get("gs"));
        
        String sss = "select * from (select count(1) count from ( select * from HZGPS_TAXI.VW_VEHICLE@db69 where 1 = 1";
        if(ba_name!=null&&!"".equals(ba_name)){
        	sss += " and comp_name in ('"+ba_name+"')";
        }
        sss  += ")),(";
        
        String str = "select BA_NAME from TB_TAXI_DAY@db69 GROUP BY BA_NAME";
        List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(str);
        String comp = "'";
        for(int i=0;i<queryForList.size()-1;i++){
        	comp += queryForList.get(i).get("BA_NAME") + "','";
        }
        comp += queryForList.get(queryForList.size()-1).get("BA_NAME") + "'";
        
        String pageSql = "select * from (select A.*,ROWNUM RN from (";
        String sql = "";
        
        if(ba_name!=null&&!"".equals(ba_name)){
        	sql="select * from TB_TAXI_DAY@db69 where " +
        			"db_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and  " +
        			" db_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss') and " +
        					"ba_name='"+ba_name+"' order by db_time desc";
        }else{
        	int gss = comp.split(",").length;
			sql="select db_time,sum(run_taxis) run_taxis,round(sum(run_times)/"+gss+",2) run_times, " +
			"round(sum(run_profit)/"+gss+",2) run_profit ,round(sum(rtrim(actual_load_rate,'%'))/"+gss+",2) actual_load_rate," +
			"round(sum(run_time)/"+gss+",2) run_time, round(sum(waitting_time)/"+gss+",2) waitting_time," +
			"round(sum(actual_load_mileage)/"+gss+",2) actual_load_mileage," +
			"round(sum(no_load_mileage)/"+gss+",2) no_load_mileage " +
			"from (select trunc(db_time,'hh') db_time,run_taxis,run_times,run_profit ,actual_load_rate," +
			"run_time,waitting_time,actual_load_mileage,no_load_mileage from" +
			" TB_TAXI_DAY@db69 t where " +
			"db_time>=to_date('"+stime+"','yyyy-mm-dd hh24:mi:ss') and " +
			" db_time<=to_date('"+etime+"','yyyy-mm-dd hh24:mi:ss')";
			sql+=" and ba_name in ("+comp+")";
			sql+=") where 1=1 group by db_time  order by db_time desc";
        }
        
        int ss = (page-1)*pageSize+1;
        
        sss += sql +")";
        
        pageSql += sss + ")A where ROWNUM <= "+page*pageSize+") where RN >= "+ss;
        
        List<Map<String, Object>> list = jdbcTemplate.queryForList(pageSql);
		return list;
	}

	public String queryyyyb(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String name = String.valueOf(paramMap.get("gs"));
        int ss = (page-1)*pageSize+1;
        
        String str = "select BA_NAME from TB_TAXI_DAY@db69 GROUP BY BA_NAME";
        List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(str);
        String comp = "'";
        for(int i=0;i<queryForList.size()-1;i++){
        	comp += queryForList.get(i).get("BA_NAME") + "','";
        }
        comp += queryForList.get(queryForList.size()-1).get("BA_NAME") + "'";
        
        String s = stime.substring(0, 10).replaceAll("-", "");
        String e = etime.substring(0, 10).replaceAll("-", "");
        String sql = "";
        String pageSql = "select * from (select A.*,ROWNUM RN from (";
        String countSql = "select count(1) count from (";
        if(name!=null&&!"".equals(name)){
        	sql="select t.*,SUBSTR(t.report_time, 0, 4) || '-' || SUBSTR(t.report_time, 5, 2) || '-' || SUBSTR(t.report_time, 7, 2) time from TB_TAXI_MONTHLY@db69 t where" +
					" report_time >= '"+s+"' and report_time <= '"+e+"' and ba_anme='"+name+"' order by report_time desc";
        }else{
        	int gss = comp.split(",").length;
			System.out.println(gss);
				sql="select SUBSTR(report_time, 0, 4) || '-' || SUBSTR(report_time, 5, 2) || '-' || SUBSTR(report_time, 7, 2) time,report_time,sum(repore_vhic) repore_vhic," +
				"sum(repore_no) repore_no,sum(repore_vhicno) repore_vhicno," +
				"round(sum(REPORE_TURNOVER)/"+gss+",0) REPORE_TURNOVER," +
				"round(sum(rtrim(REPORE_RADE,'%'))/"+gss+",2) REPORE_RADE," +
				"round(sum(REPORE_AMOUNT_REVENUE)/"+gss+",0) REPORE_AMOUNT_REVENUE," +
				"round(sum(rtrim(REPORE_ACTUAL_LOADING,'%'))/"+gss+",2) REPORE_ACTUAL_LOADING," +
				"round(sum(REPORE_CAR_TIME)/"+gss+",2) REPORE_CAR_TIME," +
				"round(sum(REPROE_REVENUE_TIME)/"+gss+",2) REPROE_REVENUE_TIME," +
				"round(sum(REPORE_WAIT_TIME)/"+gss+",2) REPORE_WAIT_TIME," +
				"round(sum(REPORE_MILEAGE)/"+gss+",2) REPORE_MILEAGE," +
				"round(sum(REPORE_ACTUAL_MILEAGE)/"+gss+",2) REPORE_ACTUAL_MILEAGE," +
				"round(sum(REPORE_EMPTY_MILEAGE)/"+gss+",2) REPORE_EMPTY_MILEAGE" +
				" from TB_TAXI_MONTHLY@db69 t where 1=1 " ;
				sql+=" and ba_anme in ("+comp+")";
				sql+=" and  report_time >= '"+s+"' and report_time <= '"+e+"'  group by report_time order by report_time desc";
        }
        countSql += sql + ")";
        pageSql += sql + ")A where ROWNUM <= "+page*pageSize+") where RN >= "+ss;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(pageSql);
        Integer count = jdbcTemplate.queryForObject(countSql, Integer.class);
        Map<String,Object> map = new HashMap<String,Object>();
        map.put("data", list);
        map.put("count",count);
		return jacksonUtil.toJson(map);
	}

	public List<Map<String, Object>> queryyyyb_daochu(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
		String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String name = String.valueOf(paramMap.get("gs"));
        int ss = (page-1)*pageSize+1;
        
        String str = "select BA_NAME from TB_TAXI_DAY@db69 GROUP BY BA_NAME";
        List<Map<String, Object>> queryForList = jdbcTemplate.queryForList(str);
        String comp = "'";
        for(int i=0;i<queryForList.size()-1;i++){
        	comp += queryForList.get(i).get("BA_NAME") + "','";
        }
        comp += queryForList.get(queryForList.size()-1).get("BA_NAME") + "'";
        
        String s = stime.substring(0, 10).replaceAll("-", "");
        String e = etime.substring(0, 10).replaceAll("-", "");
        String sql = "";
        String pageSql = "select * from (select A.*,ROWNUM RN from (";
        if(name!=null&&!"".equals(name)){
        	sql="select t.*,SUBSTR(t.report_time, 0, 4) || '-' || SUBSTR(t.report_time, 5, 2) || '-' || SUBSTR(t.report_time, 7, 2) time from TB_TAXI_MONTHLY@db69 t where" +
					" report_time >= '"+s+"' and report_time <= '"+e+"' and ba_anme='"+name+"' order by report_time desc";
        }else{
        	int gss = comp.split(",").length;
			System.out.println(gss);
				sql="select SUBSTR(report_time, 0, 4) || '-' || SUBSTR(report_time, 5, 2) || '-' || SUBSTR(report_time, 7, 2) time,report_time,sum(repore_vhic) repore_vhic," +
				"sum(repore_no) repore_no,sum(repore_vhicno) repore_vhicno," +
				"round(sum(REPORE_TURNOVER)/"+gss+",0) REPORE_TURNOVER," +
				"round(sum(rtrim(REPORE_RADE,'%'))/"+gss+",2) REPORE_RADE," +
				"round(sum(REPORE_AMOUNT_REVENUE)/"+gss+",0) REPORE_AMOUNT_REVENUE," +
				"round(sum(rtrim(REPORE_ACTUAL_LOADING,'%'))/"+gss+",2) REPORE_ACTUAL_LOADING," +
				"round(sum(REPORE_CAR_TIME)/"+gss+",2) REPORE_CAR_TIME," +
				"round(sum(REPROE_REVENUE_TIME)/"+gss+",2) REPROE_REVENUE_TIME," +
				"round(sum(REPORE_WAIT_TIME)/"+gss+",2) REPORE_WAIT_TIME," +
				"round(sum(REPORE_MILEAGE)/"+gss+",2) REPORE_MILEAGE," +
				"round(sum(REPORE_ACTUAL_MILEAGE)/"+gss+",2) REPORE_ACTUAL_MILEAGE," +
				"round(sum(REPORE_EMPTY_MILEAGE)/"+gss+",2) REPORE_EMPTY_MILEAGE" +
				" from TB_TAXI_MONTHLY@db69 t where 1=1 " ;
				sql+=" and ba_anme in ("+comp+")";
				sql+=" and  report_time >= '"+s+"' and report_time <= '"+e+"'  group by report_time order by report_time desc";
        }
        pageSql += sql + ")A where ROWNUM <= "+page*pageSize+") where RN >= "+ss;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(pageSql);
		return list;
	}

	public String querywcmrtd(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String tj="";
        if(stime!=null&&!stime.isEmpty()&&!stime.equals("null")&&stime.length()>0){
			tj += " and m.DBTIME >= to_date('"+stime+"','yyyy-mm-dd')";
		}
		if(etime!=null&&!etime.isEmpty()&&!etime.equals("null")&&etime.length()>0){
			tj += " and m.DBTIME <= to_date('"+etime+"','yyyy-mm-dd')";
		}
		if(cp!=null&&!cp.isEmpty()&&!cp.equals("null")&&cp.length()>0){
			tj += " and m.VEHICLENUM = '"+cp+"'";
		}
		String sql = "select (select count(*) COUNT from Tb_mz5p@db69 m where 1=1 ";
		sql += tj;
		sql+=") as count, tt.* from (select t.*, j.*, rownum as rn from (select m.*,to_char(INTIME,'yyyy-mm-dd hh24:mi:ss') jrsj,to_char(OUTTIME,'yyyy-mm-dd hh24:mi:ss') lksj,d.POINT_NAME,to_char(DBTIME,'yyyy-mm-dd') sj"
				+ " from Tb_mz5p@db69 m,TB_MZ_JQ@db69 d where d.PID=m.PointID";
		sql += tj;
		sql += " order by m.DBTIME desc,m.VEHICLENUM) t left join (select sum(to_number(substr(DENGHOU,0,2))*60*60+to_number(substr(DENGHOU,3,2))*60+to_number(substr(DENGHOU,5,2))) dhsj,count(vhic) yycs,vhic,shangchedate from (select distinct j.* from jjq"+stime.replace("-", "").substring(0,6)+"_1@JJQ89 j,Tb_mz5p@db69 m where flag = '1000000000' and m.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(m.DBTIME,'yyyymmdd')";
		sql += tj;
		sql += " )group by vhic,shangchedate) j"
				+ " on t.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(t.DBTIME,'yyyymmdd') where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		sql +="order by DBTIME desc, VEHICLENUM";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		DecimalFormat decimalFormat=new DecimalFormat(".00");
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("DHSJ", String.valueOf(list.get(i).get("DHSJ")).equals("null")?"":decimalFormat.format(Float.valueOf(list.get(i).get("DHSJ").toString())/60));
			}
		}
		Map  map = new HashMap ();
		map.put("datas",list);
		map.put("count", count);
        return jacksonUtil.toJson(map);
	}

	public String querysfzystl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String point = String.valueOf(paramMap.get("point"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String tj="";
        if(stime!=null&&!stime.isEmpty()&&!stime.equals("null")&&stime.length()>0){
			tj += " and m.DBTIME >= to_date('"+stime+"','yyyy-mm-dd')";
		}
		if(etime!=null&&!etime.isEmpty()&&!etime.equals("null")&&etime.length()>0){
			tj += " and m.DBTIME <= to_date('"+etime+"','yyyy-mm-dd')";
		}
		if(point!=null&&!point.isEmpty()&&!point.equals("null")&&point.length()>0){
			tj += " and m.PointID like '%"+point+"%'";
		}
		if(cp!=null&&!cp.isEmpty()&&!cp.equals("null")&&cp.length()>0){
			tj += " and m.VEHICLENUM = '"+cp+"'";
		}
		String sql = "select (select count(*) COUNT from Tb_mz10m@db69 m where 1=1 ";
		sql += tj;
		sql+=") as count, tt.* from (select t.*, j.*, rownum as rn from (select"
				+ " m.*,to_char(DBTIME,'yyyy-mm-dd') sj,d.POINT_NAME from Tb_mz10m@db69 m,TB_MZ_JQ@db69 d where d.PID=m.PointID";
		sql += tj;
		sql += " order by m.DBTIME desc,m.VEHICLENUM) t left join (select sum(to_number(substr(DENGHOU,0,2))*60*60+to_number(substr(DENGHOU,3,2))*60+to_number(substr(DENGHOU,5,2))) dhsj,count(vhic) yycs,vhic,shangchedate from (select distinct j.* from jjq"+stime.replace("-", "").substring(0,6)+"_1@JJQ89 j,Tb_mz10m@db69 m where flag = '1000000000' and m.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(m.DBTIME,'yyyymmdd')";
		sql += tj;
		sql += " )group by vhic,shangchedate) j"
				+ " on t.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(t.DBTIME,'yyyymmdd') where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		sql +="order by DBTIME desc, VEHICLENUM";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		DecimalFormat decimalFormat=new DecimalFormat(".00");
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("DHSJ", String.valueOf(list.get(i).get("DHSJ")).equals("null")?"":decimalFormat.format(Float.valueOf(list.get(i).get("DHSJ").toString())/60));
			}
		}
		Map  map = new HashMap ();
		map.put("datas",list);
		map.put("count", count);
        return jacksonUtil.toJson(map);
	}

	public String querysrtdw(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String tj="";
        if(stime!=null&&!stime.isEmpty()&&!stime.equals("null")&&stime.length()>0){
			tj += " and m.DBTIME >= to_date('"+stime+"','yyyy-mm-dd')";
		}
		if(etime!=null&&!etime.isEmpty()&&!etime.equals("null")&&etime.length()>0){
			tj += " and m.DBTIME <= to_date('"+etime+"','yyyy-mm-dd')";
		}
		if(cp!=null&&!cp.isEmpty()&&!cp.equals("null")&&cp.length()>0){
			tj += " and m.VEHICLENUM = '"+cp+"'";
		}
		String sql = "select (select count(*) COUNT from tb_mz3d@db69 m where 1=1 ";
		sql += tj;
		sql+=") as count, tt.* from (select t.*, j.*, rownum as rn from (select"
				+ " m.*,to_char(DBTIME,'yyyy-mm-dd') sj,d.POINT_NAME from tb_mz3d@db69 m,TB_MZ_JQ@db69 d where d.PID=m.PointID";
		sql += tj;
		sql += " order by m.DBTIME desc,m.VEHICLENUM) t left join (select sum(to_number(substr(DENGHOU,0,2))*60*60+to_number(substr(DENGHOU,3,2))*60+to_number(substr(DENGHOU,5,2))) dhsj,count(vhic) yycs,vhic,shangchedate from (select distinct j.* from jjq"+stime.replace("-", "").substring(0,6)+"_1@JJQ89 j,tb_mz3d@db69 m where flag = '1000000000' and m.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(m.DBTIME,'yyyymmdd')";
		sql += tj;
		sql += " )group by vhic,shangchedate) j"
				+ " on t.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(t.DBTIME,'yyyymmdd') where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		sql +="order by  DBTIME desc,VEHICLENUM";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		DecimalFormat decimalFormat=new DecimalFormat(".00");
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("DHSJ", String.valueOf(list.get(i).get("DHSJ")).equals("null")?"":decimalFormat.format(Float.valueOf(list.get(i).get("DHSJ").toString())/60));
			}
		}
		Map  map = new HashMap ();
		map.put("datas",list);
		map.put("count", count);
        return jacksonUtil.toJson(map);
	}

	public String querygjqsdyssfz(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String tj="";
        if(stime!=null&&!stime.isEmpty()&&!stime.equals("null")&&stime.length()>0){
			tj += " and m.DBTIME >= to_date('"+stime+"','yyyy-mm-dd')";
		}
		if(etime!=null&&!etime.isEmpty()&&!etime.equals("null")&&etime.length()>0){
			tj += " and m.DBTIME <= to_date('"+etime+"','yyyy-mm-dd')";
		}
		if(cp!=null&&!cp.isEmpty()&&!cp.equals("null")&&cp.length()>0){
			tj += " and m.VEHICLENUM = '"+cp+"'";
		}
		String sql = "select (select count(*) COUNT from Tb_mz_error@db69 m where 1=1 ";
		sql += tj;
		sql+=") as count, tt.* from (select t.*, j.*, rownum as rn from (select"
				+ " m.*,to_char(DBTIME,'yyyy-mm-dd') sj from Tb_mz_error@db69 m where 1=1";
		sql += tj;
		sql += " order by m.DBTIME desc,m.VEHICLENUM) t left join (select sum(to_number(substr(DENGHOU,0,2))*60*60+to_number(substr(DENGHOU,3,2))*60+to_number(substr(DENGHOU,5,2))) dhsj,count(vhic) yycs,vhic,shangchedate from (select distinct j.* from jjq"+stime.replace("-", "").substring(0,6)+"_1@JJQ89  j,Tb_mz_error@db69 m  where flag = '1000000000' and m.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(m.DBTIME,'yyyymmdd')";
		sql += tj;
		sql += " )group by vhic,shangchedate) j"
				+ " on t.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(t.DBTIME,'yyyymmdd') where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		sql +="order by  DBTIME desc,VEHICLENUM";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		DecimalFormat decimalFormat=new DecimalFormat(".00");
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("DHSJ", String.valueOf(list.get(i).get("DHSJ")).equals("null")?"":decimalFormat.format(Float.valueOf(list.get(i).get("DHSJ").toString())/60));
				list.get(i).put("ERRORTYPE",String.valueOf(list.get(i).get("ERRORTYPE")).equals("0")?"缺失大于30分钟":(String.valueOf(list.get(i).get("ERRORTYPE")).equals("1")?"空数据":""));
			}
		}
		Map  map = new HashMap ();
		map.put("datas",list);
		map.put("count", count);
        return jacksonUtil.toJson(map);
	}

	public String queryjqrqdcl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String tj="";
		if(stime!=null&&!stime.isEmpty()&&!stime.equals("null")&&stime.length()>0){
			tj += " and m.DBTIME >= to_date('"+stime+"','yyyy-mm-dd')";
		}
		if(etime!=null&&!etime.isEmpty()&&!etime.equals("null")&&etime.length()>0){
			tj += " and m.DBTIME <= to_date('"+etime+"','yyyy-mm-dd')";
		}
		if(cp!=null&&!cp.isEmpty()&&!cp.equals("null")&&cp.length()>0){
			tj += " and m.VEHICLENUM = '"+cp+"'";
		}
		String sql = "select (select count(*) COUNT from Tb_mz_ratio@db69 m where 1=1 ";
		sql += tj;
		sql+=") as count, tt.* from (select t.*, j.*, rownum as rn from (select"
				+ " m.*,to_char(DBTIME,'yyyy-mm-dd') sj from Tb_mz_ratio@db69 m where 1=1";
		sql += tj;
		sql += " order by m.DBTIME desc,m.VEHICLENUM) t"
				+ " left join (select sum(to_number(substr(DENGHOU,0,2))*60*60+to_number(substr(DENGHOU,3,2))*60+to_number(substr(DENGHOU,5,2))) dhsj,count(vhic) yycs,vhic,shangchedate from (select distinct j.* from jjq"+stime.replace("-", "").substring(0,6)+"_1@JJQ89 j,Tb_mz_ratio@db69 m where flag = '1000000000' and m.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(m.DBTIME,'yyyymmdd')";
		sql += tj;
		sql += ") group by vhic,shangchedate) j on t.VEHICLENUM ='浙'||j.vhic and j.shangchedate=to_char(t.DBTIME,'yyyymmdd') where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		sql +="order by DBTIME desc,VEHICLENUM";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		DecimalFormat decimalFormat=new DecimalFormat(".00");
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("RATIO", String.valueOf(list.get(i).get("RATIO")).indexOf(".")==0?"0"+String.valueOf(list.get(i).get("RATIO"))+"%":String.valueOf(list.get(i).get("RATIO"))+"%");
				list.get(i).put("DHSJ", String.valueOf(list.get(i).get("DHSJ")).equals("null")?"":decimalFormat.format(Float.valueOf(list.get(i).get("DHSJ").toString())/60));
			}
		}
		Map  map = new HashMap ();
		map.put("datas",list);
		map.put("count", count);
        return jacksonUtil.toJson(map);
	}

	public String queryysmzcl(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String stime = String.valueOf(paramMap.get("stime"));
        String etime = String.valueOf(paramMap.get("etime"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String tj="";
		if(stime!=null&&!stime.isEmpty()&&!stime.equals("null")&&stime.length()>0){
			tj += " and m.DBTIME >= to_date('"+stime+"','yyyy-mm-dd')";
		}
		if(etime!=null&&!etime.isEmpty()&&!etime.equals("null")&&etime.length()>0){
			tj += " and m.DBTIME <= to_date('"+etime+"','yyyy-mm-dd')";
		}
		if(cp!=null&&!cp.isEmpty()&&!cp.equals("null")&&cp.length()>0){
			tj += " and m.VEHICLENUM = '"+cp+"'";
		}
		String sql = "select (select count(*) COUNT from Tb_mz_taxi@db69 m where 1=1 ";
		sql += tj;
		sql+=") as count, tt.* from (select t.*, rownum as rn from (select"
				+ " m.*,to_char(DBTIME,'yyyy-mm-dd') sj from Tb_mz_taxi@db69 m where 1=1";
		sql += tj;
		sql += " order by m.DBTIME desc,m.VEHICLENUM)t where rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		DecimalFormat decimalFormat=new DecimalFormat(".00");
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("DHSJ", String.valueOf(list.get(i).get("DHSJ")).equals("null")?"":decimalFormat.format(Float.valueOf(list.get(i).get("DHSJ").toString())/60));
			}
		}
		Map  map = new HashMap ();
		map.put("datas",list);
		map.put("count", count);
        return jacksonUtil.toJson(map);
	}

	public String queryhzb(String postData) {
		Map<String,Object> paramMap = jacksonUtil.toObject(postData,new TypeReference<Map<String,Object>>() {});
        String time = String.valueOf(paramMap.get("time"));
        String cp = String.valueOf(paramMap.get("cp"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page")==null?"1":paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize")==null?"999999":paramMap.get("pageSize")));
        String tj="";
        String tj2="";
		if(time!=null&&!time.isEmpty()&&!time.equals("null")&&time.length()>0){
			tj += " and DBTIME = to_date('"+time+"','yyyy-mm-dd')";
		}
		if(cp!=null&&!cp.isEmpty()&&!cp.equals("null")&&cp.length()>0){
			tj2 += " and t.vehicle_no = '"+cp+"'";
		}
		String sql="with"
				//5次/日同点
				+ " a as ( select row_number() over(partition by vehiclea order by pointida) rna,m.*,j.POINT_NAME pointa"
				+ " from (select vehiclenum vehiclea,pointid pointida,count(pointid) counta,ceil(sum((outtime - intime) * 24*60)) timea from Tb_mz5p@db69 where 1=1 "+tj
				+ " group by vehiclenum, pointid) m,TB_MZ_JQ@db69 j where j.PID=m.pointida "
				//10分钟以上停留/日
				+ " ),b as( select row_number() over(partition by vehicleb order by pointidb) rnb,m.*,j.POINT_NAME pointb"
				+ " from (select vehiclenum vehicleb,pointid pointidb, stopcount countb,stoptime timeb from Tb_mz10m@db69 where 1=1 "+tj
				+ " ) m,TB_MZ_JQ@db69 j where j.PID=m.pointidb"
				//3日同点位
				+ " ),c as( select row_number() over(partition by vehiclec order by pointidc) rnc,m.*,j.POINT_NAME pointc"
				+ " from (select vehiclenum vehiclec,pointid pointidc, count(pointid) countc  from tb_mz3d@db69 where 1=1 "+tj
				+ "  group by vehiclenum, pointid) m,TB_MZ_JQ@db69 j where j.PID=m.pointidc "
				//轨迹缺失大于30分钟
				+ " ),d as( select row_number() over(partition by vehicled order by vehicled) rnd,m.*"
				+ " from (select vehiclenum vehicled,count(vehiclenum) countd from Tb_mz_error@db69 where 1=1"+tj
				+ "  group by vehiclenum) m" 
				//景区绕圈的车辆
				+ " ),e as( select row_number() over(partition by vehiclee order by vehiclee) rne,m.*"
				+ " from  (select vehiclenum vehiclee,Ratio from Tb_mz_ratio@db69  where 1=1 and Ratio>0 "+tj+""
				//sql
				+ ") m) select (select count(1) from (select case"
				+ " when a.vehiclea is not null then a.vehiclea"
				+ " when b.vehicleb is not null then b.vehicleb"
				+ " when c.vehiclec is not null then c.vehiclec"
				+ " when d.vehicled is not null then d.vehicled"
				+ " when e.vehiclee is not null then e.vehiclee"
				+ " end vehicle_no"
				+ " from a"
				+ " full join b on a.vehiclea=b.vehicleb and a.rna=b.rnb"
				+ " full join c on (a.vehiclea=c.vehiclec and a.rna=c.rnc) or (b.vehicleb=c.vehiclec and b.rnb=c.rnc)"
				+ " full join d on (a.vehiclea=d.vehicled and a.rna=d.rnd) or (b.vehicleb=d.vehicled and b.rnb=d.rnd) or (c.vehiclec=d.vehicled and c.rnc=d.rnd)"
				+ " full join e on (c.vehiclec=e.vehiclee and c.rnc=e.rne)"
				+ ") t where 1=1";
		sql +=tj2;
		sql += ") as count,tt.* from (select t.*, j.*, rownum as rn from(select case"
				+ " when a.vehiclea is not null then a.vehiclea"
				+ " when b.vehicleb is not null then b.vehicleb"
				+ " when c.vehiclec is not null then c.vehiclec"
				+ " when d.vehicled is not null then d.vehicled"
				+ " when e.vehiclee is not null then e.vehiclee"
				+ " end vehicle_no, a.*,b.*,c.*,d.*,e.* from a"
				+ " full join b on a.vehiclea=b.vehicleb and a.rna=b.rnb"
				+ " full join c on (a.vehiclea=c.vehiclec and a.rna=c.rnc) or (b.vehicleb=c.vehiclec and b.rnb=c.rnc)"
				+ " full join d on (a.vehiclea=d.vehicled and a.rna=d.rnd) or (b.vehicleb=d.vehicled and b.rnb=d.rnd) or (c.vehiclec=d.vehicled and c.rnc=d.rnd)"
				+ " full join e on (c.vehiclec=e.vehiclee and c.rnc=e.rne)"
				+ " order by (case "
				+ " when a.vehiclea is not null then a.vehiclea"
				+ " when b.vehicleb is not null then b.vehicleb"
				+ " when c.vehiclec is not null then c.vehiclec"
				+ " when d.vehicled is not null then d.vehicled"
				+ " when e.vehiclee is not null then e.vehiclee"
				+ " end),(case "
				+ " when a.rna is not null then a.rna"
				+ " when b.rnb is not null then b.rnb"
				+ " when c.rnc is not null then c.rnc"
				+ " when d.rnd is not null then d.rnd"
				+ " when e.rne is not null then e.rne"
				+ " end)"
				+ ") t "
				+ " left join (select sum(to_number(substr(DENGHOU,0,2))*60*60+to_number(substr(DENGHOU,3,2))*60+to_number(substr(DENGHOU,5,2))) dhsj,count(vhic) yycs,vhic,shangchedate from jjq"+time.replace("-", "").substring(0,6)+"_1@JJQ89 j where flag = '1000000000' and j.shangchedate="+time.replace("-","")
				+ " group by vhic,shangchedate) j on t.vehicle_no ='浙'||j.vhic"
				+ " where 1=1 ";
		sql +=tj2;
		sql += " and rownum <= "+(page*pageSize)+") tt where tt.rn > "+((page-1)*pageSize);
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		int count = 0;
		DecimalFormat decimalFormat=new DecimalFormat(".00");
		if( list!=null && list.size() >0){
			count = Integer.parseInt(String.valueOf(list.get(0).get("COUNT")));
			for(int i=0;i<list.size();i++){
				list.get(i).put("RATIO", list.get(i).get("RATIO")==null?"":(String.valueOf(list.get(i).get("RATIO")).indexOf(".")==0?"0"+String.valueOf(list.get(i).get("RATIO"))+"%":String.valueOf(list.get(i).get("RATIO"))+"%"));
				list.get(i).put("DHSJ", String.valueOf(list.get(i).get("DHSJ")).equals("null")?"":decimalFormat.format(Float.valueOf(list.get(i).get("DHSJ").toString())/60));
				list.get(i).put("KONG", "");
			}
		}
		Map  map = new HashMap ();
		map.put("datas",list);
		map.put("count", count);
        return jacksonUtil.toJson(map);
	}
    
    
}
