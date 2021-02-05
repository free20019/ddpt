dojoConfig = {
	packages : [ {
		name : "app",
		location : "/ddpt/app"
	} ],
	parseOnLoad : true
};

var basePath = '';
// basePath = 'http://192.168.11.119:8080/ibike/';
// basePath = 'http://192.168.0.98:8080/ddpt/';
checklogin();
var callgh = "";
// var username="";
// var userfjh="";
// var userrole="";
var rmtitle = "调度";
var USERS, POWERS, REALNAMES;
var tc;
var zscxkMenu = [ {
	id : 'CLCX',
	pid : 'root',
	title : '车辆查询',
	href : 'app/html/zxcxk/clcx.html',
	closable : true
}, {
	id : 'DHCX',
	pid : 'root',
	title : '电话查询',
	href : 'app/html/zxcxk/dhcx.html',
	closable : true
}, {
	id : 'JLCX',
	pid : 'root',
	title : '距离查询',
	href : 'app/html/zxcxk/jlcx.html',
	closable : true
}, {
	id : 'YWCX',
	pid : 'root',
	title : '业务查询',
	href : 'app/html/zxcxk/ywcx.html',
	closable : true
}, {
	id : 'AXYWCX',
	pid : 'root',
	title : '爱心业务查询',
	href : 'app/html/zxcxk/axywcx.html',
	closable : true
}, {
	id : 'XXYWCX',
	pid : 'root',
	title : '孝心业务查询',
	href : 'app/html/zxcxk/xxywcx.html',
	closable : true
}, {
	id : 'QYJDTJ',
	pid : 'root',
	title : '企业结对订单统计',
	href : 'app/html/zxcxk/qyjdtj.html',
	closable : true
}, {
	id : 'CLJDTJ',
	pid : 'root',
	title : '车辆结对订单统计',
	href : 'app/html/zxcxk/cljdtj.html',
	closable : true
}, {
	id : 'KHXXCX',
	pid : 'root',
	title : '客户信息查询',
	href : 'app/html/zxcxk/khxxcx.html',
	closable : true
}, {
	id : 'DZCX',
	pid : 'root',
	title : '地址查询',
	href : 'app/html/zxcxk/dzcx.html',
	closable : true
}, {
	id : 'YYGL',
	pid : 'root',
	title : '预约管理',
	href : 'app/html/zxcxk/yygl.html',
	closable : true
}, {
	id : 'ZXCX',
	pid : 'root',
	title : '咨询查询',
	href : 'app/html/zxcxk/zxcx.html',
	closable : true
}
// ,{id: 'JKCX', pid: 'root', title: '监控查询', href: 'app/html/zxcxk/jkcx.html',
// closable: true}
];
/*
 * var zscxkMenu = [ {id: 'CLCX', name: '车辆查询', href:
 * 'app/html/zxcxk/clcx.html', closable: true}, {id: 'DHCX', name: '电话查询', href:
 * 'app/html/zxcxk/dhcx.html', closable: true}, {id: 'JLCX', name: '距离查询', href:
 * 'app/html/zxcxk/jlcx.html', closable: true}, {id: 'YWCX', name: '业务查询', href:
 * 'app/html/zxcxk/ywcx.html', closable: true}, {id: 'KHXXCX', name: '客户信息查询',
 * href: 'app/html/zxcxk/khxxcx.html', closable: true}, {id: 'DZCX', name:
 * '地址查询', href: 'app/html/zxcxk/dzcx.html', closable: true}, {id: 'YYGL', name:
 * '预约管理', href: 'app/html/zxcxk/yygl.html', closable: true}, {id: 'ZXCX', name:
 * '咨询查询', href: 'app/html/zxcxk/zxcx.html', closable: true}, {id: 'JKCX', name:
 * '监控查询', href: 'app/html/zxcxk/jkcx.html', closable: true} ], zscxkMenuLevel2 =
 * [];
 */
