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
		var ddbbGrid = null, store = null;
		var xhrArgsTabel;
		var ddbbEChart = null;
		var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		var data = {
			data: [
				{ddsl: '5', yzf: '800', dzf: '1200', zje: '2000'},
				{ddsl: '1', yzf: '1300', dzf: '0', zje: '1300'},
				{ddsl: '3', yzf: '5000', dzf: '2500', zje: '7500'},
				{ddsl: '12', yzf: '18000', dzf: '18000', zje: '36000'},
				{ddsl: '6', yzf: '9200', dzf: '4600', zje: '13800'},
				{ddsl: '2', yzf: '12000', dzf: '0', zje: '12000'},
				{ddsl: '2', yzf: '12000', dzf: '0', zje: '12000'},
				{ddsl: '2', yzf: '12000', dzf: '0', zje: '12000'},
				{ddsl: '2', yzf: '12000', dzf: '0', zje: '12000'},
				{ddsl: '2', yzf: '12000', dzf: '0', zje: '12000'},
				{ddsl: '2', yzf: '12000', dzf: '0', zje: '12000'},
				{ddsl: '2', yzf: '12000', dzf: '0', zje: '12000'}
			],
			count: 12
		};
		var columns = [
			{field:'dojoId',label : "序号"},
			{field:'yzf', label: "已支付"},
			{field:'dzf', label: "待支付"},
			{field:'zje', label: "总金额"}
		];
		xhrArgsTabel = {
			url: basePath + "bbfx/accfx",
			postData: 'postData={}',
			handleAs: "json",
			Origin: self.location.origin,
			preventCache: true,
			withCredentials: true,
			load: function (data) {
				for (var i = 0; i < data.data.length; i++) {
					data.data[i] = dojo.mixin({dojoId: i + 1}, data.data[i]);
				}
				store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data.data}});
				ddbbGrid.set('collection', store);
			},
			error : function(error) {}
		};

		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			del: function () {},
			add:function(json){},
			update:function(json){},
			get:function(){},
			getShowDate: function () {
				var val = $('#ddbb-sjztQb').val();
				switch (val) {
					case '0':
						return WdatePicker({dateFmt:'yyyy-MM-dd'});
					case '1':
						return WdatePicker({dateFmt:'yyyy-MM'});
					case '2':
						return WdatePicker({dateFmt:'yyyy'});
				}
			},
			initToolBar:function(){
				var _self = this;
				//$('#ddbb-ddrqQb').get(0).onfocus = function() { _self.getShowDate() };
				$('#ddbb-sjztQb').on('change', function () {
					$('#ddbb-ddrqQb').get(0).onfocus = function() { _self.getShowDate() }
				})
				if (ddbbGrid) { ddbbGrid = null; dojo.empty('ddbbTabel') }
				ddbbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "ddbbTabel");
				for (var i = 0; i < data.data.length; i++) {
					data.data[i] = dojo.mixin({dojoId: i + 1}, data.data[i]);
				}
				store = new Memory({data: {identifier: 'dojoId', label: 'dojoId', items: data.data}});
				ddbbGrid.set('collection', store);
				ddbbEChart = echarts.init(document.getElementById('ddbbEChart'));
				ddbbEChart.setOption({
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
								data[1].seriesName + ':' + data[1].value + '<br>' +
								'总金额' + ':' + _self.getData('zje')[data[0].axisValue - 1]
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
						name: '月',
						splitLine: {show: false},
						data: months
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
							data: this.getData('yzf')
						},
						{
							name: '待支付',
							type: 'bar',
							stack: '金额',
							data: this.getData('dzf')
						}
					]
				});
				setTimeout(function () {
					var height = $('#ddbbContentPane').height();
					$('#ddbbEChart').height(height);
					ddbbEChart.resize()
				}, 500)
				window.onresize = function () {
					var height = $('#ddbbContentPane').height();
					$('#ddbbEChart').height(height);
					ddbbEChart.resize()
				}
			},
			getData: function(name) {
				var datas = data.data;
				var arrs=[]
				for(var i=0;i<datas.length;i++) {
					arrs.push(datas[i][name])
				}
				return arrs;
			}
		});
	});