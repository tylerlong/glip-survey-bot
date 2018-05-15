# glip-survey-bot

A survey bot for Glip which reads survey questions from configuration file.


## How to set up

```
yarn install
cp .env.sample .env
edit .env
```


## How to get `RINGCENTRAL_TOKEN`

You can use [RingCentral token generator](https://github.com/tylerlong/ringcentral-token-generator).


## How to edit survey questions

Edit [survey.md](survey.md) file. Rules:

- heading 1 is the survey topic
- paragraph is some information the bot will send to user
- heading 2 is a survey question
- bullet list contains the answer options


## How to run the bot

```
yarn start
```
