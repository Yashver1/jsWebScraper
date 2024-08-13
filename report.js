const printReports = (pages) => {
  const sortedPages = sortLinks(Object.keys(pages));
  sortedPages.forEach((page) => {
    console.log(`Found ${pages[page]} internal links to ${page}`);
  });
};

const sortLinks = (links) => {
  if (links.length <= 1) {
    return links;
  }

  const linksCount = links.length;
  let left = links.slice(0, Math.floor(linksCount / 2));
  let right = links.slice(Math.floor(linksCount / 2) + 1);

  left = sortLinks(left);
  right = sortLinks(right);
  return mergeLinks(left, right);
};

const mergeLinks = (left, right) => {
  const sortedLinks = [];

  let l = 0;
  let r = 0;

  while (l < left.length && r < right.length) {
    if (left[l].length <= right[r].length) {
      sortedLinks.push(left[l]);
      l++;
    } else if (left[l].length > right[r].length) {
      sortedLinks.push(right[r]);
      r++;
    }
  }

  if (l < left.length) {
    sortedLinks.push(...left.slice(l));
  } else if (r < right.length) {
    sortedLinks.push(...right.slice(r));
  }

  return sortedLinks;
};

export default printReports;
