/**
 * Used to output more detailed messages if the server confiler
 * fails.
 */
exports.outputErrors = (err, stats) => {
  if (err) {
    console.error(err.stack || err);

    if (err.details) console.error(err.details);

    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) console.error(info.errors);
  if (stats.hasWarnings()) console.warn(info.warnings);
}