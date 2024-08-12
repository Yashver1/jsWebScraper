import { JSDOM } from 'jsdom'
import path, { normalize } from 'node:path';
import { argv } from 'node:process'


const normaliseUrl = (link) => { //just to check if base url is the same as host
   const url = new URL(link);
   let path = url.pathname
   if(url.pathname.slice(-1) == "/"){
        path = url.pathname.slice(0,-1);
   }
    return `${url.hostname}${path}`
} 

const retrieveUrl = (baseUrl,html) => {
    const urls = []
    const dom = new JSDOM(html)
    dom.window.document.querySelectorAll("a").forEach(element => {
        try {
            if(element.hasAttribute("href")){
                let url = new URL(element.href,baseUrl).href
                if(normaliseUrl(url)!=normaliseUrl(baseUrl)){
                    urls.push(url)
                }
            }
        } catch(err){
            console.log(`${err},${element.href}`)
        }
   });
   return urls
}

const fetchHTML = async (url) => {
    try {
        const response = await fetch(url);
        if(response.status >= 400){
            throw Error(`Server returned with status code: ${response.status}`)
        }
        if(!response.headers.get("Content-Type").startsWith("text/html")){
            throw Error(`Server returned with invalid content-type`)
        }
        const data = await response.text()
        return data
    } catch (err) {
        console.log(err.message)
    }
}

const fetchHTMLRecursive = async (currentUrl,baseUrl,paths={}) =>{

    
    const html = await fetchHTML(currentUrl)
    const urls = retrieveUrl(currentUrl,html)
    let baseUrlObj = new URL(baseUrl)

    for(let url of urls){

        let currentUrlObj = new URL(url)

        if(currentUrlObj.hostname !== baseUrlObj.hostname){
            continue
        }

        let normalisedUrl = normaliseUrl(url)
        if(paths[normalisedUrl] > 0){
            paths[normalisedUrl]++
            continue
        } else {
            paths[normalisedUrl] = 1
            await fetchHTMLRecursive(url,baseUrl,paths)
        }

    }

    return paths

}


async function main(){
    if (argv.length < 3 || argv.length > 3){
        throw Error("Invalid arguements")
    } else {
        console.log("Fetching Urls...")
        const url = argv[2]
        console.log(await fetchHTMLRecursive(url,url)) 
        console.log("Fetching complete, populating txt...")
    }

}

await main()

export default normaliseUrl


// PROBLEM IS THe / TAG IN  THE WEBSITE is needed for linke back but in the main page its present