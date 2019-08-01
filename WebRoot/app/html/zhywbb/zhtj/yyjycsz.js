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
		var yyjycszGrid = null, store = null,queryCondition={};
		var settime;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CH: {label: '车牌号码'},
			XJJYCS: {label: '现金交易次数'},
			SKJYCS: {label: '刷卡交易次数'},
			YYJYCS: {label: '营运交易次数'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryyyjycsz",
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
				yyjycszGrid.totalCount = data.count;
				yyjycszGrid.set('collection', store);
				yyjycszGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#yyjycsz-startTime").val();
				queryCondition.etime=$("#yyjycsz-endTime").val();
				queryCondition.qy=$("#yyjycsz-quyu-comboBox").find('input').val();   
				queryCondition.gs=$("#yyjycsz-company-comboBox").find('input').val();	 
				queryCondition.cp=$("#yyjycsz-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(yyjycszGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'yyjycszTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (yyjycszGrid) { yyjycszGrid = null; dojo.empty('yyjycszTabel') }
				yyjycszGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyjycszTabel');

				$("#yyjycsz-startTime").val(GetDateStr(0));
				$("#yyjycsz-endTime").val(GetDateStr(0));
				
				/*query('#yyjycszPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#yyjycszPanel');

				query('#yyjycsz-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyjycsz-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#yyjycsz-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				//公司
				findgs().then(function(data){
					$("#yyjycsz-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#yyjycsz-company-comboBox").find('.iFList').append(gss);
					}
					$('#ycsjcx-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#ycsjcx-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#ycsjcx-company-comboBox').find('input').trigger('change');
					});
					$("#yyjycsz-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#yyjycsz-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#yyjycsz-cphm-comboBox").find('.iFList').html("");
							findcphm($("#yyjycsz-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjycsz-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#yyjycsz-company-comboBox").find('input').val()).then(function(data2){
								$("#yyjycsz-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#yyjycsz-company-comboBox").find('.iFList').append(gss);
								}
								$('#yyjycsz-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjycsz-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjycsz-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#yyjycsz-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#yyjycsz-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#yyjycsz-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyjycsz-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#yyjycsz-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyjycsz-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyjycsz-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#yyjycszQuery').on('click', function () {
					
					pageii.queryCondition.stime=$("#yyjycsz-startTime").val();
					pageii.queryCondition.etime=$("#yyjycsz-endTime").val();
					pageii.queryCondition.qy=$("#yyjycsz-quyu-comboBox").find('input').val();   					
					pageii.queryCondition.gs=$("#yyjycsz-company-comboBox").find('input').val();	 
					pageii.queryCondition.cp=$("#yyjycsz-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#yyjycszDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#yyjycsz-startTime").val();
					postData.etime=$("#yyjycsz-endTime").val();
					postData.qy=$("#yyjycsz-quyu-comboBox").find('input').val();   
					postData.gs=$("#yyjycsz-company-comboBox").find('input').val();	 
					postData.cp=$("#yyjycsz-cphm-comboBox").find('input').val();
						url = basePath + "zhyw/yyjycsz_daochu?postData="
                 		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});