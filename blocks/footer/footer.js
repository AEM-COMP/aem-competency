import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const ul= footer.querySelectorAll('.default-content-wrapper>ul');
  const container= document.createElement('div');
  const containerLine = document.createElement('div');
  const containerElement = document.createElement('div');
  container.classList.add('footerLink');
  containerElement.classList.add('footerElement');
  container.append(containerLine);
  container.append(containerElement);
  
  containerLine.classList.add('footerLine');

  containerElement.append(ul[1]);
  containerElement.append(ul[2]);
  footer.querySelector('.default-content-wrapper').append(container);
  block.append(footer);
}
