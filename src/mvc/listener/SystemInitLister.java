package mvc.listener;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import mvc.service.BjjkxServer;

import org.apache.commons.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.google.gson.Gson;
import com.tw.cache.DataItem;
import com.tw.cache.GisData;
import com.tw.entity.Area;
import com.tw.entity.Numb;
import com.tw.entity.Vehicle;
import com.vividsolutions.jts.geom.Geometry;
import com.tw.util.GeometryHandler; 
import com.tw.util.JedisUtil;
import com.tw.util.RedisUtil;

/**
 * 
 * @author qiaoliang.jian
 * @version
 */
public class SystemInitLister implements ServletContextListener {
	private String configPropertiesPath = "";
	 private ApplicationContext app;  
	 private List<Vehicle> vehilist = new ArrayList<Vehicle>();
	 private List<Vehicle> lxvehilist = new ArrayList<Vehicle>();
	 private String gzvehilist = "";
	 private List<Vehicle> zxvehilist = new ArrayList<Vehicle>();
	 private List<Area> arealist = new ArrayList<Area>();
	 private List<String> redislist = new ArrayList<String>();
	 private Numb num = new Numb();
	 private long sleepTime = 30000;
	 private Gson gson = new Gson();
	 private JedisUtil jedisUtil = JedisUtil.getInstance();  
	 @Autowired
	 private BjjkxServer bjjkxServer;  
	public void contextInitialized(ServletContextEvent sce) {
		app = WebApplicationContextUtils.getWebApplicationContext(sce.getServletContext());
		bjjkxServer = app.getBean(BjjkxServer.class);
		Thread thread = new Thread() {
			@Override
			public void run() {
				while (true) {
					int onnum = 0;
					int offnum = 0;
					int hnum = 0;
					int nnum = 0;
					zxvehilist.removeAll(zxvehilist);
					lxvehilist.removeAll(lxvehilist);
					vehilist.removeAll(vehilist);
				    gzvehilist =bjjkxServer.bjgzcar();
				    redislist = jedisUtil.getAll();//RedisUtil.getDW();
//					System.out.println(redislist.size());
					for (int i = 0; i < redislist.size(); i++)
                    {
					    Map<String, Object> map = new HashMap<String, Object>();
					    map = gson.fromJson(redislist.get(i), map.getClass());
					    Vehicle va = new Vehicle();
					    if(map.get("isu")==null||map.get("isu")==""){
					        continue;
					    }
					    va.setMdtno((String)map.get("isu"));
			            va.setDateTime((String)map.get("positionTime"));
			            va.setVehino((String)map.get("vehi_no"));
//			            System.out.println((String)map.get("isu")+"  "+map.get("emptyOrHeavy"));
			            
			            va.setCarStatus((int)Math.ceil((Double)(map.get("emptyOrHeavy")))+"");
			            va.setHeading((int)Math.ceil((Double)(map.get("direction")))+"");
			            va.setGpsStatus((int)Math.ceil((Double)(map.get("isPrecise")))+"");
			            va.setLati((Double)map.get("py"));
			            va.setLongi((Double)map.get("px"));
			            va.setSpeed((Double)map.get("speed")+"");
			            if(va.getDateTime()!=""&&jisuan(va.getDateTime())){
			                va.setOnoffstate("1");
			            }else{
			                va.setOnoffstate("0");
			            }
			            vehilist.add(va);
			            if (va.getLati() == null || "".equals(va.getLati())
                                || "0.0".equals(va.getLati())
                                || "".equals(va.getLongi())
                                || "0.0".equals(va.getLongi())) {
                            offnum++;
                            lxvehilist.add(va);
                        } else {

                            if (va.getOnoffstate().equals("1")) {
                                onnum++;
                                if (va.getCarStatus().equals("0")) {
                                    nnum++;
                                    zxvehilist.add(va);
                                } else {
                                    hnum++;
                                }
                            } else {
                                offnum++;
                                lxvehilist.add(va);
                            }
                        }
                    }
					int total = vehilist.size();
					num.setTotal(total + "");
					num.setOnnum(onnum + "");
					num.setOffnum(offnum + "");
					num.setHnum(hnum + "");
					num.setNnum(nnum + "");
					arealist = bjjkxServer.bjqy();
					for(int j=0;j<vehilist.size();j++){
						for(int k=0;k<arealist.size();k++){
							if(rectContains(vehilist.get(j), arealist.get(k))){
								arealist.get(k).getAll().add(vehilist.get(j).getVehino());
								break;
							}
						}
					}
//					GisData.map.clear();
					DataItem data = (DataItem) GisData.map.get("data");
                    if (null == data) {
                        data = new DataItem();
                        GisData.map.put("data", data);
                    }
//                    System.out.println(data.getZxvehilist().size()+" 缓存数据0000");
                    data.setVehilist(vehilist);
                    data.setGzlist(gzvehilist);
					data.setArealist(arealist);
					data.setZxvehilist(zxvehilist);
					System.out.println("总车辆2："+vehilist.size());
					System.out.println("在线车辆："+zxvehilist.size());
					data.setLxvehilist(lxvehilist);
					data.setNum(num);
					try {
						Thread.sleep(sleepTime );
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				
			}

			public void deletePoint2(List<Vehicle> list, double distanceCz) {
				for (int i = 0; i < list.size(); i++) {
					Vehicle p1 = list.get(i);
					for (int j = i + 1; j < list.size(); j++) {
						if (p1.isDeleteFlag()) {
							continue;
						}
						Vehicle p2 = list.get(j);
						if (p2.isDeleteFlag()) {
							continue;
						}
						double distance = getDistance(p1, p2);
						// System.out.print(distance+",#");

						if (distance < distanceCz) {
							// if(distanceCz == 0.07){
							// System.out.println("##"+i+",p1:"+p1.getLongi()+","
							// + p1.getLati()+"\tp2:"+p2.getLongi()+"," +
							// p2.getLati() + "\t"+distance);
							// }
							if (p1.getX2() == 0) {
								p1.setX2(p1.getLongi());
							}
							if (p1.getY2() == 0) {
								p1.setY2(p1.getLati());
							}
							p2.setDeleteFlag(true);
							p1.setCluster(p1.getCluster() + 1);
							p1.setX2(p1.getX2() + p2.getLongi());
							p1.setY2(p1.getY2() + p2.getLati());
//							p1.getXys().append(
//									p2.getLongi() + "," + p2.getLati() + ";");
						}
					}
				}
			}

		 	private  void  deleteItem(List<Vehicle> list) {
		 		for(Iterator<Vehicle> iterator = list.iterator();iterator.hasNext();){
		 			Vehicle item = iterator.next();
		 			if (item.isDeleteFlag()) {
						iterator.remove();
					} else {
						if (item.getCluster() > 50) {
							item.setLati(item.getY2() / item.getCluster());
							item.setLongi(item.getX2() / item.getCluster());
							// System.out.println(item.getLongi()+","+item.getLati()+","+item.getCluster());
							// if(item.getCluster()==476){
							// System.out.println(item.getXys());
							// }
						}
					}
		 		}
			}
		 	public boolean jisuan(String date1){ 
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
		 	
		 	public String dateformatter(String date){ 
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyyMMddHHmmss"); 
                String resultdata="";
                try{
                    Date a = sdf1.parse(date);
                    resultdata =sdf.format(a);
                }catch(ParseException e){
                }
                return resultdata;
            }
			public double getDistance(Vehicle p1, Vehicle p2) {
				double dx = p2.getLongi() - p1.getLongi();
				double dy = p2.getLati() - p1.getLati();

				double distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
				return distance;
				// System.out.println(distance);
			}

			public <T> List<T> deepCopy(List<T> src) throws IOException,
					ClassNotFoundException {
				ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
				ObjectOutputStream out = new ObjectOutputStream(byteOut);
				out.writeObject(src);

				ByteArrayInputStream byteIn = new ByteArrayInputStream(
						byteOut.toByteArray());
				ObjectInputStream in = new ObjectInputStream(byteIn);
				@SuppressWarnings("unchecked")
				List<T> dest = (List<T>) in.readObject();
				return dest;
			}
		};

		try {
			thread.start();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 车辆是否在区域内
	 * @param vehicle
	 * @param area
	 * @return
	 */
	private boolean rectContains(Vehicle vehicle, Area area) {
		
		String[] zbs = area.getAreazbs().split(";");//120.123,30.123;123.123,33.211;
		Geometry geometry=GeometryHandler.getGeometryObject(area.getAreazbs()+";"+zbs[0]);
		String xy = vehicle.getLongi() +"," + vehicle.getLati();
		if(vehicle.getLongi()==null||vehicle.getLati()==null){
		    return false;
		}
		Geometry g2=GeometryHandler.getGeometryObject(xy);
		return geometry.contains(g2);
		
//		for(int i=0;i<zbs.length;i++){
//			xs[i] = Integer.parseInt(zbs[i].split(",")[0].replace(".", ""));
//			ys[i] = Integer.parseInt(zbs[i].split(",")[1].replace(".", ""));
//		}
//		
//		Polygon polygon =new Polygon(xs,ys,xs.length);
//		
//		String dx = vehicle.getLongi()+"";
//		String dy = vehicle.getLati()+"";

//		return polygon.contains(Integer.parseInt(dx.replace(".", "")), Integer.parseInt(dy.replace(".", "")));
		
		
		//网上方法
		/*Builder b = new Builder();
		String[] zbs = area.getAreazbs().split(";");
		for(int i=0;i<zbs.length;i++){
			float px = Float.parseFloat(zbs[i].split(",")[0]);
			float py = Float.parseFloat(zbs[i].split(",")[1]);
			b.addVertex(new Point(px, py));
		}
		Polygon polygon = b.build();
		boolean contains = polygon.contains(new Point((float)dx, (float)dy));
		return contains;*/
	}

	public void contextDestroyed(ServletContextEvent sce) {
		System.out.println("#####system destroye#####");
	}
}

class PointCompare2 implements Comparator<Vehicle> {
	public int compare(final Vehicle a, final Vehicle b) {
		if (a.getLongi() < b.getLongi()) {
			return -1;
		} else if (a.getLongi() > b.getLongi()) {
			return 1;
		} else if (a.getLati() < b.getLati()) {
			return -1;
		} else if (a.getLati() > b.getLati()) {
			return 1;
		} else {
			return 0;
		}
	}
}
