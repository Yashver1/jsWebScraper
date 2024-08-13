import fetchHTMLRecursive from "./crawl.js";
import { argv } from "node:process";
import printReports from "./report.js";

async function main() {
  if (argv.length < 3 || argv.length > 3) {
    throw Error("Invalid arguements");
  } else {
    console.log("Fetching Urls...");
    const url = argv[2];
    const pages = await fetchHTMLRecursive(url, url);
    console.log("Fetching complete, populating txt...");
    printReports(pages);
  }
}

await main();
