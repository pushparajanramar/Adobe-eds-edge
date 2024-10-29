function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement("td") : document.createElement("th");
  if (!rowIndex) cell.setAttribute("scope", "col");
  return cell;
}

function parseProperties(content) {
  const properties = {};
  const regex = /\$(.*?)\$/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const [key, value] = match[1].split('=');
    properties[key.trim()] = value ? value.trim() : true;
  }
  return properties;
}

function decorateTable(container, outputContainer) {
  if (!container) {
    console.error("Container not found:", container);
    return;
  }

  const table = document.createElement('table');
  parseDivTable(container, table);
  outputContainer.appendChild(table);
}

 function parseDivTable(divTable, parentTable) {
            const rows = Array.from(divTable.children);
            let currentRow = document.createElement('tr');
            rows.forEach((rowDiv) => {
                const currentRow = document.createElement('tr');
                const cells = Array.from(rowDiv.children);

                cells.forEach((cellDiv) => {
                    const content = cellDiv.innerHTML.trim();
                    if (content === '') return; // Skip empty divs

                    const properties = parseProperties(content);
                    const cellContent = content.replace(/\$.*?\$/g, '').trim(); // Remove $...$ tags from content

                    // Create a cell (either <th> for headers or <td> for regular cells)
                    const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');
                    cell.innerHTML = cellContent; // Set innerHTML to retain any HTML content

                    // Apply colspan and rowspan if specified
                    if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
                    if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

                    // Append the cell to the current row
                    currentRow.appendChild(cell);
                });

                // Append the row to the table
                parentTable.appendChild(currentRow);
            });
        }

export default async function decorate(block) {
  console.log("(block) is working");
      const tableDivs = document.querySelectorAll(".complextable div");
      var newDiv = document.createElement('div');
      [...tableDivs].forEach((div, index) => {
        newDiv.appendChild(div);
      });
      // Create a new div element
      const custumID = document.createElement('div');
      custumID.id = 'newDivId'; // replace 'newDivId' with your desired ID
      const wrapper = document.querySelector('.complextable-wrapper');
      // Append the new div after the wrapper
      wrapper.insertAdjacentElement('afterend', custumID);
      const outputContainer = document.getElementById('newDivId');
      outputContainer.innerHTML = ''; // Clear previous output
     decorateTable(newDiv, outputContainer);
}
