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
			url : basePath + "OA/findxtgz",
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
				this.getCzrzTable({"time":$("#czgz-date").val(),"gjz":$("#czgz-gjz").val(),"type":"0","state":$("#czgz-type").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#czgz-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								            '<input type="checkbox" class="iFCheckBox iFCheckboxItem" name="czgz-Cbdelete" value = "'+data[i].OSM_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].OSM_ID+']</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].DATETIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
								                    '<label class="iFLabel iFTitleName">记录人</label>'+
								                    '<div class="iFText">'+data[i].OSM_USER+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
								                    '<label class="iFLabel iFTitleName">状态</label>'+
								                    '<div class="iFText">'+(data[i].TYPE=="1"?"已修好":"未修好")+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 35%; line-height: 30px; text-align: center;">'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor">编辑</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect">删除</a>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">内容</label>'+
								                '<div class="iFTextArea">'+utils(data[i].CONTENT)+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#czgz-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						czgzDialogPanel.set('href', 'app/html/oa/editor/xtgzEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    czgzDialog.show().then(function () {
	                        czgzDialog.set('title', '修改');
													// query('#xtgzEditorPanel .iFComboBox').on('click', function () {
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
												addEventComboBox('#xtgzEditorPanel');
	                        $("#xtgz-zt").val(base.TYPE=='1'?'已修好':'未修好');
	                        $("#xtgz-jlr").val(base.OSM_USER);
	                        $("#czgzDialogPanel #xtgzEditor-sj").val(setformat1(new Date(base.DATETIME)));
	                        $("#xtgz-nr").text(base.CONTENT);
	                        $("#xtgz-jlr").attr("disabled", true);
	                        query('#xtgzEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("xtgz-form");
                            	FormJson.OSM_ID = base.OSM_ID;
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/editxtgz",
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
												czgzDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#xtgzEditorPanel .iFBtnClose').on('click', function () {czgzDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').OSM_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				query('#czgzPanel .iFComboBox').on('click', function () {
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
				query('#czgzQuery').on('click', function () {
					_self.getCzrzTable({"time":$("#czgz-date").val(),"gjz":$("#czgz-gjz").val(),"type":"0","state":$("#czgz-type").val()});
				});
				query('#czgz-excel').on('click', function () {
					var postData = {"time":$("#czgz-date").val(),"gjz":$("#czgz-gjz").val(),"type":"0","state":$("#czgz-type").val()};
						url = "OA/xtgzexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#czgz-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});
				query('#czgz-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="czgz-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#czgz-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#czgz-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#czgz-allSelect');
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
                var id = '#xtgz', info = oaDialogInfo[type]('#czgz', '出租故障');
                query(info.id).on('click', function () {
                    czgzDialogPanel.set('href', 'app/html/oa/editor/xtgzEditor.html');
                    czgzDialog.show().then(function () {
                        czgzDialog.set('title', info.title);
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
                        $("#czgzDialogPanel #xtgzEditor-sj").val(setformat1(new Date));
                        $("#xtgz-jlr").val(USERS);
                        query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
                            if(type=='add'){
                            	var FormJson = getFormJson("xtgz-form");
                            	if(FormJson.DATETIME.length==0){
                            		dijit.byId('qd_dialog').show().then(function() {
            							$("#czjg").html('时间不能为空！');
            						});
            		        		return;
                            	}
                            	FormJson.OSM_TYPE = "0";
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/addxtgz",
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
												czgzDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
                            }
                            });
                        /*取消按钮*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {czgzDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/delxtgz",
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