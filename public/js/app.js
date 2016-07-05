/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var ShopApp = angular.module("ShopApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize"
]);
var c = '';
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
ShopApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // global configs go here
        });
    }]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.
 
 To migrate, register your controllers with modules rather than exposing them
 as globals:
 
 Before:
 
 ```javascript
 function MyController() {
 // ...
 }
 ```
 
 After:
 
 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
 // ...
 }]);
 
 Although it's not recommended, you can re-enable the old behavior like this:
 
 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
 // this option might be handy for migrating old apps, but please don't use it
 // in new ones!
 $controllerProvider.allowGlobals();
 }]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
ShopApp.config(['$controllerProvider', function ($controllerProvider) {
        // this option might be handy for migrating old apps, but please don't use it
        // in new ones!
        $controllerProvider.allowGlobals();
    }]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/

/* Setup global settings */
ShopApp.factory('settings', ['$rootScope', function ($rootScope) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
            layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
        };

        $rootScope.settings = settings;

        return settings;
    }]);

/* Setup App Main Controller */
ShopApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.$on('$viewContentLoaded', function () {
            Metronic.initComponents(); // init core components
            //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
        });
    }]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
ShopApp.controller('HeaderController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initHeader(); // init header
        });
    }]);

/* Setup Layout Part - Sidebar */
ShopApp.controller('SidebarController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initSidebar(); // init sidebar
        });
    }]);

/* Setup Layout Part - Quick Sidebar */
ShopApp.controller('QuickSidebarController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            setTimeout(function () {
                QuickSidebar.init(); // init quick sidebar        
            }, 2000)
        });
    }]);

/* Setup Layout Part - Theme Panel */
ShopApp.controller('ThemePanelController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });
    }]);

/* Setup Layout Part - Footer */
ShopApp.controller('FooterController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter(); // init footer
        });
    }]);

