//create ItemCtrl Module

const itemCtrl = (function(){
//Private
const data = [];
const currData =[];

//Item Constructor:
const itemData = function (id, name, cal){
    this.id = id;
    this.name = name;
    this.cal = cal;
}

//Public
return{
    
    getData: function(){
        return data;
    },
    addItemData: function(name, cal){
        let ID;

        if (data.length > 0){
            ID = data.length;
        }else{
            ID = 0;
        }
        //convert calories to number
        cal = parseInt(cal);

        newItem = new itemData(ID, name, cal);
        data.push(newItem);
        
        return newItem;
    },
    getTotalCalories: function(){
        let totalCal = 0;
        data.forEach(function(item){
            totalCal +=item.cal
        })
        return totalCal
    },
    getCurrData: function(){
        return currData;
    },
    getItemData: function(id){
        let dataToEdit;
        data.forEach(function(e){    
            if (id == e.id){
                dataToEdit = e;   
            }  
        })
        return dataToEdit; //remember to return outside of forEach()
    },
    setCurrentItem:function(dataList){
        currItem = new itemData(dataList.id, dataList.name, dataList.cal)
        currData.push(currItem);
    },
    deleteColumn:function(target){
         target.parentNode.parentNode.remove();
    },
    editDataSubmit: function(){
        //grab the new data from UI first
        const input = UICtrl.getInput();

        data.forEach(function(item){
            if (item.id ===currItem.id){
                item.name = input.name;
                item.cal = parseInt(input.cal);   
            }
        });

        //search for which li matches
        UICtrl.updateOneDataList(input);
    },
    delDataSubmit: function(){
        const ID = data.map(function(item){
            return item.id;
        })

        const index = ID.indexOf(currItem.id);
        //delete the data from Array
        data.splice(index, 1)
        //delete the data from UI
        UICtrl.delDataFromList(index)
        //Clear the UI
        UICtrl.clearInput();
    },
    clearData: function(){
        //delete data 
        data.splice(1, data.length);
        //delete currdata
        currData.splice(1, currData.length);
        
        UICtrl.clearOut();
        //calculate the total cal
        // const totalCal = itemCtrl.getTotalCalories();
        const totalCal = 0;
        //update the total cal 
        UICtrl.updatTotalCal(totalCal); 
    }
    
}
})();


const UICtrl = (function(){

//Public   
    return {
        getTime(){
            setInterval(() => {
                let date = new Date();
                let output = `
                Current Time: ${date.getHours()}: ${date.getMinutes()}: ${date.getSeconds()}`; 
                document.querySelector('div.time').innerHTML = output; 
            }, 1000);   
        },
        //Clear All on browser
        clearOut: function(){
            document.querySelector('.display').innerHTML = ''
        },
        //print out the data on browser
        printOutList: function(data){
            let output = ''
            data.forEach(e => {
                output +=`
                <li><strong>${e.name}: </strong>
                <span>${e.cal}</span>
                <a href="#"><i class="fa fa-edit" edit></i></a>
                <a href="#"><i class="fa fa-times-circle delete"></i></a>
                </li>
                `                
            });
            document.querySelector('.display').innerHTML = output
        },
        //grab data from UI
        getInput: function(){
            return {
                name: document.querySelector('#meal').value,
                cal : document.querySelector('#cal').value
            }   
        },
        addNewItem: function(data){
            const li = document.createElement('li');
            li.setAttribute('id', 'item-'+data.id);
            li.innerHTML = `
            <strong>${data.name}: </strong>
            <span>${data.cal}</span>
            <a href="#"><i class="fa fa-edit edit"></i></a>
            <a href="#"><i class="fa fa-times-circle delete"></i></a>
            `
            //Before the end of the element (as the last child)
            document.querySelector('.display').insertAdjacentElement('beforeend',li)
        },
        updatTotalCal: function(totalCal){
            
            document.querySelector('span.showCal').textContent = totalCal;
        },
        updateOneDataList: function(input){
            //search for all li
            let list = document.querySelectorAll('li');
            
            //convert to array from the node
            list = Array.from(list);

            //search for which li matches currItem amd update it
            list.forEach(function(i){
                if(i.getAttribute('id') ===`item-${currItem.id}`){
                    //update the li to the new data
                    document.querySelector(`#item-${currItem.id}`).innerHTML=`
                    <strong>${input.name}: </strong>
                    <span>${input.cal}</span>
                    <a href="#"><i class="fa fa-edit edit"></i></a>
                    <a href="#"><i class="fa fa-times-circle delete"></i></a>
                    `
                }
                    
            })
            //clear the input
            UICtrl.clearInput()
            //calculate the total cal
            const totalCal = itemCtrl.getTotalCalories();
            //update the total cal 
            UICtrl.updatTotalCal(totalCal);   
        },
        delDataFromList: function(index){
            document.querySelector('#item-'+index).remove();

            //calculate the total cal
            const totalCal = itemCtrl.getTotalCalories();
            //update the total cal 
            UICtrl.updatTotalCal(totalCal);   
        },
        clearInput: function(){
            document.querySelector('#meal').value = '';
            document.querySelector('#cal').value = '';
        },
        clearOtherButtons: function(){
            document.querySelector('.btn.add').style.display = 'inline';
            document.querySelector('.btn.edit').style.display = 'none';
            document.querySelector('.btn.del').style.display = 'none';
            document.querySelector('.btn.back').style.display = 'none';
            
        },
        editButtons: function(){
            document.querySelector('.btn.add').style.display = 'none';
            document.querySelector('.btn.del').style.display = 'inline';
            document.querySelector('.btn.back').style.display = 'inline';
            document.querySelector('.btn.edit').style.display = 'inline';
            
        },
        getItemToEdit: function(data){
            document.querySelector('#meal').value = data.name;
            document.querySelector('#cal').value = data.cal;
            UICtrl.editButtons();
        }
    }
})()


