 /**
window.addEventListener('load',function(){
     init();
     addTableName();
     setupOptionRemoveButtons();
     setupAddOption();
     setupAddField();
     setupDeleteField();
     setChangeOptionsDisplay();
});
*/
// initialize (set up listeners)
function init(){
    document.getElementById('table_name_entry').onkeyup = checkEntry;
    document.getElementById('table_name_entry').addEventListener('blur', function(){
        document.getElementById('validation').style.display = "none";
    });
}

// check entry agaist database table name
function checkEntry(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST","pages/check_table.php", true);

    var data = new FormData();
    data.append("action","check_existence");
    data.append("name", document.getElementById("table_name_entry").value);

    if(document.getElementById("table_name_entry").value.trim() == "") return;
    xhr.send(data);

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            console.log(xhr.responseText);
            if(xhr.responseText == "exists"){
                var valid = document.getElementById('validation');
                valid.style.color = 'red';
                valid.style.fontWeight = 'bold';
                valid.innerText = "Name already taken";
            }
            else{
                var valid = document.getElementById('validation');
                valid.style.color = 'green';
                valid.style.fontWeight = 'bold';
                valid.innerText = "Great choice";
            }
        }
    }
}

// add table name
function addTableName(){
    var addNameButton = document.getElementById("add_name_button");
    addNameButton.addEventListener('click', function(){
         document.getElementById("table_name").innerText = document.getElementById("table_name_entry").value;
         hideElement('edit_table_name');
        showElement('show_table_name');
    });

    // edit table name button
    var editNameButton = document.getElementById("edit_name_button");
    editNameButton.addEventListener('click', function(){
         document.getElementById("table_name_entry").value = document.getElementById("table_name").innerText ;
        hideElement('show_table_name');
        showElement('edit_table_name');
    });

    //cancel edit button
    var cancelEditButton = document.getElementById("cancel_edit_button");
    cancelEditButton.addEventListener('click', function(){
        hideElement('edit_table_name');
        showElement('show_table_name');
    });
}

// hide element
function hideElement(id){
    document.getElementById(id).style.display = 'none';
}

//show element
function showElement(id){
    document.getElementById(id).style.display = 'block';
}

/* CONTROL OPTION ADDITION AND REMOVAL*/

//set up remove buttons
function setupOptionRemoveButtons(){
    var rmBtns = document.getElementsByClassName('remove_option');
    for(var i = 0; i < rmBtns.length; i++){
        rmBtns[i].addEventListener('click', function(){
            var parentRow = null, parentTable = null, parent=this.parentNode;
            
            while(true){
                parent = parent.parentNode;
                if(parent.nodeName == "TR"){
                    parentRow = parent;
                }
                if(parent.nodeName == "TBODY"){
                    parentTable = parent;
                    break;
                }
               
            }
            parentTable.removeChild(parentRow);
            renameOptions(parentTable);
        });
    }
}

//rename options
function renameOptions(tBody){
    var inputs = tBody.getElementsByTagName('input');
    for(var i = 0; i < inputs.length; i++){
        var name = "option" + (i + 1);
        inputs[i].setAttribute('name', name);
    }
}

//setup add option buttons
function setupAddOption(){
    var addBtns = document.getElementsByClassName('add_option');
    for(var i = 0; i < addBtns.length; i++){
        setupAddOptionButton(addBtns[i]);
    }
    
}
//set up add option button
function setupAddOptionButton(btn){
    btn.addEventListener('click', function(){
        var newInput = document.createElement('input');
        newInput.setAttribute('type','text');
        newInput.setAttribute('name','optionX');
        
        var newButton = document.createElement('button');
        newButton.setAttribute('class','remove_option');
        newButton.appendChild(document.createTextNode('Remove'));
        attachRemoveOptionEvent(newButton);
        var newTd = document.createElement('td');
        newTd.appendChild(newInput);
        newTd.appendChild(newButton);
        var newTr = document.createElement('tr');
        newTr.appendChild(newTd);
        
        var tBody = this.previousElementSibling.getElementsByTagName('tbody')[0];
        tBody.appendChild(newTr);
        renameOptions(tBody);
    });
}

