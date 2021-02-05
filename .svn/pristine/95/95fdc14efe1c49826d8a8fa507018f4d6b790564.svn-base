/**
 * Created by dywed on 2017/7/1.
 */
define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"app/createAsyncStore", "dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 createAsyncStore, Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer]);
		var ddtjGrid = null, store = null;
		var xhrArgsTabel,xhrArgsGuishudi;
		var columns = [
			{field:'dojoId',label : "序号"},
            {field:'TIME',label : "时间"},
			{field:'SUM',label : "订单数量"},
			{field:'PAYING', label: "已支付"},
			{field:'NOPAY', label: "待支付"},
			{field:'QUXIAO', label: "取消订单"},
            {field:'SUMMONEY', label: "总金额"}
		];
		 var ddtjEChart=null;


		xhrArgsTabel = {
			url: basePath + "order/statistics",
			postData: 'postData={}',
			handleAs: "json",
			Origin: self.location.origin,
			preventCache: true,
			withCredentials: true,
			load: function (data) {
				$("#ddtjzje").text(data.zje);
                $("#ddtjyzf").text(data.yzf);
                $("#ddtjdzf").text(data.wzf);
                $("#ddtjqxdd").text(data.qxdd);
                var riqi = [];
                var yzf=[];
                var dzf=[];
				var data=data.data;
				for (var i = 0; i < data.length; i++) {
					data[i] = dojo.mixin({dojoId: i + 1}, data[i]);
					riqi.push(data[i].TIME);
					yzf.push(data[i].PAYING);
                    dzf.push(data[i].NOPAY);
					// console.info(data[i].TIME);
				}
                ttt(riqi,yzf,dzf);
				store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data}});
				ddtjGrid.set('collection', store);
			},
			error : function(error) {}
		};
        xhrArgsGuishudi= {
            url: basePath + "attribution/findattribution",
            postData: 'postData={"guishudi":""}',
            handleAs: "json",
            Origin: self.location.origin,
            preventCache: true,
            withCredentials: true,
            load: function (data) {
                $("#ddtj_gsd").html("<option value=''>--全部--</option>");
                for(var i=0; i<data.length; i++){
                    $("#ddtj_gsd").append("<option value='"+data[i].CITY+"'>"+data[i].CITY+"</option>");
                }
            },
            error : function(error) {}
        };
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.post();
			},
			post:function(){
			    this.gg();
                dojo.xhrPost(xhrArgsGuishudi);
			},
            gg:function () {
                xhrArgsTabel.postData='postData='+JSON.stringify({
                        ordertype: $('#ddtj-ddztQb').val(),
                        order_id:$('#ddtj-ddbhQb').val(),
                        starttime:$('#ddtj-ddksrqQb').val(),
                        endtime:$('#ddtj-ddjzrqQb').val(),
                        startaddress:$('#ddtj-cfdQb').val(),
                        endaddress:$('#ddtj-mddQb').val(),
                        address:$('#ddtj_gsd').val(),
                        info:$('#ddtj-khxxQb').val(),
                    });
                console.info(xhrArgsTabel.postData);
                dojo.xhrPost(xhrArgsTabel);
            },
			initToolBar:function(){
				var _self = this;
				if (ddtjGrid) { ddtjGrid = null; dojo.empty('ddtjTabel') }
				ddtjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "ddtjTabel");
                $('#ddtj-ddksrqQb').val(getPrevDay1(new Date()).format("yyyy-MM-dd"));
                $('#ddtj-ddjzrqQb').val(new Date().format("yyyy-MM-dd"));


                window.onresize = function () {
                    var height = $('#ddtjBottomContentPane').height();
                    $('#ddtjEChart').height(height);
//                    ddtjEChart.resize()
                }

                $('#ddtj_btnQuery').on('click', function() {
                    event.preventDefault();
                    _self.post();
                });
			},

		});
	});

function  ttt(riqi,yzf,dzf) {
    ddtjEChart=echarts.init(document.getElementById('ddtjEChart'));
     ddtjEChart.setOption({
     title: {
     text: '对数轴示例',
     left: 'center'
     },
     tooltip: {
     trigger: 'axis',
     axisPointer: {
     type: 'shadow'
     },
     formatter: function (data) {
     return data[0].seriesName + ':' + data[0].value + '<br>' +
     data[1].seriesName + ':' + data[1].value + '<br>' 
//     +
//     '总金额' + ':' + _self.getData('zje')[data[0].axisValue - 1]
     }
     },
     legend: {
     left: 'left',
     data: ['订单数量', '已支付', '待支付']
     },
     grid: {
     left: '3%',
     right: '4%',
     bottom: '3%',
     containLabel: true
     },
     xAxis: {
     type: 'category',
     name: '日期',
     splitLine: {show: false},
     data: riqi
     },
     yAxis: {
     type: 'value',
     name: 'v'
     },
     series: [
     {
     name: '已支付',
     type: 'bar',
     stack: '金额',
     data: yzf
     },
     {
     name: '待支付',
     type: 'bar',
     stack: '金额',
     data: dzf
     }
     ]
     });
}