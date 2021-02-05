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
		var yyjyjczGrid = null, store = null,queryCondition={};
		var settime;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '	区域'},
			FGS: {label: '公司'},
			CH: {label: '车牌号码'},
			XJJYJC: {label: '现金交易计程(公里)'},
			SKJYJC: {label: '刷卡交易计程(公里)'},
			YYJYJC: {label: '营运交易计程(公里)'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryyyjyjcz",
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
				yyjyjczGrid.totalCount = data.count;
				yyjyjczGrid.set('collection', store);
				yyjyjczGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#yyjyjcz-startTime").val();
				queryCondition.etime=$("#yyjyjcz-endTime").val();
				queryCondition.qy=$("#yyjyjcz-quyu-comboBox").find('input').val();   
				queryCondition.gs=$("#yyjyjcz-company-comboBox").find('input').val();	 
				queryCondition.cp=$("#yyjyjcz-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(yyjyjczGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'yyjyjczTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (yyjyjczGrid) { yyjyjczGrid = null; dojo.empty('yyjyjczTabel') }
				yyjyjczGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyjyjczTabel');

				$("#yyjyjcz-startTime").val(GetDateStr(0));
				$("#yyjyjcz-endTime").val(GetDateStr(0));
				
				/*query('#yyjyjczPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#yyjyjczPanel');

				query('#yyjyjcz-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyjyjcz-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#yyjyjcz-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				//公司
				findgs().then(function(data){
					$("#yyjyjcz-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#yyjyjcz-company-comboBox").find('.iFList').append(gss);
					}
					$('#yyjyjcz-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#yyjyjcz-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#yyjyjcz-company-comboBox').find('input').trigger('change');
					});
					$("#yyjyjcz-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#yyjyjcz-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#yyjyjcz-cphm-comboBox").find('.iFList').html("");
							findcphm($("#yyjyjcz-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjyjcz-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#yyjyjcz-company-comboBox").find('input').val()).then(function(data2){
								$("#yyjyjcz-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#yyjyjcz-company-comboBox").find('.iFList').append(gss);
								}
								$('#yyjyjcz-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjyjcz-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjyjcz-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#yyjyjcz-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#yyjyjcz-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#yyjyjcz-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjyjcz-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#yyjyjcz-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjyjcz-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjyjcz-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#yyjyjczQuery').on('click', function () {
					pageii.queryCondition.stime=$("#yyjyjcz-startTime").val();
					pageii.queryCondition.etime=$("#yyjyjcz-endTime").val();
					pageii.queryCondition.qy=$("#yyjyjcz-quyu-comboBox").find('input').val();   					
					pageii.queryCondition.gs=$("#yyjyjcz-company-comboBox").find('input').val();	 
					pageii.queryCondition.cp=$("#yyjyjcz-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#yyjyjczDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#yyjyjcz-startTime").val();
					postData.etime=$("#yyjyjcz-endTime").val();
					postData.qy=$("#yyjyjcz-quyu-comboBox").find('input').val();   
					postData.gs=$("#yyjyjcz-company-comboBox").find('input').val();	 
					postData.cp=$("#yyjyjcz-cphm-comboBox").find('input').val();
						url = basePath + "zhyw/yyjyjcz_daochu?postData="
                 		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});