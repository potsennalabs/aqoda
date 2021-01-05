const fs = require("fs");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let rooms;

  commands.forEach((command) => {
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        const hotel = { floor, roomPerFloor };
        rooms = Array.from({ length: floor }).map(() =>
          Array.from({ length: roomPerFloor })
        );

        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );
        return;
      case "book":
        const [number, name, age] = command.params;
        const fl = Math.floor(number / 100);
        const roomNumber = Math.floor(number % 100);
        rooms[fl - 1][roomNumber - 1] = {
          name,
          age,
          room: number,
        };
        return;
      default:
        return;
    }
  });
}

function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

main();
