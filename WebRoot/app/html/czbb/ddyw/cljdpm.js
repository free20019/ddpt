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
		var cljdpmGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			VEHI_NO: {label: '车牌号码'},
			VSIM_NUM: {label: '虚拟网号'},
			CS: {label: '次数'},
			COMP_NAME: {label: '所属公司'}
		};
		$("#cljdpm-startTime").val(setformat2(new Date));
		$("#cljdpm-endTime").val(setformat1(new Date));
		var postData = {"stime":$("#cljdpm-startTime").val(),"etime":$("#cljdpm-endTime").val()};
		var xhrArgs = {
				url : basePath + "form/cljdpm",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
					var zs = 0;
						for(var i=0; i<data.length;  i++){
							zs += parseInt(data[i].CS);
					    	data[i] = dojo.mixin({ dojoId: i+1 }, data[i]);
					    }
						store = new Memory({ data: {
							identifier: 'dojoId',
							label: 'dojoId',
							items: data
						} });
						cljdpmGrid.set('collection',store);
						if(zs>0){
							$("#cljdpm-zs").text("车辆接单总数:"+zs+"单");
						}else{
							$("#cljdpm-zs").text("")
						}
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				cljdpmGrid = new CustomGrid({
				   					columns : columns
				   				}, "cljdpmTabel");
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
				query('#cljdpmQuery').on('click', function () {
//					var srq = new Date($("#cljdpm-startTime").val());
//					var erq = new Date($("#cljdpm-endTime").val());
//					if(srq.getFullYear()!=erq.getFullYear()){
//						layer.msg('不能跨年查询');
//						return;
//					}
//					if(srq.getMonth()!=erq.getMonth()){
//						layer.msg('不能跨月查询');
//						return;
//					}
					postData = {"stime":$("#cljdpm-startTime").val(),"etime":$("#cljdpm-endTime").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#cljdpmexcel').on('click', function() {
					var postData = {"stime":$("#cljdpm-startTime").val(),"etime":$("#cljdpm-endTime").val()};
						url = "form/cljdpmexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*时间控件*/
				query('#cljdpm-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#cljdpm-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME,
						maxDate:'%y-%M-%d %H:%m:%s'
					});
				});
				query('#cljdpm-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME, minDate: '#F{$dp.$D(\'cljdpm-startTime\')}',
						maxDate:'%y-%M-%d %H:%m:%s'});
				});
			}
		})
	});