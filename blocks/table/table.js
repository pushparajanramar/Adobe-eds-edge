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
    const tables = document.querySelectorAll("table"); // Select all tables

      tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        if (tbody) {
          const rows = tbody.getElementsByTagName('tr');

          // Proceed only if there are rows
          if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            const cells = lastRow.getElementsByTagName('td');

            if (cells.length > 0) {
              const lastCell = cells[cells.length - 1];

              // Set colspan to the number of columns (use cells.length to generalize)
              lastCell.setAttribute('colspan', cells.length);

              // Optional: Set the content of the last cell
              lastCell.textContent = lastRow.textContent;

              // Remove other cells in the last row
              for (let i = 0; i < cells.length - 1; i++) {
                lastRow.removeChild(cells[i]);
              }
            }
          }
        }
      });

 
}
