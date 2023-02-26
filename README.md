# erc721-example

## Run all

```bash
docker-compose up --remove-orphans
```

## Open Web App

```bash
open http://localhost:3000
```

## Get all events

```bash
$ curl localhost:4000/events 2>/dev/null | jq
[
  {
    "CollectionCreated": {
      "collection": "70997970c51812dc3a010c7d01b50e0d17dc79c8",
      "name": "Test NFT",
      "symbol": "TNFT"
    }
  },
  {
    "TokenMinted": {
      "collection": "70997970c51812dc3a010c7d01b50e0d17dc79c8",
      "recipient": "3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
      "token_id": "0",
      "token_uri": "uri"
    }
  }
]
```

## Development

### Formatting

```bash
make fmt
```

### Run tests

```bash
make run-tests
```
