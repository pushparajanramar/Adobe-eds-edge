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
    parseDivTable(container, table);
    outputContainer.appendChild(table);
}

// Recursive function to parse div tables and create rows and cells
function parseDivTable(divTable, parentTable) {
    const rows = Array.from(divTable.children);
    let currentRow = document.createElement('tr');

    rows.forEach((div, index) => {
        const content = div.innerText.trim();
        if (content === '') return; // Skip empty divs

        const properties = parseProperties(content);
        const textContent = content.replace(/\$.*?\$/g, '').trim(); // Remove $...$ tags from content

        // Determine if it's a header or data cell
        const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');

        // Set text content if there's no nested table
        cell.innerText = textContent;

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

// Main export function
export default async function decorate(block) {
    const outputContainer = document.createElement("div"); // Create a container for the table
    outputContainer.className = "table-container";
    decorateTable(block, outputContainer);

    // Clear the original block content and append the new table
    block.innerHTML = "";
    block.appendChild(outputContainer);
}
