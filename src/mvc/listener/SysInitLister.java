package mvc.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.tw.util.Listener;
import com.tw.util.PushServie;

public class SysInitLister implements ServletContextListener {
    
    @Override
    public void contextDestroyed(ServletContextEvent arg0)
    {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void contextInitialized(ServletContextEvent sce)
    {
        System.out.println("************start***********");
        PushServie ps = new PushServie();
        Listener listener = new Listener();
        ps.addObserver(listener);
        new Thread(ps).start();
    }
    
}


