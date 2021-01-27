//[TBD]
// Must create those methods 
// OR as alternative could extend object's functionality by adding those as methods to socket's object

// we need these functions because in many cases we try to get sockets
// in rooms but we first get string ids, then do lookup, then get them

//these should return objects, not ids

const fn = {
    getSocketByIdAnyRoom: (socketId) => {
        //returns socket object
    },

    getSocketByIdInRoom: (socketId, roomName) => {
        //returns socket object
    },

    getAllSocketsInRoom: (socketId, roomName) => {
        //returns array of socket objects
    },

    getAssociatedRooms: (socketId) => {
        //return array of room ids
    },

    getAllSocketsInMainNamespace: () => {
        //return set of sockets
    },


    //=====
    //types of rooms that should be returned
    //=====

    // pbg - public 1v1 game
    // ig - invitation 1v1 game
    // opg1p - one player game in offline
    // opg2p - two player game in offline
    // rtg - random tournament game
    // ctg - custom tournament game

    getRoomsByAbbreviation: () => {
        //returns set of room objects which start with abbreviation code
    }
}

module.exports = fn;