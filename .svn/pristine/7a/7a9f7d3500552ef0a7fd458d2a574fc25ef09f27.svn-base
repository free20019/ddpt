//TODO 输入数字查询
define(["dojo/_base/declare","dojo/NodeList-manipulate","dojo/dom-construct"],
		function(declare,query,domConstruct) {
	
	  return declare(null, {
		  name:'',
		  grid:null,
		  xhrArgs:null,
		  queryCondition:null,
		  constructor:function(grid,xhrArgs,queryCondition,pageSize){
			  this.grid=grid,
			  this.xhrArgs=xhrArgs;
			  grid.pagination=this;
			  this.queryCondition = queryCondition;
			  this.pageSize = (pageSize != undefined ? pageSize: 10);
		  },
	  	  getName:function(){return this.name},
	  	 all : 0,
		 page : 1,
		 pageSize : 10,
		 url : '',
		 dom : null,
		 maxPage : 0,
		 currentPageSize : 0,//当页取得的条数,每页10条时，可能只取到3条 
		 putPageDom :null,
		 refresh:function(currentPageSize){
			this.all =  this.grid.totalCount;
				var temp =  this.all/this.pageSize
		        if(parseInt(temp) == temp){
		          this.maxPage = temp
		        }else{
		          this.maxPage = parseInt(temp)+1;
		        }
				this.currentPageSize = currentPageSize;
				
			dojo.query('.maxPage',this.dom)[0].innerHTML = this.maxPage;
			console.log('refres......t');
			dojo.query('.page_remark',this.dom)[0].innerHTML = '<span>显示'+((this.page-1)*this.pageSize+1)+'至'+((this.page-1)*this.pageSize+this.currentPageSize)+'，共'+this.all+'条记录</span>'
		 },
		 initDom : function(){
			this.putPageDom = domConstruct.create('input',  {'class':"page_input", type:"text" ,value:1});
			var div = document.createElement('div');
			var first = domConstruct.place('<a  href="javascript:void(0)"><span class="page_first"></span></a>',div)//div.appendChild(first[0])
			var prev = domConstruct.place('<a  href="javascript:void(0)"><span class="page_prev"></span></a>',div);//div.appendChild(prev[0])
			domConstruct.place('<span>第</span>',div);//div.appendChild(page1);
			domConstruct.place(this.putPageDom,div);//div.appendChild(page2);
			domConstruct.place('<span><span>页, 共</span><span class="maxPage">0</span>页</span>',div);//div.appendChild(page3);
			var next = domConstruct.place('<a  href="javascript:void(0)"><span class="page_next"></span></a>',div);//div.appendChild(next[0])
			var last = domConstruct.place('<a  href="javascript:void(0)"><span class="page_last"></span></a>',div);//div.appendChild(last[0])
			domConstruct.place('<span class="page_remark"></span>',div);//div.appendChild(remark[0])
			div.className  = 'pagination';
			var ff = function(){
					console.log(1,this);
					this.first();
			}
			dojo.connect(first,'click',this,function(){
				this.first();
			});
			dojo.connect(prev,'click',this,function(){
				this.prev();
			});
			dojo.connect(next,'click',this,function(){
				this.next();
			});
			dojo.connect(last,'click',this,function(){
				this.last();
			});
			this.dom = div;
			return this.dom;
		},
		next : function(){
			if(this.dom == null){
				this.initDom();
			}
			this.page++;
			if(this.page>this.maxPage){
				console.log('已经是末页了')
				this.page=this.maxPage;
			}
			this.putPageDom.value = this.page
			this.getData();
		},
		prev : function(){
			if(this.dom == null){
				this.initDom();
			}
			this.page--;
			if(this.page == 0){
				this.page = 1;
				console.log('已经是首页了')
			}
			this.putPageDom.value = this.page
			this.getData();
		},
		first : function(){
			if(this.dom == null){
				this.initDom();
			}
			this.page = 1;
			//set page
			this.putPageDom.value = this.page
			this.getData();
			return this.dom;
		},
		last : function(){
			if(this.dom == null){
				this.initDom();
			}
			this.page = this.maxPage;
			this.putPageDom.value = this.page
			this.getData();
		},
		getData : function(){
			dojo.byId("loadinghy").style.display="inline-block";
			var postData = {"page":this.page,"pageSize":this.pageSize};
			for(var o in this.queryCondition){
				if(dojo.isString(this.queryCondition[o])){
					postData[o] = this.queryCondition[o];
				}else{
					if(this.queryCondition[o].domNode.innerHTML.indexOf('realvalue') >=0){
						console.log(o)
						postData[o] = dojo.byId(o).value;
					}else{
						postData[o] = this.queryCondition[o].value;
					}
				}
        	}
        	dojo.mixin(this.xhrArgs,{"postData":'postData='+dojo.toJson(postData)});
			var deferred = dojo.xhrPost(this.xhrArgs);
		}
	  })
});
