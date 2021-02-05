package helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * Create By donghb on 2020-06-04
 */
public class InterfaceUtil {

    public static String FilialInterface(String httpurl){
        Map<String,Object> result =  new HashMap<String, Object>();
        String resultstr="";
        HttpURLConnection connection = null;
		InputStream is = null;
		BufferedReader br = null;
		try {
//			String httpurl="http://115.236.61.148:10004/carDispatch/cancelOrder?order_nr=11&customer_id=11&payed_amount=111&cancel_reason=11";
//			System.out.println(httpurl);
			URL url = new URL(httpurl);
			connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			connection.setConnectTimeout(15000);
			connection.setReadTimeout(60000);
			connection.connect();
			if (connection.getResponseCode() == 200) {
				is = connection.getInputStream();
				br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				StringBuffer sbf = new StringBuffer();
				String temp = null;
				while ((temp = br.readLine()) != null) {
					sbf.append(temp);
					sbf.append("\r\n");
				}
				resultstr = sbf.toString();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != br) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			if (null != is) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			connection.disconnect();
		}
        return resultstr;
    }
}
