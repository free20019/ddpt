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
		var jjrzdfxGrid = null, store = null;
		var columns = {
			dojoId: {label: '序号'},
			H_YEAR: {label: '年份'},
			RIQI: {label: '日期'},
			ONLINE_RATE: {label: '在线率'},
			EMPTY_RATE: {label: '重车率'},
			LOAD_RATE: {label: '空车率'}
		};
		var postData = {"jr_name":"全部","owner_name":"春节"};
		var xhrArgs = {
				url : basePath + "form/jjrzdfx",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
					var clzs = 0;
						for(var i=0; i<data.length;  i++){
							clzs+= parseInt(data[i].NUMS);
					    	data[i] = dojo.mixin({ dojoId: i+1 }, data[i]);
					    }
						store = new Memory({ data: {
							identifier: 'dojoId',
							label: 'dojoId',
							items: data
						} });
						jjrzdfxGrid.set('collection',store);
						if(clzs>0){
							$("#jjrzdfx-clzs").text("车辆总数为:"+clzs+"辆")
						}else{
							$("#jjrzdfx-clzs").text("")
						}
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				jjrzdfxGrid = new CustomGrid({
				   					columns : columns
				   				}, "jjrzdfxTabel");
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
				query('#jjrzdfxQuery').on('click', function () {
					postData = {"jr_name":$("#jjrzdfx-gs").val(),"owner_name":$("#jjrzdfx-qk").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#jjrzdfxexcel').on('click', function() {
					var postData = {"jr_name":$("#jjrzdfx-gs").val(),"owner_name":$("#jjrzdfx-qk").val()};
						url = "form/jjrzdfxexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*下拉框*/
				 query('#jjrzdfxPanel .iFComboBox').on('click', function () {
				 	var thisOne = this;
				 	if ($(this).hasClass('selected')) {
				 		$(this).removeClass('selected');
				 	} else {
				 		$(this).addClass('selected');
				 		$(this).find('.iFList').on('click', function () {
				 			if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
				 		}).find('li').off('click').on('click', function () {
				 			$(this).addClass('selected').siblings('.selected').removeClass('selected');
				 			$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				 			$(thisOne).find('input').trigger('change');
				 		});
				 	}
				 });
				addEventComboBox('#jjrzdfxPanel');

			}
		})
	});