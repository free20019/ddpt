package com.tw.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import redis.clients.jedis.Jedis;

import com.google.gson.Gson;

public class RedisUtil
{

    public static List<String> getDW(){
        List<String> list = new ArrayList<String>();
        try{
        Jedis jedis = new Jedis("192.168.0.96",6389);
        Set<String> set = jedis.keys("*");
        list = jedis.mget(set.toArray(new String[set.size()]));
        }catch(Exception e){
            System.out.println("redis连接失败");
        }
        return list;
    }
}
