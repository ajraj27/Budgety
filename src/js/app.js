var budgetController=(function(){

  var Expense=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  }

  var Income=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  }

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
      expensesContainer:'.expenses__list'
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
            html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix">  <div class="item__value">%value%</div>  <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }else{
            element=DOMStrings.expensesContainer;
           html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

         //Place the placeholder with actual data
         newHtml=html.replace('%id%',obj.id);
         newHtml=newHtml.replace('%description%',obj.description);
         newHtml=newHtml.replace('%value%',obj.value);

         //Insert the HTML data into DOM
         document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

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

    }

    var updateBudget=function(){
      var budget;

      //Calculate the budget
        budgetCtrl.calculateBudget();
      //Return the budget
        budget=budgetCtrl.getBudget();
        console.log(budget);
      //Display the budget

    }


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
      }

    }

    return{
      init:function(){
        setupEventListeners();
      }
    }



})(budgetController,UIController);


controller.init();
