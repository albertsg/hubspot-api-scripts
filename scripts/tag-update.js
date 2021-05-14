/** 
* @author: Albert Soriano
* This script retrieves all blog posts that meet specific criteria and adds a new tag.
* @param {string} accountKey API key for your account.
* @param {int} limit Limit of elements in the response (default 20, maximum 300).
* @param {int} offset Since a call to Hubspot's API can only retrieve 300 articles, we will increase the offset to make sure we get different blogs in the next call
* @param {string} domainURL To differenciate between domains using the Blog URL since the API retrieves all posts in the account (just in case you have multiple domains under the same account).
* @param {boolean} isEnd To indicate if all blog posts have been retrieved or not
* @param {array} blogs Array that includes all the blog posts (objects) that passed a specific filter defined by the developer
* @param {int} newTagId Number that references the tag ID of the tag we will add to the selected blogs.
*/

const accountKey = 'your-account-key'
const limit = 300 // Hubspot limit per request is set to 300
var offset = 0;
const domainURL = 'yourwebsite.com' // '/something/', 'yourwebsite.com/blog/', '/blog.yourwebsite.com/', etc.
var isEnd = false
let blogs = []
const newTagId = 0




var request = require("request");

callApi()


/**
 * callApi Executes a call to Hubspot's API en processes the data
 */
function callApi(){


  var options = {
  method: 'GET',
    url: 'https://api.hubapi.com/cms/v3/blogs/posts',
    qs: {hapikey: accountKey, limit: limit, offset: offset},
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


/**
 * checkIfFurtherNeeded Evaluates if another call to the API is needed or if we can start adding the tag
 */
function checkIfFurtherNeeded() {
  if(!isEnd){
    callApi()
  }else{
    updateHubTags()
    console.log(`----------------- +${offset} articles checked -----------------`)
  }
}

/**
 * updateHubTags Evaluates is a blog post includes the tag to be added and calls the function to do it
 */
function updateHubTags() {
  blogs.forEach(post =>{
    if(!post.tagIds.includes(newTagId)){
      UpdateTag(post)
    } 
  }) 
}


/**
 * UpdateTag Executes a call to Hubspot's API en processes the data
 * @param  {Object} blog This object includes the information of the blog post where we will add the tag
 */
function UpdateTag(blog){

  //Update a blog post
  var request = require("request");
  
  blog.tagIds.push(newTagId) //Add new tag to the array of tag

  var options = {
    method: 'PATCH',
    url: `https://api.hubapi.com/cms/v3/blogs/posts/${blog.id}`,
    qs: {hapikey: accountKey},
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: {
      tagIds: blog.tagIds
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(`Article ${blog.htmlTitle} updated`);
  });
}









































//Get all blog posts
var request = require("request");

var options = {
  method: 'GET',
  url: 'https://api.hubapi.com/cms/v3/blogs/posts',
  qs: {hapikey: accountKey, limit: limit, offset: offset},
  headers: {accept: 'application/json'}
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  const res = JSON.parse(response.body) 
  const posts = res.results 

  posts.forEach(element => {
    offset++ //Since Hubspot has a limit of objects per call, we increase the offset to not repeat elements in each call
    if(element.url.includes(domainURL)){
      blogs.push(element) //Storing posts in our blog variable
    }
  });


  blogs.forEach(post => {
    if(!post.tagIds.includes(newTagId)){  //Add here any condition to meet, for example if the tag doesn't exist, etc
      UpdateTag(post)
    }
  })
    
});


//Update all blog posts that meet the previous criteria with the new tag
function UpdateTag(blog){
 
  var request = require("request");
  
  blog.tagIds.push(newTagId) //Add new tag to the array of tags

  var options = {
    method: 'PATCH',
    url: `https://api.hubapi.com/cms/v3/blogs/posts/${blog.id}`,
    qs: {hapikey: accountKey},
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: {
      tagIds: blog.tagIds
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(`Article ${blog.htmlTitle} updated`);
  });
}