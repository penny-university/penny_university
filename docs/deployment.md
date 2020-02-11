# Deployment From PR to Production

1. Create a PR. Get it reviewed.
2. **Make sure master is merged into the PR branch** and make sure all CI tests pass.
3. Deploy to your QA slack and app environment first.
```sh
dev_branch=$(git rev-parse --abbrev-ref HEAD)
git push qa "$dev_branch":master
```
4. Watch the logs and manually tests your changes in QA.
5. Once you're satisfied that it's safe deploy the PR branch to PROD.
```sh
git push production "$dev_branch":master
```
6. Watch the logs and manually tests your changes in PROD.
7. If all goes well, then merge your branch into master and you're done!
```sh
git checkout master
git merge "$dev_branch"
git push origin master
```


## Rollback
If something horrible happens then `git push -f production master`. But be aware that this won't rollback database
migrations.


# Setting up New Environment
(to be written - include full slack and heroku setup)
