package com.tw.util;

import helper.Client;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Observable;

import mvc.service.BjjkxServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.google.gson.Gson;
import com.tw.cache.DataItem;
import com.tw.cache.GisData;
import com.tw.entity.Area;
import com.tw.entity.Numb;
import com.tw.entity.Vehicle;
import com.vividsolutions.jts.geom.Geometry;

public class PushServie extends Observable implements Runnable {
//    private ApplicationContext app;  
    private List<Vehicle> vehilist = new ArrayList<Vehicle>();
    private List<Vehicle> lxvehilist = new ArrayList<Vehicle>();
    private String gzvehilist = "";
    private String yjcvehino = "";
    private List<Vehicle> zxvehilist = new ArrayList<Vehicle>();
    private List<Area> arealist = new ArrayList<Area>();
    private List<String> redislist = new ArrayList<String>();
    private Numb num = new Numb();
    private long sleepTime = 30000;
    private Gson gson = new Gson();
//    private ServletContextEvent sce;
    private JedisUtil jedisUtil = JedisUtil.getInstance();  
    @Autowired
    private BjjkxServer bjjkxServer; 
    
    
    // 此方法一经调用，立马可以通知观察者，在本例中是监听线程
    public void doBusiness() {
        if (true) {
            super.setChanged();
        }
        notifyObservers();
    }

    @Override
    public void run() {
        while (true) {
            try {
            WebApplicationContext wac =   ContextLoader.getCurrentWebApplicationContext();
            bjjkxServer =  wac.getBean(BjjkxServer.class);
            if(jedisUtil==null){
                jedisUtil = JedisUtil.getInstance();  
            }
            int onnum = 0;
            int offnum = 0;
            int hnum = 0;
            int nnum = 0;
            zxvehilist.removeAll(zxvehilist);
            lxvehilist.removeAll(lxvehilist);
            vehilist.removeAll(vehilist);
            yjcvehino=bjjkxServer.yjcbjcar();;
            gzvehilist =bjjkxServer.bjgzcar();
            redislist = jedisUtil.getAll();//RedisUtil.getDW();
//          System.out.println(redislist.size());
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
                va.setIsxh("");
//              System.out.println((String)map.get("isu")+"  "+map.get("emptyOrHeavy"));
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
//          GisData.map.clear();
            DataItem data = (DataItem) GisData.map.get("data");
            if (null == data) {
                data = new DataItem();
                GisData.map.put("data", data);
            }
            data.setVehilist(vehilist);
            data.setGzlist(gzvehilist);
            data.setYjcvehino(yjcvehino);
            data.setArealist(arealist);
            data.setZxvehilist(zxvehilist);
            System.out.println(new Date()+"~~~总车辆："+vehilist.size()+"~~~在线空车辆："+zxvehilist.size());
            data.setLxvehilist(lxvehilist);
            data.setNum(num);
            Thread.sleep(sleepTime );
            } catch (Exception e) {
//                e.printStackTrace();
                System.out.println("线程异常挂了，异常："+e.getClass().getName());
                sendBJ(e.getClass().getName());
                doBusiness();
                break;
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
        if(result<=5){ 
            return true; 
        }else{ 
            return false; 
        } 
    }
    private boolean rectContains(Vehicle vehicle, Area area) {
        String[] zbs = area.getAreazbs().split(";");//120.123,30.123;123.123,33.211;
        Geometry geometry=GeometryHandler.getGeometryObject(area.getAreazbs()+";"+zbs[0]);
        String xy = vehicle.getLongi() +"," + vehicle.getLati();
        if(vehicle.getLongi()==null||vehicle.getLati()==null){
            return false;
        }
        Geometry g2=GeometryHandler.getGeometryObject(xy);
        return geometry.contains(g2);
    }

    private void sendBJ(String string){
        String dhhm = "13738193919";
        String nr = "出租车调度后台缓存挂了。异常："+string;
        Client client = new Client();
        client.start(dhhm, nr);
    }
    
    public static void main(String[] args)
    {
        PushServie ps = new PushServie();
        Listener listener = new Listener();
        ps.addObserver(listener);
        new Thread(ps).start();
    }
}