var czchtglMenu = [
// {id: 'CLJK', pid: 'root', title: '车辆监控', href: 'app/html/czchtgl/cljk.html',
// closable: true},
{
	id : 'QKB',
	pid : 'root',
	title : '区块表',
	href : 'app/html/czchtgl/qkb.html',
	closable : true
}, {
	id : 'GSB',
	pid : 'root',
	title : '公司表',
	href : 'app/html/czchtgl/gsb.html',
	closable : true
}, {
	id : 'CLB',
	pid : 'root',
	title : '车辆表',
	href : 'app/html/czchtgl/clb.html',
	closable : true
}, {
	id : 'ZDB',
	pid : 'root',
	title : '终端表',
	href : 'app/html/czchtgl/zdb.html',
	closable : true
}, {
	id : 'CXB',
	pid : 'root',
	title : '车型表',
	href : 'app/html/czchtgl/cplxb.html',
	closable : true
}, {
	id : 'YSB',
	pid : 'root',
	title : '颜色表',
	href : 'app/html/czchtgl/clysb.html',
	closable : true
}, {
	id : 'TXB1',
	pid : 'root',
	title : '通信表',
	href : 'app/html/czchtgl/txlxb.html',
	closable : true
}, {
	id : 'DDB',
	pid : 'root',
	title : '调度表',
	href : 'app/html/czchtgl/ddb.html',
	closable : true
}, {
	id : 'DWB',
	pid : 'root',
	title : '定位表',
	href : 'app/html/czchtgl/dwb.html',
	closable : true
}, {
	id : 'QUB',
	pid : 'root',
	title : '区域表',
	href : 'app/html/czchtgl/qyb.html',
	closable : true
}, {
	id : 'KHB',
	pid : 'root',
	title : '客户表',
	href : 'app/html/czchtgl/khb.html',
	closable : true
}, {
	id : 'KHB',
	pid : 'root',
	title : '客户表2',
	href : 'app/html/czchtgl/khb2.html',
	closable : true
},{
	id : 'XJCP',
	pid : 'root',
	title : '新旧车牌',
	href : 'app/html/czchtgl/newoldvhic.html',
	closable : true
},{
	id : 'YHB',
	pid : 'root',
	title : '优惠券',
	href : 'app/html/czchtgl/yhq.html',
	closable : true
},{
	id : 'YHB',
	pid : 'root',
	title : '车辆组',
	href : 'app/html/czchtgl/axcz.html',
	closable : true
},{
	id : 'YHB',
	pid : 'root',
	title : '司机表',
	href : 'app/html/czchtgl/sjb.html',
	closable : true
}

];
var xhchtglMenu = [
//{id: 'CLJK', pid: 'root', title: '车辆监控', href: 'app/html/czchtgl/cljk.html',
//closable: true},
{
	id : 'XHCHTGL',
	pid : 'root',
	title : '基础数据管理',
	closable : true
}, {
	id : 'CLB',
	pid : 'XHCHTGL',
	title : '车辆管理',
	href : 'app/html/xhchtgl/clb.html',
	closable : true
},/*{
	id : 'GSB',
	pid : 'XHCHTGL',
	title : '公司管理',
	href : 'app/html/xhchtgl/gsb.html',
	closable : true
},*/  {
	id : 'DDB',
	pid : 'XHCHTGL',
	title : '违章管理',
	href : 'app/html/xhchtgl/ddb.html',
	closable : true
}, {
	id : 'KHB',
	pid : 'XHCHTGL',
	title : '驾驶员管理',
	href : 'app/html/xhchtgl/khb.html',
	closable : true
},{
	id : 'WZCCXXTJ',
	pid : 'root',
	title : '违章车辆信息统计',
	closable : true
},{
id : 'GSB',
pid : 'WZCCXXTJ',
title : '公司违章车辆查询',
href : 'app/html/xhchtgl/gsb.html',
closable : true
},{
id : 'WZB',
pid : 'WZCCXXTJ',
title : '公司违章车辆信息',
href : 'app/html/xhchtgl/wzb.html',
closable : true
},{
id : 'TJB',
pid : 'WZCCXXTJ',
title : '公司违章车辆统计',
href : 'app/html/xhchtgl/tjb.html',
closable : true
}

];
if (POWERS != '调度员(普通)') {
	czchtglMenu.push({
		id : 'YHB',
		pid : 'root',
		title : '用户表',
		href : 'app/html/czchtgl/yhb.html',
		closable : true
	});
}
/*
 * var czchtglMenu = [ {id: 'QKB', name: '区块表', href:
 * 'app/html/czchtgl/qkb.html', closable: true}, {id: 'GSB', name: '公司表', href:
 * 'app/html/czchtgl/gsb.html', closable: true}, {id: 'CLB', name: '车辆表', href:
 * 'app/html/czchtgl/clb.html', closable: true}, {id: 'ZDB', name: '终端表', href:
 * 'app/html/czchtgl/zdb.html', closable: true}, {id: 'CXB', name: '车型表', href:
 * 'app/html/czchtgl/cplxb.html', closable: true}, {id: 'YSB', name: '颜色表',
 * href: 'app/html/czchtgl/clysb.html', closable: true}, {id: 'TXB1', name:
 * '通信表', href: 'app/html/czchtgl/txlxb.html', closable: true}, {id: 'DDB',
 * name: '调度表', href: 'app/html/czchtgl/ddb.html', closable: true}, {id: 'DWB',
 * name: '定位表', href: 'app/html/czchtgl/dwb.html', closable: true}, {id: 'QUB',
 * name: '区域表', href: 'app/html/czchtgl/qyb.html', closable: true}, {id: 'KHB',
 * name: '客户表', href: 'app/html/czchtgl/khb.html', closable: true}, {id: 'YHB',
 * name: '用户表', href: 'app/html/czchtgl/yhb.html', closable: true} ],
 * czchtglMenuLevel2 = [];
 */
