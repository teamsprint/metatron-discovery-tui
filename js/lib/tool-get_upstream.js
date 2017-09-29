module.exports = function(pass_val) {
    this.path = '/api/preparationdataflows/'+pass_val.dfId+'/upstreammap';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var printJson = {};
        printJson = json;

        var beautify = JSON.stringify(printJson,null,2);
        console.log(beautify);
    };

    return this;
}
