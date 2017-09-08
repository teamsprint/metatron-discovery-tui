module.exports = function(pass_val) {
    this.path = '/api/datasources';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    return this;
}
