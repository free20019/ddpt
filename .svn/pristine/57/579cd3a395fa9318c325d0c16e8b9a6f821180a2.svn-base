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
        var qxbGrid = null, qxGrid=null,store = null;
        var qxb_data;
		var fxkfsr={};
        var columns = {
            checkbox: {label: '选择',selector: 'checkbox'},
            dojoId: {label: '序号'},
            RG_NAME: {label: '角色'},
            QX: {label: '权限',formatter:util.formatQX}
        };


        var xhrArgsTabel = {
            url : basePath + "back/findqxb",
            postData : 'postData={"page":1,"pageSize":30}',
            handleAs : "json",
            Origin : self.location.origin,
            preventCache : true,
            withCredentials : true,
            load : function(data) {
            	console.log(data);
				qxb_data = data.datas;
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
				qxbGrid.totalCount = data.count;
				qxbGrid.set('collection', store);
				qxbGrid.pagination.refresh(data.datas.length);
				qxbGrid.on('dgrid-select', function (event) {
					fxkfsr=qxbGrid.selection;
				});
				qxbGrid.on('dgrid-deselect', function (event) {
					fxkfsr=qxbGrid.selection;
				});
			},
            error : function(error) {
            }
        };

        return declare( null,{
            constructor:function(){
            	this.initToolBar();
				if (qxbGrid) { qxbGrid.destroy(); }//dojo.destroy('zdbTabel');
                dojo.create("div", {id:'qxbTabels', innerHTML:"" },'qxbTabel');
				qxbGrid = new CustomGrid({
					totalCount : 0,
					pagination:null,
					columns : columns
				}, "qxbTabels");
				pageii = new Pagination(qxbGrid,xhrArgsTabel,{"gjz" : $("#qxb-gjz").val()},30);
				dc.place(pageii.first(),'qxbTabels','after');
            },
            initToolBar:function(){
            	query('#qxbQuery').on('click', function() {
            		if (qxbGrid) { qxbGrid.destroy(); }
            		$(".pagination").html('')
                    dojo.create("div", {id:'qxbTabels', innerHTML:"" },'qxbTabel');
    				qxbGrid = new CustomGrid({
    					totalCount : 0,
    					pagination:null,
    					columns : columns
    				}, "qxbTabels");
    				pageii = new Pagination(qxbGrid,xhrArgsTabel,{"gjz" : $("#qxb-gjz").val()},30);
    				dc.place(pageii.first(),'qxbTabels','after');
				});
            }
        })
    });