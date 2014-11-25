<!DOCTYPE html>
<html ng-app="planos">
	<head>
        <asset:javascript src="bower_components/jquery/dist/jquery.js" preload="none"></asset:javascript>
        <asset:javascript src="bower_components/angular/angular.js" preload="none"></asset:javascript>
        <asset:javascript src="bower_components/angular-resource/angular-resource.js"  preload="none"></asset:javascript>
        <asset:javascript src="bower_components/angular-route/angular-route.js"  preload="none"></asset:javascript>
        <asset:javascript src="bower_components/sockjs/sockjs.js" preload="none"></asset:javascript>
        <asset:javascript src="bower_components/stomp-websocket/lib/stomp.js"  preload="none"></asset:javascript>
        <asset:javascript src="bower_components/angular-dragdrop/src/angular-dragdrop.js" preload="none"></asset:javascript>
        <asset:javascript src="bower_components/jquery-ui/jquery-ui.js" preload="none"></asset:javascript>


        <asset:stylesheet src="bower_components/bootstrap/dist/css/bootstrap.css"></asset:stylesheet>
        <asset:javascript src="bower_components/bootstrap/dist/js/bootstrap.js"  preload="none"></asset:javascript>

        <asset:javascript src="Planos.js"  preload="none" ></asset:javascript>

        <asset:javascript src="PortfolioController.js"  preload="none" ></asset:javascript>

	</head>
<body ng-view="">

</body>

</html>
