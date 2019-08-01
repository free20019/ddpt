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
		var user = "";
		var postData = {};
		var xhrArgsTabel = {
			url : basePath + "OA/czrz",
			postData :{},
			handleAs : "json",
			Origin : self.location.origin,
			preventCache : true,
			withCredentials : true,
			load : function(data) {
				
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
				this.getCzrzTable({"time":$("#gccrz-date").val(),"gjz":$("#gccrz-gjz").val(),"table":"TB_OA_PLOG"});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#gccrz-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent"><div class="iFTabularPanel">'+
				                    '<div class="iFTitle">'+
					                    '<input type="checkbox" name="Cbdelete-gccrz" class="iFCheckBox iFCheckboxItem" value = "'+data[i].OLO_ID+'">'+
					                    '<label>记录编号</label>'+
					                    '<span>['+data[i].OLO_ID+']</span>'+
				                    '</div>'+
				                    '<div class="iFContent" data-numId="'+(i+1)+'">'+
					                    '<div class="iFWAuto iFItem clearfix">'+
						                    '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
							                    '<label class="iFLabel">日期</label>'+
							                    '<div class="iFText">'+util.formatYYYYMMDD(data[i].OLO_TIME)+'</div>'+
							                    '</div>'+
							                    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
							                    	'<label class="iFLabel">班次</label>'+
							                    '<div class="iFText">'+data[i].BC+'</div>'+
							                    '</div>'+
							                    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
							                    	'<label class="iFLabel">组长工号</label>'+
							                    '<div class="iFText">'+data[i].GROUP_USER+'</div>'+
							                    '</div>'+
							                    '<div class="iFSubItem iFBtnBox" style="width: 40%; line-height: 30px; text-align: center;">'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor">编辑</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect">删除</a>'+
							                    '</div>'+
							                    '</div>'+
							                    '<div class="iFItem iFTextAreaItem">'+
							                    	'<label class="iFLabel iFTitleName">内容</label>'+
							                    '<div class="iFTextArea">'+utils(data[i].OLO_CONTENT)+'</div>'+
							                '</div>'+
						                '</div>'+
					                '</div>'+
				                '</dd>';
								$(tab).data('base', data[i]).appendTo('#gccrz-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						czrlDialogPanel.set('href', 'app/html/oa/editor/rxrzEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    czrlDialog.show().then(function () {
	                        czrlDialog.set('title', '修改');
	                        $("#czrz-zzgh").val(base.GROUP_USER);
	                        $("#czrz-fbr").val(base.USER_NAME);
	                        $("#czrz-bc-input").val(base.BC);
	                        $("#czrz-sj-input").val(new Date(base.OLO_TIME).format('yyyy-MM-dd hh:mm:ss'));
	                        $("#czrz-nr").text(base.OLO_CONTENT);
	                        $("#czrz-fbr").attr("disabled", true);
	                        $("#czrz-bc-input").attr("disabled", true);
	                        $("#czrz-sj-input").attr("disabled", true);
	                        query('#rxrzEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("czrz-form");
                            	FormJson.OLO_ID = base.OLO_ID;
                            	FormJson.table = "TB_OA_PLOG";
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/editczrz",
    									postData : {
    										"postData" : datap
    									},
    									handleAs : "json",
    									Origin : self.location.origin,
    									preventCache:true,
    									withCredentials :  true,
    									load : function(data) {
											dijit.byId('qd_dialog').show().then(function() {
												$("#czjg").html(data.info);
												dojo.xhrPost(xhrArgsTabel);
												czrlDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#rxrzEditorPanel .iFBtnClose').on('click', function () {czrlDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').OLO_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar: function () {
				var _self = this;
				query('#gccrzQuery').on('click', function () {
					_self.getCzrzTable({"time": $("#gccrz-date").val(), "gjz": $("#gccrz-gjz").val(), "table": "TB_OA_PLOG"});
				});
				query('#gccrz-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});
				query('#gccrz-datetime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				query('#AllDelete-gccrz').on('click', function () {
					var id_array = new Array();
					$('input[name="Cbdelete-gccrz"]:checked').each(function () {
						id_array.push($(this).val());//向数组中添加元素
					});
					var idstr = id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#gccrz-excel').on('click', function () {
					var postData = {
						"time": $("#gccrz-date").val(), "gjz": $("#gccrz-gjz").val(), "table": "TB_OA_PLOG"
					};
					url = "OA/czrzexcle?postData="
						+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#gccrz-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#gccrz-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#gccrz-allSelect');
					console.info('allSelect:', state, checkboxLen, checkedLen)
					if (checkboxLen === checkedLen && checkedLen > 0) {/*全选*/
						allCheckBox.prop({checked: true, indeterminate: false});
					} else if (checkboxLen !== checkedLen && checkedLen > 0) {
						allCheckBox.prop({checked: false, indeterminate: true});
					} else if (checkedLen === 0) {
						allCheckBox.prop({checked: false, indeterminate: false});
					}

				});
				this.eventEditor('add');
				this.eventEditor('edit');
			},
			eventEditor: function (type) {
				var id = '#rxrz', info = oaDialogInfo[type]('#gccrz', '出租日志');
				query(info.id).on('click', function () {
					czrlDialogPanel.set('href', 'app/html/oa/editor/rxrzEditor.html');
					czrlDialog.show().then(function () {
						// query('.iFComboBox').on('click', function () {
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
						addEventComboBox('#rxrzEditorPanel');
						czrlDialog.set('title', info.title);
						$("#czrz-sj-input").val(new Date().format('yyyy-MM-dd hh:mm:ss'));
						$("#czrz-fbr").val(USERS);
						query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
							if (type == 'add') {
								var FormJson = getFormJson("czrz-form");
								if (FormJson.TIME.length == 0) {
									dijit.byId('qd_dialog').show().then(function () {
										$("#czjg").html('时间不能为空！');
									});
									return;
								}
								FormJson.table = "TB_OA_PLOG";
								var datap = JSON.stringify(FormJson);
								var xhrArgs2 = {
									url: basePath + "OA/addczrz",
									postData: {
										"postData": datap
									},
									handleAs: "json",
									Origin: self.location.origin,
									preventCache: true,
									withCredentials: true,
									load: function (data) {
										if (data.info.indexOf('已存在') >= 0) {
											dijit.byId('qd_dialog').show().then(function () {
												$("#czjg").html(data.info);
											})
										} else {
											dijit.byId('qd_dialog').show().then(function () {
												$("#czjg").html(data.info);
												dojo.xhrPost(xhrArgsTabel);
												czrlDialog.hide();
											})
										}
									}
								}
								dojo.xhrPost(xhrArgs2);
							}
						});
						/*关闭弹框*/
						query(id + 'EditorPanel .iFBtnClose').on('click', function () {
							czrlDialog.hide();
						});
					});
				});
			},
			deltable: function (id) {
				var xhrArgsdel = {
					url: basePath + "OA/delczrz",
					postData: {"id": id, "table": "TB_OA_PLOG"},
					handleAs: "json",
					Origin: self.location.origin,
					preventCache: true,
					withCredentials: true,
					load: function (data) {
						dijit.byId('qd_dialog').show().then(function () {
							$("#czjg").html(data.info);
							dojo.xhrPost(xhrArgsTabel);
						});
					},
					error: function (error) {
						console.log(error);
					}
				}
				layer.confirm('你确定要删除该条记录吗?', function(index){
          		  dojo.xhrPost(xhrArgsdel);
          		  layer.close(index);
          		}); 
			}
		})
	});