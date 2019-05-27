/*
 * START devlopment section of "Pop-up Information" View
 */
var PopupInfoView = {
    progressBarId: ""
};

/*
 * 
 */
PopupInfoView.displayProgressBar = function (text) {
    for (var button of document.getElementsByTagName('button')) {
        button.setAttribute('disabled','');
    }
    document.getElementById('syc-value-file-input').setAttribute('disabled','');
    document.getElementById('testSuites').setAttribute('disabled','');
    $('#progress-bar-main').removeClass('bg-danger bg-success bg-warning').text(text).parent().slideDown();
    // $('#syc-value-file-input').attr('disabled');
    // $(':button').attr('disabled');
}

/*
 * 
 */
PopupInfoView.hideProgressBar = function () {
    for (var button of document.getElementsByTagName('button')) {
        button.removeAttribute('disabled');
    }
    document.getElementById('syc-value-file-input').removeAttribute('disabled');
    document.getElementById('testSuites').removeAttribute('disabled');
    $('#progress-bar-main').parent().slideUp();
    // $(':button').removeAttr('disabled');
    // $('#syc-value-file-input').removeAttr('disabled');
}

PopupInfoView.errorProgressBar = function () {
    $('#progress-bar-main').removeClass('bg-danger bg-info bg-success bg-warning').text('Error');
    $('#progress-bar-main').addClass('bg-danger');
}

/*
 * END development section of "Pop-up Information" View
 */
dialog = function(text, dialogPromise) {
    if (dialogPromise == undefined || dialogPromise.state() == 'resolved') {
        dialogPromise = $.Deferred();
        modal(text);
    }
    else {
        $.when(dialogPromise).then(()=>{
            dialogPromise = $.Deferred();
            modal(text);
        });
    }
    return dialogPromise;
}

modal = function(text) {
    // var dialogButton = ['Close', 'OK', 'Cancel'];
    // for (var button of document.getElementsByTagName('button')) {
    //     if (dialogButton.indexOf(button.id) == -1) {
    //         button.setAttribute('disabled','');
    //     }
    // }
    // document.getElementById('syc-value-file-input').setAttribute('disabled','');
    // document.getElementById('testSuites').setAttribute('disabled','');
    document.getElementsByClassName('modal-body')[0].textContent = text;
    document.getElementById('OK').removeAttribute('disabled');
    document.getElementById('Cancel').removeAttribute('disabled');
    document.getElementById('Close').removeAttribute('disabled');
    $("#myModal").modal();
}

alert = function(htmlHeader, htmlContent, alertLevel, duration) {
    if (alertLevel === undefined) {
        alertLevel = 'alert-info';
    }
    if (htmlContent == undefined) {
        htmlContent = "";
    }
    var $alert = $('<div class="alert alert-dismissible fade show ' 
                    + alertLevel + '" role="alert"><strong>' 
                    + htmlHeader + '</strong><br>' 
                    + htmlContent 
                    + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                    + '</div>');
        // .addClass('alert alert-dismissible fade show')
        // .addClass(alertLevel)
        // .attr('role', 'alert')
        // .html('<strong>' + htmlHeader + '</strong><br>' + htmlContent)
                // .prepend($('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'))
                    // .attr('type', 'button')
                    // .addClass('close')
                    // .attr('data-dismiss', 'alert')
                    // .attr('aria-label', 'Close')
                    // .prepend($('<span aria-hidden="true">&times;</span>')));

    $('#message').prepend($alert);

    // QUICK FIX: always enable auto dismiss
    // if (autoDismiss) {
    // QUICK FIX: set alert duration based on alertLevel
    // set default duration to 750 ms
    if (duration === undefined) {
        switch (alertLevel) {
            case 'alert-info':
                duration = 1550;
                break;
            case 'alert-success':
                duration = 1800;
                break;
            case 'alert-warning':
                duration = 2800;
                break;
            case 'alert-danger':
                duration = 4800;
                break;
            default:
                duration = 1550;
                break;
        }
    }
    $alert.delay(duration).fadeOut(400, function () {
        $(this).remove();
    });
}

