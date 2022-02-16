/** 
* @author: Albert Soriano
* This script updates the domain of different pages in Hubspot. This is very useful for content migration.
* @param {string} accountKey API key for your account.
* @param {int} limit Limit of elements in the response (default 20, maximum 300).
* @param {int} offset Since a call to Hubspot's API can only retrieve 300 articles, we will increase the offset to make sure we get different blogs in the next call
* @param {string} current_domain Current domain of the pages we want to update
* @param {string} new_domain New domain for the pages we want to update
* @param {boolean} isEnd To indicate if all blog posts have been retrieved or not
* @param {array} pages Array that includes all the pages (objects) 
* @param {string} page_id ID of the page to update
**/
const apiKey = 'your-key-here'
const limit = 300 // Hubspot limit per request is set to 300
var offset = 0;
const current_domain = 'olddomain.com' // Current domain used in pages
const new_domain = 'newdomain.com' //New domain for pages
var isEnd = false
let pages = []
let page_id = '0' //Page ID of the page to be updated

var request = require("request");


callApi()

/*
Does the request to the API
*/
function callApi(){


  let options = {
  method: 'GET',
    url: 'https://api.hubapi.com/content/api/v2/pages',
    qs: {hapikey: apiKey, limit: limit, offset: offset},
    headers: {accept: 'application/json'}
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const res = JSON.parse(response.body)
    
    isEnd = res.objects.length === 300 ? false : true

    console.log(`Number of pages --> ${res.objects.length}`)
    res.objects.forEach(element => {
        offset++
        if(element.domain.includes(current_domain)){
            pages.push(element)  
        }
    });

    checkIfFurtherNeeded();

  });
}

/*
Checks if all pages has been checked or if it requires further checking
*/
function checkIfFurtherNeeded() {
  if(!isEnd){
    callApi()
  }else{
    console.log(`Pages length -> ${pages.length}`)
    console.log(`----------------- +${offset} pages checked -----------------`)
    updatePages()
  }
}

/*
Updates the domain in every page of the pages array
*/
function updatePages(){
    pages.forEach(page => {

        let options = {
            method: 'PUT',
            url: `https://api.hubapi.com/content/api/v2/pages/${page.id}`,
            qs: {hapikey: apiKey},
            headers: {accept: 'application/json'},
            body: {
                domain: new_domain
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(`Page with ID ${page.id} has been updated`); 
        });


    });
}