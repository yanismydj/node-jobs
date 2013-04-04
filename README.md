Node Jobs is a node.js server/front end for created resque or sidekiq jobs.  Sometimes you just need to quickly create jobs from incoming data, and don't need to run the whole rails stack, and this allows you to create new jobs at a blistering pace.

# install dependencies
`npm install`

# start the server
`foreman start`

# fire ze missiles
`curl -d '{ "jobs":"0[latitude]=1&0[longitude]=2&1[latitude]=1&1[longitude]=2", "phone_number":"708-409-1270", "app_key":"123"}' -H 'content-type:application/json' "http://localhost:5000/create"`