//create table column div
function createTableColumnDiv(){
    var mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'row table_column');
    
    //first column
    var firstCol = document.createElement('div');
    firstCol.setAttribute('class', 'col-md-4');
    
    var label = document.createElement('label');
    label.setAttribute('for', 'column_name');    
    label.appendChild(document.createTextNode('Column Name'));
    
     var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'column_name');
    
    firstCol.appendChild(label);
    firstCol.appendChild(input);
    mainDiv.appendChild(firstCol);
    
    //second column
    var secondCol = document.createElement('div');
    secondCol.setAttribute('class', 'col-md-4');
    
    var label2 = document.createElement('label');
    label2.setAttribute('for', 'column_data_type');   label2.appendChild(document.createTextNode('Column Type'));
    
    var select = document.createElement('select');
    select.setAttribute('name', 'column_data_type');
    
    var option1 = document.createElement('option');
    option1.setAttribute('value', 'select_one');   option1.appendChild(document.createTextNode('Choose One'));
    
    var option2 = document.createElement('option');
    option2.setAttribute('value', 'select_many');   option2.appendChild(document.createTextNode('Choose Two Or More'));
    
    var option3 = document.createElement('option');
    option3.setAttribute('value', 'text'); option3.appendChild(document.createTextNode('Text(abc)'));
    
    var option4 = document.createElement('option');
    option4.setAttribute('value', 'number');   
    option4.appendChild(document.createTextNode('Number (123)'));
    
    var option5 = document.createElement('option');
    option5.setAttribute('value', 'date'); 
    option5.appendChild(document.createTextNode('Date'));
    
    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);
    select.appendChild(option4);
    select.appendChild(option5);
    changeOptionsDisplay(select);
    
    secondCol.appendChild(label2);
    secondCol.appendChild(select);
    mainDiv.appendChild(secondCol);
    
    //third column
    var thirdCol = document.createElement('div');
    thirdCol.setAttribute('class', 'col-md-3');
    
    var table = document.createElement('table');
    table.setAttribute('class','options');
    var thead = document.createElement('thead');
    
    var tbody = document.createElement('tbody');
    
    var tr1 = document.createElement('tr');
    var td1 = document.createElement('td');
     var input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    input1.setAttribute('name', 'option1');
    var button1 = document.createElement('button');
    button1.setAttribute('class', 'remove_option');   button1.appendChild(document.createTextNode('Remove'));
    attachRemoveOptionEvent(button1); //create and test this function
    
    td1.appendChild(input1);
    td1.appendChild(button1);
    tr1.appendChild(td1);
    
    //second table row
    var tr2 = document.createElement('tr');
    var td2 = document.createElement('td');
     var input2 = document.createElement('input');
    input2.setAttribute('type', 'text');
    input2.setAttribute('name', 'option2');
    var button2 = document.createElement('button');
    button2.setAttribute('class', 'remove_option');   button2.appendChild(document.createTextNode('Remove'));
    attachRemoveOptionEvent(button2); //create and test this function
    
    td2.appendChild(input2);
    td2.appendChild(button2);
    tr2.appendChild(td2);
    
    //third table row
    var tr3 = document.createElement('tr');
    var td3 = document.createElement('td');
     var input3 = document.createElement('input');
    input3.setAttribute('type', 'text');
    input3.setAttribute('name', 'option3');
    var button3 = document.createElement('button');
    button3.setAttribute('class', 'remove_option');   button3.appendChild(document.createTextNode('Remove'));
    attachRemoveOptionEvent(button3); //create and test this function
    
    td3.appendChild(input3);
    td3.appendChild(button3);
    tr3.appendChild(td3);
    
    tbody.appendChild(tr1);
    tbody.appendChild(tr2);
    tbody.appendChild(tr3);
    
    table.appendChild(thead);
    table.appendChild(tbody);
    
    //add option button
    var addBtn = document.createElement('button');
    addBtn.setAttribute('class', 'add_option');   
    addBtn.appendChild(document.createTextNode('Add Option'));
    setupAddOptionButton(addBtn);
    
    thirdCol.appendChild(table);
    thirdCol.appendChild(addBtn);
    mainDiv.appendChild(thirdCol);
    
    //forth column
    var fourthCol = document.createElement('div');
    fourthCol.setAttribute('class', 'col-md-1');
    
     //delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class', 'pull-right btn-danger delete_field');
    deleteBtn.setAttribute('title', 'Delete'); 
    deleteBtn.appendChild(document.createTextNode('X'));
    deleteField(deleteBtn);
    
    fourthCol.appendChild(deleteBtn);
    mainDiv.appendChild(fourthCol);
    
    return mainDiv;
}

//attach remove option event
function attachRemoveOptionEvent(btn){
    btn.addEventListener('click', function(){
            var parentRow = null, parentTable = null, parent=this.parentNode;
            
            while(true){
                parent = parent.parentNode;
                if(parent.nodeName == "TR"){
                    parentRow = parent;
                }
                if(parent.nodeName == "TBODY"){
                    parentTable = parent;
                    break;
                }
               
            }
            console.log(parentRow);
            console.log(parentTable);
            parentTable.removeChild(parentRow);
            renameOptions(parentTable);
        
        });
}

//setup add field
function setupAddField(){
    var btn = document.getElementById('add_field_button');
    btn.addEventListener('click', function(){
        var newField = createTableColumnDiv();
        var mainDiv = document.getElementById('custom_table');
        mainDiv.insertBefore(newField, document.getElementById('add_field_row'));
    });
    
}

//setup delete field
function setupDeleteField(){
    var btn = document.getElementsByClassName('delete_field')[0];
    deleteField(btn);
}

/*delete field
 *@arg btn the button which when clicked deletes the field
*/
function deleteField(btn){
    btn.addEventListener('click', function(){
        var parentDiv = null;
        var parent = btn.parentNode;
        while(true){
            parent = parent.parentNode;
               if(parent.nodeName == "DIV" && parent.hasAttribute('class')){
                if(parent.getAttribute('class') == 'row table_column'){
                    parentDiv = parent;
                    break;
                }
            }
        }
        console.log(parentDiv);
        document.getElementById('custom_table').removeChild(parentDiv);
    });
}

//setup change options display
function setChangeOptionsDisplay(){
    changeOptionsDisplay(document.getElementsByName('column_data_type')[0]);
}

//change options display
function changeOptionsDisplay(elem){
    elem.addEventListener('change', function(){
        var nextDiv = this.parentNode.nextElementSibling;
        if(this.value == 'select_one' || this.value == 'select_many'){
            if(nextDiv.style.display == 'none'){
                nextDiv.style.display = 'block';
            } 
        }
        else{
            nextDiv.style.display = 'none';
        }
    });
}

