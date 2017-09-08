module.exports = function(pass_val) {
    this.path = '/api/preparationdataflows';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
        if( null==pass_val.hdfsUrl || 
            null==pass_val.ruleListFile || 
            null==pass_val.hiveJson ||
            null==pass_val.importedDataset
            ) {
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.data = {
        checked: check(),
        dfName: "Hdfd Dataflow",
        dfDesc: "hdfs Dataflow",
        datasets: [ pass_val.importedDatasetHref ]
    };

    this.print = function(json) {
        var pass_json = {};
        pass_json.hdfsUrl = pass_val.hdfsUrl;
        pass_json.ruleListFile = pass_val.ruleListFile;
        pass_json.hiveJson = pass_val.hiveJson;
        pass_json.importedDataset=pass_val.importedDataset;
        pass_json.dataflow=json;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    };

    return this;
}
