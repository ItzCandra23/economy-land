import { Player } from "bdsx/bds/player";
import { events } from "bdsx/event";
import { EconomyX } from "@bdsx/economy-x";
import { send, sendTranslate } from "./src/utils/translate";
import { LandOptions, LandPos, LandPosXZ } from "./src/navigation";
import { PlayerInfo } from "./src/utils/playerinfo";
import * as path from "path";
import * as fs from "fs";

export interface LandData {
    owner: string;
    options: LandOptions;
    member_options: LandOptions;
    members: string[];
    name: string;
    landpos: LandPos;
}

let config: {
    price: number;
    sell: number;
    land_size: {
        min: number;
        max: number;
    };
} = {
    price: 1,
    sell: 1,
    land_size: {
        min: 9,
        max: 2000,
    },
};

let lands: LandData[] = [];

const configPath = path.join(__dirname, "config.json");
const landsPath = path.join(__dirname, "lands.json");

try {
    config = require(configPath);
    lands = require(landsPath);
} catch(err) {}

/**Main of plugin */
export namespace EconomyLand {

    /**Get price perblock */
    export function getPrice(): number {
        if (config.price < 0||config.price === 0) return 0;
        else return config.price;
    }

    /**Get sell perblock */
    export function getSell(): number {
        if (config.price < 0||config.price === 0) return 0;
        else return config.sell;
    }

    /**Get land price */
    export function getLandPrice(landpos: LandPos): number {
        const size = getSize(landpos);
        if (size <= 0) return 0;
        else return (size*getPrice());
    }

    /**Get land sell */
    export function getLandSell(landpos: LandPos): number {
        const size = getSize(landpos);
        if (size <= 0) return 0;
        else return (size*getSell());
    }

    /**Get max land size */
    export function getMax(): number {
        if (config.land_size.max < 1) return 1;
        else return config.land_size.max;
    }

    /**Get min land size */
    export function getMin(): number {
        if (config.land_size.min < 1) return 1;
        else return config.land_size.min;
    }

    /**Set max land size */
    export function setMax(value: number): boolean {
        if (value < getMin()) return false;

        config.land_size.max=Math.floor(value);
        return true;
    }

    /**Set min land size */
    export function setMin(value: number): boolean {
        if (value < 1) return false;

        config.land_size.min=Math.floor(value);
        return true;
    }

    /**Get all lands */
    export function getLands(): LandData[] {
        return lands;
    }

    /**Check land has claimed or no */
    export function hasClaimed(pos: LandPosXZ): boolean {
        let result: boolean = false;
        lands.forEach((land) => {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.x && landpos.pos1.z >= pos.z && landpos.pos2.x <= pos.x && landpos.pos2.z <= pos.z) result=true;
            else if (landpos.pos1.x <= pos.x && landpos.pos1.z <= pos.z && landpos.pos2.x >= pos.x && landpos.pos2.z >= pos.z) result=true;
            else result=false;
        });
        return result;
    }

    /**Check land has claimed or no by LandPos */
    export function hasClaimedV2(pos: LandPos): boolean {
        let result: boolean = false;
        lands.forEach((land) =>  {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.pos1.x && landpos.pos1.z >= pos.pos1.z && landpos.pos2.x <= pos.pos2.x && landpos.pos2.z <= pos.pos2.z) result=true;
            else if (landpos.pos1.x <= pos.pos1.x && landpos.pos1.z <= pos.pos1.z && landpos.pos2.x >= pos.pos2.x && landpos.pos2.z >= pos.pos2.z) result=true;
            else result=false;
        });
        return result;
    }

    /**Get land size. */
    export function getSize(pos: LandPos): number {
        let calculate = (Math.abs(pos.pos2.x - pos.pos1.x) * Math.abs(pos.pos2.z - pos.pos1.z));
        return calculate;
    }

    /**Get land data from position. */
    export function getLand(pos: LandPosXZ): LandData|undefined {
        let result: LandData|undefined = undefined;
        lands.forEach((land) =>  {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.x && landpos.pos1.z >= pos.z && landpos.pos2.x <= pos.x && landpos.pos2.z <= pos.z) result=land;
            else if (landpos.pos1.x <= pos.x && landpos.pos1.z <= pos.z && landpos.pos2.x >= pos.x && landpos.pos2.z >= pos.z) result=land;
            else result=undefined;
        });
        return result
    }

    /**Save */
    export function save(message: boolean = false) {
        fs.writeFile(configPath, JSON.stringify(config, null, 4), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`config.json ${err}`);
                    throw err;
                }
                else send.success(`config.json Saved!`);
            }
        });
        fs.writeFile(landsPath, JSON.stringify(lands, null, 4), "utf8", (err) => {
            if (message) {
                if (err) {
                    send.error(`lands.json ${err}`);
                    throw err;
                }
                else send.success(`lands.json Saved!`);
            }
        });
    }
}

/**Main of Land */
export namespace LandMain {

