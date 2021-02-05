package com.tw.util;

import java.util.ArrayList;
import java.util.List;  
import java.util.Map;  
import java.util.Properties;  
import java.util.Set;  
import redis.clients.jedis.Jedis;  
import redis.clients.jedis.JedisPool;  
import redis.clients.jedis.JedisPoolConfig;
  
/** 
 * redis工具类 
 * @author lc 
 */  
public class JedisUtil {  
    private static JedisPool jedisPool = null;  
  
    private JedisUtil() {  
  
    }  
      
    //写成静态代码块形式，只加载一次，节省资源  
    static {  
        Properties properties = PropertyUtil.loadProperties("redis.properties");  
        String host = properties.getProperty("redis.host");  
        String port = properties.getProperty("redis.port");  
        String pass = properties.getProperty("redis.pass");  
        String timeout = properties.getProperty("redis.timeout");  
        String maxIdle = properties.getProperty("redis.maxIdle");  
        String maxTotal = properties.getProperty("redis.maxTotal");  
        String maxWaitMillis = properties.getProperty("redis.maxWaitMillis");  
        String testOnBorrow = properties.getProperty("redis.testOnBorrow");  
  
        JedisPoolConfig config = new JedisPoolConfig();  
        //控制一个pool可分配多少个jedis实例，通过pool.getResource()来获取；  
        //如果赋值为-1，则表示不限制；如果pool已经分配了maxActive个jedis实例，则此时pool的状态为exhausted(耗尽)。  
        config.setMaxTotal(Integer.parseInt(maxTotal));
        //控制一个pool最多有多少个状态为idle(空闲的)的jedis实例。  
        config.setMaxIdle(Integer.parseInt(maxIdle));  
        //表示当borrow(引入)一个jedis实例时，最大的等待时间，如果超过等待时间，则直接抛出JedisConnectionException；  
        config.setMaxWaitMillis(Long.parseLong(maxWaitMillis));  
        //在borrow一个jedis实例时，是否提前进行validate操作；如果为true，则得到的jedis实例均是可用的；  
        config.setTestOnBorrow(Boolean.valueOf(testOnBorrow));  
  
        jedisPool = new JedisPool(config, host, Integer.parseInt(port));  
    }  
  
    /** 
     * 从jedis连接池中获取获取jedis对象 
     * 
     * @return 
     */  
    private Jedis getJedis() {  
        return jedisPool.getResource();  
    }  
  
    private static final JedisUtil jedisUtil = new JedisUtil();  
  
    /** 
     * 获取JedisUtil实例 
     * 
     * @return 
     */  
    public static JedisUtil getInstance() {  
        return jedisUtil;  
    }  
  
    /** 
     * 回收jedis(放到finally中) 
     * 
     * @param jedis 
     */  
    private void returnJedis(Jedis jedis) {  
        if (null != jedis && null != jedisPool) {  
//            jedisPool.returnResource(jedis);  
            jedis.close();
        }  
    }  
  
    /** 
     * 销毁连接(放到catch中) 
     * 
     * @param jedis 
     */  
    private static void returnBrokenResource(Jedis jedis) {  
        if (null != jedis && null != jedisPool) {  
//            jedisPool.returnResource(jedis);  
            jedis.close();
        }  
    }  
  
    /** 
     * 添加sorted set 
     * 
     * @param key 
     * @param value 
     * @param score 
     */  
    public void zadd(String key, String value, double score) {  
        Jedis jedis = getJedis();  
        jedis.zadd(key, score, value);  
        returnJedis(jedis);  
    }  
  
    /** 
     * 返回指定位置的集合元素,0为第一个元素，-1为最后一个元素 
     * @param key 
     * @param start 
     * @param end 
     * @return 
     */  
    public Set<String> zrange(String key, int start, int end) {  
        Jedis jedis = getJedis();  
        Set<String> set = jedis.zrange(key, start, end);  
        returnJedis(jedis);  
        return set;  
    }  
  
