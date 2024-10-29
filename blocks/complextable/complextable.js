function parseProperties(content) {
    const properties = {};
    const matches = content.match(/\$(.*?)\$/g);
    if (matches) {
        matches.forEach(match => {
            const [key, value] = match.replace(/\$/g, '').split('=');
            properties[key.trim()] = value ? value.trim() : true; // Handle true/false values
        });
    }
    return properties;
}

function parseDivTable(divTable, parentTable) {
    const rows = Array.from(divTable.children);
    let currentRow = document.createElement('tr');

    rows.forEach((div, index) => {
        const content = div.innerText.trim();
        if (content === '') return; // Skip empty divs

        const properties = parseProperties(content);
        const textContent = content.replace(/\$.*?\$/g, '').trim(); // Remove $...$ tags from content

        // Determine if it's a header or data cell based on parsed properties
        const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');

        // Check for nested table and process it recursively if present
        const nestedTableDiv = div.querySelector('.table-type-container');
        if (nestedTableDiv) {
            const nestedTable = document.createElement('table');
            parseDivTable(nestedTableDiv, nestedTable); // Recursive call for nested table
            cell.appendChild(nestedTable);
        } else {
            // Set text content if there's no nested table
            cell.innerText = textContent;
        }

        // Apply colspan and rowspan if specified
        if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
        if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

        // Append the cell to the current row
        currentRow.appendChild(cell);

        // End the row if specified or if it's the last element
        if (properties['data-end'] === 'row' || index === rows.length - 1) {
            parentTable.appendChild(currentRow);
            currentRow = document.createElement('tr'); // Reset for a new row
        }
    });
}

export default async function decorate(block) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
  console.log("complextable is working here ",table)
    table.append(thead);
    table.append(tbody);

    parseDivTable(block, thead); // Pass block to parseDivTable for header processing
    parseDivTable(block, tbody); // Process body separately if needed

    block.innerHTML = '';
    block.append(table);
}




  
