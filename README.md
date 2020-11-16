# Samosabucket

The purpose of this project is to implement a fully functional online restaurant ordering, order and product management website, that allows users to place orders and track their order from the `cooking` to the `delivered` stage. We will develop an aesthetic frontend experience that will enable users to quickly navigate desired menu items to choose from.

## Team Members

1. Aan Patel <aanpatel.tech@gmail.com>
2. Shaswat Joshi <joshishaswat@gmail.com>

## Tech Stack

1. Bulma CSS
2. ReactJS
3. Node and Express (Backend, with `cors`,`cookie-parser`, `uuid` used as middleware)
4. MongoDB Atlas (Cloud MongoDB instance)
5. Cloudinary (Image uploads)
6. Positionstack (Address autocomplete suggestions API)
7. Stripe Payments API (both frontend and backend)

## Features

1. Login/Sign up
2. Inventory Management
3. Stripe API for billing
4. Order management

## Steps for deploying to Heroku

1. Create a new app in Heroku berfore doing anything with the CLI. Install Heroku CLI and open CMD, browse to the app's directory. For us, initially it was `/website`.
2. Type `heroku login`, login with your Heroku account.
3. In the app's directory, run `heroku git:remote -a "your-app-name"` where `"your-app-name"` needs to be changed according to the name of your heroku app.
4. In the app's directory, run `git add .` to add all the files to the git repo for heroku.
5. Go to the project's root directory (if your app was in a subdirectory, this is where you would do `cd ..`).
6. <ol type="a"><li>If your project is in a subdirectory like us, run `git subtree push --prefix tutorial-code/ heroku master`, remember to replace</li><li>If your project is at the root directory of the git repo, run `git push heroku master`</li></ol>
7. Open your Heroku dashboard online, and go to the settings tab, click `Config Vars` and set the required environment variables by looking at your .env / other files.
