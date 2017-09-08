var path = require('path');

module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.file_type = function(filename) {
        var ext = path.extname(filename).toLowerCase();
        var fileType = 'dsv';
        switch(ext) {
            case ".json":
                fileType = 'JSON';
                break;
            case ".csv":
                fileType = 'DSV';
                break;
            case ".xls":
                fileType = 'EXCEL';
                break;
            case ".xlsx":
                fileType = 'EXCEL';
                break;
        }
        return fileType;
    };

    this.check = function() {
        if(null==pass_val.filekey || 
            null==pass_val.filename ) {
            console.log( "something wrong" );
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.data = {
        checked: check(),
        dsName: "Imported File Dataset",
        dsDesc: "Dataset with File",
        dsType: "IMPORTED",
        importType: "FILE",
        fileType: "LOCAL",
        filekey: pass_val.filekey,
        filename: pass_val.filename,
        custom: "{\"fileType\":\""+file_type(pass_val.filename)+"\",\"delimiter\":\",\"}",
        dcId: "about File DC"
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
