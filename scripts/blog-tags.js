/** 
* @author: Albert Soriano
* This script retrieves all tags from a specific domain in a Hubspot account and updates some of them according to the user's needs.
* @param {string} apiKey API key for the Hubspot account.
* @param {int} limit Limit of elements in the response (default 20, maximum 300).
* @param {string} domainURL To differenciate between domains using the Blog URL since the API retrieves all posts in the account.
* @param {array} blogs Array that includes all the blog posts (objects) that passed a specific filter defined by the developer
* @param {array} tags Array that includes all the tags (IDs) that passed a specific filter defined by the developer
* @param {array} goodTags Array that includes all the tags (names) that will be excluded from the update
* @param {array} finalTags Array that includes all the updated tags (names)
**/

const apiKey = 'your-api-key'
const limit = 300 
var offset = 0;
const domainURL = 'your-domain.com' 
var isEnd = false
var blogs = []
var tags = []
var goodTags = ['Tag name 1','Tag name 2','Tag name 3']

var finalTags = []

var request = require("request");

callApi()


/*
Does the request to the API
*/
function callApi(){


  let options = {
  method: 'GET',
    url: 'https://api.hubapi.com/cms/v3/blogs/posts',
    qs: {hapikey: apiKey, limit: limit, offset: offset},
    headers: {accept: 'application/json'}
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const res = JSON.parse(response.body)
    const posts = res.results

    isEnd = posts.length === 300 ? false : true

    posts.forEach(element => {
      offset++
      if(element.url.includes(domainURL)){
        blogs.push(element)
      }
    });
      
    checkIfFurtherNeeded();

  });
}

/*
Checks if all articles has been checked or if it requires further checking
*/
function checkIfFurtherNeeded() {
  if(!isEnd){
    callApi()
  }else{
    updateHubTags()
    console.log(`----------------- +${offset} articles checked -----------------`)
  }
}

/*
Adds all unique tags into an array
*/
function updateHubTags() {
  blogs.forEach(post =>{

       post.tagIds.forEach(tag =>{
        if (!tags.includes(tag)){
            tags.push(tag)
        }
       })
  }) 
  console.log(`${tags}`)
  console.log('-------------------------------------------------')
  tags.forEach(tag=>{
    tagCheck(tag)
  })
}

/*
Get tag names by doing requests based on Tag ID
*/
function tagCheck(tag) {

    let options = {
        method: 'GET',
        url: `https://api.hubapi.com/cms/v3/blogs/tags/${tag}`,
        qs: {hapikey: apiKey},
        headers: {accept: 'application/json'}
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);


    const res = JSON.parse(body)
    const tagname = res.name
    if(!tagname.startsWith('#') && !goodTags.includes(tagname)){
        let newTag = `add-here-new-tag-name-${tagname}`
        finalTags.push(newTag.replace(/\s+/g, '-').toLowerCase())
        console.log(tagname)

         UpdateTag(newTag.replace(/\s+/g, '-').toLowerCase(), tag)
    }
    });
}

/*
Update the tag name with the new one
*/
function UpdateTag(finalTag, tagId){
    let options = {
        method: 'PATCH',
        url: `https://api.hubapi.com/cms/v3/blogs/tags/${tagId}`,
        qs: {hapikey: apiKey},
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: {
            name: finalTag
        },
        json: true
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body); //Tag updated info
    });
}