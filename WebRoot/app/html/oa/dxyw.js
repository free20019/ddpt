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
			url : basePath + "OA/finddxyw",
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
				layer.load(1);
				this.getCzrzTable({"time":$("#dxyw-date").val(),"gjz":$("#dxyw-gjz").val(),"type":$("#dxyw-zt").val()});
			},
			getCzrzTable: function(json) {
				var _self = this;
				xhrArgsTabel.load = function(data) {
					$("#dxyw-infoPanel dd").remove();
					layer.closeAll();
					for(var i=0; i<data.length; i++){
						var tab = '<dd class="iFItem iFContent">'+
										    '<div class="iFTabularPanel">'+
									        '<div class="iFTitle">'+
									            '<input type="checkbox" name="dxyw-Cbdelete" class="iFCheckBox iFCheckboxItem" value = "'+data[i].OADX_ID+'">'+
									            '<label>记录编号</label>'+
									            '<span>['+data[i].OADX_ID+']</span>'+
									        '</div>'+
									        '<div class="iFContent" data-numId="'+(i+1)+'">'+
									            '<div class="iFWAuto iFItem clearfix">'+
									                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									                    '<label class="iFLabel iFTitleName">手机号码</label>'+
									                    '<div class="iFText">'+data[i].SIM_NO+'</div>'+
									                '</div>'+
									                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
									                    '<label class="iFLabel iFTitleName">业务单号</label>'+
									                    '<div class="iFText">'+data[i].GET_NO+'</div>'+
									                '</div>'+
									                '<div class="iFSubItem iFInlineBox" style="width: 20%;">'+
									                    '<label class="iFLabel iFTitleName">状态</label>'+
									                    '<div class="iFText">'+data[i].STATUS+'</div>'+
									                '</div>'+
									                '<div class="iFSubItem iFBtnBox" style="width: 40%; line-height: 30px; text-align: center;">'+
									                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnEditor dxywEditor">编辑</a>'+
									                    '<a href="javascript:void(0);" class="iFBtn iFBtnMin iFBtnDelect dxywDelete">删除</a>'+
									                '</div>'+
									            '</div>'+
									            '<div class="iFWAuto iFItem clearfix">'+
									                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									                    '<label class="iFLabel iFTitleName">所派车牌号</label>'+
									                    '<div class="iFText">'+data[i].VEHI_ID+'</div>'+
									                '</div>'+
									                '<div class="iFSubItem iFInlineBox" style="width: 80%">'+
									                    '<label class="iFLabel iFTitleName" style="width: 7em;">通知客户时间</label>'+
									                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].REC_TIME)+'</div>'+
									                '</div>'+
									            '</div>'+
									            '<div class="iFWAuto iFItem clearfix">'+
									                '<div class="iFSubItem iFInlineBox" style="width: 20%">'+
									                    '<label class="iFLabel iFTitleName">调度员工号</label>'+
									                    '<div class="iFText">'+data[i].USER_NAME+'</div>'+
									                '</div>'+
									                '<div class="iFSubItem iFInlineBox" style="width: 80%">'+
									                    '<label class="iFLabel iFTitleName">抢单时间</label>'+
									                    '<div class="iFText">'+util.formatYYYYMMDDHHMISS(data[i].GET_DATE)+'</div>'+
									                '</div>'+
									            '</div>'+
									            '<div class="iFItem iFTextAreaItem">'+
									                '<label class="iFLabel iFTitleName">内容</label>'+
									                '<div class="iFTextArea">'+utils(data[i].CONTENT)+'</div>'+
									            '</div>'+
									            '<div class="iFItem iFTextAreaItem">'+
									                '<label class="iFLabel iFTitleName">备注</label>'+
									                '<div class="iFTextArea">'+data[i].NOTE+'</div>'+
									            '</div>'+
									        '</div>'+
									    '</div>'+
									'</dd>';
								$(tab).data('base', data[i]).appendTo('#dxyw-infoPanel');
					}
					$(".iFTabularPanel .iFBtnEditor").on('click',function(){
						dxywDialogPanel.set('href', 'app/html/oa/editor/dxywEditor.html');
						 var base = $(this).parents('dd').data('base');
	                    dxywDialog.show().then(function () {
	                        dxywDialog.set('title', '修改');
	                        $("#dxyw-ywdh-e").val(base.GET_NO);
	                        $("#dxywEditor-tzkhsj").val(setformat1(new Date(base.REC_TIME)));
	                        $("#dxyw-zt-e").val(base.STATUS);
	                        $("#dxyw-pfcph-e").val(base.VEHI_ID);
	                        $("#dxyw-sjhm-e").val(base.SIM_NO);
	                        if(base.GET_DATE==''){
	                        	$("#dxywEditor-qdsj").val('');
	                        }else{
	                        	$("#dxywEditor-qdsj").val(setformat1(new Date(base.GET_DATE)));
	                        }
	                        $("#dxyw-ddygh-e").val(base.USER_NAME);
	                        $("#dxyw-nr-e").text(base.CONTENT);
	                        $("#dxyw-bz-e").text(base.NOTE);
	                        $("#dxyw-sjhm-e").attr("disabled", true);
	                        $("#dxywEditor-qdsj").attr("disabled", true);
	                        $("#dxyw-ddygh-e").attr("disabled", true);
	                        query('#dxywEditorPanel .iFBtnCommit').on('click', function () {//提交
                            	var FormJson = getFormJson("dxyw-form");
                            	FormJson.OADX_ID = base.OADX_ID;
                            	var datap = JSON.stringify(FormJson);
                            	var xhrArgs2 = {
    									url : basePath  + "OA/editdxyw",
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
												dxywDialog.hide();
											})
    									}
    								}
    								dojo.xhrPost(xhrArgs2);
	                            });
	                        /*关闭弹框*/
	                        query('#dxywEditorPanel .iFBtnClose').on('click', function () {dxywDialog.hide();});
	                    });         
					})
					$(".iFTabularPanel .iFBtnDelect").on('click',function(){
						_self.deltable($(this).parents('dd').data('base').OADX_ID);
					})
				}
				postData = json;
				dojo.xhrPost(dojo.mixin(xhrArgsTabel,{"postData":'postData='+dojo.toJson(postData)}));
			},
			initToolBar:function(){
				// query('#dxywPanel .iFComboBox').on('click', function () {
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
				addEventComboBox('#dxywPanel');
				var _self = this;
				query('#dxywQuery').on('click', function () {
					layer.load(1);
					_self.getCzrzTable({"time":$("#dxyw-date").val(),"gjz":$("#dxyw-gjz").val(),"type":$("#dxyw-zt").val()});
				});
				query('#dxywExcel').on('click', function () {
					var postData = {"time":$("#dxyw-date").val(),"gjz":$("#dxyw-gjz").val(),"type":$("#dxyw-zt").val()};
						url = "OA/dxywexcle?postData="
							+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url)
				});
				query('#dxyw-date').on('focus', function () {
					WdatePicker({dateFmt: STATEYEARMONTH});
				});
				query('#dxyw-AllDelete').on('click', function () {
					var id_array=new Array();  
					$('input[name="dxyw-Cbdelete"]:checked').each(function(){  
					    id_array.push($(this).val());//向数组中添加元素
					});  
					var idstr=id_array.join(',');//将数组元素连接起来以构建一个字符串
					_self.deltable(idstr);
				});
				query('#dxyw-allSelect').on('change', function () {
					var state = $(this).prop('checked');
					if (state) {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: true});
					} else {
						$(this).parents('.iFTitlePanel').find('.iFCheckboxItem').prop({checked: false});
					}


				});
				query('#dxyw-infoPanel .iFCheckboxItem').on('change', function () {
					var state = $(this).prop('checked'),
						checkboxLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem').length,
						checkedLen = $(this).parents('.iFTitlePanel').find('.iFCheckboxItem:checked').length;
					var allCheckBox = $('#dxyw-allSelect');
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
                var id = '#dxyw', info = oaDialogInfo[type](id, '好人好事');
                query(info.id).on('click', function () {
                    dxywDialogPanel.set('href', 'app/html/oa/editor/dxywEditor.html');
                    dxywDialog.show().then(function () {
                        dxywDialog.set('title', info.title);
                        query('#dxywEditor-tzkhsj').on('focus', function () {
                            WdatePicker({dateFmt: STATEDATETIME});
                        });
                        query('#dxywEditor-qdsj').on('focus', function () {
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
                        /*取消按钮*/
                        query(id + 'EditorPanel .iFBtnClose').on('click', function () {dxywDialog.hide();});
                    });
                });
            },
            deltable : function(id){
            	var xhrArgsdel = {
						url : basePath + "OA/deldxyw",
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