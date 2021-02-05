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
		var jjrGrid = null, store = null;
		var sjdid=1;
		var settime=null;
		var loadindex=null;
		var dcdata=[];
		var columns = {
			dojoId: {label: '序号'},
			JJR: {label: '节假日'},
			YF: {label: '日期'},
			SJD: {label: '时间段'},
			QY: {label: '区域'},
			RYYCS: {label: '总营运次数(次)'},
			CLZS: {label: '车辆总数(辆)'},
			RYYCL: {label: '营运车辆数(辆)'},
			RZLC: {label: '总行驶里程(公里)'},
			RZKLC: {label: '载客行驶里程(公里)'},
			RKSLC: {label: '空驶里程(公里)'},
			RYSJE: {label: '总营收金额(元)'},
			DHSJ: {label: '等候时间(分钟)'},
			RYYSC: {label: '营运时长(小时)'},
			ZZCS: {label: '周转次数(次/辆)'},
			PJYS: {label: '平均营收(元/辆)'},
			PJXSSD: {label: '平均行驶速度(公里/小时)'},
			PJYYSC: {label: '平均营运时长(小时/辆)'},
			PJDHSJ: {label: '平均等候时间(分/辆)'},
			SLL: {label: '上路率'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryjjr",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				console.log(data);
				dcdata = data.data;
				layer.close(loadindex);
				var nf=[];
				for (var i = 0; i < data.data.length; i++) {
					data.data[i] = dojo.mixin({
						dojoId : i + 1
					}, data.data[i]);
					var jjrtext = data.data[i].JJR;
					if(jjrtext.indexOf('正')>0){
						option.xAxis.data.push(data.data[i].YF+';(正节)');
					}else{
						option.xAxis.data.push(data.data[i].YF);
					}

					option.series[0].data.push(data.data[i].RYYCS);
					var n = data.data[i].YF.split('-')[0];

					var ycz = true;
					for (var j = 0; j < nf.length; j++) {
						if(nf[j].nf==n){
							ycz=false;
						}
					}
					if(ycz){
						nf.push({
							nf:n,
							sr:i,
							er:i
						});
						if(i>0){
							nf[nf.length-2].er=i-1;
						}
					}
					if(i==data.data.length-1){
						nf[nf.length-1].er=i;
					}
				}
				for (var i = 0; i < nf.length; i++) {
					option.visualMap[0].pieces.push({
						gte:nf[i].sr,
						lte:nf[i].er,
						color:colors[i]
					});
				}
				jjrEcharts.setOption(option);
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.data
					}
				});
				jjrGrid.set('collection', store);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};
		var colors = ['#03fb5c', '#fcc827', '#340dec', '#6b47ff', '#3494ec','#94ff06', '#ff2f00'];
		var jjrEcharts=null;
		var option = {
			legend: {
				data: []
		  	},
			xAxis: {
				type: 'category',
				axisLabel: {
				   interval: 0,
					   formatter:function(value)
					   {
						   return value.replace("-","\n").replace(";","\n");
					   }
				},
				data: []//日期
			},
			yAxis: {
				type: 'value'
			},
			visualMap: [
				{
					type: 'piecewise',  // 分段型
					dimension:0,
					pieces: [
					]
				}
			],
			series: [{
				data: [],//数据
				type: 'bar',
				barWidth: 30,
			}]
		};
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.initEcharts();
			},
			get:function(){
				this.initEcharts();
				loadindex = layer.load(1);
				var postData = {};
				postData.jjr=$("#jjr-jr-comboBox").find('input').val();
				postData.qy=$("#jjr-quyu-comboBox").find('input').val();
				postData.sjd=sjdid;
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
				if (jjrGrid) { jjrGrid = null; dojo.empty('jjrTable') }
				jjrGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jjrTable');
				jjrEcharts = echarts.init(document.getElementById('jjrEcharts'));
				addEventComboBox('#s3Panel');
				addEventComboBox('#ss3Panel');
				/*早高峰*/
				query('#jjr-zgf').on('click', function () {
					sjdid=1;
					_self.get();
				});
				/*晚高峰*/
				query('#jjr-wgf').on('click', function () {
					sjdid=2;
					_self.get();
				});
				/*全天*/
				query('#jjr-qt').on('click', function () {
					sjdid=5;
					_self.get();
				});
				/*晚间*/
				query('#jjr-yj').on('click', function () {
					sjdid=4;
					_self.get();
				});
				/*白天*/
				query('#jjr-bt').on('click', function () {
					sjdid=3;
					_self.get();
				});
				/*凌晨*/
				query('#jjr-lc').on('click', function () {
					sjdid=6;
					_self.get();
				});
				/*导出*/
				query('#jjr-dc').on('click', function () {
					if(dcdata.length==0){
						layer.msg('无查询数据！');return;
					}
					var sheetHeader=["序号","节假日","日期","时间段","区域","总营运次数(次)","车辆总数(辆)","营运车辆数(辆)","总行驶里程(公里)","载客行驶里程(公里)","空驶里程(公里)","总营收金额(元)","等候时间(分钟)","营运时长(小时)","周转次数(次/辆)","平均营收(元/辆)","平均行驶速度(公里/小时)","平均营运时长(小时/辆)","平均等候时间(分/辆)","上路率"];
					var sheetData=[];
					for (var i = 0; i <dcdata.length ; i++) {
						var item = dcdata[i];
						var data={};
						data.c1=item.dojoId;
						data.c2=item.JJR;
						data.c3=item.YF;
						data.c4=item.SJD;
						data.c5=item.QY;
						data.c6=item.RYYCS;
						data.c7=item.CLZS;
						data.c8=item.RYYCL;
						data.c9=item.RZLC;
						data.c10=item.RZKLC;
						data.c11=item.RKSLC;
						data.c12=item.RYSJE;
						data.c13=item.DHSJ;
						data.c14=item.RYYSC;
						data.c15=item.ZZCS;
						data.c16=item.PJYS;
						data.c17=item.PJXSSD;
						data.c18=item.PJYYSC;
						data.c19=item.PJDHSJ;
						data.c20=item.SLL;
						sheetData.push(data);
					}
					_self.toExcel(sheetHeader,sheetData,'交易时段统计(节假日)');


					// var postData = {};
					// postData.stime=$("#jjr-date").val();
					// postData.qy=$("#jjr-quyu-comboBox").find('input').val();
					// postData.sjd=sjdid;
					// url = basePath + "zhyw/ntj_daochu?postData="
          //    		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			},
			initEcharts:function(){
				var _self = this;
				option.xAxis.data=[];
				option.series[0].data=[];
				option.visualMap[0].pieces=[];
				jjrEcharts.setOption(option);
			}
		})
	});