define([ "dojo/dom-construct", "dojo/NodeList-manipulate",
          "dojo/_base/declare","dojo/fx","dojo/dom-class", "dojo/on","dojo/domReady!"]
,function(dc,query,declare,fx,domClass,on){
	
	return declare(null,{
		name:'',
		datas:null,menu:null,
		options:{},
		currentSelect:null,
		constructor:function(name,datas,menu,options){this.name=name;this.datas=datas;this.menu=menu;this.options = options;},
		init:function(){this.render();this.addEvent();this.addEvent2()},
		render:function(){
// 			console.log('#0',this.name)
			var ul = dojo.byId(this.name)
			var datas = this.datas;
			for(var i=0; i<datas.length; i++){
				var className = 'class="li_container '+( datas[i]["id"] == null ?'' :datas[i]["id"]) +'"'
				var show  = i>0?'style="display:none"':'',bc =  i>0?'#FFF':this.options.bgc,cc = i>0?'#000000':'#000000' ;  
				dc.place('<li class="li1"><span  '+className+'></span>'+datas[i]["name"]+'</li>',ul);
				var div = dc.place('<div id="li1_'+(i+1)+'_text" '+ show +'>',ul);
				for(var j=0; j<datas[i]['item'].length; j++){
					var type = typeof( datas[i]['item'][j]);
					if( type == 'string'){
						dc.place('<li class="li2" ><span></span>'+datas[i]["item"][j]+'</li>',div)
					}else if( type == 'object'){
						console.log('is object...')
						var datas2 = datas[i]['item'][j]['item'];
						var bc2 =  i2>0?'#FFF':this.options.bgc,cc2 = i2>0?'#000000':'#FFFFFF' ;  
						dc.place('<li cf=1 class="li2"><span class="li_container"></span>'+datas[i]['item'][j]["name"]+'</li>',div);
						var div2 = dc.place('<div id="li2_'+(j+1)+'_text" >',div);
						for(var i2=0;i2<datas2.length;i2++){
							dc.place('<li class="li3"><span></span>'+datas2[i2]+'</li>',div2)
						}
					}
				}
			}
		},
		addEvent:function(){
			dojo.forEach(dojo.query('#'+this.name+' li.li1'),
					function(item, index) {
// 						console.log('#1',this)
						item.name = this.name;item.options=this.options;
// 						dojo.connect(item, 'mouseover',function() {
// 							dojo.query(this).style('background', '#ffa').style(
// 									'color', this.options.fc)
// 						})
						on(item, 'mouseover,mouseout',function() {
							domClass.toggle(this, 'divHover2');
						})
						dojo.connect(item, 'click',function() {
							
							dojo.query('#'+this.name+' li').removeClass('leftListClick').addClass('leftListDefault');
							
							dojo.addClass(this,'leftListClick')
// 							dojo.query(this).style('background', this.options.bgc).style(
// 									'color', this.options.fc)

							var div = dojo.query('#'+this.name+' div[id^="li1_'
									+ (index + 1) + '"]');
							globalSsjg = index + 1;
							if (div && div.length > 0) {
								div = dojo.query(div[0])
							} else {
								return;
							}
							if(div.style('display')=='block'){
				                //dojo.query('#mainSplitterLeft_ul div[id^="li1_"]').forEach(function(item,index){
				                    //dojo.fadeOut({node:item}).play()
				                //})
//								div.style('display')=='none'
								fx.wipeOut({ node: div[0] }).play();
							}else{
								//dojo.fadeOut({node:dojo.query('#mainSplitterLeft_ul div[id^="li1_"]')}).play()
								//dojo.fadeIn({node:dojo.query('#mainSplitterLeft_ul div[id^="li1_'+(index+1)+'"]')}).play()
				              // dojo.query('#mainSplitterLeft_ul div[id^="li1_"]').style('display','none');
//				               div.style('display','block')
								dojo.query('#'+this.name+' div[id^="li1_"]').forEach(function(item,index){
								    //console.log(index,item)
								    if(item.style.display != 'none'){
								      fx.wipeOut({ node: item }).play();
								     }})
				               fx.wipeIn({ node: div[0] }).play();
							}
						})
					},this)
		},
		addEvent2:function(){
			
			//2级可能有子菜单 
			dojo.forEach(dojo.query('#'+this.name+' .li2'),function(item,index){
				item.name = this.name;item.options=this.options;item.menu=this.menu;
				on(item, 'mouseover,mouseout',function() {
					domClass.toggle(this, 'divHover2');
				})
				dojo.query(item).connect('click',function(){
					//如果有子菜单,返回
					
					
					//否则是没有子菜单 
					if(dojo.query(item.parentElement).style('display')=='none'){
						dojo.query('#'+this.name+' div[id^="li1_"]').style('display','none');
						dojo.query(item.parentElement).style('display','block');
					}
					globalQueryCondition = '';
//					if(excel && excel.container){
//						cacheExcelData = excel.getData();
//					}
// 					dojo.query('#'+this.name+' li').style('background','#fff').style('color','#000')
// 					dojo.query(this).style('background',this.options.bgc).style('color',this.options.fc)
						dojo.query('#'+this.name+' li').removeClass('leftListClick').addClass('leftListDefault');
						dojo.addClass(this,'leftListClick')
					var config = null;
					for(var i=0;i<this.menu.m2.length;i++){
						console.log(12345)
						if(dojo.trim(query(item).text()) != dojo.trim(this.menu.m2[i].name)){
							continue;
						}
						if(tc.getChildren().length > minTabCount ){
							var tempCp = tc.getChildren()[minTabCountStart]
							tc.removeChild(tempCp)
							tempCp.destroyRecursive()
						}
						var index = getTabIndex(this.menu.m2[i].name);
						if(index == -1){
							var cp
							if(this.menu.m2[i].title == '处置流程'){
								cp = new dijit.layout.ContentPane({
									title: this.menu.m2[i].title,
									//href:'app/html/driver.html',
									href:this.menu.m2[i].href,
									closable: this.menu.m2[i].closable
								});
								
							}else{
								cp = new dojox.layout.ContentPane({
									title: this.menu.m2[i].title,
									//href:'app/html/driver.html',
									href:this.menu.m2[i].href,
									closable: this.menu.m2[i].closable
									/*
									,postCreate:function(evt){
										console.log('cp onloaded...')
										this.inherited(arguments);
									}*/
								});
							}
							if(cp.title != '首页'){
								cp.style = 'overflow-y:hidden;margin-top: 5px;'
							}
							tc.addChild(cp);
							tc.selectChild(cp);
						}else{
							tc.selectChild(tc.getChildren()[index]);
						}
						break;
					}
					
				})
			},this)
			
			//3级  没有子菜单 
			dojo.forEach(dojo.query('#'+this.name+' .li3'),function(item,index){
				item.name = this.name;item.options=this.options;item.menu=this.menu
				on(item, 'mouseover,mouseout',function() {
					domClass.toggle(this, 'divHover2');
				})
				dojo.query(item).connect('click',function(){
					globalQueryCondition = '';
// 					dojo.query('#'+this.name+' li').style('background','#fff').style('color','#000')
// 					dojo.query(this).style('background',this.options.bgc).style('color',this.options.fc)
					dojo.query('#'+this.name+' li').removeClass('leftListClick').addClass('leftListDefault');
					dojo.addClass(this,'leftListClick')
					var config = null;
					for(var i=0;i<this.menu.m3.length;i++){
						if(dojo.trim(query(item).text()) != this.menu.m3[i].name){
							continue;
						}
						if(tc.getChildren().length > minTabCount ){
							var tempCp = tc.getChildren()[minTabCountStart]
							tc.removeChild(tempCp)
							tempCp.destroyRecursive()
						}
						var index = getTabIndex(this.menu.m3[i].name);
						if(index == -1){
							var cp = new dojox.layout.ContentPane({
								title: this.menu.m3[i].title,
								//href:'app/html/driver.html',
								href:this.menu.m3[i].href,
								closable: this.menu.m3[i].closable,
								style:'overflow-y:hidden;margin-top: 5px;'
							});
							tc.addChild(cp);
							tc.selectChild(cp);
						}else{
							tc.selectChild(tc.getChildren()[index]);
						}
						break;
					}
				})
			},this)
		}
	}) 
	
});
