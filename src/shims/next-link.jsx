import React from 'react';

function formatHref(href) {
  if (href == null) return '';
  if (typeof href === 'string') return href;

  const pathname = href.pathname ?? '';
  const query = href.query
    ? `?${new URLSearchParams(href.query).toString()}`
    : '';
  const hash = href.hash ? String(href.hash) : '';

  return `${pathname}${query}${hash}`;
}

export default function Link({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  legacyBehavior,
  passHref,
  children,
  ...props
}) {
  const anchorHref = formatHref(as ?? href);

  if (legacyBehavior && React.isValidElement(children)) {
    return React.cloneElement(children, {
      href: passHref ? anchorHref : children.props.href ?? anchorHref,
      ...props,
    });
  }

  return (
    <a href={anchorHref} {...props}>
      {children}
    </a>
  );
}
