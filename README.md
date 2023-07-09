# Samosabucket

Test it out! [samosabucket.netlify.app](https://samosabucket.netlify.app)

The purpose of this project is to implement a fully functional online restaurant ordering, order and product management website, that allows users to place orders and track their order from the `paid` to the `delivered` stage.

## Steps for deploying this app

Note: Heroku no longer has a free tier.

1. Create or log in to your account on on Heroku (https://heroku.com), and make a new app. Then Install Heroku CLI by clicking [here](https://devcenter.heroku.com/articles/heroku-cli) and open CMD (or shell/terminal if you are using Linux/Mac), and browse to the app's directory using `cd` commands.
2. Once you have navigated to the root directory of this project in your terminal, type in `heroku login`, and login with your Heroku account.
3. In the app's directory, run `heroku git:remote -a "your-app-name"` where `"your-app-name"` needs to be changed according to the name of your heroku app.
4. In the app's directory, run `git add .` to add all the files to the git repo for heroku.
5. Go to the project's root directory (if your app was in a subdirectory, this is where you would do `cd ..`).
6. <ol type="a"><li>If your project is in a subdirectory, run <code>git subtree push --prefix subdirectory-name/ heroku branch-name</code>, remember to replace <code>subdirectory-name</code> with the name of your subdirectory, and <code>branch-name</code> with the name of the branch that you wish to deploy.</li><li>If your project is at the root directory of the git repo, simply run <code>git push heroku branch-name</code></li></ol>
7. Open your Heroku dashboard online, and go to the settings tab, click `Config Vars` and set the required environment variables by looking at your .env / other files. Our project uses the following environment variables:<br>
   `DB_URL`: The MongoDB URL with the login parameters.<br>
   `JWT_SECRET`: The secret key for signing the authentication payloads.<br>
   `WEBAPP_ORIGIN`: Set this to the origin used by your frontend (example, if you are hosting the frontend on Netlify and backend on a service like back4app which provides free Docker container hosting, you can provide this on the Back4App environment variables configuration page)<br>
   `SERVE_WEBAPP`: Set this to true if deploying to Heroku - instructs the API server to also serve the frontend (web app) files<br>
   Frontend environment variables:<br>
   `REACT_APP_BACKEND_API`: The backend API URL, can be left blank if frontend is served from the same origin as backend.<br>
   `REACT_APP_CLOUDINARY_CLOUDNAME`: The cloud name, shown when you create a Cloudinary account and log into the dashboard.<br>
   `REACT_APP_CLOUDINARY_FOLDER`: The name of the folder on your cloudinary API dashboard, where you want your menu item images to get uploaded.<br>
   `REACT_APP_CLOUDINARY_UPLOADPRESET`: The name of the upload preset (you need to create a preset in your Cloudinary API settings by clicking on the gear icon > Upload > Add upload preset (will have to scroll down to find that "Add upload preset" link). The preset must be an Unsigned upload type preset that accepts images, and the folder set in the preset settings should match the folder set in <code>REACT_APP_CLOUDINARY_FOLDER</code>). It is suggested that the "Discard original file name" setting be turned on.<br>
   `REACT_APP_POSITIONSTACK_ENABLED`: Set this to TRUE (if you have paid for PositionStack API) if you want address autocomplete (on the Signup and Profile pages) enabled. FALSE if you want it disabled.<br>
   `REACT_APP_POSITIONSTACK_API`: The API URL for the Positionstack API that we used for geocoding.<br>
   `REACT_APP_POSITIONSTACK_API_KEY`: The API KEY for the Positionstack API.<br>
   `REACT_APP_STRIPE_PUBLIC_KEY`: Public key for the Stripe Payments API.<br>
   `REACT_APP_INFO_TAB_NAME`: Set to any string to show up as the info/help/support tab name.<br>
   `STRIPE_SK`: Secret key for the Stripe Payments API.<br>


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
4. Order management (5 stages: `Ordered`, `Being Prepared`, `Out for Delivery`, and `Delivered`)

## Contribution

Contributors are always welcome. Steps are simple - fork the repo, make your changes, send in a pull request with a proper description of 3 things: what have you tried to achieve/change, why, and how. Your pull request will be reviewed, discussed, and if everything looks good, approved. Here are some things you can do to contribute to this noble cause:

1. If you find bugs/have suggestions, please report them on the GitHub repo’s issues page. This does not require forking the repo.
2. We need a docs overhaul. One of the main goals is to make the deployment process well-documented so even non-tech-savvy people can set this up for cheap. So, try looking at the code, and send in a pull request if you’d like to help add better documentation, especially regarding deployment.
3. We need more features, especially for sorting and searching through food orders and menu items. So feel free to add or suggest any new features.
4. To learn how the project is structured, this video (I made it as part of a course project submission) is a good starting point: https://youtu.be/5aaHLsasL6Y
5. If you think code can be better reorganized, certainly do so!
6. Since the admin side of the app will only ever be accessed by system admins, I used Cloudinary's public cloud upload service to upload the images to Cloudinary directly from the front-end, i.e., React, using the free Cloudinary ID we have. We would be better off if we use the backend in order to upload the images to somewhere like Amazon S3.
