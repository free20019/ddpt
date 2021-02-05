define([ "dijit/Dialog", "dgrid/Editor", "dijit/form/Button",
        "dijit/form/DateTextBox", "dijit/form/TimeTextBox",
        "dijit/form/SimpleTextarea", "dijit/form/Select",
        "dijit/form/FilteringSelect", "dgrid/OnDemandGrid",
        "dijit/form/TextBox", "app/Pagination1", "dgrid/Selection",
        "dgrid/Keyboard", "dgrid/extensions/ColumnResizer",'dgrid/Selector',
        "dojo/store/Memory","cbtree/model/TreeStoreModel",
        "dstore/Memory","dijit/form/NumberTextBox",
        "dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
        "dojo/_base/declare", "dojo/dom-construct", "dojo/on","dijit/tree/ObjectStoreModel", "cbtree/Tree",
        "cbtree/models/ForestStoreModel", "dojo/data/ItemFileWriteStore", "dojo/query", "app/util" ],
    function(Dialog, Editor, Button, DateTextBox, TimeTextBox,
             SimpleTextarea, Select, FilteringSelect, Grid, TextBox,
             Pagination, Selection, Keyboard, ColumnResizer,Selector,
             Memory2,TreeStoreModel,
             Memory,NumberTextBox, DijitRegistry, registry, domStyle,
             declare, dc, on,ObjectStoreModel, Tree,
             ForestStoreModel, ItemFileWriteStore, query, util) {
        var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer,Selector]);
        var zxGrid = null, zxldhmGrid = null, store = null;

        var columns = {
//            dojoId: {label: '序号'},
        	checkbox: {label: '选择',selector: 'checkbox'},
            CS_ID: {label: '业务编号'},
            CS_TELNUM: {label: '来电号码'},
            CS_CLIENT: {label: '姓名'},
            CS_STATE: {label: '处理状态'},
            CS_DEALDATETIME: {label: '处理时间'},
            CS_TYPE: {label: '处理类型'},
            CS_WORKERNUM: {label: '工号'},
            CS_VEHIID: {label: '车牌号码'},
            CS_MEMO: {label: '服务内容'},
            CS_OBJECT: {label: '处理对象'}
        };
        /*来电号码的选择*/
		var zxldhmColumns={
			CS_ID: {label: '客户ID',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_ID, style:{'text-align':'center'}});
                return type;
            }},
            CS_CLIENT: {label: '客户姓名',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_CLIENT, style:{'text-align':'center'}});
                return type;
            }},
            CS_TELNUM: {label: '客户电话',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_TELNUM, style:{'text-align':'center'}});
                return type;
            }},
            CS_OBJECT: {label: '受理对象',renderCell:function(item){
                    var type = dc.create("div", {innerHTML: item.CS_OBJECT, style:{'text-align':'center'}});
                    return type;
                }},
            CS_VEHIID: {label: '车牌号码',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_VEHIID, style:{'text-align':'center'}});
                return type;
            }},
            CS_TYPE: {label: '处理类型',renderCell:function(item){
                var type = dc.create("div", {innerHTML: item.CS_TYPE, style:{'text-align':'center'}});
                return type;
            }}
		};
        return declare( null,{
            constructor:function(){
                this.initToolBar();
                this.get();
            },
            get:function(){
            	var postData={};
            	postData.cphm=$("#cx-zxcphm").val();
            	postData.dhhm=$("#cx-zxdhhm").val();
            	postData.clgh=$("#cx-zxclgh").val();
            	postData.fwnr=$("#cx-zxfwnr").val();
            	findallzx(postData).then(function(data){
//            		console.log(data);
                	store = new Memory({data: {identifier: 'CS_ID', label: 'CS_ID', items: data}});
                	zxGrid.set('collection', store);
            	});
            },
            initToolBar:function(){
                var _self = this;
                if (zxGrid) { zxGrid = null; dojo.empty('zxTabel');}
                zxGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: columns,allowTextSelection: true}, 'zxTabel');
                /*下拉框*/
                // query('#zxPanel .iFComboBox').on('click', function () {
                //     var thisOne = this;
                //     if ($(this).hasClass('selected')) {
                //         $(this).removeClass('selected');
                //     } else {
                //         $(this).addClass('selected');
                //         $(this).find('.iFList').on('click', function () {
                //         	if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
                //         }).find('li').off('click').on('click', function () {
                //             $(this).addClass('selected').siblings('.selected').removeClass('selected');
                //             $(thisOne).find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
                //             $(thisOne).find('input').trigger('change');
                //         });
                //     }
                // });
							addEventComboBox('#zxPanel');
              //处理类型
//                querycllx($("#zx-cllxgltj").val()).then(function(data){
//					$("#zx-cllxBox").find('.iFList').html("");
//					for (var i = 0; i < data.length; i++) {
//						var gss="<li data-value='"+data[i].CS_TYPE+"'>"+data[i].CS_TYPE+"</li>";
//						$("#zx-cllxBox").find('.iFList').append(gss);
//					}
//				});
//				on(query('#zx-cllxglbtn'), 'click', function () {
//					querycllx($("#zx-cllxgltj").val()).then(function(data){
//						$("#zx-cllxBox").find('.iFList').html("");
//						for (var i = 0; i < data.length; i++) {
//							var gss="<li data-value='"+data[i].CS_TYPE+"'>"+data[i].CS_TYPE+"</li>";
//							$("#zx-cllxBox").find('.iFList').append(gss);
//						}
//					});
//				});
               //车牌号码
				on(query('#zx-cphmglbtn'), 'click', function () {
					findddcphm($("#zx-cphm").val()).then(function(data2){
						$("#zx-cphmBox").find('.iFList').html("");
						for (var i = 0; i < data2.length; i++) {
							var cphms="<li data-value='"+data2[i].COMP_NAME+"'>"+data2[i].CPHM+"</li>";
							$("#zx-cphmBox").find('.iFList').append(cphms);
						}
						$('#zx-cphmBox').find('.iFList').on('click', function () {
							if (event.stopPropagation){event.stopPropagation();}else if (window.event) {window.event.cancelBubble = true;}
						}).find('li').off('click').on('click', function () {
							$(this).addClass('selected').siblings('.selected').removeClass('selected');
							$("#zx-cphmBox").find('input').data('value', $(this).data('value')).val($(this).text()).end().removeClass('selected');
							$("#zx-ssgs").val($(this).data('value'));
							
						});
					});
				});
				on(query('.zx-create'), 'click', function () {
					var postData={};
					postData.ldhm=$("#zx-ldhm").val();
					postData.sldx=$("#zx-sldx").val();
					postData.cllx=$("#zx-cllx").val();
					postData.khxm=$("#zx-khxm").val();
					postData.cphm=$("#zx-cphm").val();
					postData.ssgs=$("#zx-ssgs").val();
					postData.fwnr=$("#zx-fwnr").val();
					postData.clgh=username;
					createZX(postData).then(function(data){
                		if(data.msg=="1"){
                			layer.msg('生成成功！');
                			_self.get();
                			$("#zx-ldhm").val("");
        					$("#zx-sldx").val("");
        					$("#zx-cllx").val("");
        					$("#zx-khxm").val("");
        					$("#zx-cphm").val("");
        					$("#zx-ssgs").val("");
        					$("#zx-fwnr").val("");
                		}else{
                			layer.msg('生成失败！');
                		}
                	});
				});
				on(query('.zx-clear'), 'click', function () {
					$("#zx-ldhm").val("");
					$("#zx-sldx").val("");
					$("#zx-cllx").val("");
					$("#zx-khxm").val("");
					$("#zx-cphm").val("");
					$("#zx-ssgs").val("");
					$("#zx-fwnr").val("");
				});
				
				 /*来电号码的选择*/
                on(query('#zx-ldhmxz'), 'click', function () {
                    xddDialogPanel.set('href', 'app/html/ddxpt/compile/zx_ldxz.html');
                    xddDialog.set('title', '选择客户');
                    xddDialog.show().then(function() {
                        setTimeout(function() {
                            if (zxldhmGrid) { zxldhmGrid = null; dojo.empty('zxldhmTable');}
                            zxldhmGrid = new CustomGrid({ totalCount: 0, pagination: null, columns: zxldhmColumns}, "zxldhmTable");
//                            store = new Memory({data: {identifier: 'CI_ID', label: 'CI_ID', items: lsjlxz}});
//                            ldhmGrid.set('collection', store);
//                            $('.panel-conterBar').show();
                            findbyzxld($("#zx-ldhm").val()).then(function(data){
                            	console.log(data);
                            	store = new Memory({data: {identifier: 'CS_ID', label: 'CS_ID', items: data}});
                                zxldhmGrid.set('collection', store);
//                               $('.panel-conterBar').show();
                            	zxldhmGrid.on('.dgrid-row:dblclick', function(event) {
            						var row = zxldhmGrid.row(event);
            						console.log(row.data);
            						$("#zx-sldx").val(row.data.CS_OBJECT);
            						$("#zx-cllx").val(row.data.CS_TYPE);
            						$("#zx-khxm").val(row.data.CS_CLIENT);
            						$("#zx-cphm").val(row.data.CS_VEHIID);
//            						$("#zx-ssgs").val(row.data.CS_OBJECT);
            						$("#zx-fwnr").val(row.data.CS_MEMO);
            	                	xddDialog.hide();
                                });
                            });
                        }, 100);
                    });
                });
				
                //查询按钮
                on(query('#zxQuery'), 'click', function () {
                	_self.get();
                });
                //导出按钮
                on(query('#zxDaochu'), 'click', function () {
                	var postData={};
                	postData.cphm=$("#cx-zxcphm").val();
                	postData.dhhm=$("#cx-zxdhhm").val();
                	postData.clgh=$("#cx-zxclgh").val();
                	postData.fwnr=$("#cx-zxfwnr").val();
                	url = basePath + "ddxpt/findallzx_daochu?postData="
             		+ encodeURI(encodeURI(JSON.stringify(postData))), window.open(url);
                });
                //刷新按钮
				on(query('#zxSx'), 'click', function () {
					_self.get();
				});
				
				//修改按钮
				query('#zxUpd').on('click', function() {
					var xgids="",xgidlist=[];
    	        	dojo.forEach(zxGrid.collection.data, function(item,index) {
    					if (zxGrid.isSelected(item)) {
    						xgidlist.push(item.CS_ID);
    						xgids = item.CS_ID;
    					}
    				});
					if(xgidlist.length==0){
							layer.msg("请选择一条记录！");
						return;
					}
					if(xgidlist.length>1){
							layer.msg("只能选择一条记录！");
						return;
					}
					zxDialogPanel.set('href', 'app/html/editor/zxEditor.html');
					findonezx(xgids).then(function(data){
						console.log(data);
						zxDialog.show().then(function() {
							addEventComboBox("#zxeditpanal");
							$("#zxxg-ywbh").val(data.CS_ID);
							$("#zxxg-ldhm").val(data.CS_TELNUM);
							$("#zxxg-cldx").val(data.CS_OBJECT);
							$("#zxxg-cllx").val(data.CS_TYPE);
							$("#zxxg-khxm").val(data.CS_CLIENT);
							$("#zxxg-cphm").val(data.CS_VEHIID);
							$("#zxxg-fwnr").val(data.CS_MEMO);
					
							zxDialog.set('title', '咨询修改');
							query('#zxxgtcbtn').on('click', function() {
								zxDialog.hide();
							});
							query('#zxxgtjbtn').on('click', function() {
								dojo.xhrPost({
									url : basePath + "ddxpt/editzx",
									postData :"postData={'ywbh':'"+$("#zxxg-ywbh").val()+"','ldhm':'"+$("#zxxg-ldhm").val()+"','cldx':'"+$("#zxxg-cldx").val()+"','khxm':'"+$("#zxxg-khxm").val()+"','cphm':'"+$("#zxxg-cphm").val()+"','cllx':'"+$("#zxxg-cllx").val()+"','fwnr':'"+$("#zxxg-fwnr").val()+"'}",
									handleAs : "json",
									Origin : self.location.origin,
									preventCache : true,
									withCredentials : true,
									load : function(data) {
										zxDialog.hide();
										layer.msg(data.msg);
										_self.get();
									},
									error : function(error) {
										console.log(error);
									}
								});
								
							});
						});
					});
				});
				
				
				 //删除按钮
				on(query('#zxDel'), 'click', function () {
					layer.confirm('确定删除选中的咨询记录？', {
						  btn: ['确定','取消'] //按钮
						}, function(index){
                        	var zxids="";
            	        	dojo.forEach(zxGrid.collection.data, function(item,index) {
            					if (zxGrid.isSelected(item)) {
            						zxids+="'"+item.CS_ID+"',";
            					}
            				});
            	        	if(zxids==""){
            	        		layer.msg("没有选中的记录！");
            	        	}else{
            	        		delbyzxid(zxids).then(function(data){
            	        			if(data.msg=="1"){
        	                			layer.msg('删除成功！');
        	                			_self.get();
        	                		}else{
        	                			layer.msg('删除失败！');
        	                		}
            	        		});
            	        	}
					}, function(index){
						layer.close(index);
					});
				});
            }
        })
    });