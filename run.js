const solutionId = process.argv[2]
try {
  require(`./${solutionId}/solution.js`)
} catch (ex) {
  console.error(`Unable to run solution for '${solutionId}': ${ex}`, ex.stack)
}
