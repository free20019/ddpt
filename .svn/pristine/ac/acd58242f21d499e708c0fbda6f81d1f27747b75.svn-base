package mvc.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import helper.Client;
import helper.JacksonUtil;


//import org.apache.activemq.ActiveMQConnection;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import sun.util.logging.resources.logging;
import cn.com.activeMQ.Sender;

@Service
public class XxfsServer
{
    protected JdbcTemplate jdbcTemplate = null;

    public JdbcTemplate getJdbcTemplate()
    {
        return jdbcTemplate;
    }

    // private String USER = ActiveMQConnection.DEFAULT_USER;
    // private String PASSWORD = ActiveMQConnection.DEFAULT_PASSWORD;
    // private String URL = "tcp://192.168.0.97:61616";
    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate)
    {
        this.jdbcTemplate = jdbcTemplate;
    }

    private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

    /**
     * 查找车辆
     * 
     * @return
     */
    public String findcl(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String VEHI_NO = String.valueOf(paramMap.get("vehi_no"));
        String tj = "";
        if (VEHI_NO != null && !VEHI_NO.isEmpty() && !VEHI_NO.equals("null") && VEHI_NO.length() > 0)
        {
            tj += " and VEHI_NO like '%" + VEHI_NO + "%'";
        }
        String sql = "select VEHI_NO from tb_vehicle where 1=1" + tj;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return jacksonUtil.toJson(list);
    }

    /**
     * 查找集团
     * 
     * @return
     */
    public String findjt(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String OWNER_NAME = String.valueOf(paramMap.get("owner_name"));
        String tj = "";
        if (OWNER_NAME != null && !OWNER_NAME.isEmpty() && !OWNER_NAME.equals("null") && OWNER_NAME.length() > 0)
        {
            tj += " and OWNER_NAME like '%" + OWNER_NAME + "%'";
        }
        String sql = "select OWNER_NAME from tb_owner where 1=1" + tj;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return jacksonUtil.toJson(list);
    }

    /**
     * 查找公司
     * 
     * @return
     */
    public String findgs(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String COMP_NAME = String.valueOf(paramMap.get("comp_name"));
        String tj = "";
        if (COMP_NAME != null && !COMP_NAME.isEmpty() && !COMP_NAME.equals("null") && COMP_NAME.length() > 0)
        {
            tj += " and COMP_NAME like '%" + COMP_NAME + "%'";
        }
        String sql = "select COMP_NAME from tb_company where 1=1" + tj;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return jacksonUtil.toJson(list);
    }

    /**
     * 查询消息
     * 
     * @return
     */
    public String findmsg()
    {
        String tj = "";
        String sql = "select * from tb_msg_sj ";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return jacksonUtil.toJson(list);
    }

    /**
     * 消息内容删除
     * 
     * @return
     */
    public String msgdel(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String id = String.valueOf(paramMap.get("id"));
        String sql = "delete tb_msg_sj where id=?";
        int result = jdbcTemplate.update(sql, id);
        Map map = new HashMap();
        if (result > 0)
        {
            map.put("msg", "删除成功");
        }
        else
        {
            map.put("msg", "发生错误");
        }
        return jacksonUtil.toJson(map);
    }

    /**
     * 消息内容添加
     * 
     * @return
     */
    public String msgadd(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String nr = String.valueOf(paramMap.get("nr"));
        String sql = "insert into tb_msg_sj(CONTENT) values(?)";
        int result = jdbcTemplate.update(sql, nr);
        Map map = new HashMap();
        if (result > 0)
        {
            map.put("msg", "添加成功");
        }
        else
        {
            map.put("msg", "发生错误");
        }
        return jacksonUtil.toJson(map);
    }

    /**
     * 消息内容修改
     * 
     * @return
     */
    public String msgupdate(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String id = String.valueOf(paramMap.get("id"));
        String nr = String.valueOf(paramMap.get("nr"));
        String sql = "update tb_msg_sj set CONTENT=? where id=?";
        int result = jdbcTemplate.update(sql, nr, id);
        Map map = new HashMap();
        if (result > 0)
        {
            map.put("msg", "修改成功");
        }
        else
        {
            map.put("msg", "发生错误");
        }
        return jacksonUtil.toJson(map);
    }

    /**
     * 消息发送
     * 
     * @return
     */
    public String msgsend(String postData)
    {
//        System.out.println(postData);
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        SimpleDateFormat df  = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String tec_time = df.format(new Date());
        String type = String.valueOf(paramMap.get("type"));
        String nr = String.valueOf(paramMap.get("nr"));
        String target = String.valueOf(paramMap.get("target"));
        String sql = "";
        nr = nr.replaceAll("bfh", "%");
        nr = nr.replaceAll("dyh","'");
        nr = nr.replaceAll("syh","\"");
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
//        System.out.println(type);
        if (type.equals("集团"))
        {
            String tj="";
            if(target.equals("出租车")){
                tj = " and t.owner_id='11' and t.VEHI_NO not like '浙A1%' and t.VEHI_NO not like '浙A0%' ";
            }else if(target.equals("余杭出租")){
                tj = " and t.owner_id='87' ";
            }else if(target.equals("萧山出租")){
                tj = " and t.owner_id='88' ";
            }else if(target.equals("临安出租")){
                tj = " and t.owner_id='90' ";
            }else if(target.equals("富阳出租")){
                tj = " and t.owner_id='89' ";
            }else if(target.equals("淳安出租")){
                tj = " and t.owner_id='12' ";
            }else if(target.equals("建德出租")){
                tj = " and t.owner_id='21' ";
            }else if(target.equals("上泗出租")){
                tj = " and t.owner_id='00' ";
            }
            sql = "select mdt_no from vw_vehicle t where 1=1 "+tj;
            list = jdbcTemplate.queryForList(sql);
        }
        else if (type.equals("单车"))
        {
            sql = "select mdt_no from vw_vehicle where vehi_no = ?";
            list = jdbcTemplate.queryForList(sql, target);
        }
        else if (type.equals("公司"))
        {
            sql = "select mdt_no from vw_vehicle where comp_name = ?";
            list = jdbcTemplate.queryForList(sql, target);
        }
        else if (type.equals("全部"))
        {
            sql = "select mdt_no from vw_vehicle where VEHI_NO not like '浙A1%' and VEHI_NO not like '浙A0%' ";
            list = jdbcTemplate.queryForList(sql);
        }
        else if (type.equals("应急车队")){
            sql = "select v.mdt_no from TB_MOTORCADE_CARS t,vw_vehicle v where t.tm_id=61 and t.vehi_no=v.VEHI_NO";
            list = jdbcTemplate.queryForList(sql);
        }
        if (list.size() == 0)
        {
            return "{\"msg\":\"没有终端\"}";
        }
        String idSql  = "select max(oadx_id) as oadx_id from tb_oa_duanxin t where length(oadx_id)=8";
		List<Map<String, Object>> resultList = jdbcTemplate.queryForList(idSql);
		int id = Integer.valueOf(String.valueOf(resultList.get(0).get("oadx_id")));
		id = id+100;
		StringBuffer  insertSql = new StringBuffer();
		insertSql.append(" insert into TB_OA_DUANXIN(oadx_id,sim_no,rec_time,content,status) ");
        Map<String, Object> map1 = new HashMap<String, Object>();
        map1.put("cmd", "0x8300");
        map1.put("flag", "0");
        map1.put("content", nr);
        StringBuffer mdt_no = new StringBuffer();
		for (int i = 0;i < list.size(); i++)
		{
			mdt_no.append(list.get(i).get("mdt_no"));
			mdt_no.append(",");
			int a=(i+1) % 100;
			insertSql.append(" select '"+id++ +"','"+list.get(i).get("mdt_no")+"',to_date('"+tec_time+"','yyyy-MM-dd HH24:mi:ss'),'"+nr+"','短信下发' from dual union ");
			if(a==0){
				mdt_no =mdt_no.deleteCharAt(mdt_no.length()-1);
				map1.put("isu", mdt_no);
				String josn1 = jacksonUtil.toJson(map1);
				Sender.StartSend("192.168.0.102", "hz_taxi_905_gj", josn1);
				mdt_no.delete(0,mdt_no.length()); 
				String sql1 = insertSql.toString();
				sql1 = sql1.substring(0,sql1.length()-7);
				jdbcTemplate.update(sql1);
				insertSql = new StringBuffer();
				insertSql.append(" insert into TB_OA_DUANXIN(oadx_id,sim_no,rec_time,content,status) ");
			}
		}
		if (mdt_no.length() > 0)
		{
			mdt_no =mdt_no.deleteCharAt(mdt_no.length()-1);
			map1.put("isu", mdt_no);
			String josn1 = jacksonUtil.toJson(map1);
			Sender.StartSend("192.168.0.102", "hz_taxi_905_gj", josn1);
			String sql1 = insertSql.toString();
			sql1 = sql1.substring(0,sql1.length()-7);
			jdbcTemplate.update(sql1);
			insertSql = new StringBuffer();
			insertSql.append(" insert into TB_OA_DUANXIN(oadx_id,sim_no,rec_time,content,status) ");
		}
        return "{\"msg\":\"发送成功\"}";
        
    }

    public String dxmsgsend(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String dhhm = String.valueOf(paramMap.get("dhhm"));
        String nr = String.valueOf(paramMap.get("nr"));
        dhhm = dhhm.replaceAll("\\(.*?\\)|\\{.*?}|\\[.*?]|（.*?）", ",");
        nr = nr.replaceAll("~", "%").replaceAll("\\*", "\r\n");
        // String dhs[] = dhhm.split(",");
        Client client = new Client();
        String a = client.start(dhhm, nr);
        return a;
    }

    public String findqz(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String keyword = String.valueOf(paramMap.get("keyword"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page") == null ? "1" : paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize") == null ? "999999" : paramMap.get("pageSize")));
        int sr = (page - 1) * pageSize + 1;
        int er = page * pageSize;
        String tj = "";
        if (!keyword.equals(""))
        {
            tj += " and t.teamname like '%" + keyword + "%'";
        }
        Map<String, Object> result = new HashMap<String, Object>();
        String sql = "select * from (select t.*,rownum r from tb_msg_qz t where 1=1 " + tj + ")ttt where ttt.r<=" + er + " and ttt.r>=" + sr;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);

        for (int i = 0; i < list.size(); i++)
        {
            Map<String, Object> m = list.get(i);
            String mrids = m.get("MRIDS").toString();
            String sqlmr = "select * from tb_msg_ry where id in (" + mrids + ")";
            List<Map<String, Object>> listmr = jdbcTemplate.queryForList(sqlmr);
            String yhs = "";
            List<String> yhids = new ArrayList<String>();
            for (int j = 0; j < listmr.size(); j++)
            {
                yhs += listmr.get(j).get("TELEPHONE") + "(" + listmr.get(j).get("TELNAME") + "),";
                yhids.add(listmr.get(j).get("ID").toString());
            }
            m.put("YHS", yhs.substring(0, yhs.length() - 1));
            m.put("YHIDS", yhids);
        }
        String sql1 = "select count(*) c from tb_msg_qz t where 1=1 " + tj;
        List<Map<String, Object>> list1 = jdbcTemplate.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    public String findqzname()
    {
        String sql = "select t.* from tb_msg_qz t ";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        for (int i = 0; i < list.size(); i++)
        {
            Map<String, Object> m = list.get(i);
            String mrids = m.get("MRIDS").toString();
            String sqlmr = "select * from tb_msg_ry where id in (" + mrids + ")";
            List<Map<String, Object>> listmr = jdbcTemplate.queryForList(sqlmr);
            String yhs = "";
            List<String> yhids = new ArrayList<String>();
            for (int j = 0; j < listmr.size(); j++)
            {
                yhs += listmr.get(j).get("TELEPHONE") + "(" + listmr.get(j).get("TELNAME") + "),";
                yhids.add(listmr.get(j).get("ID").toString());
            }
            if (!yhs.equals(""))
            {
                yhs = yhs.substring(0, yhs.length() - 1);
            }
            m.put("YHS", yhs);
            m.put("YHIDS", yhids);
        }
        return jacksonUtil.toJson(list);
    }

    public String addqz(String postData)
    {

        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String mc = String.valueOf(paramMap.get("mc"));
        String dh = String.valueOf(paramMap.get("dh"));
        String sql = "insert into tb_msg_qz(TEAMNAME,MRIDS) values ('" + mc + "','" + dh.substring(0, dh.length() - 1) + "')";
        int a = jdbcTemplate.update(sql);
        if (a > 0)
        {
            return "{\"msg\":\"添加成功\"}";
        }
        return "{\"msg\":\"添加失败\"}";
    }

    public String updqz(String postData)
    {

        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String mc = String.valueOf(paramMap.get("mc"));
        String dh = String.valueOf(paramMap.get("dh"));
        String id = String.valueOf(paramMap.get("id"));
        String sql = "update tb_msg_qz set TEAMNAME='" + mc + "',MRIDS='" + dh.substring(0, dh.length() - 1) + "' where id='" + id + "'";
        int a = jdbcTemplate.update(sql);
        if (a > 0)
        {
            return "{\"msg\":\"修改成功\"}";
        }
        return "{\"msg\":\"修改失败\"}";
    }

    public String delqz(String postData)
    {

        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String id = String.valueOf(paramMap.get("id"));
        String sql = "delete tb_msg_qz where id in (" + id.substring(0, id.length() - 1) + ")";
        int a = jdbcTemplate.update(sql);
        if (a > 0)
        {
            return "{\"msg\":\"删除成功\"}";
        }
        return "{\"msg\":\"删除失败\"}";
    }

    public String findry(String postData)
    {
        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String keyword = String.valueOf(paramMap.get("keyword"));
        int page = Integer.valueOf(String.valueOf(paramMap.get("page") == null ? "1" : paramMap.get("page")));
        int pageSize = Integer.valueOf(String.valueOf(paramMap.get("pageSize") == null ? "999999" : paramMap.get("pageSize")));
        int sr = (page - 1) * pageSize + 1;
        int er = page * pageSize;
        String tj = "";
        if (!keyword.equals(""))
        {
            tj += " and (t.telephone like '%" + keyword + "%' or t.telname like '%" + keyword + "%')";
        }
        Map<String, Object> result = new HashMap<String, Object>();
        String sql = "select * from (select t.*,rownum r from tb_msg_ry t where 1=1 " + tj + ")ttt where ttt.r<=" + er + " and ttt.r>=" + sr;
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        String sql1 = "select count(*) c from tb_msg_ry t where 1=1 " + tj;
        List<Map<String, Object>> list1 = jdbcTemplate.queryForList(sql1);
        result.put("data", list);
        result.put("count", list1.get(0).get("C"));
        return jacksonUtil.toJson(result);
    }

    public String findryxx()
    {
        String sql = "select t.* from tb_msg_ry t";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return jacksonUtil.toJson(list);
    }

    public String delry(String postData)
    {

        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String id = String.valueOf(paramMap.get("id"));
        String sql = "delete tb_msg_ry where id in (" + id.substring(0, id.length() - 1) + ")";
        int a = jdbcTemplate.update(sql);
        if (a > 0)
        {
            // String sqlqzupd="update tb_msg_qz set ";
            // jdbcTemplate.update(sqlqzupd);
            return "{\"msg\":\"删除成功\"}";
        }
        return "{\"msg\":\"删除失败\"}";
    }

    public String addry(String postData)
    {

        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String xm = String.valueOf(paramMap.get("xm"));
        String dh = String.valueOf(paramMap.get("dh"));
        String sql = "insert into tb_msg_ry(TELEPHONE,TELNAME) values ('" + dh + "','" + xm + "')";
        int a = jdbcTemplate.update(sql);
        if (a > 0)
        {
            return "{\"msg\":\"添加成功\"}";
        }
        return "{\"msg\":\"添加失败\"}";
    }

    public String updry(String postData)
    {

        Map<String, Object> paramMap = jacksonUtil.toObject(postData, new TypeReference<Map<String, Object>>()
        {
        });
        String xm = String.valueOf(paramMap.get("xm"));
        String dh = String.valueOf(paramMap.get("dh"));
        String id = String.valueOf(paramMap.get("id"));
        String sql = "update tb_msg_ry set TELEPHONE='" + dh + "',TELNAME='" + xm + "' where id='" + id + "'";
        int a = jdbcTemplate.update(sql);
        if (a > 0)
        {
            return "{\"msg\":\"修改成功\"}";
        }
        return "{\"msg\":\"修改失败\"}";
    }
}
