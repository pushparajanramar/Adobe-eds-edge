import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  sampleRUM,
} from './aem.js';
 
/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}
 
/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}
 
/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}
 
function decorateLinks(main) {
 
  let linkobj = {};
  // Get all anchor elements within the main container
  const links = main.querySelectorAll('a');
 
  // Helper function to convert absolute URLs to relative
  function convertToRelative(href) {
    const url = new URL(href, window.location.origin);
    return url.pathname + url.search + url.hash;
  }
 
  // Counter to generate unique ids for each internal link and backlinks
  let linkCounter = 0;
  // Loop through each anchor element
  links.forEach((link, ind) => {
    const { href } = link;
    // Convert to relative URL if the link is within the same domain
    if (href.startsWith(window.location.origin)) {
      const relativeHref = convertToRelative(href);
      console.log("relativeHref", relativeHref)
      link.setAttribute('href', relativeHref);
    }
    // Only generate a unique id if the link does not already have one
    if (!link.hasAttribute('id')) {
      linkCounter++;
      const uniqueId = `link-${linkCounter}`;
      link.setAttribute('id', uniqueId);
    }
 
    // If the link has a hash (indicating an internal reference), locate the target element
    if (link.hash) {
      const targetId = link.hash.substring(1); // Get the target ID without the '#' character
      const targetElement = document.getElementById(targetId);
      // Only proceed if a target element exists
      if (targetElement) {
        // Find the parent paragraph of the target element
        const targetParentParagraph = targetElement.closest('p');
        if (targetParentParagraph) {
          // Check if any reverse links with href starting with "#link" already exist in the target paragraph
          const reverseLinkExists = Array.from(targetParentParagraph.querySelectorAll('a.reverse-link'))
            .some(
              (existingLink) => existingLink.getAttribute('href').startsWith('#link')
            );
          // Check if any reverse links with href starting with "#link" already exist in the target paragraph
          if (reverseLinkExists) {
            if (!link.classList.length) {
              if (!linkobj[link.hash]) {
                linkobj[link.hash] = `#link-${linkCounter}`
              }
            }
 
          }
      if (!reverseLinkExists) {
            // Create a reverse reference link only if it doesn't exist
            const paragraphsWithAnchor = document.querySelectorAll('.references p');
            paragraphsWithAnchor.forEach((paragraph) => {
              // Check if the paragraph contains an <a> tag
              const anchor = paragraph.querySelector('a');
              if (anchor) {
                console.log("if anchor ", anchor)
                // Extract the citation number (the part before the first period in the text)
                const citationText = paragraph.textContent.split('.')[0] + '.';
                console.log("xxx", paragraph.textContent);
                // Set the inner HTML of the anchor tag to include the number
                anchor.innerHTML = citationText;
                // Dynamically set the 'href' and 'class' attributes
                console.log("link: ", `#${link.id}`)
                anchor.href = `#${link.id}`;
                anchor.classList.add('reverse-link');
                if ((links.length - 1) === ind) {
                  let originalString = paragraph.innerHTML;
                  console.log('originalString', originalString)
                  let result = originalString.slice(0, 74) + '' + originalString.slice(76);
                  paragraph.innerHTML = result;
                }
                paragraph.innerHTML = paragraph.innerHTML.replace(citationText + '.', ''); // Remove only the citation number with period
              }
 
            })
          }
        }
      }
    }
 
  });
  let obj = linkobj;
  // Iterate over each key-value pair in the object
  for (let key in obj) {
    // Get the bookmark element using the key (e.g., #bookmark-2)
    let bookmarkElement = document.querySelector(key);
    // Get the link element using the value (e.g., #link-2)
    // If both elements are found, set the href of the bookmark to the href of the link
    bookmarkElement.href = obj[key];
  }
}
 
 
 
 
/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateLinks(main);
}
 
/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
 
  sampleRUM.enhance();
 
  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}
 
/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);
 
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
 
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));
 
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}
 
/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}
 
async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}
 
loadPage();