    /** 
     * 获取给定区间的元素，原始按照权重由高到低排序 
     * @param key 
     * @param start 
     * @param end 
     * @return 
     */  
    public Set<String> zrevrange(String key, int start, int end) {  
        Jedis jedis = getJedis();  
        Set<String> set = jedis.zrevrange(key, start, end);  
        returnJedis(jedis);  
        return set;  
    }  
  
    /** 
     * 添加对应关系，如果对应关系已存在，则覆盖 
     * 
     * @param key 
     * @param map 对应关系 
     * @return 状态，成功返回OK 
     */  
    public String hmset(String key, Map<String, String> map) {  
        Jedis jedis = getJedis();  
        String s = jedis.hmset(key, map);  
        returnJedis(jedis);  
        return s;  
    }  
  
    /** 
     * 向List头部追加记录 
     * 
     * @param key 
     * @param value 
     * @return 记录总数 
     */  
    public long rpush(String key, String value) {  
        Jedis jedis = getJedis();  
        long count = jedis.rpush(key, value);  
        returnJedis(jedis);  
        return count;  
    }  
  
    /** 
     * 向List头部追加记录 
     * 
     * @param key 
     * @param value 
     * @return 记录总数 
     */  
    private long rpush(byte[] key, byte[] value) {  
        Jedis jedis = getJedis();  
        long count = jedis.rpush(key, value);  
        returnJedis(jedis);  
        return count;  
    }  
  
    /** 
     * 删除 
     * 
     * @param key 
     * @return 
     */  
    public long del(String key) {  
        Jedis jedis = getJedis();  
        long s = jedis.del(key);  
        returnJedis(jedis);  
        return s;  
    }  
  
    /** 
     * 从集合中删除成员 
     * @param key 
     * @param value 
     * @return 返回1成功 
     * */  
    public long zrem(String key, String... value) {  
        Jedis jedis = getJedis();  
        long s = jedis.zrem(key, value);  
        returnJedis(jedis);  
        return s;  
    }  
      
    public void saveValueByKey(int dbIndex, byte[] key, byte[] value, int expireTime)  
            throws Exception {  
        Jedis jedis = null;  
        boolean isBroken = false;  
        try {  
            jedis = getJedis();  
            jedis.select(dbIndex);  
            jedis.set(key, value);  
            if (expireTime > 0)  
                jedis.expire(key, expireTime);  
        } catch (Exception e) {  
            isBroken = true;  
            throw e;  
        } finally {  
            returnResource(jedis, isBroken);  
        }  
    }  
      
    public String getValueByKey(String key) throws Exception {  
        Jedis jedis = null;  
        String result="";
        boolean isBroken = false;  
        try {  
            jedis = getJedis();  
            result = jedis.get(key);  
        } catch (Exception e) {  
            isBroken = true;  
            throw e;  
        } finally {  
            returnResource(jedis, isBroken);  
        }  
        return result;  
    } 
    
    public byte[] getValueByKey(int dbIndex, byte[] key) throws Exception {  
        Jedis jedis = null;  
        byte[] result = null;  
        boolean isBroken = false;  
        try {  
            jedis = getJedis();  
            jedis.select(dbIndex);  
            result = jedis.get(key);  
        } catch (Exception e) {  
            isBroken = true;  
            throw e;  
        } finally {  
            returnResource(jedis, isBroken);  
        }  
        return result;  
    }  
      
    public void deleteByKey(int dbIndex, byte[] key) throws Exception {  
        Jedis jedis = null;  
        boolean isBroken = false;  
        try {  
            jedis = getJedis();  
            jedis.select(dbIndex);  
            jedis.del(key);  
        } catch (Exception e) {  
            isBroken = true;  
            throw e;  
        } finally {  
            returnResource(jedis, isBroken);  
        }  
    }  
      
    public void returnResource(Jedis jedis, boolean isBroken) {  
        if (jedis == null)  
            return;  
        if (isBroken)  
            jedis.close();
//            jedisPool.returnBrokenResource(jedis);  
        else  
            jedis.close();
//            jedisPool.returnResource(jedis);  
    }  
      
