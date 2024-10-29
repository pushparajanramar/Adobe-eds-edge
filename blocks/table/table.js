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

function buildCell(rowIndex, properties) {
    const cell = rowIndex ? document.createElement("td") : document.createElement("th");
    if (!rowIndex) cell.setAttribute("scope", "col");

    // Apply colspan and rowspan if specified
    if (properties['data-colspan']) cell.colSpan = properties['data-colspan'];
    if (properties['data-rowspan']) cell.rowSpan = properties['data-rowspan'];

    return cell;
}

async function decorate(block) {
  console.log("Table ")
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const header = !block.classList.contains("no-header");
    if (header) table.append(thead);
    table.append(tbody);

    [...block.children].forEach((child, i) => {
        const row = document.createElement("tr");
        if (header && i === 0) thead.append(row);
        else tbody.append(row);

        const content = child.innerText.trim();
        if (content === '') return; // Skip empty children

        const properties = parseProperties(content);
        const textContent = content.replace(/\$.*?\$/g, '').trim();

        const cell = buildCell(header ? i : i + 1, properties);
        cell.innerText = textContent;

        // Check for nested tables
        const nestedTableDiv = child.querySelector('.table-type-container');
        if (nestedTableDiv) {
            const nestedTable = document.createElement('table');
            parseDivTable(nestedTableDiv, nestedTable); // Recursive call for nested table
            cell.appendChild(nestedTable);
        }

        row.append(cell);
    });

    block.innerHTML = "";
    block.append(table);
}
