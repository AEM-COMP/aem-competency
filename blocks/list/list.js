import {
  fetchSearch,
} from '../../scripts/scripts.js';

const getListHTML = (row) => 
              '<a href="#"><picture class="thumbnail"><img src="https://drive.google.com/thumbnail?id=1vTSLiYzLI0YgDkpcm80kW37jwaQjH6SW" alt="A banana that looks like a bird"></picture></a><div class="card-content"><h2>StoryBuilder.AI Acceptance Criteria Generation App</h2><p>An innovative app tailored for agile teams and product owners, powered by GPT-4, designed to revolutionize the creation of Acceptance…</p><div><span>Public</span><span>Owner: Arif Ali</span><span>Status: Completed</span></div><div><span>Generative AI</span><span>Content Management</span><span>Web3</span><span>+9</span></div><a href="#">Join</a></div>';

async function printList(list) {
    
  const div = document.createElement('div');
  div.classList.add('container');
  div.innerHTML = '<div class="title"><h2>Big Bets</h2><h1>Technological Innovations Transforming Work Effectiveness</h1></div>';

  const section = document.createElement('section');
  section.classList.add('cards');

  list.forEach((row) => {
      const article = document.createElement('article');
      article.classList.add('card');
      article.innerHTML = getListHTML(row);
      section.append(article);
  });
  div.append(section);
  return div;
}

export default async function decorate(block) {
  const list = await fetchSearch();
  block.textContent = '';
  const objects = await printList(list);
  block.append(objects);
}
