package planos

import grails.rest.Resource
import notification.NotifyingObject

@Resource(uri = "/qualitativeCriterion",formats = ["json"])
class QualitativeCriterion extends NotifyingObject {

    String name;
    static hasMany = [allowedQualitativeValues:QualitativeValue]
    static constraints = {
        name unique: true
    }
}
