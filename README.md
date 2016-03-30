# Review My Code

It's a small CI tool for Github to require PR reviews.

##tl;dr;

* It's a set of github webhooks
* A PR without declared reviewers fails
* A PR that has not been reviewed is pending
* Failed reviews fail the PR

# How does it work?

A quick video (of very poor quality): https://www.youtube.com/watch?v=BRQ5yTs8f5M

## Requiring reviews

Write the following in the description of your PR or in a new comment:

```
As much description as needed... and then:

review: @user1 @user2

```

## Accepting or rejecting the PR

Create a new comment to the PR with (as sole content):

```
:+1:
```

to accept the PR, and respectively

```
:-1:
```

to reject it.

### Reviewing on behalf of someone else

When, for some reason, one of the reviewers is not available, you can force their review as follows:

```
!!FORCE :-1: @reviewer1
```

> Respectively, use `:+1:` to accept the PR.

# Status

Very alpha, it's barely a draft at this point.

The project was initiated during EmberConf 2016.

# License

MIT

