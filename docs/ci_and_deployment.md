# Continuous Integration and Deployment
Continuous Integration and Deployment are taken care of through GitHub Actions defined in .github/workflows/ci.yml. With each push to a pull request, a set of tests is run (frontend, backend, and integration). These must all pass or otherwise the PR is not allowed to merge. But, when you _do_ merge the PR, these tests are all run again. Then, _if_ the tests again all pass, deployment to heroku automatically takes place.


## Rollback
Rollback must be done manually.

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
We are now using the `backgound_tasks` command to take care of periodic tasks and tasks that take too long to be run in the normal request cycle. In production this command is run once every 10 minutes using Heroku's Scheduler. ([Here's is the scheduler page for our application.](https://dashboard.heroku.com/apps/penny-university/scheduler)). The scheduler command we use is `python manage.py background_tasks --duration 600`. During deployment you don't have to do anything special for this to update (e.g. the above directions will work fine), but if you ever need to actually change the scheduling of the command, add a new command, or modify the parameters for the existing command, this will help you understand how that works. Also, one surprising side effect of this is that the changes to background tasks will only be seen after the first time that the background task is run again (e.g. every 10 minutes).
