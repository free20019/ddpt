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
		var fsdtjGrid = null, store = null;

		$("#fsdtj_fsdtj-startTime").val(setformatday(new Date));
		$("#fsdtj_fsdtj-endTime").val(setformatday(new Date));
		var postData = {"stime":$("#fsdtj_fsdtj-startTime").val(),"etime":$("#fsdtj_fsdtj-endTime").val(),
						"z_stime":$("#fsdtj_zgfsj-startTime").val(),"z_etime":$("#fsdtj_zgfsj-endTime").val(),
						"w_stime":$("#fsdtj_wgfsj-startTime").val(),"w_etime":$("#fsdtj_wgfsj-endTime").val(),
						"wgf_stime":$("#fsdtj_wugfsj-startTime").val(),"wgf_etime":$("#fsdtj_wugfsj-endTime").val(),
						"t_stime":$("#fsdtj_txsj-startTime").val(),"t_etime":$("#fsdtj_txsj-endTime").val(),
						"zdy_stime":$("#fsdtj_zdysj-startTime").val(),"zdy_etime":$("#fsdtj_zdysj-endTime").val()};
		var xhrArgs = {
				url : basePath + "form/fsdtj",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
					$("#fsdtj-zgfSuccess").val(data.zgfcg);
					$("#fsdtj-zgfNoth").val(data.zgfsb);
					$("#fsdtj-wugfSuccess").val(data.wgfcg);
					$("#fsdtj-wugfNoth").val(data.wgfsb);
					$("#fsdtj-wgfSuccess").val(data.wgfcg1);
					$("#fsdtj-wgfNoth").val(data.wgfsb1);
					$("#fsdtj-txSuccess").val(data.txcg);
					$("#fsdtj-txNoth").val(data.txsb);
					$("#fsdtj-zdysjSuccess").val(data.zdycg);
					$("#fsdtj-zdysjNoth").val(data.zdysb);
				},
			};
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
				query('#fsdtjQuery').on('click', function () {
//					var srq = new Date($("#fsdtj_fsdtj-startTime").val());
//					var erq = new Date($("#fsdtj_fsdtj-endTime").val());
//					if(srq.getFullYear()!=erq.getFullYear()){
//						layer.msg('不能跨年查询');
//						return;
//					}
//					if(srq.getMonth()!=erq.getMonth()){
//						layer.msg('不能跨月查询');
//						return;
//					}
					postData = {"stime":$("#fsdtj_fsdtj-startTime").val(),"etime":$("#fsdtj_fsdtj-endTime").val(),
							"z_stime":$("#fsdtj_zgfsj-startTime").val(),"z_etime":$("#fsdtj_zgfsj-endTime").val(),
							"w_stime":$("#fsdtj_wgfsj-startTime").val(),"w_etime":$("#fsdtj_wgfsj-endTime").val(),
							"wgf_stime":$("#fsdtj_wugfsj-startTime").val(),"wgf_etime":$("#fsdtj_wugfsj-endTime").val(),
							"t_stime":$("#fsdtj_txsj-startTime").val(),"t_etime":$("#fsdtj_txsj-endTime").val(),
							"zdy_stime":$("#fsdtj_zdysj-startTime").val(),"zdy_etime":$("#fsdtj_zdysj-endTime").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				/*时间控件*/
				query('#fsdtj_fsdtj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#fsdtj_fsdtj-endTime').trigger('focus')
						},
						dateFmt: STATEDATE,
						maxDate:'%y-%M-%d'
					});
				});
				query('#fsdtj_fsdtj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE, minDate: '#F{$dp.$D(\'fsdtj_fsdtj-startTime\')}',
						maxDate:'%y-%M-%d'});
				});
				query('#fsdtj_zgfsj-startTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
				query('#fsdtj_zgfsj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
				query('#fsdtj_wgfsj-startTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
				query('#fsdtj_wgfsj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
				query('#fsdtj_wugfsj-startTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
				query('#fsdtj_wugfsj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
				query('#fsdtj_zdysj-startTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
				query('#fsdtj_zdysj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATETIMEHM});
				});
			}
		})
	});