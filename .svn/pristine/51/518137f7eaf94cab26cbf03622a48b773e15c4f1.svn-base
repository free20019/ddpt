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
		var jyjcGrid = null, store = null;
		var queryCondition={},	settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			FGS:{label:'公司名称'},
			CPHM: {label: '车牌号码'},
			JYJC: {label: '交易计程(公里)'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryjyjc",
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
				jyjcGrid.totalCount = data.count;
				jyjcGrid.set('collection', store);
				jyjcGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#jyjc-startTime").val();
				queryCondition.etime=$("#jyjc-endTime").val();
				queryCondition.cp=$("#jyjc-cphm-comboBox").find('input').val();
				queryCondition.fh=$("#jyjc-jyjc-comboBox").find('input').val();
				queryCondition.cs = $("#jyjc-jc").val();
				loadindex = layer.load(1);
				pageii = new Pagination(jyjcGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'jyjcTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (jyjcGrid) { jyjcGrid = null; dojo.empty('jyjcTabel') }
				jyjcGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jyjcTabel');

				$("#jyjc-startTime").val(GetDateStr(0));
				$("#jyjc-endTime").val(GetDateStr(0));
				
				/*query('#jyjcPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#jyjcPanel');

				query('#jyjc-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#jyjc-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#jyjc-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				$("#jyjc-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#jyjc-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#jyjc-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#jyjc-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#jyjc-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#jyjc-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#jyjc-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#jyjcQuery').on('click', function () {
					if(isNaN($("#jyjc-jc").val())){
						$("#czjg").html("交易计程请输入正确的数字！");
						dijit.byId('qd_dialog').show();
					}else{
						pageii.queryCondition.stime=$("#jyjc-startTime").val();
						pageii.queryCondition.etime=$("#jyjc-endTime").val();
						pageii.queryCondition.cp=$("#jyjc-cphm-comboBox").find('input').val();
						pageii.queryCondition.fh=$("#jyjc-jyjc-comboBox").find('input').val();
						pageii.queryCondition.cs = $("#jyjc-jc").val();
						loadindex = layer.load(1);
						pageii.first();
					}
				});
				//导出
				query('#jyjcDaochu').on('click', function () {
					if(isNaN($("#jyjc-jc").val())){
						$("#czjg").html("交易计程请输入正确的数字！");
						dijit.byId('qd_dialog').show();
					}else{
						var postData = {};
						postData.stime=$("#jyjc-startTime").val();
						postData.etime=$("#jyjc-endTime").val();
						postData.cp=$("#jyjc-cphm-comboBox").find('input').val();
						postData.fh=$("#jyjc-jyjc-comboBox").find('input').val();
						postData.cs = $("#jyjc-jc").val();
						url = basePath + "zhyw/jyjc_daochu?postData="
	             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
					}
				});
			}
		})
	});