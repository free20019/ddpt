package helper;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tw.entity.Vehicle;

public class Bean2Map {
	public static Map convertBean2Map(Object bean) throws Exception {  
        Class type = bean.getClass();  
        Map returnMap = new HashMap();  
        BeanInfo beanInfo = Introspector.getBeanInfo(type);  
        PropertyDescriptor[] propertyDescriptors = beanInfo  
                .getPropertyDescriptors();  
        for (int i = 0, n = propertyDescriptors.length; i <n ; i++) {  
            PropertyDescriptor descriptor = propertyDescriptors[i];  
            String propertyName = descriptor.getName();  
            if (!propertyName.equals("class")) {  
                Method readMethod = descriptor.getReadMethod();  
                Object result = readMethod.invoke(bean, new Object[0]);  
                if (result != null) {  
                    returnMap.put(propertyName, result);  
                } else {  
                    returnMap.put(propertyName, "");  
                }  
            }  
        }  
        return returnMap;  
    }  
	 public static List<Map<String,Object>> convertListBean2ListMap(List<Vehicle> list) throws Exception {  
	        List<Map<String,Object>> mapList = new ArrayList<Map<String,Object>>();
	        for(int i=0, n=list.size(); i<n; i++){
	            Object bean = list.get(i);
	            Map map = convertBean2Map(bean);
	            mapList.add(map);
	        }
	        return mapList;  
	    }
}
