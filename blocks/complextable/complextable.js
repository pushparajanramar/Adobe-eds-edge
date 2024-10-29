function buildCell(rowIndex, properties) {
    const cell = rowIndex ? document.createElement("td") : document.createElement("th");
    if (!rowIndex) cell.setAttribute("scope", "col");
    
    // Set colspan or rowspan if specified
    if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
    if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

    return cell;
}
function parseDivTable(divTable, parentTable) {
    const rows = Array.from(divTable.children);
    let currentRow = document.createElement('tr');

    rows.forEach((div, index) => {
        const content = div.innerText.trim();
        if (content === '') return; // Skip empty divs

        const properties = parseProperties(content);
        const textContent = content.replace(/\$.*?\$/g, '').trim(); // Remove $...$ tags from content

        // Determine cell type based on data-type
        const cell = properties['data-type'] === 'header' ? document.createElement('th') : document.createElement('td');

        // Set text content
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

export default async function decorate(block) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const hasHeader = !block.classList.contains("no-header");
    
    if (hasHeader) table.append(thead);
    table.append(tbody);

    [...block.children].forEach((child, i) => {
        const row = document.createElement("tr");
        const isHeaderRow = hasHeader && i === 0;
        
        if (isHeaderRow) thead.append(row);
        else tbody.append(row);
        
        [...child.children].forEach(col => {
            const properties = parseProperties(col.innerText);
            const cell = buildCell(isHeaderRow ? 0 : 1, properties);
            
            // Remove $...$ tags for display text
            const cellText = col.innerText.replace(/\$.*?\$/g, '').trim();
            cell.innerText = cellText;

            // Check for nested tables
            const nestedTableDiv = col.querySelector('.complextable');
            if (nestedTableDiv) {
                const nestedTable = document.createElement('table');
                parseDivTable(nestedTableDiv, nestedTable); // Recursion for nested tables
                cell.appendChild(nestedTable);
            }
            
            row.append(cell);
        });
    });
    
    block.innerHTML = "";
    block.append(table);
}
