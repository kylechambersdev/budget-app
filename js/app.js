class UI {
  //constructor function can be used to select all elements each time UI class is called
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  //submit budget method
  submitBudgetForm(){
    const value = this.budgetInput.value;
    //check if the form is empty or negative, both will not compute
    if(value === '' || value < 0){
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negative</p>`;
      const self = this;
      setTimeout(function (){
        //using this referenced a global object (ie. window) rather than the UI class.  setting self as constant to this above allows the class to be referenced
        //removes error message after 4 seconds
        self.budgetFeedback.classList.remove('showItem');
      }, 4000)
    } else {
      //transfers input  of budget form to budget amount, should only be called when there is a non-negative value entered
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();

    }
  };
  //show balance method
  showBalance(){
    // creating a method to calculate the total expense
    const expense = this.totalExpense();
    //parseInt parses a string and returns the first integer found
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    //sets color of balance amount based on value
    if(total < 0){
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    }
    else if(total > 0){
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');
    }
    else if(total === 0){
      this.balance.classList.remove('showRed', 'showGreen');
      this.balance.classList.add('showBlack');
    }
  }
  //submit expense form
submitExpenseForm(){
  const expenseValue = this.expenseInput.value;
  const amountValue = this.amountInput.value;
  //invalid inputs first
  if(expenseValue === '' || amountValue === '' || amountValue < 0){
    this.expenseFeedback.classList.add('showItem');
    this.expenseFeedback.innerHTML = `<p>value cannot be empty or negative</p>`;
    //reassign this to self to reference the UI class
    const self = this;
    setTimeout(function (){
      self.expenseFeedback.classList.remove('showItem');
    }, 4000)
  } else {
    //converts input to integer
    let amount = parseInt(amountValue);
    //empties fields after saved in variable
    this.expenseInput.value = '';
    this.amountInput.value = '';

    //adds expense data to an array/object
    let expense = {
      id: this.itemID,
      title: expenseValue,
      amount: amount,
    }
    //adds 1 to ID so each subsequent item has ID one higher than the last
    this.itemID++;
    this.itemList.push(expense);
    //creates addExpense method to display expense on the page
    this.addExpense(expense);
    this.showBalance();
  }
}

//addExpense method, creates div and adds innerHTML
addExpense(expense){
  const div = document.createElement('div');
  div.classList.add('expense');
  //comes from template in html *practical to write it out there first for testing
  div.innerHTML = `       <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div>`;
        this.expenseList.appendChild(div);
}


  //total expense method
  totalExpense() {
    let total = 0;
    if(this.itemList.length > 0){
      //reduce method is used to reduce the array to a single value
      //accumulator function takes two parameters (acc/accumulator, curr/current), and the initial value of the accumulator (0)
    total = this.itemList.reduce(function(acc,curr){
      //acc is the sum of previous acc and previous curr amount
      acc += curr.amount
      return acc;
    }, 0);
  }
    this.expenseAmount.textContent = total;
    return total;
  }
  //this element refers to parent element of edit-icon element
  editExpense(element){
    //grabs the id of the specific expense
    let id = parseInt(element.dataset.id);
    //traverse DOM up three parents to expense-list (already hopped up one parent in eventListeners())
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM (but still in array)
    this.expenseList.removeChild(parent);
    //remove from the list (filter will return the item whose id matches the one clicked on)
    let expense = this.itemList.filter(function(item){
      return item.id === id;
    })
    //returns values of expense input back to form for revision
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;

    //remove from the list (filter will return all items except the one whose id matches the one clicked on)
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    })
    //display updated list and new balance calculated
    this.itemList = tempList;
    this.showBalance();
  }
  //this element refers to parent element of delete-icon element
  deleteExpense(element){
    //grabs the id of the specific expense
    let id = parseInt(element.dataset.id);
    //traverse DOM up three parents to expense-list (already hopped up one parent in eventListeners())
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM (but still in array)
    this.expenseList.removeChild(parent);
    //remove from the list (filter will return all items except the one whose id matches the one clicked on)
    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    })
    //display updated list and new balance calculated
    this.itemList = tempList;
    this.showBalance();
  }
}


function eventListeners() {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  //new instance of UI class
  const ui = new UI();

  //budget form submit
  budgetForm.addEventListener('submit', function(event){
    //prevent default form submission, b/c eventListeners(); called every time page is loaded
    event.preventDefault();
    ui.submitBudgetForm();
  })

  //expense form submit
  expenseForm.addEventListener('submit', function(event){
  //prevent default form submission
  event.preventDefault();
  ui.submitExpenseForm();
  });

  //expense list click
  expenseList.addEventListener('click', function(event) {
    if(event.target.parentElement.classList.contains('edit-icon')){
      //grabs parent element of the expense: expense-icons list-item
      ui.editExpense(event.target.parentElement);
    } else if(event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement);
    }

  })

  
}

document.addEventListener('DOMContentLoaded', function() {
  eventListeners();
})