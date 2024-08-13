import { JSDOM } from "jsdom";
import { url } from "node:inspector";
import path, { normalize } from "node:path";
import { argv } from "node:process";

const normaliseUrl = (link) => {
  //just to check if base url is the same as host
  const url = new URL(link);
  let path = url.pathname;
  if (url.pathname.slice(-1) == "/") {
    path = url.pathname.slice(0, -1);
  }
  return `${url.hostname}${path}`;
};

const retrieveUrl = (baseUrl, html) => {
  const urls = [];
  const dom = new JSDOM(html);
  dom.window.document.querySelectorAll("a").forEach((element) => {
    try {
      if (element.hasAttribute("href")) {
        let url = new URL(element.href, baseUrl).href;
        urls.push(url);
      }
    } catch (err) {
      console.log(`${err},${element.href}`);
    }
  });
  return urls;
};

const fetchHTML = async (url) => {
  try {
    const response = await fetch(url);
    if (response.status >= 400) {
      throw Error(`Server returned with status code: ${response.status}`);
    }
    if (!response.headers.get("Content-Type").startsWith("text/html")) {
      throw Error(`Server returned with invalid content-type`);
    }
    const data = await response.text();
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const fetchHTMLRecursive = async (currentUrl, baseUrl, paths = {}) => {
  const currentUrlObj = new URL(currentUrl);
  const baseUrlObj = new URL(baseUrl);

  if (currentUrlObj.host !== baseUrlObj.host) {
    return;
  }

  const normalisedUrl = normaliseUrl(currentUrl);

  if (normalisedUrl in paths) {
    paths[normalisedUrl]++;
    return;
  } else {
    paths[normalisedUrl] = 1;
  }

  console.log(`fetching ${currentUrl}`);

  let html = "";
  try {
    html = await fetchHTML(currentUrl);
  } catch (err) {
    console.log(err.message);
  }

  const urls = retrieveUrl(baseUrl, html);
  for (let url of urls) {
    await fetchHTMLRecursive(url, baseUrl, paths);
  }

  return paths;
};

export default fetchHTMLRecursive;
