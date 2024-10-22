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
  
function setColSpan() {
    var customtable = document.querySelectorAll('.table');
    customtable.deleteRow(0);
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML= "cell 1"
    cell.colSpan = 2
}
  // Select the table
const cTable = document.querySelectorAll('.table')
console.log('cTable',cTable)
cTable.forEach(table => {
    // Get all rows in the current table
    const rows = table.getElementsByTagName('tr');

    // Check if there are rows
    if (rows.length > 0) {
        // Get the last row
        const lastRow = rows[rows.length - 1];

        // Do something with the last row, e.g., change its background color
        lastRow.style.backgroundColor = 'yellow';
        lastRow.setAttribute("colspan", "2");
    }
});
}
