/**
 * Created by will.schick on 11/19/14.
 */

var notifiedResource = angular.module("NotifiedResource",["ngResource"]);


notifiedResource.factory("notificationService",[function(){

    var socket = new SockJS("../stomp");
    var client = Stomp.over(socket);


    return client;

}]);

notifiedResource.factory("notifiedResource",["$resource","notificationService",function($resource,notificationService){

    var resourceLocation = "../"
    var topicLocation = "/topic/"
    return function(name){
        var resource = $resource(resourceLocation + name + "/:id",{id: "@id"},{update:{method:"PUT",url:"../"+ name + "/:id"}});
        var subscriptions = []

        resource.subscribe = function(callback){
            return notificationService.subscribe(topicLocation + name,callback);
        }

        resource.populateArray = function(T,a,callback){

            console.log(T)

            for (var i = 0; i < a.length; i++){
                var temp = function(){
                    var obj = T.get({id: a[i].id}, function () {
                        if (callback)
                            callback(obj);
                    });

                    a[i] = obj;
                }();


            }
        }


        var subscribeToAction =  function(action, callback){
            subscriptions.push(notificationService.subscribe(topicLocation + name,function(data){
                var body = JSON.parse(data.body);
                if (body.action == action)
                    callback(body.id);
            }));
        }


        resource.onUpdate = function(callback){
            subscribeToAction("PUT",callback)
        }

        resource.onCreate = function(callback){
            subscribeToAction("POST",callback)
        }

        resource.onDelete = function(callback){
            subscribeToAction("DELETE",callback)
        }

        resource.cancelSubscriptions = function(){
            subscriptions.forEach(function(subscription){
                subscription.unsubscribe();
            })
        }

        resource.prototype.$saveOrUpdate = function(callback){
            if (this.id)
                this.$update(callback)
            else
                this.$save(callback);
        }

        return resource;
    }

}]);