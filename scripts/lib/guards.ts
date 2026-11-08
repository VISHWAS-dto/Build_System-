/** Blocks a destructive script from running against production. */
export const assertNotProduction = (scriptName: string): void => {
  if (process.env["NODE_ENV"] === "production") {
    console.error(`${scriptName} is blocked when NODE_ENV=production.`);
    process.exit(1);
  }
};

/** Requires an explicit `--yes` flag for destructive scripts. */
export const requireConfirmation = (scriptName: string): void => {
  if (!process.argv.includes("--yes")) {
    console.error(`${scriptName} is destructive. Re-run with --yes to confirm.`);
    process.exit(1);
  }
};
