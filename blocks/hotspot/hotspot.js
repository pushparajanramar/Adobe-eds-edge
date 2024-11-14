export default function decorate(block) {
  [...block.children].forEach((row, r) => {
    if (r > 0) {
      const content = [...row.children][0].textContent.trim();
       const nexticondiv = document.createElement('div');
      nexticondiv.classList.add('hotspot'); // Added class for CSS targeting
      nexticondiv.style.left = [...row.children][1].textContent;
      nexticondiv.style.top = [...row.children][2].textContent;
      nexticondiv.setAttribute('data', content);
       const contentContainer = document.createElement('div');
      contentContainer.classList.add('hotspot-content');
      contentContainer.textContent = content; // Display text
      contentContainer.classList.add('bgborder');
      contentContainer.style.display = 'none'; // Initially hide the content
       // Append content container to hotspot div
      nexticondiv.appendChild(contentContainer);
       // Show content on hover
      nexticondiv.addEventListener('click', () => {
        contentContainer.style.display = 'block'; // Show the content
        const anchor = document.createElement('a');
        if (content == 'InhibitoryActivity') {
          anchor.href = '#bookmark-1'; // Set the link target
        } else if (content == 'Click Here') {
          anchor.href = '#bookmark-2'; // Set the link target
        } else if (content == "BBB Penetration") {
          anchor.href = '#bookmark-3'; // Set the link target
        } else {
          anchor.href = '';
        }
        anchor.style.display = 'none'; // Hide the anchor element (optional)
         // Append the anchor to the body (necessary to make it clickable)
        document.body.appendChild(anchor);
         // Programmatically click the anchor
        anchor.click();
      });
       // Hide content when not hovering
      nexticondiv.addEventListener('mouseleave', () => {
        contentContainer.style.display = 'none'; // Hide the content
      });
 
      nexticondiv.addEventListener('click', () => {
         // Hide content of all other hotspots
        document.querySelectorAll('.hotspot').forEach((hotspot) => {
          if (hotspot !== nexticondiv) {
            hotspot.classList.remove('onclick');
          }
        });
        // Toggle the current hotspot content
        nexticondiv.classList.toggle('onclick');
      });
 
      row.after(nexticondiv);
      row.remove();
    }
  });
}