var zhywbbMenu = [
/* 出租数据查询 */
{
	id : 'CZSJCX',
	pid : 'root',
	title : '出租数据查询',
	closable : true
}, {
	id : 'statistics2',
	pid : 'CZSJCX',
	title : '交易时段统计(按日)',
	href : 'app/html/zhywbb/czsjcx/statistics2.html',
	closable : true
}, {
	id : 'statistics4',
	pid : 'CZSJCX',
	title : '交易时段统计(按周)',
	href : 'app/html/zhywbb/czsjcx/jytj_az.html',
	closable : true
}, {
	id : 'statistics3r',
	pid : 'CZSJCX',
	title : '交易时段统计(按月)',
	href : 'app/html/zhywbb/czsjcx/statistics3.html',
	closable : true
}, {
	id : 'statistics3n',
	pid : 'CZSJCX',
	title : '交易时段统计(按年)',
	href : 'app/html/zhywbb/czsjcx/jytj_an.html',
	closable : true
}, {
	id : 'statistics3jjr',
	pid : 'CZSJCX',
	title : '交易时段统计(节假日)',
	href : 'app/html/zhywbb/czsjcx/jytj_jjr.html',
	closable : true
},{
	id : 'zhyytj',
	pid : 'CZSJCX',
	title : '综合营运统计',
	closable : true
}, {
	id : 'statistics31',
	pid : 'zhyytj',
	title : '公司统计',
	href : 'app/html/zhywbb/czsjcx/gstj.html',
	closable : true
}, {
	id : 'statistics34',
	pid : 'zhyytj',
	title : '公司月统计',
	href : 'app/html/zhywbb/czsjcx/gsytj.html',
	closable : true
}, {
	id : 'statistics32',
	pid : 'zhyytj',
	title : '公司平均',
	href : 'app/html/zhywbb/czsjcx/gspj.html',
	closable : true
}, {
	id : 'statistics33',
	pid : 'zhyytj',
	title : '车辆统计',
	href : 'app/html/zhywbb/czsjcx/cltj.html',
	closable : true
},
/* 重点区域车辆数统计*/
	{
	id : 'ZDQY',
	pid : 'root',
	title : '重点区域车辆查询',
	closable : true
}, {
	id : 'YYSSFX',
	pid : 'ZDQY',
	title : '车辆营运实时分析',
	href : 'app/html/zhywbb/czsjcx/jytj_qy.html',
	closable : true
},{
	id : 'CLSLYBB',
	pid : 'ZDQY',
	title : '车辆数量月报表',
	href : 'app/html/zhywbb/czsjcx/clslbb_ay.html',
	closable : true
// },{
// 	id : 'CLSLBYBB',
// 	pid : 'ZDQY',
// 	title : '车辆数量半年报表',
// 	href : 'app/html/zhywbb/czsjcx/clslbb_abn.html',
// 	closable : true
},{
	id : 'CLSLQYBB',
	pid : 'ZDQY',
	title : '车辆数量年报表',
	href : 'app/html/zhywbb/czsjcx/clslbb_an.html',
	closable : true
},
/* 查询管理 */
{
	id : 'CXGL',
	pid : 'root',
	title : '查询管理',
	closable : true
}, {
	id : 'CLXJJY',
	pid : 'CXGL',
	title : '车辆现金交易查询',
	href : 'app/html/zhywbb/cxgl/clxjjy.html',
	closable : true
}, {
	id : 'CLSKJY',
	pid : 'CXGL',
	title : '车辆刷卡交易查询',
	href : 'app/html/zhywbb/cxgl/clskjy.html',
	closable : true
}, {
	id : 'CLYYJY',
	pid : 'CXGL',
	title : '车辆营运交易查询',
	href : 'app/html/zhywbb/cxgl/clyyjy.html',
	closable : true
}, {
	id : 'CLZXYYSJ',
	pid : 'CXGL',
	title : '最新营运时间查询',
	href : 'app/html/zhywbb/cxgl/clzxyysj.html',
	closable : true
}, {
	id : 'YCSJCX',
	pid : 'CXGL',
	title : '车辆异常数据查询',
	href : 'app/html/zhywbb/cxgl/ycsjcx.html',
	closable : true
},

/* 统计管理 */
{
	id : 'TJGL',
	pid : 'root',
	title : '统计管理',
	closable : true
}, {
	id : 'YYJYTS',
	pid : 'TJGL',
	title : '营运天数统计',
	href : 'app/html/zhywbb/zhtj/yyjyts.html',
	closable : true
}, {
	id : 'JYCSTJ',
	pid : 'TJGL',
	title : '交易次数统计',
	href : 'app/html/zhywbb/tjgl/jycs.html',
	closable : true
}, {
	id : 'JYJETJ',
	pid : 'TJGL',
	title : '交易金额统计',
	href : 'app/html/zhywbb/tjgl/jyje.html',
	closable : true
}, {
	id : 'JYJCTJ',
	pid : 'TJGL',
	title : '交易计程统计',
	href : 'app/html/zhywbb/tjgl/jyjc.html',
	closable : true
}, {
	id : 'JYKSTJ',
	pid : 'TJGL',
	title : '交易空驶统计',
	href : 'app/html/zhywbb/tjgl/jyks.html',
	closable : true
}, {
	id : 'JYDDSJTJ',
	pid : 'TJGL',
	title : '交易等待时间统计',
	href : 'app/html/zhywbb/tjgl/jyddsj.html',
	closable : true
}, {
	id : 'JYYYSJTJ',
	pid : 'TJGL',
	title : '交易营运时间统计',
	href : 'app/html/zhywbb/tjgl/jyyysj.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'TJGL',
	title : '交易数据汇总统计',
	href : 'app/html/zhywbb/tjgl/jysjhz.html',
	closable : true
},

/* 综合统计 */
{
	id : 'ZHTJ',
	pid : 'root',
	title : '综合统计',
	closable : true
}, {
	id : 'YYJYCSZHTJ',
	pid : 'ZHTJ',
	title : '营运交易次数综合统计',
	href : 'app/html/zhywbb/zhtj/yyjycsz.html',
	closable : true
}, {
	id : 'YYJYJEZHTJ',
	pid : 'ZHTJ',
	title : '营运交易金额综合统计',
	href : 'app/html/zhywbb/zhtj/yyjyjez.html',
	closable : true
}, {
	id : 'YYJYJCZHTJ',
	pid : 'ZHTJ',
	title : '营运交易计程综合统计',
	href : 'app/html/zhywbb/zhtj/yyjyjcz.html',
	closable : true
}, {
	id : 'YYJYKSZHTJ',
	pid : 'ZHTJ',
	title : '营运交易空驶综合统计',
	href : 'app/html/zhywbb/zhtj/yyjyksz.html',
	closable : true
}, {
	id : 'YYJYDDSJZHTJ',
	pid : 'ZHTJ',
	title : '营运交易等待时间综合统计',
	href : 'app/html/zhywbb/zhtj/yyjyddsjz.html',
	closable : true
}, {
	id : 'YYJYYYSJZHTJ',
	pid : 'ZHTJ',
	title : '营运交易营运时间综合统计',
	href : 'app/html/zhywbb/zhtj/yyjyyysjz.html',
	closable : true
},

{
	id : 'YYSJODLX',
	pid : 'root',
	title : '营运数据OD流向',
	closable : true
}, {
	id : 'YYJYCSZHTJ',
	pid : 'YYSJODLX',
	title : 'OD营运数据分析',
	href : 'app/html/zhywbb/odlx/odyysjfx.html',
	closable : true
}, {
	id : 'YYJYJCZHTJ',
	pid : 'YYSJODLX',
	title : 'OD流向统计',
	href : 'app/html/zhywbb/odlx/odlxtj.html',
	closable : true
}, {
	id : 'JYKSTJ',
	pid : 'YYSJODLX',
	title : 'OD流向图',
	href : 'app/html/zhywbb/odlx/odlxt.html',
	closable : true
},

{
	id : 'YYSJFX',
	pid : 'root',
	title : '营运数据分析',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'YYSJFX',
	title : '在线营运率分析',
	href : 'app/html/zhywbb/yysjfx/zxyylfx.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'YYSJFX',
	title : '里程利用率分析',
	href : 'app/html/zhywbb/yysjfx/lclylfx.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'YYSJFX',
	title : '单车平均里程分析',
	href : 'app/html/zhywbb/yysjfx/dcpjlcfx.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'YYSJFX',
	title : '上线率分析',
	href : 'app/html/zhywbb/yysjfx/sxlfx.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'YYSJFX',
	title : '重车率分析',
	href : 'app/html/zhywbb/yysjfx/zclfx.html',
	closable : true
}, {
	id : 'JYKSTJ',
	pid : 'YYSJFX',
	title : '营运日报',
	href : 'app/html/zhywbb/yysjfx/yyrb.html',
	closable : true
}, {
	id : 'JYKSTJ',
	pid : 'YYSJFX',
	title : '营运月报',
	href : 'app/html/zhywbb/yysjfx/yyyb.html',
	closable : true
},

{
	id : 'MZCMK',
	pid : 'root',
	title : '模子车',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'MZC',
	title : '5次/日同点',
	href : 'app/html/zhywbb/mzc/wcmrtd.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'MZC',
	title : '10分钟以上停留',
	href : 'app/html/zhywbb/mzc/sfzystl.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'MZC',
	title : '3日同点位',
	href : 'app/html/zhywbb/mzc/srtdw.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'MZC',
	title : '轨迹缺失大于30分钟',
	href : 'app/html/zhywbb/mzc/gjqsdyssfz.html',
	closable : true
}, {
	id : 'JYSJHZTJ',
	pid : 'MZC',
	title : '景区绕圈的车辆',
	href : 'app/html/zhywbb/mzc/jqrqdcl.html',
	closable : true
},{
	id : 'MZC',
	pid : 'MZCMK',
	title : '疑似模子车辆',
	href : 'app/html/zhywbb/mzc/ysmzcl.html',
	closable : true
},{
	id : 'MZC',
	pid : 'MZCMK',
	title : '汇总表',
	href : 'app/html/zhywbb/mzc/hzb.html',
	closable : true
}, {
	id : 'MZC',
	pid : 'MZCMK',
	title : '模子车详情',
	closable : true
}

];
/*
 * var zhywbbMenu = [ {id: 'CXGL', name: '查询管理', item: ['现金交易时段查询', '刷卡交易时段查询',
 * '营运交易时段查询', '车辆现金交易查询', '车辆刷卡交易查询', '车辆营运交易查询', '营运交易最新时间查询',
 * '最新营运时间查询','车辆异常数据查询'], closable: true}, {id: 'TJGL', name: '统计管理', item: [
 * '交易次数统计', '交易金额统计','交易计程统计','交易空驶统计','交易等待时间统计','交易营运时间统计','交易数据汇总统计' ],
 * closable: true}, //'现金交易次数统计', '刷卡交易次数统计', '营运交易次数统计', //'现金交易金额统计',
 * '刷卡交易金额统计', '营运交易金额统计', //'现金交易计程统计', '刷卡交易计程统计', '营运交易计程统计', //'现金交易等待时间统计',
 * '刷卡交易等待时间统计', '营运交易等待时间统计', //'现金交易空驶统计', '刷卡交易空驶统计', '营运交易空驶统计',
 * //'现金交易营运时间统计', '刷卡交易营运时间统计', '营运交易营运时间统计']
 * 
 * {id: 'ZHTJ', name: '综合统计', item: ['营运交易次数综合统计', '营运交易金额综合统计', '营运交易计程综合统计',
 * '营运交易空驶综合统计', '营运交易等待时间综合统计', '营运交易营运时间综合统计'], closable: true}, {id:
 * 'CZSJCX', name: '出租数据查询', item: [ '交易时段统计(按日)', '交易时段统计(按月)','综合营运统计'],
 * closable: true} ], zhywbbMenuLevel2 = [ /!*查询管理*!/ // {id: 'XJJYCX', name:
 * '现金交易时段查询', href: 'app/html/zhywbb/cxgl/xjjycx.html', closable: true}, //
 * {id: 'SKJYCX', name: '刷卡交易时段查询', href: 'app/html/zhywbb/cxgl/skjycx.html',
 * closable: true}, // {id: 'YYJYCX', name: '营运交易时段查询', href:
 * 'app/html/zhywbb/cxgl/yyjycx.html', closable: true}, {id: 'CLXJJY', name:
 * '车辆现金交易查询', href: 'app/html/zhywbb/cxgl/clxjjy.html', closable: true}, {id:
 * 'CLSKJY', name: '车辆刷卡交易查询', href: 'app/html/zhywbb/cxgl/clskjy.html',
 * closable: true}, {id: 'CLYYJY', name: '车辆营运交易查询', href:
 * 'app/html/zhywbb/cxgl/clyyjy.html', closable: true}, // {id: 'YYJYZXSJ',
 * name: '营运交易最新时间查询', href: 'app/html/zhywbb/cxgl/yyjyzxsj.html', closable:
 * true}, {id: 'CLZXYYSJ', name: '最新营运时间查询', href:
 * 'app/html/zhywbb/cxgl/clzxyysj.html', closable: true}, {id: 'YCSJCX', name:
 * '车辆异常数据查询', href: 'app/html/zhywbb/cxgl/ycsjcx.html', closable: true},
 * /!*统计管理*!/ {id: 'JYCSTJ', name: '交易次数统计', href:
 * 'app/html/zhywbb/tjgl/jycs.html', closable: true}, {id: 'JYJETJ', name:
 * '交易金额统计', href: 'app/html/zhywbb/tjgl/jyje.html', closable: true}, {id:
 * 'JYJCTJ', name: '交易计程统计', href: 'app/html/zhywbb/tjgl/jyjc.html', closable:
 * true}, {id: 'JYDDSJTJ', name: '交易等待时间统计', href:
 * 'app/html/zhywbb/tjgl/jyddsj.html', closable: true}, {id: 'JYKSTJ', name:
 * '交易空驶统计', href: 'app/html/zhywbb/tjgl/jyks.html', closable: true}, {id:
 * 'JYYYSJTJ', name: '交易营运时间统计', href: 'app/html/zhywbb/tjgl/jyyysj.html',
 * closable: true}, {id: 'JYSJHZTJ', name: '交易数据汇总统计', href:
 * 'app/html/zhywbb/tjgl/jysjhz.html', closable: true}, /!*综合统计*!/ {id:
 * 'YYJYCSZHTJ', name: '营运交易次数综合统计', href: 'app/html/zhywbb/zhtj/yyjycsz.html',
 * closable: true}, {id: 'YYJYJEZHTJ', name: '营运交易金额综合统计', href:
 * 'app/html/zhywbb/zhtj/yyjyjez.html', closable: true}, {id: 'YYJYJCZHTJ',
 * name: '营运交易计程综合统计', href: 'app/html/zhywbb/zhtj/yyjyjcz.html', closable:
 * true}, {id: 'YYJYDDSJZHTJ', name: '营运交易等待时间综合统计', href:
 * 'app/html/zhywbb/zhtj/yyjyddsjz.html', closable: true}, {id: 'YYJYKSZHTJ',
 * name: '营运交易空驶综合统计', href: 'app/html/zhywbb/zhtj/yyjyksz.html', closable:
 * true}, {id: 'YYJYYYSJZHTJ', name: '营运交易营运时间综合统计', href:
 * 'app/html/zhywbb/zhtj/yyjyyysjz.html', closable: true}, // {id:
 * 'YYJYCFCSZHTJ', name: '营运交易重复次数综合统计', href:
 * 'app/html/zhywbb/zhtj/yyjycfcsz.html', closable: true}, /!*出租数据查询*!/ // {id:
 * 'statistics1', name: '统计1', href: 'app/html/zhywbb/czsjcx/statistics1.html',
 * closable: true}, {id: 'statistics2', name: '交易时段统计(按日)', href:
 * 'app/html/zhywbb/czsjcx/statistics2.html', closable: true}, {id:
 * 'statistics3', name: '交易时段统计(按月)', href:
 * 'app/html/zhywbb/czsjcx/statistics3.html', closable: true}, {id: 'zhyytj',
 * name: '综合营运统计', item: [ '公司统计', '公司平均','车辆统计'], closable: true}, // {id:
 * 'statistics4', name: '统计4', href: 'app/html/zhywbb/czsjcx/statistics4.html',
 * closable: true} ], zhywbbMenuLevel3 = [ {id: 'statistics31', name: '公司统计',
 * href: 'app/html/zhywbb/czsjcx/statistics31.html', closable: true}, {id:
 * 'statistics32', name: '公司平均', href:
 * 'app/html/zhywbb/czsjcx/statistics32.html', closable: true}, {id:
 * 'statistics33', name: '车辆统计', href:
 * 'app/html/zhywbb/czsjcx/statistics33.html', closable: true}, ];
 */
