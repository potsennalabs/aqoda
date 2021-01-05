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
  let hotel = {};
  let keycard = {};

  commands.forEach((command) => {
    if (!command.name) return
    switch (command.name) {
      case "create_hotel": {
        const [floor, roomPerFloor] = command.params;
        hotel = { floor, roomPerFloor };
        rooms = Array.from({ length: floor }).map(() =>
          Array.from({ length: roomPerFloor })
        );

        for (let k = 1; k <= floor * roomPerFloor; k++) {
          keycard = { ...keycard, [k]: { isAvailable: true } };
        }

        console.log(
          `Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`
        );
        return;
      }
      case "book": {
        const [number, name, age] = command.params;
        const fl = Math.floor(number / 100);
        const roomNumber = Math.floor(number % 100);
        const room = rooms[fl - 1][roomNumber - 1];
        const key = Object.keys(keycard).find(
          (item) => keycard[item].isAvailable
        );
        if (!room) {
          keycard[key].isAvailable = false;
          rooms[fl - 1][roomNumber - 1] = {
            name,
            age,
            room: number,
            keycard: key,
            floor: fl,
          };
          console.log(
            `Room ${number} is booked by ${name} with keycard number ${key}.`
          );
        } else {
          console.log(
            `Cannot book room ${number} for ${name}, The room is currently booked by ${room.name}.`
          );
        }
        return;
      }
      case "checkout": {
        const [keycardNumber, name] = command.params;
        for (let i = 0; i < hotel.floor; i++) {
          for (let j = 0; j < hotel.roomPerFloor; j++) {
            if (
              rooms[i][j] &&
              rooms[i][j].name === name &&
              +rooms[i][j].keycard === +keycardNumber
            ) {
              console.log(`Room ${rooms[i][j].room} is checkout.`);
              rooms[i][j] = undefined;
              keycard[keycardNumber].isAvailable = true;
              return;
            }
          }
        }
        return;
      }
      case "list_available_rooms": {
        const emptyRooms = [];

        for (let i = 1; i <= hotel.floor; i++) {
          for (let j = 1; j <= hotel.roomPerFloor; j++) {
            if (!rooms[i - 1][j - 1]) {
              emptyRooms.push(i * 100 + j);
            }
          }
        }

        console.log(emptyRooms.join(", "));
        return
      }
      case "list_guest": {
        let people = [];
        for (let i = 1; i <= hotel.floor; i++) {
          for (let j = 1; j <= hotel.roomPerFloor; j++) {
            if (rooms[i - 1][j - 1]) {
              people.push(rooms[i - 1][j - 1].name);
            }
          }
        }

        console.log(people.filter((v, i, a) => a.indexOf(v) === i).join(", "));
        return
      }
      case "get_guest_in_room": {
        const [roomNumber] = command.params;

        const booking = rooms.flat().filter(Boolean).find(room => room.room === roomNumber);
        console.log(booking.name);
        return
      }
      case "list_guest_by_age": {
        const [operator, age] = command.params;

        const guestByAge = rooms.flat().filter(Boolean).filter(room => eval(`${room.age} ${operator} ${age}`)).map(room => room.name);
        console.log(guestByAge.join(', '));
        return
      }
      case "list_guest_by_floor": {
        const [floor] = command.params;

        const guestByFloor = rooms.flat().filter(Boolean).filter(room => room.floor === floor).map(room => room.name);
        console.log(guestByFloor.join(', '));
        return
      }
      case "checkout_guest_by_floor": {
        const [floor] = command.params;

        let checkoutRoom = [];
        for (let j = 1; j <= hotel.roomPerFloor; j++) {
          if (rooms[floor - 1][j - 1]) {
            checkoutRoom.push(rooms[floor - 1][j - 1].room);
            keycard[parseInt(rooms[floor - 1][j - 1].keycard)].isAvailable = true;
            rooms[floor - 1][j - 1] = undefined
          }
        }

        console.log(`Room ${checkoutRoom.join(', ')} are checkout.`);
        return
      }
      case "book_by_floor": {
        const [floor, name, age] = command.params;

        for (let j = 1; j <= hotel.roomPerFloor; j++) {
          if (rooms[floor - 1][j - 1]) {
            console.log(`Cannot book floor ${floor} for ${name}.`)
            return
          }
        }

        const bookingRooms = []
        const bookingKeys = []
        for (let j = 1; j <= hotel.roomPerFloor; j++) {
          const roomNumber = `${floor}${j.toString().padStart(2, '0')}`
          const key = Object.keys(keycard).find(
            (item) => keycard[item].isAvailable
          );
          keycard[key].isAvailable = false;
          rooms[floor - 1][j - 1] = {
            name,
            age,
            room: roomNumber,
            keycard: key,
            floor,
          };
          bookingRooms.push(roomNumber)
          bookingKeys.push(key)
        }

        console.log(`Room ${bookingRooms.join(', ')} are booked with keycard number ${bookingKeys.join(', ')}`);
        return
      }
      default:
        console.log(`No command ${command.name}`)
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
