var url; 
$("input[type=radio]").change(function(){
    url = $(this).val()
    $("#exp-form").attr("action", url);
    if (url === "/app/upload_form"){
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/handsontable/0.34.4/handsontable.full.min.js", function(){
            $.getScript("/static/app/js/exp_input.js");
            });    
        }
    
    $.get(url, {}, function(result){
        form = $("#form");
        form.removeAttr("hidden");
        form.html(result);
        })
});

//~ Autocomplete initalization

    $('#id_tags-group').selectize({
    preload: true,
    plugins: ["restore_on_backspace"],
    placeholder: 'Enter Experiment Group',
    create: true,
    createOnBlur: true,
    maxItems: 1,
    persist: false
});

$('#id_tags-tags').selectize({
    preload: true,
    placeholder: 'Enter Tags',
    plugins: ['remove_button', "restore_on_backspace" ],
    delimiter: ',',
    create: true,
    createOnBlur: true,
    persist: false,
    hideSelected: true
    });
    
    
$('#var-name').selectize({
        valueField: 'value',
        labelField: 'key',
        searchField: 'value',
        plugins: ["restore_on_backspace"],
        placeholder: 'Enter variable name',
        create: true,
        createOnBlur: true,
        maxItems: 1,
        persist: false,
        options: [],
        load: function(query, callback) {
            if (!query.length) return callback();
            $.ajax({
            url: '/app/fields-autocomplete',
            type: 'GET',
            dataType: 'json',
            data: {
                q: query
            },
            error: function() {
                callback();
            },
            success: function(res) {
                callback(res.data);
            }
        });
            
    }
});


