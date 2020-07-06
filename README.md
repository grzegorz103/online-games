# Online games 
[![CircleCI](https://circleci.com/gh/grzegorz103/online-games.svg?style=svg)](https://circleci.com/gh/grzegorz103/online-games) ![GitHub language count](https://img.shields.io/github/languages/count/grzegorz103/online-games)

## Table of contents
* [General info](#general-info)
* [Live demo](#live-demo)
* [Technologies](#technologies)
* [Features](#features)
* [Setup](#setup)

## General info

Online games is an application which contains several multi-player based features.

## Live demo
Live demo available at https://online-games-69bcf.firebaseapp.com/

## Technologies

- Spring Boot 2
- REST, Websocket API
- Angular 8
- Auth0
- CircleCI
- JUnit / Mockito
- Groovy / Spock

## Features:

- Chess game with AI
- Chess game with Multiplayer (Websocket)
- Maze game with two difficult levels - Easy, Hard and Master (uses shortest path finding algorithm in maze). Use WSAD to move
- Maze game with Multiplayer (Websocket)
- Chat with current members online (Websocket)
- Tic tac toe game with Multiplayer (Websocket)
- Auth0 authorization integrated

## Setup
### Prerequisites

- Angular 8 or greater is required
```$xslt
$ npm install -g @angular/cli
``` 
- Java 8+

### Deployment

```
$ mvn spring-boot:run
$ cd front
$ npm install
$ ng serve
```
Run browser and head to ```http://localhost:4200```