    /**Claim a new land */
    export function claim(landPos: LandPos, player: Player, name?: string): boolean {
        const send = new sendTranslate(player);

        if (player.getXuid() === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (EconomyLand.hasClaimedV2(landPos)) {
            send.error("land.error.hasclaim");
            return false;
        }
        if (EconomyLand.getSize(landPos) > EconomyLand.getMax()||EconomyLand.getSize(landPos) < EconomyLand.getMin()) {
            send.error("player.invalid.size");
            return false;
        }
        if (EconomyX.getMoney(player) < EconomyLand.getLandPrice(landPos)) {
            send.error("player.money.notenough");
            return false;
        }

        let land: LandData = {
            owner: player.getXuid(),
            options: {
                PVP: false,
                OpenChest: false,
                AttackMob: false,
                PressButton: false,
                UseBlock: false,
                UseDoor: false,
                PlayerInteract: false,
            },
            member_options: {
                PVP: false,
                OpenChest: true,
                AttackMob: true,
                PressButton: true,
                UseBlock: true,
                UseDoor: true,
                PlayerInteract: true,
            },
            members: [],
            name: name ?? `${player.getName()} Land`,
            landpos: landPos,
        };

        player.sendMessage(send.text("land.success.claim").replace(/{price}/g, `${EconomyX.currency()}${EconomyLand.getLandPrice(landPos)}`).replace(/{land}/g, land.name).replace(/{pos}/g, landPos.toString()).replace(/{pos1}/g, `[${landPos.pos1.x}, ${landPos.pos1.z}]`).replace(/{pos2}/g, `[${landPos.pos2.x}, ${landPos.pos2.z}]`));
        EconomyX.removeMoney(player, EconomyLand.getLandPrice(landPos));
        lands.push(land);

        return true;
    }

    /**Remove land */
    export function remove(pos: LandPosXZ, player: Player): boolean {
        const send = new sendTranslate(player);
        const land = EconomyLand.getLand(pos);

        if (player.getXuid() === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }

        player.sendMessage(send.text("land.success.remove").replace(/{price}/g, `${EconomyX.currency()}${EconomyLand.getLandSell(land.landpos)}`).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()).replace(/{pos1}/g, `[${land.landpos.pos1.x}, ${land.landpos.pos1.z}]`).replace(/{pos2}/g, `[${land.landpos.pos2.x}, ${land.landpos.pos2.z}]`));
        EconomyX.addMoney(player, EconomyLand.getLandSell(land.landpos));
        lands=lands.filter((v) => v.landpos !== land.landpos);

        return true;
    }

