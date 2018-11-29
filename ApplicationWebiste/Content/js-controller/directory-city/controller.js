app.controller('directoryCity', function ($scope, $rootScope, $uibModal) {
    // thực hiện khai báo các variable cho controller
    var trong = $scope;
    trong.title = 'Quản lý danh mục (Tỉnh / Thành phố)';
    // gọi hàm khởi tạo chứa những thông số validate ...
    //    Bắt buộc gọi nếu muốn thực hiện những hành động như validateForm ...
    initValidateForm($rootScope);
    // Hàm thực hiện việc reload lại Datatable bên ngoài index
    $rootScope.reload = function () {
        $rootScope.dataTable.query();
    }
    // khai báo biến validate form
    $rootScope.validationOptions = [
        {
            Title: 'City',
            rule: {
                Required: true,
                Maxlength: 8,
                Special: true
            },
            message: {
                Required: "Mã (Tỉnh / Thành phố) không được để trống.",
                Maxlength: "Mã (Tỉnh / Thành phố) không được lớn hơn 8 ký tự.",
                Special: 'Mã (Tỉnh / Thành phố) không được có ký tự đặc biệt.'
            },
            Place: "col-md-2"
        },
        {
            Title: 'Title',
            rule: {
                Required: true,
                Maxlength: 25
            },
            message: {
                Required: "Tên (Tỉnh / Thành phố ) không được để trống.",
                Maxlength: "Tên (Tỉnh / Thành phố ) không được lớn hơn 25 ký tự."
            },
            Place: "col-md-6"
        }
    ];
    // Khai báo Datatable cho page này
    $rootScope.dataTable = {
        // Page hiện tại của dataTable
        currentPage: trong.settingOfPadding.currentPage,
        // Tính toán xem pagging cần bao nhiêu page vì vậy cần khai báo số lượng item trên 1 page
        maxSize: trong.settingOfPadding.maxSize,
        // Đếm số bản ghi hiện có trong Datatable lấy trong database theo điều kiện chỉ định
        //      hiện tại mặc định là 0 khi với init Datatable
        totalItem: 0,
        // Giới hạn số lượng page hiển thị trong 1 thời điểm
        //      ví dụ đang ở page 1 thì chỉ hiển thị [1 2 3 4 5] nếu đang ở page 5 thì hiển thị [3 4 5 6 7]
        numberPage: trong.settingOfPadding.numberPage,
        // Chứa dữ liệu của Datatable
        values: [],
        // Chứa thông tin tìm kiếm của Datatable
        valueSearch: '',
        // hiện thị thông tin Datatable bên dưới Datatable trên view
        location: trong.settingOfPadding.location,
        // Chứa giá trị trên Field cần xắp xếp hiện tại
        //      Mặc định khi khởi tạo thì lấy giá trị của biến khai báo chung
        orderBy: trong.settingOfPadding.orderBy,
        // Chứa trạng thái Order by là ASC hay là DESC
        //      nếu = true -> ASC
        //      nếu = false -> DESC
        orderType: true,
        // Hàm thực hiện reload lại Dữ liệu trong Datatable 
        //      làm mới xóa tất cả thông tin tìm kiếm cũng như phân trang trước đó và trở về mặc định
        reload: function () {
            this.currentPage = trong.settingOfPadding.currentPage;
            this.maxSize = trong.settingOfPadding.maxSize;
            this.totalItem = 0;
            this.numberPage = trong.settingOfPadding.numberPage;
            this.values = [];
            this.valueSearch = '';
            this.location = trong.settingOfPadding.location;
            this.query();
        },
        // Sự kiện thay đổi xắp xếp của Datatable
        eventOrderBy: function (fieldOrder) {
            if (fieldOrder != undefined) {
                if (fieldOrder == this.orderBy) {
                    this.orderType = !this.orderType
                } else {
                    this.orderBy = fieldOrder;
                    this.orderType = true;
                }
                this.query();
            }
        },
        //  Hàm thực hiện call server để lấy dữ liệu theo những thông số hiện tại của Datatable
        query: function (isChangeCondition) {
            if (isChangeCondition) {
                this.currentPage = 1;
            }
            var parameter = {
                skip: (this.currentPage - 1) * this.numberPage,
                top: this.numberPage,
                orderBy: this.orderBy,
                orderType: this.orderType,
                search: this.valueSearch
            };
            var $this = this;
            trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Data);
            httpPost(api_City_DataTable, parameter,
                function (rs) {
                    if (rs != false) {
                        this.values = [];
                        $this.values = rs.data;
                        $this.totalItem = rs.totalItem;
                        $this.location = rs.location;
                        trong.isCheckAll = false;
                        trong.offBlockUI(idOfDataTable);
                    }
                });
        }
    };
    // Mặc định khi vào page thì load lần đâu tiên cho Datatable
    $rootScope.dataTable.query();
    trong.download = function (id) {
        trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Download);
        httpDownload(api_City_Download, id, function (rs) {
            if (rs != false) {
                window.location.href = api_City_Download + id;
            }
            trong.offBlockUI(idOfDataTable);
        });
    }
    // Hàm thực hiện kiểm tra các checkbox trên datatable
    //      thực hiện chọn all hoặc bỏ all trên datatable
    trong.checkAll = function () {
        for (var i = 0; i < trong.dataTable.values.length; i++) {
            var item = trong.dataTable.values[i];
            item.isChecked = trong.isCheckAll;
        }
    }
    // Thực hiện  option chuột trái
    //      Thực hiện hiển thị chuột trái trên datatable với các option tùy chọn
    trong.menuOptions = [
        {
            text: function ($itemScope) {
                return '<i class="fa fa-eye"></i> Xem thông tin'
            },
            click: function ($itemScope) {
                trong.dialogView($itemScope.item.Id);
            },
            displayed: function ($itemScope) {
                return trong.global_permission.view;
            },
            enabled: function ($itemScope) {
                return true;
            },
        },
        {
            text: '<i class="fa fa-edit"></i> Cập nhật thông tin',
            click: function ($itemScope) {
                trong.dialogEdit($itemScope.item.Id);
            },
            displayed: function ($itemScope) {
                return trong.global_permission.edit;
            },
            enabled: function ($itemScope) {
                return true;
            },
        },
        {
            text: '<i class="fa fa-trash-o"></i> Xóa thông tin',
            click: function ($itemScope) {
                trong.delete($itemScope.item.Id);
            },
            displayed: function ($itemScope) {
                return trong.global_permission.delete;
            },
            enabled: function ($itemScope) {
                return true;
            },
        }
    ];
    // Thực hiện gọi call các controller nhỏ hơn trong page
    // gọi controller add
    trong.dialogAdd = function () {
        /*begin modal*/
        var modalInstance = uibModal.open({
            templateUrl: folderJs_City + 'add.html',
            controller: 'add',
            backdrop: 'static',
            size: '60',
            resolve: {
            }
        });
    };
    // gọi controller add
    trong.dialogAddByImport = function () {
        /*begin modal*/
        var modalInstance = uibModal.open({
            templateUrl: folderJs_City + 'addImport.html',
            controller: 'addImport',
            backdrop: 'static',
            size: '60',
            resolve: {
            }
        });
    };
    // gọi controller view
    trong.dialogView = function (id) {
        /*begin modal*/
        var modalInstance = uibModal.open({
            templateUrl: folderJs_City + 'view.html',
            controller: 'view',
            backdrop: 'static',
            size: '60',
            resolve: {
                parameter: function () {
                    return id;
                }
            }
        });
    };
    trong.dialogEdit = function (id) {
        /*begin modal*/
        var modalInstance = uibModal.open({
            templateUrl: folderJs_City + 'edit.html',
            controller: 'edit',
            backdrop: 'static',
            size: '60',
            resolve: {
                parameter: function () {
                    return id;
                }
            }
        });
    };

    // Thực hiện xóa các item datatable
    //      Thực hiện xóa cho từng item trên datatable
    trong.delete = function (id) {
        Comfirm(messageComfirm_City_Delete, function (rs) {
            if (rs) {
                trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Delete);
                var parameter = {
                    id: id,
                }
                httpPost(api_City_Delete, parameter,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
                        }
                        $rootScope.reload();
                    });
            }
        });
    }
    //      Thực hiện xóa nhiều item trên datatable
    trong.deleteArray = function () {
        if (isNotTypeOfArray(trong.dataTable.values)) {
            trong.showMessageError(messageComfirm_City_NotExists);
            return;
        }
        var deleteArray = trong.dataTable.values.filter(function (value) { return value.isChecked == true });
        if (deleteArray.length == 0) {
            trong.showMessageError(messageComfirm_City_NotExists);
            return;
        }
        var idArray = [];
        for (var i = 0; i < deleteArray.length; i++) {
            idArray.push(deleteArray[i].Id);
        }
        Comfirm(messageComfirm_City_Deletes, function (rs) {
            if (rs) {
                trong.onBlockUI(idOfDataTable, message_Comfirm_Loading_Delete);
                var parameter = {
                    idArray: idArray,
                }
                httpPost(api_City_Deletes, parameter,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
                        }
                        $rootScope.reload();
                    });
            }
        });

    }
});