/* Setup Rounting For All Pages */
ShopApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // Redirect any unmatched url
        $urlRouterProvider.otherwise("/dashboard.html");

        $stateProvider

                // Dashboard
                .state('dashboard', {
                    url: "/dashboard.html",
                    templateUrl: "views/dashboard.html",
                    data: {pageTitle: 'Admin Dashboard Template'},
                    controller: "DashboardController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/admin/pages/css/tasks.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/admin/pages/scripts/index3.js',
                                        'assets/admin/pages/scripts/tasks.js',
                                        'js/controllers/DashboardController.js'
                                    ]
                                });
                            }]
                    }
                })
                //////////////////////////////////////////// Product ///////////////////////////////////////////
                // Product Table Datatables
                .state('products', {
                    url: "/products",
                    templateUrl: "views/products/ProductList.html",
                    data: {pageTitle: 'Product List'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/select2/select2.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                                        'assets/global/plugins/select2/select2.min.js',
                                        'assets/global/plugins/datatables/all.min.js',
                                        'js/scripts/product-table.js',
                                        //load controller
                                        'js/controllers/ProductsController.js'
                                    ]
                                });
                            }]
                    }
                })
                //Add product
                .state('ProductAdd', {
                    url: "/product/add",
                    templateUrl: "views/products/addProduct.html",
                    data: {pageTitle: 'Add Product'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/admin/pages/scripts/components-form-tools.js',
                                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                                            //////////////////////////////////DropDown////////////////////
                                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/select2.css',
                                            'assets/global/plugins/jquery-multi-select/css/multi-select.css',
                                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/select2.min.js',
                                            'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                                            'assets/admin/pages/scripts/components-dropdowns.js',
                                            
                                            'js/controllers/ProductsController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //view product
                .state('ProductView', {
                    url: "/product/view/:id",
                    templateUrl: "views/products/viewProduct.html",
                    data: {pageTitle: 'View Product'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'js/controllers/ProductsController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //edit product
                .state('ProductEdit', {
                    url: "/product/edit/:id",
                    templateUrl: "views/products/editProduct.html",
                    data: {pageTitle: 'Edit Product'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/admin/pages/scripts/components-form-tools.js',
                                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                                            'js/controllers/ProductsController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // AngularJS plugins
                .state('fileupload', {
                    url: "/file_upload.html",
                    templateUrl: "views/file_upload.html",
                    data: {pageTitle: 'AngularJS File Upload'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'angularFileUpload',
                                        files: [
                                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                                        ]
                                    }, {
                                        name: 'ShopApp',
                                        files: [
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // UI Select
                .state('uiselect', {
                    url: "/ui_select.html",
                    templateUrl: "views/ui_select.html",
                    data: {pageTitle: 'AngularJS Ui Select'},
                    controller: "UISelectController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ui.select',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                                        ]
                                    }, {
                                        name: 'ShopApp',
                                        files: [
                                            'js/controllers/UISelectController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // UI Bootstrap
                .state('uibootstrap', {
                    url: "/ui_bootstrap.html",
                    templateUrl: "views/ui_bootstrap.html",
                    data: {pageTitle: 'AngularJS UI Bootstrap'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        files: [
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Tree View
                .state('tree', {
                    url: "/tree",
                    templateUrl: "views/tree.html",
                    data: {pageTitle: 'jQuery Tree View'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/jstree/dist/themes/default/style.min.css',
                                            'assets/global/plugins/jstree/dist/jstree.min.js',
                                            'assets/admin/pages/scripts/ui-tree.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Form Tools
                .state('formtools', {
                    url: "/form-tools",
                    templateUrl: "views/form_tools.html",
                    data: {pageTitle: 'Form Tools'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/admin/pages/scripts/components-form-tools.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Date & Time Pickers
                .state('pickers', {
                    url: "/pickers",
                    templateUrl: "views/pickers.html",
                    data: {pageTitle: 'Date & Time Pickers'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                                            'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/admin/pages/scripts/components-pickers.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Custom Dropdowns
                .state('dropdowns', {
                    url: "/dropdowns",
                    templateUrl: "views/dropdowns.html",
                    data: {pageTitle: 'Custom Dropdowns'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ShopApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/select2.css',
                                            'assets/global/plugins/jquery-multi-select/css/multi-select.css',
                                            'assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/select2.min.js',
                                            'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                                            'assets/admin/pages/scripts/components-dropdowns.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Advanced Datatables
                .state('datatablesAdvanced', {
                    url: "/datatables/advanced.html",
                    templateUrl: "views/datatables/advanced.html",
                    data: {pageTitle: 'Advanced Datatables'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/select2/select2.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                                        'assets/global/plugins/select2/select2.min.js',
                                        'assets/global/plugins/datatables/all.min.js',
                                        'js/scripts/table-advanced.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })

                // Ajax Datetables
                .state('datatablesAjax', {
                    url: "/datatables/ajax.html",
                    templateUrl: "views/datatables/ajax.html",
                    data: {pageTitle: 'Ajax Datatables'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/select2/select2.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/select2/select2.min.js',
                                        'assets/global/plugins/datatables/all.min.js',
                                        'assets/global/scripts/datatable.js',
                                        'js/scripts/table-ajax.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })

                // User Profile
                .state("profile", {
                    url: "/profile",
                    templateUrl: "views/profile/main.html",
                    data: {pageTitle: 'User Profile'},
                    controller: "UserProfileController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/admin/pages/css/profile.css',
                                        'assets/admin/pages/css/tasks.css',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/admin/pages/scripts/profile.js',
                                        'js/controllers/UserProfileController.js'
                                    ]
                                });
                            }]
                    }
                })

                // User Profile Dashboard
                .state("profile.dashboard", {
                    url: "/dashboard",
                    templateUrl: "views/profile/dashboard.html",
                    data: {pageTitle: 'User Profile'}
                })

                // User Profile Account
                .state("profile.account", {
                    url: "/account",
                    templateUrl: "views/profile/account.html",
                    data: {pageTitle: 'User Account'}
                })

                // User Profile Help
                .state("profile.help", {
                    url: "/help",
                    templateUrl: "views/profile/help.html",
                    data: {pageTitle: 'User Help'}
                })

                // Todo
                .state('todo', {
                    url: "/todo",
                    templateUrl: "views/todo.html",
                    data: {pageTitle: 'Todo'},
                    controller: "TodoController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                                        'assets/global/plugins/select2/select2.css',
                                        'assets/admin/pages/css/todo.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/select2/select2.min.js',
                                        'assets/admin/pages/scripts/todo.js',
                                        'js/controllers/TodoController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state("categories", {
                    url: "/categories",
                    templateUrl: "views/category/listCategories.html",
                    controller: "CategoryController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                                        'assets/global/plugins/select2/select2.min.js',
                                        'assets/global/plugins/datatables/all.min.js',
                                        'js/scripts/category-table.js',
                                        'js/controllers/CategoryController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state("categoryAdd", {
                    url: "/add",
                    templateUrl: "views/category/add.html",
                    data: {pageTitle: 'Add Category'},
                    controller: "CategoryController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'js/controllers/CategoryController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state("CategoryView", {
                    url: "/category/view/:id",
                    templateUrl: "views/category/edit.html",
                    data: {pageTitle: 'Edit Category'},
                    controller: "CategoryController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'js/controllers/CategoryController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state("brands", {
                    url: "/brands",
                    templateUrl: "views/brand/listbrand.html",
                    controller: "BrandController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/select2/select2.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                                        'assets/global/plugins/select2/select2.min.js',
                                        'assets/global/plugins/datatables/all.min.js',
                                        'js/scripts/brand-table.js',
                                        'js/controllers/BrandController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state("brandAdd", {
                    url: "/brandadd",
                    templateUrl: "views/brand/addbrand.html",
                    data: {pageTitle: 'Add Brand'},
                    controller: "BrandController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'js/controllers/BrandController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state("BrandView", {
                    url: "/brand/view/:id",
                    templateUrl: "views/brand/editbrand.html",
                    data: {pageTitle: 'Edit Brand'},
                    controller: "BrandController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'ShopApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'js/controllers/BrandController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state('brandfileupload', {
                    url: "/file_upload.html",
                    templateUrl: "views/brand/addbrands.html",
                    data: {pageTitle: 'AngularJS File Upload'},
                    controller: "GeneralPageController",
                    resolve: {
                      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                          name: 'angularFileUpload',
                          files: [
                              'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                          ]
                        }, {
                          name: 'ShopApp',
                          files: [
                              'js/controllers/brandController.js'
                          ]
                        }]);
                      }]
                    }
                })


    }]);

/* Init global settings and run the app */
ShopApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
        $rootScope.$state = $state; // state to be accessed from view
    }]);

/*
 * Confirm box : Promt box
 */
ShopApp.directive('ngConfirmClick', [
    function () {
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}])

angular.module('showcase.angularWay.withOptions', ['datatables', 'ngResource'])
.controller('AngularWayWithOptionsCtrl', AngularWayWithOptionsCtrl);

function AngularWayWithOptionsCtrl($resource, DTOptionsBuilder, DTColumnDefBuilder) {
    var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength(2);
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1).notVisible(),
        DTColumnDefBuilder.newColumnDef(2).notSortable()
    ];
    $resource('data.json').query().$promise.then(function(persons) {
        vm.persons = persons;
    });
}
