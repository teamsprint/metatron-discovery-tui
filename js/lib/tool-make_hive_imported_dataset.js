var path = require('path');

module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
        if(null==pass_val.dcId || 
            null==pass_val.dcHref ) {
            console.log( "something wrong" );
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.data = {
        checked: check(),
        dsName: "Imported Dataset with Hive Dataconnection",
        dsDesc: "Dataset with Hive",
        dsType: "IMPORTED",
        importType: "HIVE",
        rsType: "SQL",
        queryStmt: "SELECT * from test",
        custom: "",
        dcId: pass_val.dcId
    };

    this.print = function(json) {
        var printJson = {};
        printJson.dsId = json.dsId;
        printJson.dsHref = json._links.self.href;

        var beautify = JSON.stringify(printJson,null,2);
        console.log(beautify);
    };

    return this;
}
