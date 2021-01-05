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
  let sumGuest = 0;
  let hotel = {};

  commands.forEach((command) => {
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        hotel = { floor, roomPerFloor };
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
        const room = rooms[fl - 1][roomNumber - 1];

        if (!room) {
          sumGuest++;
          rooms[fl - 1][roomNumber - 1] = {
            name,
            age,
            room: number,
            keyCard: sumGuest,
          };
          console.log(
            `Room ${number} is booked by ${name} with keycard number ${sumGuest}.`
          );
        } else {
          console.log(
            `Cannot book room ${number} for ${name}, The room is currently booked by ${room.name}.`
          );
        }
        return;
      case "list_available_rooms":
        const emptyRooms = [];

        for (let i = 1; i <= hotel.floor; i++) {
          for (let j = 1; j <= hotel.roomPerFloor; j++) {
            if (!rooms[i - 1][j - 1]) {
              emptyRooms.push(i * 100 + j);
            }
          }
        }

        console.log(emptyRooms.join(", "));
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
