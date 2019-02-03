var circles = [];

function onKeyDown(event){
    var maxPoint = new PointerEvent(view.size.width, view.size.height);
    var randomPoint = Point.random();
    var point = maxPoint * randomPoint;
    newCircle.fillColor = "orange";
    circles.push(newCircle);
}

var animatedCircle = new Path.Circle(new Point(300,300), 100);
animatedCircle.fillColor = "red";

function onFrame(event){
    for(var i = 0; i< circles.length; i++){
        circles[i].fillColor.hue += 1;
        circles[i].scale(.9);
    }
    animatedCircle.fillColor.hue += 1;
}