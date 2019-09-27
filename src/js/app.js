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
  var wr = document.querySelector('.working-report__wrapper');
  let wrSections = wr.querySelectorAll('blockquote');
  wrSections.forEach(function (el) {
    let newSection = document.createElement('div');
    newSection.classList.add('working-report__section__inner');
    while (el.nextElementSibling != null && el.nextElementSibling.tagName != 'BLOCKQUOTE' && !el.nextElementSibling.classList.contains('working-report__section')) {
      newSection.appendChild(el.nextElementSibling);
    }
    let newSectionWrapper = document.createElement('div');
    newSectionWrapper.classList.add('working-report__section');
    newSectionWrapper.appendChild(el);
    newSectionWrapper.appendChild(newSection);
    let sectionClass = el.innerText.split(' | ')[0].trim()
      .replace(/\s+/g, '-').replace('/[^a-zA-Z-]/g', '').toLowerCase();
    newSectionWrapper.classList.add('section__' + sectionClass);
    wr.appendChild(newSectionWrapper)

  });
}