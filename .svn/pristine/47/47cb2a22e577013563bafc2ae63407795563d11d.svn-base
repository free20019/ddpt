package helper;

import java.text.DecimalFormat;

public class MapUtils {
	private static double EARTH_RADIUS = 6378.137;
	private static DecimalFormat df = new DecimalFormat("#.00");
	private static double rad(double d) {
		return d * Math.PI / 180.0;
	}

	/**
	 * 通过经纬度获取距离(单位：米)
	 *
	 * @param lat1
	 * @param lng1
	 * @param lat2
	 * @param lng2
	 * @return 距离
	 */
	public static double getDistance( double lng1, double lat1,
	                                 double lng2,double lat2) {
		double radLat1 = rad(lat1);
		double radLat2 = rad(lat2);
		double a = radLat1 - radLat2;
		double b = rad(lng1) - rad(lng2);
		double s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
				+ Math.cos(radLat1) * Math.cos(radLat2)
				* Math.pow(Math.sin(b / 2), 2)));
		s = s * EARTH_RADIUS;
		s = Math.round(s * 10000d) / 10000d;
		return s;
	}

	public static void main(String[] args) {
		double distance = getDistance(120.15521,30.269964,120.181388 ,
				30.264626 );
		System.out.println("距离" + df.format(distance / 1000) + "公里");
	}

}
