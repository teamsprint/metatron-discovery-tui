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
        if( null==pass_val.hdfsUrl || 
            null==pass_val.ruleListFile || 
            null==pass_val.hiveJson ) {
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.data = {
        checked: check(),
        dsName: "HDFS Dataset test",
        dsDesc: "Dataset with HDFS",
        dsType: "IMPORTED",
        importType: "FILE",
        fileType: "LOCAL",
        filekey: pass_val.hdfsUrl,
        filename: path.basename(pass_val.hdfsUrl),
        custom: "{\"fileType\":\""+file_type(pass_val.hdfsUrl)+"\",\"delimiter\":\",\"}",
        dcId: null
    };


    this.print = function(json) {
        var pass_json = {};
        pass_json.hdfsUrl = pass_val.hdfsUrl;
        pass_json.ruleListFile = pass_val.ruleListFile;
        pass_json.hiveJson = pass_val.hiveJson;
        pass_json.importedDataset=json;
        pass_json.importedDatasetHref=json._links.self.href;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    }

    return this;
}

