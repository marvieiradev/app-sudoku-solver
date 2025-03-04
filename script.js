document.addEventListener("DOMContentLoaded", function () {
  const gridSize = 9;
  const solveButton = document.getElementById("solve-btn");
  solveButton.addEventListener("click", solveSudoku);

  const resetButton = document.getElementById("reset-btn");
  resetButton.addEventListener("click", resetGrid);

  const sudokuGrid = document.getElementById("sudoku-grid");
  // Criar a grade do sudoku e as células de entrada
  for (let row = 0; row < gridSize; row++) {
    const newRow = document.createElement("tr");
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.className = "cell";
      input.id = `cell-${row}-${col}`;
      input.min = "1";
      input.max = "9";
      input.maxLength = "1";
      cell.appendChild(input);
      newRow.appendChild(cell);
    }
    sudokuGrid.appendChild(newRow);
  }
});

async function solveSudoku() {
  const gridSize = 9;
  const sudokuArray = [];
  switchButtons();

  // Preencher o sudokuArray com valores de entrada da grade
  for (let row = 0; row < gridSize; row++) {
    sudokuArray[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cellValue = document.getElementById(cellId).value;
      sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
    }
  }

  // Identificar células de entrada do usuário e marcá-las
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cell = document.getElementById(cellId);

      if (sudokuArray[row][col] !== 0) {
        cell.classList.add("user-input");
      }
    }
  }

  // Resolver o sudoku e exiba a solução
  if (solveSudokuHelper(sudokuArray)) {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        // Preencher os valores resolvidos e aplicar a animação
        if (!cell.classList.contains("user-input")) {
          cell.value = sudokuArray[row][col];
          cell.classList.add("solved");
          await sleep(20); // Adiciona um delay para visualização
        }
      }
    }
  } else {
    alert("Não existe solução para esse desafio de Sudoku.");
  }
}

function solveSudokuHelper(board) {
  const gridSize = 9;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            // Tentativa recursiva de resolver o Sudoku
            if (solveSudokuHelper(board)) {
              return true; // Desafio resolvido
            }

            board[row][col] = 0; // Retroceder
          }
        }
        return false; // Nenhum número válido encontrado
      }
    }
  }

  return true; //Todas as células preenchidas
}

function isValidMove(board, row, col, num) {
  const gridSize = 9;

  // Verificar se há conflitos na linha e na coluna
  for (let i = 0; i < gridSize; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false; // Conflito encontrado
    }
  }

  // Verificar se há conflitos na subgrade 3*3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) {
        return false; // Conflito encontrado
      }
    }
  }

  return true; // Nenhum conflito encontrado
}

function switchButtons() {
  const resetButton = document.getElementById("reset-btn");
  resetButton.style.visibility = "visible";
  const solveButton = document.getElementById("solve-btn");
  solveButton.remove();
}
function resetGrid() {
  window.location.reload();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
