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
		var jqrqdclGrid = null, store = null,queryCondition={};
		var	settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			VEHICLENUM: {label: '车牌号码'},
			RATIO: {label: '景区内GPS点占比'},
			YYCS: {label: '当日营运次数'},
			DHSJ: {label: '当日等候时长/分钟'},
			SJ: {label: '当日时间'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryjqrqdcl",
			 postData: 'postData={"page":1,"pageSize":50}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				layer.close(loadindex);
				for (var i = 0; i < data.datas.length; i++) {
					data.datas[i] = dojo.mixin({
						dojoId : i + 1
					}, data.datas[i]);
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.datas
					}
				});
				jqrqdclGrid.totalCount = data.count;
				jqrqdclGrid.set('collection', store);
				jqrqdclGrid.pagination.refresh(data.datas.length);
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
				queryCondition.stime=$("#jqrqdcl-startTime").val();
				queryCondition.etime=$("#jqrqdcl-endTime").val();
				queryCondition.cp=$("#jqrqdcl-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(jqrqdclGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'jqrqdclTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (jqrqdclGrid) { jqrqdclGrid = null; dojo.empty('jqrqdclTabel') }
				jqrqdclGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jqrqdclTabel');

				$("#jqrqdcl-startTime").val(GetDateStr(0));
				$("#jqrqdcl-endTime").val(GetDateStr(0));
				
				addEventComboBox('#jqrqdclPanel');

				query('#jqrqdcl-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#jqrqdcl-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#jqrqdcl-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				$("#jqrqdcl-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#jqrqdcl-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#jqrqdcl-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#jqrqdcl-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#jqrqdcl-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#jqrqdcl-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#jqrqdcl-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#jqrqdclQuery').on('click', function () {
					if($("#jqrqdcl-startTime").val()==""||$("#jqrqdcl-endTime").val()==""||$("#jqrqdcl-startTime").val().substring(0,7)!=$("#jqrqdcl-endTime").val().substring(0,7)){
						layer.msg("无法跨月查询");
						return ;
					}
					pageii.queryCondition.stime=$("#jqrqdcl-startTime").val();
					pageii.queryCondition.etime=$("#jqrqdcl-endTime").val();
					pageii.queryCondition.cp=$("#jqrqdcl-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#jqrqdclDaochu').on('click', function () {
					if($("#jqrqdcl-startTime").val()==""||$("#jqrqdcl-endTime").val()==""||$("#jqrqdcl-startTime").val().substring(0,7)!=$("#jqrqdcl-endTime").val().substring(0,7)){
						layer.msg("无法跨月查询");
						return ;
					}
					var postData = {};
					postData.stime=$("#jqrqdcl-startTime").val();
					postData.etime=$("#jqrqdcl-endTime").val();
					postData.cp=$("#jqrqdcl-cphm-comboBox").find('input').val();
					url = basePath + "zhyw/jqrqdcl_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});