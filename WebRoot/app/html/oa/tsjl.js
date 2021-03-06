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
		url : basePath + "OA/findtsjl",
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
				this.getCzrzTable({"time":$("#tsjl-cxsh").val(),"gjz":$("#tsjl-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#tsjl-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								            '<input type="checkbox" class="iFCheckBox iFCheckboxItem" name="tsjl-Cbdelete" value="'+data[i].COMP_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].COMP_ID+']</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">受理时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].DB_TIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">受理工号</label>'+
								                    '<div class="iFText">'+data[i].USER_NO+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">投诉类型</label>'+
								                    '<div class="iFText">'+data[i].COMP_TYPE+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 35%; line-height: 30px; text-align: center;">'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor tsjlEditor">编辑</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect tsjlDelete">删除</a>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">乘客名称</label>'+
								                    '<div class="iFText">'+data[i].CLI_NAME+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">电话</label>'+
								                    '<div class="iFText">'+data[i].CLI_TEL+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">约车时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].ON_CAR_TIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">约车地点</label>'+
								                    '<div class="iFText">'+data[i].ON_CAR_ADD+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">投诉车牌</label>'+
								                    '<div class="iFText">'+data[i].T_CARNO+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">所属公司</label>'+
								                    '<div class="iFText">'+data[i].T_DCOM+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">投诉类别</label>'+
								                    '<div class="iFText">'+data[i].COMP_BTYPE+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">事件内容</label>'+
								                '<div class="iFTextArea" style="padding-left: 5em;">'+utils(data[i].CONTENT)+'</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">处理结果</label>'+
								                '<div class="iFTextArea" style="padding-left: 5em;">'+utils(data[i].RESULT)+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#tsjl-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						tsjlDialogPanel.set('href', 'app/html/oa/editor/tsjlEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    tsjlDialog.show().then(function () {
	                        tsjlDialog.set('title', '修改');
//	                        findcomp('').then(function(data){
//								xlktyff("tsjl-gsmc-ul",data.datas);
//							});
//	                        findcomp('').then(function (data) {
//								xlktyff("tsjl-ssgs-ul", data.datas);
//							});
//							findcomp('').then(function (data) {
//								xlktyff("tsjl-tsssgs-ul", data.datas);
//							});
	                         query('#tsjlEditorPanel .iFComboBox').on('click', function () {
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
							addEventComboBox('#tsjlEditorPanel');
	                        $("#tsjl-slgh").val(USERS);
	                        $("#tsjl-slsj").val(new Date(base.DB_TIME).format('yyyy-MM-dd hh:mm:ss'));
	                        $("#tsjl-ywdh").val(base.BU_NO);
	                        $("#tsjl-pdgh").val(base.TO_BU_NO);
	                        $("#tsjl-tslx").val(base.COMP_TYPE);
	                        $("#tsjl-tslb").val(base.COMP_BTYPE);
	                        $("#tsjl-fwdx").val(base.SER_TYPE);
	                        $("#tsjl-ssgs").val(base.COM_NAME);
	                        $("#tsjl-ckxm").val(base.CLI_NAME);
	                        $("#tsjl-ckdh").val(base.T_CTEL);
	                        $("#tsjl-tscp").val(base.T_CARNO);
	                        $("#tsjl-tsssgs").val(base.T_DCOM);
	                        $("#tsjl-cphm").val(base.CAR_NO);
	                        $("#tsjl-tsck").val(base.T_CNAME);
	                        $("#tsjl-ckdh").val(base.CLI_TEL);
	                        $("#tsjl-ycsj").val(base.ON_CAR_TIME.length<5?'':new Date(base.ON_CAR_TIME).format('yyyy-MM-dd hh:mm:ss'));
	                        $("#tsjl-yclx").val(base.ON_CAR_TYPE);
	                        $("#tsjl-ycdd").val(base.ON_CAR_ADD);
	                        $("#tsjl-clgh").val(base.USER_NO);
	                        $("#tsjl-hxcl").val(base.AFERT_ACTION_YPE);
	                        $("#tsjl-sjnr").text(base.CONTENT);
	                        $("#tsjl-cljg").text(base.RESULT);
	                        $("#tsjl-bz").text(base.REMARK);
	                        $("#tsjl-slgh").attr("disabled", true);
	                        $("#tsjl-clgh").val(user);
	                        console.log(base);
	                        if(base.SER_TYPE =='乘客'){
	                        	$('.ckBox').show();
                                $('.ckBox1').show();
                                $('.sjBox').hide();
                                $("#tsjl-ckdh-label").text('乘客电话');
                                $('#tsjlEditor-ssgsBox').hide();
                                $('#tsjlEditor-tsssgsBox').show();
                                $('#tsjlEditor-ssgs input').data('value', '').val('');
	                        }else if(base.SER_TYPE == '司机'){
	                        	$('.ckBox').hide();
                                $('.sjBox').show();
                                $('.ckBox1').show();
                                $("#tsjl-ckdh-label").text('司机电话');
                                $('#tsjlEditor-ssgsBox').show();
                                $('#tsjlEditor-tsssgsBox').hide();
                                $('#tsjlEditor-ssgs input').data('value', '').val('');
	                        }
	                        $('#tsjlEditor-fwdx input').on('change', function () {
	                            if (0 === $(this).data('value')) {
	                                $('.ckBox').show();
	                                $('.ckBox1').show();
	                                $('.sjBox').hide();
	                                $("#tsjl-ckdh-label").text('乘客电话');
	                                $('#tsjlEditor-ssgsBox').hide();
	                                $('#tsjlEditor-tsssgsBox').show();
	                                $('#tsjlEditor-ssgs input').data('value', '').val('');
	                            } else if (1 === $(this).data('value')) {
	                                $('.ckBox').hide();
	                                $('.sjBox').show();
	                                $('.ckBox1').show();
	                                $("#tsjl-ckdh-label").text('司机电话');
	                                $('#tsjlEditor-ssgsBox').show();
	                                $('#tsjlEditor-tsssgsBox').hide();
	                                $('#tsjlEditor-ssgs input').data('value', '').val('');
	                            }
	                        });
	                        query('#tsjlEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("tsjl-form");
                            	FormJson.COMP_ID = base.COMP_ID;
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/edittsjl",
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
												tsjlDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#tsjlEditorPanel .iFBtnClose').on('click', function () {tsjlDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').COMP_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#tsjlPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#tsjlPanel');
				var _self = this;
				query('#tsjlQuery').on('click', function () {
					_self.getCzrzTable({"time":$("#tsjl-cxsh").val(),"gjz":$("#tsjl-gjz").val()});
				});
				query('#tsjl-dcsj').on('click', function () {
					var postData = {"time":$("#tsjl-cxsh").val(),"gjz":$("#tsjl-gjz").val()};
						url = "OA/tsjlexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#tsjl-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="tsjl-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#tsjl-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#tsjl-endTime').trigger('focus')
						},
						dateFmt: STATEYEARMONTH
					});
				});
				query('#tsjl-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});

				query('#tsjl-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#tsjl-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#tsjl-allSelect');
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
							var id = '#tsjl', info = oaDialogInfo[type](id, '投诉记录');
							query(info.id).on('click', function () {
								tsjlDialogPanel.set('href', 'app/html/oa/editor/tsjlEditor.html');
								tsjlDialog.show().then(function () {
									tsjlDialog.set('title', info.title);
									query(id + 'Editor-sj').on('focus', function () {
										WdatePicker({dateFmt: STATEDATETIME});
									});
									$('#tsjl-slsj').val(new Date().format('yyyy-MM-dd hh:mm:ss'));
									$('#tsjlEditor-fwdx input').on('change', function () {
										if (0 === $(this).data('value')) {
											$('.ckBox').show();
											$('.ckBox1').show();
											$('.sjBox').hide();
											$("#tsjl-ckdh-label").text('乘客电话');
											$('#tsjlEditor-ssgsBox').hide();
											$('#tsjlEditor-tsssgsBox').show();
											$('#tsjlEditor-ssgs input').data('value', '').val('');
										} else if (1 === $(this).data('value')) {
											$('.ckBox').hide();
											$('.sjBox').show();
											$('.ckBox1').show();
											$("#tsjl-ckdh-label").text('司机电话');
											$('#tsjlEditor-ssgsBox').show();
											$('#tsjlEditor-tsssgsBox').hide();
											$('#tsjlEditor-ssgs input').data('value', '').val('');
										}
									});
									$("#tsjl-tscp").change(function(){
					                	if($("#tsjl-tscp").val().length==7){
					                		var xhrArgs2 = {
					                				url : basePath  + "OA/findclgs",
					                				postData : {
					                					"vhic" : $("#tsjl-tscp").val()
					                				},
					                				handleAs : "json",
					                				Origin : self.location.origin,
					                				preventCache:true,
					                				withCredentials :  true,
					                				load : function(data) {
					                					console.log(data)
					                					if(data.length>0){
					                						$("#tsjl-tsssgs").val(data[0].COMP_NAME);
					                					}else{
					                						$("#tsjl-tsssgs").val("");
					                					}
					                				}
					                		}
					                		dojo.xhrPost(xhrArgs2);
					                	}else{
					                		$("#tsjl-tsssgs").val("");
					                	}
					                })
					                $("#tsjl-cphm").change(function(){
					                	if($("#tsjl-cphm").val().length==7){
					                		var xhrArgs2 = {
					                				url : basePath  + "OA/findclgs",
					                				postData : {
					                					"vhic" : $("#tsjl-cphm").val()
					                				},
					                				handleAs : "json",
					                				Origin : self.location.origin,
					                				preventCache:true,
					                				withCredentials :  true,
					                				load : function(data) {
					                					console.log(data)
					                					if(data.length>0){
					                						$("#tsjl-ssgs").val(data[0].COMP_NAME);
					                					}else{
					                						$("#tsjl-ssgs").val("");
					                					}
					                				}
					                		}
					                		dojo.xhrPost(xhrArgs2);
					                	}else{
					                		$("#tsjl-ssgs").val("");
					                	}
					                })
//									findcomp('').then(function (data) {
//										xlktyff("tsjl-ssgs-ul", data.datas);
//									});
//									findcomp('').then(function (data) {
//										xlktyff("tsjl-tsssgs-ul", data.datas);
//									});
									 query(id + 'EditorPanel .iFComboBox').on('click', function () {
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
									addEventComboBox(id + 'EditorPanel');
									$("#tsjl-clgh").val(user);
									query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
										if (type == 'add') {
											var FormJson = getFormJson("tsjl-form");
											var datap = JSON.stringify(FormJson);
											var xhrArgs2 = {
												url: basePath + "OA/addtsjl",
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
														tsjlDialog.hide();
													})
												}
											}
											dojo.xhrPost(xhrArgs2);
										}
									});
									/*取消按钮*/
									query(id + 'EditorPanel .iFBtnClose').on('click', function () {
										tsjlDialog.hide();
									});
								});
							});
						},
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/deltsjl",
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