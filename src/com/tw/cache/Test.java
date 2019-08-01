package com.tw.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.gson.Gson;

import redis.clients.jedis.Jedis;

public class Test
{
    public static void main(String[] args) {
        //连接本地的 Redis 服务
        long a = System.currentTimeMillis();
        Gson gson = new Gson();
        Jedis jedis = new Jedis("192.168.0.96",6389);
        
        System.out.println("连接成功");
//        List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
        //查看服务是否运行
        System.out.println("服务正在运行: "+jedis.ping());
        Set<String> set = jedis.keys("*");
        
        List<String> list = jedis.mget(set.toArray(new String[set.size()]));
        
        long b = System.currentTimeMillis();
        
        System.out.println((b-a)+"    "+list.size());
    }
}
