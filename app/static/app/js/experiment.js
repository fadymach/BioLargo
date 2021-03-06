// Experiment Javascript
function makeMetadata(data){
    table = $("#metadata-table");
    row = $('<tr></tr>')
    $.each(data, function(key, obj){
        
        $('<td></td>',{text:key}).appendTo(row);
    })
    row.appendTo(table);
    row = $('<tr></tr>')
    $.each(data, function(key, obj){
        
        $('<td></td>',{text:obj}).appendTo(row);
    })
    row.appendTo(table);
    

}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function deleteExperiment(){
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings){
            if(!this.crossDomain){
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            }
        }
    });
    $. ajax({
        type: 'POST',
        url: "/app/experimentrm/"+id,
        dataType: 'json',
        success: function(data) {
            // console.log(data);
            if(data.result){
                window.location = '/app/';
            }
        }
    })

}

function makeTable(jsondata){
    table = jQuery("#experimental-data"), row = null, data = null;
    console.log(jsondata);
    //$.each(jsondata, function(key, obj){ $.each(jsondata, function(k, v){ console.log(v)})});
    makeHeaders(jsondata, table);
    $.each(jsondata, function(key, obj){
        row = $('<tr></tr>'); // Create a new row
        $.each(obj, function(k, v){
            $('<td></td>',{text:v}).appendTo(row);
        });
        row.appendTo(table);
    });
}

function makeHeaders(jsondata, table){
    console.log(jsondata);
    row = $('<tr></tr>');
    for (prop in jsondata[0]){
        //console.log(prop);
        $('<th></th>',{text:prop}).appendTo(row);
    }
    row.appendTo(table);


}




function makeChart(jsondata){
    var time = [];
    var removal = [];
    var test = [1,2,3,4,5,6,7,8,9,5,4,2,7,8];
    $.each(jsondata, function(key, obj){
        time.push(obj["Time [min]"]);
        removal.push(Math.log(obj["StockCFU [CFU/mL]"]) - Math.log(obj["RemainingCFU [CFU/mL]"]));
    });
    console.log(removal)
    var ctx = document.getElementById("removalChart");
    var removalChart = new Chart(ctx, {
        type: 'line',
        
        data: {
            labels:time,
            datasets:[
                {
                    label: "Stock / Remaining (log10)",
                    data:removal,
                }
            ]
        }
        
    });
}
$.ajax({
    url: "/app/experimentjs/"+id,
    dataType: 'json',
    success: function(data) {
       // console.log(data);
        makeTable(data);
        makeChart(data);
        makeMetadata(metadata)
    }
});

function commentBuilder(commentObject){
    console.log(commentObject);
    var comment = `<li class = "list-group-item">
        <div class = "media">
          <img src = "https://www.gravatar.com/avatar/e3569fea24b8a64d7b6cf0fd57234ee9?s=40" class="d-flex mr-3">
          <div class = "media-body">
            <h5 class = "mt-0">`+commentObject["user"]+`</h5>
            <div class="commentContent">
              <p>`+commentObject["content"]+`</p>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <small>`+'Month - Day - Year'+`</small>
          </div>
        </div>
      </li>`;
    $("#commentList").append(comment);


}
function reloadComments(){
    //commentBuilder("Chuck", "1", "WHAT THE HELL DID YOU JUST SAY TO ME", "05-31-1995");
    $("#commentList").empty();
    $.ajax({
        method: "GET",
        url: "/api/comment/",
        dataType: 'json',
        data: {'exp_id':id},
        success: function(data) {
            // console.log(data);
            
            console.log(data);
            for (var key in data){
                commentBuilder(data[key]);
            }
        }
    });
}

TABS = {"overviewLink":$("#overview"), "commentLink":$("#commentbox"), "dataLink":$("#data"), "settingsLink":$("#settings")}
$(document).ready(function(){
    $(".nav.tabbar > .nav-item > .nav-link").click(function(e){
        e.preventDefault();

        var oldtab =  $(".nav.tabbar > .nav-item > .nav-link.active")[0]
        var newtab = $(this)[0];

        TABS[oldtab.id].hide();
        TABS[newtab.id].show();
        $("#"+ oldtab.id).removeClass("active");
        $("#"+this.id).addClass("active");
        

    });

    $("#submitCommentButton").click(function(e){
        var content = $("#newCommentInput")
        content.prop("disabled",true)
        var text = content.val()
        var data = {'content':text, 'exp_id':id}
        console.log(data);
        $.ajax({
            beforeSend: function(xhr, settings){
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            url: "/api/comment/",
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify(data),
            success: function(data) {
                content.prop("disabled", false);
                content.val('');
                reloadComments()
               
            }
        });
    });
});
