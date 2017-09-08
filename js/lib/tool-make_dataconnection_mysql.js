module.exports = function(pass_val) {
    this.path = '/api/connections';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = {
        implementor : "MYSQL",
        type : "JDBC",
        name : pass_val.dcName,
        username : pass_val.username,
        password : pass_val.password,
        hostname : pass_val.hostname,
        port : pass_val.port
    };

    this.print = function(json) {
        var printJson = {};
        printJson.dcId = json.id;
        printJson.dcHref = json._links.self.href;

        var beautify = JSON.stringify(printJson,null,2);
        console.log(beautify);
    };

    return this;
}
