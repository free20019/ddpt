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
		var xhrArgsTabel = {
				url : basePath + "form/yyyw",
				postData :{},
				handleAs : "json",
				Origin : self.location.origin,
				preventCache : true,
				withCredentials : true,
				load : function(data) {
					console.log(data)
					var tab = "";
					for(var i=0; i<data.length; i++){
						tab += '<th>'+data[i].ZS+'</th>'+
								'<th>'+data[i].QX+'</th>'+
								'<th>'+data[i].QXL+'</th>'+
								'<th>'+data[i].CG+'</th>'+
								'<th>'+data[i].CGL+'</th>'
					}
					$('#yyywtj').html(tab);
				},
				error : function(error) {
				}
			};
		return declare( null,{
			constructor:function(){
				this.initToolBar();
				this.get();
			},
			del: function (obj) {},
			add:function () {},
			update: function (json) {},
			get: function () {
				postData = {"stime":$("#yyywtj-startTime").val(),"etime":$("#yyywtj-endTime").val()};
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				/*时间控件*/
				query('#yyywtjQuery').on('click', function () {
					postData = {"stime":$("#yyywtj-startTime").val(),"etime":$("#yyywtj-endTime").val()};
					dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
				});
				query('#yyywtj-dcsj').on('click', function () {
					var postData = {"stime":$("#yyywtj-startTime").val(),"etime":$("#yyywtj-endTime").val()};
						url = "form/yyywexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				$("#yyywtj-startTime").val(setformat2(new Date));
				$("#yyywtj-endTime").val(setformat1(new Date));
				query('#yyywtj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#yyywtj-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME,
						maxDate:'%y-%M-%d %H:%m:%s'
					});
				});
				query('#yyywtj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME, minDate: '#F{$dp.$D(\'yyywtj-startTime\')}',
						maxDate:'%y-%M-%d %H:%m:%s'});
				});
			}
		})
	});