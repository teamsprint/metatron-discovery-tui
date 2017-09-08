module.exports = function(pass_val) {
    this.path = '/api/preparationdataflows?projection=listing';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var dataflows = json._embedded.preparationdataflows;
        var i=0;
        for(var dataflow of dataflows) {
            if(pass_val.start<=i) {
                if(0<pass_val.count && pass_val.start+pass_val.count<=i) { break; }
                console.log(i+") [ "+ dataflow.dfId +" ]: "+ dataflow.dfName );
            }
            i++;
        }
    };

    return this;
}
