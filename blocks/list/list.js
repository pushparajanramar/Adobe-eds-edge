document.addEventListener('DOMContentLoaded', function() {
    const ul = document.querySelector('.default-content-wrapper ul');
 
    // Get all siblings of the <ul> that are <p> elements
    const siblings = Array.from(ul.parentElement.children);
    // Loop through each sibling after the <ul>
    let foundUl = false;
    siblings.forEach(sibling => {
        if (sibling === ul) {
            foundUl = true; // Mark that we found the <ul>
        } else if (foundUl && sibling.tagName === 'P') {
            // Create a new list item (li)
            const li = document.createElement('li');
            // Move the content of the paragraph into the new list item
            li.innerHTML = sibling.innerHTML;
 
            // Append the new list item to the unordered list
            ul.appendChild(li);
            // Optionally, remove the original paragraph
            sibling.remove();
        }
    });
});
