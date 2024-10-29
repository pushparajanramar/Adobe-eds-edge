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

        const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');

        const nestedTableDiv = div.querySelector('.table-type-container');
        if (nestedTableDiv) {
            const nestedTable = document.createElement('table');
            parseDivTable(nestedTableDiv, nestedTable); // Recursive call for nested table
            cell.appendChild(nestedTable);
        } else {
            cell.innerText = textContent;
        }

        if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
        if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

        currentRow.appendChild(cell);

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

    table.append(thead);
    table.append(tbody);

    parseDivTable(block, thead); // Pass block to parseDivTable for header processing
    parseDivTable(block, tbody); // Process body separately if needed


    block.innerHTML = ''; // Clear the original content
    block.append(table); // Append the constructed table
}
