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
		var zdlxbGrid = null, store = null;

		var columns = {
			checkbox: {label: '选择', renderCell: function (item) {
				var div = dc.create('div', {});
				dc.place(dc.create('input', {type: 'checkbox', name: 'tableCheckBox', id: item.id}), div);
				return div;
			}},
			dojoId: {label: '序号'},
			ZDLXMC: {label: '终端类型名称'},
			ZS: {label: '总数'},
			BZ: {label: '备注'}
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
				zdlxbGrid.totalCount = data.count;
				zdlxbGrid.set('collection', store);
				zdlxbGrid.pagination.refresh(data.data.length);
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
				if (zdlxbGrid) { zdlxbGrid = null; dojo.empty('zdlxbTabel') }
				zdlxbGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'zdlxbTabel');

				query('#zdlxbAdd').on('click', function() {
					zdlxbDialogPanel.set('href', 'app/html/czchtgl/editor/zdlxbEditor.html');
					zdlxbDialog.show().then(function () {
						zdlxbDialog.set('title', '新增终端类型');
						/*query('.iFComboBox').on('click', function () {
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
					})
				});
				query('#zdlxbUpd').on('click', function() {
					zdlxbDialogPanel.set('href', 'app/html/czchtgl/editor/zdlxbEditor.html');
					zdlxbDialog.show().then(function () {
						zdlxbDialog.set('title', '编辑终端类型');
						/*query('.iFComboBox').on('click', function () {
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
					})
				});
			}
		})
	});