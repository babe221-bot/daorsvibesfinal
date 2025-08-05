# Contributing to DaorsVibes

First off, thank you for considering contributing to DaorsVibes! It's people like you that make DaorsVibes such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, [make one](https://github.com/your_username_/your_project_name/issues/new)! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

### Fork & create a branch

If this is something you think you can fix, then fork DaorsVibes and create a branch with a descriptive name.

A good branch name would be (where issue #123 is the ticket you're working on):

```sh
git checkout -b 123-add-a-feature
```

### Get the test suite running

Make sure you can run the tests. We've got some `npm` scripts to help you out:

```sh
npm test
```

### Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first :smile_cat:

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with DaorsVibes's master branch:

```sh
git remote add upstream git@github.com:your_username_/your_project_name.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 123-add-a-feature
git rebase master
git push --force-with-lease origin 123-add-a-feature
```

Finally, go to GitHub and make a Pull Request.

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing and merging, check out this guide on [merging vs. rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing).

We're happy to help you get your PR merged in.

## Style guide

We follow the styling guidelines from `docs/blueprint.md`. Please ensure your code adheres to these guidelines.

## Code of Conduct

We have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.
