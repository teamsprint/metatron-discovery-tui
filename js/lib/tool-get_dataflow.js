module.exports = function(pass_val) {
    this.path = '/api/preparationdataflows/'+pass_val.dfId+'?projection=detail';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        console.log( "dfId: "+pass_val.dfId );
        console.log( "dfName: "+json.dfName );
        console.log( "datasets: imported("+json.importedDsCount+"), wrangled("+json.wrangledDsCount+")" );
        console.log( "==================" );

        var i=0;
        for(var dataset of json.datasets) {
            console.log("  "+i+")("+dataset.dsType+") [ "+ dataset.dsId +" ]: "+ dataset.dsName );
            i++;
        }
    };

    return this;
}