searchMe = function (searchId, tableId, skipped, pageMeSettings, idColumnNumber = 0) {
    var tbody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    var pager = document.getElementById(pageMeSettings.pagerSelector);
    var rawTitles = document.getElementById(tableId).getElementsByTagName('thead')[0].getElementsByTagName('th');
    var titles = [...rawTitles].map(x => x.textContent);
    var records = [...tbody.getElementsByTagName('tr')].map(x => {
        var record = {
            rowClass: x.classList.value
        };
        [...x.getElementsByTagName('td')].map((attri, index) => {
            record[titles[index]] = attri.textContent;
        });
        return record;
    });

    $('#' + searchId).on("input", delay(function (e) {
        clearTitlesContents();
        console.log('Time elapsed!', this.value);
        var value = this.value.trim();
        var filteredRecords = records;
        if (value != '') {
            filteredRecords = getFilteredRecords(value);
        }
        console.log('Time elapsed!', filteredRecords);

        clear(tbody);

        createNewTbody(filteredRecords);

        clear(pager);

        pageMe(tbody.getAttribute('id'), pageMeSettings);
    }, 500));

    function delay(callback, ms) {
        var timer = 0;
        return function() {
          var context = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function () {
            callback.apply(context, args);
          }, ms || 0);
        };
    }

    function clearTitlesContents () {
        var siblings = rawTitles;
        for (var sibling of siblings) {
            var siblingComponents = sibling.textContent.split(' ');
            if (siblingComponents[siblingComponents.length - 1] == '▴' || siblingComponents[siblingComponents.length - 1] == '▾') {
                sibling.textContent = siblingComponents.slice(0,-1).join(' ');
            }
        }
    }

    function getFilteredRecords(value) {
        var filteredRecords = [];
        for (var record of records) {
            for (var attri in record) {
                if (record[attri].indexOf(value) != -1 && skipped.indexOf(attri) == -1 && attri != 'rowClass') {
                    filteredRecords.push(record);
                    break;
                }
            }
        }
        return filteredRecords;
    }

    function clear(object) {
        while (object.hasChildNodes()) {
            object.removeChild(object.firstChild);
         }
    }

    function createNewTbody (records) {
        var idColumnName = titles[idColumnNumber];
        for (var record of records) {
            var recordRow = "<tr id=" + record[idColumnName];
            if (record.rowClass != '') {
                recordRow += " class='" + record.rowClass + "'";
            } 
            recordRow += ">";
            for (var title of titles) {
                recordRow += "<td><label class='" + title.toLowerCase() + "_" + record[idColumnName] + "'>" + record[title] + "</label></td>"
            }
            recordRow += "</tr>";
            $(tbody).append(recordRow);
        }
    }
}

