export default class GamePlay {
  constructor() {
    this.boardSize = 4;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.unit = null;
    this.unitCell = null;
    this.idColumn = null;
    this.titleColumn = null;
    this.yearColumn = null;
    this.imdbColumn = null;
    this.stat = null;
    this.sortParam = [
      ['id', 'increase', 0x2193],
      ['id', 'decrease', 0x2191],
      ['title', 'increase', 0x2193],
      ['title', 'decrease', 0x2191],
      ['year', 'increase', 0x2193],
      ['year', 'decrease', 0x2191],
      ['imdb', 'increase', 0x2193],
      ['imdb', 'decrease', 0x2191],
    ];
    this.counter = 0;
    this.idHeader = null;
    this.titleHeader = null;
    this.yearHeader = null;
    this.imdbHeader = null;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  drawUi() {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="tableScore">
        <div class="table">
          <div class="score_column">
            <span class="id_header score_cell">id</span>
            <div class="id_column content_column"></div>
          </div>
          <div class="score_column">
            <span class="title_header score_cell">title</span>
            <div class="title_column content_column"></div>
          </div>
          <div class="score_column">
            <span class="year_header score_cell">year</span>
            <div class="year_column content_column"></div>
          </div>
          <div class="score_column">
            <span class="imdb_header score_cell">imbd</span>
            <div class="imdb_column content_column"></div>
          </div>
        </div>
      </div>
      <div class="board-container">
        <div class="board"></div>
      </div>
    `;

    this.boardEl = this.container.querySelector('.board');
    this.idColumn = this.container.querySelector('.id_column');
    this.titleColumn = this.container.querySelector('.title_column');
    this.yearColumn = this.container.querySelector('.year_column');
    this.imdbColumn = this.container.querySelector('.imdb_column');
    this.idHeader = this.container.querySelector('.id_header');
    this.titleHeader = this.container.querySelector('.title_header');
    this.yearHeader = this.container.querySelector('.year_header');
    this.imdbHeader = this.container.querySelector('.imdb_header');


    const inputStat = `[
      {
        "id": 26,
        "title": "Побег из Шоушенка",
        "imdb": 9.30,
        "year": 1994
      },
      {
        "id": 25,
        "title": "Крёстный отец",
        "imdb": 9.20,
        "year": 1972
      },
      {
        "id": 27,
        "title": "Крёстный отец 2",
        "imdb": 9.00,
        "year": 1974
      },
      {
        "id": 1047,
        "title": "Тёмный рыцарь",
        "imdb": 9.00,
        "year": 2008
      },
      {
        "id": 223,
        "title": "Криминальное чтиво",
        "imdb": 8.90,
        "year": 1994
      }
    ]`;

    this.parseStat(inputStat);
    this.createStatTable();


    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell');
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
    this.characterSpawn();
    const newMove = this.characterMove.bind(this);
    setInterval(newMove, 1000);
    const sortStat = this.statisticSorting.bind(this);
    setInterval(sortStat, 2000);
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  characterSpawn() {
    const targetCell = this.randomCell(this.cells);
    const unit = document.createElement('div');
    unit.classList.add('character');
    this.cells[targetCell].appendChild(unit);
    this.unit = unit;
    this.unitCell = targetCell;
  }

  randomCell(arrayOfNumb) {
    return Math.floor(Math.random() * arrayOfNumb.length);
  }


  characterMove() {
    const allowedCells = [...this.cells];
    allowedCells.splice(this.unitCell, 1);
    const targetCell = this.randomCell(allowedCells);
    this.unitCell = targetCell;
    this.cells[targetCell].appendChild(this.unit);
  }

  parseStat(jsonStat) {
    this.stat = JSON.parse(jsonStat);
  }

  sortFunc(param, direction) {
    if (param === 'title') {
      if (direction === 'increase') {
        this.stat.sort((prev, next) => {
          if (prev[param] < next[param]) return -1;
          if (prev[param] > next[param]) return 1;
          return 0;
        });
      } else {
        this.stat.sort((prev, next) => {
          if (prev[param] > next[param]) return -1;
          if (prev[param] < next[param]) return 1;
          return 0;
        });
      }
    } else if (direction === 'increase') {
      this.stat.sort((prev, next) => prev[param] - next[param]);
    } else {
      this.stat.sort((prev, next) => next[param] - prev[param]);
    }
  }

  clearStatTable() {
    while (this.titleColumn.firstChild) {
      this.titleColumn.removeChild(this.titleColumn.firstChild);
    }

    while (this.yearColumn.firstChild) {
      this.yearColumn.removeChild(this.yearColumn.firstChild);
    }

    while (this.imdbColumn.firstChild) {
      this.imdbColumn.removeChild(this.imdbColumn.firstChild);
    }

    while (this.idColumn.firstChild) {
      this.idColumn.removeChild(this.idColumn.firstChild);
    }
  }

  createStatTable() {
    for (let i = 0; i < this.stat.length; i += 1) {
      const cellID = document.createElement('span');
      cellID.classList.add('score_cell');
      cellID.innerHTML = `${this.stat[i].id}`;
      this.idColumn.appendChild(cellID);

      const cellTitle = document.createElement('span');
      cellTitle.classList.add('score_cell');
      cellTitle.innerHTML = `${this.stat[i].title}`;
      this.titleColumn.appendChild(cellTitle);

      const cellYear = document.createElement('span');
      cellYear.classList.add('score_cell');
      cellYear.innerHTML = `${this.stat[i].year}`;
      this.yearColumn.appendChild(cellYear);

      const cellIMDB = document.createElement('span');
      cellIMDB.classList.add('score_cell');
      cellIMDB.innerHTML = `${this.stat[i].imdb}`;
      this.imdbColumn.appendChild(cellIMDB);
    }
  }

  statisticSorting() {
    this.idHeader.innerHTML = 'id';
    this.titleHeader.innerHTML = 'title';
    this.yearHeader.innerHTML = 'year';
    this.imdbHeader.innerHTML = 'imdb';
    this.sortFunc(this.sortParam[this.counter][0], this.sortParam[this.counter][1]);
    if (this.sortParam[this.counter][0] === 'id') {
      this.idHeader.innerHTML = `id${String.fromCodePoint(this.sortParam[this.counter][2])}`;
    } else if (this.sortParam[this.counter][0] === 'title') {
      this.titleHeader.innerHTML = `title${String.fromCodePoint(this.sortParam[this.counter][2])}`;
    } else if (this.sortParam[this.counter][0] === 'year') {
      this.yearHeader.innerHTML = `year${String.fromCodePoint(this.sortParam[this.counter][2])}`;
    } else if (this.sortParam[this.counter][0] === 'imdb') {
      this.imdbHeader.innerHTML = `imdb${String.fromCodePoint(this.sortParam[this.counter][2])}`;
    }
    this.counter += 1;
    if (this.counter >= this.sortParam.length) {
      this.counter = 0;
    }
    this.clearStatTable();
    this.createStatTable();
  }
}
