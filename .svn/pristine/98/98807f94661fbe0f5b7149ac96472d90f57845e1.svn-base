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
			url : basePath + "OA/findjltj",
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
				this.getCzrzTable({"stime":$("#jltj-startTime").val(),"etime":$("#jltj-endTime").val(),"gjz":$("#jltj-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#jltj-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						var tab = '<dd class="iFItem iFContent">'+
								    '<div class="iFTabularPanel">'+
							        '<div class="iFTitle">'+
							            '<input type="checkbox" class="iFCheckBox iFCheckboxItem" value="'+data[i].AD_ID+'" name="jltj-Cbdelete">'+
							            '<label>记录编号</label>'+
							            '<span>['+data[i].AD_ID+']</span>'+
							        '</div>'+
							        '<div class="iFContent" data-numId="'+(i+1)+'">'+
							            '<div class="iFWAuto iFItem clearfix">'+
							                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
							                    '<label class="iFLabel iFTitleName">报警时间</label>'+
							                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].AD_DBTIME)+'</div>'+
							                '</div>'+
							                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
							                    '<label class="iFLabel iFTitleName">处警工号</label>'+
							                    '<div class="iFText">'+data[i].AD_USERID+'</div>'+
							                '</div>'+
							                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
							                    '<label class="iFLabel iFTitleName">车牌号码</label>'+
							                    '<div class="iFText">'+data[i].AD_CAR_NO+'</div>'+
							                '</div>'+
							                '<div class="iFSubItem iFBtnBox" style="width: 35%; line-height: 30px; text-align: center;">'+
							                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor jltjEditor">编辑</a>'+
							                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect jltjDelete" >删除</a>'+
							                '</div>'+
							            '</div>'+
							            '<div class="iFWAuto iFItem clearfix">'+
							                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
							                    '<label class="iFLabel iFTitleName">定位情况</label>'+
							                    '<div class="iFText">'+data[i].AD_GPS+'</div>'+
							                '</div>'+
							                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
							                    '<label class="iFLabel iFTitleName">监听情况</label>'+
							                    '<div class="iFText">'+data[i].AD_LISTENCASE+'</div>'+
							                '</div>'+
							                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
							                    '<label class="iFLabel iFTitleName">司机电话</label>'+
							                    '<div class="iFText">'+data[i].DRIVER_TEL+'</div>'+
							                '</div>'+
							            '</div>'+
							            '<div class="iFItem iFTextAreaItem">'+
							                '<label class="iFLabel iFTitleName">事件内容</label>'+
							                '<div class="iFTextArea" style="padding-left: 5em;">'+utils(data[i].AD_CONDITION)+'</div>'+
							            '</div>'+
							        '</div>'+
							    '</div>'+
							'</dd>';
								$(tab).data('base', data[i]).appendTo('#jltj-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						jltjDialogPanel.set('href', 'app/html/oa/editor/jltjEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    jltjDialog.show().then(function () {
	                        jltjDialog.set('title', '修改');
	                        $("#jltj-clgh").val(base.AD_USERID);
	                        $("#jltj-cphm").val(base.AD_CAR_NO);
	                        $("#jltj-sjdh").val(base.DRIVER_TEL);
	                        $("#jltjEditor-bjsj").val(setformat1(new Date(base.AD_DBTIME)));
	                        $("#jltjEditor-cjsj").val(setformat1(new Date(base.AD_DEALTIME)));
	                        $("#jltjEditor-jtsj").val(setformat1(new Date(base.AD_LISTENTIME)));
	                        $("#jltj-sjnr").text(base.AD_CONDITION);
	                        $("#jltj-bz").text(base.AD_MEMO);
	                        $("input:radio[name=AD_LASTDEAL][value="+base.AD_LASTDEAL+"]").attr("checked",true);  
	                        $("input:radio[name=AD_ALERTTYPE][value="+base.AD_ALERTTYPE+"]").attr("checked",true); 
	                        if(base.AD_LISTENCASE=='无异常'){
	                        	$("input:radio[name=jtqk][value=无异常]").attr("checked",true); 
	                        }else{
	                        	$("input:radio[name=jtqk][value=异常]").attr("checked",true); 
	                        	$("#jltjEditor-jtqkycText").val(base.AD_LISTENCASE);
	                        }
	                        if(base.AD_GPS=='非精确'){
	                        	$("input:radio[name=dwqk][value=非精确]").attr("checked",true); 
	                        }else{
	                        	$("input:radio[name=dwqk][value=在]").attr("checked",true);
	                        	$("#jltjEditor-dwqzaiText").val(base.AD_GPS);
	                        }
	                        if(base.AD_RESULT=='报警解除'){
	                        	$("input:radio[name=cljg][value=报警解除]").attr("checked",true);
	                        }else{
	                        	$("input:radio[name=cljg][value=其它]").attr("checked",true);
	                        	$("#jltjEditor-cljgqtText").val(base.AD_RESULT);
	                        }
	                        query('#jltjEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("jltj-form");
                            	if(FormJson.AD_CAR_NO.length==0){
                            		dijit.byId('qd_dialog').show().then(function() {
            							$("#czjg").html('车牌号码不能为空！');
            						});
            		        		return;
                            	}
                            	FormJson.AD_ID = base.AD_ID;
                            	if(FormJson.jtqk=='无异常'){
                            		FormJson.AD_LISTENCASE = "无异常";
                            	}else{
                            		FormJson.AD_LISTENCASE = $("#jltjEditor-jtqkycText").val();
                            	}
                            	if(FormJson.dwqk=='非精确'){
                            		FormJson.AD_GPS = "非精确";
                            	}else{
                            		FormJson.AD_GPS = $("#jltjEditor-dwqzaiText").val();
                            	}
                            	if(FormJson.cljg=='报警解除'){
                            		FormJson.AD_RESULT = "报警解除";
                            	}else{
                            		FormJson.AD_RESULT = $("#jltjEditor-cljgqtText").val();
                            	}
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/editjltj",
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
												jltjDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#jltjEditorPanel .iFBtnClose').on('click', function () {jltjDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').AD_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#jltjPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#jltjPanel');
				var _self = this;
				query('#jltjQuery').on('click', function () {
					_self.getCzrzTable({"stime":$("#jltj-startTime").val(),"etime":$("#jltj-endTime").val(),"gjz":$("#jltj-gjz").val()});
				});
				query('#jltj-dcsj').on('click', function () {
					var postData = {"stime":$("#jltj-startTime").val(),"etime":$("#jltj-endTime").val(),"gjz":$("#jltj-gjz").val()};
						url = "OA/jltjexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#jltj-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="jltj-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#jltj-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#jltj-endTime').trigger('focus')
						},
						dateFmt: STATEDATETIME
					});
				});
				query('#jltj-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEDATETIME});
				});

				query('#jltj-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#jltj-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#jltj-allSelect');
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
                var id = '#jltj', info = oaDialogInfo[type](id, '记录统计');
                query(info.id).on('click', function () {
                    jltjDialogPanel.set('href', 'app/html/oa/editor/jltjEditor.html');
                    jltjDialog.show().then(function () {
                        jltjDialog.set('title', info.title);
                        /*query(id + 'EditorPanel .iFComboBox').on('click', function () {
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
                        });*/
											addEventComboBox('#jltjEditorPanel');
                        query(id + 'Editor-jtqkycText').on('click', function () {
							$('#jltjEditor-jtqkyc').trigger('click');
                        });
                        query(id + 'Editor-dwqzaiText').on('click', function () {
							$('#jltjEditor-dwqzai').trigger('click');
                        });
                        query(id + 'Editor-cljgqtText').on('click', function () {
							$('#jltjEditor-cljgqt').trigger('click');
                        });
                        $("#jltj-clgh").val(USERS+"("+REALNAMES+")");
                        $("#jltjEditor-bjsj").val(setformat1(new Date));
                        $("#jltjEditor-cjsj").val(setformat1(new Date));
                        $("#jltjEditor-jtsj").val(setformat1(new Date));
                        query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
                        	if(type=='add'){
                            	var FormJson = getFormJson("jltj-form");
                            	if(FormJson.AD_CAR_NO.length==0){
                            		dijit.byId('qd_dialog').show().then(function() {
            							$("#czjg").html('车牌号码不能为空！');
            						});
            		        		return;
                            	}
                            	if(FormJson.jtqk=='无异常'){
                            		FormJson.AD_LISTENCASE = "无异常";
                            	}else{
                            		FormJson.AD_LISTENCASE = $("#jltjEditor-jtqkycText").val();
                            	}
                            	if(FormJson.dwqk=='非精确'){
                            		FormJson.AD_GPS = "非精确";
                            	}else{
                            		FormJson.AD_GPS = $("#jltjEditor-dwqzaiText").val();
                            	}
                            	if(FormJson.cljg=='报警解除'){
                            		FormJson.AD_RESULT = "报警解除";
                            	}else{
                            		FormJson.AD_RESULT = $("#jltjEditor-cljgqtText").val();
                            	}
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/addjltj",
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
    											jltjDialog.hide();
    										})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
                            }
                        });
                        /*取消按钮*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {jltjDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/deljltj",
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
					dojo.xhrPost(xhrArgsdel);
            }
		})
	});