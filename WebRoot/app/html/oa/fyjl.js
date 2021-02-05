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
			url : basePath + "OA/findfyjl",
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
				this.getCzrzTable({"time":$("#fyjl-date").val(),"gjz":$("#fyjl-gjz").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#fyjl-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								            '<input type="checkbox" class="iFCheckBox iFCheckboxItem" name="fyjl-Cbdelete" value="'+data[i].ENG_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].ENG_ID+']</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].DATE_TIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">接待工号</label>'+
								                    '<div class="iFText">'+data[i].USER_NO+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">语种</label>'+
								                    '<div class="iFText">'+data[i].LANGUAGE_TYPE+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 35%; line-height: 30px; text-align: center;">'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor fyjlEditor">编辑</a>'+
								                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect fyjlDelete">删除</a>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">服务对象</label>'+
								                    '<div class="iFText">'+data[i].CLICENT_TYPE+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">服务类别</label>'+
								                    '<div class="iFText">'+data[i].SERVICE_TYPE+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">处理结果</label>'+
								                    '<div class="iFText">'+data[i].RESULT+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">服务反馈</label>'+
								                    '<div class="iFText">'+data[i].RESULT_BREAK+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">车牌号码</label>'+
								                    '<div class="iFText">'+data[i].CLICENT_NAME+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">司机电话</label>'+
								                    '<div class="iFText">'+data[i].CLICENT_TEL+'</div>'+
								                '</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">服务内容</label>'+
								                '<div class="iFTextArea" style="padding-left: 5em;">'+data[i].SERVICE_CONTENT+'</div>'+
								            '</div>'+
								            '<div class="iFItem iFTextAreaItem">'+
								                '<label class="iFLabel iFTitleName">备注</label>'+
								                '<div class="iFTextArea">'+data[i].REMARK+'</div>'+
								            '</div>'+
								        '</div>'+
								    '</div>'+
								'</dd>';
								$(tab).data('base', data[i]).appendTo('#fyjl-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click', function () {
						fyjlDialogPanel.set('href', 'app/html/oa/editor/fyjlEditor.html');
						var base = $(this).parents('dd').data('base');
						fyjlDialog.show().then(function () {
							fyjlDialog.set('title', '修改');
							findcomp('').then(function (data) {
								xlktyff("fyjl-gs-ul", data.datas);
								comboboxDFun('#car-comboBox')
							});
							// query('#fyjlEditorPanel .iFComboBox').on('click', function () {
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
							addEventComboBox('#fyjlEditorPanel');
							$("#fyjl-jdgh").val(USERS);
							$("#fyjl-fwlb").val(base.SERVICE_TYPE);
							$("#fyjl-yz").val(base.LANGUAGE_TYPE);
							$("#fyjl-fwdx").val(base.CLICENT_TYPE);
							$("#fyjl-cphm").val(base.CLICENT_NAME);
							$("#fyjl-sjdh").val(base.CLICENT_TEL);
							$("#fyjlEditor-sj").val(setformat1(new Date(base.DATE_TIME)));
							$("#fyjl-fwnr").text(base.SERVICE_CONTENT);
							$("#fyjl-bz").text(base.REMARK);
							$("#fyjl-jdgh").attr("disabled", true);
							if (base.CLICENT_TYPE == '乘客') {
								$("#fyjl-cphm-label").text("乘客姓名");
								$("#fyjl-sjdh-label").text("乘客电话");
							} else if (base.CLICENT_TYPE == '司机') {
								$("#fyjl-cphm-label").text("车牌号码");
								$("#fyjl-sjdh-label").text("司机电话");
							}
							$(":radio[name='RESULT'][value='" + base.RESULT + "']").attr("checked", "checked");
							$(":radio[name='RESULT_BREAK'][value='" + base.RESULT_BREAK + "']").attr("checked", "checked");
							$('#fyjlEditor-fwdx input').on('change', function () {
								if (0 === $(this).data('value')) {
									$("#fyjl-cphm-label").text("乘客姓名");
									$("#fyjl-sjdh-label").text("乘客电话");
								} else if (1 === $(this).data('value')) {
									$("#fyjl-cphm-label").text("车牌号码");
									$("#fyjl-sjdh-label").text("司机电话");
								}
							});
							query('#fyjlEditorPanel .iFBtnCommit').on('click', function () {//提交
								var FormJson = getFormJson("fyjl-form");
								FormJson.ENG_ID = base.ENG_ID;
								var datap = JSON.stringify(FormJson);
								var xhrArgs2 = {
									url: basePath + "OA/editfyjl",
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
											fyjlDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
							});
							/*关闭弹框*/
							query('#fyjlEditorPanel .iFBtnClose').on('click', function () {
								fyjlDialog.hide();
							});
						});
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').ENG_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#fyjlPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#fyjlPanel');
				var _self = this;
				query('#fyjlQuery').on('click', function () {
					_self.getCzrzTable({"time":$("#fyjl-date").val(),"gjz":$("#fyjl-gjz").val()});
				});
				query('#fyjl-dcsj').on('click', function () {
					var postData = {"time":$("#fyjl-date").val(),"gjz":$("#fyjl-gjz").val()};
						url = "OA/fyjlexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#fyjl-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="fyjl-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#fyjl-startTime').on('focus', function () {
					WdatePicker({
						onpicked: function () {
							$('#fyjl-endTime').trigger('focus')
						},
						dateFmt: STATEYEARMONTH
					});
				});
				query('#fyjl-endTime').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});

				query('#fyjl-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#fyjl-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#fyjl-allSelect');
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
                var id = '#fyjl', info = oaDialogInfo[type](id, '翻译记录');
                query(info.id).on('click', function () {
                    fyjlDialogPanel.set('href', 'app/html/oa/editor/fyjlEditor.html');
                    fyjlDialog.show().then(function () {
                        fyjlDialog.set('title', info.title);
                        query(id + 'Editor-sj').on('focus', function () {
                            WdatePicker({dateFmt: STATEDATETIME});
                        });
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
                        $("#fyjlEditor-sj").val(setformat1(new Date()));
                        $("#fyjl-jdgh").val(USERS);
                        $('#fyjlEditor-fwdx input').on('change', function () {
                            if (0 === $(this).data('value')) {
                            	$("#fyjl-cphm-label").text("乘客姓名");
                            	$("#fyjl-sjdh-label").text("乘客电话");
                            } else if (1 === $(this).data('value')) {
                            	$("#fyjl-cphm-label").text("车牌号码");
                            	$("#fyjl-sjdh-label").text("司机电话");
                            }
                        });
                        query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
                        	if(type=='add'){
                            	var FormJson = getFormJson("fyjl-form");
                            	if(FormJson.SERVICE_CONTENT.length==0){
                            		dijit.byId('qd_dialog').show().then(function() {
            							$("#czjg").html('服务内容不能为空！');
            						});
            		        		return;
                            	}
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/addfyjl",
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
    											fyjlDialog.hide();
    										})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
                            }
                        });
                        /*取消按钮*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {fyjlDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/delfyjl",
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