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
		var jjrqyGrid = null, store = null;
		var sjdid=1;
		var settime=null;
		var loadindex=null;
		var dcdata=[];
		var columns = {
			dojoId: {label: '序号'},
			JJR: {label: '节假日'},
			YF: {label: '日期'},
			SJD: {label: '时间段'},
			AREA_NAME: {label: '区域'},
			RUN_TIMES: {label: '总营运次数(次)'},
			RUN_PROFIT: {label: '总营收金额(元)'},
			AVG_PROFIT: {label: '平均营收(元/辆)'},
			NO_LOAD_MILEAGE: {label: '平均空载里程'},
			AVG_TIMES: {label: '平均周转次数'},
			LOAD_MILEAGE: {label: '平均载客里程'},
			LOAD_TIME: {label: '平均载客时长'}

			// RYYCL: {label: '营运车辆数(辆)'},
			// RKSLC: {label: '空驶里程(公里)'},
			// DHSJ: {label: '等候时间(分钟)'},
			// RYYSC: {label: '营运时长(小时)'},
			// ZZCS: {label: '周转次数(次/辆)'},
			// PJXSSD: {label: '平均行驶速度(公里/小时)'},
			// PJYYSC: {label: '平均营运时长(小时/辆)'},
			// PJDHSJ: {label: '平均等候时间(分/辆)'},
			// SLL: {label: '上路率'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryjjrqy",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				console.log(data);
				layer.close(loadindex);
				for (var i = 0; i < data.length; i++) {
					data[i] = dojo.mixin({
						dojoId : i + 1
					}, data[i]);
					if(data[i].MARK=='1'){
						data[i].JJR = data[i].H_NAME+'(正)';
					}else{
						data[i].JJR = data[i].H_NAME;
					}
					if(data[i].TYPE=='1'){
						data[i].SJD='全天';
					}else if(data[i].TYPE=='2'){
						data[i].SJD='早高峰(07:00-09:00)';
					}else if(data[i].TYPE=='3'){
						data[i].SJD='晚高峰(16:30-18:30)';
					}
					data[i].YF = util.formatYYYYMMDD(data[i].H_DATE);
				}
				dcdata = data;
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data
					}
				});
				jjrqyGrid.set('collection', store);
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
				if($("#jjrqy-quyu-comboBox").find('input').data('value')==''){
					layer.msg('请选择重点区域');
				}
				loadindex = layer.load(1);
				var postData = {};
				postData.jjr=$("#jjrqy-jr-comboBox").find('input').val();
				postData.qy=$("#jjrqy-quyu-comboBox").find('input').data('value');
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
				if (jjrqyGrid) { jjrqyGrid = null; dojo.empty('jjrqyTable') }
				jjrqyGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jjrqyTable');

				setTimeout(function(){


				addEventComboBox('#s3Panel');
				/*早高峰*/
				query('#jjrqy-zgf').on('click', function () {
					sjdid=2;
					_self.get();
				});
				/*晚高峰*/
				query('#jjrqy-wgf').on('click', function () {
					sjdid=3;
					_self.get();
				});
				/*全天*/
				query('#jjrqy-qt').on('click', function () {
					sjdid=1;
					_self.get();
				});
				/*重点区域*/
				findKeyArea().then(function (data) {
					$("#jjrqy-quyu-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].AREA_ID+"'>"+data[i].AREA_NAME+"</li>";
						$("#jjrqy-quyu-comboBox").find('.iFList').append(gss);
					}

					$('#jjrqy-quyu-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#jjrqy-quyu-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
					});
				});

				/*导出*/
				query('#jjrqy-dc').on('click', function () {
					if(dcdata.length==0){
						layer.msg('无查询数据！');return;
					}
					var sheetHeader=["序号","节假日","日期","时间段","区域","总营运次数(次)","总营收金额(元)","平均营收(元/辆)","平均空载里程","平均周转次数","平均载客里程","平均载客时长"];
					var sheetData=[];
					for (var i = 0; i <dcdata.length ; i++) {
						var item = dcdata[i];
						var data={};
						data.c1=item.dojoId;
						data.c2=item.JJR;
						data.c3=item.YF;
						data.c4=item.SJD;
						data.c5=item.AREA_NAME;
						data.c6=item.RUN_TIMES;
						data.c7=item.RUN_PROFIT;
						data.c8=item.AVG_PROFIT;
						data.c9=item.NO_LOAD_MILEAGE;
						data.c10=item.AVG_TIMES;
						data.c11=item.LOAD_MILEAGE;
						data.c12=item.LOAD_TIME;
						sheetData.push(data);
					}
					_self.toExcel(sheetHeader,sheetData,'重点区域车辆营运数据(节假日)');

				});
				},0);
			}
		})
	});