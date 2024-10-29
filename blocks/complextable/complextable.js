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

        // Check for nested table and process it recursively if present
        const nestedTableDiv = div.querySelector('.complextable');
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

function complexTable() {
      const tableDivs = document.querySelectorAll(".complextable div");
      var newDiv = document.createElement('div');
      [...tableDivs].forEach((div, index) => {
        newDiv.appendChild(div);
      });
      const outputContainer = document.getElementById('nested-output');
      outputContainer.innerHTML = ''; // Clear previous output
      decorateTable(newDiv, outputContainer);
    }

    function buildCell(rowIndex) {
      const cell = rowIndex
        ? document.createElement("td")
        : document.createElement("th");
      if (!rowIndex) cell.setAttribute("scope", "col");
      return cell;
    }
  export default async function decorate(block) {
      console.log('block', block)
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
        [...child.children].forEach((col) => {
          const cell = buildCell(header ? i : i + 1);
          cell.innerHTML = col.innerHTML;
          row.append(cell);
        });
      });
      block.innerHTML = "";
      block.append(table);
  complexTable()
    }

