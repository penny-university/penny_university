# penny_university

Run tests with `pytest`

## Requirements
* `python >= 3.7` & `pip3`
* `node >= 8.0` & `npm >= 6.3`

Using a virtual environment is highly recommended. One way you can create one is by using: `python3 -m venv venv`. 
Then activate it with: `source venv/bin/activate`.

Install the pip requirements using: `pip install -r requirements.txt` and `pip install -r dev-requirements.txt`.

Install the npm requirements by first navigating to the `src` directory (`cd src` from the root project directory), 
and then using: `npm install`.

## Run the Frontend
Navigate to the frontend directory (`penny_university_frontend`). Compile the SCSS files using `npm run compile:css`.
Run the application using `npm run start`. A browser window should automatically open to the application's homepage, 
but if not, open a browser window and go to http://localhost:3000.

## Compiling Sass Files
Penny University uses SCSS as a CSS preprocessor. SCSS files must be compiled into CSS before they can be used.

To compile the SCSS files to CSS, navigate into the `src` folder and use the following command: `npm run compile:css`.
If you want the files to compile automatically as they change, use: `npm run compile:css:watch`.

_Note: You must refresh the web page in order to see the changes._

### File Structure

SCSS files that start with an underscore will not be compiled into CSS. 
Instead, you can import them into the main `style.scss` file. 

Example:

```scss
/* _text_utils.scss */
.green-text {
  color: green;
}
```

```scss
/* styles.scss */
@import("text_utils");
```

## Create A Tunneling Pass Through (Local Development)

*ONLY USE FOR LOCAL DEVELOPMENT*

Steps:

1. deploy app to https://yourapp.herokuapp.com
2. visit https://yourapp.herokuapp.com/bot and see default response "at least something worked"
3. modify the bot index endpoint to say "something else"
4. set up local tunnel (ngrock, etc.)
5. visit http://yourapp.herokuapp.com/forward?host=yourngrockhost&port=8001 (only use port if needed)
6. now visit https://yourapp.herokuapp.com/bot and see "something else"

Based upon this you can automatically forward all traffic over the tunnel.

To cancel just visit http://yourapp.herokuapp.com/forward
