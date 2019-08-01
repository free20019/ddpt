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
		var yyjykszGrid = null, store = null,queryCondition={};
		var settime;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CH: {label: '车牌号码'},
			XJJYKS: {label: '现金交易空驶(公里)'},
			SKJYKS: {label: '刷卡交易空驶(	公里)'},
			YYJYKS: {label: '营运交易空驶(公里)'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryyyjyksz",
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
				yyjykszGrid.totalCount = data.count;
				yyjykszGrid.set('collection', store);
				yyjykszGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#yyjyksz-startTime").val();
				queryCondition.etime=$("#yyjyksz-endTime").val();
				queryCondition.qy=$("#yyjyksz-quyu-comboBox").find('input').val();   
				queryCondition.gs=$("#yyjyksz-company-comboBox").find('input').val();	 
				queryCondition.cp=$("#yyjyksz-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(yyjykszGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'yyjykszTabel','after');
				
			},
			initToolBar:function(){
				var _self = this;
				if (yyjykszGrid) { yyjykszGrid = null; dojo.empty('yyjykszTabel') }
				yyjykszGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyjykszTabel');

				$("#yyjyksz-startTime").val(GetDateStr(0));
				$("#yyjyksz-endTime").val(GetDateStr(0));
				
				/*query('#yyjykszPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#yyjykszPanel');

				query('#yyjyksz-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyjyksz-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#yyjyksz-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				//公司
				findgs().then(function(data){
					$("#yyjyksz-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#yyjyksz-company-comboBox").find('.iFList').append(gss);
					}
					$('#yyjyksz-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#yyjyksz-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#yyjyksz-company-comboBox').find('input').trigger('change');
					});
					$("#yyjyksz-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#yyjyksz-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#yyjyksz-cphm-comboBox").find('.iFList').html("");
							findcphm($("#yyjyksz-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjyksz-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#yyjyksz-company-comboBox").find('input').val()).then(function(data2){
								$("#yyjyksz-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#yyjyksz-company-comboBox").find('.iFList').append(gss);
								}
								$('#yyjyksz-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjyksz-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjyksz-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#yyjyksz-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#yyjyksz-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#yyjyksz-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjyksz-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#yyjyksz-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjyksz-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjyksz-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#yyjykszQuery').on('click', function () {
					pageii.queryCondition.stime=$("#yyjyksz-startTime").val();
					pageii.queryCondition.etime=$("#yyjyksz-endTime").val();
					pageii.queryCondition.qy=$("#yyjyksz-quyu-comboBox").find('input').val();   					
					pageii.queryCondition.gs=$("#yyjyksz-company-comboBox").find('input').val();	 
					pageii.queryCondition.cp=$("#yyjyksz-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#yyjykszDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#yyjyksz-startTime").val();
					postData.etime=$("#yyjyksz-endTime").val();
					postData.qy=$("#yyjyksz-quyu-comboBox").find('input').val();   
					postData.gs=$("#yyjyksz-company-comboBox").find('input').val();	 
					postData.cp=$("#yyjyksz-cphm-comboBox").find('input').val();
						url = basePath + "zhyw/yyjyksz_daochu?postData="
                 		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});