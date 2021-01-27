//=====
//types of rooms that should be returned
//=====

    // pbg - public 1v1 game
    // invg - invitation 1v1 game
    // off1p - one player game in offline
    // off2p - two player game in offline
    // randtr - random tournament game
    // custr - custom tournament game

let roomList = new Map();

const useRoom = ([roomsAbbreviations], io) => {
    
    for (abbreviation in roomsAbbreviations) {
        roomList.set(abbreviation, new RoomNamespace(abbreviation, -1, io));
    }
}

const trackRoom = (namespace, roomId) => {
    roomList.get(namespace).handleRoom(roomId);
}

const trackAll = () => {
    for (let namespace of roomList.keys()){
        namespace.handle
    }
}

//represents a namespace which stores subset of rooms
//and handles them
//is similar to socketio namespace but easier to manipulate and
//to access (client doesn't need to make new connections
// to other namespaces and care about anything on its side)

class RoomNamespace {
    constructor(abbreviaton, maxSize = -1, io) {
        this.abbreviaton = abbreviaton;
        this.maxSize = maxSize;
        this.roomsInSet = new Set() // <roomId>
        this.io = io;
    }

    //if room object size is changed to 0, then its removed
    //if room object size is more than 0 and its not in set, then add it

    //the method below
    //we want to use on crucial steps of app, like
    //when we add 1 or 2 or any number of clients to a room
    //or when we disconnect even 1 client from a room

    async handleRoom(roomId) {
        
        if (this.roomsInSet.has(roomId)) {
            const allSockets = await io.of('/').in('roomId').allSockets();

            if (allSockets || allSockets.size === 0) {
                this.roomsInSet.delete(roomId);
            }
        } 
    }

    getAllRoomNames() {

        for (let room in this.roomsInSet) {
            //[TBD]
        }
    }

    async isEmpty() {
        return this.roomsInSet.size;
    }

}

module.exports = [useRoom, RoomNamespace, roomList, trackRoom]