define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer]);
		var clnbGrid = null, store = null;
		var loadindex=null;
		var clnbEchartsObj=null;
		var dcdata=[];
		var dchead=[];
		var columns = {
			AREA_NAME: {label: '重点区域'},
			NF: {label: '年份'},
			MON01: {label: '一月'},
			MON02: {label: '二月'},
			MON03: {label: '三月'},
			MON04: {label: '四月'},
			MON05: {label: '五月'},
			MON06: {label: '六月'},
			MON07: {label: '七月'},
			MON08: {label: '八月'},
			MON09: {label: '九月'},
			MON10: {label: '十月'},
			MON11: {label: '十一月'},
			MON12: {label: '十二月'},
		};
		var options = {
			color: ['#D53A35', '#38b65c', '#eebc43'],
				tooltip: {
					trigger: 'axis',
					formatter: "{a}-{b}:{c}"
				},
				legend: {
					data: []//年份
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: []
				},
				yAxis: [{
					type: 'value',
					// max: 100,
					min: 0,
					name: '车辆数'
				}],
				series: [
				]
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryclnb",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				// console.log(data);
				layer.close(loadindex);
				options.xAxis.data=[];
				options.legend.data=[];
				options.series=[];
				var echarData=[];

				for (var i = 0; i < data.length; i++) {
					var sj = data[i].SJ.split(',');
					for (var j = 0; j < sj.length; j++) {
						var isj = sj[j].split('|')[0];
						var inum = sj[j].split('|')[1];
						data[i]['MON'+isj] = inum;
					options.xAxis.data.push(isj);
					echarData.push(inum);
					}
					var lineMap = {
						name: data[i].NF,
						type: 'line',
						yAxisIndex: 0,
						data: echarData
					};
					options.legend.data.push(data[i].NF);
					options.series.push(lineMap);
				}
				dcdata = data;
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data
					}
				});
				clnbEchartsObj.setOption(options);
				clnbGrid.set('collection', store);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};

		return declare( null,{
			constructor:function(){
				this.initToolBar();
			},
			get:function(){

				loadindex = layer.load(1);
				var postData = {};
				postData.rq=$("#clnb-date").val();
				postData.qy=$("#clnb-quyu-comboBox").find('input').data('value');
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			toExcel: function (sheetHeader, sheetData, fileName) {
				var option = {};
				option.fileName = fileName,
						option.datas = [
							{
								sheetData: sheetData,
								sheetName: 'sheet',
								sheetHeader: sheetHeader
							}
						];
				var toExcel = new ExportJsonExcel(option);
				toExcel.saveExcel();
			},
			initToolBar:function(){
				var _self = this;
				if (clnbGrid) { clnbGrid = null; dojo.empty('jjrqyTable') }
				clnbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'clnbTable');
				clnbEchartsObj = echarts.init(document.getElementById('clnbEcharts'));
				setTimeout(function(){

				$("#clnb-date").val(new Date().getFullYear());
				query('#clnb-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEAR});
				});
				addEventComboBox('#s3Panel');
				/*全天*/
				query('#clnb-cx').on('click', function () {
					if($("#clnb-quyu-comboBox").find('input').data('value')==''){
					layer.msg('请选择重点区域');
					return false;
				}
					_self.get();
				});
				/*重点区域*/
				findKeyArea().then(function (data) {
					$("#clnb-quyu-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].AREA_ID+"'>"+data[i].AREA_NAME+"</li>";
						$("#clnb-quyu-comboBox").find('.iFList').append(gss);
					}

					$('#clnb-quyu-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#clnb-quyu-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
				});

				/*导出*/
				query('#clnb-dc').on('click', function () {
					if(dcdata.length==0){
						layer.msg('无查询数据！');return;
					}
					var sheetHeader=['重点区域','年份','一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
					var sheetData=[];
					for (var i = 0; i <dcdata.length ; i++) {
						var item = dcdata[i];
						var data={};
						data.c1=item.AREA_NAME;
						data.c2=item.NF;
						for (var j = 1; j <= 12; j++) {
							var mapkey='MON'+j;
							if(j<10){
								mapkey='MON0'+j;
							}
							data['c'+(j+2)]=item[mapkey];
						}
						sheetData.push(data);
					}
					_self.toExcel(sheetHeader,sheetData,'重点区域车辆数量年报表');

				});
				},0);
			}
		})
	});