//main control
const app = (function(itemCtrl, UICtrl){

    //Load EventListener
    const loadEventListener = function(){
        //when add-button is pressed
        const addBtn = document.querySelector('.add');
        addBtn.addEventListener('click', ItemAddSubmit);

        //when edit on the li is pressed
        const liEdit = document.querySelector('ul');
        liEdit.addEventListener('click', columnUpdate);

        const Editbtn = document.querySelector('.edit');
        Editbtn.addEventListener('click', ItemEditSubmit);

        const deletebtn = document.querySelector('.del');
        deletebtn.addEventListener('click', ItemDelSubmit);

        const backbtn = document.querySelector('.back');
        backbtn.addEventListener('click', backSubmit);

        const clearbtn = document.querySelector('.clear');
        clearbtn.addEventListener('click', clearSubmit);

        
    }


        //Add Item Submit
        function ItemAddSubmit(e){
        //get form input
        const input = UICtrl.getInput();
        if (input.name!=='' && input.cal!==''){
            const newData = itemCtrl.addItemData(input.name, input.cal)
            UICtrl.addNewItem(newData);
            UICtrl.clearInput();
            //get total Calories
            const totalCal = itemCtrl.getTotalCalories();
            //Update total cal 
            UICtrl.updatTotalCal(totalCal);
        }
        e.preventDefault();
    }


    function columnUpdate(e){
        
        if (e.target.classList.contains('edit')){

            const listID = e.target.parentNode.parentNode.id
            
            let idArr = listID.split('-');
            let idNum = parseInt(idArr[1]);
            const itemToEdit = itemCtrl.getItemData(idNum);
            const setItemToEdit = UICtrl.getItemToEdit(itemToEdit);
            
            itemCtrl.setCurrentItem(itemToEdit);
        }else {
            
            if(e.target.classList.contains('delete')){
            itemCtrl.deleteColumn(e.target);

            // const listID = e.target.parentNode.parentNode.id
            // console.log(listID)
            // let idArr = listID.split('-');
            // let idNum = parseInt(idArr[1]);
            // const itemToEdit = itemCtrl.getItemData(idNum);
            // itemCtrl.deleteColumn(itemToEdit);
            
            // itemCtrl.setCurrentItem(itemToEdit);
        }
    }

        e.preventDefault()
    }

    function ItemEditSubmit(){
        //Edit the data
        itemCtrl.editDataSubmit();
    }

    function ItemDelSubmit(){
        //Edit the data
        itemCtrl.delDataSubmit();
    }

    function backSubmit(){
        UICtrl.clearInput();
        UICtrl.clearOtherButtons();
    }

    function clearSubmit(){
        itemCtrl.clearData();
    }

    //Initialize
    return{
        init: function(){
            //Only add button show in the browser in the begining
            UICtrl.clearOtherButtons()
            // console.log('Initialing...')
            // const dataList = itemCtrl.getData();
            // UICtrl.printOutList(dataList);

            //call loadEventListener in order to prepare activating ItemAddSubmit
            loadEventListener(); 
            UICtrl.getTime()
            
        }
    }
})(itemCtrl, UICtrl)

//Initialize everything in the app 
app.init();