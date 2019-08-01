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
		var yyybGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			TIME: {label: '日期'},
			REPORE_VHIC: {label: '参与营运车辆'},
			REPORE_NO: {label: '营运总次数'},
			REPORE_VHICNO: {label: '车辆总数'},
			REPORE_TURNOVER: {label: '平均周转次数'},
			REPORE_RADE: {label: '平均上路率'},
			REPORE_AMOUNT_REVENUE: {label: '平均营收金额'},
			REPORE_ACTUAL_LOADING: {label: '平均实载率'},
			REPORE_CAR_TIME: {label: '平均出车时间(分钟)'},
			REPROE_REVENUE_TIME: {label: '平均重车时间(分钟)'},
			REPORE_WAIT_TIME: {label: '平均等候时间(分钟)'},
			REPORE_MILEAGE: {label: '平均总里程(公里)'},
			REPORE_ACTUAL_MILEAGE: {label: '平均实载里程(公里)'},
			REPORE_EMPTY_MILEAGE: {label: '平均空驶里程(公里)'},
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/yyyb",
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
				yyybGrid.totalCount = data.count;
				yyybGrid.set('collection', store);
				yyybGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#yyyb-startTime").val();
				queryCondition.etime=$("#yyyb-endTime").val();
				queryCondition.gs=$("#yyyb-company-comboBox").find('input').val();
				loadindex=layer.load(1);
				pageii = new Pagination(yyybGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'yyybTabel','after');
			},
			initToolBar:function(){
				
				var _self = this;
				if (yyybGrid) { yyybGrid = null; dojo.empty('yyybTabel') }
				yyybGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyybTabel');
				$("#yyyb-startTime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*2)));
				$("#yyyb-endTime").val(setformat1(new Date()));
				
				addEventComboBox('#yyybPanel');

				query('#yyyb-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyyb-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#yyyb-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				
				//公司
				findgs().then(function(data){
					$("#yyyb-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#yyyb-company-comboBox").find('.iFList').append(gss);
					}
					$('#yyyb-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#yyyb-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#yyyb-company-comboBox').find('input').trigger('change');
					});
					$("#yyyb-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#yyyb-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#yyyb-cphm-comboBox").find('.iFList').html("");
							findcphm($("#yyyb-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyyb-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#yyyb-company-comboBox").find('input').val()).then(function(data2){
								$("#yyyb-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#yyyb-company-comboBox").find('.iFList').append(gss);
								}
								$('#yyyb-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyyb-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyyb-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				query('#yyybQuery').on('click', function () {
					pageii.queryCondition.stime=$("#yyyb-startTime").val();
					pageii.queryCondition.etime=$("#yyyb-endTime").val();
					pageii.queryCondition.gs=$("#yyyb-company-comboBox").find('input').val();
					var yjlx="";
					$("input[name='yyybchk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					});
					pageii.queryCondition.yjlx=yjlx;
					loadindex=layer.load(1);
					pageii.first();
				});
				//导出
				query('#yyybDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#yyyb-startTime").val();
					postData.etime=$("#yyyb-endTime").val();
					postData.gs=$("#yyyb-company-comboBox").find('input').val();	 
					var yjlx="";
					$("input[name='yyybchk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					})
					postData.yjlx=yjlx;
					url = basePath + "zhyw/yyyb_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
                 		
				});
				
				
				
			}
		})
	});