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
		var bjcltjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			COMP_NAME: {label: '公司名'},
			VEHI_NO: {label: '车牌号码'},
			VEHI_SIM: {label: 'SIM卡号'},
			CS_ALARM: {label: '超速报警次数'},
			PL_ALARM: {label: '疲劳报警次数'},
			JJ_ALARM: {label: '紧急报警次数'},
			OWN_NAME: {label: '联系人'},
			OWN_TEL: {label: '联系电话'}
		};
		$("#bjcltj-startTime").val(setformatday(new Date(new Date().getTime() - 1000*60*60*24)));
		$("#bjcltj-endTime").val(setformatday(new Date(new Date().getTime() - 1000*60*60*24)));
		var postData = {"stime":$("#bjcltj-startTime").val(),"etime":$("#bjcltj-endTime").val(),"comp":$("#bjcltj-comp").val(),"sim":$("#bjcltj-sim").val(),"vhic":$("#bjcltj-vhic").val()};
		var xhrArgs = {
				url : basePath + "form/bjcltj",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
					console.log(data)
					unloading();
					var cs=0,pl=0,jj=0;
						for(var i=0; i<data.length;  i++){
							if(data[i].CS_ALARM=='1'){
								cs++;
							}
							if(data[i].PL_ALARM=='1'){
								pl++;
							}
							if(data[i].JJ_ALARM=='1'){
								jj++;
							}
					    	data[i] = dojo.mixin({ dojoId: i+1 }, data[i]);
					    }
						store = new Memory({ data: {
							identifier: 'dojoId',
							label: 'dojoId',
							items: data
						} });
						zxsjtjGrid.set('collection',store);
						if(cs>0||pl>0||jj>0){
							$("#bjcltj-clzs").text("超速总数:"+cs+"辆，疲劳驾驶总数："+pl+"辆，紧急报警总数："+jj+"辆");
						}else{
							$("#bjcltj-clzs").text("")
						}
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				zxsjtjGrid = new CustomGrid({
				   					columns : columns
				   				}, "bjcltjTabel");
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
				query('#bjcltjQuery').on('click', function () {
					loading('#bjcltjTabel');
					var postData = {"stime":$("#bjcltj-startTime").val(),"etime":$("#bjcltj-endTime").val(),"comp":$("#bjcltj-comp").val(),"sim":$("#bjcltj-sim").val(),"vhic":$("#bjcltj-vhic").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#bjcltjexcel').on('click', function() {
					var postData = {"stime":$("#bjcltj-startTime").val(),"etime":$("#bjcltj-endTime").val(),"comp":$("#bjcltj-comp").val(),"sim":$("#bjcltj-sim").val(),"vhic":$("#bjcltj-vhic").val()};
						url = "form/bjcltjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*下拉框*/
				 query('#bjcltjPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#bjcltjPanel');

				/*时间控件*/
				query('#bjcltj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#bjcltj-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#bjcltj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE, minDate: '#F{$dp.$D(\'bjcltj-startTime\')}'});
				});
			}
		})
	});