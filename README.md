# Hubspot API scripts

The scripts contained in the <i>scripts</i> folder will help you doing different tasks with Hubspot's API

<h2>Requirements</h2>

To be able to use the script, you will need:

<ul>
    <li>NodeJS installed. You can install it from <a href="https://nodejs.org/es/" target="_blank">this link</a>.</li>
    <li>A <a href="https://www.hubspot.com/" target="_blank">Hubspot</a> account.</li>
    <li>An API key from your Hubspot account. Follow <a href="https://knowledge.hubspot.com/integrations/how-do-i-get-my-hubspot-api-key" target="_blank">this link</a> for more information.</li>
</ul>

<h2>How to run a script</h2>

In order to run a script, access to your terminal and run ``` node script-name.js ```.
Please note that the script might take some time to run, depending on the number of calls and data required.


<h2>Scripts</h2>

<h3>Add a tag to a blog post</h3>
If you need to add a tag to multiple blog post, you can use the script <a href="scripts/tag-update.js">tag-update.js</a>.

This script will call the API as many times as needed to retireve ALL blog posts from your account (API is limited to 300 posts per call) and, once all information from the posts is processed and stored, it will call the API for every blog post in order to add the new tag.

The script controls if the blog already has the tag, to avoid unnecesary calls.

Make sure you update the constant <b>accountKey</b> with your API key.
The constant <b>domainURL</b> is optional and only required if you have more than one domain/locale in your account. 


<h3>Update tags information</h3>
Using the script <a href="scripts/blog-tags.js">blog-tags.js</a> you will be able to update the name of several tags at once.

This script will call the API as many times as needed to retireve ALL tags from your account and will update all the tags that are not specified into <b>goodTags</b> according to your needs.

Make sure you update the constant <b>apiKey</b> with your API key.

<h3>Update page domain</h3>
By running the script <a href="scripts/domain-update.js">domain-update.js</a> you will be able to update the domain of multiple landing pages at once.
This script is extremely useful while migrating content from one domain to another, specially in accounts with multiple domains or when you have to migrate the domain is many pages (the only way to achieve this using Hubspot's UI is by manually changing the domain of each page).

This script will call the API as many times as needed to retireve ALL pages from your account and will update the domain.

Make sure you update the constant <b>apiKey</b> with your API key.


<hr />

<b> Please consider giving a :star: to this repository if it helped you. </b>


