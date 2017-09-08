module.exports = function(pass_val) {
    this.path = '/api/connections/'+pass_val.dcId;
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var beautify = JSON.stringify(datasets,null,2);
        console.log(beautify);
    };

    return this;
}
