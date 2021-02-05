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
		var yytsGrid = null, store = null,queryCondition={};
		var settime;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			YF: {label: '月份'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CPHM: {label: '车牌号码'},
			YYTS: {label: '营运天数'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryyyts",
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
				yytsGrid.totalCount = data.count;
				yytsGrid.set('collection', store);
				yytsGrid.pagination.refresh(data.data.length);
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
				queryCondition.yf=$("#yyts-mon").val();
				queryCondition.qy=$("#yyts-quyu-comboBox").find('input').val();   
				queryCondition.gs=$("#yyts-company-comboBox").find('input').val();	 
				queryCondition.cp=$("#yyts-cphm-comboBox").find('input').val();
//				queryCondition.cllx=$("#yyts-cllx-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(yytsGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'yytsTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (yytsGrid) { yytsGrid = null; dojo.empty('yytsTabel') }
				yytsGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yytsTabel');

				$("#yyts-mon").val(setformat_month(new Date()));
				
				addEventComboBox('#yytsPanel');

				query('#yyts-mon').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});
				
				//公司
				findgs().then(function(data){
					$("#yyts-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#yyts-company-comboBox").find('.iFList').append(gss);
					}
					$('#ycsjcx-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#ycsjcx-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#ycsjcx-company-comboBox').find('input').trigger('change');
					});
					$("#yyts-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#yyts-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#yyts-cphm-comboBox").find('.iFList').html("");
							findcphm($("#yyts-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyts-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#yyts-company-comboBox").find('input').val()).then(function(data2){
								$("#yyts-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#yyts-company-comboBox").find('.iFList').append(gss);
								}
								$('#yyts-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyts-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyts-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#yyts-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#yyts-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#yyts-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#yyts-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#yyts-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#yyts-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#yyts-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#yytsQuery').on('click', function () {
					
					pageii.queryCondition.yf=$("#yyts-mon").val();
					pageii.queryCondition.qy=$("#yyts-quyu-comboBox").find('input').val();   					
					pageii.queryCondition.gs=$("#yyts-company-comboBox").find('input').val();	 
					pageii.queryCondition.cp=$("#yyts-cphm-comboBox").find('input').val();
//					pageii.queryCondition.cllx=$("#yyts-cllx-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#yytsDaochu').on('click', function () {
					var postData = {};
					postData.yf=$("#yyts-mon").val();
					postData.qy=$("#yyts-quyu-comboBox").find('input').val();   
					postData.gs=$("#yyts-company-comboBox").find('input').val();	 
					postData.cp=$("#yyts-cphm-comboBox").find('input').val();
//					postData.cllx=$("#yyts-cllx-comboBox").find('input').val();
						url = basePath + "zhyw/yyts_daochu?postData="
                 		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});