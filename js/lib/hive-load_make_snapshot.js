var fs = require('fs');

module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.wrangledDsId;
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.get_param = function() {
        var json = fs.readFileSync( pass_val.sampleFile );
        return JSON.parse(json);
    };
    var param = get_param();

    this.check = function() {
        if( null==pass_val.sampleFile ) {
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.data = {
        checked: check(),
        compression: param.compression,
        dbName: param.dbName,
        format: param.format,
        mode: param.mode,
        partKeys: param.partKeys,
        ssType: param.ssType,
        tblName: param.tblName,
        uri: param.uri,
        extHdfsDir: param.extHdfsDir
    };

    this.print = function(json) {
        console.log( json );
    }

    return this;
}
