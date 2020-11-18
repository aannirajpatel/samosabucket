# Samosabucket

## COMP426 Modern Web Programming Project at UNC-Chapel Hill

The purpose of this project is to implement a fully functional online restaurant ordering, order and product management website, that allows users to place orders and track their order from the `paid` to the `delivered` stage. We will develop an aesthetic frontend experience that will enable users to quickly buy their desired snacks.

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
3. Billing and Payments
4. Order management

## Steps for deploying to Heroku

1. Create a new app in Heroku berfore doing anything with the CLI. Install Heroku CLI and open CMD, browse to the app's directory. For us, initially it was `/website`.
2. Type `heroku login`, login with your Heroku account.
3. In the app's directory, run `heroku git:remote -a "your-app-name"` where `"your-app-name"` needs to be changed according to the name of your heroku app.
4. In the app's directory, run `git add .` to add all the files to the git repo for heroku.
5. Go to the project's root directory (if your app was in a subdirectory, this is where you would do `cd ..`).
6. <ol type="a"><li>If your project is in a subdirectory, run <code>git subtree push --prefix subdirectory-name/ heroku branch-name</code>, remember to replace <code>subdirectory-name</code> with the name of your subdirectory, and <code>branch-name</code> with the name of the branch that you wish to deploy.</li><li>If your project is at the root directory of the git repo, simply run <code>git push heroku branch-name</code></li></ol>
7. Open your Heroku dashboard online, and go to the settings tab, click `Config Vars` and set the required environment variables by looking at your .env / other files. Our project uses the following environment variables:<br>
   `DB_URL`: The MongoDB URL with the login parameters.<br>
   `JWT_SECRET`: The secret key for signing the authentication payloads.<br>
   `REACT_APP_BACKEND_API`: The backend API URL, left blank if frontend deployed on the same host as backend.<br>
   `REACT_APP_CLOUDINARY_CLOUDNAME`: The cloud name where we are uploading the product images.<br>
   `REACT_APP_POSITIONSTACK_API`: The API URL for the Positionstack API that we used for geocoding.<br>
   `REACT_APP_POSITIONSTACK_API_KEY`: The API KEY for the Positionstack API.<br>
   `REACT_APP_STRIPE_PUBLIC_KEY`: Public key for the Stripe Payments API.<br>
   `STRIPE_SK`: Secret key for the Stripe Payments API.<br>