// đây là controller view
app.controller('view', function ($scope, $uibModalInstance, parameter) {
    var trong = $scope;
    trong.title = "Xem thông tin (Tỉnh / Thành phố).";
    // function close dialog
    trong.ok = function () {
        $uibModalInstance.close();
    };
    trong.init = function () {
        trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Data);
        var parameters = {
            id: parameter
        }
        httpPost(api_City_GetItem, parameters, function (rs) {
            trong.model = rs;
            trong.offBlockUI(idOfDialog);
        });
    }
    trong.init();
    // chức năng đóng dialog
    trong.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
// đây là controller add
app.controller('add', function ($scope, $rootScope, $uibModalInstance) {
    var trong = $scope;
    // khai báo biến validate trên form edit mode
    trong.title = "Thêm mới thông tin (Tỉnh / Thành phố).";
    trong.model = {
        Status: 1
    };
    trong.submit = function () {
        $rootScope.validateForm(trong.model, function (rs) {
            if (rs) {
                var parameter = {
                    parameter: trong.model.City
                };
                var existsCity = httpPostAsync(api_City_CountItemByCity, parameter);
                if (existsCity > 0) {
                    showMessageError(formatString(messageComfirm_City_ImportExists, trong.model.City));
                    return;
                }
                var arrayFile = trong.model.Attach;
                trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Insert);
                var objectData = {
                    files: arrayFile,
                    item: trong.model
                }
                httpPost(api_City_Insert, objectData,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
                            $rootScope.reload();
                            trong.cancel();
                        }
                        trong.offBlockUI(idOfDialog);
                    });
            }
        }, true);
    }
    // chức năng đóng dialog
    trong.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
