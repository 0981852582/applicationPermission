// file này chứa các biến message dùng của các file controller
// variable chứa tên controller server hiện tại để call thực hiện các chức năng
// CITY
const controller_Server_City = 'City';
//      api getItem
const api_City_GetItem = "/" + controller_Server_City + "/GetItem/";
//      api Update
const api_City_Update = "/" + controller_Server_City + "/Update/";
//      api Insert
const api_City_Insert = "/" + controller_Server_City + "/Insert/";
//      api Insert Import
const api_City_InsertImport = "/" + controller_Server_City + "/InsertImport/";
//      api Delete
const api_City_Delete = "/" + controller_Server_City + "/Delete/";
//      api DeleteArray
const api_City_Deletes = "/" + controller_Server_City + "/DeleteArray/";
//      api DataTable
const api_City_DataTable = "/" + controller_Server_City + "/DataTable/";
//      api Download
const api_City_Download = "/" + controller_Server_City + "/Download/";
//      api Download
const api_City_CountItemByCity = "/" + controller_Server_City + "/CountItemByCity/";
//      api GetLookupItem
const api_City_GetLookupItem = "/" + controller_Server_City + "/GetLookupItem/";
//      variable chứa url trỏ đến thư mục chứa các file cần sử dụng của City
const folderJs_City = '/Content/js-controller/directory-city/';
//      variable chứa message thông báo comfirm xóa danh sách tỉnh thành phố 
const messageComfirm_City_Deletes = 'Bạn có thực sự muốn xóa những (Tỉnh / Thành phố) đã chọn ?';
//      variable chứa message thông báo comfirm xóa một tỉnh thành phố 
const messageComfirm_City_Delete = 'Bạn có thực sự muốn xóa (Tỉnh / Thành phố) này ?';
//      variable chứa message thông báo comfirm chưa chọn tỉnh thành phố cần xóa
const messageComfirm_City_NotExists = 'Vui lòng chọn (Tỉnh / Thành phố) trước khi thực hiện chức năng này';
const messageComfirm_City_NotExists = 'Vui lòng chọn (Tỉnh / Thành phố) trước khi thực hiện chức năng này';
//      variable chứa message thông báo comfirm đã tồn tại trong cơ sở dữ liệu
const messageComfirm_City_ImportExists = 'Mã (Tỉnh / Thành phố) là [{0}] đã tồn tại trong cơ sở dữ liệu';

// DISTRICT
const controller_Server_District = 'District';
//      api getItem
const api_District_GetItem = "/" + controller_Server_District + "/GetItem/";
//      api Update
const api_District_Update = "/" + controller_Server_District + "/Update/";
//      api Insert
const api_District_Insert = "/" + controller_Server_District + "/Insert/";
//      api Insert Import
const api_District_InsertImport = "/" + controller_Server_District + "/InsertImport/";
//      api Delete
const api_District_Delete = "/" + controller_Server_District + "/Delete/";
//      api DeleteArray
const api_District_Deletes = "/" + controller_Server_District + "/DeleteArray/";
//      api DataTable
const api_District_DataTable = "/" + controller_Server_District + "/DataTable/";
//      api Download
const api_District_Download = "/" + controller_Server_District + "/Download/";
//      api Download
const api_District_CountItemByDistrict = "/" + controller_Server_District + "/CountItemByDistrict/";

//      variable chứa url trỏ đến thư mục chứa các file cần sử dụng của District
const folderJs_District = '/Content/js-controller/directory-district/';
//      variable chứa message thông báo comfirm xóa danh sách quận huyện 
const messageComfirm_District_Deletes = 'Bạn có thực sự muốn xóa những (Quận / Huyện) đã chọn ?';
//      variable chứa message thông báo comfirm xóa một tỉnh quận huyện
const messageComfirm_District_Delete = 'Bạn có thực sự muốn xóa (Quận / Huyện) này ?';
//      variable chứa message thông báo comfirm chưa chọn quận huyện cần xóa
const messageComfirm_District_NotExists = 'Vui lòng chọn (Quận / Huyện) trước khi thực hiện chức năng này';
//      variable chứa message thông báo comfirm đã tồn tại trong cơ sở dữ liệu
const messageComfirm_District_ImportExists = 'Mã (Quận / Huyện) là [{0}] đã tồn tại trong cơ sở dữ liệu';

//MANAGERFUNCTION
const controller_Server_ManagerFunction = 'ManagerFunction';
//      api getItem
const api_ManagerFunction_GetItem = "/" + controller_Server_ManagerFunction + "/GetItem/";
//      api Update
const api_ManagerFunction_Update = "/" + controller_Server_ManagerFunction + "/Update/";
//      api Insert
const api_ManagerFunction_Insert = "/" + controller_Server_ManagerFunction + "/Insert/";
//      api Delete
const api_ManagerFunction_Delete = "/" + controller_Server_ManagerFunction + "/Delete/";
//      api DeleteArray
const api_ManagerFunction_Deletes = "/" + controller_Server_ManagerFunction + "/DeleteArray/";
//      api DataTable
const api_ManagerFunction_DataTable = "/" + controller_Server_ManagerFunction + "/DataTable/";
//      variable chứa url trỏ đến thư mục chứa các file cần sử dụng của ManagerFunction
const folderJs_ManagerFunction = '/Content/js-controller/manager_function/';
//      variable chứa message thông báo comfirm xóa danh sách chức năng
const messageComfirm_ManagerFunction_Deletes = 'Bạn có thực sự muốn xóa những chức năng đã chọn ?';
//      variable chứa message thông báo comfirm xóa một chức năng
const messageComfirm_ManagerFunction_Delete = 'Bạn có thực sự muốn xóa chức năng này ?';
//      variable chứa message thông báo comfirm chưa chọn chức năng cần xóa
const messageComfirm_ManagerFunction_NotExists = 'Vui lòng chọn chức năng trước khi thực hiện chức năng này';




// thực hiện khai báo biến hằng số dùng cho tất cả các controller
const message_Comfirm_Not_Permission = 'Tài khoản không có quyền thực hiện chức năng này';
const message_Comfirm_Not_Download = 'File Đính kèm không tồn tại';
const message_Error_Validate_Form_Import = 'Dữ liệu khi validate của dòng này không hợp lệ';



const message_Comfirm_Loading_Data = 'Đang tải bản ghi ...';
const message_Comfirm_Loading_Insert = 'Đang thực hiện thêm mới bản ghi ...';
const message_Comfirm_Loading_Update = 'Đang thực hiện cập nhật bản ghi ...';
const message_Comfirm_Loading_Delete = 'Đang thực hiện xóa bản ghi ...';
const message_Comfirm_Loading_Download = 'Đang thực hiện tải xuống ...';
const message_Comfirm_Loading_CheckData = 'Đang kiểm tra dữ liệu ...';