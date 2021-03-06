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
		var gsbbtjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			BA_NAME: {label: '公司'},
			COMP_NAME: {label: '分公司'},
			C: {label: '报警车辆'},
			ZCS: {label: '总报警次数'},
			ZSBJ: {label: '真实报警次数'},
			AD_CAR_NO: {label: '真实报警车牌号'},
			WBJ: {label: '误报警次数'}
		};
		
		var xhrArgsTabel = {
			url : basePath + "OA/gsbbtj",
			postData : 'postData={"page":1,"pageSize":30}',
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				console.log(data)
				layer.closeAll('loading');
				var jls=0,zcs=0,zsbj=0,wbj=0;
				for (var i = 0; i < data.length; i++) {
					jls += data[i].C;
					zcs += data[i].ZCS;
					zsbj += data[i].ZSBJ;
					wbj += data[i].WBJ;
					data[i] = dojo.mixin({
						dojoId : i + 1
					}, data[i]);
				}
				$('.gsbbtj-bjcl').html('共'+jls);
				$('.gsbbtj-zbjs').html('共'+zcs);
				$('.gsbbtj-zsbj').html('共'+zsbj);
				$('.gsbbtj-wbj').html('共'+wbj);
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data
					}
				});
				gsbbtjGrid.totalCount = 0;
				gsbbtjGrid.set('collection', store);
				gsbbtjGrid.pagination.refresh(0);
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
				if (gsbbtjGrid) { gsbbtjGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'gsbbtjTabels', innerHTML:"" },'gsbbtjTabel');
				gsbbtjGrid = new CustomGrid({
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "gsbbtjTabels");
				pageii = new Pagination(gsbbtjGrid,xhrArgsTabel,{"stime":$("#gsbbtj-startTime").val(),"etime":$("#gsbbtj-endTime").val()},30);
				dc.place(pageii.first(),'gsbbtjTabels','after');
				$("#gsbbtjTabel").find('.pagination').hide();
				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {},
			initToolBar:function(){
				addEventComboBox('#gsbbtjPanel');
				var _self = this;
				query('#gsbbtjQuery').on('click', function() {
					var srq = new Date($("#gsbbtj-startTime").val());
					var erq = new Date($("#gsbbtj-endTime").val());
					if(srq.getFullYear()!=erq.getFullYear()){
						layer.msg('不能跨年查询');
						return;
					}
					if(srq.getMonth()!=erq.getMonth()){
						layer.msg('不能跨月查询');
						return;
					}
					layer.load(1);
					if (gsbbtjGrid) { gsbbtjGrid.destroy(); }//dojo.destroy('zdbTabel');
	                dojo.create("div", {id:'gsbbtjTabels', innerHTML:"" },'gsbbtjTabel');
					gsbbtjGrid = new CustomGrid({
						totalCount : 0,
						pagination:null,
						columns : columns
					}, "gsbbtjTabels");
					pageii = new Pagination(gsbbtjGrid,xhrArgsTabel,{"stime":$("#gsbbtj-startTime").val(),"etime":$("#gsbbtj-endTime").val()},30);
					dc.place(pageii.first(),'gsbbtjTabels','after');
					$("#gsbbtjTabel").find('.pagination').hide();
				});
				query('#gsbbtj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#gsbbtj-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#gsbbtj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});
				query('#gsbbtj-dcsj').on('click', function() {
					var postData = {
							"stime":$("#gsbbtj-startTime").val(),"etime":$("#gsbbtj-endTime").val()
						};
						url = "OA/gsbbtjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
			}
		})
	});