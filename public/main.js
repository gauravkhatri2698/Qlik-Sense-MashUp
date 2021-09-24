/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */

var config = {
    host: "qlikdemo.polestarllp.com",
    prefix: "/virproxy/",
    port: "443",
    isSecure: true,
   
};
require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});

require(["js/qlik"], function (qlik) {
    qlik.setOnError(function (error) {
        $('#popupText').append(error.message + "<br>");
        $('#popup').fadeIn(1000);
    });
    $("#closePopup").click(function () {
        $('#popup').hide();
    });

    //callbacks -- inserted here --
    //open apps -- inserted here --
    var app = qlik.openApp('4096724e-2b40-4edb-82e9-96bae42ad088', config);

    //get objects -- inserted here --
    app.getObject('QV01','JeQuxwe');
    app.getObject('QV02','fqnBmpX');
    app.getObject('QV03','sDqbA');
    app.getObject('QV04','dYQJT');
    //create cubes and lists -- inserted here --

});
