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
		var wsxcltjGrid = null, store = null;
		loading('#wsxcltjTabel');
		var columns = {
			dojoId: {label: '序号'},
			COMP_NAME: {label: '公司名'},
			VEHI_NO: {label: '车牌号码'},
			VEHI_SIM: {label: 'SIM卡号'},
			MT_NAME: {label: '终端类型'},
			MDT_SUB_TYPE: {label: '终端子类型'},
			OWN_NAME: {label: '联系人'},
			OWN_TEL: {label: '联系电话'},
			ONLINE_TIME: {label: '最后上线时间',formatter : util.formatYYYYMMDDHHMISS}
		};
		$("#wsxcltj-startTime").val(setformatday(new Date(new Date().getTime() - 24*60*60*1000)));
		$("#wsxcltj-endTime").val(setformatday(new Date(new Date().getTime() - 24*60*60*1000)));
		var postData = {"stime":$("#wsxcltj-startTime").val(),"etime":$("#wsxcltj-endTime").val(),"comp":$("#wsxcl-comp").val()};
		var xhrArgs = {
				url : basePath + "form/wsxcl",
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
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				wsxcltjGrid = new CustomGrid({
				   					columns : columns
				   				}, "wsxcltjTabel");
				dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {
			},
			initToolBar:function(){
				var _self = this;
				query('#wsxcltjQuery').on('click', function () {
					loading('#wsxcltjTabel');
					var postData = {"stime":$("#wsxcltj-startTime").val(),"etime":$("#wsxcltj-endTime").val(),"comp":$("#wsxcl-comp").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#wsxcltjexcel').on('click', function() {
					var postData = {"stime":$("#wsxcltj-startTime").val(),"etime":$("#wsxcltj-endTime").val(),"comp":$("#wsxcl-comp").val()};
						url = "form/wsxclexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*下拉框*/
				 query('#wsxcltjPanel .iFComboBox').on('click', function () {
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
				 });
				addEventComboBox('#wsxcltjPanel');

				/*时间控件*/
				query('#wsxcltj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#wsxcltj-endTime').trigger('focus')
						},
						dateFmt: STATEDATE,
						maxDate:'%y-%M-{%d-1}'
					});
				});
				query('#wsxcltj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE,
						maxDate:'%y-%M-{%d-1}'});
				});
			}
		})
	});