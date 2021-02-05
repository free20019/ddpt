if(typeof(dojoConfig) == undefined ){
	dojoConfig = {
			 packages : [ {
				name : "app",
				location : "/fzxpt/app"
			} ]
	};
	console.log('#####simpleTest');
	if(typeof(dojo) == undefined ){
		 console.log('#####simpleTest dojo');
		 document.write('<script type="text/javascript" src="/fzxpt/libs/dojo-release-1.10.4-src/dojo/dojo.js"></script>');
	}
}
