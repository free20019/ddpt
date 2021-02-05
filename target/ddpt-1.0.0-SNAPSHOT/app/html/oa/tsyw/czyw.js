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
				url : basePath + "OA/findczyw",
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
				this.getCzywTable({"time":$("#czyw-date").val(),"gjz":$("#czyw-gjz").val(),"type":$("#czyw-ywlx").val()});
			},
			getCzywTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#czyw-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
									    '<div class="iFTitle">'+
									    '<input type="checkbox" name="czyw-Cbdelete" class="iFCheckBox iFCheckboxItem" value = "'+data[i].OWD_ID+'">'+
									    '<label>记录编号</label>'+
									    '<span>['+data[i].OWD_ID+']</span>'+
									    '</div>'+
									    '<div class="iFContent" data-numId="'+(i+1)+'">'+
									    '<div class="iFWAuto iFItem clearfix">'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									    '<label class="iFLabel iFTitleName">业务编号</label>'+
									    '<div class="iFText">'+data[i].DISP_ID+'</div>'+
									    '</div>'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
									    '<label class="iFLabel iFTitleName">业务类型</label>'+
									    '<div class="iFText">'+data[i].TYPE+'</div>'+
									    '</div>'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
									    '<label class="iFLabel iFTitleName">调度时间</label>'+
									    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].OWD_TIME)+'</div>'+
									'</div>'+
									'<div class="iFSubItem iFBtnBox" style="width: 40%; line-height: 30px; text-align: center;">'+
									    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor">编辑</a>'+
									    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect">删除</a>'+
									    '</div>'+
									    '</div>'+
									    '<div class="iFWAuto iFItem clearfix">'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									    '<label class="iFLabel iFTitleName">客户姓名</label>'+
									    '<div class="iFText">'+data[i].CI_NAME+'</div>'+
									    '</div>'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									    '<label class="iFLabel iFTitleName">客户电话</label>'+
									    '<div class="iFText">'+data[i].DISP_TEL+'</div>'+
									    '</div>'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									    '<label class="iFLabel iFTitleName">调度员工号</label>'+
									    '<div class="iFText">'+data[i].REAL_NAME+'('+data[i].USER_NAME+')</div>'+
									    '</div>'+
									    '<div class="iFSubItem iFInlineBox" style="width: 40%">'+
									    '<label class="iFLabel iFTitleName">详细地址</label>'+
									    '<div class="iFText">'+data[i].ADDRESS+'</div>'+
									    '</div>'+
									    '</div>'+
									    '<div class="iFWAuto iFItem clearfix">'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									    '<label class="iFLabel iFTitleName">车牌号</label>'+
									    '<div class="iFText">'+data[i].VEHI_NO+'</div>'+
									    '</div>'+
									    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									    '<label class="iFLabel iFTitleName">SIM卡号</label>'+
									    '<div class="iFText">'+data[i].SIM_NUM+'</div>'+
									    '</div>'+
//									    '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
//									    '<label class="iFLabel iFTitleName">终端名称</label>'+
//									    '<div class="iFText"></div>'+
//									    '</div>'+
									    '<div class="iFSubItem iFInlineBox" style="width: 40%">'+
									    '<label class="iFLabel iFTitleName">所属公司</label>'+
									    '<div class="iFText">'+data[i].COMP_NAME+'</div>'+
									    '</div>'+
									    '</div>'+
									    '<div class="iFItem iFTextAreaItem">'+
									    '<label class="iFLabel iFTitleName">备注</label>'+
									    '<div class="iFTextArea">'+data[i].NOTE+'</div>'+
									'</div>'+
									'</div>'+
									'</div>'+
									'</dd>';
								$(tab).data('base', data[i]).appendTo('#czyw-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click', function () {
						czywDialogPanel.set('href', 'app/html/oa/editor/czywEditor.html');
						var base = $(this).parents('dd').data('base');
						czywDialog.show().then(function () {
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
							addEventComboBox('#czyw-form');

							czywDialog.set('title', '修改');
							$("#czyw-ywbh").val(base.DISP_ID);
							$("#czyw-ywlx").val(base.TYPE);
							$("#czyw-khxm").val(base.CI_NAME);
							$("#czywEditor-ddsj").val(new Date(base.OWD_TIME).format('yyyy-MM-dd hh:mm:ss'));
							$("#czyw-khdh").val(base.DISP_TEL);
							$("#czyw-xxdz").val(base.ADDRESS);
							$("#czyw-cphm").val(base.VEHI_NO);
							$("#czyw-ddygh").val(base.USER_NAME);
							$("#czyw-bz").text(base.NOTE);
							$("#czyw-ddygh").attr("disabled", true);
							$("#czywEditor-ddsj").attr("disabled", true);
							query('#czywEditorPanel .iFBtnCommit').on('click', function () {//提交
								var FormJson = getFormJson("czyw-form");
								FormJson.OWD_ID = base.OWD_ID;
								var datap = JSON.stringify(FormJson);
								var xhrArgs2 = {
									url: basePath + "OA/editczyw",
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
											czywDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
							});
							/*关闭弹框*/
							query('#czywEditorPanel .iFBtnClose').on('click', function () {
								czywDialog.hide();
							});
                        });
						});
//					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').OWD_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				query('#czywPanel .iFComboBox').on('click', function () {
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
				var _self = this;
				query('#czywQuery').on('click', function () {
					_self.getCzywTable({"time":$("#czyw-date").val(),"gjz":$("#czyw-gjz").val(),"type":$("#czyw-ywlx").val()});
				});
				query('#czyw-dcsj').on('click', function () {
					var postData = {
							"time":$("#czyw-date").val(),"gjz":$("#czyw-gjz").val(),"type":$("#czyw-ywlx").val()
						};
						url = "OA/czywexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#czyw-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});
				query('#czyw-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="czyw-Cbdelete"]:checked').each(function(){
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#czyw-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#czyw-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#czyw-allSelect');
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
                var id = '#czyw', info = oaDialogInfo[type](id, '出租业务');
                query(info.id).on('click', function () {
                    czywDialogPanel.set('href', 'app/html/oa/editor/czywEditor.html');
                    czywDialog.show().then(function () {
                        czywDialog.set('title', info.title);
                        query(id+'Editor-ddsj').on('focus', function () {
                            WdatePicker({dateFmt: STATEDATETIME});
                        });
                        query(id+'EditorPanel .iFComboBox').on('click', function () {
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
                        $("#czywEditor-ddsj").val(new Date().format('yyyy-MM-dd hh:mm:ss'));
                        $("#czyw-ddygh").val(USERS);
                        query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
                        if(type=='add'){
                        	var FormJson = getFormJson("czyw-form");
                        	if(FormJson.OWD_TIME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('时间不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "OA/addczyw",
									postData : {
										"postData" : datap
									},
									handleAs : "json",
									Origin : self.location.origin,
									preventCache:true,
									withCredentials :  true,
									load : function(data) {
										if(data.info.indexOf('已存在')>=0){
											dijit.byId('qd_dialog').show().then(function() {
												$("#czjg").html(data.info);
											})
										}else{
											dijit.byId('qd_dialog').show().then(function() {
												$("#czjg").html(data.info);
												dojo.xhrPost(xhrArgsTabel);
												czywDialog.hide();
											})
										}
									}
								}
								dojo.xhrPost(xhrArgs2);
                        }
                        });
                        /*关闭弹框*/
                        query(id+'EditorPanel .iFBtnClose').on('click', function () {czywDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/delczyw",
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