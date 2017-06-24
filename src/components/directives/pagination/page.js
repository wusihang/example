/**
 * Created by wWX318801 on 2017/6/23.
 */
var POSITIVE_INTEGER_NUM_EXP = /^(0+)?[1-9]([0-9]+)?$/;
angular.module('paging.directive', []).directive('ngPagination', function () {
    return {
        restrict: 'E',
        template: `
                    <div>
                        <div class="pagingBar ng-hide" ng-show="showPaging">
                            <div>
                                <div class="floatRight pagingBtn">
                                    <a class="paging" ng-click="firstClicked()"><span class="pageArrIco">&lt;&lt;</span></a>
                                    <a class="paging" ng-click="preClicked()">&lt;</a>
                                    <a ng-repeat="page in pages" class="{{page.clazz}} paging" ng-click="pagingClicked()">{{page.index}}</a>
                                    <a class="paging" ng-click="nextClicked()">&gt;</a>
                                    <a class="paging" ng-click="lastClicked()"><span
                                            class="pageArrIco">&gt;&gt;</span></a>
                                    <span class="paging marginLeft10">跳转到</span>
                                    <input type="text" style="padding: 5px 6px 8px 6px;width:40px;" ng-model="goPage">
                                    <a class="paging" ng-click="goClicked()">GO</a>
                                </div>
                    
                                共有 <span class="highLight">{{totalCount}}</span> 条, 每页
                                <select class="pagingSelect" ng-change="pageSizeChanged(pageSize)" ng-model="pageSize" ng-options="option for option in pageSizeOption"/>
                                条
                            </div>
                    
                        </div>
                        <div ng-show="!hasRecord" class="ng-hide">
                            <span class="noRecord">暂无数据</span>
                        </div>
                    </div>
`,

        replace: true,
        scope: {
            callback: '&',
            totalCount: '@',
            pageSize: "=",
            currentPage: "="
        },
        link: function ($scope, element, attr) {
            // 页尺寸选项必须是数字数组
            $scope.pageSizeOption = (attr.pageSizeOption || "10,20,50,100").split(",").map(function (item) {
                return Number(item);
            });
            $scope.pagingBtnNum = Number(attr.pagingBtnNum || 7);
            $scope.currentPage = $scope.currentPage || 1;
            $scope.pageSize = $scope.pageSize || 10;
            $scope.hasRecord = true;
            $scope.showPaging = false;
            // 1 ...5 6 7 ... 101 clicked
            $scope.pagingClicked = function () {
                //点击非 ... 有效
                if (this.page.index != "...") {
                    $scope.currentPage = this.page.index;
                    this.$parent.pages.forEach(function (page) {
                        page.clazz = "";
                        if (page.index == $scope.currentPage) {
                            page.clazz = "cur";
                        }
                    });
                    $scope.callback({"data": {"currentPage": $scope.currentPage, "pageSize": $scope.pageSize}});
                }
            };

            // 上一页
            $scope.preClicked = function () {
                if ($scope.currentPage > 1) {
                    $scope.currentPage = Number($scope.currentPage) - 1;
                    renderPagingAndCallBack();
                }
            };
            // 下一页
            $scope.nextClicked = function () {
                if ($scope.currentPage < $scope.totalPage) {
                    $scope.currentPage = Number($scope.currentPage) + 1;
                    renderPagingAndCallBack();
                }
            };

            //点击 GO 按钮是触发
            $scope.goClicked = function () {
                //goPage 必须是大于0的正整数
                if (!POSITIVE_INTEGER_NUM_EXP.test($scope.goPage)) {
                    $scope.goPage = "";
                }
                //如果要跳转的页面不等于当前页、输入符合规范、不大于最大页数
                if ($scope.goPage && $scope.goPage != $scope.currentPage && $scope.goPage <= $scope.totalPage) {
                    $scope.currentPage = $scope.goPage;
                    renderPagingAndCallBack();
                }
            };

            //跳到首页
            $scope.firstClicked = function () {
                if ($scope.currentPage > 1) {
                    $scope.currentPage = 1;
                    renderPagingAndCallBack();
                }
            };
            //跳到尾页
            $scope.lastClicked = function () {
                if ($scope.currentPage < $scope.totalPage) {
                    $scope.currentPage = $scope.totalPage;
                    renderPagingAndCallBack();
                }
            };

            //页尺寸变化时，设置当前页为1并且将页尺寸设为改变后的值
            $scope.pageSizeChanged = function (changedValue) {
                $scope.currentPage = 1;
                $scope.pageSize = changedValue;
                renderPagingAndCallBack()
            };

            function renderPagingAndCallBack() {
                $scope.pages.forEach(function (page) {
                    page.clazz = "";
                });
                $scope.callback({"data": {"currentPage": $scope.currentPage, "pageSize": $scope.pageSize}});
            }

            function renderPageNumbers() {
                $scope.pages = [];
                var curPage = Number($scope.currentPage);
                var halfPages = Math.floor($scope.pagingBtnNum / 2);
                if ($scope.totalPage <= $scope.pagingBtnNum) {
                    initPages(1, $scope.totalPage, curPage);
                }
                else {
                    if (curPage <= halfPages) {
                        initPages(1, halfPages + 2, curPage);
                        $scope.pages.push({"index": "...", "clazz": ""});
                        $scope.pages.push({"index": $scope.totalPage, "clazz": ""});
                    }
                    else if (curPage > $scope.totalPage - halfPages) {
                        $scope.pages.push({"index": 1, "clazz": ""});
                        $scope.pages.push({"index": "...", "clazz": ""});
                        initPages($scope.totalPage - (halfPages + 1), $scope.totalPage, curPage);
                    }
                    else {
                        $scope.pages.push({"index": 1, "clazz": ""});
                        $scope.pages.push({"index": "...", "clazz": ""});
                        initPages(curPage - (halfPages - 2), curPage + (halfPages - 2), curPage);
                        $scope.pages.push({"index": "...", "clazz": ""});
                        $scope.pages.push({"index": $scope.totalPage, "clazz": ""});
                    }
                }
            }

            function initPages(start, end, currentPage) {
                for (var i = start; i <= end; i++) {
                    if (currentPage == i) {
                        $scope.pages.push({"index": i, "clazz": "cur"});
                    }
                    else {
                        $scope.pages.push({"index": i, "clazz": ""});
                    }
                }
            }

            //总数发生变更时刷新分页控件
            $scope.$watch("totalCount", function (newValue) {
                if (newValue > 0) {
                    $scope.showPaging = true;
                    $scope.hasRecord = true;
                    $scope.totalPage = Math.ceil($scope.totalCount / $scope.pageSize);
                    //当总数变更时，若总页数小于当前页，将当前页设为最后一页
                    if ($scope.totalPage < $scope.currentPage) {
                        $scope.currentPage = $scope.totalPage;
                    }
                    renderPageNumbers();
                } else if (newValue) {
                    $scope.hasRecord = false;
                    $scope.showPaging = false;
                }
            });
            //当前页或页尺寸变更时刷新分页控件
            $scope.$watchGroup(["currentPage", "pageSize"], function () {
                $scope.totalPage = Math.ceil($scope.totalCount / $scope.pageSize);
                renderPageNumbers();
            });
        }
    };
});