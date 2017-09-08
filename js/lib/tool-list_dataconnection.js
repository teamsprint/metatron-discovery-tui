module.exports = function(pass_val) {
    this.path = '/api/connections';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var beautify = JSON.stringify(json,null,2);
        console.log(beautify);
    };

    this.print = function(json) {
        var connections = json._embedded.connections;
        var i=0;
        for(var connection of connections) {
            if(pass_val.start<=i) {
                if(0<pass_val.count && pass_val.start+pass_val.count<=i) { break; }
                console.log(i+") "+ connection.id +": "+ connection.name +", "+ connection.type +", "+ connection.hostname +":"+ connection.port +", "+ connection.username +"/"+ connection.password +", "+ connection.implementor +", "+ connection.connectUrl );
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
