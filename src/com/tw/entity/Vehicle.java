package com.tw.entity;

import java.io.Serializable;

public class Vehicle implements Serializable{
/**
	 * 
	 */
	private static final long serialVersionUID = 2004839254624437232L;
/**
	 * 
	 */
/**
 * 车辆表
 */
	private String vehino;//车号
	private Double longi;//经度
	private Double lati;//纬度
	private String state;//车辆状态
	private String simka;//sim卡号
	private String cartype;//车辆空重车状态
	private String compname;//分公司名
	private String ownname;//司机姓名
	private String owntel;//司机电话
	private String color;//颜色
	private String vehisim;
	private String address;//地址
	private String mdtno;//mdtno
	private String onoffstate;//下线状态
	
	private String gpsStatus;//gps状态
	private String carStatus;//车辆状态
	private String speed;//速度
	private String dateTime;//时间
	private String heading;
	private String mdt_no;
	private String compphone;
	private String px;
	private String py;
	
	private String mtname;
	private String qk;
	private String dispnum;
	private String complnum;
	private String jfzs;
	private String isxh;
	
	public String getVehino() {
		return vehino;
	}
	public void setVehino(String vehino) {
		this.vehino = vehino;
	}
	public Double getLongi() {
		return longi;
	}
	public void setLongi(Double longi) {
		this.longi = longi;
	}
	public Double getLati() {
		return lati;
	}
	public void setLati(Double lati) {
		this.lati = lati;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getSimka() {
		return simka;
	}
	public void setSimka(String simka) {
		this.simka = simka;
	}
	public String getCartype() {
		return cartype;
	}
	public void setCartype(String cartype) {
		this.cartype = cartype;
	}
	public String getCompname() {
		return compname;
	}
	public void setCompname(String compname) {
		this.compname = compname;
	}
	public String getOwnname() {
		return ownname;
	}
	public void setOwnname(String ownname) {
		this.ownname = ownname;
	}
	public String getOwntel() {
		return owntel;
	}
	public void setOwntel(String owntel) {
		this.owntel = owntel;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getGpsStatus() {
		return gpsStatus;
	}
	public void setGpsStatus(String gpsStatus) {
		this.gpsStatus = gpsStatus;
	}
	public String getCarStatus() {
		return carStatus;
	}
	public void setCarStatus(String carStatus) {
		this.carStatus = carStatus;
	}
	public String getSpeed() {
		return speed;
	}
	public void setSpeed(String speed) {
		this.speed = speed;
	}
	public String getDateTime() {
		return dateTime;
	}
	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}
	public String getHeading() {
		return heading;
	}
	public void setHeading(String heading) {
		this.heading = heading;
	}
	public String getMdt_no() {
		return mdt_no;
	}
	public void setMdt_no(String mdtNo) {
		mdt_no = mdtNo;
	}
	public String getVehisim() {
		return vehisim;
	}
	public void setVehisim(String vehisim) {
		this.vehisim = vehisim;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getMdtno() {
		return mdtno;
	}
	public void setMdtno(String mdtno) {
		this.mdtno = mdtno;
	}
	public String getOnoffstate() {
		return onoffstate;
	}
	public void setOnoffstate(String onoffstate) {
		this.onoffstate = onoffstate;
	}
	public String getCompphone() {
		return compphone;
	}
	public void setCompphone(String compphone) {
		this.compphone = compphone;
	}
	
	public String getIsxh()
    {
        return isxh;
    }
    public void setIsxh(String isxh)
    {
        if(this.vehino.indexOf("A1T")>0||this.vehino.indexOf("A0T")>0){
            this.isxh = "1";
        }else
        this.isxh = "0";
    }

    //add
	private int cluster = 1;
	private double x;
	private double y;
	private boolean deleteFlag = false;
	private double x2,y2;
	private StringBuffer xys = new StringBuffer();
	
	
	public StringBuffer getXys() {
		return xys;
	}
	public void setXys(StringBuffer xys) {
		this.xys = xys;
	}
	public int getCluster() {
		return cluster;
	}

	public void setCluster(int cluster) {
		this.cluster = cluster;
	}
	
	public void addCluster(){
		this.cluster = this.cluster +1;
	}
	public double getX() {
		return x;//this.geometry.getCoordinate();
	}
	public void setX(double x) {
		this.x = x;
	}
	public double getY() {
		return y;
	}
	public void setY(double y) {
		this.y = y;
	}
	
	public boolean isDeleteFlag() {
		return deleteFlag;
	}
	public void setDeleteFlag(boolean deleteFlag) {
		this.deleteFlag = deleteFlag;
	}
	public double getX2() {
		return x2;
	}
	public void setX2(double x2) {
		this.x2 = x2;
	}
	public double getY2() {
		return y2;
	}
	public void setY2(double y2) {
		this.y2 = y2;
	}
	public String getPx() {
		return px;
	}
	public void setPx(String px) {
		this.px = px;
	}
	public String getPy() {
		return py;
	}
	public void setPy(String py) {
		this.py = py;
	}
	public String getMtname() {
		return mtname;
	}
	public void setMtname(String mtname) {
		this.mtname = mtname;
	}
	public String getQk() {
		return qk;
	}
	public void setQk(String qk) {
		this.qk = qk;
	}
	public String getDispnum() {
		return dispnum;
	}
	public void setDispnum(String dispnum) {
		this.dispnum = dispnum;
	}
	public String getComplnum() {
		return complnum;
	}
	public void setComplnum(String complnum) {
		this.complnum = complnum;
	}
	public String getJfzs() {
		return jfzs;
	}
	public void setJfzs(String jfzs) {
		this.jfzs = jfzs;
	}

	
}
