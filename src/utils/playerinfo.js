"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInfo = void 0;
const event_1 = require("bdsx/event");
const launcher_1 = require("bdsx/launcher");
const fs = require("fs");
const path = require("path");
let players = {};
const filePath = path.join(__dirname, "players.json");
try {
    players = require(filePath);
}
catch (err) { }
var PlayerInfo;
(function (PlayerInfo) {
    /**Get all online players */
    function getActivePlayers() {
        return launcher_1.bedrockServer.serverInstance.getPlayers();
    }
    PlayerInfo.getActivePlayers = getActivePlayers;
    /**Get Active Player By Xuid */
    function getPlayerByXuid(xuid) {
        return launcher_1.bedrockServer.level.getPlayerByXuid(xuid);
    }
    PlayerInfo.getPlayerByXuid = getPlayerByXuid;
    /**Get Xuid by Name */
    function getXuid(name) {
        if (!players.hasOwnProperty(name))
            return undefined;
        return players[name];
    }
    PlayerInfo.getXuid = getXuid;
    /**Get Name by Xuid */
    function getName(xuid) {
        let result = undefined;
        for (const key in players) {
            if (players[key] === xuid)
                result = key;
        }
        return result;
    }
    PlayerInfo.getName = getName;
    function getXuids(names) {
        let result = [];
        names.forEach((name) => {
            var _a;
            const xuid = (_a = getXuid(name)) !== null && _a !== void 0 ? _a : name;
            if (xuid)
                result.push(xuid);
            else
                result.push(name);
        });
        return result;
    }
    PlayerInfo.getXuids = getXuids;
    function getNames(xuids) {
        let result = [];
        xuids.forEach((xuid) => {
            var _a;
            const name = (_a = getName(xuid)) !== null && _a !== void 0 ? _a : xuid;
            if (name)
                result.push(name);
            else
                result.push(xuid);
        });
        return result;
    }
    PlayerInfo.getNames = getNames;
    function setPlayer(player) {
        if (player.getXuid() === "")
            return;
        else
            players[player.getName()] = player.getXuid();
        save();
    }
    PlayerInfo.setPlayer = setPlayer;
    function save() {
        fs.writeFileSync(filePath, JSON.stringify(players), "utf8");
    }
    PlayerInfo.save = save;
})(PlayerInfo = exports.PlayerInfo || (exports.PlayerInfo = {}));
event_1.events.playerJoin.on((ev) => PlayerInfo.setPlayer(ev.player));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyaW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBsYXllcmluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esc0NBQW9DO0FBQ3BDLDRDQUE4QztBQUM5Qyx5QkFBeUI7QUFDekIsNkJBQTZCO0FBRTdCLElBQUksT0FBTyxHQUEyQixFQUFFLENBQUM7QUFFekMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFFdEQsSUFBSTtJQUNBLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDL0I7QUFBQyxPQUFNLEdBQUcsRUFBRSxHQUFFO0FBRWYsSUFBaUIsVUFBVSxDQXdEMUI7QUF4REQsV0FBaUIsVUFBVTtJQUV2Qiw0QkFBNEI7SUFDNUIsU0FBZ0IsZ0JBQWdCO1FBQzVCLE9BQU8sd0JBQWEsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDckQsQ0FBQztJQUZlLDJCQUFnQixtQkFFL0IsQ0FBQTtJQUVELCtCQUErQjtJQUMvQixTQUFnQixlQUFlLENBQUMsSUFBWTtRQUN4QyxPQUFPLHdCQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRmUsMEJBQWUsa0JBRTlCLENBQUE7SUFFRCxzQkFBc0I7SUFDdEIsU0FBZ0IsT0FBTyxDQUFDLElBQVk7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFDcEQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUhlLGtCQUFPLFVBR3RCLENBQUE7SUFFRCxzQkFBc0I7SUFDdEIsU0FBZ0IsT0FBTyxDQUFDLElBQVk7UUFDaEMsSUFBSSxNQUFNLEdBQXFCLFNBQVMsQ0FBQztRQUN6QyxLQUFLLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRTtZQUN2QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJO2dCQUFFLE1BQU0sR0FBQyxHQUFHLENBQUM7U0FDekM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBTmUsa0JBQU8sVUFNdEIsQ0FBQTtJQUVELFNBQWdCLFFBQVEsQ0FBQyxLQUFlO1FBQ3BDLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7O1lBQ25CLE1BQU0sSUFBSSxHQUFHLE1BQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxtQ0FBSSxJQUFJLENBQUM7WUFDbkMsSUFBSSxJQUFJO2dCQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O2dCQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQVJlLG1CQUFRLFdBUXZCLENBQUE7SUFFRCxTQUFnQixRQUFRLENBQUMsS0FBZTtRQUNwQyxJQUFJLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFOztZQUNuQixNQUFNLElBQUksR0FBRyxNQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUNBQUksSUFBSSxDQUFDO1lBQ25DLElBQUksSUFBSTtnQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztnQkFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFSZSxtQkFBUSxXQVF2QixDQUFBO0lBRUQsU0FBZ0IsU0FBUyxDQUFDLE1BQWM7UUFDcEMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtZQUFFLE9BQU87O1lBQy9CLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDaEQsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDO0lBSmUsb0JBQVMsWUFJeEIsQ0FBQTtJQUVELFNBQWdCLElBQUk7UUFDaEIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRmUsZUFBSSxPQUVuQixDQUFBO0FBQ0wsQ0FBQyxFQXhEZ0IsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUF3RDFCO0FBRUQsY0FBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMifQ==