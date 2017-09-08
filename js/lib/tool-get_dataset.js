module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.dsId+'?projection=detail';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        console.log( "dsId: "+pass_val.dsId );
        console.log( "dsName: "+json.dsName );
        console.log( "dsType: "+json.dsType );
        console.log( "==================" );

        var creatorDfId = json.creatorDfId;
        var i=0;
        for(var dataflow of json.dataflows) {
            var creator = " ";
            if(creatorDfId==dataflow.dfId) {
                creator = "*";
            }
            console.log(" "+creator+i+") [ "+ dataflow.dfId +" ]: "+ dataflow.dfName );
            i++;
        }
    };

    return this;
}
