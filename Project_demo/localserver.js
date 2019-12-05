var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + '/dist')).listen(4100, function(){
  console.log('Server running on 4100...');
});
