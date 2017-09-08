module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.dsId+'/previewLines';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var previewLines = json._embedded.preparationpreviewlines;
        for( var preview of previewLines ) {
            var colValue = preview.colValue;
            var rowNo = preview.rowNo;
            var colName = preview.colName;

            if(0<pass_val.row && pass_val.row<=rowNo) { continue; }

            console.log( rowNo+" "+colName+"\t["+colValue+"]" );
        }
    };

    return this;
}
