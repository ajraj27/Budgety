var budgetController=(function(){






})();



var UIController=(function(){
    var DOMStrings={
      inputType:'.add__type',
      inputDescription:'.add__description',
      inputValue:'.add__value',
      inputBtn:'.add__btn'
    };

    return{
      getInput:function(){
        return{
          type:document.querySelector(DOMStrings.inputType).value,
          decription:document.querySelector(DOMStrings.inputDescription).value,
          value:document.querySelector(DOMStrings.inputValue).value
        };
      },
      getDOMStrings:function(){
        return DOMStrings;
      }

    };


})();



var controller=(function(budgetCtrl,UICtrl){

    var DOM=UICtrl.getDOMStrings();

    function ctrlAddItem(){

      //Get the Input Field Data
        var input=UICtrl.getInput();
        console.log(input);


      //Display the input Field


      //Calculate the budget


      //Display the budget
    }

    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress',function(event){
          if(event.keycode===13 || event.which===13)
              ctrlAddItem();
    });



})(budgetController,UIController);
