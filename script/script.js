'use strict'

//********************** Получение эламентов DOM *******************************
const clickButton = document.querySelector('#start'),
    resetButton = document.querySelector('#cancel'),
    plusButtonIncome = document.querySelector('.income_add'),
    plusButtonExpenses = document.querySelector('.expenses_add'),
    budgetMonthField = document.querySelector('.budget_month-value'),
    budgetDayField = document.querySelector('.budget_day-value'),
    expensesMonthField = document.querySelector('.expenses_month-value'),
    additionalIncomeField = document.querySelector('.additional_income-value'),
    additionalExpensesField = document.querySelector('.additional_expenses-value'),
    targetMonthValue = document.querySelector('.target_month-value'),
    salaryAmountInput = document.querySelector('.salary-amount'),
    incomeTitleInput = document.querySelector('input.income-title'),
    incomeAmountInput = document.querySelector('.income-amount'),
    expensesTitleInput = document.querySelector('input.expenses-title'),
    depositAmountInput = document.querySelector('.deposit-amount'),
    depositPercentInput = document.querySelector('.deposit-percent'),
    targetAmount = document.querySelector('.target-amount'),
    periodAmount = document.querySelectorAll('.period-amount'),
    periodSelect = document.querySelector('.period-select'),
    incomePeriodValue = document.querySelectorAll('.income_period-value'),
    additExpensesItemInput = document.querySelectorAll('.additional_expenses-item'),
    additIncomeItemInput = document.querySelectorAll('.additional_income-item'),
    checkBox = document.getElementById('deposit-check'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent'),
    optionBank = document.querySelectorAll('option');
let depositBank = document.querySelector('.deposit-bank'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    incomeItems = document.querySelectorAll('.income-items');

class AppData {
    constructor(income = {}, addIncome = [], expenses = {}, addExpenses = [], userAmount = {},
            deposit = false, percentDeposit = 0, moneyDeposit = 0, period = 1, budget = 0,
            budgetDay = 0, budgetMonth = 0, expensesMonth = 0, incomeMonth = 0, savedMoney = 0) {
        this.income = income;
        this.addIncome = addIncome;
        this.expenses = expenses;
        this.addExpenses = addExpenses;
        this.userAmount = userAmount;
        this.deposit = deposit;
        this.percentDeposit = percentDeposit;
        this.moneyDeposit = moneyDeposit;
        this.period = period;
        this.budget = budget;
        this.budgetDay = budgetDay;
        this.budgetMonth = budgetMonth;
        this.expensesMonth = expensesMonth;
        this.incomeMonth = incomeMonth;
        this.savedMoney = savedMoney;
    }

    eventListeners() {
        document.body.addEventListener("input", this.inputValid.bind(this));
        periodSelect.addEventListener('input', this.getPeriodSelect.bind(this));
        clickButton.addEventListener('click', this.startValid.bind(this));
        resetButton.addEventListener('click', this.fullReset.bind(this));
        plusButtonExpenses.addEventListener('click', this.addInputBlock.bind(this));
        plusButtonIncome.addEventListener('click', this.addInputBlock.bind(this));
        checkBox.addEventListener('change', this.depositHandler.bind(this));
        salaryAmountInput.addEventListener('input', () => clickButton.removeAttribute('disabled'));
        depositAmountInput.addEventListener('input', () => clickButton.removeAttribute('disabled'));
        depositPercent.addEventListener('input', () => clickButton.removeAttribute('disabled'));
    }

    inputValid(e) {
        if (e && (e.target.placeholder === "Сумма" || e.target.placeholder === "Процент")) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        }
        if (e && (e.target.placeholder === "Наименование" || e.target.placeholder === "название")) {
            e.target.value = e.target.value.replace(/[^а-яА-ЯёЁ0-9\.\s\-_,]/g, '');
        }
    }

    startValid() {
        if (salaryAmountInput.value === '') {
            clickButton.setAttribute('disabled', 'true');
            alert('Введите месячный доход.');
        } else if (checkBox.checked && depositBank !== '') {
            if (depositAmountInput.value === '' || depositPercent.value === '') {
            alert('Введите данные депозита.');
            clickButton.setAttribute('disabled', 'true');
            } else {
                clickButton.removeAttribute('disabled');
                this.start();
            }
        } else {
            clickButton.removeAttribute('disabled');
            this.start();
        }
    }

    start() {

        const allInput = document.querySelectorAll('.data input[type=text]');
        allInput.forEach(item => {
            item.setAttribute('disabled', 'true');
        });
        plusButtonIncome.setAttribute('disabled', 'true');
        plusButtonExpenses.setAttribute('disabled', 'true');
        clickButton.style.display = 'none';
        resetButton.style.display = 'block';

        this.budget = +salaryAmountInput.value;

        this.getExpIncAndMonth();
        this.getLists();
        this.getPeriodSelect();
        this.getInfoDeposit();
        this.getBudget();
        this.savedMoneyCalc();
        this.trackSavedMoney();
        this.showResult();

        // отключение полей депозита если они пустые
        const indexSelect = document.querySelector('.deposit-bank').options.selectedIndex;
        if (indexSelect === 0) {
            checkBox.checked = false;
            depositAmount.value = 0;
        }
        if (checkBox.checked === true && depositAmount.value === '' && depositPercent.value === '') {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositPercent.style.display = 'none';
            checkBox.checked = false;
        }
        depositBank.setAttribute('disabled', 'true');
        checkBox.setAttribute('disabled', 'true');

    }

    resetDeposit() {
        depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositPercent.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            depositPercent.value = '';
            checkBox.checked = false;

    }

    fullReset() {
        const allInputText = document.querySelectorAll('.data input[type=text]'),
            allInputResult = document.querySelectorAll('.result-total');

        allInputText.forEach(item => {
            item.removeAttribute('disabled');
            item.value = '';
        });
        allInputResult.forEach(item => {
            item.value = '';
        });
        periodSelect.value = '1';
        periodAmount[0].childNodes[0].replaceWith(periodSelect.value);
        plusButtonIncome.removeAttribute('disabled');
        plusButtonExpenses.removeAttribute('disabled');
        clickButton.style.display = 'block';
        resetButton.style.display = 'none';

        incomeItems = document.querySelectorAll('.income-items');
        for (let i = 1; i < incomeItems.length; i++) {
            plusButtonIncome.style.display = 'block';
            incomeItems[i].parentNode.removeChild(incomeItems[i]);
        }
        expensesItems = document.querySelectorAll('.expenses-items');
        for (let i = 1; i < expensesItems.length; i++) {
            expensesItems[i].parentNode.removeChild(expensesItems[i]);
            plusButtonExpenses.style.display = 'block';
        }

        for (const key in this.expenses) {
            delete this.expenses[key];
        }
        for (const key in this.income) {
            delete this.income[key];
        }

        this.addIncome.splice(0, this.addIncome.length);
        this.addExpenses.splice(0, this.addExpenses.length);

        this.incomeMonth = 0;
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.savedMoney = 0;
        this.expensesMonth = 0;
        this.period = 1;
        this.resetDeposit();
        checkBox.removeAttribute('disabled');
        depositBank.removeAttribute('disabled');
    }

    showResult() {
        budgetMonthField.value = Math.ceil(this.budgetMonth);
        budgetDayField.value = Math.ceil(this.budgetDay);
        expensesMonthField.value = this.expensesMonth;
        additionalExpensesField.value = this.addExpenses.join(', ');
        additionalIncomeField.value = this.addIncome.join(', ');
        targetMonthValue.value = this.getTargetMonth();
        periodSelect.addEventListener('input', this.trackSavedMoney.bind(this));
        this.getStatusIncome();
    }
    getPeriodSelect() { // отслеживание ползунка периода
        const usrPeriod = document.createTextNode(periodSelect.value);
        periodAmount[0].childNodes[0].replaceWith(usrPeriod);
    }

    savedMoneyCalc() { // расчет накоплений за период
        this.period = +periodSelect.value;
        this.savedMoney = this.budgetMonth * this.period;
        return this.savedMoney;
    }

    trackSavedMoney() { // вывод накоплений с отслеживанием ползунка
        incomePeriodValue[0].value = Math.ceil(this.savedMoneyCalc());
    }

    addInputBlock(event) { //дополнительные блоки ввода
        const buttonStr = event.target.className.split(' ')[1].slice(0, -4),
            baseItem = document.querySelectorAll(`.${buttonStr}-items`),
            plusButtonParent = document.querySelector(`.${buttonStr}_add`), //родитель
            cloneItem = baseItem[0].cloneNode(true); //полная копия для дубль строки ввода
        baseItem[0].parentNode.insertBefore(cloneItem, plusButtonParent); //встав клона в родителя после кнопки +
        if (baseItem.length === 2) {
            plusButtonParent.style.display = 'none';
        }
    }

    getExpIncAndMonth() { //получение доходов/расходов + подсчет суммы за месяц
        const count = item => {
            const startStr = item.className.split('-')[0], //разбили класс по "-" и взяли нужный
                itemTitle = item.querySelector(`.${startStr}-title`).value,
                itemAmount = item.querySelector(`.${startStr}-amount`).value;
            if (itemTitle !== '' && itemAmount !== '') {
                this[startStr][itemTitle] = +itemAmount;
            }
            const cashMount = `${startStr}Month`;
            this[cashMount] += +itemAmount;
        };
        incomeItems.forEach(count);
        expensesItems.forEach(count);
    }

    getLists() { // Списки возможных доходов и расходов
        const inputList = document.querySelectorAll('.title');
        inputList.forEach(item => {
            const itemMark = item.className.substring(11, 14);
            if (itemMark === 'inc') {
                const startStr = item.className.substring(11, 17),
                    itemInput = document.querySelectorAll(`.additional_${startStr}-item`);
                itemInput.forEach(item => {
                    const itemValue = item.value.trim().toLowerCase();
                    if (itemValue !== '') {
                        this.addIncome.push(itemValue);
                    }
                });
            }
            if (itemMark === 'exp') {
                const startStr = item.className.substring(11, 19),
                    dataInput = document.querySelector(`.additional_${startStr}-item`),
                    addData = dataInput.value.split(',');
                addData.forEach(item => {
                    item = item.trim().toLowerCase();
                    if (item !== '') {
                        this.addExpenses.push(item); //push потому что массив
                    }
                });
            }
        });
    }

    depositHandler() {
        if (checkBox.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            depositAmount.setAttribute('disabled', 'true');
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent.bind(this));
        } else {
            this.resetDeposit();
            this.deposit = false;
            clickButton.removeAttribute('disabled');
            depositBank.removeEventListener('change', this.changePercent.bind(this));
        }
    }
    changePercent(e) {
        if (e.target.value === '') {
            depositAmount.setAttribute('disabled', 'true');
            depositPercent.setAttribute('disabled', 'true');
            depositAmount.value = '';
            depositPercent.value = '';
        } else {
            depositAmount.removeAttribute('disabled');
            depositPercent.removeAttribute('disabled');
            if (e.target.value === 'other') {
                depositPercent.style.display = 'inline-block';
                depositPercent.addEventListener('input', this.validPercent.bind(this));
            } else {
                depositPercent.removeEventListener('input', this.validPercent.bind(this));
                depositPercent.value = e.target.value;
                depositPercent.style.display = 'none';
            }
        }
    }

    validPercent () {
        if (depositPercent.value > 100) {
            depositPercent.value = 100;
        }
    }

    getInfoDeposit() {
        if (this.deposit) {
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
    }

    // ************************* Расчет бюджета ***********************************
    getBudget() {
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = this.budgetMonth / 30;
    }
    getTargetMonth() {
        let period = targetAmount.value / this.budgetMonth;
        if (period < 0 || period === Infinity) {
            period = 'НИКОГДА!!!';
        } else {
            period = Math.ceil(period);
        }
        return period;
    }
    getStatusIncome() {
        if (this.budgetDay < 0) {
            alert('Ваши расходы больше доходов');
        } else if (this.budgetDay === 0) {
            alert('Вы тратите всё, что зарабатываете');
        } else if (this.budgetDay <= 599) {
            alert('К сожалению у вас уровень дохода ниже среднего');
        } else if (this.budgetDay <= 1199) {
            alert('У вас средний уровень дохода');
        } else {
            alert('У вас высокий уровень дохода');
        }
    }
}
const appData = new AppData();
appData.eventListeners();