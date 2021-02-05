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
		var zxsjtjGrid = null, store = null;

		var columns = {
			dojoId: {label: '序号'},
			COMP_NAME: {label: '公司名'},
			VEHI_NO: {label: '车牌号码'},
			SX_TIME: {label: '上线时间',formatter : util.formatYYYYMMDDHHMISS},
			XX_TIME: {label: '下线时间',formatter : util.formatYYYYMMDDHHMISS},
			LOCATION_NUM: {label: '定位次数'},
			DURATION: {label: '在线时间（分）'}
		};
		$("#zxsjtj-startTime").val(setformatday(new Date));
		$("#zxsjtj-endTime").val(setformatday(new Date));
		var postData = {"stime":$("#zxsjtj-startTime").val(),"etime":$("#zxsjtj-endTime").val(),"comp":$("#zxsjtj-comp").val(),"sim":$("#zxsjtj-sim").val(),"vhic":$("#zxsjtj-vhic").val()};
		var xhrArgs = {
				url : basePath + "form/zxsctj",
				postData : 'postData={"page":1,"pageSize":pageSize}',
				handleAs : "json",
				load : function(data) {
					console.log(data)
					unloading();
					var zxsj = 0;
						for(var i=0; i<data.length;  i++){
							zxsj += parseFloat(data[i].DURATION);
					    	data[i] = dojo.mixin({ dojoId: i+1 }, data[i]);
					    }
						store = new Memory({ data: {
							identifier: 'dojoId',
							label: 'dojoId',
							items: data
						} });
						zxsjtjGrid.set('collection',store);
						console.log(zxsj)
						if(zxsj>0){
							$("#zxsjtj-zxzs").text("在线时间总计："+zxsj.toFixed(2)+"分");
						}else{
							$("#zxsjtj-zxzs").text("");
						}
				},
			};
			var CustomGrid = declare([ DijitRegistry, Grid, Keyboard,
				   						Selection, ColumnResizer, Editor ]);
				zxsjtjGrid = new CustomGrid({
				   					columns : columns
				   				}, "zxsjtjTabel");
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
				query('#zxsjtjQuery').on('click', function () {
					loading('#zxsjtjTabel');
					var postData = {"stime":$("#zxsjtj-startTime").val(),"etime":$("#zxsjtj-endTime").val(),"comp":$("#zxsjtj-comp").val(),"sim":$("#zxsjtj-sim").val(),"vhic":$("#zxsjtj-vhic").val()};
					dojo.xhrPost(dojo.mixin(xhrArgs,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#zxsjtjexcel').on('click', function() {
					var postData = {"stime":$("#zxsjtj-startTime").val(),"etime":$("#zxsjtj-endTime").val(),"comp":$("#zxsjtj-comp").val(),"sim":$("#zxsjtj-sim").val(),"vhic":$("#zxsjtj-vhic").val()};
						url = "form/zxsctjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
                });
				/*下拉框*/
				 query('#zxsjtjPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#zxsjtjPanel');

				/*时间控件*/
				query('#zxsjtj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#zxsjtj-endTime').trigger('focus')
						},
						dateFmt: STATEDATE
					});
				});
				query('#zxsjtj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE, minDate: '#F{$dp.$D(\'zxsjtj-startTime\')}'});
				});
			}
		})
	});