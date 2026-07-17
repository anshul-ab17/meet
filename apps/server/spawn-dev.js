import { spawn } from "child_process";

console.log("🚀 Starting TypeScript compiler watch mode...");
const tsc = spawn("npx", ["tsc", "-w"], { shell: true, stdio: "inherit" });

// Wait a bit for the first build before starting the server process
setTimeout(() => {
  console.log("🚀 Starting Express + Apollo GraphQL server watch mode...");
  const node = spawn("node", ["--watch", "dist/index.js"], { shell: true, stdio: "inherit" });

  process.on("SIGINT", () => {
    tsc.kill();
    node.kill();
    process.exit();
  });
}, 3000);
