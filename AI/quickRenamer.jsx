#target illustrator

 
(function main() {
var doc = app.activeDocument;
var docSelection = doc.selection;
var nameBase = 'Color1';
// var nameReplacement = 'Color5';

for (var i = 0; i < docSelection.length; i++) {
     var newName = nameBase;
     // var newName = docSelection[i].name.replace(nameBase,nameReplacement);
     docSelection[i].name = newName;
     $.writeln(docSelection[i].name);
     };
     // app.activeDocument.suspendHistory('Rename Selected Layers', 'main()');
}
)()