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

import javax.servlet.http.HttpServletRequest;

import helper.JacksonUtil;

import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


@Service
public class LoginServer {
	protected JdbcTemplate jdbcTemplate = null;
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	@Autowired
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();

	public String login(HttpServletRequest request,String username,String password,String fjh) {
		
		String sql = "select t1.user_name,t1.user_pwd,t2.rg_name,t1.real_name,t3.qx,t1.user_id from tb_user t1,(select distinct(t.rg_id),t.rg_name from tb_priv_role t) t2,TB_ROLE t3 where t1.rg_id=t2.rg_id and t2.rg_id=t3.js and t1.user_name=? and t1.user_pwd=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, new Object[] {username,password});
//		System.out.println(jacksonUtil.toJson(list));
		if(list.size()==0){
			return "1";
		}else{
			request.getSession().setAttribute("username", list.get(0).get("USER_NAME")==null?"":list.get(0).get("USER_NAME").toString());
//			request.getSession().setAttribute("password", list.get(0).get("USER_PWD").toString());
			request.getSession().setAttribute("userfjh", fjh);
			request.getSession().setAttribute("userrole", list.get(0).get("RG_NAME")==null?"":list.get(0).get("RG_NAME").toString());
			request.getSession().setAttribute("role", list.get(0).get("QX")==null?"":list.get(0).get("QX").toString());
			request.getSession().setAttribute("realname", list.get(0).get("REAL_NAME")==null?"":list.get(0).get("REAL_NAME").toString());
			request.getSession().setAttribute("userid", list.get(0).get("user_id")==null?"":list.get(0).get("user_id").toString());
			request.getSession().setMaxInactiveInterval(-1);
			return "0";
		}
		
	}
}
