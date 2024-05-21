export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`hackathon-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('hackathon-img-col');
        }
      }
      const text = col.querySelector('p');
      if (text) {
        const textWrapper = text.closest('div');
        if (textWrapper) {
          textWrapper.classList.add('hackathon-text-col');
        }
      }
    });
  });
}
