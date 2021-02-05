//package mvc.service;
//import helper.JacksonUtil;
//
//import java.io.IOException;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.concurrent.ConcurrentMap;
//import java.util.concurrent.CopyOnWriteArraySet;
//import java.util.concurrent.TimeUnit;
//
//import javax.jms.JMSException;
//import javax.jms.Message;
//import javax.jms.MessageListener;
//import javax.jms.TextMessage;
//import javax.websocket.OnClose;
//import javax.websocket.OnError;
//import javax.websocket.OnMessage;
//import javax.websocket.OnOpen;
//import javax.websocket.Session;
//import javax.websocket.server.PathParam;
//import javax.websocket.server.ServerEndpoint;
//
//import mqconsumer.XddMQConsumer;
//
//import org.codehaus.jackson.type.TypeReference;
//import org.springframework.beans.factory.annotation.Autowired;
//
//import com.blankcw.activemq.Receiver;
//
//
////import mvc.controllers.SeesionList;
//
// 
////该注解用来指定一个URI，客户端可以通过这个URI来连接到WebSocket。类似Servlet的注解mapping。无需在web.xml中配置。
//@ServerEndpoint("/websocket/{usergh}/{usergn}")
//public class Websocket implements MessageListener{
//    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
//    private static int onlineCount = 0;
//    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。若要实现服务端与单一客户端通信的话，可以使用Map来存放，其中Key可以为用户标识
//    public static CopyOnWriteArraySet<Websocket> webSocketSet = new CopyOnWriteArraySet<Websocket>();
//    //保存连接的MAP容器  
//    //private static final Map<String,Websocket > connections = new HashMap<String,Websocket>();  
//    private static final ConcurrentMap <String,Websocket > connections = new ConcurrentHashMap<String,Websocket>();  
//    //与某个客户端的连接会话，需要通过它来给客户端发送数据
//    private Session session;
//    public String  gn;
//    public String  gh;
//    private JacksonUtil jacksonUtil = JacksonUtil.buildNormalBinder();
//    /**
//     * 连接建立成功调用的方法
//     * @param session  可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
//     */
//    @OnOpen
//    public void onOpen(@PathParam("usergh") String usergh,@PathParam("usergn") String usergn, Session session) {
//        this.session = session;
//        this.gn=usergn;
//        this.gh=usergh;
//        webSocketSet.add(this);     //加入set中
//    	connections.put(usergh, this);
//        addOnlineCount();           //在线数加1
//        if(webSocketSet.size()==1){
////        	Receiver.StartReceive("192.168.0.97","xdd");
//        	XddMQConsumer.runConsumer();
//        }
//        System.out.println("工号:"+usergh+"连接到服务器，当前在线人数为" + getOnlineCount());
//    }
//     
//    /**
//     * 连接关闭调用的方法
//     */
//    @OnClose
//    public void onClose(@PathParam("usergh") String usergh,  @PathParam("usergn") String usergn, Session session){
//        try {
//        	webSocketSet.remove(this);  //从set中删除
//			this.session.close();
//        	connections.remove(usergh);
//        	subOnlineCount();           //在线数减1    
//        } catch (IOException e) {
//			e.printStackTrace();
//		}
//        System.out.println("工号:"+usergh+"退出服务器，当前在线人数为" + getOnlineCount());
//    }
//     
//    /**
//     * 收到客户端消息后调用的方法
//     * @param message 客户端发送过来的消息
//     * @param session 可选的参数
//     */
//	@OnMessage
//    public void onMessage(@PathParam("usergh") String usergh,@PathParam("usergn") String usergn,String message, Session session) {
//    	System.out.println("来自客户端的消息:" + message +";"+usergh+";" +usergn+"###");
//    	//System.out.println(message);
//		//群发消息
//        for(Websocket item: webSocketSet){
//            try {
//                item.sendMessage(message);
//            } catch (IOException e) {
//                e.printStackTrace();
//                continue;
//            }
//        }
//    }
//  
//    /**
//     * 发生错误时调用
//     * @param session
//     * @param error
//     */
//    @OnError
//    public void onError(Session session, Throwable error){
//        //System.out.println("发生错误");
////        error.printStackTrace();
//    }
//     
//    /**
//     * 这个方法与上面几个方法不一样。没有用注解，是根据自己需要添加的方法。
//     * @param message
//     * @throws IOException
//     */
//    public void sendMessage(String message) throws IOException{
//    	this.session.getBasicRemote().sendText(message);
//    }
// 
//    /**
//     * 给连接的用户发送报警信息
//     * @return
//     */
//    public static void sendBJMsg(String message) throws IOException{
//    	for(Websocket item: webSocketSet){
//            try {
//            	System.out.println("###群发报警信息--调度页面（xdd）");
//            	if(item.gn.equals("xdd")){
//            		item.sendMessage(message);
//            	}
//            } catch (IOException e) {
//                e.printStackTrace();
//                continue;
//            }
//        }
//    }
//    
//    public static synchronized int getOnlineCount() {
//        return onlineCount;
//    }
// 
//    public static synchronized void addOnlineCount() {
//        Websocket.onlineCount++;
//    }
//     
//    public static synchronized void subOnlineCount() {
//        Websocket.onlineCount--;
//    }
//
//    //消息队列监听
//	@Override
//	public void onMessage(Message message) {
//		try {
//			TimeUnit.MILLISECONDS.sleep(1000);
//			Map<String,Object> paramMap = jacksonUtil.toObject(((TextMessage)message).getText(),new TypeReference<Map<String,Object>>() {});
//			String qq_id = String.valueOf(paramMap.get("qq_id"));
//			System.out.println(paramMap);
//			if(qq_id!=null&&!qq_id.equals("null")){
//				String ddgh = qq_id.split("-")[0];
//				for(Websocket item: webSocketSet){
//	                try {
////	                	System.out.println("###群发报警信息--调度页面（xdd）");
//	                	if(item.gh.equals(ddgh)){
//							item.sendMessage("车辆调度信息更新：工号"+item.gh);
//						}
//	                } catch (IOException e) {
//	                    e.printStackTrace();
//	                    continue;
//	                }
//	            }
//			}
////        	for(Websocket item: webSocketSet){
////                try {
//////                	System.out.println("###群发报警信息--调度页面（xdd）");
////                	if(item.gn.equals("xdd")){
////                		item.sendMessage(((TextMessage)message).getText());
////                	}
////                } catch (IOException e) {
////                    e.printStackTrace();
////                    continue;
////                }
////            }
//        } catch (JMSException e) {
//            e.printStackTrace();
//        }catch (InterruptedException e1) {
//			e1.printStackTrace();
//		}
//	}
//}