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
			url : basePath + "OA/findlkxx",
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
				this.getCzrzTable({"time":$("#lkxx-date").val(),"gjz":$("#lkxx-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#lkxx-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								            '<input type="checkbox" class="iFCheckBox iFCheckboxItem" name="lkxx-Cbdelete" value="'+data[i].ORC_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].ORC_ID+']</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%">'+
								                    '<label class="iFLabel iFTitleName">日期</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDD(data[i].DATETIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%;">'+
								                    '<label class="iFLabel iFTitleName">班次</label>'+
								                    '<div class="iFText">'+data[i].BC+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 40%; line-height: 30px; text-align: center;">'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor lkxxEditor">编辑</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect lkxxDelete">删除</a>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%">'+
								                    '<label class="iFLabel iFTitleName">车牌号</label>'+
								                    '<div class="iFText">'+data[i].VEHI_NO+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%">'+
								                    '<label class="iFLabel iFTitleName">公司</label>'+
								                    '<div class="iFText">'+data[i].TAXICOMP+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 30%">'+
								                    '<label class="iFLabel iFTitleName">调度员工号</label>'+
								                    '<div class="iFText">'+data[i].USER_NAME+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">备注</label>'+
								                '<div class="iFTextArea">'+data[i].NOTE+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#lkxx-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						lkxxDialogPanel.set('href', 'app/html/oa/editor/lkxxEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    lkxxDialog.show().then(function () {
	                        lkxxDialog.set('title', '修改');
	                        findcomp('').then(function(data){
								xlktyff("lkxx-gs-ul",data.datas);
								comboboxDFun('#car-comboBox')
							});
	                        $("#lkxx-cphm").keyup(function(){
	                        	if($("#lkxx-cphm").val().length==7){
	                        		var xhrArgs2 = {
	                        				url : basePath  + "OA/findclgs",
	                        				postData : {
	                        					"vhic" : $("#lkxx-cphm").val()
	                        				},
	                        				handleAs : "json",
	                        				Origin : self.location.origin,
	                        				preventCache:true,
	                        				withCredentials :  true,
	                        				load : function(data) {
	                        					console.log(data)
	                        					if(data.length>0){
	                        						$("#lkxx-gs-input").val(data[0].COMP_NAME);
	                        					}else{
	                        						$("#lkxx-gs-input").val("");
	                        					}
	                        				}
	                        		}
	                        		dojo.xhrPost(xhrArgs2);
	                        	}else{
	                        		$("#lkxx-gs-input").val("");
	                        	}
	                        })
	                        // query('#lkxxEditorPanel .iFComboBox').on('click', function () {
                           //  var thisOne = this;
                           //  if ($(this).hasClass('selected')) {
                           //      $(this).removeClass('selected');
	                        //     } else {
	                        //         $(this).addClass('selected');
	                        //         $(this).find('.iFList').on('click', function () {
	                        //             event.stopPropagation();
	                        //         }).find('li').off('click').on('click', function () {
	                        //             $(this).addClass('selected').siblings('.selected').removeClass('selected');
	                        //             $(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
	                        //             $(thisOne).find('input').trigger('change');
	                        //         });
	                        //     }
	                        // });
												addEventComboBox('#lkxxEditorPanel');
	                        $("#lkxx-ddygh").val(USERS);
	                        $("#lkxx-cphm").val(base.VEHI_NO);
	                        $("#lkxx-gs-input").val(base.TAXICOMP);
	                        $("#lkxx-sj-input").val(new Date(base.DATETIME).format('yyyy-MM-dd'));
	                        $("#lkxx-bc-input").text(base.BC);
	                        $("#lkxx-nr").text(base.NOTE);
	                        $("#lkxx-sj-input").attr("disabled", true);
	                        $("#lkxx-bc-input").attr("disabled", true);
	                        $("#lkxx-ddygh").attr("disabled", true);
	                        query('#lkxxEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("lkxx-form");
                            	FormJson.ORC_ID = base.ORC_ID;
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/editlkxx",
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
												lkxxDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#lkxxEditorPanel .iFBtnClose').on('click', function () {lkxxDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').ORC_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#lkxxPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#lkxxPanel');
				var _self = this;
				query('#lkxxQuery').on('click', function () {
					_self.getCzrzTable({"time":$("#lkxx-date").val(),"gjz":$("#lkxx-gjz").val()});
				});
				query('#lkxx-dcsj').on('click', function () {
					var postData = {"time":$("#lkxx-date").val(),"gjz":$("#lkxx-gjz").val()};
						url = "OA/lkxxexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#lkxx-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});
				query('#lkxx-datetime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				query('#lkxx-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="lkxx-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#lkxx-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#lkxx-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#lkxx-allSelect');
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
							var id = '#lkxx', info = oaDialogInfo[type](id, '路况信息');
							query(info.id).on('click', function () {
								lkxxDialogPanel.set('href', 'app/html/oa/editor/lkxxEditor.html');
								lkxxDialog.show().then(function () {
									lkxxDialog.set('title', info.title);
									query(id + 'Editor-sj2').on('focus', function () {
										WdatePicker({dateFmt: STATEDATE});
									});
									// query('#lkxxEditorPanel .iFComboBox').on('click', function () {
									//     var thisOne = this;
									//     if ($(this).hasClass('selected')) {
									//         $(this).removeClass('selected');
									//     } else {
									//         $(this).addClass('selected');
									//         $(this).find('.iFList').on('click', function () {
									//             event.stopPropagation();
									//         }).find('li').off('click').on('click', function () {
									//             $(this).addClass('selected').siblings('.selected').removeClass('selected');
									//             $(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
									//             $(thisOne).find('input').trigger('change');
									//         });
									//     }
									// });
									addEventComboBox('#lkxxEditorPanel');
									$("#lkxx-cphm").keyup(function () {
										if ($("#lkxx-cphm").val().length == 7) {
											var xhrArgs2 = {
												url: basePath + "OA/findclgs",
												postData: {
													"vhic": $("#lkxx-cphm").val()
												},
												handleAs: "json",
												Origin: self.location.origin,
												preventCache: true,
												withCredentials: true,
												load: function (data) {
													console.log(data)
													if (data.length > 0) {
														$("#lkxx-gs-input").val(data[0].COMP_NAME);
													} else {
														$("#lkxx-gs-input").val("");
													}
												}
											}
											dojo.xhrPost(xhrArgs2);
										} else {
											$("#lkxx-gs-input").val("");
										}
									})
									$("#lkxx-sj-input").val(new Date().format('yyyy-MM-dd'));
									$("#lkxx-ddygh").val(USERS);
									findcomp('').then(function (data) {
										xlktyff("lkxx-gs-ul", data.datas);
										comboboxDFun('#car-comboBox')
									});
									query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
										if (type == 'add') {
											var FormJson = getFormJson("lkxx-form");
											if (FormJson.DATETIME.length == 0) {
												dijit.byId('qd_dialog').show().then(function () {
													$("#czjg").html('时间不能为空！');
												});
												return;
											}
											var datap = JSON.stringify(FormJson);
											var xhrArgs2 = {
												url: basePath + "OA/addlkxx",
												postData: {
													"postData": datap
												},
												handleAs: "json",
												Origin: self.location.origin,
												preventCache: true,
												withCredentials: true,
												load: function (data) {
													dijit.byId('qd_dialog').show().then(function () {
														$("#czjg").html(data.info);
														dojo.xhrPost(xhrArgsTabel);
														lkxxDialog.hide();
													})
												}
											}
											dojo.xhrPost(xhrArgs2);
										}
									});
									/*关闭弹框*/
									query(id + 'EditorPanel .iFBtnClose').on('click', function () {
										lkxxDialog.hide();
									});
								});
							});
						},
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/dellkxx",
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