import { UserService } from "../packages/db/src/services/userService";
import { Neo4jClient } from "../packages/db/src/client";

async function main() {
  const args = process.argv.slice(2);
  const name = args.find(a => !a.startsWith("-"));
  const verify = args.includes("--verify");

  if (!name) {
    console.log("Usage: npx ts-node scratch/otp.ts <username> [--verify]");
    process.exit(1);
  }

  const userService = new UserService();
  
  try {
    const user = await userService.getUserByName(name);
    if (!user) {
      console.error(`User "${name}" not found.`);
      process.exit(1);
    }

    const fullUser = await userService.getUser(user.id);
    console.log("--------------------------------");
    console.log(`User: ${name}`);
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${fullUser.email || "N/A"}`);
    console.log(`OTP: ${fullUser.otp || "None"}`);
    console.log(`Verified: ${fullUser.verified ? "Yes" : "No"}`);
    console.log("--------------------------------");

    if (verify && !fullUser.verified) {
      await userService.markVerified(user.id);
      console.log(`User "${name}" has been manually verified.`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    const client = Neo4jClient.getInstance();
    await client.close();
    process.exit(0);
  }
}

main();
