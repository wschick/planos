package planos

import grails.rest.Resource
import notification.NotifyingObject

@Resource(uri = "/projects",formats = ["json"])
class Project extends NotifyingObject{

    String name;
    String description;
    String creator

    static belongsTo = [portfolio:Portfolio]

    static hasMany = [qualitativeEvaluation:QualitativeEvaluation,
                      quantitativeEvaluation:QuantitativeEvaluation]

    static constraints = {
        name unique: true

    }
}
