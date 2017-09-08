module.exports = function(pass_val) {
    this.path = '/api/connections';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    return this;
}
