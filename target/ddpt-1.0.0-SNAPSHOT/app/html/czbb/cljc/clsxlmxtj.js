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
		var clsxlmxtjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			DB_TIME: {label: '日期'},
			VEHI_NUM: {label: '车辆总数'},
			BT: {label: '报停车辆数'},
			WYYC: {label: '无营运未上线数'},
			ONLINE: {label: '上线总数'},
			SXL: {label: '上线率'},
		};
		$("#clsxlmxtj-startTime").val(setformatday(new Date(new Date().getTime() - 1000*60*60*24)));
		$("#clsxlmxtj-endTime").val(setformatday(new Date(new Date().getTime() - 1000*60*60*24)));
		var postData = {"stime":$("#clsxlmxtj-startTime").val(),"etime":$("#clsxlmxtj-endTime").val(),"comp":$("#clsxlmxtj-comp").val(),"quyu":$("#clsxlmxtj-quyu").val()};
		var xhrArgs = {
				url : basePath + "form/sxlmxtj",
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
						clsxlmxtjGrid.set('collection',store);
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				clsxlmxtjGrid = new CustomGrid({
				   					columns : columns
				   				}, "clsxlmxtjTabel");
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
				query('#clsxlmxtjQuery').on('click', function () {
					loading('#clsxlmxtjTabel');
					var srq = new Date($("#clsxlmxtj-startTime").val());
					var erq = new Date($("#clsxlmxtj-endTime").val());
					if(srq.getFullYear()!=erq.getFullYear()){
						layer.msg('不能跨年查询');
						return;
					}
					if(srq.getMonth()!=erq.getMonth()){
						layer.msg('不能跨月查询');
						return;
					}
					var postData = {"stime":$("#clsxlmxtj-startTime").val(),"etime":$("#clsxlmxtj-endTime").val(),"comp":$("#clsxlmxtj-comp").val(),"quyu":$("#clsxlmxtj-quyu").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#clsxlmxtjexcel').on('click', function() {
					var srq = new Date($("#clsxlmxtj-startTime").val());
					var erq = new Date($("#clsxlmxtj-endTime").val());
					if(srq.getFullYear()!=erq.getFullYear()){
						layer.msg('不能跨年导出');
						return;
					}
					if(srq.getMonth()!=erq.getMonth()){
						layer.msg('不能跨月导出');
						return;
					}
					var postData = {"stime":$("#clsxlmxtj-startTime").val(),"etime":$("#clsxlmxtj-endTime").val(),"comp":$("#clsxlmxtj-comp").val(),"quyu":$("#clsxlmxtj-quyu").val()};
						url = "form/sxlmxtjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*下拉框*/
				 query('#clsxlmxtjPanel .iFComboBox').on('click', function () {
				 	var thisOne = this;
				 	if ($(this).hasClass('selected')) {
				 		$(this).removeClass('selected');
				 	} else {
				 		$(this).addClass('selected');
				 		$(this).find('.iFList').on('click', function () {
				 			if (event.stopPropagation) {
				 		        // 针对 Mozilla 和 Opera
				 		        event.stopPropagation();
				 	        }else if (window.event) {
				 		        // 针对 IE
				 	        	window.event.cancelBubble = true;
				 	        }
				 		}).find('li').off('click').on('click', function () {
				 			$(this).addClass('selected').siblings('.selected').removeClass('selected');
				 			$(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
				 			$(thisOne).find('input').trigger('change');
				 		});
				 	}
				 });
				addEventComboBox('#clsxlmxtjPanel');
				/*时间控件*/
				query('#clsxlmxtj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#clsxlmxtj-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#clsxlmxtj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE/*, minDate: '#F{$dp.$D(\'clsxlmxtj-startTime\')}'*/});
				});
			}
		})
	});