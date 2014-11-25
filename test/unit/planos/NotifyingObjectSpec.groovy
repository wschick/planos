package planos

import grails.rest.Resource
import org.springframework.messaging.simp.SimpMessagingTemplate
import notification.NotifyingObject
import spock.lang.Specification

/**
 * Created by will.schick on 11/20/14.
 */
class NotifyingObjectSpec extends Specification {

    @Resource(uri = "/snarf")
    class NotifyingObjectImpl extends NotifyingObject{
        Long getId(){
            return 123
        }
    }



    void "it should not throw an exception if @Resource annotation is present"(){
        when:
        "a notifying object is created with Reseource annotation"
        def result = new NotifyingObjectImpl();

        then:
        "it should be created"
        result != null
    }

    void "it should send a POST message after insert"(){
        given:
        "a notifying object"
        NotifyingObject notifyingObject = new NotifyingObjectImpl();

        and:
        "a brokerMessagingTemplate"
        notifyingObject.brokerMessagingTemplate = Mock(SimpMessagingTemplate)

        when:
        "afterInsert is called"
        notifyingObject.afterInsert()

        then:
        "a message should be sent"
        1 * notifyingObject.brokerMessagingTemplate.convertAndSend("/topic/snarf", [action:"POST",id:123])

    }

    void "it should send a PUT message after update"(){
        given:
        "a notifying object"
        NotifyingObject notifyingObject = new NotifyingObjectImpl();

        and:
        "a brokerMessagingTemplate"
        notifyingObject.brokerMessagingTemplate = Mock(SimpMessagingTemplate)

        when:
        "afterUpdate is called"
        notifyingObject.afterUpdate()

        then:
        "a message should be sent"
        1 * notifyingObject.brokerMessagingTemplate.convertAndSend("/topic/snarf", [action:"PUT",id:123])

    }

    void "it should send a DELETE message after delete"(){
        given:
        "a notifying object"
        NotifyingObject notifyingObject = new NotifyingObjectImpl();

        and:
        "a brokerMessagingTemplate"
        notifyingObject.brokerMessagingTemplate = Mock(SimpMessagingTemplate)

        when:
        "afterDelete is called"
        notifyingObject.afterDelete()

        then:
        "a message should be sent"
        1 * notifyingObject.brokerMessagingTemplate.convertAndSend("/topic/snarf", [action:"DELETE",id:123])

    }



}
