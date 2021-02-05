package helper;

import org.codehaus.jackson.type.TypeReference;

import java.lang.reflect.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class test1
{

    public static void main(String[] args)
    {
//        JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();
//        String url="http://192.168.0.140:14008/carDispatch/dispatchResult?order_nr=202009071005285&diaodu_status=1&vechicle_plate=2222";
//			System.out.println("孝心指派车辆url="+url);
//			String resultStr = helper.InterfaceUtil.FilialInterface(url);
//			System.out.println("孝心指派车辆返回值="+resultStr);
//			Map<String,Object> resultMap = jacksonUtil.toObject(resultStr,new TypeReference<Map<String,Object>>() {});
//			String state = String.valueOf(resultMap.get("state"));
//			String msg = String.valueOf(resultMap.get("msg"));
//        System.out.println(state+"          "+msg);
        int[] a = {12,3,4,21,17,53,68,44,102,0};
        int[] insertSort_a = insertSort(a);
        System.out.println(Arrays.toString(insertSort_a));


    }
    
    private static List<String> kyset(String stime,String etime){
        ArrayList<String> result = new ArrayList<String>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");//格式化为年月
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyMM");//格式化为年月
        try{
            Calendar min = Calendar.getInstance();
            Calendar max = Calendar.getInstance();
            min.setTime(sdf.parse(stime));
            min.set(min.get(Calendar.YEAR), min.get(Calendar.MONTH), 1);
        
            max.setTime(sdf.parse(etime));
            max.set(max.get(Calendar.YEAR), max.get(Calendar.MONTH), 2);
        
            Calendar curr = min;
            while (curr.before(max)) {
                result.add(sdf2.format(curr.getTime()));
                System.out.println(sdf2.format(curr.getTime()));
                curr.add(Calendar.MONTH, 1);
            }
        }catch(ParseException e){
            e.printStackTrace();
        }
        return result;
    }


    public static int[] insertSort(int[] arr){
        int temp;
        for(int i=1;i<arr.length;i++) { //把第一个数看成是有序的 ，所以从第二个数开始循环。
            for(int j = i-1;j>=0;j--) {  //内层循环 是从外层 循序的 前一个数开始 比
                if(arr[j]>arr[j+1]) {
                    temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
//                    arr[j] = arr[j]+arr[j+1];
//                    arr[j+1] = arr[j]- arr[j+1];
//                    arr[j] = arr[j] - arr[j+1];
                }else break;  //把 第 前 j+1个数个数 看成 是有序的 ，所以当  arr[j]<=arr[j+1]  时 直接头跳出 ，此时 前 j+2个数以满足有序
            }
        }
        return arr;
    }


//    public static int[] selectSort(int[] arr){
//        int[] arrtemp;
//        int temp;
//        for (int i = 0; i < arr.length; i++) {
//            temp=arr[i];
//
//        }
//
//    }


}
