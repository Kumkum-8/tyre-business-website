const employees = [
  { id: "EMP-101", password: "123456", name: "Arjun Patel", role: "Sales Manager" },
  { id: "EMP-202", password: "654321", name: "Nisha Sharma", role: "Inventory Officer" },
  { id: "EMP-303", password: "111111", name: "Rahul Verma", role: "Customer Service Lead" }
];

const tyreStock = [
  { brand: "Michelin", type: "Premium", size: "185/65R14", qty: 35, price: 120 },
  { brand: "Bridgestone", type: "All Season", size: "205/55R16", qty: 18, price: 146 },
  { brand: "Goodyear", type: "SUV", size: "225/60R18", qty: 12, price: 180 },
  { brand: "Pirelli", type: "Sport", size: "245/40R18", qty: 8, price: 210 },
  { brand: "Hankook", type: "Urban", size: "175/70R13", qty: 24, price: 108 }
];

const customers = [
  { name: "Sanjay Mehta", phone: "+91 98765 43210", vehicle: "Honda City" },
  { name: "Aditi Rao", phone: "+91 99887 66554", vehicle: "Toyota Innova" },
  { name: "Rohit Kumar", phone: "+91 97654 12345", vehicle: "Mahindra Thar" },
  { name: "Priya Nair", phone: "+91 96543 22112", vehicle: "Suzuki Swift" }
];

const sales = [
  { customer: "Sanjay Mehta", item: "Michelin 185/65R14", amount: 360 },
  { customer: "Aditi Rao", item: "Bridgestone 205/55R16", amount: 584 },
  { customer: "Rohit Kumar", item: "Goodyear 225/60R18", amount: 720 },
  { customer: "Priya Nair", item: "Hankook 175/70R13", amount: 324 }
];

const expenses = [
  { label: "Warehouse Rent", amount: 420 },
  { label: "Staff Salaries", amount: 980 },
  { label: "Electricity & Utilities", amount: 180 },
  { label: "Marketing", amount: 220 }
];

const state = {
  loggedInEmployee: null,
  otpCode: null,
  otpVerified: false
};

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const employeeAvatar = document.getElementById("employeeAvatar");
const topbarEmployeeName = document.getElementById("topbarEmployeeName");
const topbarEmployeeRole = document.getElementById("topbarEmployeeRole");

