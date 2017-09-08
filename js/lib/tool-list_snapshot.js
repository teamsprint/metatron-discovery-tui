module.exports = function(pass_val) {
    this.path = '/api/preparationsnapshots';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var snapshots = json._embedded.preparationsnapshots;
        var i=0;
        for(var snapshot of snapshots) {
            if(pass_val.start<=i) {
                if(0<pass_val.count && pass_val.start+pass_val.count<=i) { break; }
                console.log(i+") [ "+ snapshot.ssId +" ]: "+ snapshot.ssName );
            }
            i++;
        }
    };

    return this;
}
