var fs = require('fs');

module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.wrangledDsId+'/transform';
    this.method = 'PUT';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
        if( null==pass_val.hdfsUrl || 
            null==pass_val.ruleListFile || 
            null==pass_val.hiveJson ||
            null==pass_val.importedDataset ||
            null==pass_val.dataflow ||
            null==pass_val.wrangledDsId ||
            null==pass_val.transformIdx
            ) {
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.read = function() {
        var lines = fs.readFileSync( pass_val.ruleListFile, 'utf-8').split('\n');
        if( pass_val.transformIdx < lines.length ) {
            var loopIdx = 0;
            for(var line of lines) {
                if(loopIdx==pass_val.transformIdx) {
                    /*
                    var ruleData = line.split(",");
                    if(ruleData.length!=3) {
                        process.exit(2);
                    }
                    var readData = {};
                    readData.op = ruleData[0].trim();
                    readData.ruleIdx= ruleData[1].trim();
                    readData.ruleString= ruleData[2].trim();
                    return readData;
                    */
                    return { "ruleString":line};
                }
                loopIdx++;
            }
        }
        process.exit(2);
        return null;
    };

    this.data = {
        checked: check,
        read: read,
        op: "APPEND",// read.op,
        ruleIdx: -1,//read.ruleIdx,
        ruleString: read.rulsString
    };

    this.print = function(json) {
        var pass_json = {};
        pass_json.hdfsUrl = pass_val.hdfsUrl;
        pass_json.ruleListFile = pass_val.ruleListFile;
        pass_json.hiveJson = pass_val.hiveJson;
        pass_json.importedDataset=pass_val.importedDataset;
        pass_json.dataflow=pass_val.dataflow;
        pass_json.wrangledDsId = pass_val.wrangledDsId;
        pass_json.transformIdx = pass_val.transformIdx + 1;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    };
    return this;
}
