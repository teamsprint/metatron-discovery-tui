module.exports = function(pass_val) {
    this.path = '/api/preparationsnapshots/'+pass_val.ssId+'?projection=detail';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        console.log( "ssId: "+pass_val.ssId );
        console.log( "creatorDfName: "+json.creatorDfName );
        console.log( "dsName: "+json.dsName );
        console.log( "totalBytes: "+json.totalBytes );
        console.log( "totalLines: "+json.totalLines );
        console.log( "==================" );
    };

    return this;
}
