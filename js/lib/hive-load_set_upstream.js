module.exports = function(pass_val) {
    this.path = '/api/preparationdataflows/'+pass_val.dataflow.dfId+'/datasets/'+pass_val.wrangledDsId+'/upstream/'+pass_val.importedDataset.dsId;
    this.method = 'POST';
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

    this.data = null;

    this.print = function(json) {
        var pass_json = {};
        pass_json.sampleFile = pass_val.sampleFile;
        pass_json.importedDataset=pass_val.importedDataset;
        pass_json.dataflow=pass_val.dataflow;
        pass_json.wrangledDsId = pass_val.wrangledDsId;
        pass_json.transformIdx = pass_val.transformIdx;
        pass_json.upstream = json;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    };
    return this;
}
