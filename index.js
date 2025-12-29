const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const {
  InteractionType,
  InteractionResponseFlags,
  InteractionResponseType,
  verifyKeyMiddleware,
} = require("discord-interactions");
const handleButtonEvent = require("./helpers/button_events/handle_button_event");

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use("/interactions", express.raw({ type: "application/json" }));

app.commands = {};

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
      app.commands[command.data.name] = {
        data: command.data,
        execute: command.execute,
      };

      console.log(`Loaded ${command.data.name}`);
    } else {
      throw new Error("Missing data or execute for some modules.");
    }
  }
}

app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async (req, res) => {
    const body = req.body;

    // console.log(body);

    if (!body) {
      return res.sendStatus(400);
    }

    const { type, data } = body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      const command = app.commands[name];
      // console.log(body);
      if (command) {
        const commandResponse = await command.execute(body);
        return res.send(commandResponse);
      } else {
        res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Unknown Command",
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
    }

    if (type === InteractionType.MESSAGE_COMPONENT) {
      await handleButtonEvent(body);
    }
    return res.sendStatus(204);
  }
);

app.listen(port, () => {
  console.log(`Listening for requests on ${port}`);
});