var czbbMenu = [
/* 车辆基础信息统计 */
{
	id : 'CLJCXXTJ',
	pid : 'root',
	title : '车辆基础信息统计',
	closable : true
}, {
	id : 'WSXCLTJ',
	pid : 'CLJCXXTJ',
	title : '未上线车辆统计',
	href : 'app/html/czbb/cljc/wsxcltj.html',
	closable : true
}, {
	id : 'WSXCLTJ',
	pid : 'CLJCXXTJ',
	title : '未营运车辆统计',
	href : 'app/html/czbb/cljc/wyycltj.html',
	closable : true
},{
	id : 'WSXCLTJ',
	pid : 'CLJCXXTJ',
	title : '空重车状态无变化车辆',
	href : 'app/html/czbb/cljc/wkzcbhcl.html',
	closable : true
}, {
	id : 'CLSXLTJ',
	pid : 'CLJCXXTJ',
	title : '车辆上线率统计',
	href : 'app/html/czbb/cljc/clsxltj.html',
	closable : true
}, {
	id : 'CLSXLTJ',
	pid : 'CLJCXXTJ',
	title : '车辆营运率统计',
	href : 'app/html/czbb/cljc/clcsltj.html',
	closable : true
}, {
	id : 'CLSXLTJ',
	pid : 'CLJCXXTJ',
	title : '车辆上线率明细统计',
	href : 'app/html/czbb/cljc/clsxlmxtj.html',
	closable : true
}, {
	id : 'CLSXLTJ',
	pid : 'CLJCXXTJ',
	title : '车辆营运率明细统计',
	href : 'app/html/czbb/cljc/clcslmxtj.html',
	closable : true
}, {
	id : 'ZXSJTJ',
	pid : 'CLJCXXTJ',
	title : '在线时间统计',
	href : 'app/html/czbb/cljc/zxsjtj.html',
	closable : true
}, {
	id : 'GSCLTJ',
	pid : 'CLJCXXTJ',
	title : '公司车辆统计',
	href : 'app/html/czbb/cljc/gscltj.html',
	closable : true
}, {
	id : 'XAZCLTJ',
	pid : 'CLJCXXTJ',
	title : '新安装车辆统计',
	href : 'app/html/czbb/cljc/xazcltj.html',
	closable : true
}, {
	id : 'BJCLTJ',
	pid : 'CLJCXXTJ',
	title : '报警车辆统计',
	href : 'app/html/czbb/cljc/bjcltj.html',
	closable : true
}, {
	id : 'BJCLTJ',
	pid : 'CLJCXXTJ',
	title : '节假日终端分析',
	href : 'app/html/czbb/cljc/jjrzdfx.html',
	closable : true
},

/* 调度业务统计 */
{
	id : 'DDYWTJ',
	pid : 'root',
	title : '调度业务统计',
	closable : true
}, {
	id : 'JCTJ',
	pid : 'DDYWTJ',
	title : '叫车统计',
	href : 'app/html/czbb/ddyw/jctj.html',
	closable : true
}, {
	id : 'JCTJ',
	pid : 'DDYWTJ',
	title : '话务量周报',
	href : 'app/html/czbb/ddyw/hwlzb.html',
	closable : true
}, {
	id : 'JCTJ',
	pid : 'DDYWTJ',
	title : '话务量月报',
	href : 'app/html/czbb/ddyw/hwlyb.html',
	closable : true
}, {
	id : 'JCTJ',
	pid : 'DDYWTJ',
	title : '话务量年报',
	href : 'app/html/czbb/ddyw/hwlnb.html',
	closable : true
}, {
	id : 'FSDTJ',
	pid : 'DDYWTJ',
	title : '分时段统计',
	href : 'app/html/czbb/ddyw/fsdtj.html',
	closable : true
}, {
	id : 'ZXDDTJ',
	pid : 'DDYWTJ',
	title : '坐席调度统计',
	href : 'app/html/czbb/ddyw/zxddtj.html',
	closable : true
}, {
	id : 'GSJDPM',
	pid : 'DDYWTJ',
	title : '公司接单排名',
	href : 'app/html/czbb/ddyw/gsjdpm.html',
	closable : true
}, {
	id : 'CLJDPM',
	pid : 'DDYWTJ',
	title : '车辆接单排名',
	href : 'app/html/czbb/ddyw/cljdpm.html',
	closable : true
}, {
	id : 'YYYWTJ',
	pid : 'DDYWTJ',
	title : '预约业务统计',
	href : 'app/html/czbb/ddyw/yyywtj.html',
	closable : true
} ];
/*
 * var czbbMenu = [ {id: 'CLJCXXTJ', name: '车辆基础信息统计', item: ['未上线车辆统计',
 * '车辆上线率统计', '在线时间统计', '公司车辆统计', '新安装车辆统计', '报警车辆统计'], closable: true}, {id:
 * 'DDYWTJ', name: '调度业务统计', item: ['叫车统计', '分时段统计', '坐席调度统计', '公司接单排名',
 * '车辆接单排名', '预约业务统计'], closable: true} ], czbbMenuLevel2 = [ /!*车辆基础信息统计*!/
 * {id: 'WSXCLTJ', name: '未上线车辆统计', href: 'app/html/czbb/cljc/wsxcltj.html',
 * closable: true}, {id: 'CLSXLTJ', name: '车辆上线率统计', href:
 * 'app/html/czbb/cljc/clsxltj.html', closable: true}, {id: 'ZXSJTJ', name:
 * '在线时间统计', href: 'app/html/czbb/cljc/zxsjtj.html', closable: true}, {id:
 * 'GSCLTJ', name: '公司车辆统计', href: 'app/html/czbb/cljc/gscltj.html', closable:
 * true}, {id: 'XAZCLTJ', name: '新安装车辆统计', href:
 * 'app/html/czbb/cljc/xazcltj.html', closable: true}, {id: 'BJCLTJ', name:
 * '报警车辆统计', href: 'app/html/czbb/cljc/bjcltj.html', closable: true},
 * /!*调度业务统计*!/ {id: 'JCTJ', name: '叫车统计', href: 'app/html/czbb/ddyw/jctj.html',
 * closable: true}, {id: 'FSDTJ', name: '分时段统计', href:
 * 'app/html/czbb/ddyw/fsdtj.html', closable: true}, {id: 'ZXDDTJ', name:
 * '坐席调度统计', href: 'app/html/czbb/ddyw/zxddtj.html', closable: true}, {id:
 * 'GSJDPM', name: '公司接单排名', href: 'app/html/czbb/ddyw/gsjdpm.html', closable:
 * true}, {id: 'CLJDPM', name: '车辆接单排名', href: 'app/html/czbb/ddyw/cljdpm.html',
 * closable: true}, {id: 'YYYWTJ', name: '预约业务统计', href:
 * 'app/html/czbb/ddyw/yyywtj.html', closable: true} ];
 */
