var fs = require('fs');

module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.wrangledDsId+'/transform';
    this.method = 'PUT';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
        if( null==pass_val.sampleFile ||
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

    this.get_rule = function() {
        var jsonStr = fs.readFileSync( pass_val.sampleFile );
        if(null!=jsonStr) {
            var json = JSON.parse(jsonStr);
            if(json!=null) {
                var rules = json.rules;
                if(null!=rules) {
                    if(pass_val.transformIdx<rules.length) {
                        return rules[pass_val.transformIdx];
                    }
                }
            }
        }
        process.exit(2);
        return null;
    };
    var rule = get_rule();

    this.data = {
        checked: check(),
        op: "APPEND",
        ruleIdx: -1,
        ruleString: rule
    };

    this.print = function(json) {
        var pass_json = {};
        pass_json.sampleFile = pass_val.sampleFile;
        pass_json.importedDataset=pass_val.importedDataset;
        pass_json.dataflow=pass_val.dataflow;
        pass_json.wrangledDsId = pass_val.wrangledDsId;
        pass_json.transformIdx = pass_val.transformIdx + 1;
        pass_json.transform = json;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    };
    return this;
}
