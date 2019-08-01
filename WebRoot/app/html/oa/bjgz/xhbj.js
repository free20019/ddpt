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
			url : basePath + "OA/findbjgz",
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
				this.getCzrzTable({"time":$("#xhbj-date").val(),"gjz":$("#xhbj-gjz").val(),"table":"TB_OA_XMALVEHI","type":$("#xhbj-type").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#xhbj-infoPanel dd").remove();
					for(var i=0; i<data.length; i++){
						user = data[0].USER;
						var tab = '<dd class="iFItem iFContent">'+
									    '<div class="iFTabularPanel">'+
								        '<div class="iFTitle">'+
								            '<input type="checkbox" class="iFCheckBox iFCheckboxItem" name="xhbj-Cbdelete" value = "'+data[i].OMV_ID+'">'+
								            '<label>记录编号</label>'+
								            '<span>['+data[i].OMV_ID+']</span>'+
								        '</div>'+
								        '<div class="iFContent" data-numId="'+(i+1)+'">'+
								            '<div class="iFWAuto iFItem clearfix">'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
								                    '<label class="iFLabel iFTitleName">车牌号</label>'+
								                    '<div class="iFText">'+data[i].VEHI_NO+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 25%">'+
								                    '<label class="iFLabel iFTitleName">时间</label>'+
								                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].DATETIME)+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
								                    '<label class="iFLabel iFTitleName">记录人</label>'+
								                    '<div class="iFText">'+data[i].OMV_USER+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
								                    '<label class="iFLabel iFTitleName">状态</label>'+
								                    '<div class="iFText">'+(data[i].TYPE=='1'?"已修好":"未修好")+'</div>'+
								                '</div>'+
								                '<div class="iFSubItem iFBtnBox" style="width: 15%; line-height: 30px; text-align: center;">'+
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
								$(tab).data('base', data[i]).appendTo('#xhbj-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click', function () {
						xhbjDialogPanel.set('href', 'app/html/oa/editor/bjgzEditor.html');
						var base = $(this).parents('dd').data('base');
						xhbjDialog.show().then(function () {
							xhbjDialog.set('title', '修改');
							//  query('#bjgzEditorPanel .iFComboBox').on('click', function () {
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
							addEventComboBox('#bjgzEditorPanel');
							$("#bjgz-cphm").val(base.VEHI_NO);
							$("#bjgz-jlr").val(base.OMV_USER);
							$("#bjgz-zt").val(base.TYPE == '1' ? '已修好' : '未修好');
							$("#bjgzEditorPanel #bjgz-jlsj").val(new Date(base.DATETIME).format('yyyy-MM-dd hh:mm:ss'));
							$("#bjgz-nr").text(base.CONTENT);
							$("#bjgz-jlr").attr("disabled", true);
							query('#bjgzEditorPanel .iFBtnCommit').on('click', function () {//提交
								var FormJson = getFormJson("bjgz-form");
								FormJson.OMV_ID = base.OMV_ID;
								FormJson.table = "TB_OA_XMALVEHI";
								var datap = JSON.stringify(FormJson);
								var xhrArgs2 = {
									url: basePath + "OA/editbjgz",
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
											xhbjDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
							});
							/*关闭弹框*/
							query('#bjgzEditorPanel .iFBtnClose').on('click', function () {
								xhbjDialog.hide();
							});
						});
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').OMV_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#xhbjPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#xhbjPanel');
				var _self = this;
				query('#xhbjQuery').on('click', function () {
					_self.getCzrzTable({"time":$("#xhbj-date").val(),"gjz":$("#xhbj-gjz").val(),"table":"TB_OA_XMALVEHI","type":$("#xhbj-type").val()});
				});
				query('#xhbj-dcsj').on('click', function () {
					var postData = {"time":$("#xhbj-date").val(),"gjz":$("#xhbj-gjz").val(),"table":"TB_OA_XMALVEHI","type":$("#xhbj-type").val()};
						url = "OA/bjgzexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#xhbj-AllDelete').on('click', function () {
					var id_array=new Array();
					$('input[name="xhbj-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#xhbj-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});

				query('#xhbj-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#xhbj-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#xhbj-allSelect');
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
                var id = '#bjgz', info = oaDialogInfo[type]('#xhbj', '小货报警');
                query(info.id).on('click', function () {
                    xhbjDialogPanel.set('href', 'app/html/oa/editor/bjgzEditor.html');
                    xhbjDialog.show().then(function () {
                        xhbjDialog.set('title', info.title);
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
                        $("#bjgzEditorPanel #bjgz-jlsj").val(new Date().format('yyyy-MM-dd hh:mm:ss'));
                        $("#bjgz-jlr").val(USERS);
                        $("#bjgz-jlr").attr("disabled", true);
                        query(id + 'EditorPanel .iFBtnCommit').on('click', function () {//提交
	                        if(type=='add'){
	                        	var FormJson = getFormJson("bjgz-form");
	                        	if(FormJson.DATETIME.length==0){
	                        		dijit.byId('qd_dialog').show().then(function() {
	        							$("#czjg").html('时间不能为空！');
	        						});
	        		        		return;
	                        	}
	                        	FormJson.table = "TB_OA_XMALVEHI";
	                        	var datap = JSON.stringify(FormJson);
	                        	var xhrArgs2 = {
										url : basePath  + "OA/addbjgz",
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
												xhbjDialog.hide();
											})
										}
									}
									dojo.xhrPost(xhrArgs2);
	                        }
	                        });
                        /*取消按钮*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {xhbjDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/delbjgz",
						postData :{"id":id,"table":"TB_OA_XMALVEHI"},
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