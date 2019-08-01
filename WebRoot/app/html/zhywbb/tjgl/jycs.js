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
		var jycsGrid = null, store = null;
		var queryCondition={},	settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			FGS:{label:'公司名称'},
			CP: {label: '车牌号码'},
			JYCS: {label: '交易次数'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryjycs",
			 postData: 'postData={"page":1,"pageSize":50}',
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
				jycsGrid.totalCount = data.count;
				jycsGrid.set('collection', store);
				jycsGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#jycs-startTime").val();
				queryCondition.etime=$("#jycs-endTime").val();
				queryCondition.cp=$("#jycs-cphm-comboBox").find('input').val();
				queryCondition.fh='';//$("#jycs-jycs-comboBox").find('input').val();
				queryCondition.mincs = $("#jycs-mincs").val();
				queryCondition.maxcs = $("#jycs-maxcs").val();
				loadindex = layer.load(1);
				pageii = new Pagination(jycsGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'jycsTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (jycsGrid) { jycsGrid = null; dojo.empty('jycsTabel') }
				jycsGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jycsTabel');

				$("#jycs-startTime").val(GetDateStr(0));
				$("#jycs-endTime").val(GetDateStr(0));
				
				/*query('#jycsPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#jycsPanel');

				query('#jycs-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#jycs-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#jycs-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				$("#jycs-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#jycs-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#jycs-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#jycs-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#jycs-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#jycs-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#jycs-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#jycsQuery').on('click', function () {
					if(isNaN($("#jycs-mincs").val())&&isNaN($("#jycs-maxcs").val())){
						$("#czjg").html("交易次数请输入正确的数字！");
						dijit.byId('qd_dialog').show();
					}else{
						pageii.queryCondition.stime=$("#jycs-startTime").val();
						pageii.queryCondition.etime=$("#jycs-endTime").val();
						pageii.queryCondition.cp=$("#jycs-cphm-comboBox").find('input').val();
						pageii.queryCondition.fh='';//$("#jycs-jycs-comboBox").find('input').val();
						pageii.queryCondition.mincs = $("#jycs-mincs").val();
						pageii.queryCondition.maxcs = $("#jycs-maxcs").val();
						loadindex = layer.load(1);
						pageii.first();
					}
				});
				//导出
				query('#jycsDaochu').on('click', function () {
					if(isNaN($("#jycs-mincs").val())&&isNaN($("#jycs-maxcs").val())){
						$("#czjg").html("交易次数请输入正确的数字！");
						dijit.byId('qd_dialog').show();
					}else{
					var postData = {};
					postData.stime=$("#jycs-startTime").val();
					postData.etime=$("#jycs-endTime").val();
					postData.cp=$("#jycs-cphm-comboBox").find('input').val();
					postData.fh=$("#jycs-jycs-comboBox").find('input').val();
					postData.mincs = $("#jycs-mincs").val();
					postData.maxcs = $("#jycs-maxcs").val();
					url = basePath + "zhyw/jycs_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					}
				});
			}
		})
	});