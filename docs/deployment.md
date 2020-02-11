# Deployment From PR to Production

1. Create a PR. Get it reviewed.
2. **Make sure master is merged into the PR branch** and make sure all CI tests pass.
3. Deploy to your QA slack and app environment first.
    ```sh
    deploy_branch=$(git rev-parse --abbrev-ref HEAD)
    git push qa "$deploy_branch":master
    ```
4. Watch the logs and manually tests your changes in QA.
5. If you're doing a database migration, then backup the database 
    ```sh
    heroku pg:backups:capture -a penny-university
    ```
6. Once you're satisfied that it's safe deploy the PR branch to PROD.
    ```sh
    git push production "$deploy_branch":master
    ```
7. Watch the logs and manually tests your changes in PROD.
8. If all goes well, then merge your branch into master and you're done!
    ```sh
    git checkout master
    git merge "$deploy_branch"
    git push origin master
    ```


## Rollback
If something horrible happens _before_ you've merged your deploy_branch into master then just redeploy master:
```sh
git push -f production master
```
But be aware that this won't rollback database migrations. Rollback migrations with
```sh
./manage.py migrate my_app 0007_whatever_migrations_you_made
```


# Setting up New Environment
(to be written - include full slack and heroku setup)
