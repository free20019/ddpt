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
		var yyanGrid = null, store = null;
		var sjdid=1;
		var settime=null;
		var loadindex=null;
		var dcdata=[];
		var columns = {
			dojoId: {label: '序号'},
			YF: {label: '月份'},
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
			url : basePath + "zhyw/queryntj",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				dcdata = data.data;
				layer.close(loadindex);
				for (var i = 0; i < data.data.length; i++) {
					data.data[i] = dojo.mixin({
						dojoId : i + 1
					}, data.data[i]);
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.data
					}
				});
				yyanGrid.set('collection', store);
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
				postData.stime=$("#yyan-date").val();
				postData.qy=$("#yyan-quyu-comboBox").find('input').val();
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
				if (yyanGrid) { yyanGrid = null; dojo.empty('yyanTable') }
				yyanGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyanTable');

				addEventComboBox('#s3Panel');
				$("#yyan-date").val(new Date().getFullYear());
				$("#yyan-date").click(function () {
						WdatePicker({
							dateFmt: 'yyyy'
						});
					});
				//公司
				/*早高峰*/
				query('#yyan-zgf').on('click', function () {
					sjdid=1;
					_self.get();
				});
				/*晚高峰*/
				query('#yyan-wgf').on('click', function () {
					sjdid=2;
					_self.get();
				});
				/*全天*/
				query('#yyan-qt').on('click', function () {
					sjdid=5;
					_self.get();
				});
				/*晚间*/
				query('#yyan-yj').on('click', function () {
					sjdid=4;
					_self.get();
				});
				/*白天*/
				query('#yyan-bt').on('click', function () {
					sjdid=3;
					_self.get();
				});
				/*凌晨*/
				query('#yyan-lc').on('click', function () {
					sjdid=6;
					_self.get();
				});
				/*导出*/
				query('#yyan-dc').on('click', function () {
					if(dcdata.length==0){
						layer.msg('无查询数据！');return;
					}
					var sheetHeader=["序号","月份","时间段","区域","总营运次数(次)","车辆总数(辆)","营运车辆数(辆)","总行驶里程(公里)","载客行驶里程(公里)","空驶里程(公里)","总营收金额(元)","等候时间(分钟)","营运时长(小时)","周转次数(次/辆)","平均营收(元/辆)","平均行驶速度(公里/小时)","平均营运时长(小时/辆)","平均等候时间(分/辆)","上路率"];
					var sheetData=[];
					for (var i = 0; i <dcdata.length ; i++) {
						var item = dcdata[i];
						var data={};
						data.c1=item.dojoId;
						data.c2=item.YF;
						data.c3=item.SJD;
						data.c4=item.QY;
						data.c5=item.RYYCS;
						data.c6=item.CLZS;
						data.c7=item.RYYCL;
						data.c8=item.RZLC;
						data.c9=item.RZKLC;
						data.c10=item.RKSLC;
						data.c11=item.RYSJE;
						data.c12=item.DHSJ;
						data.c13=item.RYYSC;
						data.c14=item.ZZCS;
						data.c15=item.PJYS;
						data.c16=item.PJXSSD;
						data.c17=item.PJYYSC;
						data.c18=item.PJDHSJ;
						data.c19=item.SLL;
						sheetData.push(data);
					}
					_self.toExcel(sheetHeader,sheetData,'交易时段统计(按年'+$("#yyan-date").val()+')');


					// var postData = {};
					// postData.stime=$("#yyan-date").val();
					// postData.qy=$("#yyan-quyu-comboBox").find('input').val();
					// postData.sjd=sjdid;
					// url = basePath + "zhyw/ntj_daochu?postData="
          //    		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});