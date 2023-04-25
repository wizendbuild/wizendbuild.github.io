const costCalculator = new CostCalculator();
const sebaiCalendar = new SebaiCalendar();
const notesApp = new NotesApp();

function CostCalculator() {
  this.costItems = [];
  this.totalCost = 0;

  this.addCost = function () {
    const costItem = new CostItem();
    costItem.render();
    this.costItems.push(costItem);
    this.updateTotalCost();
  };

  this.removeCost = function (costItem) {
    const index = this.costItems.indexOf(costItem);
    if (index !== -1) {
      this.costItems.splice(index, 1);
    }
    this.updateTotalCost();
  };

  this.updateTotalCost = function () {
    this.totalCost = this.costItems.reduce((sum, costItem) => {
      return sum + costItem.calculateCost();
    }, 0);
    document.getElementById('total-cost-value').textContent = this.totalCost;
  };

  this.refillCosts = function () {
    this.costItems.forEach((costItem) => {
      costItem.refill();
    });
    this.updateTotalCost();
  };

  document.getElementById('add-cost').addEventListener('click', () => {
    this.addCost();
  });

  document.getElementById('refill-costs').addEventListener('click', () => {
    this.refillCosts();
  });
}

function CostItem() {
  this.setNumber = 0;
  this.actualNumber = 0;
  this.cost = 0;

  this.calculateCost = function () {
    return (this.setNumber - this.actualNumber) * this.cost;
  };

  this.refill = function () {
    this.actualNumber = this.setNumber;
    this.render();
  };

  this.updateCost = function () {
    costCalculator.updateTotalCost();
  };

  this.remove = function () {
    costCalculator.removeCost(this);
    this.element.remove();
  };

  this.render = function () {
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'cost-item';
      this.element.innerHTML = `
        <label>Title:</label> <input type="text" class="cost-title">
        <label>Set:</label> <input type="number" class="cost-set-number" value="0">
        <label>Actual:</label> <input type="number" class="cost-actual-number" value="0">
        <label>Cost:</label> <input type="number" class="cost-cost" value="0">
        <button class="cost-remove">Remove</button>
      `;
      document.querySelector('.cost-items').appendChild(this.element);
      this.element.querySelector('.cost-remove').addEventListener('click', () => {
        this.remove();
      });
    }

    this.element.querySelector('.cost-title').value = this.title || '';
    this.element.querySelector('.cost-set-number').value = this.setNumber;
    this.element.querySelector('.cost-actual-number').value = this.actualNumber;
    this.element.querySelector('.cost-cost').value = this.cost;

    this.element.querySelector('.cost-set-number').addEventListener('input', (event) => {
      this.setNumber = parseInt(event.target.value);
      this.updateCost();
    });

    this.element.querySelector('.cost-actual-number').addEventListener('input', (event) => {
      this.actualNumber = parseInt(event.target.value);
      this.updateCost();
    });

    this.element.querySelector('.cost-cost').addEventListener('input', (event) => {
      this.cost = parseInt(event.target.value);
      this.updateCost();
    });
  };
}

function SebaiCalendar() {
  this.date = new Date(2023, 0, 1);
  this.months = [
    { name: 'Dusha', days: 35 },
    { name: 'Skal', days: 34 },
    { name: 'Edogas', days: 35 },
    { name: 'Garn', days: 32 },
    { name: 'Sulta', days: 35 },
    { name: 'Janik', days: 34 },
    { name: 'Isbo', days: 35 },
    { name: 'Abash', days: 34 },
    { name: 'Evanora', days: 35 },
  ];

  this.render = function () {
    const hours = this.date.getHours();
    const minutes = this.date.getMinutes();
    document.getElementById('hours').value = hours % 12 || 12;
    document.getElementById('minutes').value = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('ampm').value = hours < 12 ? 'AM' : 'PM';

    const month = this.months[this.date.getMonth()];
    const day = this.date.getDate();
    const year = this.date.getFullYear();
    document.getElementById('current-date').textContent = `${month.name} ${day}, ${year}`;

    this.renderMonthDropdown();
    this.renderDayDropdown();
  };

  this.changeTime = function (amount) {
    this.date.setDate(this.date.getDate() + amount);
    this.render();
  };

  this.renderMonthDropdown = function () {
    const monthDropdown = document.getElementById('month-dropdown');
    monthDropdown.innerHTML = '';
    this.months.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = month.name;
      monthDropdown.appendChild(option);
    });
    monthDropdown.value = this.date.getMonth();
  };

  this.renderDayDropdown = function () {
    const dayDropdown = document.getElementById('day-dropdown');
    dayDropdown.innerHTML = '';
    const month = this.months[this.date.getMonth()];
    for (let i = 1; i <= month.days; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      dayDropdown.appendChild(option);
    }
    dayDropdown.value = this.date.getDate();
  };

  document.getElementById('prev-day').addEventListener('click', () => {
    this.changeTime(-1);
  });

  document.getElementById('next-day').addEventListener('click', () => {
    this.changeTime(1);
  });

  document.getElementById('hours').
    .addEventListener('input', (event) => {
      const hours = parseInt(event.target.value);
      const ampm = document.getElementById('ampm').value;
      this.date.setHours(ampm === 'AM' ? hours % 12 : (hours % 12) + 12);
  });

  document.getElementById('minutes')
    .addEventListener('input', (event) => {
      this.date.setMinutes(parseInt(event.target.value));
    });

  document.getElementById('ampm')
    .addEventListener('change', (event) => {
      const ampm = event.target.value;
      const hours = this.date.getHours();
      this.date.setHours(ampm === 'AM' ? hours % 12 : (hours % 12) + 12);
    });

  this.render();
}

function NotesApp() {
  this.sections = [];

  this.addSection = function () {
    const section = new NoteSection();
    section.render();
    this.sections.push(section);
  };

  this.changeSection = function (section) {
    const index = this.sections.indexOf(section);
    if (index !== -1) {
      this.sections.forEach((sec) => {
        sec.saveContent();
      });
      section.loadContent();
    }
  };

  document.getElementById('add-section').addEventListener('click', () => {
    this.addSection();
  });

  this.addSection();
}

function NoteSection() {
  this.title = '';
  this.content = '';

  this.render = function () {
    if (!this.option) {
      this.option = document.createElement('option');
      this.option.value = this.title;
      this.option.textContent = this.title || 'Untitled';
      document.getElementById('section-dropdown').appendChild(this.option);

      this.option.addEventListener('click', () => {
        notesApp.changeSection(this);
      });
    }
    this.option.textContent = this.title || 'Untitled';
  };

  this.saveContent = function () {
    this.content = document.getElementById('note-content').value;
    localStorage.setItem(this.title, this.content);
  };

  this.loadContent = function () {
    document.getElementById('note-content').value = localStorage.getItem(this.title) || '';
  };

  document.getElementById('section-dropdown').addEventListener('change', (event) => {
    this.title = event.target.value;
    this.render();
    this.loadContent();
  });
}

document.getElementById('note-content').addEventListener('input', (event) => {
  const section = notesApp.sections.find((sec) => {
    return sec.title === document.getElementById('section-dropdown').value;
  });
  if (section) {
    section.saveContent();
  }
});