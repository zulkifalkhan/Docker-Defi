const fs = require("node:fs/promises");

/**
 *
 *
 * @export
 * @param {string} to
 * @param {string} from
 * @param {Number} amount
 */
export async function appendTransaction(
  to: string,
  from: string,
  amount: Number
) {
  try {
    const content = { to, from, amount };
    await fs.appendFile("transaction.txt", JSON.stringify(content));
  } catch (err) {
    console.log(err);
  }
}
