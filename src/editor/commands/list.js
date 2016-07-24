 module.exports = function(args, terminal) {
   var editor = terminal.global.editor;
   var server = terminal.global.server;

   terminal.pause();

   $.when(server.listModels(), server.listLayers())
     .done(function(a1, a2) {
       var models = a1[0];
       var layers = a2[0];
       terminal.log('-- models --');
       models.forEach(function(item) {
         if (editor.editable.name === item) {
           terminal.log('  ' + item + ' *');
         } else {
           terminal.log('  ' + item);
         }
       });
       terminal.log('-- layers --');
       layers.forEach(function(item) {
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
