module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.dsId+'/transform';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = {
        dfId: pass_val.dfId
    };

    this.print = function(json) {
        var printJson = {};
        printJson = json;

        var beautify = JSON.stringify(printJson,null,2);
        console.log(beautify);
    };

    return this;
}
