document
  .getElementById("disciplineForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = Array.from(form.elements).map((input) =>
      input.value.trim()
    );

    if (formData.some((data) => data === "")) {
      alert(
        "Por favor, preencha todos os campos antes de adicionar a disciplina."
      );
      return;
    }

    addDisciplineToTable(formData);
    form.reset();
    updateStatistics();
  });

function addDisciplineToTable(formData) {
  const tableBody = document.querySelector("#disciplineTable tbody");
  const newRow = tableBody.insertRow();

  formData.forEach((data) => {
    const cell = newRow.insertCell();
    cell.textContent = data;
  });


  const removeButtonCell = newRow.insertCell();
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remover";
  removeButton.addEventListener("click", function () {
    tableBody.removeChild(newRow);
    updateStatistics();
  });
  removeButtonCell.appendChild(removeButton);
}

function updateStatistics() {
  const rows = Array.from(
    document.querySelectorAll("#disciplineTable tbody tr")
  );

  const totalPeriods = new Set(
    rows.map((row) => row.cells[0].textContent.trim())
  ).size;
  const gradesAndFrequencies = rows.map((row) => ({
    grade: parseFloat(row.cells[4].textContent),
    frequency: parseFloat(row.cells[3].textContent),
  }));
  const approvedDisciplines = rows
    .filter((row) => {
      const grade = parseFloat(row.cells[4].textContent);
      const frequency = parseFloat(row.cells[3].textContent);
      return grade >= 5 && frequency >= 75;
    })
    .map(
      (row) =>
        `${row.cells[0].textContent.trim()} - ${row.cells[1].textContent.trim()}`
    );
  const failedDisciplines = rows
    .filter(
      (row) =>
        !approvedDisciplines.includes(
          `${row.cells[0].textContent.trim()} - ${row.cells[1].textContent.trim()}`
        )
    )
    .map(
      (row) =>
        `${row.cells[0].textContent.trim()} - ${row.cells[1].textContent.trim()}`
    );
  const totalCH = rows.reduce(
    (acc, row) => acc + parseInt(row.cells[2].textContent),
    0
  );
  const grades = rows.map((row) => parseFloat(row.cells[4].textContent));
  const averageGradeWeighted =
    grades.reduce((acc, grade) => acc + grade, 0) / grades.length;
  const deviation = calculateDeviation(grades, averageGradeWeighted);
  const totalCHFormatted = totalCH + " horas";

  document.getElementById("statistics").innerHTML = `
        <h2>Estatísticas</h2>
        <p>Quantidade de períodos cursados: ${totalPeriods}</p>
        <p>Média geral ponderada pela CH: ${averageGradeWeighted.toFixed(2)}</p>
        <p>Desvio padrão da média geral: ${deviation.toFixed(2)}</p>
        <p>Lista de disciplinas com aprovação: ${approvedDisciplines.join(
          ", "
        )}</p>
        <p>Lista de disciplinas com reprovação: ${failedDisciplines.join(
          ", "
        )}</p>
        <p>Carga horária total: ${totalCHFormatted}</p>
    `;
}

function calculateDeviation(grades, average) {
  const deviationSum = grades.reduce(
    (acc, grade) => acc + Math.pow(grade - average, 2),
    0
  );
  const variance = deviationSum / grades.length;
  return Math.sqrt(variance);
}
