/**
 * Created by will.schick on 11/19/14.
 */

describe("NotifiedResource",function(){


    var ResourceClass

    beforeEach(module("NotifiedResource"));

    beforeEach(module(function ($provide) {
        ResourceClass = jasmine.createSpy()
        $provide.value("$resource", jasmine.createSpy().and.returnValue(ResourceClass));
    }));

    describe("notificationService",function(){

        var notificationService

        var socket
        var client


        beforeEach(module(function ($provide) {
            socket = {}
            client = {}

            window.SockJS = jasmine.createSpy().and.returnValue(socket);
            window.Stomp = {over:jasmine.createSpy().and.returnValue(client)};

        }));

        beforeEach(inject(function(_notificationService_){
            notificationService = _notificationService_
        }))

        it ("should create a SockJS at ../stomp",function(){
            expect(window.SockJS).toHaveBeenCalledWith("../stomp")
        })

        it ("should create STOMP client with the socket created by SockJS",function(){
            expect(window.Stomp.over).toHaveBeenCalledWith(socket)
        })

        it ("should return the STOMP client",function(){
            expect(notificationService).toBe(client)
        })
    })

    describe("notifiedResource",function(){

        var notificationService
        var notifiedResource
        var resource

        beforeEach(module(function ($provide) {
            notificationService = {subscribe:jasmine.createSpy()}
            $provide.value("notificationService", notificationService);
        }));

        beforeEach(inject(function(_notifiedResource_,$resource){
            notifiedResource = _notifiedResource_
            resource = $resource
        }))

        it ("should be a function",function(){
            expect(notifiedResource instanceof Function).toBeTruthy();
        })

        describe("the object returned by creating a notifiedResource",function(){
            var Resource

            beforeEach(function(){
                Resource = notifiedResource("argle");
            })

            it ("should call $resource with the name prefixed by resource path",function(){
                expect(resource).toHaveBeenCalledWith("../argle/:id",{id:"@id"},{update:{method:"PUT",url:"../argle/:id"}})
            })

            it ("should return the value returned by $resource",function(){
                expect(Resource).toBe(ResourceClass)
            })

            it ("should add a function called 'subscribe'",function(){
                expect(Resource.subscribe instanceof Function).toBe(true)
            })

            describe("the 'subscribe' method on a notifiedResource",function(){
                it ("should call subscribe on the notificationSerivce with topic location and pass through callback",function(){

                    var callback = {}

                    Resource.subscribe(callback)

                    expect(notificationService.subscribe).toHaveBeenCalledWith("/topic/argle",callback);
                })
            })

            describe("populateArray",function(){

                it ("should replace object stubs with items from database",function() {
                    var OtherType = jasmine.createSpyObj("OtherType", ["get"])
                    OtherType.get.and.callFake(function(id){
                        return "Object-" + id.id
                    })

                    var data = [
                        {id:1234},
                        {id:2345},
                        {id:3456}
                    ]

                    Resource.populateArray(OtherType,data);

                    expect(data).toEqual([
                        "Object-1234",
                        "Object-2345",
                        "Object-3456"
                    ])
                })

                it ("should call a callback for each object if given",function() {
                    var OtherType = jasmine.createSpyObj("OtherType", ["get"])

                    var callback = jasmine.createSpy();

                    var callbacks = []


                    OtherType.get.and.callFake(function(id,callback){
                        callbacks.push(callback);
                        return "Object-" + id.id

                    })

                    var data = [
                        {id:1234},
                        {id:2345},
                        {id:3456}
                    ]

                    Resource.populateArray(OtherType,data,callback);

                    callbacks.forEach(function(c){
                        c();
                    });

                    expect(data).toEqual([
                        "Object-1234",
                        "Object-2345",
                        "Object-3456"
                    ])

                    expect(callback).toHaveBeenCalledWith("Object-1234")
                    expect(callback).toHaveBeenCalledWith("Object-2345")
                    expect(callback).toHaveBeenCalledWith("Object-3456")
                })


            })

            describe("onUpdate",function(){
                it("should subscribe to notifications for the resource topic",function(){

                    var callback = jasmine.createSpy();

                    Resource.onUpdate(callback);

                    expect(notificationService.subscribe).toHaveBeenCalledWith("/topic/argle",jasmine.any(Function));

                })

                it("should  call the given callback if a PUT notification is received",function(){

                    var callback = jasmine.createSpy();

                    var subscribeCallback = null;

                    notificationService.subscribe.and.callFake(function(topic,c){
                        subscribeCallback = c
                    })

                    Resource.onUpdate(callback);

                    subscribeCallback({body:'{"id":123,"action":"PUT"}'});

                    expect(callback).toHaveBeenCalledWith(123)


                })

                it("should not call the given callback if a non-PUT notification is received",function(){

                    var callback = jasmine.createSpy();

                    var subscribeCallback = null;

                    notificationService.subscribe.and.callFake(function(topic,c){
                        subscribeCallback = c
                    })

                    Resource.onUpdate(callback);

                    subscribeCallback({body:'{"id":123,"action":"POST"}'});

                    expect(callback).not.toHaveBeenCalled()
                })

                it ("should save the subscription to be cancelled on 'cancelSubscriptions'",function(){

                    var subscription = jasmine.createSpyObj("subscription",["unsubscribe"])

                    notificationService.subscribe.and.returnValue(subscription)

                    Resource.onUpdate({});

                    Resource.cancelSubscriptions();

                    expect(subscription.unsubscribe).toHaveBeenCalled();
                })
            })

            describe("onCreate",function(){
                it("should subscribe to notifications for the resource topic",function(){

                    var callback = jasmine.createSpy();

                    Resource.onCreate(callback);

                    expect(notificationService.subscribe).toHaveBeenCalledWith("/topic/argle",jasmine.any(Function));

                })

                it("should  call the given callback if a POST notification is received",function(){

                    var callback = jasmine.createSpy();

                    var subscribeCallback = null;

                    notificationService.subscribe.and.callFake(function(topic,c){
                        subscribeCallback = c
                    })

                    Resource.onCreate(callback);

                    subscribeCallback({body:'{"id":123,"action":"POST"}'});

                    expect(callback).toHaveBeenCalledWith(123)


                })

                it("should not call the given callback if a non-POST notification is received",function(){

                    var callback = jasmine.createSpy();

                    var subscribeCallback = null;

                    notificationService.subscribe.and.callFake(function(topic,c){
                        subscribeCallback = c
                    })

                    Resource.onCreate(callback);

                    subscribeCallback({body:'{"id":123,"action":"PUT"}'});

                    expect(callback).not.toHaveBeenCalled()
                })

                it ("should save the subscription to be cancelled on 'cancelSubscriptions'",function(){

                    var subscription = jasmine.createSpyObj("subscription",["unsubscribe"])

                    notificationService.subscribe.and.returnValue(subscription)

                    Resource.onCreate({});

                    Resource.cancelSubscriptions();

                    expect(subscription.unsubscribe).toHaveBeenCalled();
                })
            })

            describe("onDelete",function(){
                it("should subscribe to notifications for the resource topic",function(){

                    var callback = jasmine.createSpy();

                    Resource.onDelete(callback);

                    expect(notificationService.subscribe).toHaveBeenCalledWith("/topic/argle",jasmine.any(Function));

                })

                it("should  call the given callback if a DELETE notification is received",function(){

                    var callback = jasmine.createSpy();

                    var subscribeCallback = null;

                    notificationService.subscribe.and.callFake(function(topic,c){
                        subscribeCallback = c
                    })

                    Resource.onDelete(callback);

                    subscribeCallback({body:'{"id":123,"action":"DELETE"}'});

                    expect(callback).toHaveBeenCalledWith(123)


                })

                it("should not call the given callback if a non-DELETE notification is received",function(){

                    var callback = jasmine.createSpy();

                    var subscribeCallback = null;

                    notificationService.subscribe.and.callFake(function(topic,c){
                        subscribeCallback = c
                    })

                    Resource.onDelete(callback);

                    subscribeCallback({body:'{"id":123,"action":"PUT"}'});

                    expect(callback).not.toHaveBeenCalled()
                })

                it ("should save the subscription to be cancelled on 'cancelSubscriptions'",function(){

                    var subscription = jasmine.createSpyObj("subscription",["unsubscribe"])

                    notificationService.subscribe.and.returnValue(subscription)

                    Resource.onDelete({});

                    Resource.cancelSubscriptions();

                    expect(subscription.unsubscribe).toHaveBeenCalled();
                })
            })

            describe("the object created by construction",function(){
                var resourceInstance

                beforeEach(function(){
                    ResourceClass.prototype.$save = jasmine.createSpy("$save");
                    ResourceClass.prototype.$update = jasmine.createSpy("$update");

                    resourceInstance = new Resource()
                })

                it ("should not be null",function(){
                    expect(resourceInstance).not.toBe(null)
                    expect(resourceInstance).toBeDefined()
                })

                describe("saveOrUpdate",function(){
                    it ("should call $save if no id is present",function(){
                        resourceInstance.$saveOrUpdate()

                        expect(resourceInstance.$save).toHaveBeenCalled();
                    })

                    it ("should call $save with callback if no id is present",function(){

                        var callback = {}

                        resourceInstance.$saveOrUpdate(callback)

                        expect(resourceInstance.$save).toHaveBeenCalledWith(callback);
                    })

                    it ("should call $update the object has an id",function(){

                        resourceInstance.id = 123
                        resourceInstance.$saveOrUpdate()

                        expect(resourceInstance.$update).toHaveBeenCalled();
                    })

                    it ("should call $update with callback if the object has an id",function(){

                        var callback = {}
                        resourceInstance.id = 123

                        resourceInstance.$saveOrUpdate(callback)

                        expect(resourceInstance.$update).toHaveBeenCalledWith(callback);
                    })
                })
            })

        })
    })


});