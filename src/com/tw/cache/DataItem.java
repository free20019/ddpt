package com.tw.cache;

import java.util.ArrayList;
import java.util.List;

import com.tw.entity.Area;
import com.tw.entity.Numb;
import com.tw.entity.Vehicle;

public class DataItem{
	private Numb num = new Numb();
	private List<Vehicle> vehilist = new ArrayList<Vehicle>();
	private String gzlist = "";
	private String yjcvehino="";
	private List<Vehicle> lxvehilist = new ArrayList<Vehicle>();
	private List<Vehicle> zxvehilist = new ArrayList<Vehicle>();
	private List<Area> arealist = new ArrayList<Area>();
	private List<Vehicle> l2 = new ArrayList<Vehicle>();
	private List<Vehicle> l3 = new ArrayList<Vehicle>();
	private List<Vehicle> l4 = new ArrayList<Vehicle>();
	private List<Vehicle> l5 = new ArrayList<Vehicle>();
	private List<Vehicle> l6 = new ArrayList<Vehicle>();
	private List<Vehicle> l7 = new ArrayList<Vehicle>();
	public Numb getNum() {
		return num;
	}
	public void setNum(Numb num) {
		this.num = num;
	}
	public List<Vehicle> getVehilist() {
		return vehilist;
	}
	public void setVehilist(List<Vehicle> vehilist) {
		this.vehilist = vehilist;
	}
	public List<Area> getArealist() {
		return arealist;
	}
	public void setArealist(List<Area> arealist) {
		this.arealist = arealist;
	}
	public List<Vehicle> getL2() {
		return l2;
	}
	public void setL2(List<Vehicle> l2) {
		this.l2 = l2;
	}
	public List<Vehicle> getL3() {
		return l3;
	}
	public void setL3(List<Vehicle> l3) {
		this.l3 = l3;
	}
	public List<Vehicle> getL4() {
		return l4;
	}
	public void setL4(List<Vehicle> l4) {
		this.l4 = l4;
	}
	public List<Vehicle> getL5() {
		return l5;
	}
	public void setL5(List<Vehicle> l5) {
		this.l5 = l5;
	}
	public List<Vehicle> getL6() {
		return l6;
	}
	public void setL6(List<Vehicle> l6) {
		this.l6 = l6;
	}
	public List<Vehicle> getL7() {
		return l7;
	}
	public void setL7(List<Vehicle> l7) {
		this.l7 = l7;
	}
	public List<Vehicle> getLxvehilist() {
		return lxvehilist;
	}
	public void setLxvehilist(List<Vehicle> lxvehilist) {
		this.lxvehilist = lxvehilist;
	}
	public List<Vehicle> getZxvehilist() {
		return zxvehilist;
	}
	public void setZxvehilist(List<Vehicle> zxvehilist) {
		this.zxvehilist = zxvehilist;
	}
	public String getGzlist() {
		return gzlist;
	}
	public void setGzlist(String gzlist) {
		this.gzlist = gzlist;
	}
    public String getYjcvehino()
    {
        return yjcvehino;
    }
    public void setYjcvehino(String yjcvehino)
    {
        this.yjcvehino = yjcvehino;
    }
	
	
}