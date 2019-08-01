define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
		"dijit/form/DateTextBox", "dijit/form/TimeTextBox",
		"dijit/form/SimpleTextarea", "dijit/form/Select",
		"dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
		"dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
		"dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
		"dojo/store/Memory","cbtree/model/TreeStoreModel",
		"dstore/Memory","dijit/form/NumberTextBox",
		"dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
		'dstore/Trackable', 'dgrid/Selector',
		"dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
		"cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
	function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
			 SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
			 Pagination, Selection, Keyboard, ColumnResizer,
			 Memory2,TreeStoreModel,
			 Memory,NumberTextBox, DijitRegistry, registry, domStyle,
			 Trackable, Selector,
			 declare, dc, on,ObjectStoreModel, Tree,
			 ForestStoreModel, ItemFileWriteStore, query, util) {
		var CustomGrid = declare([Grid, Keyboard, Selection, DijitRegistry, Editor, ColumnResizer, Selector]);
		var yyjycfcszGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			GS: {label: '公司'},
			CH: {label: '车号'},
			SIMHM: {label: 'SIM号码'},
			XJJYZTS: {label: '现金交易总条数'},
			YCCGTS: {label: '一次成功条数'},
			LCCGTS: {label: '两次成功条数'},
			DCCGTS: {label: '多次成功条数'}
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
				yyjycfcszGrid.totalCount = data.count;
				yyjycfcszGrid.set('collection', store);
				yyjycfcszGrid.pagination.refresh(data.data.length);
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
				if (yyjycfcszGrid) { yyjycfcszGrid = null; dojo.empty('yyjycfcszTabel') }
				yyjycfcszGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'yyjycfcszTabel');

				/*query('#yyjycfcszPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#yyjycfcszPanel');

				$('#yyjycfcsz-sjtj input').on('change', function() {
					var value = $(this).data('value');
					var kssj = $('#yyjycfcsz-kssjBox'), jssj = $('#yyjycfcsz-jssjBox'), year = $('#yyjycfcsz-yearBox'), month = $('#yyjycfcsz-monthBox');
					switch (value) {
						case 0:
							kssj.show();jssj.show();year.hide();month.hide();
							break;
						case 1:
							kssj.hide();jssj.hide();year.show();month.show();
							break;
					}
				});
				$('#yyjycfcsz-simhmtj input').on('change', function() {
					var value = $(this).data('value');
					var simhm = $('#yyjycfcsz-simhm'), cphm = $('#yyjycfcsz-cphm'), quyu = $('#yyjycfcsz-quyu'), company = $('#yyjycfcsz-company');
					switch (value) {
						case 0:
							simhm.show();cphm.hide();quyu.hide();company.hide();
							break;
						case 1:
							simhm.hide();cphm.show();quyu.hide();company.hide();
							break;
						case 2:
							simhm.hide();cphm.hide();quyu.show();company.show();
							break;
					}
				});

				query('#yyjycfcsz-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyjycfcsz-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#yyjycfcsz-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				query('#yyjycfcsz-year').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyjycfcsz-month').trigger('focus')
						},
						dateFmt: STATEYEAR
					});
				});
				query('#yyjycfcsz-month').on('focus', function () {
					WdatePicker({dateFmt: STATEMONTH});
				});
			}
		})
	});