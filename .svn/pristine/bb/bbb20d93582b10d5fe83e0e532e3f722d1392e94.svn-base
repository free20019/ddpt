define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
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
		var zxcxGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			CS_TELNUM: {label: '来电号码'},
			CS_CLIENT: {label: '客户姓名'},
			CS_DEALDATETIME: {label: '处理时间'},
			CS_STATE: {label: '处理状态'},
			CS_TYPE: {label: '处理类型'},
			CS_TSLX: {label: '投诉类型'},
			CS_WORKERNUM: {label: '处理工号'},
			CS_VEHIID: {label: '车牌号码'},
			CS_MEMO: {label: '服务内容'},
			CS_OBJECT: {label: '处理对象'},
			COMPANY: {label: '公司名称'}
		};
		var xhrArgsTabel = {
				url : basePath + "kb/queryzx",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					unloading();
					for (var i = 0; i < data.length; i++) {
						data[i] = dojo.mixin({
							dojoId : i + 1
						}, data[i]);
					}
					store = new Memory({
						data : {
							identifier : 'dojoId',
							label : 'dojoId',
							items : data
						}
					});
					zxcxGrid.totalCount = data.length;
					zxcxGrid.set('collection', store);
					$("#zxts").html(data.length);
				},
				error : function(error) {
					console.log(error);
				}
			};
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				var _self = this;
				if (zxcxGrid) { zxcxGrid = null; dojo.empty('zxcxTabel') }
				zxcxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, "zxcxTabel");
				
				// query('#zxhtml .iFComboBox').on('click', function () {
				// 	var thisOne = this;
				// 	if ($(this).hasClass('selected')) {
				// 		$(this).removeClass('selected');
				// 	} else {
				// 		$(this).addClass('selected');
				// 		$(this).find('.iFList').on('click', function () {
				// 			event.stopPropagation();
				// 		}).find('li').off('click').on('click', function () {
				// 			$(this).addClass('selected').siblings('.selected').removeClass('selected');
				// 			$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				// 			$(thisOne).find('input').trigger('change');
				// 		});
				// 	}
				// });
				addEventComboBox('#zxhtml');
				$("#zxstime").val(setformat1(new Date(new Date().getTime() - 1000 * 60 * 60*2)));
				$("#zxetime").val(setformat1(new Date()));
				
				
				query('#zxcxbtn').on('click', function () {
						var postData = {};
						postData.cldx=$("#zxcldx-comboBox").find('input').val();
						postData.comp=$("#zxcomp").val();
						postData.lddh=$("#zxlddh").val();
						postData.cxgjz=$("#zxcxgjz").val();
						postData.cllx=$("#zxcllx-comboBox").find('input').val();
						postData.gh=$("#zxgh").val();
						postData.clzt=$("#zxclzt-comboBox").find('input').val();
						postData.stime=$("#zxstime").val();
						postData.etime=$("#zxetime").val();
						loading('#zxcxTabel');
						dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				
				query('#zxcxdaochubtn').on('click', function () {
					var postData = {};
					postData.cldx=$("#zxcldx-comboBox").find('input').val();
					postData.comp=$("#zxcomp").val();
					postData.lddh=$("#zxlddh").val();
					postData.cxgjz=$("#zxcxgjz").val();
					postData.cllx=$("#zxcllx-comboBox").find('input').val();
					postData.clzt=$("#zxclzt-comboBox").find('input').val();
					postData.gh=$("#zxgh").val();
					postData.stime=$("#zxstime").val();
					postData.etime=$("#zxetime").val();
					url = basePath + "kb/queryzx_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
			}
		})
	});