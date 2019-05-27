$(document).ready(function () {
    pageMeSettings = {pagerSelector: 'myPager', showPrevNext: true, hidePageNumbers: false, perPage: 3, pagesShow: 3};
    searchMe ('search', 'tblTestCases', ['Test case name'], pageMeSettings, 0)
    sortMe('tblTestCases', pageMeSettings, 0)
    pageMe('tblTestCaseBody', pageMeSettings);
});