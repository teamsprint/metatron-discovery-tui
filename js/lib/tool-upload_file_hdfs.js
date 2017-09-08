var fs = require('fs');
var path = require('path');
var boundary = 'BoundaryBoundary';
var filename = 'upload_file.csv';
var newline = '\r\n';
module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/upload_hdfs';
    this.method = 'POST';
    this.content_type = 'multipart/form-data; boundary='+boundary;
    this.accept = 'application/json';
    this.data = '--' + boundary + newline
		+ 'Content-Disposition: form-data; name="targetPath"'+newline+newline
        + pass_val.targetPath+newline
        + '--' + boundary + newline
		+ 'Content-Type: application/octet-stream'+newline
		+ 'Content-Disposition: form-data; name="file"; filename="'+path.basename(pass_val.filePath)+'"'+newline
		+ 'Content-Transfer-Encoding: binary' + newline + newline
		+ fs.readFileSync(pass_val.filePath)
        + newline + '--' + boundary + '--';

    return this;
}