    /**Set land owner */
    export function setOwner(pos: LandPosXZ, player: Player, owner: Player): boolean {
        const land = EconomyLand.getLand(pos);
        const send = new sendTranslate(player);

        if (player.getXuid() === ""||owner.getXuid() === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }
        if (land.owner === owner.getXuid()) {
            send.error("member.error.hasowner");
            return false;
        }
        if (land.members.includes(owner.getXuid())) {
            lands[getLandIndex(pos)].members=lands[getLandIndex(pos)].members.filter((v) => v !== owner.getXuid());
        }

        player.sendMessage(send.text("owner.success.set").replace(/{name}/g, owner.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        owner.sendMessage(send.text("owner.success.set2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].owner=owner.getXuid();

        return true;
    }

    /**Set land owner by xuid */
    export function setOwnerByXuid(pos: LandPosXZ, player: Player, owner: string): boolean {
        const land = EconomyLand.getLand(pos);
        const send = new sendTranslate(player);

        if (player.getXuid() === ""||owner === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }
        if (land.owner === owner) {
            send.error("member.error.hasowner");
            return false;
        }
        if (land.members.includes(owner)) {
            lands[getLandIndex(pos)].members=lands[getLandIndex(pos)].members.filter((v) => v !== owner);
        }

        const _owner = PlayerInfo.getPlayerByXuid(owner);
        player.sendMessage(send.text("owner.success.set").replace(/{name}/g, _owner?.getName() ?? PlayerInfo.getName(owner) ?? owner).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        _owner!.sendMessage(send.text("owner.success.set2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].owner=owner;

        return true;
    }

    /**Check this is member */
    export function isMember(pos: LandPosXZ, player: Player): boolean {
        const land = EconomyLand.getLand(pos);

        if (!land) return false;
        else return land.members.includes(player.getXuid());
    }

    /**Get all members */
    export function getMembers(pos: LandPosXZ): string[]|null {
        const land = EconomyLand.getLand(pos);

        if (!land) return null;
        else return land.members;
    }

    /**Add new member */
    export function addMember(pos: LandPosXZ, player: Player, member: Player): boolean {
        const land = EconomyLand.getLand(pos);
        const send = new sendTranslate(player);

        if (player.getXuid() === ""||member.getXuid() === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }
        if (land.owner === member.getXuid()) {
            send.error("member.error.hasowner");
            return false;
        }
        if (land.members.includes(member.getXuid())) {
            send.error("member.error.hasmember");
            return false;
        }

        player.sendMessage(send.text("member.success.add").replace(/{name}/g, member.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        member.sendMessage(send.text("member.success.add2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].members.push(member.getXuid());

        return true;
    }

    /**Remove a member */
    export function removeMember(pos: LandPosXZ, player: Player, member: Player): boolean {
        const land = EconomyLand.getLand(pos);
        const send = new sendTranslate(player);

        if (player.getXuid() === ""||member.getXuid() === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }
        if (!land.members.includes(member.getXuid())) {
            send.error("member.error.notfound");
            return false;
        }

        player.sendMessage(send.text("member.success.remove").replace(/{name}/g, member.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        member.sendMessage(send.text("member.success.remove2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].members=lands[getLandIndex(pos)].members.filter((v) => v !== member.getXuid());

        return true;
    }

    /**Add new member by xuid */
    export function addMemberByXuid(pos: LandPosXZ, player: Player, member: string): boolean {
        const land = EconomyLand.getLand(pos);
        const send = new sendTranslate(player);

        if (player.getXuid() === ""||member === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }
        if (land.owner === member) {
            send.error("member.error.hasowner");
            return false;
        }
        if (land.members.includes(member)) {
            send.error("member.error.hasmember");
            return false;
        }

        const _member = PlayerInfo.getPlayerByXuid(member);
        player.sendMessage(send.text("member.success.add").replace(/{name}/g, _member?.getName() ?? PlayerInfo.getName(member) ?? member).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        _member!.sendMessage(send.text("member.success.add2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].members.push(member);

        return true;
    }

    /**Remove a member by xuid */
    export function removeMemberByXuid(pos: LandPosXZ, player: Player, member: string): boolean {
        const land = EconomyLand.getLand(pos);
        const send = new sendTranslate(player);

        if (player.getXuid() === ""||member === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }
        if (!land.members.includes(member)) {
            send.error("member.error.notfound");
            return false;
        }

        const _member = PlayerInfo.getPlayerByXuid(member);
        player.sendMessage(send.text("member.success.remove").replace(/{name}/g, _member?.getName() ?? PlayerInfo.getName(member) ?? member).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        _member!.sendMessage(send.text("member.success.remove2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].members=lands[getLandIndex(pos)].members.filter((v) => v !== member);

        return true;
    }

    /**Set land name */
    export function setLandName(pos: LandPosXZ, player: Player, name: string): boolean {
        const land = EconomyLand.getLand(pos);
        const send = new sendTranslate(player);

        if (player.getXuid() === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (!land) {
            send.error("land.error.notfound");
            return false;
        }
        if (land.owner !== player.getXuid()) {
            send.error("player.error.permission");
            return false;
        }
        if (name === "") {
            send.error("player.invalid.name");
            return false;
        }

        player.sendMessage(send.text("land.success.setname").replace(/{land}/g, name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].name=name;

        return true;
    }

    /**Get land options */
    export function getLandOptions(pos: LandPosXZ): LandOptions|null {
        const land = EconomyLand.getLand(pos);
        if (land) return land.options;
        else return null;
    }

    /**Get land option */
    export function getLandOption(pos: LandPosXZ, option: keyof LandOptions): boolean|null {
        const land = EconomyLand.getLand(pos);
        if (!land) return null;
        else return land.options[option].valueOf();
    }

    /**Set land options */
    export function setLandOptions(player: Player, pos: LandPosXZ, option: keyof LandOptions, value: boolean): boolean {
        const idx = getLandIndex(pos);
        if (idx === -1) return false;
        if (!isOwner(pos, player)) {
            send.error("player.error.permission");
            return false;
        }
        return lands[idx].options[option]=value;
    }

    /**Get land member options */
    export function getMemberOptions(pos: LandPosXZ): LandOptions|null {
        const land = EconomyLand.getLand(pos);
        if (land) return land.member_options;
        else return null;
    }

    /**Get land member option */
    export function getMemberOption(pos: LandPosXZ, option: keyof LandOptions): boolean|null {
        const land = EconomyLand.getLand(pos);
        if (!land) return null;
        else return land.member_options[option].valueOf();
    }

    /**Set land member options */
    export function setMemberOptions(player: Player, pos: LandPosXZ, option: keyof LandOptions, value: boolean): boolean {
        const idx = getLandIndex(pos);
        if (idx === -1) return false;
        if (!isOwner(pos, player)) {
            send.error("player.error.permission");
            return false;
        }
        return lands[idx].member_options[option]=value;
    }

    export function isOwner(pos: LandPosXZ, player: Player): boolean {
        const land = EconomyLand.getLand(pos);

        if (!land) return false;
        else return (land.owner === player.getXuid());
    }

    function getLandIndex(pos: LandPosXZ): number {
        let result: number = -1;
        for (const [i, land] of lands.entries()) {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.x && landpos.pos1.z >= pos.z && landpos.pos2.x <= pos.x && landpos.pos2.z <= pos.z) result=i;
            else if (landpos.pos1.x <= pos.x && landpos.pos1.z <= pos.z && landpos.pos2.x >= pos.x && landpos.pos2.z >= pos.z) result=i;
            else result=-1;
        }
        return result;
    }
}

events.serverOpen.on(() => {
    send.success("Started!");
    require("./src");
    require("./src/commands");
    require("./src/utils/playerinfo");
});

events.serverClose.on(() => {
    EconomyLand.save(true);
});