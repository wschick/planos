
##Data model

![data](logo11w.png)

##REST + STOMP notifications

The STOMP messaging is meant to work in parallel to the REST api from which the client interacts.

So for a given resource 'portfolios', with the resource path:

    /portfolios

There is an analogous STOMP notifitcation topic:

    /topic/portfolios
    
Subscribers to this topic will receive notifications for POST, PUT and DELETE operations. The notification will have an object containing the http method, plus the ID of 
modified or created resource, eg:

    {id:123,action:"PUT"}
    

##Architecture

    -----------------------------------
    |        Client (Angularjs)       |
    |                                 |
    -----------------------------------
    |                |                |
    |    REST        |     STOMP      |
    |                |                |
    -----------------------------------
           |                  ^
           V                  |
    -----------------------------------
    |                |                |
    |  REST Service  ->   STOMP       |
    |                |                |
    -----------------------------------
    |                                 |
    |              DB (Grails)        |
    |                                 |
    -----------------------------------
    
    