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
		var clybGrid = null, store = null;
		var loadindex=null;
		var clybEchartsObj=null;
		var dcdata=[];
		var dchead=[];
		var columns = {
			AREA_NAME: {label: '重点区域'},
			YF: {label: '年份'}
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
			url : basePath + "zhyw/queryclyb",
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
						data[i]['rf'+isj] = inum;
					options.xAxis.data.push(isj);
					echarData.push(inum);
					}
					var lineMap = {
						name: data[i].YF,
						type: 'line',
						yAxisIndex: 0,
						data: echarData
					};
					options.legend.data.push(data[i].YF);
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
				clybEchartsObj.setOption(options);
				clybGrid.set('collection', store);
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
				postData.rq=$("#clyb-date").val();
				postData.qy=$("#clyb-quyu-comboBox").find('input').data('value');
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
			initTable: function(){
				var tempcolumns = {
					AREA_NAME: {label: '重点区域'},
					YF: {label: '年份'}
				};
				dchead=[];
				clybGrid.set('columns',{});
				var yf = $("#clyb-date").val().split('-')[1];
				var nf = $("#clyb-date").val().split('-')[0];
				var days = mGetDate(nf,yf);
				for (var i = 1; i < days+1; i++) {
					var rf=i;
					if(i<10){
						rf='0'+i;
					}
					var crq = yf+'-'+rf;
					tempcolumns['rf'+crq]=crq;
					dchead.push(crq);
				}
				// console.log(tempcolumns);
				clybGrid.set('columns',tempcolumns);
			},
			initToolBar:function(){
				var _self = this;
				if (clybGrid) { clybGrid = null; dojo.empty('jjrqyTable') }
				clybGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'clybTable');
				clybEchartsObj = echarts.init(document.getElementById('clybEcharts'));
				setTimeout(function(){

				$("#clyb-date").val(setformat5(new Date()));
				query('#clyb-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});
				_self.initTable();


				addEventComboBox('#s3Panel');
				/*全天*/
				query('#clyb-cx').on('click', function () {
					if($("#clyb-quyu-comboBox").find('input').data('value')==''){
					layer.msg('请选择重点区域');
					return false;
				}
					_self.initTable();
					_self.get();
				});
				/*重点区域*/
				findKeyArea().then(function (data) {
					$("#clyb-quyu-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].AREA_ID+"'>"+data[i].AREA_NAME+"</li>";
						$("#clyb-quyu-comboBox").find('.iFList').append(gss);
					}

					$('#clyb-quyu-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#clyb-quyu-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
				});

				/*导出*/
				query('#clyb-dc').on('click', function () {
					if(dcdata.length==0){
						layer.msg('无查询数据！');return;
					}
					var sheetHeader=['重点区域','年份'].concat(dchead);
					var sheetData=[];
					for (var i = 0; i <dcdata.length ; i++) {
						var item = dcdata[i];
						var data={};
						data.c1=item.AREA_NAME;
						data.c2=item.YF;
						for (var j = 0; j < dchead.length; j++) {
							data['c'+(j+3)]=item['rf'+dchead[j]];
						}
						sheetData.push(data);
					}
					_self.toExcel(sheetHeader,sheetData,'重点区域车辆数量月报表');

				});
				},0);
			}
		})
	});