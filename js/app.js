// BUDGET CONTROLLER //////////////////

var budgetController = (function () {
////iife 
    var Expense = function (id, description, value) {//function constructor
        this.id = id,
            this.description = description,
            this.value = value,
            this.percentage = -1
    };

    Expense.prototype.caclPercentage = function(totalincome){
        if (totalincome > 0){
        this.percentage = Math.round((this.value/totalincome)*100);
        }else{
            this.percentage = -1;
        }  
    };
    
     Expense.prototype.getPercentage = function(){
         return this.percentage;
     };
    
    var Income = function (id, description, value) {
        this.id = id,
            this.description = description,
            this.value = value
    };
    
    var  calTotal = function(type){
        var sum = 0 ;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        })
         data.totals[type] = sum;
    };
                                    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage : -1                                    
    };
    
    return {////this is going to be display on the UI 
        addItem: function (type, des, val) {
            var newItem, ID;

            ///[1,2,3,4( this is id's/index in array not valuse )] , nxt id = 5
            ///[1,3,5,8] , nxt id =9
            ///ID =  last id + 1

            ///// creat new id//////////////////////////
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            /////creat new item based on inc or exp/////
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //////push the item in to data structure////
            data.allItems[type].push(newItem);

            ////// return the new element////
            return newItem;
        },
        
        deletItem: function(type,id){
          var ids,index;
            //[1,2,3,4] : index = 2 ; id = 3 == data.allItems[type].id ....will work in an orderd array
            //[1,3,5,9] :  index = 2 ; id = 5 == will not gona work in this array 
            
            /*index 0 , id 0, value ram
            index 3,  id 4 ,  value mira
            index 4 , id 5, value gita////i want to delet this
            index 7 , id 7 , value shyam
            index 9, id 9, value JSON*/
            
            ids = data.allItems[type].map(function(current){
                return current.id;    ////return gita.id  = 5                       
            }),///map(fun(gita))
            //map: will always return a new array with the same length(all indexes) as old array but only have same id taht we want to pass in map(fun(curr)) 
               
              index = ids.indexOf(id);
            //index = ids.indexof(5)
            //index = 4
            //ids will the new array that comes from map() 
           if (index !== -1){
           data.allItems[type].splice(index , 1);
               ///inc/exp.splice(index of ele to delet it, num. of ele to delet from that index)
               //inc/exp.splice(4,1)
               ///gita deleted
         }
                 
        },
                        
                        
        calculateBudget: function(){
            
        //1. cal total inc and exp
         calTotal('exp');
         calTotal('inc');
            
        //2. cal budget = total inc - total exp
        data.budget = data.totals.inc - data.totals.exp;
            
        if (data.totals.inc > 0){    
        //3. cal the percentage of income that we spent
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else{
            data.percentage = -1;
        }
    },
        
        calculatePercentage: function(){
            
            /* exp.percentages we need
            
            exp = a=10
                  b=20
                  c=50
            total inc = 100
            % = 10/100=.10*100= 10%
            % = 20/100 = .20*100  20%
             */
            data.allItems.exp.forEach(function(cur){
                
                cur.caclPercentage(data.totals.inc);
            });
        },
            
        getPercentage: function(){
              var allPerc = data.allItems.exp.map(function(cur){
                  return cur.getPercentage();
              }); 
            return allPerc;
         },
        
             
        getbudget: function(){ 
            return{
                budget: data.budget,
                totalinc: data.totals.inc,
                totalexp: data.totals.exp,
                percentage: data.percentage
            }
            
       },
        
        testing: function () {
            console.log(data);
        }
    };

})();




/// UI CONTROLLER///////////////////////

