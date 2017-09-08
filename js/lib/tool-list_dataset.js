module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets?projection=listing';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var datasets = json._embedded.preparationdatasets;
        var i=0;
        for(var dataset of datasets) {
            if(pass_val.start<=i) {
                if(0<pass_val.count && pass_val.start+pass_val.count<=i) { break; }
                console.log(i+")("+dataset.dsType+") [ "+ dataset.dsId +" ]: "+ dataset.dsName );

                var j=0;
                for(var dataflow of dataset.dataflows) {
                    console.log( "  flow " +j+ "> [ "+ dataflow.dfId +" ]: "+ dataflow.dfName);
                    j++;
                }
            }
            i++;
        }
        /*
        var beautify = JSON.stringify(datasets,null,2);
        console.log(beautify);
        */
    };

    return this;
}
