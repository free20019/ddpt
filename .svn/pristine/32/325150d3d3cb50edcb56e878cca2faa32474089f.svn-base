package helper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class test1
{

    public static void main(String[] args)
    {
        kyset("2018-08-01 12:12:12","2018-08-01 12:12:12");
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
}
