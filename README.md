# Matadorf 

Self-hosted Url shortener written w/ React and Go

## The problem

Putting stacktraces in pastebin / online is frowned upon.

## The solution

~~Use an existing solution to the problem~~ ❌

Write another solution to an existing problem that does nothing unique or different ✓

How to deploy:

`go build && server.exe`

`yarn install && yarn start`

Add your own entries to `dict.json` for personalized flavor.

## Notes:

I do not consider this production ready.

Lifespan of items retrieved/stored is not a big concern. If things get overwritten or deleted it's no big deal for my use case.

That means:
- If a new key is generated and already exists it will overwrite the existing one
- Storage is file backed