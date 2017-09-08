module.exports = function(pass_val) {
    this.path = '/api/preparationdataflows';
    this.method = 'POST';
    this.content_type = 'application/json';
    this.accept = 'application/json';
    this.data = {
        dfName: "Dataflow Test",
        dfDesc: "Dataflow Test",
        datasets: [ pass_val.dsHref ]
    };

    this.print = function(json) {
        var printJson = {};
        printJson.dsId = pass_val.dsId;
        printJson.dfId = json.dfId;

        var beautify = JSON.stringify(printJson,null,2);
        console.log(beautify);
    };

    return this;
}
