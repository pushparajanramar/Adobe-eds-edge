export default async function decorate(block) {
  console.log(block,"block")
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const header = !block.classList.contains("no-header");
  if (header) table.append(thead);
  table.append(tbody);
}
