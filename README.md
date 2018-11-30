#issueT

issueT is a small CLI to parse TODO comments out of your Source code and post them as Issues on Github.

to install:
```bash
sudo npm install -g issue-t
```

how to use:
1. navigate to the root directory of your repository. (This is important because issueT will look for `.git/config`)
2. execute this command with your informations:
```bash
issueT <pathToFile> <username> <password>
```

