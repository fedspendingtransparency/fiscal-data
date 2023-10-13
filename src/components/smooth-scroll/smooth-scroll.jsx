if (typeof window !== 'undefined') {
  import('smoothscroll-polyfill').then(smoothScroll => {
    smoothScroll.polyfill();
  });
}

export class SmoothScroll {
  onLinkClick = (e, offset = 0) => {
    if (typeof window !== 'undefined') {
      e.preventDefault();

      let target = e.srcElement;

      while (target.nodeName !== 'A') {
        target = target.parentNode;
      }

      const targetSelector = target.getAttribute('href');
      const targetElement = document.querySelector(targetSelector);

      const y = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    }
  };

  attachClickHandlers = (el, offset) => {
    const self = this;
    const scrollToEls = el;

    const attachEvent = curEl => {
      curEl.addEventListener('click', function(e) {
        self.onLinkClick(e, offset);
      });
    };

    if (scrollToEls) {
      if (scrollToEls.length) {
        for (let i = scrollToEls.length; i--; ) {
          attachEvent(scrollToEls[i]);
        }
      } else {
        attachEvent(scrollToEls);
      }
    }
  };
}