var oaMenu = [
/* 热线日志 */
{
	id : 'RXRZ',
	pid : 'root',
	title : '热线日志',
	closable : true
}, {
	id : 'CZRL',
	pid : 'RXRZ',
	title : '出租日志',
	href : 'app/html/oa/rxrz/czrl.html',
	closable : true
}, {
	id : 'FCZRL',
	pid : 'RXRZ',
	title : '非出租日志',
	href : 'app/html/oa/rxrz/fczrl.html',
	closable : true
}, {
	id : 'GCCRZ',
	pid : 'RXRZ',
	title : '工程车日志',
	href : 'app/html/oa/rxrz/gccrz.html',
	closable : true
},
/* 特殊业务 */
{
	id : 'TSYW',
	pid : 'root',
	title : '特殊业务',
	closable : true
}, {
	id : 'CZYW',
	pid : 'TSYW',
	title : '出租业务',
	href : 'app/html/oa/tsyw/czyw.html',
	closable : true
},

{
	id : 'DXYW',
	pid : 'root',
	title : '短信业务',
	href : 'app/html/oa/dxyw.html',
	closable : true
}, {
	id : 'TXZY',
	pid : 'root',
	title : '提醒注意',
	href : 'app/html/oa/txzy.html',
	closable : true
}, {
	id : 'HRHS',
	pid : 'root',
	title : '好人好事',
	href : 'app/html/oa/hrhs.html',
	closable : true
}, {
	id : 'LKXX',
	pid : 'root',
	title : '路况信息',
	href : 'app/html/oa/lkxx.html',
	closable : true
}, {
	id : 'SWDJ',
	pid : 'root',
	title : '失物登记',
	href : 'app/html/oa/swdj.html',
	closable : true
}, {
	id : 'FYJL',
	pid : 'root',
	title : '翻译记录',
	href : 'app/html/oa/fyjl.html',
	closable : true
}, {
	id : 'TSJL',
	pid : 'root',
	title : '投诉记录',
	href : 'app/html/oa/tsjl.html',
	closable : true
},
/* 系统故障 */
{
	id : 'XTGZ',
	pid : 'root',
	title : '系统故障',
	closable : true
}, {
	id : 'CZGZ',
	pid : 'XTGZ',
	title : '出租故障',
	href : 'app/html/oa/xtgz/czgz.html',
	closable : true
}, {
	id : 'FCZGZ',
	pid : 'XTGZ',
	title : '非出租故障',
	href : 'app/html/oa/xtgz/fczgz.html',
	closable : true
}, {
	id : 'GCCGZ',
	pid : 'XTGZ',
	title : '工程车故障',
	href : 'app/html/oa/xtgz/gccgz.html',
	closable : true
},
/* 报警统计 */
{
	id : 'BJTJ',
	pid : 'root',
	title : '报警统计',
	closable : true
}, {
	id : 'JLTJ',
	pid : 'BJTJ',
	title : '记录统计',
	href : 'app/html/oa/bjtj/jltj.html',
	closable : true
}, {
	id : 'BBTJ',
	pid : 'BJTJ',
	title : '报表统计',
	href : 'app/html/oa/bjtj/bbtj.html',
	closable : true
}, {id: 'BBTJ',
	pid: 'BJTJ',
	title: '公司报表统计',
	href: 'app/html/oa/bjtj/gsbbtj.html',
	closable: true
},
/* 报警故障 */
{
	id : 'BJGZ',
	pid : 'root',
	title : '报警故障',
	closable : true
}, {
	id : 'CZBJ',
	pid : 'BJGZ',
	title : '出租报警',
	href : 'app/html/oa/bjgz/czbj.html',
	closable : true
}, {
	id : 'FCZBJ',
	pid : 'BJGZ',
	title : '非出租报警',
	href : 'app/html/oa/bjgz/fczbj.html',
	closable : true
}, {
	id : 'XHBJ',
	pid : 'BJGZ',
	title : '小货报警',
	href : 'app/html/oa/bjgz/xhbj.html',
	closable : true
},
/* 帮助类 */
{
	id : 'BZL',
	pid : 'root',
	title : '帮助类',
	closable : true
},
/* 维护类 */
{
	id : 'WHL',
	pid : 'root',
	title : '维护类',
	closable : true
} ]
/*
 * var oaMenu = [ {id: 'RXRZ', name: '热线日志', item: ['出租日志', '非出租日志', '工程车日志'],
 * closable: true}, {id: 'TSYW', name: '特殊业务', item: ['出租业务'], closable: true},
 * {id: 'DXYW', name: '短信业务', href: 'app/html/oa/dxyw.html', closable: true},
 * {id: 'TXZY', name: '提醒注意', href: 'app/html/oa/txzy.html', closable: true},
 * {id: 'HRHS', name: '好人好事', href: 'app/html/oa/hrhs.html', closable: true},
 * {id: 'LKXX', name: '路况信息', href: 'app/html/oa/lkxx.html', closable: true},
 * {id: 'SWDJ', name: '失误登记', href: 'app/html/oa/swdj.html', closable: true},
 * {id: 'FYJL', name: '翻译记录', href: 'app/html/oa/fyjl.html', closable: true},
 * {id: 'TSJL', name: '投诉记录', href: 'app/html/oa/tsjl.html', closable: true},
 * {id: 'XTGZ', name: '系统故障', item: ['出租故障', '非出租故障', '工程车故障'], closable: true},
 * {id: 'BJTJ', name: '报警统计', item: ['记录统计', '报表统计'], closable: true}, {id:
 * 'BJGZ', name: '报警故障', item: ['出租报警', '非出租报警', '小货报警'], closable: true}, {id:
 * 'BZL', name: '帮助类', item: [], closable: true}, {id: 'WHL', name: '维护类', item:
 * [], closable: true} ], oaMenuLevel2 = [ /!*热线日志*!/ {id: 'CZRL', name: '出租日志',
 * href: 'app/html/oa/rxrz/czrl.html', closable: true}, {id: 'FCZRL', name:
 * '非出租日志', href: 'app/html/oa/rxrz/fczrl.html', closable: true}, {id: 'GCCRZ',
 * name: '工程车日志', href: 'app/html/oa/rxrz/gccrz.html', closable: true},
 * /!*特殊业务*!/ {id: 'CZYW', name: '出租业务', href: 'app/html/oa/tsyw/czyw.html',
 * closable: true}, /!*系统故障*!/ {id: 'CZGZ', name: '出租故障', href:
 * 'app/html/oa/xtgz/czgz.html', closable: true}, {id: 'FCZGZ', name: '非出租故障',
 * href: 'app/html/oa/xtgz/fczgz.html', closable: true}, {id: 'GCCGZ', name:
 * '工程车故障', href: 'app/html/oa/xtgz/gccgz.html', closable: true}, /!*报警统计*!/
 * {id: 'JLTJ', name: '记录统计', href: 'app/html/oa/bjtj/jltj.html', closable:
 * true}, {id: 'BBTJ', name: '报表统计', href: 'app/html/oa/bjtj/bbtj.html',
 * closable: true}, /!*报警故障*!/ {id: 'CZBJ', name: '出租报警', href:
 * 'app/html/oa/bjgz/czbj.html', closable: true}, {id: 'FCZBJ', name: '非出租报警',
 * href: 'app/html/oa/bjgz/fczbj.html', closable: true}, {id: 'XHBJ', name:
 * '小货报警', href: 'app/html/oa/bjgz/xhbj.html', closable: true} ];
 */
