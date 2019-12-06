

function checkExists(startAtomFunction) {
  var checkInterval = setInterval(function () {
    if (document.body.innerText.indexOf('The Guardian App') > 0) {
      startAtomFunction();
      clearInterval(checkInterval);
    }
  }, 100);
}

checkExists(structureDoc);


function structureDoc() {
  fixLoResImage();
  createArticleWrapper();
  createSections();
  createNav();
  tagIllustrations();
}

function fixLoResImage() {
  let immImgs = document.querySelectorAll('.element--immersive img');
  immImgs.forEach(function (i) {
    let loSrc = i.getAttribute('src');
    let hiSrc = loSrc.replace('1000.jpg', '2000.jpg');
    let hhSrc = loSrc.replace('1000.jpg', '3000.jpg');
    i.setAttribute('srcset', loSrc + ' 1000w, ' + hiSrc + ' 2000w, ' + hhSrc + ' 3000w');
  });
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

  document.body.insertBefore(articleWrapper, document.querySelector('.l-footer'));

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
    newSectionWrapper.dataset.section = sectionClass;
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


function createNav() {
  let nav = document.createElement('div');
  nav.classList.add('working-report__nav');
  let navInner = document.createElement('div');
  navInner.classList.add('working-report__nav__inner');
  nav.appendChild(navInner);

  let wrapper = document.querySelector('.working-report__wrapper');
  let sections = wrapper.querySelectorAll('.working-report__section');
  sections.forEach(function (section) {
    let navSection = document.createElement('div');

    navSection.innerHTML = '<span class="label">' + section.querySelector('h2').innerText.replace(/\n/g, ' ') + '</span > <span class="marker"></span>';
    navSection.classList.add('working-report__nav__section');
    navSection.dataset.sectionClass = section.dataset.section;

    navInner.appendChild(navSection);
  });

  let overlay = document.createElement('div');
  overlay.classList.add('overlay');
  nav.appendChild(overlay);

  wrapper.appendChild(nav);

  setNavEvents()
}

function setNavEvents() {

  // Highlight current section on scroll
  window.addEventListener('scroll', function () {
    let s = getCurrentSection(0);
    let n = getCurrentSection(-0.67 * window.innerHeight);

    // highlight in nav
    if (s) {
      let navSection = document.querySelector('[data-section-class="' + s.dataset.section + '"]');
      if (!navSection.classList.contains('current')) {
        let prevSection = document.querySelector('.working-report__nav__section.current');
        if (prevSection) {
          prevSection.classList.remove('current');
        }
        navSection.classList.add('current');
      }
    }

    // highlight in content
    if (window.pageYOffset <= 0) {
      document.querySelectorAll('.working-report__section').forEach(function (s) {
        s.classList.remove('seen');
      })
    }
    if (n) {
      let section = document.querySelector('.working-report__section.' + n.dataset.section);
      section.classList.add('seen');
    }



  });

  // Scroll there on clicks
  let navSections = document.querySelectorAll('.working-report__nav__section');
  navSections.forEach(function (s) {
    s.addEventListener('click', function () {
      let sClass = s.dataset.sectionClass;
      let sWrapper = document.querySelector('.working-report__section.' + sClass);
      let sWrapperTop = sWrapper.offsetTop - 36;
      scrollTo(sWrapperTop);
    })
  });

}

function getCurrentSection(offset) {
  let sections = document.querySelectorAll('.working-report__section');
  let sectionsArr = [].slice.call(sections).reverse();

  let currentSection = false;

  for (let section of sectionsArr) {
    if (section.getBoundingClientRect().top + offset - 60 < 0) {
      currentSection = section;
      break;
    }
  }

  return currentSection;

}


function scrollTo(to) {
  let duration = 600;
  const element = document.scrollingElement;
  const start = (element && element.scrollTop) || window.pageYOffset,
    change = to - start,
    increment = 20;
  let currentTime = 0;

  duration = Math.max(240, (Math.sqrt(Math.abs(change)) * 4));

  const animateScroll = function () {
    currentTime += increment;
    const val = Math.easeInOutQuad(currentTime, start, change, duration);
    window.scrollTo(0, val);
    if (currentTime < duration) {
      window.setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}


Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

function tagIllustrations() {
  let allImages = document.querySelectorAll('.element-image');
  let illustrationIds = [
    '181a2210176471fda23ea5a0a5e67f2ef5b22634', '12c4d52c647fb04442104e7b793afc4efa15d4ca',
    'a89e35e11cc4fedd5ad787e2ae456ef100a01a6a'];

  allImages.forEach(function (i) {
    if (illustrationIds.indexOf(i.dataset.mediaId) >= 0) {
      i.classList.add('element--illustration');
    }
  });
}
