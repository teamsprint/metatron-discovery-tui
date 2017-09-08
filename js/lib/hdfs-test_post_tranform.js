module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.importedDataset.dsId+'/transform';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
        if( null==pass_val.hdfsUrl || 
            null==pass_val.ruleListFile || 
            null==pass_val.hiveJson ||
            null==pass_val.importedDataset ||
            null==pass_val.dataflow
            ) {
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.data = {
        checked: check(),
        dfId: pass_val.dataflow.dfId
    };

    this.print = function(json) {
        var pass_json = {};
        pass_json.hdfsUrl = pass_val.hdfsUrl;
        pass_json.ruleListFile = pass_val.ruleListFile;
        pass_json.hiveJson = pass_val.hiveJson;
        pass_json.importedDataset=pass_val.importedDataset;
        pass_json.dataflow=pass_val.dataflow;
        pass_json.wrangledDsId = json.wrangledDsId;
        pass_json.transformIdx = 0;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    };
    return this;
}
