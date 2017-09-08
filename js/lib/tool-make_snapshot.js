module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.wrangledDsId;
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = {
        format: pass_val.format?pass_val.format:"CSV",
        compression: pass_val.compression?pass_val.compression:"NONE",
        partKey: pass_val.partKey?pass_val.partKey:"",
        profile: true
    };

    this.print = function(json) {
        var printJson = {};
        printJson = json;

        var beautify = JSON.stringify(printJson,null,2);
        console.log(beautify);
    };

    return this;
}
