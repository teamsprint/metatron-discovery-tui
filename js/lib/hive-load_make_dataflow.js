module.exports = function(pass_val) {
    this.path = '/api/preparationdataflows';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
        if( null==pass_val.sampleFile ||
            null==pass_val.importedDataset ||
            null==pass_val.importedDatasetHref 
            ) {
            console.log( pass_val );
            process.exit(1);
            return false;
        }
        return true;
    };

    this.data = {
        checked: check(),
        dfName: "Hive Dataflow",
        dfDesc: "hive Dataflow",
        datasets: [ pass_val.importedDatasetHref ]
    };

    this.print = function(json) {
        var pass_json = {};
        pass_json.sampleFile = pass_val.sampleFile;
        pass_json.importedDataset=pass_val.importedDataset;
        pass_json.dataflow=json;
        var beautify = JSON.stringify(pass_json,null,2);
        console.log(beautify);
    };

    return this;
}
