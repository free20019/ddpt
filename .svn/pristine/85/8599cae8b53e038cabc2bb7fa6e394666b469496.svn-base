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
			url : basePath + "OA/findgccgz",
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
				this.getCzrzTable({"time":$("#gccgz-date").val(),"gjz":$("#gccgz-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				if(USERS != 'hzgps'){
					$("#gccgz-AllDelete").hide();
				}
				xhrArgsTabel.load = function(data) {
					$("#gccgz-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								        '<input type="checkbox" class="iFCheckBox iFCheckboxItem" name="gccgz-Cbdelete" value = "'+data[i].PV_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>[132234]</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">受理时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].ON_TIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
								                    '<label class="iFLabel iFTitleName">受理工号</label>'+
								                    '<div class="iFText">'+data[i].ON_USER_NO+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
								                    '<label class="iFLabel iFTitleName">服务类型</label>'+
								                    '<div class="iFText">'+data[i].SERVER_TYPE+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 35%; line-height: 30px; text-align: center;">';
							                    if(USERS == 'hzgps'){
													tab += '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor">编辑</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect">删除</a>';
												}
						                    tab += '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">事件内容</label>'+
								                '<div class="iFTextArea" style="padding-left: 5em;">'+utils(data[i].CONTENT)+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#gccgz-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click', function () {
						gccgzDialogPanel.set('href', 'app/html/oa/editor/gccgzEditor.html');
						var base = $(this).parents('dd').data('base');
						gccgzDialog.show().then(function () {
							gccgzDialog.set('title', '修改');
							// query('#gccgzEditorPanel .iFComboBox').on('click', function () {
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
							addEventComboBox('#gccgzEditorPanel');
							$("#gccgz-slgh").val(base.ON_USER_NO);
							$("#gccgz-fwlx").val(base.SERVER_TYPE);
							$("#gccgz-slfs").val(base.CTYPE);
							$("#gccgz-yhxm").val(base.CNAME);
							$("#gccgz-yhdh").val(base.CTEL);
							$("#gccgz-clgh").val(base.ACTION_NO);
							$("#gccgz-hxcl").val(base.AFERT_ACTION);
							$("#gccgz-slsj").val(setformat1(new Date(base.ON_TIME)));
							$("#gccgz-cljg").text(base.ALERT_ACTION_CONTENT);
							$("#gccgz-sjnr").text(base.CONTENT);
							$("#xtgz-jlr").attr("disabled", true);
							query('#gccgzEditorPanel .iFBtnCommit').on('click', function () {//提交
								var FormJson = getFormJson("gccgz-form");
								FormJson.PV_ID = base.PV_ID;
								var datap = JSON.stringify(FormJson);
								var xhrArgs2 = {
									url: basePath + "OA/editgccgz",
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
											gccgzDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
							});
							/*关闭弹框*/
							query('#gccgzEditorPanel .iFBtnClose').on('click', function () {
								gccgzDialog.hide();
							});
						});
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').PV_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#gccgzPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#gccgzPanel');
				var _self = this;
				query('#gccgzQuery').on('click', function () {
					_self.getCzrzTable({"time":$("#gccgz-date").val(),"gjz":$("#gccgz-gjz").val()});
				});
				query('#gccgz-excel').on('click', function () {
					var postData = {"time":$("#gccgz-date").val(),"gjz":$("#gccgz-gjz").val()};
						url = "OA/gccgzexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#gccgz-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="gccgz-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#gccgz-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});

				query('#gccgz-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#gccgz-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#gccgz-allSelect');
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
                var id = '#gccgz', info = oaDialogInfo[type]('#gccgz', '工程车故障');
                query(info.id).on('click', function () {
                    gccgzDialogPanel.set('href', 'app/html/oa/editor/gccgzEditor.html');
                    gccgzDialog.show().then(function () {
                        gccgzDialog.set('title', info.title);
                        // query(id + 'EditorPanel .iFComboBox').on('click', function () {
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
											addEventComboBox(id + 'EditorPanel');
                        $("#gccgz-slsj").val(setformat1(new Date));
                        $("#gccgz-slgh").val(USERS);
                        query('#gccgzEditorPanel .iFBtnCommit').on('click', function () {//提交
                            if(type=='add'){
                            	var FormJson = getFormJson("gccgz-form");
                            	if(FormJson.ON_TIME.length==0){
                            		dijit.byId('qd_dialog').show().then(function() {
            							$("#czjg").html('时间不能为空！');
            						});
            		        		return;
                            	}
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/addgccgz",
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
												gccgzDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
                            }
                            });
                        /*取消按钮*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {gccgzDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/delgccgz",
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