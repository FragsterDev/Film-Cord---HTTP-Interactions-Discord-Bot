const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

async function discordRequest(endpoint, options) {
  const url = "https://discord.com/api/v10/" + endpoint;

  if (options.body) options.body = JSON.stringify(options.body);

  console.log(
    `AppID: ${process.env.APPLICATION_ID}\n TOKEN: ${process.env.TOKEN}`
  );

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(res);
    throw new Error(JSON.stringify(data));
  }

  return res;
}

async function registerCommands() {
  const commands = [];

  const commandsFolderPath = path.join(__dirname, "commands");
  const commandModules = fs.readdirSync(commandsFolderPath);

  for (const module of commandModules) {
    const modulePath = path.join(commandsFolderPath, module);

    const files = fs
      .readdirSync(modulePath)
      .filter((filename) => filename.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(modulePath, file);

      const command = require(filePath);

      if (command.data && command.execute) {
        commands.push(command.data);
      } else {
        return console.log(
          `Missing either data or execute function for some command(s).`
        );
      }
    }
  }

  try {
    await discordRequest(
      `applications/${process.env.APPLICATION_ID}/commands`,
      {
        method: "PUT",
        body: commands,
      }
    );
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  await registerCommands();
})();
