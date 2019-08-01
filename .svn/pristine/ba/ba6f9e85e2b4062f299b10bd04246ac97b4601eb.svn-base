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
		var clxjjyGrid = null, store = null;
		var queryCondition={},settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			JIAOYITYPE: {label: '营运类型'},
			QY: {label: '区域'},
			FGS: {label: '公司'},
			CPHM: {label: '车号'},
			SIM: {label: '终端编号'},
			YINGYUN: {label: '营运资格服务证'},
			SHANGCHE: {label: '上车时间', formatter:util.formatYYYYMMDDHHMISS},
			XIACHE: {label: '下车时间', formatter:util.formatYYYYMMDDHHMISS},
			JICHENG: {label: '计程(公里)'},
			DENGHOU: {label: '等候时间'},
			JINE: {label: '交易金额'},
			KONGSHI: {label: '空驶(公里)'},
			ZHONGXINTIME: {label: '接收时间', formatter:util.formatYYYYMMDDHHMISS}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryclxjjy",
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
				clxjjyGrid.totalCount = data.count;
				clxjjyGrid.set('collection', store);
				clxjjyGrid.pagination.refresh(data.data.length);
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
				
				queryCondition.stime=$("#clxjjy-startTime").val();
				queryCondition.etime=$("#clxjjy-endTime").val();
				queryCondition.qy=$("#clxjjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
				queryCondition.gs=$("#clxjjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
				queryCondition.cp=$("#clxjjy-cphm-comboBox").find('input').val();
				loadindex=layer.load(1);
				pageii = new Pagination(clxjjyGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'clxjjyTabel','after');
			},
			initToolBar:function(){
				
				var _self = this;
				if (clxjjyGrid) { clxjjyGrid = null; dojo.empty('clxjjyTabel') }
				clxjjyGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'clxjjyTabel');
				$("#clxjjy-startTime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*2)));
				$("#clxjjy-endTime").val(setformat1(new Date()));
				
				addEventComboBox('#clxjjyPanel');

				query('#clxjjy-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#clxjjy-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#clxjjy-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				
				//公司
				findgs().then(function(data){
					$("#clxjjy-company-comboBox").find('.iFList').html("");
					for (var i = 0; i < data.length; i++) {
						var gss="<li data-value='"+data[i].COMP_NAME+"'>"+data[i].COMP_NAME+"</li>";
						$("#clxjjy-company-comboBox").find('.iFList').append(gss);
					}
					$('#clxjjy-company-comboBox').find('.iFList').on('click', function () {
						event.stopPropagation();
					}).find('li').off('click').on('click', function () {
						$(this).addClass('selected').siblings('.selected').removeClass('selected');
						$("#clxjjy-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
						$('#clxjjy-company-comboBox').find('input').trigger('change');
					});
					$("#clxjjy-company-comboBox").find('input').on('change',function(){
						//sim卡
						if($("#clxjjy-company-comboBox").find('input').data('value')!=""){
						//车牌
							$("#clxjjy-cphm-comboBox").find('.iFList').html("");
							findcphm($("#clxjjy-company-comboBox").find('input').data('value')).then(function(data2){
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clxjjy-cphm-comboBox").find('.iFList').append(cphms);
								}
							});
						}
					}).on('keyup',function(){
						clearTimeout(settime);
						settime = setTimeout(function() {
							findgs2($("#clxjjy-company-comboBox").find('input').val()).then(function(data2){
								$("#clxjjy-company-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var gss="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].COMP_NAME+"</li>";
									$("#clxjjy-company-comboBox").find('.iFList').append(gss);
								}
								$('#clxjjy-company-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clxjjy-company-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clxjjy-company-comboBox').find('input').trigger('change');
								});
							});
						}, 1200)
					});
				});
				$("#clxjjy-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#clxjjy-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#clxjjy-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#clxjjy-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#clxjjy-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#clxjjy-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#clxjjy-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#clxjjyQuery').on('click', function () {
					
					pageii.queryCondition.stime=$("#clxjjy-startTime").val();
					pageii.queryCondition.etime=$("#clxjjy-endTime").val();
					pageii.queryCondition.qy=$("#clxjjy-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					pageii.queryCondition.gs=$("#clxjjy-company-comboBox").find('input').val();	 //$("#clxjjy-company-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-company-comboBox").find('input').data('value');
					pageii.queryCondition.cp=$("#clxjjy-cphm-comboBox").find('input').val();
					var yjlx="";
					$("input[name='clxjjychk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					});
					pageii.queryCondition.yjlx=yjlx;
					loadindex=layer.load(1);
					pageii.first();
				});
				//导出
				query('#clxjjyDaochu').on('click', function () {
					var postData = {};
					
					postData.stime=$("#clxjjy-startTime").val();
					postData.etime=$("#clxjjy-endTime").val();
					postData.qy=$("#clxjjy-quyu-comboBox").find('input').val();   
					postData.gs=$("#clxjjy-company-comboBox").find('input').val();	 
					postData.cp=$("#clxjjy-cphm-comboBox").find('input').val();
					var yjlx="";
					$("input[name='clxjjychk']:checked").each(function(){
						yjlx+=$(this).val()+",";
					})
					postData.yjlx=yjlx;
					url = basePath + "zhyw/clxjjy_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
                 		
				});
				
				
				
			}
		})
	});