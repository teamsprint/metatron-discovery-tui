var fs = require('fs');

module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.wrangledDsId;
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';

    this.check = function() {
    }
    this.read = function() {
        var json = fs.readFileSync( pass_val.hiveJson, 'utf-8');
        return JSON.parse( json );
    };

    this.data = {
        read: read,
        format: null,
        compression: null,
        partKey: [],
        checked: check
    };

    this.print = function(json) {
        console.log( json );
    }

    return this;
}
