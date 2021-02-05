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
		var hwlybGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			TIME: {label: '时间'},
			DDYC: {label: '电话约车'},
			AXSD: {label: '爱心调度人工'},
			AXZD: {label: '爱心调度自动'},
			ZXTS: {label: '咨询投诉'},
			ZJ: {label: '合计'}
		};
		$("#hwlyb-startTime").val(setformat_month(new Date()));
		var postData = {"stime":$("#hwlyb-startTime").val()};
		var xhrArgs = {
				url : basePath + "form/hwlyb",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
					unloading();
						for(var i=0; i<data.length;  i++){
					    	data[i] = dojo.mixin({ dojoId: i+1 }, data[i]);
					    }
						store = new Memory({ data: {
							identifier: 'dojoId',
							label: 'dojoId',
							items: data
						} });
						hwlybGrid.set('collection',store);
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				hwlybGrid = new CustomGrid({
				   					columns : columns
				   				}, "hwlybTabel");
				dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
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
				loading('#hwlybTabel');
				query('#hwlybQuery').on('click', function () {
					loading('#hwlybTabel');
					postData = {"stime":$("#hwlyb-startTime").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#hwlybexcel').on('click', function() {
					var postData = {"stime":$("#hwlyb-startTime").val()};
						url = "form/hwlybexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				addEventComboBox('#hwlybPanel');

				/*时间控件*/
				query('#hwlyb-startTime').on('focus', function () {
					WdatePicker({
						dateFmt: STATEYM,
						maxDate:'%y-%M'
					});
				});
			}
		})
	});