# Samosabucket

## COMP426 Modern Web Programming Project at UNC-Chapel Hill

The purpose of this project is to implement a fully functional online restaurant ordering, order and product management website, that allows users to place orders and track their order from the `paid` to the `delivered` stage. We will develop an aesthetic frontend experience that will enable users to quickly buy their desired snacks.

## Tech Stack

1. Bulma CSS
2. React (A JavaScript UI Framework)
3. Node and Express (Backend, with `cors`,`cookie-parser`, `uuid`, and `express-validator` used as middleware)
4. MongoDB Atlas (For spinning up and using a Cloud MongoDB instance)
5. Cloudinary (For handling image uploads)
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
   `REACT_APP_CLOUDINARY_CLOUDNAME`: The cloud name, shown when you create a Cloudinary account and log into the dashboard.<br>
   `REACT_APP_CLOUDINARY_FOLDER`: The name of the folder on your cloudinary API dashboard, where you want your menu item images to get uploaded.<br>
   `REACT_APP_CLOUDINARY_UPLOADPRESET`: The name of the upload preset (you need to create a preset in your Cloudinary API settings by clicking on the gear icon > Upload > Add upload preset (will have to scroll down to find that "Add upload preset" link). The preset must be an Unsigned upload type preset that accepts images, and the folder set in the preset settings should match the folder set in <code>REACT_APP_CLOUDINARY_FOLDER</code>). It is suggested that the "Discard original file name" setting be turned on.<br>
   `REACT_APP_POSITIONSTACK_ENABLED`: Set this to TRUE (if you have paid for PositionStack API) if you want address autocomplete (on the Signup and Profile pages) enabled. FALSE if you want it disabled.<br>
   `REACT_APP_POSITIONSTACK_API`: The API URL for the Positionstack API that we used for geocoding.<br>
   `REACT_APP_POSITIONSTACK_API_KEY`: The API KEY for the Positionstack API.<br>
   `REACT_APP_STRIPE_PUBLIC_KEY`: Public key for the Stripe Payments API.<br>
   `REACT_APP_INFO_TAB_NAME`: Set to any string to show up as the info/help/support tab name.<br>
   `STRIPE_SK`: Secret key for the Stripe Payments API.<br>
   `ENFORCE_HTTPS`: TRUE if you wish to enforce HTTPS, FALSE if you don't.<br>
