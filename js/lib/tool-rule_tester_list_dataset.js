module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets?projection=listing&size=50';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var datasets = json._embedded.preparationdatasets;
        var i=0;
        for(var dataset of datasets) {
            if("WRANGLED"==dataset.dsType) {
                //console.log("  "+i+") [ "+ dataset.dsId +" ]" );
                process.stdout.write(dataset.dsId +" " );
                i++;
            }
        }
    };

    return this;
}