sortMe = function (tableId, pageMeSettings, idColumnNumber = 0) {
    var pager = document.getElementById(pageMeSettings.pagerSelector);
    var table = document.getElementById(tableId);
    var tbody = table.getElementsByTagName('tbody')[0];
    var rawTitles = table.getElementsByTagName('thead')[0].getElementsByTagName('th');
    var titles = [...rawTitles].map(x => x.textContent);
    var myNewSettings = JSON.parse(JSON.stringify(pageMeSettings));

    $(rawTitles).click(function() {
        var records = getRecords();

        var originalContent, strategy;
        [originalContent, strategy] = getOriginalContentAndStrategyAndClearSiblingsContents(this);
        
        sort(originalContent, records, strategy);

        clear(tbody);

        createNewTbody(records);

        getOriginalAndCurrentPages()
 
        clear(pager);

        pageMe(tbody.getAttribute('id'), myNewSettings);
    });
    
    function getRecords () {
        return records = [...tbody.getElementsByTagName('tr')].map(x => {
            var record = {
                rowClass: x.classList.value
            };
            [...x.getElementsByTagName('td')].map((attri, index) => {
                record[titles[index]] = attri.textContent;
            });
            return record;
        });
    }

    function clear (object) {
        while (object.hasChildNodes()) {
            object.removeChild(object.firstChild);
        }
    }

    function getOriginalContentAndStrategyAndClearSiblingsContents (titleColumn) {
        var titleComponents = titleColumn.textContent.split(' ');
        var originalContent = titleColumn.textContent;
        var strategy = 'ASC';
        var siblings = [...titleColumn.parentElement.children].filter(c=>c.nodeType == 1 && c!=titleColumn)
        for (var sibling of siblings) {
            var siblingComponents = sibling.textContent.split(' ');
            if (siblingComponents[siblingComponents.length - 1] == '▴' || siblingComponents[siblingComponents.length - 1] == '▾') {
                sibling.textContent = siblingComponents.slice(0,-1).join(' ');
            }
        }

        if (titleComponents[titleComponents.length - 1] != '▴') {
            if (titleComponents[titleComponents.length - 1] != '▾') {
                titleColumn.textContent += ' ▴';
            }
            else {
                originalContent = titleComponents.slice(0,-1).join(' ');
                titleColumn.textContent = titleComponents.slice(0,-1).join(' ') + ' ▴';
            }
        }
        else {
            strategy = 'DESC';
            originalContent = titleComponents.slice(0,-1).join(' ');
            titleColumn.textContent = titleComponents.slice(0,-1).join(' ') + ' ▾';
        }
        return [originalContent, strategy];
    }

    function getOriginalAndCurrentPages () {
        var pages = pager.getElementsByTagName('li');
        var firstVisiblePage = true;
        for (var page = 2; page < pages.length - 2; page++) {
            if (firstVisiblePage && $(pages[page]).is(':visible')) {
                myNewSettings.originalPage = page - 1;
                firstVisiblePage = false;
            }
            if (pages[page].classList.contains('active')) {
                myNewSettings.currentPage = page - 1;
                break;
            }
        }
    }

    function createNewTbody (records) {
        var idColumnName = titles[idColumnNumber];
        for (var record of records) {
            var recordRow = "<tr id=" + record[idColumnName];
            if (record.rowClass != '') {
                recordRow += " class='" + record.rowClass + "'";
            } 
            recordRow += ">";
            for (var title of titles) {
                recordRow += "<td><label class='" + title.toLowerCase() + "_" + record[idColumnName] + "'>" + record[title] + "</label></td>"
            }
            recordRow += "</tr>";
            $(tbody).append(recordRow);
        }
    }

    function sort (columnName, records, strategy = 'ASC') {
        records.sort(compareWithColumnName(columnName, strategy));
    }

    function compareWithColumnName (columnName, strategy = 'ASC') {
        return function (a, b) {
            var a = a[columnName].toLowerCase(); // ignore upper and lowercase
            var b = b[columnName].toLowerCase(); // ignore upper and lowercase
            if (isNaN(parseFloat(a)) || isNaN(parseFloat(b))) {
                if (a < b) {
                    if (strategy == 'ASC') {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                }
                if (a > b) {
                    if (strategy == 'ASC') {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
                // names must be equal
                return 0;
            }
            else {
                if (strategy == 'ASC') {
                    return a - b;
                }
                else {
                    return b - a;
                }
            }
        }
    }
}

pageMe = function (tableId, opts) {
    var settings = {
            currentPage: 1,
            originalPage: 1,
            perPage: 7,
            showPrevNext: false,
            hidePageNumbers: false,
    };
    for (var property in opts) {
        settings[property] = opts[property];
    }
    var children = document.getElementById(tableId).children;
    var perPage = settings.perPage;
    var pager = $('pagination');
    var pagesShow = 5;
    var currentPage = settings.currentPage;
    var originalPage = settings.originalPage;
    
    if (settings.pagerSelector) {
        pager = $(document.getElementById(settings.pagerSelector));
    }

    if (settings.pagesShow) {
        pagesShow = settings.pagesShow;
    }

    var numItems = children.length;
    var numPages = Math.ceil(numItems / perPage);

    if (settings.showPrevNext) {
        $('<li class="page-item"> <a class="page-link first-link" href="#" aria-label="First"> <span aria-hidden="true">〈〈</span> <span class="sr-only">First</span> </a> </li>').appendTo(pager);
        $('<li class="page-item"> <a class="page-link prev-link" href="#" aria-label="Previous"> <span aria-hidden="true">〈</span> <span class="sr-only">Previous</span> </a> </li>').appendTo(pager);
    }

    var count = 0;
    while (numPages > count && (settings.hidePageNumbers == false)) {
        var liClass = '"page-item page-' + (count + 1) +'"';
        $('<li class='+ liClass +'> <a class="page-link page" href="#">' + (count + 1) + '</a></li>').appendTo(pager);
        count++;
    }

    //hide forward pages
    if (numPages > originalPage + pagesShow - 1) {
        var start = originalPage + pagesShow;
        var end = numPages;

        for (var i=start; i<=end; i++) {
            pager.find('.page-'+i).hide();
        }
    }

    //hide backward pages
    if (originalPage > 1) {
        var start = originalPage - 1;

        for (var i=start; i > 0; i--) {
            pager.find('.page-'+i).hide();
        }
    }

    pager.children().eq(currentPage + 1).addClass("active");
    
    hide(children);
    show([...children].slice((currentPage - 1) * perPage, currentPage * perPage));

    if (settings.showPrevNext) {
        $('<li class="page-item"> <a class="page-link next-link" href="#" aria-label="Next"> <span aria-hidden="true">〉</span><span class="sr-only">Next</span> </a> </li>').appendTo(pager);
        $('<li class="page-item"> <a class="page-link last-link" href="#" aria-label="Last"> <span aria-hidden="true">〉〉</span> <span class="sr-only">Last</span> </a> </li>').appendTo(pager);
    }

    if (currentPage == 1) {
        // pager.find('.page:first').addClass('active');
        disable('.prev-link');
        disable('.first-link');
        // pager.find('.prev-link').hide();
    }
    if (numPages == currentPage) {
        disable('.next-link');
        disable('.last-link');
        // pager.find('.next-link').hide();
    }

    pager.find('.page').click(function () {
        if (this.parentElement.classList.contains('active')) {
            return false;
        }
        goTo(parseInt(this.textContent) - 1);
        if (settings.additionalFunc) {
            settings.additionalFunc();
        }
        return false;
    });
    pager.find('.first-link').click(function () {
        goTo(0, false);
        if (settings.additionalFunc) {
            settings.additionalFunc();
        }
        return false;
    });
    pager.find('.last-link').click(function () {
        goTo(numPages - 1, false);
        if (settings.additionalFunc) {
            settings.additionalFunc();
        }
        return false;
    });
    pager.find('.prev-link').click(function () {
        goTo(parseInt(currentPage) - 2);
        if (settings.additionalFunc) {
            settings.additionalFunc();
        }
        return false;
    });
    pager.find('.next-link').click(function () {
        goTo(parseInt(currentPage));
        if (settings.additionalFunc) {
            settings.additionalFunc();
        }
        return false;
    });

    function disable(link) {
        var pageLink= pager.find(link).parent();
        pageLink.addClass('disabled').attr('tabindex',"-1");
    }

    function enable(link) {
        var pageLink= pager.find(link).parent();
        pageLink.removeClass('disabled').removeAttr('tabindex');
    }

    function hide(collection) {
        for (var item of collection) {
            // item.style.display = "none";
            if (!item.hasAttribute('hidden')) {
                item.setAttribute('hidden', '');
            }
        }
    }

    function show(collection) {
        for (var item of collection) {
            // item.style.display = "";
            item.removeAttribute('hidden');
        }
    }

    function goTo(page, consecutive=true) {
        var startAt = page * perPage,
            endOn = startAt + perPage;

        // show elements on table
        // children.hide().slice(startAt, endOn).show();
        hide(children);
        show([...children].slice(startAt, endOn));

        if (page >= 1) {
            // pager.find('.prev-link').removeClass("disabled").addClass('active').removeAttr('tabindex');
            // pager.find('.prev-link').show();
            enable('.prev-link');
            enable('.first-link');
        }
        else {
            // pager.find('.prev-link').removeClass("active").addClass('disabled').attr('tabindex',"-1");
            // pager.find('.prev-link').hide();
            disable('.prev-link');
            disable('.first-link');
        }

        if (page < (numPages - 1)) {
            // pager.find('.next-link').removeClass("disabled").addClass('active').removeAttr('tabindex');
            // pager.find('.next-link').show();
            enable('.next-link');
            enable('.last-link');
        }
        else {
            // pager.find('.next-link').removeClass("active").addClass('disabled').attr('tabindex',"-1");
            // pager.find('.next-link').hide();
            disable('.next-link');
            disable('.last-link');
        }

        if (consecutive) {
            // check if out of series
            if (pager.children().eq(page + 3) != undefined && !pager.children().eq(page + 3).is(':visible')) {
                pager.children().eq(page + 3).show();
                pager.children().eq(page + 3 - pagesShow).hide();
            }
            // check if come back to page one from out of series
            else if (page + 1 >= 0 && !pager.children().eq(page + 1).is(':visible')) {
                pager.children().eq(page + 1).show();
                pager.children().eq(page + 1 + pagesShow).hide();
            }
        }
        else {
            if (page == 0) {
                for (var i = 0; i < numPages; i++) {
                    if (i < pagesShow) {
                        if (!pager.children().eq(i + 2).is(':visible')) {
                            pager.children().eq(i + 2).show();
                        }
                    }
                    else {
                        if (pager.children().eq(i + 2).is(':visible')) {
                            pager.children().eq(i + 2).hide();
                        }
                    }
                }
            }
            else {
                for (var i = numPages - 1; i >= 0; i--) {
                    if (i > numPages - pagesShow - 1) {
                        if (!pager.children().eq(i + 2).is(':visible')) {
                            pager.children().eq(i + 2).show();
                        }
                    }
                    else {
                        if (pager.children().eq(i + 2).is(':visible')) {
                            pager.children().eq(i + 2).hide();
                        }
                    }
                }
            }
        }

        currentPage = page + 1;
        pager.children().removeClass("active");
        pager.children().eq(page + 2).addClass("active");
    }
}

returnNodeBasedOnAttributeValue = function (nodes, attribute, value) {
    for (var node of nodes) {
        if (node.getAttribute(attribute) == value) {
            return node;
        }
    }
    return undefined;
}

getIndicesOf = function (searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

isEmpty = function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

addHtmlEncodeDecode = function () {
    if (!String.prototype.htmlEncode) {
        /**
         * {JSDoc}
         *
         * Convert a string to its html characters completely.
         *
         * @this {String}  String with unescaped HTML characters
         * @return {String} HTML encoded string.
         */
        String.prototype.htmlEncode = function() {
            var buf = [];
        
            for (var i = this.length - 1; i >= 0; i--) {
                buf.unshift(['&#', this[i].charCodeAt(), ';'].join(''));
            }
            
            return buf.join('');
        }
    }

    if (!String.prototype.htmlDecode) {
        /**
         * {JSDoc}
         *
         * Convert an html characterSet into its original character.
         *
         * @this {String} htmlSet entities
         * @return {String} Decoded string.
         */
        String.prototype.htmlDecode = function() {
            return this.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
            });
        }
    }
}

addStringSplice = function() {
    if (!String.prototype.splice) {
        /**
         * {JSDoc}
         *
         * Change the content of a string by removing a range of
         * characters and/or adding new characters.
         *
         * @this {String}
         * @param {number} start Index at which to start changing the string.
         * @param {number} delCount An integer indicating the number of old chars to remove.
         * @param {string} newSubStr The String that is spliced in.
         * @return {string} A new string with the spliced substring.
         */
        String.prototype.splice = function(start, delCount, newSubStr) {
            if (delCount < 0) {
                delCount = 0;
            }
            else if (delCount > this.length - start) {
                delCount = this.length - start;
            }
            return this.slice(0, start) + newSubStr + this.slice(start + delCount);
        }
    }
}