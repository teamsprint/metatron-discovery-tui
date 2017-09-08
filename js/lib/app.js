var fs = require('fs');
var http = require('http');
var querystring = require('querystring');

var hostname = 'localhost';
var port = 8180;
var exitCode = 0;

var params = {
    custom_file: null,
    silent: false,
    pipe_chain: false,
	keyJson: null
};

function print_error(txt) {
    if( false == params.silent ) {
        console.error(txt);
    }
}

function json_strip(o) { 
    var type = typeof o; 
    if (type == "object") { 
        for (var key in o) { 
            if(
                key=="_embedded" || 
                key=="_links" ||
                key=="createdBy" || 
                key=="createdTime" || 
                key=="modifiedBy" || 
                key=="modifiedTime" ||
                key=="matrixResponse" ||
                key=="dataset" ||
                key=="checked" ||
                key=="read" 
                ){ 
                delete o[key]; 
            } else if( key=="ruleStringInfos" ) {
                for(var ruleStringInfo of o[key]) {
                    delete ruleStringInfo["dataset"];
                    delete ruleStringInfo["jsonRuleString"];
                }
            } else { 
                json_strip(o[key]); 
            } 
        }
    }
} 

function jsonPathToValue(jsonData, path) { if (!(jsonData instanceof Object) || typeof (path) === "undefined") { throw "Not valid argument:jsonData:" + jsonData + ", path:" + path; } path = path.replace(/\[(\w+)\]/g, '.('); 
    path = path.replace(/^\./, ''); var pathArray = path.split('.'); for (var i = 0, n = pathArray.length; i < n; ++i) { var key = pathArray[i]; if (key in jsonData) { if (jsonData[key] !== null) { jsonData = jsonData[key]; } else { return null; } } else { return key; } } return jsonData; }

function main(params) {
    const postData = querystring.stringify({
        'grant_type':'password',
        'username':'polaris',
        'password':'polaris',
        'client_id':'polaris_trusted',
        'client_secret':'secret'
    });

    const options2 = {
        hostname: hostname,
        port: port,
        path: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Content-Length': Buffer.byteLength(postData),
            Connection: "Keep-alive"
        }
    };

    const options = {
        hostname: hostname,
        port: port,
        path: "/oauth/token?grant_type=password&scope=write&username=polaris&password=polaris",
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic cG9sYXJpc19jbGllbnQ6cG9sYXJpcw=="
        }
    };

    var token = '';
    const req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            token += chunk;
        });
        res.on('end', () => {
            var tokenJson = JSON.parse(token);
            var access_token = tokenJson.access_token;
            var token_type = tokenJson.token_type;
            token_type = token_type.charAt(0).toUpperCase() + token_type.slice(1);

            params.custom_file = params.custom_file.replace(/\.js$/g,'');
            if(false==params.custom_file.startsWith("/")) {
                params.custom_file = "./" + params.custom_file;
            }
            var custom = require(params.custom_file)(params.keyJson);
            if( null != custom.check) {
                custom.check();
            }
            if( null != custom.read) {
                var readData = custom.read();
                if(readData!=null) {
                    for(var key in readData) {
                        custom.data[key] = readData[key];
                    }
                }
            }
            var opts2 = {
                hostname: hostname,
                port: port,
                path: custom.path,
                method: custom.method,
                headers: {
                    Host: hostname,
                    'Content-Type': custom.content_type,
                    Accept : custom.accept,
                    Authorization: token_type +" "+ access_token
                }
            };

            var result2='';
            const rq2 = http.request(opts2, (rs2) => {
                rs2.setEncoding('utf8');
                rs2.on('data', (chunk) => {
                    result2 += chunk;
                });
                rs2.on('end', () => {
                    print_error("-----[response start]-----");
                    if(result2!='') {
                        var json = JSON.parse(result2);

                        if(json.exceptionClassName!=null || json.errorMsg!=null) {
                            var beautify = JSON.stringify(json,null,2);
                            print_error(beautify);
                            exitCode=-1;
                        } else if(custom.print!=null) {
                            custom.print(json);

                            json_strip(json);
                            var beautify = JSON.stringify(json,null,2);
                            print_error(beautify);
                        } else {
                            json_strip(json);
                            var beautify = JSON.stringify(json,null,2);
                            print_error(beautify);

                            console.log(beautify);
                        }
                    } else {
                        print_error('response is empty');
                        exitCode=-1;
                    }

                    print_error("-----[response end]-----");
                    print_error("==["+custom.method+ " "+ custom.path+"] end ===\n\n");
                    if( exitCode!=0 ) {
                        process.exit(exitCode);
                    }
                });

                rq2.on('error', (e) => {
                    print_error(`problem with request: ${e.message}`);
                    process.exit(-1);
                });
            });
            print_error("==["+custom.method+ " "+ custom.path+"]===");
            print_error("-----[request start]-----");
            print_error(custom.data);
            print_error("-----[request end]-----");
            if(custom.content_type=='application/json') {
                rq2.end(JSON.stringify(custom.data));
            } else {
                rq2.end(custom.data);
            }

        });
    });
    req.on('error', (e) => {
        print_error(`problem with request: ${e.message}`);
    });
    req.write(postData);
    req.end();
}

process.argv.forEach(function (val, index, array) {
    if(val=="-s" || val=="--silent") {
        params.silent = true;
    } else if(1<index) {
        if(array[index-1]=="-c"||array[index-1]=="--custom-file") {
            params.custom_file = val;
        }
    }
    return;
});
if( params.custom_file==null) {
    console.error("need a custom_file");
    process.exit();
}

// auto detect
if (process.stdin.isTTY) {
    params.pipe_chain=false;
    main(params);
} else {
	var keyJsonStr = "";
	process.stdin.on('data', function(chunk) {
        keyJsonStr += chunk;
	});
	process.stdin.on('end', function () {
		keyJsonStr = keyJsonStr.replace(/\n$/, '');
        params.keyJson = JSON.parse(keyJsonStr);

		params.pipe_chain=true;
		main(params);
	});
}