var menu = [ {
	id : 'rcyyjk',
	name : '日常运行监控',
	item : [ '车辆动态监控', '运维人员监控', '区域监控' ]
}, {
	id : 'jczcxt',
	name : '决策支持系统',
	item : [ '自行车运行热点分析', '车辆OD流向趋势分析', '配套资源分析' ]
}, {
	id : 'xxcxxt',
	name : '信息查询系统',
	item : [ '综合查询', '区域管理' ]
}, {
	id : 'xypjxt',
	name : '信用评价系统',
	item : [ '信用查询', '信用情况统计' ]
}, {
	id : 'yjzhxt',
	name : '押金账户系统',
	item : [ '押金账户查询' ]
} ], menuLevel2 = [
/* 日常运行监控 */
{
	id : 'cldtjk',
	name : '车辆动态监控',
	href : 'app/html/',
	closable : true
}, {
	id : 'ywryjk',
	name : '运维人员监控',
	href : 'app/html/',
	closable : true
}, {
	id : 'qyjk',
	name : '区域监控',
	href : 'app/html/',
	closable : true
},
/* 决策支持系统 */
{
	id : 'zxcyxrdfx',
	name : '自行车运行热点分析',
	href : 'app/html/',
	closable : true
}, {
	id : 'clolxqsfx',
	name : '车辆OD流向趋势分析',
	href : 'app/html/',
	closable : true
}, {
	id : 'ptzyfx',
	name : '配套资源分析',
	href : 'app/html/',
	closable : true
},
/* 信息查询系统 */
{
	id : 'zhcx',
	name : '综合查询',
	href : 'app/html/',
	closable : true
}, {
	id : 'qygl',
	name : '区域管理',
	href : 'app/html/',
	closable : true
},
/* 信用评价系统 */
{
	id : 'xycx',
	name : '信用查询',
	href : 'app/html/',
	closable : true
}, {
	id : 'xyqktj',
	name : '信用情况统计',
	href : 'app/html/',
	closable : true
},
/* 押金账户系统 */
{
	id : 'yjzhcx',
	name : '押金账户查询',
	href : 'app/html/',
	closable : true
} ];

