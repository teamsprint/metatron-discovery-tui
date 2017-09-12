module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/staging?sql='+encodeURIComponent(pass_val.sql)+'&size='+pass_val.size;
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var beautify = JSON.stringify(json,null,2);
        console.log(beautify);
    };

    return this;
}
