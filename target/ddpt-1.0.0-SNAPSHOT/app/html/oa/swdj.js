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
				url : basePath + "OA/findswdj",
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
				this.getCzrzTable({"stime":$("#swdj-sdate").val(),"etime":$("#swdj-edate").val(),"gjz":$("#swdj-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#swdj-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								            '<input type="checkbox" class="iFCheckBox iFCheckboxItem" name="swdj-Cbdelete" value="'+data[i].OGT_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].OGT_ID+']</span>'+
								        '</div>';
									if(data[i].KIND == '寻找失主'){
										tab += '<div class="iFContent iFContentcount" style="background-color: #cb45b480;" data-numId="'+(i+1)+'">';
									}else{
										tab += '<div class="iFContent iFContentcount" style="background-color: #eac36a80;" data-numId="'+(i+1)+'">';
									}
								        tab+='<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">接电话时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].DATETIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">上车时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].UPTIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">下车时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].DOWNTIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 25%; line-height: 30px; text-align: center;">'+
								                	'<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnQuery swdj-tpck" puct-src = "'+data[i].PUCT+'">查看</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor">编辑</a>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">调度员工号</label>'+
								                    '<div class="iFText">'+data[i].USER_NAME+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">车牌号</label>'+
								                    '<div class="iFText">'+data[i].VEHI_NO+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName" style="width: 7em;">车辆公司名称</label>'+
								                    '<div class="iFText">'+data[i].TAXICOMP+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">客人姓名</label>'+
								                    '<div class="iFText">'+data[i].GUEST+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName" style="width: 7em;">客人联系电话</label>'+
								                    '<div class="iFText">'+data[i].TEL+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">事件性质</label>'+
								                    '<div class="iFText">'+data[i].KIND+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">事件内容</label>'+
								                '<div class="iFTextArea" style="padding-left: 5em;">'+data[i].CONTENT+'</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 100%">'+
								                    '<label class="iFLabel iFTitleName">处理结果</label>'+
								                    '<div class="iFText">'+data[i].RESULT+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">内容</label>'+
								                '<div class="iFTextArea">'+data[i].NOTE+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#swdj-infoPanel');
					}
					$(".swdj-tpck").click(function(){
						var srcpuc = $(this).attr('puct-src');
						if(srcpuc!=""){
							swdjDialogPanel.set('href', 'app/html/czchtgl/editor/puct.html');
							swdjDialog.show().then(function () {
								$.ajax({
									type: "POST",
									url: basePath + "common/dz",
									data:{dz:srcpuc},
									timeout : 180000,
									dataType: 'json',
									success:function(data){
										console.log(1)
										$("#puctEditorPanel").html('<img class="avatar" src="common/query_pic" >');
									},
									error: function(){
									}         
								});
							});
						}else{
							dijit.byId('qd_dialog').show().then(function() {
								$("#czjg").html("暂无图片");
							})
						}
					})
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						swdjDialogPanel.set('href', 'app/html/oa/editor/swdjEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    swdjDialog.show().then(function () {
	                        swdjDialog.set('title', '修改');
	                        findcomp('').then(function(data){
								xlktyff("swdj-gsmc-ul",data.datas);
							});
	                        // query('#swdjEditorPanel .iFComboBox').on('click', function () {
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
												addEventComboBox('#swdjEditorPanel');
	                        $("#swdj-cphm").change(function(){
	                        	if($("#swdj-cphm").val().length==7){
	                        		var xhrArgs2 = {
	                        				url : basePath  + "OA/findclgs",
	                        				postData : {
	                        					"vhic" : $("#swdj-cphm").val()
	                        				},
	                        				handleAs : "json",
	                        				Origin : self.location.origin,
	                        				preventCache:true,
	                        				withCredentials :  true,
	                        				load : function(data) {
	                        					console.log(data)
	                        					if(data.length>0){
	                        						$("#swdj-gsmc").val(data[0].COMP_NAME);
	                        					}else{
	                        						$("#swdj-gsmc").val("");
	                        					}
	                        				}
	                        		}
	                        		dojo.xhrPost(xhrArgs2);
	                        	}else{
	                        		if($("#swdj-cphm").val().length>2){
	                        			findvhictj($("#swdj-cphm").val()).then(function(data){
	                        				xlktyff("swdj-cp-ul",data.datas);
	                        			});
	                        		}
	                        		$("#swdj-gsmc").val("");
	                        	}
	                        })
	                        $("#swdj-sjxz").change(function(){
	                        	if($("#swdj-sjxz").val()=='寻找失主'){
	                        		$("#swdj-puct-div").show();
	                        	}else{
	                        		$("#swdj-puct-div").hide();
	                        	}
	                        });
	                        $("#swdj-ddygh").val(USERS);
	                        $("#swdj-cphm").val(base.VEHI_NO);
	                        $("#swdj-gsmc").val(base.TAXICOMP);
	                        $("#swdj-krxs").val(base.GUEST);
	                        $("#swdj-krdh").val(base.TEL);
	                        $("#swdj-sjxz").val(base.KIND);
	                        $("#swdjEditor-jdhsj").val(setformat1(new Date(base.DATETIME)));
	                        $("#swdjEditor-scsj").val(setformat1(new Date(base.UPTIME)));
	                        $("#swdjEditor-xcsj").val(setformat1(new Date(base.DOWNTIME)));
	                        $("#swdj-sjnr").text(base.CONTENT);
	                        $("#swdj-cljg").text(base.RESULT);
	                        $("#swdj-bz").text(base.NOTE);
	                        $("#swdj-ddygh").attr("disabled", true);
	                        query('#swdjEditorPanel .iFBtnCommit').on('click', function () {//提交
	                        	layer.load(1);
                            	var FormJson = getFormJson("swdj-form");
                            	FormJson.OGT_ID = base.OGT_ID;
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/editswdj",
    									postData : {
    										"postData" : datap
    									},
    									handleAs : "json",
    									Origin : self.location.origin,
    									preventCache:true,
    									withCredentials :  true,
    									load : function(data) {
    										layer.closeAll('loading');
											dijit.byId('qd_dialog').show().then(function() {
												$("#czjg").html(data.info);
												dojo.xhrPost(xhrArgsTabel);
												swdjDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#swdjEditorPanel .iFBtnClose').on('click', function () {swdjDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').OGT_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#swdjPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#swdjPanel');
				var _self = this;
				query('#swdjQuery').on('click', function () {
					_self.getCzrzTable({"stime":$("#swdj-sdate").val(),"etime":$("#swdj-edate").val(),"gjz":$("#swdj-gjz").val()});
				});
				query('#swdj-excel').on('click', function () {
					var postData = {"stime":$("#swdj-sdate").val(),"etime":$("#swdj-edate").val(),"gjz":$("#swdj-gjz").val()};
						url = "OA/swdjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#swdj-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="swdj-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#swdj-sdate').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				query('#swdj-edate').on('focus', function () {
					WdatePicker({dateFmt: STATEDATE});
				});
				query('#swdj-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#swdj-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#swdj-allSelect');
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
							var id = '#swdj', info = oaDialogInfo[type](id, '失物登记');
							query(info.id).on('click', function () {
								swdjDialogPanel.set('href', 'app/html/oa/editor/swdjEditor.html');
								swdjDialog.show().then(function () {
									swdjDialog.set('title', info.title);
									$("#swdjEditor-jdhsj").val(setformat1(new Date()));
									$("#swdjEditor-scsj").val(setformat1(new Date()));
									$("#swdjEditor-xcsj").val(setformat1(new Date()));
									findcomp('').then(function (data) {
										xlktyff("swdj-gsmc-ul", data.datas);
									});
									$("#swdj-ddygh").val(USERS);
									// query(id + 'EditorPanel .iFComboBox').on('click', function () {
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
									addEventComboBox(id + 'EditorPanel');
									$("#swdj-cphm").change(function () {
										if ($("#swdj-cphm").val().length == 7) {
											var xhrArgs2 = {
												url: basePath + "OA/findclgs",
												postData: {
													"vhic": $("#swdj-cphm").val()
												},
												handleAs: "json",
												Origin: self.location.origin,
												preventCache: true,
												withCredentials: true,
												load: function (data) {
													console.log(data)
													if (data.length > 0) {
														$("#swdj-gsmc").val(data[0].COMP_NAME);
													} else {
														$("#swdj-gsmc").val("");
													}
												}
											}
											dojo.xhrPost(xhrArgs2);
										} else {
											if ($("#swdj-cphm").val().length > 2) {
												findvhictj($("#swdj-cphm").val()).then(function (data) {
													xlktyff("swdj-cp-ul", data.datas);
												});
											}
											$("#swdj-gsmc").val("");
										}
									})
									$("#swdj-sjxz").change(function () {
										if ($("#swdj-sjxz").val() == '寻找失主') {
											$("#swdj-puct-div").show();
										} else {
											$("#swdj-puct-div").hide();
										}
									});
									query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
										if (type == 'add') {
											layer.load(1);
											var FormJson = getFormJson("swdj-form");
											if (FormJson.CONTENT.length == 0) {
												dijit.byId('qd_dialog').show().then(function () {
													$("#czjg").html('时间内容不能为空！');
												});
												return;
											}
											if ($("#swdj-puct").val() != "") {
												console.log(11)
												var a = $("#swdj-puct").val().substr($("#swdj-puct").val().indexOf('.') + 1);
												if (a != 'jpg' && a != 'jpeg' && a != 'JPG' && a != 'JPEG' && a != 'png' && a != 'PNG') {
													Pop_up_box("只能上传.jpg或者.JPEG或者.PNG格式的图片！!");
													return false;
												}
												$("#swdj-form").submit();
												var oFrm = document.getElementById("interface_data");
												oFrm.onload = function () {
													if (this.readyState && this.readyState != 'complete') return;
													else {
														if (document.all) {//IE
															var sub_con = document.frames["interface_data"].document;
														} else {//Firefox
															var sub_con = document.getElementById("interface_data").contentDocument;
														}
														sub_con = sub_con.body.innerHTML;  //取得返回值
														if (sub_con.indexOf("OK") >= 0) {
															var datap = JSON.stringify(FormJson);
															var xhrArgs2 = {
																url: basePath + "OA/addswdj",
																postData: {
																	"postData": datap
																},
																handleAs: "json",
																Origin: self.location.origin,
																preventCache: true,
																withCredentials: true,
																load: function (data) {
																	layer.closeAll('loading');
																	dijit.byId('qd_dialog').show().then(function () {
																		$("#czjg").html(data.info);
																		dojo.xhrPost(xhrArgsTabel);
																		swdjDialog.hide();
																	})
																}
															}
															dojo.xhrPost(xhrArgs2);
														} else {
															layer.closeAll('loading');
															var dainfo = eval('(' + sub_con + ')');
															alert(dainfo.info);
														}
													}
												};
											} else {
												console.log(324)
												FormJson.itype = '0';
												var datap = JSON.stringify(FormJson);
												var xhrArgs2 = {
													url: basePath + "OA/addswdj",
													postData: {
														"postData": datap
													},
													handleAs: "json",
													Origin: self.location.origin,
													preventCache: true,
													withCredentials: true,
													load: function (data) {
														layer.closeAll('loading');
														dijit.byId('qd_dialog').show().then(function () {
															$("#czjg").html(data.info);
															dojo.xhrPost(xhrArgsTabel);
															swdjDialog.hide();
														})
													}
												}
												dojo.xhrPost(xhrArgs2);
											}
										}
									});
									/*取消按钮*/
									query(id + 'EditorPanel .iFBtnClose').on('click', function () {
										swdjDialog.hide();
									});
								});
							});
						},
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/delswdj",
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