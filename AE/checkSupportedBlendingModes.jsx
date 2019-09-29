(function() {
    var unsupportedArray = [];
    var supportedString = ',normal,darken,multiply,color_burn,add,lighten,screen,color_dodge,overlay,soft_light,hard_light,difference,exclusion,hue,saturation,color,luminosity,';
    for (var i in BlendingMode) {
        var lowerCaseBM = i.toLowerCase();
        if (supportedString.indexOf(","+lowerCaseBM+",")>-1) {
            continue;
        } else {
            unsupportedArray.push(lowerCaseBM);
        }
    }
    $.writeln(unsupportedArray);
})()
