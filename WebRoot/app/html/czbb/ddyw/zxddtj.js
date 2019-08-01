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
		var zxddtjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			DISP_USER: {label: '调度人员'},
			CG: {label: '调度成功次数'},
			ZS: {label: '调度总数'},
			lv: {label: '成功率'}
		};
		$("#zxddtj-startTime").val(setformat2(new Date));
		$("#zxddtj-endTime").val(setformat1(new Date));
		var postData = {"stime":$("#zxddtj-startTime").val(),"etime":$("#zxddtj-endTime").val(),"type":$("#zxddtj-yclx").val()};
		var xhrArgs = {
				url : basePath + "form/zxddtj",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
						for(var i=0; i<data.length;  i++){
					    	data[i] = dojo.mixin({ dojoId: i+1 }, data[i]);
					    }
						store = new Memory({ data: {
							identifier: 'dojoId',
							label: 'dojoId',
							items: data
						} });
						zxddtjGrid.set('collection',store);
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				zxddtjGrid = new CustomGrid({
				   					columns : columns
				   				}, "zxddtjTabel");
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
				query('#zxddtjQuery').on('click', function () {
					postData = {"stime":$("#zxddtj-startTime").val(),"etime":$("#zxddtj-endTime").val(),"type":$("#zxddtj-yclx").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#zxddtjexcel').on('click', function() {
					var postData = {"stime":$("#zxddtj-startTime").val(),"etime":$("#zxddtj-endTime").val(),"type":$("#zxddtj-yclx").val()};
						url = "form/zxddtjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*下拉框*/
				// query('#zxddtjPanel .iFComboBox').on('click', function () {
				// 	var thisOne = this;
				// 	if ($(this).hasClass('selected')) {
				// 		$(this).removeClass('selected');
				// 	} else {
				// 		$(this).addClass('selected');
				// 		$(this).find('.iFList').on('click', function () {
				// 			event.stopPropagation();
				// 		}).find('li').off('click').on('click', function () {
				// 			$(this).addClass('selected').siblings('.selected').removeClass('selected');
				// 			$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				// 			$(thisOne).find('input').trigger('change');
				// 		});
				// 	}
				// });
				addEventComboBox('#zxddtjPanel');

				/*时间控件*/
				query('#zxddtj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#zxddtj-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME,
						maxDate:'%y-%M-%d %H:%m:%s'
					});
				});
				query('#zxddtj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME, minDate: '#F{$dp.$D(\'zxddtj-startTime\')}',
						maxDate:'%y-%M-%d %H:%m:%s'});
				});
			}
		})
	});