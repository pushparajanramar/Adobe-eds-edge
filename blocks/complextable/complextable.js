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
    let currentRow = document.createElement('tr'); // Initialize a new row for table
    let isHeaderRow = true; // To track if the current row is a header row

    rows.forEach((rowDiv) => {
        const cells = Array.from(rowDiv.children);
        let isEndRow = false; // Flag to check if we've hit an end row marker

        cells.forEach((cellDiv) => {
            const content = cellDiv.innerHTML.trim();
            if (content === '') return; // Skip empty divs

            const properties = parseProperties(content);
            const cellContent = content.replace(/\$.*?\$/g, '').trim(); // Remove $...$ tags from content

            // Create a cell (either <th> for headers or <td> for regular cells)
            const cell = isHeaderRow ? document.createElement('th') : document.createElement('td');
            cell.innerHTML = cellContent; // Set innerHTML to retain any HTML content

            // Apply colspan and rowspan if specified
            if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
            if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

            // Append the cell to the current row
            currentRow.appendChild(cell);

            // Check for end row marker
            if (properties['data-end'] === 'row') {
                isEndRow = true; // Mark that we've reached the end of this row
                isHeaderRow = false; // Next row should be regular data row
            }
        });

        // If we reached the end of a row, append the current row to the table
        if (isEndRow) {
            parentTable.appendChild(currentRow);
            currentRow = document.createElement('tr'); // Reset for the next row
        }
    });

    // If there are any remaining cells in currentRow, append it to the parentTable
    if (currentRow.children.length > 0) {
        parentTable.appendChild(currentRow);
    }
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
      console.log("newDiv" , newDiv.innerHTML);
     decorateTable(newDiv, outputContainer);
}
