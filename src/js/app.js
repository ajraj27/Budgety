var budgetController=(function(){

  var Expense=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
    this.percentage=-1;
  };

  var Income=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  };

  Expense.prototype.calcPercentage=function(totalIncome){

    if(totalIncome>0){
      this.percentage=Math.round((this.value/totalIncome)*100);
    }else{
      this.percentage=-1;
    }
  };

  Expense.prototype.getPercentage=function(){
    return this.percentage;
  };

  var calculateTotal=function(type){
    var sum=0;

    data.allItems[type].forEach(function(curr){
      sum+=curr.value;
    });

    data.totals[type]=sum;

  };

  var data={

    allItems:{
      exp:[],
      inc:[]
    },

    totals:{
      exp:0,
      inc:0
    },
    budget:0,
    percentage:0
  };

  return {
    addItem:function(type,desc,val){
      var newItem,Id;

      //Create new ID
      if(data.allItems[type].length>0){
        Id=data.allItems[type][data.allItems[type].length-1].id+1;
      }else{
        Id=0;
      }

      //Create new item
      if(type==='exp'){
          newItem=new Expense(Id,desc,val);
      }else{
          newItem=new Income(Id,desc,val);
      }
      //Add new item
      data.allItems[type].push(newItem);

      //Return new item
      return newItem;

  },

  deleteItem:function(type,Id){

    var ids,index;

    ids=data.allItems[type].map(function(current){
      return current.id;
    });

    index=ids.indexOf(Id);

    if(index!==-1){
    data.allItems[type].splice(index,1);
  }

},

  calculateBudget:function(){
      var budget;

      //Calculate total income and expenses
        calculateTotal('inc');
        calculateTotal('exp');

      //Calculate the total budget
        data.budget =data.totals.inc-data.totals.exp;

      //Caluculate the percentage of expenses
      if(data.totals.inc>0){
        data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
      }else{
        data.percentage=-1;
      }
  },

  calculatePercentages:function(){

    data.allItems.exp.forEach(function(curr){
      curr.calcPercentage(data.totals.inc);
    })
  },

  getPercentages:function(){

    var allPerc=data.allItems.exp.map(function(curr){
      return curr.getPercentage();
    });

    return allPerc;
  },

  getBudget:function(){
    return{
      budget:data.budget,
      totalIncome:data.totals.inc,
      totalExpenses:data.totals.exp,
      percentage:data.percentage
    };
  },


  testing:function(){
    console.log(data);
  }



};





})();



