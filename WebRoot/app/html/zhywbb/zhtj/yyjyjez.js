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
		var yyjyjezGrid = null, store = null,queryCondition={};
		var settime;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CH: {label: '车牌号码'},
			XJJYJE: {label: '现金交易金额'},
			SKJYJE: {label: '刷卡交易金额'},
			YYJYJE: {label: '营运交易金额'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryyyjyjez",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
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
				yyjyjezGrid.totalCount = data.count;
				yyjyjezGrid.set('collection', store);
				yyjyjezGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#yyjyjez-startTime").val();
				queryCondition.etime=$("#yyjyjez-endTime").val();
				queryCondition.qy=$("#yyjyjez-quyu-comboBox").find('input').val();   
				queryCondition.gs=$("#yyjyjez-company-comboBox").find('input').val();	 
				queryCondition.cp=$("#yyjyjez-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(yyjyjezGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'yyjyjezTabel','after');
				
			},
			initToolBar:function(){
				var _self = this;
				if (yyjyjezGrid) { yyjyjezGrid = null; dojo.empty('yyjyjezTabel') }
				yyjyjezGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyjyjezTabel');

				$("#yyjyjez-startTime").val(GetDateStr(0));
				$("#yyjyjez-endTime").val(GetDateStr(0));
				
				/*query('#yyjyjezPanel .iFComboBox').on('click', function () {
					var thisOne = this;
					if ($(this).hasClass('selected')) {
						$(this).removeClass('selected');
					} else {
						$(this).addClass('selected');
						$(this).find('.iFList').on('click', function () {
							event.stopPropagation();
						}).find('li').off('click').on('click', function () {
							$(this).addClass('selected').siblings('.selected').removeClass('selected');
							$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
							$(thisOne).find('input').trigger('change');
						});
					}
				});*/
				addEventComboBox('#yyjyjezPanel');

				query('#yyjyjez-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyjyjez-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#yyjyjez-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				//公司
				findgs().then(function(data){
					$("#yyjyjez-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#yyjyjez-company-comboBox").find('.iFList').append(gss);
					}
					$('#yyjyjez-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#yyjyjez-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#yyjyjez-company-comboBox').find('input').trigger('change');
					});
					$("#yyjyjez-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#yyjyjez-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#yyjyjez-cphm-comboBox").find('.iFList').html("");
							findcphm($("#yyjyjez-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjyjez-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#yyjyjez-company-comboBox").find('input').val()).then(function(data2){
								$("#yyjyjez-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#yyjyjez-company-comboBox").find('.iFList').append(gss);
								}
								$('#yyjyjez-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjyjez-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjyjez-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#yyjyjez-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#yyjyjez-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#yyjyjez-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjyjez-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#yyjyjez-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjyjez-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjyjez-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#yyjyjezQuery').on('click', function () {
					pageii.queryCondition.stime=$("#yyjyjez-startTime").val();
					pageii.queryCondition.etime=$("#yyjyjez-endTime").val();
					pageii.queryCondition.qy=$("#yyjyjez-quyu-comboBox").find('input').val();   					
					pageii.queryCondition.gs=$("#yyjyjez-company-comboBox").find('input').val();	 
					pageii.queryCondition.cp=$("#yyjyjez-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#yyjyjezDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#yyjyjez-startTime").val();
					postData.etime=$("#yyjyjez-endTime").val();
					postData.qy=$("#yyjyjez-quyu-comboBox").find('input').val();   
					postData.gs=$("#yyjyjez-company-comboBox").find('input').val();	 
					postData.cp=$("#yyjyjez-cphm-comboBox").find('input').val();
						url = basePath + "zhyw/yyjyjez_daochu?postData="
                 		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});