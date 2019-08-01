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
		var user = "";
		var postData = {};
		var xhrArgsTabel = {
			url : basePath + "OA/findhrhs",
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
				this.getCzrzTable({"time":$("#hrhs-date").val(),"gjz":$("#hrhs-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#hrhs-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								        '<input type="checkbox" name="hrhs-Cbdelete" class="iFCheckBox iFCheckboxItem" value = "'+data[i].OG_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].OG_ID+']</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%">'+
								                    '<label class="iFLabel iFTitleName">时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].OG_TIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%;">'+
								                    '<label class="iFLabel iFTitleName">记录人</label>'+
								                    '<div class="iFText">'+data[i].USER_NAME+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 40%; line-height: 30px; text-align: center;">'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor hrhsEditor">编辑</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect hrhsDelete">删除</a>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%;">'+
								                    '<label class="iFLabel iFTitleName">标题</label>'+
								                    '<div class="iFText">'+data[i].OG_TITLE+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%;">'+
								                    '<label class="iFLabel iFTitleName">车牌</label>'+
								                    '<div class="iFText">'+data[i].OG_VEHI_NO+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">内容</label>'+
								                '<div class="iFTextArea">'+utils(data[i].OG_CONTENT)+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#hrhs-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						hrhsDialogPanel.set('href', 'app/html/oa/editor/hrhsEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    hrhsDialog.show().then(function () {
	                        hrhsDialog.set('title', '修改');
	                        $("#hrhs-bt").val(base.OG_TITLE);
	                        $("#hrhs-cphm").val(base.OG_VEHI_NO);
	                        $("#hrhs-jlr").val(USERS);
	                        $("#hrhsEditor-sj").val(new Date(base.OG_TIME).format('yyyy-MM-dd hh:mm:ss'));
	                        $("#hrhs-nr").text(base.OG_CONTENT);
	                        $("#hrhs-jlr").attr("disabled", true);
	                        query('#hrhsEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("hrhs-form");
                            	FormJson.OG_ID = base.OG_ID;
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/edithrhs",
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
												hrhsDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#hrhsEditorPanel .iFBtnClose').on('click', function () {hrhsDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').OG_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#hrhsPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#hrhsPanel');
				var _self = this;
				query('#hrhsQuery').on('click', function () {
					_self.getCzrzTable({"time":$("#hrhs-date").val(),"gjz":$("#hrhs-gjz").val()});
				});
				query('#hrhs-excel').on('click', function () {
					var postData = {"time":$("#hrhs-date").val(),"gjz":$("#hrhs-gjz").val()};
						url = "OA/hrhsexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#hrhs-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEAR});
				});
				query('#hrhs-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="hrhs-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#hrhs-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#hrhs-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#hrhs-allSelect');
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
                var id = '#hrhs', info = oaDialogInfo[type](id, '好人好事');
                query(info.id).on('click', function () {
                    hrhsDialogPanel.set('href', 'app/html/oa/editor/hrhsEditor.html');
                    hrhsDialog.show().then(function () {
                        hrhsDialog.set('title', info.title);
                        query(id + 'Editor-sj').on('focus', function () {
                            WdatePicker({dateFmt: STATEDATETIME});
                        });
                        $(id + 'Editor-sj').val(new Date().format('yyyy-MM-dd hh:mm:ss'));
                        $('#hrhs-jlr').val(USERS);
                        $("#hrhs-jlr").attr("disabled", true);
                        query('#hrhsEditorPanel .iFBtnCommit').on('click', function () {
                        	if(type=='add'){
                            	var FormJson = getFormJson("hrhs-form");
                            	if(FormJson.OG_TITLE.length==0){
                            		dijit.byId('qd_dialog').show().then(function() {
            							$("#czjg").html('标题不能为空！');
            						});
            		        		return;
                            	}
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/addhrhs",
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
												hrhsDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
                            }
                        });
                        /*取消按钮*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {hrhsDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/delhrhs",
						postData :{"id":id},
						handleAs : "json",
						Origin : self.location.origin,
						preventCache : true,
						withCredentials : true,
						load : function(data) {
							dijit.byId('qd_dialog').show().then(function() {
								$("#czjg").html(data.info);
								dojo.xhrPost(xhrArgsTabel);
							});
						},
						error : function(error) {
						}
					}
            	layer.confirm('你确定要删除该条记录吗?', function(index){
            		dojo.xhrPost(xhrArgsdel);
          		  layer.close(index);
          		}); 
            }
		})
	});