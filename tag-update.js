/*
@author: Albert Soriano
This script retrieves all blog posts that meet specific criteria and adds a new tag.
@param {string} accountKey API key for your account.
@param {int} limit Limit of elements in the response (default 20, maximum 300).
@param {string} domainURL To differenciate between domains using the Blog URL since the API retrieves all posts in the account (just in case you have multiple domains under the same account).
@param {array} blogs Array that includes all the blog posts (objects) that passed a specific filter defined by the developer
@param {int} newTagId Number that references the tag ID of the tag we will add to the selected blogs.
*/


const hubspot = require('@hubspot/api-client');
const { post } = require('request');
const accountKey = 'your-account-key'
const limit = 300 // Hubspot limit per request is set to 300
const domainURL = 'yourwebsite.com' // '/something/', 'yourwebsite.com/blog/', '/blog.yourwebsite.com/', etc.
let blogs = []
const newTagId = 0

//Get all blog posts
var request = require("request");

var options = {
  method: 'GET',
  url: 'https://api.hubapi.com/cms/v3/blogs/posts',
  qs: {hapikey: accountKey, limit: 300},
  headers: {accept: 'application/json'}
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  const res = JSON.parse(response.body) 
  const posts = res.results 

  posts.forEach(element => {
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