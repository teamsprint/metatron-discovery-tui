module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.dsId+'/transform';
    this.method = 'PUT';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = {
        op: pass_val.op,
        ruleIdx: pass_val.ruleIdx,
        ruleString: pass_val.ruleString
    };

    this.print = function(json) {
        var ruleStringInfos = json.ruleStringInfos;
        var columns = json.matrixResponse.columns;

        console.log( "ruleCurIdx: "+ json.ruleCurIdx );
        for(var rule of ruleStringInfos ) {
            console.log("ruleNo "+rule.ruleNo+") " + rule.ruleString );
        }
        console.log( "\n\n======================" );

        var maxColSize=pass_val.maxColSize;

        var colSize=0;
        for(var column of columns ) {
            if(maxColSize<=colSize) { break; }
            var str = column.name;
            var space = 4-(str.length%4);
            process.stdout.write( " | " );
            process.stdout.write( str );
            for(var j=0;j<space;j++) {
                process.stdout.write( " " );
            }
            colSize++;
        }
        console.log(" |");

        var cnt=columns[0].value.length;
        if(pass_val.start<0) { pass_val.start=0; }
        for(var i=pass_val.start;i<cnt;i++) {
            if(0<pass_val.count && pass_val.start+pass_val.count<=i) { break; }

            var colSize=0;
            for(var column of columns ) {
                if(maxColSize<=colSize) { break; }
                var str = column.value[i];
                var space = 4-(str.length%4);
                process.stdout.write( " | " );
                process.stdout.write( str );
                for(var j=0;j<space;j++) {
                    process.stdout.write( " " );
                }
                colSize++;
            }
            console.log(" |");
        }
    };
    return this;
}