var UIController = (function () {

    var DomStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomecontainer: '.income__list',
        expensecontainer: '.expenses__list',
        budgetLable:'.budget__value',
        incomeLable:'.budget__income--value',
        expenseLable:'.budget__expenses--value',
        PercentageLable:'.budget__expenses--percentage',
        container:'.container',
        exp_percentageLable: '.item__percentage',
        dateLable: '.budget__title--month'
        
    };
    
     var formatNum = function(num, type){
        var numSplit, int, dec,type; 
         /*
         . + or - before num
         . exactly 2 decimal points
         .  comma saperator at thousands
         
         Ex:  I/O: 2500 :: O/P: 2,500.00
         */
         num = Math.abs(num);//converts the num into absolute value
         num = num.toFixed(2);// converts the abs value to fixed 2 point decimal value  :: 12.2563 = 12.26
         // ryt now the num is a string so to split it using split function
         
         numSplit = num.split('.');// 12.26 will bw now [index 0 :12 , index 1 :26]
         
         int = numSplit[0];// ind 0 :val 12
        // as its an str so we can apply .lenght property 
         // we want to add ' , ' at thousands so the length will be > 3 of str
         if(int.length > 3){
             int = int.substr(0 , int.length - 3) + ',' + int.substr(int.length - 3 , 3);
             //substr(fron num , length)....substr(0,2)...for 2300 will be  it starts with 0rt index so from 2....and read th 2 elements so it will 23
         }
        
         dec = numSplit[1]; // ind 1: val 26
          
         return (type === 'exp' ? type = '-' : type  = '+') + ' ' + int + '.' + dec ;
     };

    var nodeListforEach = function(list,callback){
              for (var i=0; i<list.length; i++) {
                  callback(list[i],i);
              }
    };
    
    return {
        getinput: function () {
            return {
                type: document.querySelector(DomStrings.inputType).value, //will bw either inc or exp.
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value),
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml

            //// create an html string with placeholder text
            if (type === 'inc') {
                element = DomStrings.incomecontainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DomStrings.expensecontainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            /// replace the place holder with actule strings

            newHtml = html.replace('%id%', obj.id);
            ///str.replace(regExp/subStr, newSubStr/function)
            //new html = new html bcoz we alredy replace the id  now we want to fill up the data inside this id
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNum(obj.value , type));

            ///insert the html  into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            /// insertAdjecentHTML(position,text)
        },
        
        deleteListItem : function(selectorID){
             var el = document.getElementById(selectorID);
             el.parentNode.removeChild(el);
        },

        clearFields: function () {

            var fields, fieldsArr;

            fields = document.querySelectorAll(DomStrings.inputDescription + ', ' + DomStrings.inputValue);
            //            console.log(fields);
            fieldsArr = Array.prototype.slice.call(fields);
            // slice : to take out small portion of an array in the form of new array [1,2,3,4]..... [2,3]
            fieldsArr.forEach(function (current,index,Array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
            var type ; 
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DomStrings.budgetLable).textContent = formatNum(obj.budget, type);
            document.querySelector(DomStrings.incomeLable).textContent = formatNum(obj.totalinc , 'inc');
            document.querySelector(DomStrings.expenseLable).textContent = formatNum(obj.totalexp ,'exp');
            
            if (obj.percentage>0){
            document.querySelector(DomStrings.PercentageLable).textContent = obj.percentage + ' % ';
            }else{
             document.querySelector(DomStrings.PercentageLable).textContent =  ' -- ';

            }
        },
         
        displayPercentage: function(percentages){
            
          var fields = document.querySelectorAll(DomStrings.exp_percentageLable) ;
          /*var nodeListforEach = function(list,callback){
              for (var i=0; i<list.length; i++) {
                  callback(list[i],i);
              }
              };*/
             nodeListforEach(fields,function(current,index){
                 if(percentages[index]>0){
                 current.textContent = percentages[index] + '%';
                 }else{
                 current.textContent = percentages[index] + '---';

                 }
             }); 
          
        }, 
        displayMonth : function(){
          var months , month , year , now;
            
            now = new Date();//prototype if inbuilt date obj
            months = ['Jan', 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'];
            month = now.getMonth();//gives the month num like for apr will return 3
            year = now.getFullYear();//returns current year
            document.querySelector(DomStrings.dateLable).textContent = months[month] + ' ' + year;
                                                                     //months[1] : feb     2018
        }, 
        
        changeType: function(){
            
            var fields = document.querySelectorAll(
                
                DomStrings.inputType + ' , ' +
                DomStrings.inputDescription + ' , ' +
                DomStrings.inputValue
            );
            
            nodeListforEach(fields, function(cur){
                cur.classList.toggle('red-focus');    
            });
            
            document.querySelector(DomStrings.inputBtn).classList.toggle('red');
        },
        
             
        getDomString: function () {
            return DomStrings;
        }
    };


})();


// GLOBLE CONTROLLER///////////////////

var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListener = function () {

        var DOM = UICtrl.getDomString();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            if (event.KEYPRESS === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click' , ctrlDeletItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

     var updateBudget = function(){
        // 1. calculate the budget
         budgetCtrl.calculateBudget();
        // 2. return the budget
         var budget = budgetCtrl.getbudget();
        // 3. display the budget to UI
        UICtrl.displayBudget(budget);
       
     };
     var  updatePercentage = function(){
         
         // 1.  calculate percentage
            budgetCtrl.calculatePercentage();
         
         // 2.  read the percenatge from bud.ctrl
         
           var percentages = budgetCtrl.getPercentage();
         
         // 3.  update the ui with new percentage
            UICtrl.displayPercentage(percentages);
     };
    
    
    var ctrlAddItem = function () {
        var input, newItem;
        // 1. get the field input data
        input = UICtrl.getinput();
          
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
        // 2. add the item to budget cotroller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add the item to UI
        UICtrl.addListItem(newItem, input.type);
        //4.clear the fields

        UICtrl.clearFields();
    

        // 5. calculate and update the budget
            updateBudget();
        // 6. update the percentages
            updatePercentage();
            
        }
    };
    var ctrlDeletItem = function(event){
        var itemId , ID , splitId , type;
        
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId){
            
            /// split : id= inc-1 then after split : ['inc','1']  so inc is type and 1 is ID
            splitId = itemId.split('-');
            type = splitId[1];
            ID = parseInt(splitId[1]);
            
            // 1. delet the item fron data structure
            budgetCtrl.deletItem(type , ID);
            // 2. delet the item fron ui
            UICtrl.deleteListItem(itemId);
            // 3. update the budget  
            updateBudget();
            //4.  update the percentage
            updatePercentage();
        }
        };

    return {
        init: function () {
            console.log('started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalinc: 0,
                totalexp: 0,
                percentage: -1
                
            })
            setupEventListener();
        }
    };

})(budgetController, UIController);

controller.init();