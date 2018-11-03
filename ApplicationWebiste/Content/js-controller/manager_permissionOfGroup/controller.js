﻿var controller = "ManagerPermissionOfGroup";
var folderJs = "/Content/js-controller/manager_permissionOfGroup/";
app.controller('managerPermissionOfGroup', function ($scope, $rootScope, $http, $timeout, $interval, $uibModal) {
    //App.blockUI({ target: '#abcd', boxed: !0, message: 'đang tải...' });
    var trong = $scope;
    var timeout = $timeout;
    var interval = $interval;
    var http = $http;
    var data = [];
    console.log($scope.global_permission);
    // submit
    trong.submit = function () {
        if (isNull(trong.Tree_listTreeSelected)) {
            trong.Tree_listTreeSelected = [];
        }
        if (trong.Tree_listTreeSelected.length == 0) {
            trong.Tree_listTreeSelected.push({
                Group: trong.Tree_groupValue
            });
        }
        http.post("/" + controller + "/updatePermisstion/", trong.Tree_listTreeSelected).then(function (rs) {
            if (isNull(rs.data)) {
                trong.showMessageError('Tài khoản không có quyền thực hiện chức năng này');
            } else {
                trong.showMessageSuccess('Cập nhật chức năng thành công');

            }
            // refresh tree function of group
            trong.F_getFunctionToGroup(trong.Tree_groupValue, function () {
                // $(trong.Tree_idTreeViewOfGroup).jstree('open_all');
            });
        });
    }
    trong.dialogViewAccountOfGroup = function () {
        /*begin modal*/
        var data = {
            value: trong.Tree_groupValue,
            title: trong.Tree_groupName
        }
        var modalInstance = $uibModal.open({
            templateUrl: folderJs + 'dialog-view-account.html',
            controller: 'ViewMenuBar',
            backdrop: 'static',
            size: 'xlg',
            resolve: {
                parameter: function () {
                    return data;
                }
            }
        });
    };
    // id of tree view
    trong.Tree_idTreeViewOfGroup = '#tree-container-group';
    trong.Tree_idTreeViewOfFunction = '#tree-container-function';
    http.post("/" + controller + "/G_getAllGroupPermission/").then(function (rs) {
        if (isNull(rs.data)) {
            console.log('something wrong when get data for tree from server "/ManagerPermission/G_getAllGroupPermission/". ');
            return;
        }
        if (isNull(rs.data) && isTypeOfString(rs.data)) {
            console.log('Account không có quyền truy cập.');
            return;
        }
        for (var loop = 0; loop < rs.data.length; loop++) {
            rs.data[loop].children = [];
        }
        $(trong.Tree_idTreeViewOfGroup).jstree(true).settings.core.data = rs.data;
        $(trong.Tree_idTreeViewOfGroup).jstree(true).refresh();
    });

    trong.F_getFunctionToGroup = function (group, callback) {
        var parameter = {
            Group: group
        }
        http.post("/" + controller + "/G_getAllFunctionPermission/", parameter).then(function (rs) {
            if (isNull(rs.data)) {
                console.log('something wrong when get data for tree from server "/ManagerPermission/G_getAllFunctionPermission/". ');
                return;
            }
            if (isNull(rs.data) && isTypeOfString(rs.data)) {
                console.log('Account không có quyền truy cập.');
                return;
            }
            $(trong.Tree_idTreeViewOfFunction).jstree(true).settings.core.data = rs.data;
            $(trong.Tree_idTreeViewOfFunction).jstree(true).refresh(true, true);
            // query when return data
            return callback(true);
        });
    }
    //fill data to tree  with AJAX call
    $(trong.Tree_idTreeViewOfGroup).jstree({
        'core': {
            "dataType": "json", // needed only if you do not supply JSON headers
            "data": data,
        },
        "types": {
            "default": {
                "icon": "fa fa-users"
            },
        },
        'plugins': ["types"],

    });
    trong.Tree_clickLast_Group = undefined;
    $(trong.Tree_idTreeViewOfGroup)
        // listen for event
        .on('changed.jstree', function (e, data) {
            var i, j, r = [];
            for (i = 0, j = data.selected.length; i < j; i++) {
                r.push(data.instance.get_node(data.selected[i]));
            }
            trong.$apply(function () {
                trong.Tree_clickLast_Group = r[r.length - 1] != undefined ? r[r.length - 1].original.name : undefined;
                if (trong.Tree_groupValue != undefined) {
                    if (r.length > 0) {
                        if (trong.Tree_groupValue != r[0].original.groupId) {
                            trong.Tree_groupValue = r.length > 0 ? r[0].original.groupId : undefined;
                            trong.Tree_groupName = r.length > 0 ? r[0].original.text : undefined;
                            // call ajax
                            if (trong.Tree_groupValue != undefined) {
                                trong.F_getFunctionToGroup(trong.Tree_groupValue, function (rs) {
                                });
                            }
                        }
                    } else {

                    }
                }
                else {
                    trong.Tree_groupValue = r.length > 0 ? r[0].original.groupId : undefined;
                    trong.Tree_groupName = r.length > 0 ? r[0].original.text : undefined;
                    // call ajax
                    if (trong.Tree_groupValue != undefined) {
                        trong.F_getFunctionToGroup(trong.Tree_groupValue, function (rs) {
                        });
                    }
                }
            });
        }).bind("loaded.jstree", function (event, data) {
            $(this).jstree("open_all");
        })
        // create the instance
        .jstree();
    //fill data to tree  with AJAX call
    $(trong.Tree_idTreeViewOfFunction).jstree({
        'core': {
            "data": data
        },
        "types": {
            "default": {
                "icon": "fa fa-gears"
            },
        },
        'plugins': ["types", "checkbox"]
    });
    trong.Tree_clickLast_Function = undefined;
    $(trong.Tree_idTreeViewOfFunction)
        // listen for event
        .on('changed.jstree', function (e, data) {
            var i, j, r = [];
            for (i = 0, j = data.selected.length; i < j; i++) {
                r.push(data.instance.get_node(data.selected[i]));
            }
            trong.$apply(function () {
                trong.Tree_listTreeSelected = [];
                for (var i = 0; i < r.length; i++) {
                    if (r[i].original.isRootTree != true) {
                        trong.Tree_listTreeSelected.push({
                            Group: trong.Tree_groupValue,
                            Function: r[i].original.parent_id,
                            ChildOfFunction: r[i].original.name,
                        });
                    }
                }
                trong.Tree_clickLast_Function = r[r.length - 1] != undefined ? r[r.length - 1].original.name : undefined;
            });
        })
        // create the instance
        .jstree();
});
app.controller('ViewMenuBar', function ($scope, $http, $location, $uibModalInstance, $rootScope, parameter, toaster) {
    $scope.title = "Xem thông tin tài khoản thuộc [" + parameter.title + "].";
    // function close dialog
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    // function close dialog
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});