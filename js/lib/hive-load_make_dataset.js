var path = require('path');
var fs = require('fs');

module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
        if( null==pass_val.sampleFile ) {
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.get_param = function() {
        var json = fs.readFileSync( pass_val.sampleFile );
        return JSON.parse(json);
    };
    var param = get_param();

    this.data = {
        checked: check(),
        dsName: "HIVE Dataset test",
        dsDesc: "Dataset with HIVE",
        dsType: "IMPORTED",
        importType: "HIVE",
        rsType: "SQL",
        custom: "{}",
        queryStmt: param.sql,
        charset: param.charset,
        dcId: null
    };

    this.print = function(json) {
        var pass_json = {};
        pass_json.sampleFile = pass_val.sampleFile;
        pass_json.importedDataset=json;
        pass_json.importedDatasetHref=json._links.self.href;

        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    }

    return this;
}

