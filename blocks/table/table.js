function buildCell(rowIndex, colspan, rowspan) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  if (colspan) cell.setAttribute('colspan', colspan);
  if (rowspan) cell.setAttribute('rowspan', rowspan);
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) table.append(thead);
  table.append(tbody);

  const rowsData = [...block.children].map(child => {
    return [...child.children].map(col => col.innerHTML);
  });

  const rowSpanCount = {};

  rowsData.forEach((rowData, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);

    rowData.forEach((cellData, j) => {
      const key = `${i}-${j}`;

      // Handle rowspan by checking if the cell is already occupied
      if (rowSpanCount[key] && rowSpanCount[key] > 0) {
        rowSpanCount[key]--;
        return; // Skip creating a cell if the rowspan has been covered
      }

      // Check for colspan
      const colspan = rowData.slice(j + 1).findIndex((data, index) => data === cellData);
      const rowspan = rowsData.slice(i + 1).findIndex((data) => data[j] === cellData);

      const cell = buildCell(header ? i : i + 1, colspan > 0 ? colspan + 1 : undefined, rowspan > 0 ? rowspan + 1 : undefined);
      cell.innerHTML = cellData;
      row.append(cell);

      // Update rowspan tracking
      if (rowspan > 0) {
        for (let k = 1; k <= rowspan; k++) {
          rowSpanCount[`${i + k}-${j}`] = (rowSpanCount[`${i + k}-${j}`] || 0) + 1;
        }
      }
    });
  });

  block.innerHTML = '';
  block.append(table);
}
