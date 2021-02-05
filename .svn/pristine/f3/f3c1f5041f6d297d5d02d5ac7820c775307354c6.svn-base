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
		var ysmzclGrid = null, store = null,queryCondition={};
		var	settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			VEHICLENUM: {label: '车牌号码'},
			SJ: {label: '当日时间'},
			CAOZUO: {label: '操作'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryysmzcl",
			 postData: 'postData={"page":1,"pageSize":50}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				layer.close(loadindex);
				for (var i = 0; i < data.datas.length; i++) {
					data.datas[i] = dojo.mixin({
//						CAOZUO : '<a href="javascript:void(0);" class="iFBtn iFColorOrange" id="ysmzclQuery">查询</a>',
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
				ysmzclGrid.totalCount = data.count;
				ysmzclGrid.set('collection', store);
				ysmzclGrid.pagination.refresh(data.datas.length);
			},
			error : function(error) {
				layer.close(loadindex);
				console.log(error);
			}
		};
		dojo.connect(dojo.byId('yst_1'),'dblclick', function () {
			fireNavItem('5次/日同点')
		});
	    dojo.connect(dojo.byId('ysj_1'),'dblclick', function () {
	        fireNavItem('10分钟以上停留')
	    });
	    dojo.connect(dojo.byId('ysb_1'),'dblclick', function () {
	        fireNavItem('3日同点位')
	    });
	
		var pageii;
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				queryCondition.stime=$("#ysmzcl-startTime").val();
				queryCondition.etime=$("#ysmzcl-endTime").val();
				queryCondition.cp=$("#ysmzcl-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(ysmzclGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'ysmzclTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (ysmzclGrid) { ysmzclGrid = null; dojo.empty('ysmzclTabel') }
				ysmzclGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'ysmzclTabel');

				$("#ysmzcl-startTime").val(GetDateStr(0));
				$("#ysmzcl-endTime").val(GetDateStr(0));
				
				addEventComboBox('#ysmzclPanel');

				query('#ysmzcl-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#ysmzcl-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#ysmzcl-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				$("#ysmzcl-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#ysmzcl-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#ysmzcl-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#ysmzcl-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#ysmzcl-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#ysmzcl-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#ysmzcl-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#ysmzclQuery').on('click', function () {
					pageii.queryCondition.stime=$("#ysmzcl-startTime").val();
					pageii.queryCondition.etime=$("#ysmzcl-endTime").val();
					pageii.queryCondition.cp=$("#ysmzcl-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#ysmzclDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#ysmzcl-startTime").val();
					postData.etime=$("#ysmzcl-endTime").val();
					postData.cp=$("#ysmzcl-cphm-comboBox").find('input').val();
					url = basePath + "zhyw/ysmzcl_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});
	function fireNavItem(title){
//		dojo.query('.dgrid-content .dgrid-row').forEach(function(item,index){
//			console.log("11111111111111=",item.getElementsByClassName("dgrid-cell dgrid-column-CAOZUO field-CAOZUO")[0])
//			item.getElementsByClassName("dgrid-cell dgrid-column-CAOZUO field-CAOZUO")[0].html("12312312	w");
//		});
	    dojo.query('.MZCPanel .nevItem_l3').forEach(function(item,index){
		    if(item.innerText == title){
//		    	item.click();
		    	item.getElementsByTagName("a")[0].click()
		    }
	})}