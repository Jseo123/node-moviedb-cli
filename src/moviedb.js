#!/usr/bin/env node
require("dotenv").config();
const { Command, option } = require("commander");
const ora = require("ora");
const KEY = process.env.API_KEY;
const https = require("https");
const {
  renderPersonsData,
  renderPerson,
  renderMoviesData,
} = require("./utils/render");

// const { renderPersonsData } = require("./utils/render.js");

const program = new Command();
program.version("0.0.1");

program
  .command("get-persons")
  .description("Make a network request to fetch most popular persons")
  .requiredOption("-p, --popular", "Fetch the popular persons")
  .requiredOption("--page <number>")
  .action(function getPersons(options) {
    const fetch = {
      href: "https://api.themoviedb.org",
      hostname: "api.themoviedb.org",
      path: `/3/person/popular?page=${options.page}&api_key=${KEY}`,
      method: "GET",
    };
    const spinner = ora("Loading popular people").start();
    const req = https.request(fetch, (res) => {
      let responseBody = "";

      res.on("data", function onData(resData) {
        responseBody += resData;
      });

      res.on("end", function onEnd() {
        const data = JSON.parse(responseBody);

        renderPersonsData(data.page, data.total_pages, data.results);

        spinner.succeed("Popular Persons - Loaded");
      });
    });

    req.on("error", () => {
      ora.fail("Error: Network request fails");
    });
    req.end();
  });
program
  .command("get-person")
  .description("Make a network request to fetch the data of a single person")
  .requiredOption("-i, --id <number>", "The id of the person")
  .action(function getPerson(options) {
    const fetch = {
      href: "https://api.themoviedb.org",
      hostname: "api.themoviedb.org",
      path: `/3/person/${options.id}?api_key=${KEY}`,
      method: "GET",
    };
    const spinner = ora("Loading popular people").start();
    const req = https.request(fetch, (res) => {
      let responseBody = "";

      res.on("data", function onData(resData) {
        responseBody += resData;
      });

      res.on("end", function onEnd() {
        const data = JSON.parse(responseBody);
        renderPerson(data);

        spinner.succeed("Person data loaded");
      });
    });

    req.on("error", () => {
      ora.fail("Error: Network request fails");
    });
    req.end();
  });

program
  .command("get-movies")
  .description("Make a network request to fetch movies")
  .requiredOption("--page <number>", "The page of movies data results to fetch")
  .option("-p, --popular", "Fetch the popular movies")
  .option("-n, --now-playing", "Fetch the movies that are playing now")
  .action(function getMovies(options) {
    let path = "";
    if (options.nowPlaying) {
      path = `/3/movie/now_playing?page=${options.page}&api_key=${KEY}`;
    } else {
      path = `/3/movie/popular?page=${options.page}&api_key=${KEY}`;
    }

    const fetch = {
      href: "https://api.themoviedb.org",
      hostname: "api.themoviedb.org",
      path: path,
      method: "GET",
    };

    const spinner = ora("Loading popular people").start();
    const req = https.request(fetch, (res) => {
      let responseBody = "";

      res.on("data", function onData(resData) {
        responseBody += resData;
      });

      res.on("end", function onEnd() {
        const data = JSON.parse(responseBody);
        renderMoviesData(data.page, data.total_pages, data.results);
        if (options.nowPlaying) {
          spinner.succeed("Recent released movies loaded");
        } else {
          spinner.succeed("Popular movies loaded");
        }
      });
    });

    req.on("error", () => {
      ora.error("Error: Network request fails");
    });
    req.end();
  });

program
  .command("get-movie")
  .description("Make a network request to fetch the data of a single person")
  .action(function handleAction() {
    console.log("hello-world");
  });

// error on unknown commands

program.parse(process.argv);
