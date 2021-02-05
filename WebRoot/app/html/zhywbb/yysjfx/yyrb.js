define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
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
		var yyrbGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			DB_TIME: {label: '日期',formatter:util.formatYYYYMMDDHHMISS},//db_time
			RUN_TAXIS: {label: '营运车辆数'},//run_taxis
			COUNT: {label: '车辆总数'},//count
			RUN_TIMES: {label: '周转次数'},//run_times
			RUN_PROFIT: {label: '营收金额(元)'},//run_profit
			ACTUAL_LOAD_RATE: {label: '平均实载率(%)'},//actual_load_rate
			RUN_TIME: {label: '重车时间(分钟)'},//run_time
			WAITTING_TIME: {label: '载客等候时间(分钟)'},//waitting_time
			ACTUAL_LOAD_MILEAGE: {label: '载客里程(公里)',},//actual_load_mileage
			NO_LOAD_MILEAGE: {label: '空驶里程(公里)'},//no_load_mileage
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/yyrb",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				if(data==null){
					alert("链接超时！");
				}
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
				yyrbGrid.totalCount = data.count;
				yyrbGrid.set('collection', store);
				yyrbGrid.pagination.refresh(data.data.length);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};
		
		var pageii;
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				queryCondition.stime=$("#yyrb-startTime").val();
				queryCondition.etime=$("#yyrb-endTime").val();
				queryCondition.gs=$("#yyrb-company-comboBox").find('input').val();
				loadindex=layer.load(1);
				pageii = new Pagination(yyrbGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'yyrbTabel','after');
			},
			initToolBar:function(){
				
				var _self = this;
				if (yyrbGrid) { yyrbGrid = null; dojo.empty('yyrbTabel') }
				yyrbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyrbTabel');
				$("#yyrb-startTime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*2)));
				$("#yyrb-endTime").val(setformat1(new Date()));
				
				addEventComboBox('#yyrbPanel');

				query('#yyrb-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyrb-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#yyrb-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				
				//公司
				findgs().then(function(data){
					$("#yyrb-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#yyrb-company-comboBox").find('.iFList').append(gss);
					}
					$('#yyrb-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#yyrb-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#yyrb-company-comboBox').find('input').trigger('change');
					});
					$("#yyrb-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#yyrb-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#yyrb-cphm-comboBox").find('.iFList').html("");
							findcphm($("#yyrb-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyrb-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#yyrb-company-comboBox").find('input').val()).then(function(data2){
								$("#yyrb-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#yyrb-company-comboBox").find('.iFList').append(gss);
								}
								$('#yyrb-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyrb-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyrb-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				query('#yyrbQuery').on('click', function () {
					pageii.queryCondition.stime=$("#yyrb-startTime").val();
					pageii.queryCondition.etime=$("#yyrb-endTime").val();
					pageii.queryCondition.gs=$("#yyrb-company-comboBox").find('input').val();
					var yjlx="";
					$("input[name='yyrbchk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					});
					pageii.queryCondition.yjlx=yjlx;
					loadindex=layer.load(1);
					pageii.first();
				});
				//导出
				query('#yyrbDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#yyrb-startTime").val();
					postData.etime=$("#yyrb-endTime").val();
					postData.gs=$("#yyrb-company-comboBox").find('input').val();	 
					var yjlx="";
					$("input[name='yyrbchk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					})
					postData.yjlx=yjlx;
					url = basePath + "zhyw/yyrb_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
                 		
				});
				
				
				
			}
		})
	});