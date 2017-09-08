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

        var tab = "    ";
        console.log( tab+ "ruleCurIdx: "+ json.ruleCurIdx );
        for(var rule of ruleStringInfos ) {
            console.log( tab +" ruleNo "+rule.ruleNo+") " + rule.ruleString );
        }
        console.log( "\n" + tab +"======================" );

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
    };
    return this;
}
