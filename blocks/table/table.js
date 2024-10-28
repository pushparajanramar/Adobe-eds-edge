function buildCell(rowIndex) {
  const cell = rowIndex
    ? document.createElement("td")
    : document.createElement("th");
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
    console.log([...block.children].length)

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
  document.querySelectorAll(".table").forEach((tableDiv) => {
    const rows = tableDiv.querySelectorAll("tbody tr");
    // Ensure there are at least two rows to work with
    if (rows.length < 2) return;
    // Get the second-to-last row
    const secondLastRow = rows[rows.length - 2];
    const secondLastCells = secondLastRow.querySelectorAll("td");
    // Count the number of <td> elements in the second-to-last row
    const colspanValue = secondLastCells.length;
    // Get the last row
    const lastRow = rows[rows.length - 1];
    const lastCell = lastRow.querySelector("td");
    // Set the colspan attribute on the last cell
    lastCell.setAttribute("colspan", colspanValue);
  });
  document.querySelectorAll(".table").forEach((tableDiv) => {
    const customRows = tableDiv.querySelectorAll("tbody tr ,tbody tr th");
    for (let i = 0; i < customRows.length - 1; i++) {
      const currentRow = customRows[i];
      const nextRow = customRows[i + 1];
      // Check if current row has more than 1 <th> or <td>
      const currentCells = currentRow.querySelectorAll("th, td");
      const nextCells = nextRow.querySelectorAll("td");
      if (currentCells.length > 1 && nextCells.length === 1) {
        const colspanValue = currentCells.length;
        nextCells[0].setAttribute("colspan", colspanValue);
      }
    }
  });

export default class Table {
  constructor(page, nth = 0) {
    this.page = page;
    console.log('this.page', this.page)
    // tabel locators
    this.table = this.page.locator('.table').nth(nth);
    this.highlightTable = this.page.locator('.table.highlight').nth(nth);
    this.stickyTable = this.page.locator('.table.sticky').nth(nth);
    this.collapseStickyTable = this.page.locator('.table.highlight.collapse.sticky').nth(nth);
    this.merchTable = this.page.locator('.table.merch').nth(nth);
    this.merchHighlightStickyTable = this.page.locator('.table.merch.highlight.sticky').nth(nth);

    this.highlightRow = this.table.locator('.row-highlight');
    this.headingRow = this.table.locator('.row-heading');
    this.stickyRow = this.table.locator('.row-heading');

    this.headingRowColumns = this.headingRow.locator('.col');
    this.rows = this.table.locator('.row');
    this.sectionRows = this.table.locator('.section-row');
  }

  async getHighlightRowColumnTitle(colIndex) {
    return await this.highlightRow.locator('.col-highlight').nth(colIndex);
  }

  async getHeaderColumnTitle(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.tracking-header');
  }

  async getHeaderColumnPricing(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.pricing');
  }

  async getHeaderColumnImg(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('img');
  }

  async getHeaderColumnAdditionalText(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('p').nth(3);
  }

  async getHeaderColumnOutlineButton(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.con-button.outline');
  }

  async getHeaderColumnBlueButton(colIndex) {
    const headerColumn = await this.headingRow.locator(`.col-${colIndex}`);
    return headerColumn.locator('.con-button.blue');
  }

  async getSectionRowTitle(index) {
    const sectionRow = await this.table.locator('.section-row').nth(index);
    return sectionRow.locator('.section-row-title');
  }

  async getSectionRowMerchContent(index) {
    const sectionRow = await this.table.locator('.section-row').nth(index);
    return sectionRow.locator('.col-merch-content').nth(0);
  }

  async getSectionRowMerchContentImg(index) {
    const sectionRow = await this.table.locator('.section-row').nth(index);
    return sectionRow.locator('.col-merch-content img');
  }

  async getSectionRowCell(rowIndex, colIndex) {
    const sectionRow = await this.table.locator('.section-row').nth(rowIndex);
    return sectionRow.locator(`.col-${colIndex}`);
  }
}
}
