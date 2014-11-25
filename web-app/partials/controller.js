/**
 * Created by will.schick on 11/17/14.
 */


var addEventController = angular.module("ErrorMessageController",["ngResource"]);


addEventController.config(function($provide, $compileProvider, $filterProvider) {
    Stomp.WebSocketClass = SockJS;
});

addEventController.controller("ErrorMessageController",["$scope","$resource",
 function($scope,$resource) {

     $scope.message = "hi";
     $scope.messages = []

     var User = $resource('/planos/portfolios/:id');
     $scope.message = User.query({max:22});

     var e = new User();
     e.name = "ASDASDASDASD";
     e.$save();

    /* $scope.client = ngstomp('http://localhost:8080/planos/stomp');
     $scope.client.connect(null,null, function(){
         console.log("subscribing");
         $scope.client.subscribe("/topic/portfolios", function(message) {
             $scope.messages.push(message.body);
         });
     }, function(e){
         console.log("ERROR" + e);
     });*/

     var socket = new SockJS("stomp");
     var client = Stomp.over(socket);

     client.connect(null,null, function() {
         client.subscribe("/topic/portfolios", function(message) {
             console.log(message);
             message = JSON.parse(message.body);

             console.log(message)

             $scope.message = User.get({id:message.id})
         });
     });


 }
]);