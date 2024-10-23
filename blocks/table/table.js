/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
  
      const table = document.querySelectorAll(".table table");
      const tbody = table.querySelector('tbody');
      const rows = tbody.getElementsByTagName('tr');

      // Get the last row
      const lastRow = rows[rows.length - 1];

      // Get all cells in the last row
      const cells = lastRow.getElementsByTagName('td');

      if (cells.length > 0) {
        // Get the last cell
        const lastCell = cells[cells.length - 1];

        // Set colspan to the number of columns (2 in this case)
        lastCell.setAttribute('colspan', 2);

        // Optionally, you can set the content of the last cell
        lastCell.textContent = `${lastRow.textContent}`

        // Remove other cells in the last row
        for (let i = 0; i < cells.length - 1; i++) {
          lastRow.removeChild(cells[i]);
        }
      }
    });

 
}
