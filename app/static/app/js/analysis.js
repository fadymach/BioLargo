function putdata(data){
    xdata = {}
    ydata = {}
    datasets = {}
    console.log("putdata")
    var ids = new Set()
    for (key in data){
        //console.log(data[key]['exp_id']);
        length = data[key]['y_ax'].length
        for(i=0; i<length; i++){
            ydata[Object.keys(Object.values(data[key]['y_ax'])[i])[0]] = [];
            xdata[Object.keys(Object.values(data[key]['x_ax'])[i])[0]] = [];
            ids.add(data[key]['exp_id']);
            
              
        }
    }
    console.log(ids);
    for(key in data){
        for(i=0;i<length;i++){
            ydata[Object.keys(Object.values(data[key]['y_ax'])[i])[0]].push(Object.values(Object.values(data[key]['y_ax'])[i])[0]);
            xdata[Object.keys(Object.values(data[key]['x_ax'])[i])[0]].push(Object.values(Object.values(data[key]['x_ax'])[i])[0]); 
        }
        
    }

    testpoints = []
    for (i=0; i< Object.values(xdata)[0].length; i++)
        testpoints.push({x:1+i, y:10*i})

    console.log(testpoints)

    console.log(Object.values(xdata)[0]);
    console.log(Object.values(ydata)[0]);

    var trace1 = {
        x: Object.values(xdata)[0],
        y: Object.values(ydata)[0],
        type:'scatter',
        mode:'markers',
    };

    Plotly.newPlot('chart', [trace1])
}

function putcols(columns){
    clear_axis();
    for (var i = 0; i< columns.length; i++){
       // $("#yaxis").append("<li id='"+columns[i]+"'><span class = 'badge badge-secondary ycol'>"+columns[i]+"<span class='ml-2'><input type='checkbox'></span></span></li>");
        $("#listcol").append("<li id='"+columns[i]+"' class = 'list-inline-item colitem' draggable='true' ondragstart='drag(event)'><span class = 'badge badge-secondary'>"+columns[i]+"</span></li>");
    }}




function get_columns(){

}

var ACTIONS = {'putdata':putdata, 'putcols':putcols}

function recv_socket(e){
    console.log("Recieved: "+ e.data);
    recv = JSON.parse(e.data);
    console.log(recv['action']);
    ACTIONS[recv['action']](recv['data'])
}

function clear_axis(){
    $("#listcol").empty();

}

function socket_dataselector(){
    console.log("test");
    var divs = document.querySelectorAll("#experiment_selector > div");
    console.log(divs);
    var tagsgroups = []
    for (var i =0; i< divs.length; i++){
        var item = {'id':divs[i].id,'table':divs[i].className.split(' ')[1]};
        tagsgroups.push(item);
    }
    console.log('tagsgroups: ', tagsgroups);
    console.log(socket);
    socket.send(JSON.stringify({'action':'getcols', 'data':Object.assign({},tagsgroups)}));


}

function socket_colselector(){
    var divy = document.querySelectorAll("#yaxbox > li")
    var divx = document.querySelectorAll("#xaxbox > li")
    var experiments = document.querySelectorAll("#experiment_selector > div");
    
    var ycols = []
    for (var i = 0; i< divy.length; i++){
        var item = {'col': divy[i].id.slice(3)};
        ycols.push(item);
    }
    var xcols = []
    for (var i =0; i<divx.length; i++){
        var item = {'col':divx[i].id.slice(3)};
        xcols.push(item);
    }
    
    var tagvals = []
    for (var i=0; i<experiments.length; i++){
        var item = {'id':experiments[i].id, 'table':experiments[i].className.split(' ')[1]};
        tagvals.push(item);
        
    }
    sendd = {'action':'getdata', 'data':{'ycols':ycols, 'xcols':xcols, 'tags':tagvals}}
    console.log(sendd);
    socket.send(JSON.stringify(sendd));
   
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


function drop_tag(ev, el) {
    ev.preventDefault();
    console.log(el.id);
    var data = ev.dataTransfer.getData("text");
    //var nodecopy = document.getElementById(data).cloneNode(true);
    //nodecopy.id = data;
    var originalDiv = document.getElementById(data);
    console.log(originalDiv.className.split(' ')[1]);
    if ((originalDiv.className.split(' ')[1] == 'tag') || (originalDiv.className.split(' ')[1] == 'group')) {
        el.appendChild(originalDiv);

        //el.appendChild(nodecopy);
        socket_dataselector()
    }else{
        return;
    }
}
function drop_axis(ev, el){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data);
    var nodecopy = document.getElementById(data).cloneNode(true);
    nodecopy.id = 'ax_' + data;
    el.appendChild(nodecopy);
    socket_colselector()

}

//Filters the tags by Id. So they are searchable. 
$('#tagFilter').on('change keyup paste',function(){
    var value = $('#tagFilter').val();
    if (value == ''){
        $('.tag').show();
        $('.group').show();
    }else{
        $('.tag').hide();
        $('.group').hide();
    }
    $('div[id*="'+value+'" i]').show();
    
})

$(document).ready(function(){
    //TODO: Choose Experiment Set
    //TODO: Initialize the Toolbox with Various types of Graphs
    //TODO: Initialize the X and Y axis with potential columns
    //TODO: Download Session
    //TODO: Restore Session from file

    Plotly.newPlot('chart', [{x:0,y:0}])
    socket = new WebSocket("ws://"+ window.location.host + window.location.pathname);
    socket.onmessage = function(e){
        recv_socket(e);
    }
    


})


