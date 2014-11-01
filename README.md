Micro Search Engine Challenge
======

[![Build Status](https://travis-ci.org/chesleybrown/micro-search-engine-challenge.svg?branch=master)](https://travis-ci.org/chesleybrown/micro-search-engine-challenge)

This implements a simple search API which accepts a word list and enables the searching of words in that list that start with a specified string.

# Setup

Just need to install the node modules:

```
npm install
```

# Tests

To execute all the tests, just run:

```
npm test
```

# Running

Server runs on port `8000` by default, but will use the port set
on the environment variable `PORT` if set.
To start the server, just run:

```
npm start
```

# API

## Dictionary

`POST` `/dictionary/`

The dictionary of words to search through.

**Input:** JSON containing an array of words, e.g. `["foo", "bar", ...,]`

**Output:** Returns an HTTP `204` status for valid data.

## Search

`GET` `/search/:string`

All words that start with `:string` - e.g. `/search/foo` will return all
words in the supplied dictionary starting with `foo`, including `foo`
itself.

**Input:** the `string`, specified in the URL

**Output:** A JSON array of words in the dictionary which start with the
specified string, all in lower case. Returns an HTTP `200` status
for valid data, even if no words are found (returns an empty array in that case)