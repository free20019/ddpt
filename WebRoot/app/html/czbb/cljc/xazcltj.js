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
		var xazcltjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			COMP_NAME: {label: '公司名'},
			VEHI_NO: {label: '车号'},
			SIM_NUM: {label: 'SIM卡号'},
			OWN_NAME: {label: '联系人'},
			OWN_TEL: {label: '联系电话'},
			MTN_TIME: {label: '安装时间',formatter : util.formatYYYYMMDDHHMISS}
		};
		$("#xazcltj-startTime").val(setformatday(new Date));
		$("#xazcltj-endTime").val(setformatday(new Date));
		var postData = {"stime":$("#xazcltj-startTime").val(),"etime":$("#xazcltj-endTime").val()};
		var xhrArgs = {
				url : basePath + "form/xzcltj",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
					console.log(data)
					unloading();
						for(var i=0; i<data.length;  i++){
					    	data[i] = dojo.mixin({ dojoId: i+1 }, data[i]);
					    }
						store = new Memory({ data: {
							identifier: 'dojoId',
							label: 'dojoId',
							items: data
						} });
						wsxcltjGrid.set('collection',store);
						if(data.length>0){
							$("#xazcltj-clzs").text("车辆总数为:"+data.length+"辆")
						}else{
							$("#xazcltj-clzs").text("")
						}
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				wsxcltjGrid = new CustomGrid({
				   					columns : columns
				   				}, "xazcltjTabel");
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
				var _self = this;
				query('#xazcltjQuery').on('click', function () {
					loading('#xazcltjTabel');
					var postData = {"stime":$("#xazcltj-startTime").val(),"etime":$("#xazcltj-endTime").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#xazcltjexcel').on('click', function() {
					var postData = {"stime":$("#xazcltj-startTime").val(),"etime":$("#xazcltj-endTime").val()};
						url = "form/xzcltjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*时间控件*/
				query('#xazcltj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#xazcltj-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#xazcltj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE, minDate: '#F{$dp.$D(\'xazcltj-startTime\')}'});
				});
			}
		})
	});