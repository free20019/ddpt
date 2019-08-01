define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
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
        var qybGrid = null, store = null;
        var fxkfsr={};
        var qyb_data;
        var columns = {
    		checkbox: {label: '选择',selector: 'checkbox'},
			dojoId: {label: '序号'},
			RE_NAME: {label: '区域名称'},
			RE_NUM: {label: '区域代码'},
			RE_TYPE: {label: '区域类型'},
			MAP_NAME: {label: '地图名称'},
			PARENT_ID: {label: '父节点编号'},
			PARE_PATH: {label: '父节点路径'},
			LONGI: {label: '经度'},
			LATI: {label: '纬度'},
			ORDER_ID: {label: '排序号'},
			NOTE: {label: '备注'}
        };
        var xhrArgsTabel = {
            url : basePath + "back/findqyb",
            postData :{},
            handleAs : "json",
            Origin : self.location.origin,
            preventCache : true,
            withCredentials : true,
            load : function(data) {
                qyb_data = data;
                for (var i = 0; i < data.length; i++) {
                    data[i] = dojo.mixin({
                        dojoId : i + 1
                    }, data[i]);
                }
                store = new Memory({
                    data : {
                        identifier : 'dojoId',
                        label : 'dojoId',
                        items : data
                    }
                });
//                qybGrid.totalCount = data.count;
//                qybGrid.set('collection', store);
//                qybGrid.pagination.refresh(data.length);
//                if (qybGrid) { qybGrid = null; dojo.empty('qybTabel'); };
                if (qybGrid) { qybGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'qybTabels', innerHTML:"" },'qybTabel')
                qybGrid = new CustomGrid({collection: store,selectionMode: 'none', allowSelectAll: true,totalCount: 0, pagination: null,columns: columns}, 'qybTabels');
                qybGrid.on('dgrid-select', function (event) {
					fxkfsr=qybGrid.selection;
				});
                qybGrid.on('dgrid-deselect', function (event) {
					fxkfsr=qybGrid.selection;
				});
            },
            error : function(error) {
                console.log(error);
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
            	dojo.xhrPost(xhrArgsTabel);
            },
            initToolBar:function(){
            	var _self = this;
            	query('#qybAdd').on('click', function() {
                    qybDialogPanel.set('href', 'app/html/czchtgl/editor/qybEditor.html');
                    qybDialog.show().then(function () {
                    	finddt().then(function(data){
							xlktyff("qyb-dtmc-xl",data.datas);
						});
                    	$('.iFComboBox').click(function(){
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
                        qybDialog.set('title', '新增区域');
                        query('.qyb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("qybEditorForm");
                        	if(FormJson.RE_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('区域名称不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.MAP_ID = $("#qybEditor-dtmc input").data('value');
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/addqyb",
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
											qybDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.qyb-iFBtnClose').on('click', function() {
                        	qybDialog.hide();
                        });
                    });
                });

                query('#qybUpd').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请选择一个区域后修改！');
						});
		        		return;
		        	}
		        	if(sz.length>1){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('每次只能修改一个区域！');
						});
		        		return;
		        	}
                    qybDialogPanel.set('href', 'app/html/czchtgl/editor/qybEditor.html');
                    qybDialog.show().then(function () {
                    	finddt().then(function(data){
    						xlktyff("qyb-dtmc-xl",data.datas);
    					});
                    	$('.iFComboBox').click(function(){
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
                        qybDialog.set('title', '编辑区域');
                        $("#qyb-qymc").val(qyb_data[sz[0]-1].RE_NAME);
                        $("#qyb-qydm").val(qyb_data[sz[0]-1].RE_NUM);
                        $("#qyb-qylx").val(qyb_data[sz[0]-1].RE_TYPE);
                        $("#qyb-dtmc").val(qyb_data[sz[0]-1].MAP_NAME);
                        $("#qyb-dtmc").attr('data-value',qyb_data[sz[0]-1].MAP_ID);
                        $("#qyb-fjdbh").val(qyb_data[sz[0]-1].PARENT_ID);
                        $("#qyb-fjdlj").val(qyb_data[sz[0]-1].PARE_PATH);
                        $("#qyb-jd").val(qyb_data[sz[0]-1].LONGI);
                        $("#qyb-wd").val(qyb_data[sz[0]-1].LATI);
                        $("#qyb-pxh").val(qyb_data[sz[0]-1].ORDER_ID);
                        $("#qyb-bz").text(qyb_data[sz[0]-1].NOTE);
                        query('.qyb-iFBtnCommit').on('click', function() {
                        	var FormJson = getFormJson("qybEditorForm");
                        	if(FormJson.RE_NAME.length==0){
                        		dijit.byId('qd_dialog').show().then(function() {
        							$("#czjg").html('区域名称不能为空！');
        						});
        		        		return;
                        	}
                        	FormJson.MAP_ID = $("#qybEditor-dtmc input").data('value');
                        	FormJson.ID = qyb_data[sz[0]-1].RE_ID;
                        	var datap = JSON.stringify(FormJson);
                        	var xhrArgs2 = {
									url : basePath  + "back/editqyb",
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
											qybDialog.hide();
										})
									}
								}
								dojo.xhrPost(xhrArgs2);
                        });
                        query('.qyb-iFBtnClose').on('click', function() {
                        	qybDialog.hide();
                        });
                    });
                });
                query('#qybDel').on('click', function() {
                	var sz=[];
		        	for(var id in fxkfsr){
		        		if(fxkfsr[id]){
		        			sz.push(id);
		        		}
		        	}
		        	if(sz.length==0){
		        		dijit.byId('qd_dialog').show().then(function() {
							$("#czjg").html('请至少选择一个区域后删除！');
						});
		        		return;
		        	}
		        	var zzid = [];
		        	for(var i=0; i<sz.length; i++){
		        		zzid.push(qyb_data[sz[i]-1].RE_ID);
		        	}
		        	var idstr=zzid.join(',');
		        	layer.confirm('确定要删除该条记录吗?', function(index){
		        		var xhrArgs2 = {
								url : basePath  + "back/delqyb",
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
									})
								}
							}
							dojo.xhrPost(xhrArgs2);
		        		  layer.close(index);
	        		}); 
		        	
                });
                query('#qybDc').on('click', function() {
						url = "backExcel/findqybexcle", window.open(url)
                });
            }
        });
    });