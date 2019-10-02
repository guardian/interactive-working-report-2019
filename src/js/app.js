structureDoc();

function structureDoc() {
  createArticleWrapper();
  createSections();
}

function createArticleWrapper() {
  let articleWrapper = document.createElement("div");

  articleWrapper.classList.add("working-report__wrapper");

  let beginMoving = false;
  let wholePage = document.querySelectorAll('body > *');
  wholePage.forEach(function (el) {
    if (!beginMoving && el.classList.contains('element-atom')) {
      beginMoving = true;
    }
    if (beginMoving && el.classList.contains('l-footer')) {
      beginMoving = false;
    }
    if (beginMoving === true) {
      articleWrapper.appendChild(el);
    }
  });

  document.body.insertBefore(articleWrapper, document.querySelector('.l-footer'))

}

function createSections() {
  let wr = document.querySelector('.working-report__wrapper');
  let wrSections = wr.querySelectorAll('blockquote');
  let sectionNum = 0;
  wrSections.forEach(function (el) {
    sectionNum++;
    let newSection = document.createElement('div');
    newSection.classList.add('working-report__section__inner');
    while (el.nextElementSibling != null && el.nextElementSibling.tagName != 'BLOCKQUOTE' && !el.nextElementSibling.classList.contains('working-report__section')) {
      newSection.appendChild(el.nextElementSibling);
    }
    let newSectionWrapper = document.createElement('div');
    newSectionWrapper.classList.add('working-report__section');
    newSectionWrapper.appendChild(el);
    newSectionWrapper.appendChild(newSection);
    let sectionClass = el.innerText.split(' | ')[0]
      .replace(/[1-9]/g, '').trim()
      .toLowerCase().replace(/\s+/g, '-');
    newSectionWrapper.classList.add(sectionClass);
    newSectionWrapper = sectionMods(newSectionWrapper, sectionNum);
    wr.appendChild(newSectionWrapper)

  });
}

function sectionMods(s, n) {
  let separator = s.querySelector('blockquote');
  separator.classList.add('section-header');
  let title = s.querySelector('h2');
  let titleText = title.innerText.split(' | ');
  title.innerHTML = '<span>' + titleText[0].split(' ').join('</span> <span>') + '</span>';

  if (titleText.length > 1) {
    let subTitle = document.createElement('h3');
    subTitle.innerText = titleText[1];
    separator.appendChild(subTitle);
  }

  let sectionNumber = document.createElement('div');
  sectionNumber.classList.add('section-number');
  sectionNumber.innerText = n;
  separator.appendChild(sectionNumber);
  return s;
}