    /** 
     * 获取总数量 
     * @param key 
     * @return 
     */  
    public long zcard(String key) {  
        Jedis jedis = getJedis();  
        long count = jedis.zcard(key);  
        returnJedis(jedis);  
        return count;  
    }  
    
    public List<String> getAll() {  
        Jedis jedis = null;
        List<String> list = new ArrayList<String>();
        boolean isBroken = false;  
        try {  
            jedis = getJedis();  
            Set<String> set = jedis.keys("*");
            list = jedis.mget(set.toArray(new String[set.size()])); 
        } catch (Exception e) {  
            isBroken = true;  
        } finally {  
            returnResource(jedis, isBroken);  
        }  
        return list;  
    } 
  
    /** 
     * 是否存在KEY 
     * @param key 
     * @return 
     */  
    public boolean exists(String key) {  
        Jedis jedis = getJedis();  
        boolean exists = jedis.exists(key);  
        returnJedis(jedis);  
        return exists;  
    }  
  
    /** 
     * 重命名KEY 
     * @param oldKey 
     * @param newKey 
     * @return 
     */  
    public String rename(String oldKey, String newKey) {  
        Jedis jedis = getJedis();  
        String result = jedis.rename(oldKey, newKey);  
        returnJedis(jedis);  
        return result;  
    }  
  
    /** 
     * 设置失效时间 
     * @param key 
     * @param seconds 
     */  
    public void expire(String key, int seconds) {  
        Jedis jedis = getJedis();  
        jedis.expire(key, seconds);  
        returnJedis(jedis);  
    }  
  
    /** 
     * 删除失效时间 
     * @param key 
     */  
    public void persist(String key) {  
        Jedis jedis = getJedis();  
        jedis.persist(key);  
        returnJedis(jedis);  
    }  
      
    /** 
     * 添加一个键值对，如果键存在不在添加，如果不存在，添加完成以后设置键的有效期 
     * @param key 
     * @param value 
     * @param timeOut 
     */  
    public void setnxWithTimeOut(String key,String value,int timeOut){  
        Jedis jedis = getJedis();  
        if(0!=jedis.setnx(key, value)){  
            jedis.expire(key, timeOut);  
        }  
        returnJedis(jedis);  
    }  
      
    /** 
     * 返回指定key序列值  
     * @param key 
     * @return 
     */  
    public long incr(String key){  
        Jedis jedis = getJedis();  
        long l = jedis.incr(key);  
        returnJedis(jedis);  
        return l;  
    }  
      
    /** 
     * 获取当前时间  
     * @return 秒 
     */  
    public long currentTimeSecond(){  
        Long l = 0l;  
        Jedis jedis = getJedis();  
        Object obj = jedis.eval("return redis.call('TIME')",0);  
        if(obj != null){  
            List<String> list = (List)obj;  
            l = Long.valueOf(list.get(0));  
        }  
        returnJedis(jedis);  
        return l;  
    }  
    /** 
     * 
     * @param key 
     * @param value 
     * @return 记录总数 
     * 添加数据
     */  
    public String addjddsb(String key, String value) {  
        Jedis jedis = getJedis();  
        String count = jedis.set(key, value);
        returnJedis(jedis);
        return count;  
    }  
    public static void main(String[] args) {
    	List<String> a = new JedisUtil().getAll();
		System.out.println(a.size());
    //	new JedisUtil().addjddsb("111111", "{\"isPrecise\":0,\"mdtType\":1,\"latitude\":30.283088,\"px\":120.077469,\"py\":30.280811,\"vehi_id\":\"111111\",\"isu\":\"111111\",\"mdt_id\":\"111111\",\"speed\":32.7,\"lockState\":0,\"positionTime\":\"2018-06-08 11:03:15\",\"vehi_no\":\"浙AT9804\",\"emptyOrHeavy\":0,\"longitude\":120.072647,\"direction\":44}");
	}
}  
