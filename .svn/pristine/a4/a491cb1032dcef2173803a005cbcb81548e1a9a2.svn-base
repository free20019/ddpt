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
	  	var CustomGrid = declare([Grid, Selection, DijitRegistry, Editor, ColumnResizer]);
		var bbtjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			BA_NAME: {label: '公司'},
			COMP_NAME: {label: '分公司'},
			VEHI_NO: {label: '报警车辆'},
			ZCS: {label: '总报警次数'},
			ZSBJ: {label: '真实报警次数'},
			WBJ: {label: '误报警次数'}
		};
		
		var xhrArgsTabel = {
			url : basePath + "OA/bbtj",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				layer.closeAll('loading');
				var jls=data.length,zcs=0,zsbj=0,wbj=0;
				for (var i = 0; i < data.length; i++) {
					zcs += data[i].ZCS;
					zsbj += data[i].ZSBJ;
					wbj += data[i].WBJ;
					data[i] = dojo.mixin({
						dojoId : i + 1
					}, data[i]);
				}
				$('.bbtj-bjcl').html('共'+jls);
				$('.bbtj-zbjs').html('共'+zcs);
				$('.bbtj-zsbj').html('共'+zsbj);
				$('.bbtj-wbj').html('共'+wbj);
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data
					}
				});
				bbtjGrid.totalCount = 0;
				bbtjGrid.set('collection', store);
				bbtjGrid.pagination.refresh(0);
			},
			error : function(error) {
				layer.closeAll('loading');
				console.log(error);
			}
		};
		var pageii = null;	
		return declare( null,{
			constructor:function(){
				layer.load(1);
				this.initToolBar();
				if (bbtjGrid) { bbtjGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'bbtjTabels', innerHTML:"" },'bbtjTabel');
				bbtjGrid = new CustomGrid({
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "bbtjTabels");
				pageii = new Pagination(bbtjGrid,xhrArgsTabel,{"stime":$("#bbtj-startTime").val(),"etime":$("#bbtj-endTime").val()},30);
				dc.place(pageii.first(),'bbtjTabels','after');
				$("#bbtjTabel").find('.pagination').hide();
				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				addEventComboBox('#bbtjPanel');
				var _self = this;
				query('#bbtjQuery').on('click', function() {
					var srq = new Date($("#bbtj-startTime").val());
					var erq = new Date($("#bbtj-endTime").val());
					if(srq.getFullYear()!=erq.getFullYear()){
						layer.msg('不能跨年查询');
						return;
					}
					if(srq.getMonth()!=erq.getMonth()){
						layer.msg('不能跨月查询');
						return;
					}
					layer.load(1);
					if (bbtjGrid) { bbtjGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'bbtjTabels', innerHTML:"" },'bbtjTabel');
					bbtjGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "bbtjTabels");
					pageii = new Pagination(bbtjGrid,xhrArgsTabel,{"stime":$("#bbtj-startTime").val(),"etime":$("#bbtj-endTime").val()},30);
					dc.place(pageii.first(),'bbtjTabels','after');
					$("#bbtjTabel").find('.pagination').hide();
				});
				query('#bbtj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#bbtj-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#bbtj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				query('#bbtj-dcsj').on('click', function() {
					var postData = {
							"stime":$("#bbtj-startTime").val(),"etime":$("#bbtj-endTime").val()
						};
						url = "OA/bbtjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});