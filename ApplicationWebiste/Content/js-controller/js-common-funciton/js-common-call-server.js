// hàm http phương thức post
const httpPost = function
    // parameter đầu vào của function
    (
    // đối tượng http call đến server cái này gọi từ controller của angularjs
    // truyền vào url trỏ đến server
    url,
    // dữ liệu truyền đến server là object
    dataObject,

    callBack)
// nội dung hàm
{
    http({
        method: "POST",
        url: url,
        dataType: 'json',
        data: dataObject,
        headers: { "Content-Type": "application/json" }
    }).then(function (rs) {
        var result = rs.data;
        if (isNull(result)) {
            showMessageError(message_Comfirm_Not_Permission);
            return callBack(false);
        } else if (result.Error) {
            showMessageError(result.Title);
            return callBack(false);
        }
        return callBack(rs.data);
    });
}
// hàm http phương thức post
const httpPostFormData = function
    // parameter đầu vào của function
    (
    // đối tượng http call đến server cái này gọi từ controller của angularjs
    // truyền vào url trỏ đến server
    url,
    // dữ liệu truyền đến server là object
    formdata,

    callBack)
// nội dung hàm
{
    http.post(url, formdata, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
    }).then(function (rs) {
        var result = rs.data;
        if (isNull(result)) {
            trong.showMessageError(message_Comfirm_Not_Permission);
            return callBack(false);
        } else if (result.Error) {
            trong.showMessageError(result.Title);
            return callBack(false);
        }
        return callBack(rs.data);
    });
}
// hàm http phương thức post có async
const httpPostAsync = function
    // parameter đầu vào của function
    (
    // đối tượng http call đến server cái này gọi từ controller của angularjs
    // truyền vào url trỏ đến server
    url,
    // dữ liệu truyền đến server là object
    dataObject)
// nội dung hàm
{
    var result;
    jQuery.ajax({
        url: url,
        method: 'POST',
        data: dataObject,
        dataType: 'json',
        async: false
    }).done(function (data) {
        result = data;
    });
    return result;
}
// hàm http của download file
const httpDownload = function
    // parameter đầu vào của function
    (
    // đối tượng http call đến server cái này gọi từ controller của angularjs
    // truyền vào url trỏ đến server
    url,
    // dữ liệu truyền đến server là object
    id,

    callBack)
// nội dung hàm
{
    http({
        method: "GET",
        url: url + id,
        dataType: 'json',
        headers: { "Content-Type": "application/json" }
    }).then(function (rs) {
        var result = rs.data;
        if (isNull(result)) {
            showMessageError(message_Comfirm_Not_Download);
            return callBack(false);
        } else if (result.Error) {
            showMessageError(result.Title);
            return callBack(false);
        }
        return callBack(rs.data);
    });
} 