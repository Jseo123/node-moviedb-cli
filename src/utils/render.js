const chalk = require("chalk");
const { options } = require("node-notifier");
const log = console.log;

function renderPersonsData(page, totalPages, person) {
  if (totalPages > page) {
    log(chalk.white("\n\n----------------------------------------"));
    log(chalk.white(`page: ${page} of: ${totalPages}`));
  }

  person.forEach((person) => {
    log(chalk.white("\n\n----------------------------------------"));
    log(chalk.white("\n"));
    log(chalk.white(`${person}:\n `));
    log(`ID: ${chalk.white(person.id)}`);
    log(`Name: ${chalk.blue.bold(person.name)}`);

    if (person.known_for_department === "Acting") {
      log(chalk.magenta(`${person.known_for_department}`));
    }

    const movieTitle = function knownForMovie(movie) {
      return movie.title !== undefined;
    };

    const hasAnyMovieWIthTitle = person.known_for.some(movieTitle);

    if (hasAnyMovieWIthTitle) {
      log(chalk.white(`\n Appearing in movies:`));

      person.known_for.forEach(function knownFor(movie) {
        if (movie.title) {
          log(`\n`);
          log(`\t${chalk.white(`Movie:`)}`);
          log(`\tID: ${chalk.white(movie.id)}`);
          log(`\tRelease Date: ${chalk.white(movie.release_date)}`);
          log(`\tTitle: ${chalk.white(movie.title)}`);
          log(`\n`);
        }
      });
    } else {
      log(`\n`);
      log(chalk.yellow(`${person.name} doesnt appear in any movie\n`));
    }
  });
}

module.exports = { renderPersonsData };