const stockTableBody = document.getElementById("stockTableBody");
const customerTableBody = document.getElementById("customerTableBody");
const salesList = document.getElementById("salesList");
const expenseList = document.getElementById("expenseList");
const otpRequestForm = document.getElementById("otpRequestForm");
const otpVerifyForm = document.getElementById("otpVerifyForm");
const otpStatus = document.getElementById("otpStatus");

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function renderStock() {
  stockTableBody.innerHTML = tyreStock
    .map((tyre) => {
      const status = tyre.qty <= 10 ? "Out of stock" : tyre.qty <= 20 ? "Low stock" : "In stock";
      const cssClass = tyre.qty <= 10 ? "out-of-stock" : tyre.qty <= 20 ? "low-stock" : "in-stock";

      return `
        <tr>
          <td>${tyre.brand}</td>
          <td>${tyre.type}</td>
          <td>${tyre.size}</td>
          <td>${tyre.qty}</td>
          <td>${formatter.format(tyre.price)}</td>
          <td><span class="status-pill ${cssClass}">${status}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderCustomers() {
  customerTableBody.innerHTML = customers
    .map(
      (customer) => `
        <tr>
          <td>${customer.name}</td>
          <td>${customer.phone}</td>
          <td>${customer.vehicle}</td>
        </tr>
      `
    )
    .join("");
}

function renderSales() {
  salesList.innerHTML = sales
    .map(
      (item) => `
        <div class="sale-item">
          <div>
            <strong>${item.customer}</strong>
            <small>${item.item}</small>
          </div>
          <div class="sale-amount">${formatter.format(item.amount)}</div>
        </div>
      `
    )
    .join("");
}

function renderExpenses() {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  expenseList.innerHTML = expenses
    .map(
      (item) => `
        <div class="expense-item">
          <div>
            <strong>${item.label}</strong>
            <small>Daily overhead</small>
          </div>
          <div class="expense-amount">${formatter.format(item.amount)}</div>
        </div>
      `
    )
    .join("");

  const totalSales = sales.reduce((sum, item) => sum + item.amount, 0);
  const incomeValue = document.getElementById("incomeValue");
  const expenseValue = document.getElementById("expenseValue");
  const netValue = document.getElementById("netValue");

  incomeValue.textContent = formatter.format(totalSales);
  expenseValue.textContent = formatter.format(totalExpenses);
  netValue.textContent = formatter.format(totalSales - totalExpenses);
}

function renderSummaryCards() {
  const totalStock = tyreStock.reduce((sum, tyre) => sum + tyre.qty, 0);
  const totalSales = sales.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const dailyProfit = totalSales - totalExpenses;

  document.getElementById("stockTotal").textContent = `${totalStock}`;
  document.getElementById("todaySales").textContent = formatter.format(totalSales);
  document.getElementById("expenseTotal").textContent = formatter.format(totalExpenses);
  document.getElementById("dailyProfit").textContent = formatter.format(dailyProfit);
}

function updateEmployeeHeader(employee) {
  const initials = employee.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  employeeAvatar.textContent = initials;
  topbarEmployeeName.textContent = employee.name;
  topbarEmployeeRole.textContent = employee.role;
}

function showDashboard() {
  loginScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");
}

function logout() {
  state.loggedInEmployee = null;
  state.otpCode = null;
  state.otpVerified = false;
  otpStatus.textContent = "No OTP sent yet.";
  otpStatus.classList.remove("success");

  loginScreen.classList.remove("hidden");
  dashboard.classList.add("hidden");
  document.getElementById("loginForm").reset();
  employeeAvatar.textContent = "A";
  topbarEmployeeName.textContent = "Employee";
  topbarEmployeeRole.textContent = "Role";
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const employeeId = document.getElementById("employeeId").value.trim();
  const password = document.getElementById("employeePassword").value.trim();

  const employee = employees.find(
    (person) => person.id === employeeId && person.password === password
  );

  if (!employee) {
    alert("Invalid employee ID or password.");
    return;
  }

  state.loggedInEmployee = employee;
  updateEmployeeHeader(employee);
  showDashboard();
});

logoutBtn.addEventListener("click", logout);

otpRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const phone = document.getElementById("customerPhone").value.trim();
  if (!phone) {
    otpStatus.textContent = "Please enter a valid customer phone number.";
    return;
  }

  state.otpCode = String(Math.floor(100000 + Math.random() * 900000));
  state.otpVerified = false;
  otpStatus.textContent = `OTP sent to ${phone}. Demo code: ${state.otpCode}`;
  otpStatus.classList.remove("success");
});

otpVerifyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const codeEntered = document.getElementById("otpInput").value.trim();
  if (!state.otpCode) {
    otpStatus.textContent = "Please send an OTP first.";
    return;
  }

  if (codeEntered === state.otpCode) {
    state.otpVerified = true;
    otpStatus.textContent = "Customer OTP verified successfully. Service request confirmed.";
    otpStatus.classList.add("success");
  } else {
    otpStatus.textContent = "Incorrect OTP. Please try again.";
    otpStatus.classList.remove("success");
  }
});

function activateSection(sectionName) {
  const panels = document.querySelectorAll("[data-section-panel]");
  panels.forEach((panel) => {
    const shouldShow = panel.dataset.sectionPanel === sectionName || sectionName === "overview";
    panel.classList.toggle("hidden-panel", !shouldShow);
  });
}

const navButtons = document.querySelectorAll(".nav-item");
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activateSection(button.dataset.section);
  });
});

renderStock();
renderCustomers();
renderSales();
renderExpenses();
renderSummaryCards();
activateSection("overview");
logout();
