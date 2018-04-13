

let isNewItem:number = 0;
let addItemtolistTitle:string;

class listDetails{
    listName: string;
    listItems=[];
    constructor(listName,listItem:string[])
    {
        this.listName = listName;
        for(let iCounter=0;iCounter<listItem.length;iCounter++)
            {
                this.listItems.push(listItem[iCounter]);

            }     
        
        
    }
}

interface listItem{
    listName:string;
    listItems:string[];
   
}

function setlistJson(listItem) {
    let listVal = getfromLocalStorage('list'); 
    let listDetails = listVal.lists;
    let itemExist = false;
    if(listDetails && listDetails.length >0)
    {
        listDetails.forEach(element => {
            if(element && element[0] && element[0] == listItem.listName)
            {
                itemExist = true;
                element[1] = listItem.listItems;
            }
        });
    }
    if(!itemExist)
    {
       let item:string[]=[];
       item[0] = listItem.listName;
       item[1] = listItem.listItems;
       if(listDetails && listDetails.length >0)
       {
           listDetails.push(item); 
       }
       else
        listDetails[0]=item;
    }
    listVal.lists = listDetails;
    addToLocalStorage('list', listVal);
   
}

function addToLocalStorage(keyName:string, value:any)
{
    localStorage.setItem(keyName, JSON.stringify(value));
}

function getfromLocalStorage(keyName)
{
    let listValue = JSON.parse(localStorage.getItem(keyName));
    return listValue;
}

function createListwithValue(listName:string, listitems:string[])
{
    let  itemObj = new listDetails(listName,listitems);
    setlistJson(itemObj);
}

let listValue = getfromLocalStorage('list');
if(listValue) 
	showListItems(listValue);
else
	{
		let listVal = {'lists':[]};
		addToLocalStorage('list', listVal);
		listValue = getfromLocalStorage('list');
		showListItems(listValue);
	}



function showListItems(listValuesJson)
{
    let htmlViewforAlllists:string="";

    if(listValuesJson && listValuesJson.lists)
    {
        let listValues = listValuesJson.lists;

        for(let iCounter=0;iCounter<listValues.length;iCounter++)
        {
            let strHeader:string = listValues[iCounter][0];
            let strListItems:string[] = listValues[iCounter][1];

            let htmlHeader:string="";
            let htmlListItems:string="";
            let htmlList:string="";

            htmlList = "<div class='todolist' id='list_"+iCounter+"'>";
            htmlHeader ='<div class="todolistHeaderBtn"><span onclick="addListItem(this);" class="btnAddItem">+ Add Item</span></div>';
            htmlHeader += '<div class="todolistHeader"><span onclick="removeList(this);" class="btnListClose">&times;</span><span class="listTitle">'+strHeader+'</span></div>';

            for(let jCounter=0; jCounter < strListItems.length;jCounter++)
            {
                let strItem:string =  strListItems[jCounter];
                let htmlItems:string ="";
                if(jCounter == 0)
                    htmlItems = '<div class="firstItem lItem"><span onclick="removeListItem(this);" class="btnClose">&times;</span><span class="listItem">'+strItem+'</span></div>';
                else if(jCounter == strListItems.length-1)
                    htmlItems = '<div class="lastItem lItem"><span onclick="removeListItem(this);" class="btnClose">&times;</span><span class="listItem">'+strItem+'</span></div>';
                else
                    htmlItems = '<div class="lItem"><span onclick="removeListItem(this);" class="btnClose">&times;</span><span class="listItem">'+strItem+'</span></div>';
                
                htmlListItems += htmlItems;
            }
            htmlList +=htmlHeader+htmlListItems+"</div>";
            htmlViewforAlllists +=htmlList;
        }
    }
    document.getElementById("divTodoList").innerHTML = htmlViewforAlllists;
}
function openNewlist(){
    isNewItem = 0;
    showNewlist();
}

function showNewlist(){
    $("#divAddForm").show();
    $("#txtlistTitle").val('');
    $("#txtlistTitle").focus();
    if(isNewItem == 0)
        $('.sectionTitle').html('Create New List');
    else
        $('.sectionTitle').html('Create New Item for the List : '+addItemtolistTitle);
}

function hideNewlist(){
    $("#divAddForm").hide();
    
}

function saveNewList(){

    let newlistName:any = $("#txtlistTitle").val();
    if(newlistName != '')
    {
        if(isNewItem == 0)
        {
            
                let empltyArr=[];
                createListwithValue(newlistName,empltyArr);
                let listValue = getfromLocalStorage('list'); 
                showListItems(listValue);
                hideNewlist();
            
        }
        else
        {
            let listValue = getfromLocalStorage('list'); 
            let lists = listValue.lists;
            let listItems:string[] = [];
            for(let iCounter:number=0;iCounter < lists.length; iCounter++)
            {
                if(lists[iCounter][0] == addItemtolistTitle)
                {
                    listItems = lists[iCounter][1];
                }
            }
            listItems.push(newlistName);
            createListwithValue(addItemtolistTitle,listItems);
            listValue = getfromLocalStorage('list'); 
            showListItems(listValue);
            hideNewlist();
        }
    }
    
}

function removeList(cnt)
{
    if(confirm("Do you sure you want to delete this list?"))
    {
        let listTitle:string = $(cnt).parent().find('.listTitle').text();
        let listValue = getfromLocalStorage('list');
        if(listValue && listValue.lists)
        {
            let lists = listValue.lists;
            let newlists:any = [];
            for(let iCounter=0;iCounter<lists.length;iCounter++)
                {
                    if(lists[iCounter][0] != listTitle)
                    {
                        newlists.push(lists[iCounter]);
                    }
                
                }
            listValue.lists = newlists;
            addToLocalStorage('list', listValue);
            let newlistValue = getfromLocalStorage('list'); 
            showListItems(newlistValue);
        }
    }
}

function removeListItem(cnt)
{
    if(confirm("Do you sure you want to delete this item?"))
    {
        let itemTitle:string = $(cnt).parent().find('.listItem').text();
        let listTitle:string = $(cnt).parent().parent().find('.listTitle').text();
        let listValue = getfromLocalStorage('list');
        if(listValue && listValue.lists)
        {
            let lists = listValue.lists;
            for(let iCounter=0;iCounter<lists.length;iCounter++)
                {
                    if(lists[iCounter][0] == listTitle)
                    {
                        let items = lists[iCounter][1];
                        let newItems:string[] = [];
                        for(let jCounter=0;jCounter<items.length;jCounter++)
                        {
                                if(items[jCounter]!=itemTitle)
                                    newItems.push(items[jCounter]);
                        }
                        createListwithValue(listTitle,newItems);
                        let newlistValue = getfromLocalStorage('list'); 
                        showListItems(newlistValue);
                    }
                }
        }
    }
}

function addListItem(cnt)
{
    addItemtolistTitle = $(cnt).parent().parent().find('.listTitle').text();
    isNewItem = 1;
    showNewlist();
}