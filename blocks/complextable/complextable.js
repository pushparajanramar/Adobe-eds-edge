function buildCell(rowIndex, isHeader, colspan) {
  const cell = isHeader ? document.createElement("th") : document.createElement("td");
  if (colspan > 1) cell.setAttribute("colspan", colspan);
  if (!rowIndex) cell.setAttribute("scope", "col");
  return cell;
}

export default async function decorate(block) {
   console.log("complextable is working here ")
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const header = !block.classList.contains("no-header");
  
  if (header) table.append(thead);
  table.append(tbody);
  
  const rows = [...block.children];
 console.log("complextable is working here ",rows)
  let currentRow = null;

  rows.forEach((child) => {
    const divText = child.textContent.trim();
    const isHeader = divText.includes("$data-type=header$");
    const isEndRow = divText.includes("$data-end=row$");
    const colspanMatch = divText.match(/\$data-colspan=(\d+)\$/);
    const colspan = colspanMatch ? parseInt(colspanMatch[1], 10) : 1;

    // Create a new row if this is a new header or end of row
    if (isHeader || isEndRow) {
      if (currentRow) tbody.append(currentRow); // Add the previous row to tbody if it exists
      currentRow = document.createElement("tr");
      if (isHeader) thead.append(currentRow); // Append to thead if it's a header
    }
    
    // Build the cell
    const cell = buildCell(currentRow && currentRow.children.length === 0 && isHeader, isHeader, colspan);
    cell.innerHTML = divText.replace(/\$.*?\$/, "").trim(); // Clean the cell text from special attributes
    currentRow.append(cell);
    
    // If it's the end of a row, append the currentRow to the appropriate section
    if (isEndRow) {
      tbody.append(currentRow);
      currentRow = null; // Reset currentRow for the next iteration
    }
  });

  // Handle colspan adjustments and other post-processing
  adjustColspans(table);
}

function adjustColspans(table) {
  const rows = table.querySelectorAll("tbody tr");
  if (rows.length < 2) return;
  
  const secondLastRow = rows[rows.length - 2];
  const secondLastCells = secondLastRow.querySelectorAll("td");
  const colspanValue = secondLastCells.length;
  const lastRow = rows[rows.length - 1];
  const lastCell = lastRow.querySelector("td");
  
  if (lastCell) {
    lastCell.setAttribute("colspan", colspanValue);
  }
}


  
