function buildCell(rowIndex) {
    const cell = rowIndex ?
        document.createElement("td") :
        document.createElement("th");
    if (!rowIndex) cell.setAttribute("scope", "col");
    return cell;
}

export default async function decorate(block) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const header = !block.classList.contains("no-header");
    if (header) table.append(thead);
    table.append(tbody);

    [...block.children].forEach((child, i) => {
        const row = document.createElement("tr");
        if (header && i === 0) {
            thead.append(row);
        } else {
            tbody.append(row);
        }
        [...child.children].forEach((col) => {
            const cell = buildCell(header ? i : i + 1);

            // Check for $ sign in the column content
            const hasDollarSign = col.innerHTML.includes('$');

            // Optionally handle the cell content based on the presence of $ sign
            if (hasDollarSign) {
                cell.style.backgroundColor = '#ffcccc'; // Example: highlight cell
            }

            // Set the inner HTML of the cell
            cell.innerHTML = col.innerHTML;

            row.append(cell);
        });
    });

    block.innerHTML = "";
    block.append(table);
}
