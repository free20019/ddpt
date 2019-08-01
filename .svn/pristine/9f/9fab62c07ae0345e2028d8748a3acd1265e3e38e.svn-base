/**
 * Created by chenyy on 2017/9/26.
 */
define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination", "dgrid/Selection",
        "dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
        "dojo/store/Memory","cbtree/model/TreeStoreModel",
        "dstore/Memory","dijit/form/NumberTextBox",
        "dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
        'dstore/Trackable', 'dgrid/Selector',
        "dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
        "cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
    function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
             SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
             Pagination, Selection, Keyboard, ColumnResizer,
             Memory2,TreeStoreModel,
             Memory,NumberTextBox, DijitRegistry, registry, domStyle,
             Trackable, Selector,
             declare, dc, on,ObjectStoreModel, Tree,
             ForestStoreModel, ItemFileWriteStore, query, util) {
        var CustomGrid = declare([Grid, Selection, DijitRegistry, Editor, ColumnResizer, Selector]);
        var yhbGrid = null, qxGrid=null,store = null;
        var yhb_data;
		var fxkfsr={};
        var columns = {
            checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            USER_NAME: {label: '用户名'},
            USER_PWD: {label: '密码'},
            RG_NAME: {label: '权限'},
            USER_TEL: {label: '电话'},
            REAL_NAME: {label: '用户姓名'},
//            ISLOGINM: {label: '调度登录标记',formatter : util.formatBJ_SFDL},
            BA_NAME: {label: '公司'},
            COMP_NAME: {label: '分公司'},
            NOTE: {label: '备注'}
        };


        var xhrArgsTabel = {
            url : basePath + "back/findyhb",
            postData : 'postData={"page":1,"pageSize":30}',
            handleAs : "json",
            Origin : self.location.origin,
            preventCache : true,
            withCredentials : true,
            load : function(data) {
				yhb_data = data.datas;
				for (var i = 0; i < data.datas.length; i++) {
					data.datas[i] = dojo.mixin({
						dojoId : i + 1
					}, data.datas[i]);
				}
				store = new Memory({
					data : {
						identifier : 'dojoId',
						label : 'dojoId',
						items : data.datas
					}
				});
				yhbGrid.totalCount = data.count;
				yhbGrid.set('collection', store);
				yhbGrid.pagination.refresh(data.datas.length);
				yhbGrid.on('dgrid-select', function (event) {
					fxkfsr=yhbGrid.selection;
				});
				yhbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=yhbGrid.selection;
				});
			},
            error : function(error) {
            }
        };




        return declare( null,{
            constructor:function(){
            	this.initToolBar();
				if (yhbGrid) { yhbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'yhbTabels', innerHTML:"" },'yhbTabel');
				yhbGrid = new CustomGrid({
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "yhbTabels");
				pageii = new Pagination(yhbGrid,xhrArgsTabel,{"gjz" : $("#yhb-gjz").val()},30);
				dc.place(pageii.first(),'yhbTabels','after');
            },
            del: function (obj) {},
            add:function () {},
            update: function (json) {},
            get: function () {},
            initToolBar:function(){
            	query('#yhbQuery').on('click', function() {
            		if (yhbGrid) { yhbGrid.destroy(); }
            		$(".pagination").html('')
                    dojo.create("div", {id:'yhbTabels', innerHTML:"" },'yhbTabel');
    				yhbGrid = new CustomGrid({
    					totalCount : 0,
    					pagination:null,
    					columns : columns
    				}, "yhbTabels");
    				pageii = new Pagination(yhbGrid,xhrArgsTabel,{"gjz" : $("#yhb-gjz").val()},30);
    				dc.place(pageii.first(),'yhbTabels','after');
				});
            	
            	query('#yhbDc').on('click', function() {
    				var postData = {};
					postData.gjz=$("#yhb-gjz").val();
					url = basePath + "back/yhb_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
				});
            	
            	query('#yhbDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个用户后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(yhb_data[sz[i]-1].USER_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delyhb",
								postData : {
									"id" : idstr
								},
								handleAs : "json",
								Origin : self.location.origin,
								preventCache:true,
								withCredentials :  true,
								load : function(data) {
									dijit.byId('qd_dialog').show().then(function() {
										$("#czjg").html(data.info);
										dojo.xhrPost(xhrArgsTabel);
									});
								}
							};
							dojo.xhrPost(xhrArgs2);
		        		  layer.close(index);
	        		}); 
                });
            	
                query('#yhbAdd').on('click', function() {
                    yhbDialogPanel.set('href', 'app/html/czchtgl/editor/yhbEditor.html');
                    yhbDialog.show().then(function () {
                        yhbDialog.set('title', '新增用户');
                      //公司
						fingba().then(function(data){
							xlktyff("yhb-gs-list",data.datas);
							comboboxDFun('#yhb-gs')
						});
						//分公司
						$("#yhb-gs-input").change(function(){
							$("#yhb-fgs-list").empty();
							$("#yhb-fgs-input").data('value','');
							$("#yhb-fgs-input").val('请选择分公司');
							findcomp($("#yhb-gs input").data('value')).then(function(data){
								xlktyff("yhb-fgs-list",data.datas);
								comboboxDFun('#yhb-fgs')
							});
						})
						//业务区块
						findqk().then(function(data){
							xlktyff("yhb-ywqk-list",data.datas);
							comboboxDFun('#yhb-ywqk')
						});
						//用户组权限
						findqxlb().then(function(data){
							xlktyff("yhb-yhzqx-list",data.datas);
							comboboxDFun('#yhb-yhzqx')
						});
                        query('.yhb-iFBtnCommit').on('click', function () {
                        	var FormJson = getFormJson("yhbEditorForm");
                        	FormJson.OWNER_ID = $("#yhb-ywqk input").data('value');//业务区块
                        	FormJson.BA_ID = $("#yhb-gs input").data('value');//总公司
                        	FormJson.COMP_ID = $("#yhb-fgs input").data('value');//分公司
                        	FormJson.RG_ID = $("#yhb-yhzqx input").data('value');//用户组权限
                        	var id_array=new Array();  
                        	$('input[name="qxlbbox"]:checked').each(function(){  
                        	    id_array.push($(this).val());//向数组中添加元素  
                        	});  
                        	var idstr=id_array.join(';');//将数组元素连接起来以构建一个字符串  
                        	FormJson.IDSTR = idstr;//用户组权限
                        	if(FormJson.USER_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('用户名不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.USER_PWD.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('用户密码不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addyhb",
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
											yhbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.yhb-iFBtnClose').on('click', function () {
                        	yhbDialog.hide();
                        })
                        var treedata;
                        var xhrArgstree = {
                                url : basePath + "back/gstree",
                                postData :{},
                                handleAs : "json",
                                Origin : self.location.origin,
                                preventCache : true,
                                withCredentials : true,
                                load : function(data) {
                                    treedata = data;
                                },
                                error : function(error) {
                                }
                            };
                        dojo.xhrPost(xhrArgstree).then(function(){
                        	var setting = {
                                    edit: {
                                        enable: true,
                                        showRemoveBtn: false,
                                        showRenameBtn: false
                                    },
                                    check: {
                                        enable: false
                                    },
                                    data: {
                                        simpleData: {
                                            enable: true
                                        }
                                    }
                                };
                                var treeObj,
                                    zTreeNodes = treedata;
                                treeObj = $.fn.zTree.init($("#yhbtree"), setting, zTreeNodes);
                        });
                    })
                });

                query('#yhbUpd').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个用户后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个用户！');
						});
		        		return;
		        	}
		        	console.log(yhb_data[sz[0]-1]);
		        	var upddata = yhb_data[sz[0]-1];
		        	
                    yhbDialogPanel.set('href', 'app/html/czchtgl/editor/yhbEditor.html');
                    yhbDialog.show().then(function () {
                        yhbDialog.set('title', '编辑用户');
                      //公司
						fingba().then(function(data){
							xlktyff("yhb-gs-list",data.datas);
							comboboxDFun('#yhb-gs');
							$("#yhb-gs-input").val(upddata.BA_NAME);
							$("#yhb-gs-input").attr('data-value',upddata.BA_ID);
						});
						//分公司
						findcomp("").then(function(data){
							xlktyff("yhb-fgs-list",data.datas);
							comboboxDFun('#yhb-fgs');
							$("#yhb-fgs-input").val(upddata.COMP_NAME);
							$("#yhb-fgs-input").attr('data-value',upddata.COMP_ID);
						});
						//业务区块
						findqk().then(function(data){
							xlktyff("yhb-ywqk-list",data.datas);
							comboboxDFun('#yhb-ywqk');
							$("#yhb-ywqk-input").val(upddata.OWNER_NAME);
							$("#yhb-ywqk-input").attr('data-value',upddata.OWNER_ID);
						});
						//用户组权限
						findqxlb().then(function(data){
							xlktyff("yhb-yhzqx-list",data.datas);
							comboboxDFun('#yhb-yhzqx');
							$("#yhb-yhzqx-input").val(upddata.RG_NAME);
							$("#yhb-yhzqx-input").attr('data-value',upddata.RG_ID);
						});
						$("#yhb_username").val(upddata.USER_NAME);
						$("#yhb_password").val(upddata.USER_PWD);
						$("#yhb_name").val(upddata.REAL_NAME);
						$("#yhb_tel").val(upddata.USER_TEL);
						$("#yhb_address").val(upddata.ADDRESS);
						$("#yhb_note").val(upddata.NOTE);
						
						for (var i = 0; i < upddata.QX.length; i++) {
							test(upddata.QX[i].qxid,upddata.QX[i].qxmc)
						}
						
                        query('.yhb-iFBtnCommit').on('click', function () {
                            var thisOne = this;
                            var FormJson = getFormJson("yhbEditorForm");
                            FormJson.USER_ID = upddata.USER_ID;
                        	FormJson.OWNER_ID = $("#yhb-ywqk input").data('value');//业务区块
                        	FormJson.BA_ID = $("#yhb-gs input").data('value');//总公司
                        	FormJson.COMP_ID = $("#yhb-fgs input").data('value');//分公司
                        	FormJson.RG_ID = $("#yhb-yhzqx input").data('value');//用户组权限
                        	var id_array=new Array();  
                        	$('input[name="qxlbbox"]:checked').each(function(){  
                        	    id_array.push($(this).val());//向数组中添加元素  
                        	});  
                        	var idstr=id_array.join(';');//将数组元素连接起来以构建一个字符串  
                        	FormJson.IDSTR = idstr;//用户组权限
                        	if(FormJson.USER_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('用户名不能为空！');
        						});
        		        		return;
                        	}
                        	if(FormJson.USER_PWD.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('用户密码不能为空！');
        						});
        		        		return;
                        	}
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/edityhb",
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
											yhbDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.yhb-iFBtnClose').on('click', function () {
                        	yhbDialog.hide();
                        })
                        var treedata;
                        var xhrArgstree = {
                                url : basePath + "back/gstree",
                                postData :{},
                                handleAs : "json",
                                Origin : self.location.origin,
                                preventCache : true,
                                withCredentials : true,
                                load : function(data) {
                                    treedata = data;
                                },
                                error : function(error) {
                                    console.log(error);
                                }
                            };
                        dojo.xhrPost(xhrArgstree).then(function(){
                        	var setting = {
                                    edit: {
                                        enable: true,
                                        showRemoveBtn: false,
                                        showRenameBtn: false
                                    },
                                    check: {
                                        enable: false
                                    },
                                    data: {
                                        simpleData: {
                                            enable: true
                                        }
                                    }
                                };
                                var treeObj,
                                    zTreeNodes = treedata;
                                treeObj = $.fn.zTree.init($("#yhbtree"), setting, zTreeNodes);
                        });
                    })
                });


            }
        })
    });