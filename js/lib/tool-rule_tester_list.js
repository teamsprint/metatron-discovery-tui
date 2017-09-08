module.exports = function(pass_val) {
    this.path = '/api/preparationdatasets/'+pass_val.dsId+'/transform';
    this.method = 'GET';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = null;

    this.print = function(json) {
        var ruleCurIdx = json.ruleCurIdx;
        var ruleStringInfos = json.ruleStringInfos;
        if( 0<ruleStringInfos.length ) {
            for(var ruleStringInfo of ruleStringInfos) {
                var ruleNo = ruleStringInfo.ruleNo;
                var ruleString = ruleStringInfo.ruleString;
                var ruleLine = "  "+ ruleNo +") "+ ruleString;
                console.log(ruleLine);
            }
        } else {
            console.log("There is no ruleString");
        }
    }
    return this;
}
