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
		var wyycltjGrid = null, store = null;
		loading('#wyycltjTabel');
		var columns = {
			dojoId: {label: '序号'},
			COMP_NAME: {label: '公司名'},
			VEHI_NO: {label: '车牌号码'},
			VEHI_SIM: {label: 'SIM卡号'},
			MT_NAME: {label: '终端类型'},
			MDT_SUB_TYPE: {label: '终端子类型'},
			OWN_NAME: {label: '联系人'},
			OWN_TEL: {label: '联系电话'},
			SHANGCHE: {label: '最后上线时间',formatter : util.formatYYYYMMDDHHMISS}
		};
		$("#wyycltj-startTime").val(setformatday(new Date(new Date().getTime() - 24*60*60*1000)));
		$("#wyycltj-endTime").val(setformatday(new Date(new Date().getTime() - 24*60*60*1000)));
		var postData = {"stime":$("#wyycltj-startTime").val(),"etime":$("#wyycltj-endTime").val(),"comp":$("#wyycl-comp").val(),"cphm":$("#wyycltj-cphm").val()};
		var xhrArgs = {
				url : basePath + "form/wyycl",
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
						wyycltjGrid.set('collection',store);
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				wyycltjGrid = new CustomGrid({
				   					columns : columns
				   				}, "wyycltjTabel");
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
				query('#wyycltjQuery').on('click', function () {
					loading('#wyycltjTabel');
					var postData = {"stime":$("#wyycltj-startTime").val(),"etime":$("#wyycltj-endTime").val(),"comp":$("#wyycl-comp").val(),"cphm":$("#wyycltj-cphm").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#wyycltjexcel').on('click', function() {
					var postData = {"stime":$("#wyycltj-startTime").val(),"etime":$("#wyycltj-endTime").val(),"comp":$("#wyycl-comp").val(),"cphm":$("#wyycltj-cphm").val()};
						url = "form/wyyclexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*下拉框*/
				 query('#wyycltjPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#wyycltjPanel');

				/*时间控件*/
				query('#wyycltj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#wyycltj-endTime').trigger('focus')
						},
						dateFmt: STATEDATE,
						maxDate:'%y-%M-{%d-1}',
						minDate:'2018-04-17'
					});
				});
				query('#wyycltj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE,
						maxDate:'%y-%M-{%d-1}',
						minDate:'2018-04-17'
					});
				});
			}
		})
	});