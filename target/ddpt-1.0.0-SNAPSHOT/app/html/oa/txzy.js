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
			url : basePath + "OA/findtxzy",
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
				this.getCzrzTable({"stime":$("#txzy-sdate").val(),"etime":$("#txzy-edate").val(),"gjz":$("#txzy-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				if(USERS != 'hzgps'){
					$("#txzy-add").hide();
					$("#txzy-AllDelete").hide();
				}
				xhrArgsTabel.load = function(data) {
					$("#txzy-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								        '<input type="checkbox" name="txzy-Cbdelete" class="iFCheckBox iFCheckboxItem" value = "'+data[i].ORE_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].ORE_ID+']</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%">'+
								                    '<label class="iFLabel iFTitleName">发布时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].ORE_TIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%;">'+
								                    '<label class="iFLabel iFTitleName">发布人</label>'+
								                    '<div class="iFText">'+data[i].USER_NAME+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 40%; line-height: 30px; text-align: center;">';
												if(USERS == 'hzgps'){
													tab += '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor txzyEditor">编辑</a>'+
													'<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect txzyDelete">删除</a>';
												}
						                   tab += '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 100%">'+
								                    '<label class="iFLabel iFTitleName">标题</label>'+
								                    '<div class="iFText">'+data[i].ORE_TITLE+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">内容</label>'+
								                '<div class="iFTextArea">'+utils(data[i].ORE_CONTENT)+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#txzy-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						txzyDialogPanel.set('href', 'app/html/oa/editor/txzyEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    txzyDialog.show().then(function () {
	                        txzyDialog.set('title', '修改');
	                        $("#txzy-bt").val(base.ORE_TITLE);
	                        $("#txzy-jlr").val(base.USER_NAME);
	                        $("#txzyEditor-shijian").val(setformat1(new Date(base.ORE_TIME)));
	                        $("#txzy-nr").text(base.ORE_CONTENT);
	                        $("#txzy-jlr").attr("disabled", true);
	                        query('#txzyEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("txzy-form");
                            	FormJson.ORE_ID = base.ORE_ID;
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/edittxzy",
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
												txzyDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#txzyEditorPanel .iFBtnClose').on('click', function () {txzyDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').ORE_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#txzyPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#txzyPanel');
				var _self = this;
				query('#txzyQuery').on('click', function () {
					_self.getCzrzTable({"stime":$("#txzy-sdate").val(),"etime":$("#txzy-edate").val(),"gjz":$("#txzy-gjz").val()});
				});
				query('#txzy-excel').on('click', function () {
					var postData = {"stime":$("#txzy-sdate").val(),"etime":$("#txzy-edate").val(),"gjz":$("#txzy-gjz").val()};
						url = "OA/txzyexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#txzy-sdate').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				query('#txzy-edate').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				query('#txzy-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="txzy-Cbdelete"]:checked').each(function(){
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#txzy-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#txzy-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#txzy-allSelect');
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
                var id = '#txzy', info = oaDialogInfo[type](id, '提醒注意');
                query(info.id).on('click', function () {
                    txzyDialogPanel.set('href', 'app/html/oa/editor/txzyEditor.html');
                    txzyDialog.show().then(function () {
                        txzyDialog.set('title', info.title);
                        $("#txzyEditor-shijian").val(setformat1(new Date));
                        $("#txzy-jlr").val(USERS);
                        query('#txzyEditor-shijian').on('focus', function () {
                            WdatePicker({dateFmt: STATEDATETIME});
                        });
                        query('#txzyEditorPanel .iFBtnCommit').on('click', function () {
                        	if(type=='add'){
                            	var FormJson = getFormJson("txzy-form");
                            	if(FormJson.ORE_TITLE.length==0){
                            		dijit.byId('qd_dialog').show().then(function() {
            							$("#czjg").html('标题不能为空！');
            						});
            		        		return;
                            	}
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/addtxzy",
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
												txzyDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
                            }
                        });
                        /*关闭弹框*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {txzyDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/deltxzy",
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