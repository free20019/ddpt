define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel","dgrid/extensions/CompoundColumns", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 declare, dc, on,ObjectStoreModel, CompoundColumns, Tree, 
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer, CompoundColumns]);
		var hzbGrid = null, store = null,queryCondition={};
		var	settime=null;
		var loadindex=null;
		var columns = [
           {field: 'dojoId', label: '序号'},
           {field: 'VEHICLE_NO', label: '车号'},
           {label: '5次/日同点', children: [
                { field: 'POINTA', label: '点位'},
                { field: 'COUNTA', label: '出现次数'},
                { field: 'TIMEA', label: '累计时长(分钟)'}
           ]},
           {label: '10分钟以上停留/日', children: [
                { field: 'POINTB', label: '点位'},
                { field: 'COUNTB', label: '停留次数'},
                { field: 'TIMEB', label: '累计时长(分钟)'}
           ]},
           {label: '3日同点位', children: [
                { field: 'POINTC', label: '点位'},
                { field: 'COUNTC', label: '次数'},
                { field: '', label: '累计时长(分钟)'}
           ]},
           {label: '轨迹缺失大于30分钟', children: [
                { field: 'COUNTD', label: '缺失次数'},
                { field: '', label: '累计时长(分钟)'}
           ]},
           {label: '景区绕圈的车辆', children: [
                { field: 'RATIO', label: '景区内GPS点占比'},
//			    { field: 'lastname', label: '绕圈点'},
//			    { field: 'lastname', label: '绕圈次数'},
//			    { field: 'lastname', label: '累计时长(分钟)'}
		   ]},
		   {field: 'YYCS', label: '营运次数'},
		   {field: 'DHSJ', label: '等候时长(分钟)'},
		];
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryhzb",
			 postData: 'postData={"page":1,"pageSize":50}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				layer.close(loadindex);
				for (var i = 0; i < data.datas.length; i++) {
					data.datas[i] = dojo.mixin({
//						CAOZUO : '<a href="javascript:void(0);" class="iFBtn iFColorOrange" id="hzbQuery">查询</a>',
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
				hzbGrid.totalCount = data.count;
				hzbGrid.set('collection', store);
				hzbGrid.pagination.refresh(data.datas.length);
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
				queryCondition.time=$("#hzb-time").val();
				queryCondition.cp=$("#hzb-cphm-comboBox").find('input').val();
//				loadindex = layer.load(1);
				pageii = new Pagination(hzbGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'hzbTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (hzbGrid) { hzbGrid = null; dojo.empty('hzbTabel') }
				hzbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'hzbTabel');

				$("#hzb-time").val(GetDateStr(0));
				
				addEventComboBox('#hzbPanel');

				query('#hzb-time').on('focus', function () {
					WdatePicker({
						dateFmt: STATEDATE
					});
				});
				
				$("#hzb-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#hzb-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#hzb-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#hzb-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#hzb-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#hzb-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#hzb-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#hzbQuery').on('click', function () {
					if($("#hzb-time").val()==''){
						layer.msg("请输入日期！！");
						return ;
					}
					pageii.queryCondition.time=$("#hzb-time").val();
					pageii.queryCondition.cp=$("#hzb-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#hzbDaochu').on('click', function () {
					if($("#hzb-time").val()==''){
						layer.msg("请输入日期！！");
						return ;
					}
					var postData = {};
					postData.time=$("#hzb-time").val();
					postData.cp=$("#hzb-cphm-comboBox").find('input').val();
					url = basePath + "zhyw/hzb_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});