var UIController=(function(){
    var DOMStrings={
      inputType:'.add__type',
      inputDescription:'.add__description',
      inputValue:'.add__value',
      inputBtn:'.add__btn',
      incomeContainer:'.income__list',
      expensesContainer:'.expenses__list',
      budgetLabel:'.budget__value',
      incLabel:'.budget__income--value',
      expLabel:'.budget__expenses--value',
      percentageLabel:'.budget__expenses--percentage',
      container:'.container',
      itemPercentageLabel:'.item__percentage',
      dateLabel:'.budget__title--month'
    };

    var formatNum=function(num,type){
      var numSplit,int,dec;

      num=Math.abs(num);
      num=num.toFixed(2);

      numSplit=num.split('.');

      int=numSplit[0];
      dec=numSplit[1];

      if(int.length>3){
        int=int.substr(0,int.length-3)+','+ int.substr(int.length-3,3);
      }

      return (type==='inc'?'+':'-')+' '+int+'.'+dec;


    };

    var nodeListForEach=function(list,callback){

      for(var i=0;i<list.length;i++){
        callback(list[i],i);
      }

    };

    return{
      getInput:function(){
        return{
          type:document.querySelector(DOMStrings.inputType).value,
          description:document.querySelector(DOMStrings.inputDescription).value,
          value:parseFloat(document.querySelector(DOMStrings.inputValue).value)
        };
      },

       addListItem:function(obj,type){
         var html,newHtml,element;

         //Take out HTML strings with placeholder
          if(type==='inc'){
            element=DOMStrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix">  <div class="item__value">%value%</div>  <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }else{
            element=DOMStrings.expensesContainer;
           html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

         //Place the placeholder with actual data
         newHtml=html.replace('%id%',obj.id);
         newHtml=newHtml.replace('%description%',obj.description);
         newHtml=newHtml.replace('%value%',formatNum(obj.value,type));

         //Insert the HTML data into DOM
         document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

       },

       deleteListItem:function(selectorID){
         var el;

         el=document.getElementById(selectorID);
         el.parentNode.removeChild(el);

       },

       clearFields:function(){
         var fields,fieldsArr;

         fields=document.querySelectorAll(DOMStrings.inputDescription+','+DOMStrings.inputValue);
         fieldsArr=Array.prototype.slice.call(fields);

         fieldsArr.forEach(function(curr,index,array){
           curr.value="";
         });

         fieldsArr[0].focus();
       },

       displayBudget:function(obj){
         var type;

          obj.budget>=0?type='inc':type='exp';
         document.querySelector(DOMStrings.budgetLabel).textContent=formatNum(obj.budget,type);
         document.querySelector(DOMStrings.incLabel).textContent=formatNum(obj.totalIncome,'inc');
         document.querySelector(DOMStrings.expLabel).textContent=formatNum(obj.totalExpenses,'exp');

         if(obj.percentage>0){
           document.querySelector(DOMStrings.percentageLabel).textContent=obj.percentage+'%';
         }else{
           document.querySelector(DOMStrings.percentageLabel).textContent='---';

         }
       },

       displayPercentage:function(percentages){

         var fields=document.querySelectorAll(DOMStrings.itemPercentageLabel);


         nodeListForEach(fields,function(curr,index){
           if(percentages[index]>0){
             curr.textContent=percentages[index]+'%';
           }else{
             curr.textContent='---';
           }

         });
       },

       getDate:function(){
         var now,months,month,year;

         now=new Date();
         months=['January','February','March','April','May','June','July','August','September','October','November','December'];

         month=now.getMonth();
         year=now.getFullYear();

         document.querySelector(DOMStrings.dateLabel).textContent=months[month]+' '+year;

       },

       changedType:function(){

         var fields=document.querySelectorAll(
           DOMStrings.inputType+','+
           DOMStrings.inputDescription+','+
           DOMStrings.inputValue
         );

         nodeListForEach(fields,function(curr){
           curr.classList.toggle('red-focus');
         });

         document.querySelector(DOMStrings.inputBtn).classList.toggle('red');


       },

      getDOMStrings:function(){
        return DOMStrings;
      }

    };


})();



var controller=(function(budgetCtrl,UICtrl){

    var setupEventListeners=function(){
      var DOM=UICtrl.getDOMStrings();

      document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

      document.addEventListener('keypress',function(event){
            if(event.keycode===13 || event.which===13)
                ctrlAddItem();
      });

      document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

      document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);

    };

    var updateBudget=function(){
      var budget;

      //Calculate the budget
        budgetCtrl.calculateBudget();
      //Return the budget
        budget=budgetCtrl.getBudget();
        console.log(budget);
      //Display the budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages=function(){
      var percentages;

      //Calculate the percentages
      budgetCtrl.calculatePercentages();

      //Read percentages from the budget controller
      percentages=budgetCtrl.getPercentages();
      console.log(percentages);

      //Display percentages to the UI
      UICtrl.displayPercentage(percentages);



    };


    function ctrlAddItem(){
      var input,newItem;
      //Get the Input Field Data
        input=UICtrl.getInput();

      if(input.description!=="" && !isNaN(input.value) && input.value>0){

        //Add the item to the budget budgetController
        newItem=budgetCtrl.addItem(input.type,input.description,input.value);


        //Display the input Field
        UICtrl.addListItem(newItem,input.type);

        //Clear the input fields
        UICtrl.clearFields();

        //Calculate and update the budget
        updateBudget();

        //Calculate and update the updatePercentages
        updatePercentages();
      }

    };

    var ctrlDeleteItem=function(event){
      var itemID,splitID,type,id;

      itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;


      if(itemID){

        //Getting the item to delete
        splitID=itemID.split('-');
        type=splitID[0];
        id=parseInt(splitID[1]);

        //Delete item from data structure
          budgetCtrl.deleteItem(type,id);
        //Delete item from UI
          UICtrl.deleteListItem(itemID);

        //Updating the budget
          updateBudget();

          //Calculate and update the updatePercentages
          updatePercentages();
      }

    };

    return{
      init:function(){
        setupEventListeners();
        UICtrl.getDate();
        UICtrl.displayBudget({
          budget:0,
          totalIncome:0,
          totalExpenses:0,
          percentage:-1
        });
      },
    }



})(budgetController,UIController);


controller.init();
