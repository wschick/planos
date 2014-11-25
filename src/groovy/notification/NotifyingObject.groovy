package notification

import grails.rest.Resource

/**
 * Created by will.schick on 11/20/14.
 */
abstract class NotifyingObject implements Serializable{

    def brokerMessagingTemplate



    String resourceName(){
        return getClass().getAnnotation(Resource).uri()
    }

    def afterInsert(){
        println("Sending insert for ${id}")
        brokerMessagingTemplate.convertAndSend "/topic${resourceName()}".toString(), [action:"POST",id:getId()]
    }

    def afterUpdate(){
        println("Sending update for ${this}")
        brokerMessagingTemplate.convertAndSend "/topic${resourceName()}".toString(), [action:"PUT",id:getId()]
    }

    def afterDelete(){
        println("Sending delete for ${this}")
        brokerMessagingTemplate.convertAndSend "/topic${resourceName()}".toString(), [action:"DELETE",id:getId()]
    }

}
