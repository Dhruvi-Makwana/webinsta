function makeAjaxRequest(methodType, csrfToken, url, data, callback)
{

    $.ajax({
        method: methodType,
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: url,
        data: data,
        contentType: false,
        success: function(data) {
            if (callback) {
                callback(data)                
            }
        },
        error: function(data) {
           console.log(data)
        },
        cache: false,
        contentType: false,
        processData: false
    });



}
