# Welcome to the One and only UdaciRacer Simulation Game

## Project Introduction
This project scope is to further my knowledge aquired in Udacity's Intermediate Javascript Nanodegree.

The game was partially built (comments throught code underline which parts we're already made). In order to practice asynchronous code, an API is provided which needs to be setup as per directions below. Once the API and front-end terminals are running the project opens up as a landing page - the only functioning button. 
This page displays players and tracks as a starting point.
The game is created by requesting API for each race, track, player and accelerate f() endpoints. In order to display these options, the APIs are invoked by creating callback functions in an asynchronous manner. 
The functions vary between Promise-returning f() - asynchronism is contained within the promise chain, the Promise is returned in order to acces .then() clause - ; whilst the async/await f() are entirely wrapper f(), the entire f() is a Promise - awaits on another function's result in order to resolve/reject and to which further advancement of the app relies on.

Enter the game. To create and start a race, select a player then select a track. 
The race starts after the countdown. The button is used to accelerate - click as fast - to advance in race and leaderboard. The leaderboard is also updated live and influences ranking between players.
The finish line will render players' rankings.

The game has three main views:

1. The form to create a race: choose one track and one player

2. The race progress view (this includes the live-updating leaderboard and acceleration button)

3. The race results view

## Starter Code

Starter code was supplied with the following:

1. An API. The API is provided in the form of a binary held in the bin folder. You never need to open the binary file, as there are no edits you can make to it. Your work will be 100% in the front end.

2. HTML Views. The focus of this course is not UI development or styling practice, so we have already provided you with pieces of UI, all you have to do is call them at the right times.

## Getting Started

In order to build this game, we need to run two things: the game engine API and the front end.

### Start the Server

The game engine has been compiled down to a binary so that you can run it on any system. Because of this, you cannot edit the API in any way, it is just a black box that we interact with via the API endpoints.

To run the server, locate your operating system and run the associated command in your terminal at the root of the project.

| Your OS               | Command to start the API                                  |
| --------------------- | --------------------------------------------------------- |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux` |

Note that this process will use your terminal tab, so you will have to open a new tab and navigate back to the project root to start the front end.

#### WINDOWS USERS -- Setting Environment Variables
In a separate terminal:
If you are using a windows machine:
1. `cd` into the root of the project containing data.json 
2. Run the following command to add the environment variable:
```set DATA_FILE=./data.json```

If you still run into issues running the API server on your machine, you can run this project in the Udacity classroom.


### Start the Frontend
In a separate terminal:
First, run your preference of `npm install && npm start` or `yarn && yarn start` at the root of this project. Then you should be able to access http://localhost:3000.

## Project Requirements

This starter code base has directions for you in `src/client/assets/javascript/index.js`. There you will be directed to use certain asynchronous methods to achieve tasks. You will know you're making progress as you can play through more and more of the game.

### API Calls

To complete the project you must first create the calls to the API. These will all be fetch requests, and all information needed to create the request is provided in the instructions. The API calls are all at the bottom of the file: `src/client/assets/javascript/index.js`.

Below are a list of the API endpoints and the shape of the data they return. These are all of the endpoints you need to complete the game. Consult this information often as you complete the project:

[GET] `api/tracks`
List of all tracks

- id: number (1)
- name: string ("Track 1")
- segments: number[]([87,47,29,31,78,25,80,76,60,14....])

[GET] `api/cars`
List of all cars

- id: number (3)
- driver_name: string ("Racer 1")
- top_speed: number (500)
- acceleration: number (10)
- handling: number (10)

[GET] `api/races/${id}`
Information about a single race

- status: RaceStatus ("unstarted" | "in-progress" | "finished")
- positions object[] ([{ car: object, final_position: number (omitted if empty), speed: number, segment: number}])

[POST] `api/races`
Create a race

- id: number
- track: string
- player_id: number
- cars: Cars[] (array of cars in the race)
- results: Cars[] (array of cars in the position they finished, available if the race is finished)

[POST] `api/races/${id}/start`
Begin a race

- Returns nothing

[POST] `api/races/${id}/accelerate`
Accelerate a car

- Returns nothing

To complete the race logic, find all the TODO tags in index.js and read the instructions.
