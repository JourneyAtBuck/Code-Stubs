#target illustrator

 

var docRef = app.activeDocument;

var nameBase = "Square ";

with (docRef) {

     for (var i = 0; i < layers.length; i++) {

          layers[i].name = nameBase+ i;

     }

}