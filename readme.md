# Meat-Cleaver.js

It's a terminal read-only Meatspace Chat client. That's it. I didn't want to keep the Meatspace window open all the time, but I also wanted to keep an eye on what's happening in the chatroom. I have a problem.

## Usage

```bash
npm install -g meatcleaver
meatcleaver
```

`ctrl+c` to exit and embrace FOMO.

## Channels

You can specify which subdomain you're connecting to by passing it as an argument.

```bash
meatcleaver -c fr
meatcleaver -c es
meatcleaver -c chat
```

This does not work for the staging server because I am lazy.

## Names

One fun feature I added is fingerprint lookup. Once you get tired of not knowing who's saying what just make a `~/.meatcleaver-names.json` file and fill it with mappings. Example:

```json
{
    "90eae8dd51b66669f262a4d18fbb155c": "George"
}

```

Stalk your Meatspace obsession with impunity, keep track of the conversation. I've put together a pretty comprehensive fingerprint lookup, but I feel really creepy sharing it, so I won't.
