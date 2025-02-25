import { getQueryList } from '../../scripts/common.js';
import {
  a, div, li, ul, img, h5, p,
} from '../../scripts/dom-helpers.js';
import { capitalizeEveryWord } from '../categories/categories.js';

export async function renderBlockList(block, items) {
  block.querySelectorAll('.blog-card').forEach((element) => element.remove());
  block.firstElementChild.append(
    ...items.map((eachData) => {
      const imgSrc = (window.location.href.includes('localhost') || window.location.href.includes('.aem.live')) ? eachData.image.replace('/content/dam/arb/arb-blogs/', '/images/') : eachData.image;
      return div(
        { class: 'blog-card' },
        div({ class: 'blog-card-img' }, img({ src: imgSrc, alt: 'blog-list-img' })),
        div(
          { class: 'blog-card-content' },
          div(
            div(
              { class: 'blog-card-tags' },
              ul(...eachData.tag.split(',').map((eachTag) => (li(capitalizeEveryWord(eachTag.split('/')[1]))))),
            ),
            div({ class: 'blog-card-description' }, h5(eachData.title || '-'), p(eachData.description)),
          ),
          div({ class: 'blog-card-btn' }, a({ href: eachData.path }, 'Read More')),
        ),
      );
    }),
  );
  return block;
}

export default async function decorate(block) {
  const list = await getQueryList();
  const url = new URL(window.location.href);
  const path = url.pathname.split('/').slice(3).join('').replace('/', '');
  const items = list
    .filter((eachList) => (!eachList.path.endsWith(path) && eachList.tag?.includes(path)));
  renderBlockList(block, items);
}