// đây là controller addImport
app.controller('addImport', function ($scope, $rootScope, $uibModalInstance) {
    var trong = $scope;
    // khai báo biến validate trên form edit mode
    trong.title = "Thêm mới thông tin (Tỉnh / Thành phố) bằng File.";
    trong.validateForm = function () {
        trong.onBlockUI(idOfDialog, message_Comfirm_Loading_CheckData);
        var flag = true;
        for (var i = 0; i < trong.model.listNew.length; i++) {
            $rootScope.validateForm(trong.model.listNew[i], function (rs) {
                if (!rs) {
                    trong.model.listNew[i].messageError = message_Error_Validate_Form_Import;
                    trong.model.listNew[i].statusError = true;
                    if (flag) {
                        angular.element('[id="' + trong.model.listNew[i].idDOM + '"]').focus();
                    }
                    flag = false;
                } else {
                    var parameter = {
                        parameter: trong.model.listNew[i].City
                    };
                    var existsCity = httpPostAsync(api_City_CountItemByCity, parameter);
                    if (existsCity > 0) {
                        trong.model.listNew[i].messageError = formatString(messageComfirm_City_ImportExists, trong.model.listNew[i].City);
                        trong.model.listNew[i].statusError = true;
                        if (flag) {
                            angular.element('[id="' + trong.model.listNew[i].idDOM + '"]').focus();
                        }
                        flag = false;
                    } else {
                        trong.model.listNew[i].messageError = undefined;
                        trong.model.listNew[i].statusError = undefined;
                    }
                }
            }, true);
        }
        trong.offBlockUI(idOfDialog);
        return flag;
    }
    trong.submit = function () {
        var validate = trong.validateForm();
        if (!validate) {
            return;
        }
        var fd = new FormData();
        fd.append('file', JSON.stringify(trong.model.listNew));
        trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Insert);
        httpPostFormData(api_City_InsertImport, fd, function (rs) {
            if (rs != false) {
                trong.showMessageSuccess(rs.Title);
                $rootScope.reload();
                trong.cancel();
            }
            trong.offBlockUI(idOfDialog);
        });

    }
    // chức năng đóng dialog
    trong.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
// đây là controller edit
app.controller('edit', function ($scope, $rootScope, $uibModalInstance, parameter) {
    var trong = $scope;
    trong.model = {};
    trong.title = "Cập nhật thông tin (Tỉnh / Thành phố).";

    trong.init = function () {
        trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Data);
        var objectData = {
            id: parameter
        }
        httpPost(api_City_GetItem, objectData,
            function (rs) {
                trong.model = rs;
                trong.offBlockUI(idOfDialog);
            });
    }
    trong.init();
    trong.submit = function () {
        $rootScope.validateForm(trong.model, function (rs) {
            if (rs) {
                var arrayFile = trong.model.Attach;
                trong.onBlockUI(idOfDialog, message_Comfirm_Loading_Update);
                var objectData = {
                    files: arrayFile,
                    item: trong.model
                }
                httpPost(api_City_Update, objectData,
                    function (rs) {
                        if (rs != false) {
                            trong.showMessageSuccess(rs.Title);
                            $rootScope.reload();
                            trong.cancel();
                        }
                    });
            }
        }, true);
    }
    // chức năng đóng dialog
    trong.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});