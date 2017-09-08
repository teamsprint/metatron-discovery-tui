module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.wrangledDsId+'/transform';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var pass_json = {};
        pass_json.hdfsUrl = pass_val.hdfsUrl;
        pass_json.ruleListFile = pass_val.ruleListFile;
        pass_json.hiveJson = pass_val.hiveJson;
        pass_json.importedDataset=pass_val.importedDataset;
        pass_json.dataflow=pass_val.dataflow;
        pass_json.wrangledDsId = pass_val.wrangledDsId;
        pass_json.transform = json;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    };
    return this;
}
