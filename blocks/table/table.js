function buildCell(rowIndex, colspan = 1, rowspan = 1) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  if (colspan > 1) cell.setAttribute('colspan', colspan);
  if (rowspan > 1) cell.setAttribute('rowspan', rowspan);
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);

  const cellMap = new Map();

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) {
      thead.append(row);
    } else {
      tbody.append(row);
    }

    [...child.children].forEach((col, j) => {
      const content = col.innerHTML;
      const cell = buildCell(header ? i : i + 1);

      // Check if there's a rowspan/colspan defined
      const rowspan = col.getAttribute('data-rowspan') || 1;
      const colspan = col.getAttribute('data-colspan') || 1;

      if (cellMap.has(`${i}-${j}`)) {
        return; // Skip already occupied cell
      }

      cell.innerHTML = content;
      row.append(cell);

      // Mark cells that will be affected by rowspan
      for (let r = 0; r < rowspan; r++) {
        for (let c = 0; c < colspan; c++) {
          cellMap.set(`${i + r}-${j + c}`, true);
        }
      }
    });
  });

  block.innerHTML = '';
  block.append(table);
}
