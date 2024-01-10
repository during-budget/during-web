import { css } from '@emotion/react';
import { PropsWithChildren, useEffect } from 'react';

const DIVIDER = '-';
const SLIDE_ID = 'slide';
const NAV_ID = 'nav';

interface CarouselProps {
  id: string;
  initialIndex?: number;
  containerClassName?: string;
  itemClassName?: string;
}

const listScrollStyle = css({
  scrollSnapType: 'x mandatory',
  scrollBehavior: 'smooth',
});

const itemScrollStyle = css({
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
});

const navButtonClass = '';

function Carousel({
  id: carouselId,
  initialIndex,
  containerClassName,
  itemClassName,
  children,
}: PropsWithChildren<CarouselProps>) {
  const carouselItems = Array.isArray(children) ? children : [children];

  const slideIdPrefix = `${carouselId}${DIVIDER}${SLIDE_ID}${DIVIDER}`;
  const navIdPrefix = `${carouselId}${DIVIDER}${NAV_ID}${DIVIDER}`;

  const observer = getObserver('.js-carousel-item');

  useEffect(() => {
    // initiate scroll
    const currentIdx = initialIndex || 0;
    scrollCarouselTo(currentIdx);
    toggleActive(currentIdx);

    // initiate observer
    document.querySelectorAll('.js-carousel-item').forEach((item) => {
      observer.observe(item);
    });
  }, []);

  return (
    <section className={`flex-column i-center ${containerClassName}`}>
      <ol className="flex w-100 scroll scroll-x" css={listScrollStyle}>
        {carouselItems!.map((item: any, index: number) => {
          const id = `${slideIdPrefix}${index}`;
          return (
            <li
              key={id}
              id={id}
              className={`js-carousel-item flex-column j-around i-center shrink-0 w-100 ${itemClassName}`}
              css={itemScrollStyle}
            >
              {item}
            </li>
          );
        })}
      </ol>
      <nav className="js-carousel-nav flex j-around">
        {carouselItems!.map((_: any, index: number) => {
          return (
            <button
              key={index}
              id={`${navIdPrefix}${index}`}
              className="mx-0.625 border-none round-full bg-gray-0"
              css={{ width: '0.5rem', height: '0.5rem' }}
              onClick={(event) => {
                event.preventDefault();
                scrollCarouselTo(index);
              }}
            ></button>
          );
        })}
      </nav>
    </section>
  );
}

const getObserver = (selector: any) => {
  return new IntersectionObserver(
    (entries) => {
      const activated = entries.reduce((max, entry) => {
        const entryRatio = entry.intersectionRatio;
        const maxRatio = max.intersectionRatio;
        return entryRatio > maxRatio ? entry : max;
      });

      if (activated.intersectionRatio > 0) {
        const activatedId = activated.target.getAttribute('id');
        const currentIdx = getNavIndexById(activatedId!);
        toggleActive(currentIdx);
      }
    },
    {
      root: document.querySelector(selector),
      rootMargin: '0px',
      threshold: 0.5,
    }
  );
};

const toggleActive = (currentIdx: number) => {
  const navItems = document.querySelectorAll(`.js-carousel-nav button`);
  for (const target of navItems) {
    if (currentIdx === getNavIndexById(target.id)) {
      target.className = `${target.className} cursor-inherit bg-primary`;
    } else {
      target.className = target.className.split('cursor-inherit')[0];
    }
  }
};

const getNavIndexById = (id: string) => {
  const ids = id.split(DIVIDER);
  return +ids[ids.length - 1];
};

const scrollCarouselTo = (index: number) => {
  const item = document.querySelectorAll('.js-carousel-item')[index];
  item.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
    inline: 'center',
  });
};

export default Carousel;
