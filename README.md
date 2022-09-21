# Blugold

A web app for finding the cheapest fuel prices in your area. It uses a Geo visualization of the fuel stations and their prices to display the information the user is lookng for. The database is kept up to date by the users.
The main technologies used are [React](https://reactjs.org/), [Django](https://www.djangoproject.com/), [Djangorestframwork](https://www.django-rest-framework.org/), [Postgresql](https://www.postgresql.org/) and [Deck.gl](https://deck.gl/).

![Responsive Mockup](https://github.com/RobTheThief/ci-4-blugold/blob/main/assets/responsive-mockup-blugold.png)

## User Experience (UX)

- ### User stories

  - #### First Time Visitor Goals

    1. As a First Time Visitor, I want to easily create an account and log in so that I can update fuel station prices.
    2. As a First Time Visitor, I want to be able to find the cheapest fuel prices in a given area without needing to login so that I know where the cheapest fuel can be bought.
    3. As a First Time Visitor, I want to be able to easily visualize fules prices on a map to find the cheapest one.

  - #### Returning Visitor Goals

    1. As a Returning Visitor, I want to be able to log in to be able to update fuel station the prices.

- ### Design
  - #### Colour Scheme
    - The main colour used throughout is blue (rgb(48, 128, 255, 255)), black (#00000080), green (#2b7400) and white (#ffffff).
  - #### Typography
    - The Open Sans font is the main font used throughout the UI with sans-serif as the fallback font in case the font isn't being imported into the site correctly. They are used because they are easy to read and have a a neutral and friendly appearance.
  - #### Imagery
    - Imagery used to make up the logo was taken from unsplash.com which was a side view of water through glass and then using GIMP a letter 'B' was imposed on the image.
  - #### Wireframe
    - This wireframe was used initially to get an idea of the style and layout of the app would be:
      ![Wireframe Screenshot](https://github.com/RobTheThief/ci-4-blugold/blob/main/assets/images/ci-4-blugold.png)

## FEATURES

### EXISTING FEATURES

- **Feature**

  - description

  ![Feature](Feature.png)

## Technologies Used

### Languages Used

- [CSS3](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)
- [Javascript](https://en.wikipedia.org/wiki/JavaScript)
- [Python](https://en.wikipedia.org/wiki/Python_(programming_language))

### Frameworks, Libraries & Programs Used

1. [Google Fonts:](https://fonts.google.com/)
   - Google fonts were used to import the 'Open Sans' font into the style.css file which is used in all text on the page. Google fonts icons was also used for the search information icon and the drawer tab double arrow icon.
1. [Git](https://git-scm.com/)
   - Git was used for version control by utilizing the Gitpod terminal to commit to Git and Push to GitHub.
1. [GitHub:](https://github.com/)
   - GitHub is used to store the projects code after being pushed from Git.
1. [GIMP:](https://www.gimp.org/)
   - GIMP was used to create the logo from an unsplash stock image.
1. [Balsamiq:](https://balsamiq.com/)
   - Was used to create the wireframe for the UI.
1. [Django:](https://www.djangoproject.com/)
   - Django was used in the backend to serve the React frontend for the application.
1. [Django Rest Framework:](https://www.django-rest-framework.org/)
   - Django Rest Framework was used to create the Rest API to make request to the Postgresql database as well as middleware to make requests to the Google Places API and the authentication, authorization and permissions.
1. [Postgresql](https://www.postgresql.org/)
   - Postgresql was used for the fuel station price database.
1. [React:](https://reactjs.org/)
   - The React library was used to create the frontend.
1. [Deckgl:](https://deck.gl/)
   - Deckgl was used for the map geo visualisation and station column layers.

### FUTURE FEATURES

## TESTING

### Testing User Stories from User Experience (UX) Section

- #### First Time Visitor Goals

  1. As a First Time Visitor, I want to easily create an account and log in so that I can update fuel station prices.
     1. whe the user is not loggin in as when visiting for the first time, there is a message to explain that you need to create an accout and log in if the user wants to update fuel prices.
     2. On first visit the UI displays inputs for registration.
     3. If the registration is successful the app will automatically log you in so that you can update fuesl prices.
  2. As a First Time Visitor, I want to be able to find the cheapest fuel prices in a given area without needing to login so that I know where the cheapest fuel can be bought.
     1. At the top of the UI there there is always a search area section with an on hover information tooltip to explain its use.
     2. The search function uses Google places API to find coordinates from an address, place name, or post code and then makes a search for fuel stations within 3km of that location.
     3. The map shows two columns for each station an on hover tooltip with a legend for petrol and diesel prices for that station.

- #### Returning Visitor Goals

  1. As a Returning Visitor, I want to be able to log in to be able to update fuel station the prices.
     1. If the user is not logged in and the previous sessions is expired the user will be shown the login and register section i the UI.
     2. When the user is logged in they can now click on the fuel stations and an update station UI will be shown in the sidebar.

### Known Bugs

- There are no known remianing bugs.

#### Solved Bugs

- Because Django enforces CSRF protection when making an API rewuest to protected endpoints ( POST, PUT ) a 403 Forbidden error was returned even though a CsrfExemptMixin was added to the views and the correct hots added to CSRF_TRUSTED_ORIGINS in settings in the backend.
After the csrf token was added to the headers in the frontend fetch requests the these requests were then authorised.

### Further Testing

- The Website was tested on Google Chrome, Firefox, Microsoft Edge, Brave Browser, Ecosia and Safari.
- The website was viewed on a variety of devices such as Desktop, Laptop, Samsung S9, S10, iPhone X.
- Friends and family members were asked to review the site and documentation to point out any bugs and/or user experience issues.

### Validator Testing

- Python
  - I confirm that all python files were run through the pep8 online validator and all errors were corrected. Errors only consisted of E501: line too long errors.
  ![PEP8](https://github.com/RobTheThief/ci-4-blugold/blob/main/assets/pep8-blugold.png)
- CSS
  - No errors were found when passing through the official(Jigsaw) validator.
  ![CSS VALIDATOR](https://github.com/RobTheThief/ci-4-blugold/blob/main/assets/css-jigsaw-blugold.png)
- Accessibility

  - I confirm that the colours and fonts are easy to read and accessible by running it through the lighthouse in devtools.

  ![LIGHTHOUSE METRICS](https://github.com/RobTheThief/ci-4-blugold/blob/main/assets/lighthouse-blugold.png)

## Deployment

- Local deployment was achieved with with Python from the console. The game was developed on a Ubuntu OS and so was already installed. Steps are as follows:

  - Run `python3 run.py` in the terminal with root directory of the project.

- Heroku Deployment:
  - Create a new Heroku app.
  - Set the build packs to `Python` and `NodeJS` in that order.
  - Set Config Vars key value pairs for:
    1. `PORT`: `8000`
    1. `CREDS`: `{CREDS Object}` where {CREDS Object} is from the credentials file
       dowoloaded from Google Cloud Platform.
  - Enter `heroku login -i` command in the terminal with root directory of the project.
  - Enter Heroku username and password.
  - Enter `git push --set-upstream https://git.heroku.com/ci-4-blugold.git` to deploy.
  - Enter `git push --set-upstream https://github.com/RobTheThief/ci-4-blugold.git main` to reset upstream to github.

The live link can be found here - https://blugold.herokuapp.com//

## Credits

### Content

### Media
