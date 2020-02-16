# Penny University Frontend

## Requirements
* `node >= 8.0` & `npm >= 6.3`

## Run the Frontend 
1. Run the Django server.
2. Navigate to the frontend directory (`penny_university_frontend`) and run `npm install`.
3. Compile the SCSS files using `npm run compile:css`.
4. Run the application using `npm run start`. A browser window should automatically open to the application's homepage, 
but if not, open a browser window and go to http://localhost:3000.

## Run Frontend Tests
When you are inside the frontend directory, `npm test` will run the frontend tests in an interactive "watch" 
environment. They will run each time you update a test. To run tests without watching the files, run `CI=true npm test`
instead.
