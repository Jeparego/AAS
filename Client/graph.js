//variables
let Pline = null;
let data_line = [];
//obtener Id
canvas1 = document.getElementById("cvs_line");

const numvalues= 200;
for (let i=0; i < numvalues; ++i){
    data_line.push(null);
}

window.onload = function(){

    Pline = new RGraph.Line({
        id: 'cvs_line',
        data: data_line,

        options: {
            marginLeft: 75,
            marginRight: 55,
            filled: true,
            filledColors: ['#C2D1F0'],
            colors: ['#3366CB'],
            shadow: false,
            tickmarksStyle: null,
            xaxisTickmarksCount: 0,
            backgroundGridVlines: false,
            backgroundGridBorder: false,
            xaxis: false,
            textSize: 16
        }
    });
}
function drawLine(value){
    if (!Pline){return}
    RGraph.Clear(canvas1);
    data_line.push(value);
    if(data_line.length >numvalues){
        data_line = RGraph.arrayShift(data_line);
    }
    Pline.original_data[0]=data_line;
    Pline.draw();
}


//conexion de datos
const so = io.connect('http://localhost:3700');
so.on( "message", function (dataValue){
    drawLine(dataValue.value);

});



