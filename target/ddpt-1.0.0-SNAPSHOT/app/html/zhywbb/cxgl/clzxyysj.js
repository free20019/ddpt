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
		var clzxyysjGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CPHM: {label: '车号'},
			SHANGCHE: {label: '最新营运交易时间', formatter:util.formatYYYYMMDDHHMISS}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryclzxyysj",
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
				clzxyysjGrid.totalCount = data.count;
				clzxyysjGrid.set('collection', store);
				clzxyysjGrid.pagination.refresh(data.data.length);
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
				
				queryCondition.qy=$("#clzxyysj-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
				queryCondition.gs=$("#clzxyysj-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
				queryCondition.cp=$("#clzxyysj-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(clzxyysjGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'clzxyysjTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (clzxyysjGrid) { clzxyysjGrid = null; dojo.empty('clzxyysjTabel') }
				clzxyysjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'clzxyysjTabel');

				addEventComboBox('#clzxyysjPanel');
				
				//公司
				findgs().then(function(data){
					$("#clzxyysj-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#clzxyysj-company-comboBox").find('.iFList').append(gss);
					}
					$('#clzxyysj-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#clzxyysj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#clzxyysj-company-comboBox').find('input').trigger('change');
					});
					$("#clzxyysj-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#clzxyysj-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#clzxyysj-cphm-comboBox").find('.iFList').html("");
							findcphm($("#clzxyysj-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clzxyysj-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#clzxyysj-company-comboBox").find('input').val()).then(function(data2){
								$("#clzxyysj-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#clzxyysj-company-comboBox").find('.iFList').append(gss);
								}
								$('#clzxyysj-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clzxyysj-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clzxyysj-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#clzxyysj-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#clzxyysj-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#clzxyysj-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clzxyysj-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#clzxyysj-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clzxyysj-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clzxyysj-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#clzxyysjQuery').on('click', function () {
					pageii.queryCondition.qy=$("#clzxyysj-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					pageii.queryCondition.gs=$("#clzxyysj-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					pageii.queryCondition.cp=$("#clzxyysj-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#clzxyysjDaochu').on('click', function () {
					var postData = {};
					
					postData.qy=$("#clzxyysj-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					postData.gs=$("#clzxyysj-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					postData.cp=$("#clzxyysj-cphm-comboBox").find('input').val();
					url = basePath + "zhyw/clzxyysj_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});