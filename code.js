var isNewItem = 0;
var addItemtolistTitle;
var listDetails = /** @class */ (function () {
    function listDetails(listName, listItem) {
        this.listItems = [];
        this.listName = listName;
        for (var iCounter = 0; iCounter < listItem.length; iCounter++) {
            this.listItems.push(listItem[iCounter]);
        }
    }
    return listDetails;
}());
function setlistJson(listItem) {
    var listVal = getfromLocalStorage('list');
    var listDetails = listVal.lists;
    var itemExist = false;
    if (listDetails && listDetails.length > 0) {
        listDetails.forEach(function (element) {
            if (element && element[0] && element[0] == listItem.listName) {
                itemExist = true;
                element[1] = listItem.listItems;
            }
        });
    }
    if (!itemExist) {
        var item = [];
        item[0] = listItem.listName;
        item[1] = listItem.listItems;
        if (listDetails && listDetails.length > 0) {
            listDetails.push(item);
        }
        else
            listDetails[0] = item;
    }
    listVal.lists = listDetails;
    addToLocalStorage('list', listVal);
}
function addToLocalStorage(keyName, value) {
    localStorage.setItem(keyName, JSON.stringify(value));
}
function getfromLocalStorage(keyName) {
    var listValue = JSON.parse(localStorage.getItem(keyName));
    return listValue;
}
function createListwithValue(listName, listitems) {
    var itemObj = new listDetails(listName, listitems);
    setlistJson(itemObj);
}
var listValue = getfromLocalStorage('list');
if (listValue)
    showListItems(listValue);
else {
    var listVal = { 'lists': [] };
    addToLocalStorage('list', listVal);
    listValue = getfromLocalStorage('list');
    showListItems(listValue);
}
function showListItems(listValuesJson) {
    var htmlViewforAlllists = "";
    if (listValuesJson && listValuesJson.lists) {
        var listValues = listValuesJson.lists;
        for (var iCounter = 0; iCounter < listValues.length; iCounter++) {
            var strHeader = listValues[iCounter][0];
            var strListItems = listValues[iCounter][1];
            var htmlHeader = "";
            var htmlListItems = "";
            var htmlList = "";
            htmlList = "<div class='todolist' id='list_" + iCounter + "'>";
            htmlHeader = '<div class="todolistHeaderBtn"><span onclick="addListItem(this);" class="btnAddItem">+ Add Item</span></div>';
            htmlHeader += '<div class="todolistHeader"><span onclick="removeList(this);" class="btnListClose">&times;</span><span class="listTitle">' + strHeader + '</span></div>';
            for (var jCounter = 0; jCounter < strListItems.length; jCounter++) {
                var strItem = strListItems[jCounter];
                var htmlItems = "";
                if (jCounter == 0)
                    htmlItems = '<div class="firstItem lItem"><span onclick="removeListItem(this);" class="btnClose">&times;</span><span class="listItem">' + strItem + '</span></div>';
                else if (jCounter == strListItems.length - 1)
                    htmlItems = '<div class="lastItem lItem"><span onclick="removeListItem(this);" class="btnClose">&times;</span><span class="listItem">' + strItem + '</span></div>';
                else
                    htmlItems = '<div class="lItem"><span onclick="removeListItem(this);" class="btnClose">&times;</span><span class="listItem">' + strItem + '</span></div>';
                htmlListItems += htmlItems;
            }
            htmlList += htmlHeader + htmlListItems + "</div>";
            htmlViewforAlllists += htmlList;
        }
    }
    document.getElementById("divTodoList").innerHTML = htmlViewforAlllists;
}
function openNewlist() {
    isNewItem = 0;
    showNewlist();
}
function showNewlist() {
    $("#divAddForm").show();
    $("#txtlistTitle").val('');
    $("#txtlistTitle").focus();
    if (isNewItem == 0)
        $('.sectionTitle').html('Create New List');
    else
        $('.sectionTitle').html('Create New Item for the List : ' + addItemtolistTitle);
}
function hideNewlist() {
    $("#divAddForm").hide();
}
function saveNewList() {
    var newlistName = $("#txtlistTitle").val();
    if (newlistName != '') {
        if (isNewItem == 0) {
            var empltyArr = [];
            createListwithValue(newlistName, empltyArr);
            var listValue_1 = getfromLocalStorage('list');
            showListItems(listValue_1);
            hideNewlist();
        }
        else {
            var listValue_2 = getfromLocalStorage('list');
            var lists = listValue_2.lists;
            var listItems = [];
            for (var iCounter = 0; iCounter < lists.length; iCounter++) {
                if (lists[iCounter][0] == addItemtolistTitle) {
                    listItems = lists[iCounter][1];
                }
            }
            listItems.push(newlistName);
            createListwithValue(addItemtolistTitle, listItems);
            listValue_2 = getfromLocalStorage('list');
            showListItems(listValue_2);
            hideNewlist();
        }
    }
}
function removeList(cnt) {
    if (confirm("Do you sure you want to delete this list?")) {
        var listTitle = $(cnt).parent().find('.listTitle').text();
        var listValue_3 = getfromLocalStorage('list');
        if (listValue_3 && listValue_3.lists) {
            var lists = listValue_3.lists;
            var newlists = [];
            for (var iCounter = 0; iCounter < lists.length; iCounter++) {
                if (lists[iCounter][0] != listTitle) {
                    newlists.push(lists[iCounter]);
                }
            }
            listValue_3.lists = newlists;
            addToLocalStorage('list', listValue_3);
            var newlistValue = getfromLocalStorage('list');
            showListItems(newlistValue);
        }
    }
}
function removeListItem(cnt) {
    if (confirm("Do you sure you want to delete this item?")) {
        var itemTitle = $(cnt).parent().find('.listItem').text();
        var listTitle = $(cnt).parent().parent().find('.listTitle').text();
        var listValue_4 = getfromLocalStorage('list');
        if (listValue_4 && listValue_4.lists) {
            var lists = listValue_4.lists;
            for (var iCounter = 0; iCounter < lists.length; iCounter++) {
                if (lists[iCounter][0] == listTitle) {
                    var items = lists[iCounter][1];
                    var newItems = [];
                    for (var jCounter = 0; jCounter < items.length; jCounter++) {
                        if (items[jCounter] != itemTitle)
                            newItems.push(items[jCounter]);
                    }
                    createListwithValue(listTitle, newItems);
                    var newlistValue = getfromLocalStorage('list');
                    showListItems(newlistValue);
                }
            }
        }
    }
}
function addListItem(cnt) {
    addItemtolistTitle = $(cnt).parent().parent().find('.listTitle').text();
    isNewItem = 1;
    showNewlist();
}
