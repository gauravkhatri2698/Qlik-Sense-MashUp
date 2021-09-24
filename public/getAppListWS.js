var HOST = "qlikdemo.polestarllp.com";

// exports.LoadAppData=function(callback) {
    const docList = {
        handle: -1,
        method: "GetDocList",
        params: [],
        outKey: -1,
        id: 1,
    };
    const appList_ws = new WebSocket(
        "wss://" + HOST + "/app/%3Ftransient%3D?reloadUri=https://" + HOST + "/dev-hub/engine-api-explorer&v="+ new Date()
    );

    appList_ws.onopen = function (msg) {
        console.log("App list connection opened");
        appList_ws.send(JSON.stringify(docList));
    };
    
    appList_ws.onerror = function () {
        console.log("Error!!", "Some issues fetching app list");
    };

    appList_ws.onmessage = function (data) {
        var wsres = JSON.parse(data.data);
        // console.log(wsres);
        if (wsres.method === "OnConnected") {
            console.log(wsres);
        } else if (wsres.id === 1) {  
            console.log(wsres.result.qDocList);
            window.qlik = wsres.result.qDocList;
        }
    };

