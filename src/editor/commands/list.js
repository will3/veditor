 module.exports = function(args, terminal) {
   var editor = terminal.global.editor;
   var server = terminal.global.server;

   terminal.pause();

   server.listModels()
     .done(function(list) {
       terminal.log('models');
       list.forEach(function(item) {
         terminal.log('  ' + item);
       });
     })
     .fail(function() {
       terminal.log('something went wrong');
     })
     .always(function() {
       terminal.resume();
     });
 };
