function buildCell(rowIndex) {
  const cell = rowIndex
    ? document.createElement("td")
    : document.createElement("th");
  if (!rowIndex) cell.setAttribute("scope", "col");
  return cell;
}
export default async function decorate(block) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const header = !block.classList.contains("no-header");
  if (header) table.append(thead);
  table.append(tbody);
  [...block.children].forEach((child, i) => {
    console.log([...block.children].lenght)

    const row = document.createElement("tr");
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = "";
  block.append(table);
  document.querySelectorAll(".table").forEach((tableDiv) => {
    const rows = tableDiv.querySelectorAll("tbody tr");
    // Ensure there are at least two rows to work with
    if (rows.length < 2) return;
    // Get the second-to-last row
    const secondLastRow = rows[rows.length - 2];
    const secondLastCells = secondLastRow.querySelectorAll("td");
    // Count the number of <td> elements in the second-to-last row
    const colspanValue = secondLastCells.length;
    // Get the last row
    const lastRow = rows[rows.length - 1];
    const lastCell = lastRow.querySelector("td");
    // Set the colspan attribute on the last cell
    lastCell.setAttribute("colspan", colspanValue);
  });
  document.querySelectorAll(".table").forEach((tableDiv) => {
    const customRows = tableDiv.querySelectorAll("tbody tr ,tbody tr th");
    for (let i = 0; i < customRows.length - 1; i++) {
      const currentRow = customRows[i];
      const nextRow = customRows[i + 1];
      // Check if current row has more than 1 <th> or <td>
      const currentCells = currentRow.querySelectorAll("th, td");
      const nextCells = nextRow.querySelectorAll("td");
      if (currentCells.length > 1 && nextCells.length === 1) {
        const colspanValue = currentCells.length;
        nextCells[0].setAttribute("colspan", colspanValue);
      }
    }
  });
}
