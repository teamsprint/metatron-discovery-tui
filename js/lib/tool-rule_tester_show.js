module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.dsId+'/transform';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var matrixResponse = json.matrixResponse;
        var columns = json.matrixResponse.columns;
        var tab = "  ";
        if(null!=columns) {
            for(var column of columns ) {
                process.stdout.write(tab);
                var str = column.name;
                var space = 4-(str.length%4);
                process.stdout.write( " | " );
                process.stdout.write( str );
                for(var j=0;j<space;j++) {
                    process.stdout.write( " " );
                }
            }
            console.log(" |");

            var cnt=columns[0].value.length;
            for(var i=0;i<cnt;i++) {
                process.stdout.write(tab);
                for(var column of columns ) {
                    var str = column.value[i];
                    if(null==str) { str="NULL"; }
                    var space = 4-(str.length%4);
                    process.stdout.write( " | " );
                    process.stdout.write( str );
                    for(var j=0;j<space;j++) {
                        process.stdout.write( " " );
                    }
                }
                console.log(" |");
                if(5<i) { break; }
            }
        }
    }
    return this;
}
