# Deployment From PR to Production
Assumptions: You have heroku set up so that the production application is named `penny-university` and the qa application is named `penny-qa`.


1. Create a PR. Get it reviewed.
2. **Make sure master is merged into the PR branch** and make sure all CI tests pass.
3. Shapshot the PROD database. (Note that this and all other database steps below can be skipped if you aren't performing any type of database migration.)
    ```sh
    heroku pg:backups:capture -a penny-university
    ```
4. Put QA into the same state as PROD.
    1. Push the database snapshot from PROD to QA
        ```sh
        heroku pg:backups:restore penny-university:: DATABASE_URL --app penny-qa --confirm penny-qa
        ```
    2. Push the origin/master to QA:
        ```sh
        git fetch
        git push -f qa origin/master:master
        ```
    At this point your app should be in a state identical to master
5. Now make sure that your change (including migrations!) works:
    1. Push your changes to QA.
        ```sh
        deploy_branch=$(git rev-parse --abbrev-ref HEAD)
        git push -f qa "$deploy_branch":master
        ```
    2. If you need to do any custom database work, try it in QA first and jot down the steps you take. `heroku pg:psql -a penny-qa`
    3. Watch the logs and manually tests your changes in QA: `heroku logs -t -a penny-qa`
6. Once you're satisfied that it's safe deploy the PR branch to PROD.
    1. Push your changes to PROD.
    ```sh
    git push production "$deploy_branch":master
    ```
    2. If you need to do any custom database work, then run the commands you practiced in QA. `heroku pg:psql -a penny-university`
    3. Watch the logs and manually tests your changes in QA: `heroku logs -t -a penny-university`
7. If all goes well, then merge your branch into master and you're done!
    ```sh
    git checkout master
    git merge "$deploy_branch"
    git push origin master
    ```


## Rollback
If something horrible happens (ideally _before_ you've merged your deploy_branch into master) then fix it by restoring the application and database to where it was before the deploy went wrong.

1. If a damaging data migration occurred, then restore the database. Here are two options:
    1. Rollback the migration to where ever it was before your change.
        ```sh
        ./manage.py migrate my_app 0007_the_migration_BEFORE_your_poison_migration
        ```
        Figure out which migration this is by looking at the `dependencies` section of the migrations introduced in your Pull Request. (You might need to run `./manage.py migrate` multiple times if the migrations were independent.) 
    2. Restoring the database backup. (Know that restoring the backup means that all data committed after the backup was made will be lost. Time is of the essence!)  
        ```sh
        heroku pg:backups:restore DATABASE_URL --app penny-university
        ```
2. _Definitely_ redeploy master:
    ```sh
    git push -f production master
    ```
    
## Less Common Changes

### Backgound Tasks
We are now using the `backgound_tasks` command to take care of periodic tasks and tasks that take too long to be run in the normal request cycle. In production this command is run once every 10 minutes using Heroku's Scheduler. ([Here's is the scheduler page for our application.](https://dashboard.heroku.com/apps/penny-university/scheduler)). The scheduler command we use is `python manage.py background_tasks --duration 600`. During deployment you don't have to do anything special for this to update (e.g. the above directions will work fine), but if you ever need to actually change the scheduling of the command, add a new command, or modify the parameters for the existing command, this will help you understand how that works.
