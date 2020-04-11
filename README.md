# Online games [![CircleCI](https://circleci.com/gh/grzegorz103/online-games.svg?style=svg)](https://circleci.com/gh/grzegorz103/online-games) ![GitHub language count](https://img.shields.io/github/languages/count/grzegorz103/online-games)

## Live demo
Live demo available at https://online-games-69bcf.firebaseapp.com/

## Technology stack

- Spring Boot
- REST, Websocket API
- Angular 8
- Auth0

## Features:

- Auth0 authorization integrated
- Chess game with simple AI (unfinished yet)    
- Maze game with two difficult levels - Easy, Hard and Master (uses shortest path finding algorithm in maze). Use WSAD to move
- Maze game with Multiplayer (Websocket)
- Chat with current members online (Websocket)

## How to launch

1. Clone this repository   
2. Open terminal in main directory and type `mvn spring-boot:run`    
3. Run another terminal and type following commands:
- `cd front`    
- `npm install`   
- `ng serve`
4. Run browser and head to `http://localhost:4200'
