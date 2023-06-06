import { Player } from "bdsx/bds/player";
import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import * as fs from "fs";
import * as path from "path";

let players: Record<string, string> = {};

const filePath = path.join(__dirname, "players.json");

try {
    players = require(filePath);
} catch(err) {}

export namespace PlayerInfo {

    /**Get all online players */
    export function getActivePlayers(): Player[] {
        return bedrockServer.serverInstance.getPlayers();
    }

    /**Get Active Player By Xuid */
    export function getPlayerByXuid(xuid: string): Player|null {
        return bedrockServer.level.getPlayerByXuid(xuid);
    }

    /**Get Xuid by Name */
    export function getXuid(name: string): string|undefined {
        if (!players.hasOwnProperty(name)) return undefined;
        return players[name];
    }

    /**Get Name by Xuid */
    export function getName(xuid: string): string|undefined {
        let result: string|undefined = undefined;
        for (const key in players) {
            if (players[key] === xuid) result=key;
        }
        return result;
    }

    export function getXuids(names: string[]): string[] {
        let result: string[] = [];
        names.forEach((name) => {
            const xuid = getXuid(name) ?? name;
            if (xuid) result.push(xuid);
            else result.push(name);
        });
        return result;
    }

    export function getNames(xuids: string[]): string[] {
        let result: string[] = [];
        xuids.forEach((xuid) => {
            const name = getName(xuid) ?? xuid;
            if (name) result.push(name);
            else result.push(xuid);
        });
        return result;
    }

    export function setPlayer(player: Player): void {
        if (player.getXuid() === "") return;
        else players[player.getName()]=player.getXuid();
        save();
    }

    export function save(): void {
        fs.writeFileSync(filePath, JSON.stringify(players), "utf8");
    }
}

events.playerJoin.on((ev) => PlayerInfo.setPlayer(ev.player));