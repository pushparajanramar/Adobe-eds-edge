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
  
const cTable = document.querySelectorAll('.table');
console.log('cTable', cTable);
cTable.forEach(table => {
    // Get all rows in the current table
    const rows = table.getElementsByTagName('tr');
 
    // Check if there are rows
    if (rows.length > 0) {
        // Get the last row
        const lastRow = rows[rows.length - 1];
 
        // Get all cells in the last row
        const cells = lastRow.getElementsByTagName('td');
 
        // Check if there are at least two cells
        if (cells.length >= 2) {
            // Merge the first cell with the second cell
            cells[0].setAttribute("colspan", "2"); // Set colspan to 2 on the first cell
            cells[0].style.backgroundColor = 'yellow'; // Change background color
 
            // Optionally, clear the content of the second cell
           cells[1].remove(); // Hide the second cell if desired
        }
    }
});
}
