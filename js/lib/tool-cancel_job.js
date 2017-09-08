module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.dsId+'/cancel';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = {
    };

    this.print = function(json) {
        var beautify = JSON.stringify(keyJson,null,2);
        console.log(beautify);
    };

    return this;
}
