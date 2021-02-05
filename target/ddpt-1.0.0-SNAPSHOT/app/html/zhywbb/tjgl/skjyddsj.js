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
		var skjyddsjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			CPHM: {label: '车号'},
			ZXJYSJ: {label: '等待时间'}
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
				skjyddsjGrid.totalCount = data.count;
				skjyddsjGrid.set('collection', store);
				skjyddsjGrid.pagination.refresh(data.data.length);
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
				if (skjyddsjGrid) { skjyddsjGrid = null; dojo.empty('skjyddsjTabel') }
				skjyddsjGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'skjyddsjTabel');

				/*query('#skjyddsjPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#skjyddsjPanel');

				query('#skjyddsj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#skjyddsj-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#skjyddsj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
			}
		})
	});