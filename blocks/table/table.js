function buildCell(rowIndex, isHeader, colspan) {
  const cell = isHeader ? document.createElement("th") : document.createElement("td");
  if (colspan) cell.setAttribute("colspan", colspan);
  if (!rowIndex) cell.setAttribute("scope", "col");
  return cell;
}

export default async function decorate(block) {
   const tables = [...block.querySelectorAll(".table-wrapper")];
  console.log('tables',tables)

  tables.forEach((tableContainer) => {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    let currentRow;
    
    [...tableContainer.children].forEach((child, i) => {
      const divText = child.textContent.trim();
      const isHeader = divText.includes("$data-type=header$");
      const isEndRow = divText.includes("$data-end=row$");
      const colspanMatch = divText.match(/\$data-colspan=(\d+)\$/);
      const colspan = colspanMatch ? parseInt(colspanMatch[1], 10) : 1;

      // Create a new row if this is a new header or end of row
      if (isHeader || isEndRow) {
        if (currentRow) tbody.append(currentRow); // Add the previous row to tbody if it exists
        currentRow = document.createElement("tr");
      }
      
      // Build the cell
      const cell = buildCell(i === 0 && isHeader, isHeader, colspan);
      cell.innerHTML = divText.replace(/\$.*?\$/, "").trim(); // Clean the cell text from special attributes
      currentRow.append(cell);
      
      // If it's the end of a row, append the currentRow to the appropriate section
      if (isEndRow) {
        tbody.append(currentRow);
        currentRow = null; // Reset currentRow for the next iteration
      }
    });

    // Append the constructed table to the block
    table.append(thead);
    table.append(tbody);
    block.append(table);
  });

  // Handle colspan adjustments and other post-processing as needed
  adjustColspans();
}

function adjustColspans() {
  document.querySelectorAll("table").forEach((tableDiv) => {
    const rows = tableDiv.querySelectorAll("tbody tr");
    if (rows.length < 2) return;
    
    const secondLastRow = rows[rows.length - 2];
    const secondLastCells = secondLastRow.querySelectorAll("td");
    const colspanValue = secondLastCells.length;
    const lastRow = rows[rows.length - 1];
    const lastCell = lastRow.querySelector("td");
    lastCell.setAttribute("colspan", colspanValue);
    
    // Additional adjustments based on your previous logic
    // Implement any additional logic from your original code here...
  });
}
