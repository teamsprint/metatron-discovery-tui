function jsonPathToValue(jsonData, path) { if (!(jsonData instanceof Object) || typeof (path) === "undefined") { throw "Not valid argument:jsonData:" + jsonData + ", path:" + path; } path = path.replace(/\[(\w+)\]/g, '.('); 
    path = path.replace(/^\./, ''); var pathArray = path.split('.'); for (var i = 0, n = pathArray.length; i < n; ++i) { var key = pathArray[i]; if (key in jsonData) { if (jsonData[key] !== null) { jsonData = jsonData[key]; } else { return null; } } else { return key; } } return jsonData; }

var listPath = [];
process.argv.forEach(function (val, index, array) {
    if(1<index) {
        listPath.push(val);
    }
    return;
});

if (process.stdin.isTTY) {
} else {
	var keyJsonStr = "";
	process.stdin.on('data', function(chunk) {
        keyJsonStr += chunk;
	});
	process.stdin.on('end', function () {
		keyJsonStr = keyJsonStr.replace(/\n$/, '');
        keyJson = JSON.parse(keyJsonStr);

        /*
        var beautify = JSON.stringify(keyJson,null,2);
        console.log(beautify);
        */

        for(var path of listPath) {
            console.log(jsonPathToValue(keyJson,path));
        }
	});
}
