module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/file/'+pass_val.fileKey+'?sheetname='+pass_val.sheetname+'&sheetindex='+pass_val.sheetindex+'&resultSize='+pass_val.resultSize+'&hasFields='+pass_val.hasFields;
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    return this;
}
