// Helper function to extract properties from content enclosed in $...$
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

// Main function to convert div-based tables to HTML tables with <tr>, <td>, and <th>
function decorateTable(container, outputContainer) {
    if (!container) {
        console.error("Container not found:", container);
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead'); // Create thead
    const tbody = document.createElement('tbody'); // Create tbody
    table.appendChild(thead);
    table.appendChild(tbody);

    parseDivTable(container, thead, tbody);
    outputContainer.appendChild(table);
}

// Recursive function to parse div tables and create rows and cells
function parseDivTable(divTable, thead, tbody) {
    const rows = Array.from(divTable.children);
    let currentRow;

    rows.forEach((div, index) => {
        const content = div.innerText.trim();
        if (content === '') return; // Skip empty divs

        const properties = parseProperties(content);
        const textContent = content.replace(/\$.*?\$/g, '').trim(); // Remove $...$ tags from content

        // Determine if it's a header or data cell
        const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');

        // Set text content
        cell.innerText = textContent;

        // Apply colspan and rowspan if specified
        if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
        if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

        // Create new row for the header
        if (properties['data-type'] === 'header') {
            if (!currentRow) currentRow = document.createElement('tr');
            currentRow.appendChild(cell);

            // Append the header row to the thead
            if (index === rows.length - 1 || properties['data-end'] === 'row') {
                thead.appendChild(currentRow);
                currentRow = null; // Reset for the next header row
            }
        } else {
            // Create a new row for the body
            if (!currentRow) currentRow = document.createElement('tr');
            currentRow.appendChild(cell);

            // Append the body row to the tbody
            if (index === rows.length - 1 || properties['data-end'] === 'row') {
                tbody.appendChild(currentRow);
                currentRow = null; // Reset for the next body row
            }
        }
    });
}

// Main export function
export default async function decorate(block) {
    const outputContainer = document.createElement("div"); // Create a container for the table
    outputContainer.className = "table-container"; // Add your desired class name here
    decorateTable(block, outputContainer);

    // Clear the original block content and append the new table
    block.innerHTML = "";
    block.appendChild(outputContainer);
}
