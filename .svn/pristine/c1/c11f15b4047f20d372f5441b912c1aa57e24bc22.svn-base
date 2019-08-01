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
		var jysjhzGrid = null, store = null,queryCondition={};
		var	settime=null;
		var loadindex=null;
		var columns = {
			dojoId: {label: '序号'},
			QY:{label:'区域'},
			FGS:{label:'公司名称'},
			CP: {label: '车牌号码'},
			JYCS: {label: '交易次数'},
			JYJE: {label: '交易金额'},
			JYJC: {label: '交易计程(公里)'},
			JYKS: {label: '交易空驶(公里)'},
			JYDDSJ: {label: '交易等待时间(分钟)'},
			JYYYSJ: {label: '交易营运时间(分钟)'}
		};
		var xhrArgsTabel = {
			url : basePath + "zhyw/queryjysjhz",
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
				jysjhzGrid.totalCount = data.count;
				jysjhzGrid.set('collection', store);
				jysjhzGrid.pagination.refresh(data.data.length);
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
				queryCondition.stime=$("#jysjhz-startTime").val();
				queryCondition.etime=$("#jysjhz-endTime").val();
				queryCondition.qy=$("#jysjhz-quyu-comboBox").find('input').val();   
				queryCondition.cp=$("#jysjhz-cphm-comboBox").find('input').val();
				loadindex = layer.load(1);
				pageii = new Pagination(jysjhzGrid,xhrArgsTabel,queryCondition,50);
				dc.place(pageii.first(),'jysjhzTabel','after');
			},
			initToolBar:function(){
				var _self = this;
				if (jysjhzGrid) { jysjhzGrid = null; dojo.empty('jysjhzTabel') }
				jysjhzGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'jysjhzTabel');

				$("#jysjhz-startTime").val(GetDateStr(0));
				$("#jysjhz-endTime").val(GetDateStr(0));
				
				/*query('#jysjhzPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#jysjhzPanel');

				query('#jysjhz-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#jysjhz-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#jysjhz-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				
				$("#jysjhz-cphm-comboBox").find('input').on('keyup',function(){
					//车牌
					clearTimeout(settime);
					settime = setTimeout(function() {
						var cpmhs=$("#jysjhz-cphm-comboBox").find('input').val();
						if(cpmhs.length>2){
							findcphm2(cpmhs).then(function(data2){
								$("#jysjhz-cphm-comboBox").find('.iFList').html("");
								for (var i = 0; i < data2.length; i++) {
									var cphms="<li data-value='"+data2[i].CPHM+"'>"+data2[i].CPHM+"</li>";
									$("#jysjhz-cphm-comboBox").find('.iFList').append(cphms);
								}
								$('#jysjhz-cphm-comboBox').find('.iFList').on('click', function () {
									event.stopPropagation();
								}).find('li').off('click').on('click', function () {
									$(this).addClass('selected').siblings('.selected').removeClass('selected');
									$("#jysjhz-cphm-comboBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									$('#jysjhz-cphm-comboBox').find('input').trigger('change');
								});
							});
						}
					}, 1200)
				})
				
				query('#jysjhzQuery').on('click', function () {
					pageii.queryCondition.stime=$("#jysjhz-startTime").val();
					pageii.queryCondition.etime=$("#jysjhz-endTime").val();
					pageii.queryCondition.qy=$("#jysjhz-quyu-comboBox").find('input').val();   //$("#clxjjy-quyu-comboBox").find('input').data('value')==undefined?"":$("#clxjjy-quyu-comboBox").find('input').data('value');
					pageii.queryCondition.cp=$("#jysjhz-cphm-comboBox").find('input').val();
					loadindex = layer.load(1);
					pageii.first();
				});
				//导出
				query('#jysjhzDaochu').on('click', function () {
					var postData = {};
					postData.stime=$("#jysjhz-startTime").val();
					postData.etime=$("#jysjhz-endTime").val();
					postData.cp=$("#jysjhz-cphm-comboBox").find('input').val();
					postData.qy=$("#jysjhz-quyu-comboBox").find('input').val();
					url = basePath + "zhyw/jysjhz_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
			}
		})
	});