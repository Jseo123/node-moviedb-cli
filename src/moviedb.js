#!/usr/bin/env node

const { Command, option } = require("commander");
const ora = require("ora");
const KEY = process.env.API_KEY;
const https = require("https");

const program = new Command();
program.version("0.0.1");

program
  .command("get-persons")
  .description("Make a network request to fetch most popular persons")
  .requiredOption("-p, --popular", "Fetch the popular persons")
  .requiredOption("--page <number>")
  .action(function handleAction() {
    const fetch = {
      hostname: "api.themoviedb.org",
      href: "https://api.themoviedb.org",
      path: `/3/person/popular?page=${option.page}&api_key=${KEY}`,
      method: "GET",
    };

    const req = https.request(fetch, (res) => {
      let resBody = " ";

      res.on("data", function (responseData) {
        resBody += responseData;
      });

      res.on("end", function () {
        let parsedData = JSON.parse(resBody);
        console.log(parsedData);
      });
      res.on("error", () => {
        ora.fail("Loading failed");
      });
    });
  });

program
  .command("get-person")
  .description("Make a network request to fetch the data of a single person")
  .action(function handleAction() {
    console.log("hello-world");
  });

program
  .command("get-movies")
  .description("Make a network request to fetch movies")
  .action(function handleAction() {
    const spinner = ora("Fetching the popular person's data...").start();
    console.log("hello-world");
  });

program
  .command("get-movie")
  .description("Make a network request to fetch the data of a single person")
  .action(function handleAction() {
    console.log("hello-world");
  });

// error on unknown commands

program.parse(process.argv);
