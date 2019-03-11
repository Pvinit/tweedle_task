module.exports = function () {
    var env = "localEnv";


    var localEnv = {
        PORT: 8080
        , port: 8081
        , DB_URL: 'mongodb://localhost/tweedleDemo'
        , key: "tweedle technology"
        , secretKey: '<@tweedle@>'
        , url: "http://localhost:8080"
        , server: 'Local Server'
    }

    return env == "localEnv" ? localEnv : localEnv;
}