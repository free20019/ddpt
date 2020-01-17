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
		var skjycxGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			ZDBH: {label: '终端编号'},
			YYZGFWZ: {label: '营运资格服务证'},
			CH: {label: '车号'},
			SCSJ: {label: '上车时间'},
			XCSJ: {label: '下车时间'},
			JC: {label: '计程'},
			DHSJ: {label: '等候时间(秒)'},
			JYJE: {label: '交易金额(元)'},
			KS: {label: '空驶'},
			JSSJ: {label: '接收时间'},
			KYE: {label: '卡原额'},
			CSDM: {label: '城市代码'},
			WYDM: {label: '唯一代码'},
			KLSH: {label: '卡留水号'},
			BLW: {label: '保留位'},
			ZDJYLSH: {label: '终端交易流水号'},
			JYLX: {label: '交易类型'},
			KLX: {label: '卡类型'},
			QBLJJYCX: {label: '钱包累计交易次数'},
			QYSJ: {label: '启用时间'},
			CQSJ: {label: '存钱时间'},
			TJYRZM: {label: 'TAC交易认证码'},
			POSJH: {label: 'POS机号'},
			QYH: {label: '企业号'}
		};
		var xhrArgsTabel = {
			url : basePath + "kb/querycl",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
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
				skjycxGrid.totalCount = data.count;
				skjycxGrid.set('collection', store);
				skjycxGrid.pagination.refresh(data.data.length);
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
				if (skjycxGrid) { skjycxGrid = null; dojo.empty('skjycxTabel') }
				skjycxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'skjycxTabel');

				// query('#skjycxPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#skjycxPanel');

				query('#skjycx-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#skjycx-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#skjycx-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
			}
		})
	});