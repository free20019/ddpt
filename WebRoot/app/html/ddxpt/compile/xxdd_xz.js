
define([ "dijit/Dialog", "dijit/form/Button", "dijit/form/Select",
        "dgrid/OnDemandGrid",'dgrid/Selector',
        "dijit/form/TextBox",  "dgrid/Selection",
        "dgrid/Keyboard", "dgrid/extensions/ColumnResizer",
        "dstore/Memory","dijit/form/NumberTextBox",
        "dgrid/extensions/DijitRegistry", "dijit/registry", "dojo/dom-style",
        "dojo/_base/declare", "dojo/dom-construct", "dojo/on", "dojo/query", 'dojo/dom-class', "app/util" ],
    function(Dialog, Button, Select, Grid, Selector, TextBox,
             Selection, Keyboard, ColumnResizer,
             Memory,NumberTextBox, DijitRegistry, registry, domStyle,
             declare, dc, on, query, domClass, util) {
        var CustomGrid = declare([DijitRegistry, Grid, Keyboard, Selection, ColumnResizer, Selector]);
        return declare( null,{
            constructor:function(){
                this.initToolBar();
                this.get();
            },
            del: function () {},
            add:function(json){},
            update:function(json){},
            get:function () {},
            initToolBar:function(){
            }
        })
    });