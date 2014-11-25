package planos

import grails.rest.Resource
import notification.NotifyingObject

@Resource(uri = "/qualitativeValue",formats = ["json"])
class QualitativeValue extends NotifyingObject {

    String name;
    static constraints = {
        name unique: true
    }
}
