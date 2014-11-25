package planos

import grails.rest.Resource
import notification.NotifyingObject


@Resource(uri="/portfolios",formats = ["json"])

class Portfolio extends NotifyingObject {


    String name;
    static hasMany = [projects:Project]

    static constraints = {
    }
}