// 验证是否登录
function checklogin() {
	$
			.ajax({
				url : basePath + "login/checklogin",
				type : 'post',
				data : {},
				dataType : 'json',
				success : function(data) {
					// console.info(data);
					if (data.msg === "0") {
						location.href = "login.html";
					} else {
						callgh = data.username;
						USERS = data.username;
						POWERS = data.userrole;
						REALNAMES = data.realname;
						// userfjh = data.userfjh;
						// userrole = data.userrole;
						if ($("#ddxpt-dlgh")) {
							$("#ddxpt-dlgh").html(data.username);
							$("#ddxpt-dlfjh").html(data.userfjh);
						}
						var qx = data.role;
						$(".xtdlgh").each(function() {
							$(this).html(data.username);
						});
						if (data.username == "hzgps") {
							var cd = {
								id : 'QXB',
								pid : 'root',
								title : '权限表',
								href : 'app/html/czchtgl/qxb.html',
								closable : true
							}
							czchtglMenu.push(cd);
						} else {
							if (qx.indexOf("0") < 0) {
								$("#mu0").attr('href', 'javascript:void(0)');
								$("#mu0")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu0").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("1") < 0) {
								$("#mu1").attr('href', 'javascript:void(0)');
								$("#mu1")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu1").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("2") < 0) {
								$("#mu2").attr('href', 'javascript:void(0)');
								$("#mu2")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu2").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("3") < 0) {
								$("#mu3").attr('href', 'javascript:void(0)');
								$("#mu3")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu3").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("4") < 0) {
								$("#mu4").attr('href', 'javascript:void(0)');
								$("#mu4")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu4").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("5") < 0) {
								$("#mu5").attr('href', 'javascript:void(0)');
								$("#mu5")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu5").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("6") < 0) {
								$("#mu6").attr('href', 'javascript:void(0)');
								$("#mu6")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu6").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("7") < 0) {
								$("#mu7").attr('href', 'javascript:void(0)');
								$("#mu7")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu7").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("8") < 0) {
								$("#mu8").attr('href', 'javascript:void(0)');
								$("#mu8")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu8").click(function() {
									layer.msg("无该权限!")
								});
							}
							if (qx.indexOf("9") < 0) {
								$("#mu9").attr('href', 'javascript:void(0)');
								$("#mu9")
										.css('background-image',
												'linear-gradient(#7b7b7b , #7b7b7b  30%, #7b7b7b  70%, #7b7b7b )');
								$("#mu9").click(function() {
									layer.msg("无该权限!")
								});
							}
						}
					}
				},
				error : function(data) {
				}
			});
}

$('a[name="fhdlbtn"]').each(function() {
	$(this).click(function() {
		layer.confirm('确定退出到登录页面？', {
			btn : [ '确定', '取消' ]
		// 按钮
		}, function() {
			window.location.href = "login.html";
		}, function() {
		});

	});
});
