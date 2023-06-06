"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandMain = exports.EconomyLand = void 0;
const event_1 = require("bdsx/event");
const economy_x_1 = require("@bdsx/economy-x");
const translate_1 = require("./src/utils/translate");
const playerinfo_1 = require("./src/utils/playerinfo");
const path = require("path");
const fs = require("fs");
let config = {
    price: 1,
    sell: 1,
    land_size: {
        min: 9,
        max: 2000,
    },
};
let lands = [];
const configPath = path.join(__dirname, "config.json");
const landsPath = path.join(__dirname, "lands.json");
try {
    config = require(configPath);
    lands = require(landsPath);
}
catch (err) { }
/**Main of plugin */
var EconomyLand;
(function (EconomyLand) {
    /**Get price perblock */
    function getPrice() {
        if (config.price < 0 || config.price === 0)
            return 0;
        else
            return config.price;
    }
    EconomyLand.getPrice = getPrice;
    /**Get sell perblock */
    function getSell() {
        if (config.price < 0 || config.price === 0)
            return 0;
        else
            return config.sell;
    }
    EconomyLand.getSell = getSell;
    /**Get land price */
    function getLandPrice(landpos) {
        const size = getSize(landpos);
        if (size <= 0)
            return 0;
        else
            return (size * getPrice());
    }
    EconomyLand.getLandPrice = getLandPrice;
    /**Get land sell */
    function getLandSell(landpos) {
        const size = getSize(landpos);
        if (size <= 0)
            return 0;
        else
            return (size * getSell());
    }
    EconomyLand.getLandSell = getLandSell;
    /**Get max land size */
    function getMax() {
        if (config.land_size.max < 1)
            return 1;
        else
            return config.land_size.max;
    }
    EconomyLand.getMax = getMax;
    /**Get min land size */
    function getMin() {
        if (config.land_size.min < 1)
            return 1;
        else
            return config.land_size.min;
    }
    EconomyLand.getMin = getMin;
    /**Set max land size */
    function setMax(value) {
        if (value < getMin())
            return false;
        config.land_size.max = Math.floor(value);
        return true;
    }
    EconomyLand.setMax = setMax;
    /**Set min land size */
    function setMin(value) {
        if (value < 1)
            return false;
        config.land_size.min = Math.floor(value);
        return true;
    }
    EconomyLand.setMin = setMin;
    /**Get all lands */
    function getLands() {
        return lands;
    }
    EconomyLand.getLands = getLands;
    /**Check land has claimed or no */
    function hasClaimed(pos) {
        let result = false;
        lands.forEach((land) => {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.x && landpos.pos1.z >= pos.z && landpos.pos2.x <= pos.x && landpos.pos2.z <= pos.z)
                result = true;
            else if (landpos.pos1.x <= pos.x && landpos.pos1.z <= pos.z && landpos.pos2.x >= pos.x && landpos.pos2.z >= pos.z)
                result = true;
            else
                result = false;
        });
        return result;
    }
    EconomyLand.hasClaimed = hasClaimed;
    /**Check land has claimed or no by LandPos */
    function hasClaimedV2(pos) {
        let result = false;
        lands.forEach((land) => {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.pos1.x && landpos.pos1.z >= pos.pos1.z && landpos.pos2.x <= pos.pos2.x && landpos.pos2.z <= pos.pos2.z)
                result = true;
            else if (landpos.pos1.x <= pos.pos1.x && landpos.pos1.z <= pos.pos1.z && landpos.pos2.x >= pos.pos2.x && landpos.pos2.z >= pos.pos2.z)
                result = true;
            else
                result = false;
        });
        return result;
    }
    EconomyLand.hasClaimedV2 = hasClaimedV2;
    /**Get land size. */
    function getSize(pos) {
        let calculate = (Math.abs(pos.pos2.x - pos.pos1.x) * Math.abs(pos.pos2.z - pos.pos1.z));
        return calculate;
    }
    EconomyLand.getSize = getSize;
    /**Get land data from position. */
    function getLand(pos) {
        let result = undefined;
        lands.forEach((land) => {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.x && landpos.pos1.z >= pos.z && landpos.pos2.x <= pos.x && landpos.pos2.z <= pos.z)
                result = land;
            else if (landpos.pos1.x <= pos.x && landpos.pos1.z <= pos.z && landpos.pos2.x >= pos.x && landpos.pos2.z >= pos.z)
                result = land;
            else
                result = undefined;
        });
        return result;
    }
    EconomyLand.getLand = getLand;
    /**Save */
    function save(message = false) {
        fs.writeFile(configPath, JSON.stringify(config, null, 4), "utf8", (err) => {
            if (message) {
                if (err) {
                    translate_1.send.error(`config.json ${err}`);
                    throw err;
                }
                else
                    translate_1.send.success(`config.json Saved!`);
            }
        });
        fs.writeFile(landsPath, JSON.stringify(lands, null, 4), "utf8", (err) => {
            if (message) {
                if (err) {
                    translate_1.send.error(`lands.json ${err}`);
                    throw err;
                }
                else
                    translate_1.send.success(`lands.json Saved!`);
            }
        });
    }
    EconomyLand.save = save;
})(EconomyLand = exports.EconomyLand || (exports.EconomyLand = {}));
/**Main of Land */
var LandMain;
(function (LandMain) {
    /**Claim a new land */
    function claim(landPos, player, name) {
        const send = new translate_1.sendTranslate(player);
        if (player.getXuid() === "") {
            send.error("player.xuid.notfound");
            return false;
        }
        if (EconomyLand.hasClaimedV2(landPos)) {
            send.error("land.error.hasclaim");
            return false;
        }
        if (EconomyLand.getSize(landPos) > EconomyLand.getMax() || EconomyLand.getSize(landPos) < EconomyLand.getMin()) {
            send.error("player.invalid.size");
            return false;
        }
        if (economy_x_1.EconomyX.getMoney(player) < EconomyLand.getLandPrice(landPos)) {
            send.error("player.money.notenough");
            return false;
        }
        let land = {
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
            name: name !== null && name !== void 0 ? name : `${player.getName()} Land`,
            landpos: landPos,
        };
        player.sendMessage(send.text("land.success.claim").replace(/{price}/g, `${economy_x_1.EconomyX.currency()}${EconomyLand.getLandPrice(landPos)}`).replace(/{land}/g, land.name).replace(/{pos}/g, landPos.toString()).replace(/{pos1}/g, `[${landPos.pos1.x}, ${landPos.pos1.z}]`).replace(/{pos2}/g, `[${landPos.pos2.x}, ${landPos.pos2.z}]`));
        economy_x_1.EconomyX.removeMoney(player, EconomyLand.getLandPrice(landPos));
        lands.push(land);
        return true;
    }
    LandMain.claim = claim;
    /**Remove land */
    function remove(pos, player) {
        const send = new translate_1.sendTranslate(player);
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
        player.sendMessage(send.text("land.success.remove").replace(/{price}/g, `${economy_x_1.EconomyX.currency()}${EconomyLand.getLandSell(land.landpos)}`).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()).replace(/{pos1}/g, `[${land.landpos.pos1.x}, ${land.landpos.pos1.z}]`).replace(/{pos2}/g, `[${land.landpos.pos2.x}, ${land.landpos.pos2.z}]`));
        economy_x_1.EconomyX.addMoney(player, EconomyLand.getLandSell(land.landpos));
        lands = lands.filter((v) => v.landpos !== land.landpos);
        return true;
    }
    LandMain.remove = remove;
    /**Set land owner */
    function setOwner(pos, player, owner) {
        const land = EconomyLand.getLand(pos);
        const send = new translate_1.sendTranslate(player);
        if (player.getXuid() === "" || owner.getXuid() === "") {
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
            lands[getLandIndex(pos)].members = lands[getLandIndex(pos)].members.filter((v) => v !== owner.getXuid());
        }
        player.sendMessage(send.text("owner.success.set").replace(/{name}/g, owner.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        owner.sendMessage(send.text("owner.success.set2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].owner = owner.getXuid();
        return true;
    }
    LandMain.setOwner = setOwner;
    /**Set land owner by xuid */
    function setOwnerByXuid(pos, player, owner) {
        var _a, _b;
        const land = EconomyLand.getLand(pos);
        const send = new translate_1.sendTranslate(player);
        if (player.getXuid() === "" || owner === "") {
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
            lands[getLandIndex(pos)].members = lands[getLandIndex(pos)].members.filter((v) => v !== owner);
        }
        const _owner = playerinfo_1.PlayerInfo.getPlayerByXuid(owner);
        player.sendMessage(send.text("owner.success.set").replace(/{name}/g, (_b = (_a = _owner === null || _owner === void 0 ? void 0 : _owner.getName()) !== null && _a !== void 0 ? _a : playerinfo_1.PlayerInfo.getName(owner)) !== null && _b !== void 0 ? _b : owner).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        _owner.sendMessage(send.text("owner.success.set2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].owner = owner;
        return true;
    }
    LandMain.setOwnerByXuid = setOwnerByXuid;
    /**Check this is member */
    function isMember(pos, player) {
        const land = EconomyLand.getLand(pos);
        if (!land)
            return false;
        else
            return land.members.includes(player.getXuid());
    }
    LandMain.isMember = isMember;
    /**Get all members */
    function getMembers(pos) {
        const land = EconomyLand.getLand(pos);
        if (!land)
            return null;
        else
            return land.members;
    }
    LandMain.getMembers = getMembers;
    /**Add new member */
    function addMember(pos, player, member) {
        const land = EconomyLand.getLand(pos);
        const send = new translate_1.sendTranslate(player);
        if (player.getXuid() === "" || member.getXuid() === "") {
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
    LandMain.addMember = addMember;
    /**Remove a member */
    function removeMember(pos, player, member) {
        const land = EconomyLand.getLand(pos);
        const send = new translate_1.sendTranslate(player);
        if (player.getXuid() === "" || member.getXuid() === "") {
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
        lands[getLandIndex(pos)].members = lands[getLandIndex(pos)].members.filter((v) => v !== member.getXuid());
        return true;
    }
    LandMain.removeMember = removeMember;
    /**Add new member by xuid */
    function addMemberByXuid(pos, player, member) {
        var _a, _b;
        const land = EconomyLand.getLand(pos);
        const send = new translate_1.sendTranslate(player);
        if (player.getXuid() === "" || member === "") {
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
        const _member = playerinfo_1.PlayerInfo.getPlayerByXuid(member);
        player.sendMessage(send.text("member.success.add").replace(/{name}/g, (_b = (_a = _member === null || _member === void 0 ? void 0 : _member.getName()) !== null && _a !== void 0 ? _a : playerinfo_1.PlayerInfo.getName(member)) !== null && _b !== void 0 ? _b : member).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        _member.sendMessage(send.text("member.success.add2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].members.push(member);
        return true;
    }
    LandMain.addMemberByXuid = addMemberByXuid;
    /**Remove a member by xuid */
    function removeMemberByXuid(pos, player, member) {
        var _a, _b;
        const land = EconomyLand.getLand(pos);
        const send = new translate_1.sendTranslate(player);
        if (player.getXuid() === "" || member === "") {
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
        const _member = playerinfo_1.PlayerInfo.getPlayerByXuid(member);
        player.sendMessage(send.text("member.success.remove").replace(/{name}/g, (_b = (_a = _member === null || _member === void 0 ? void 0 : _member.getName()) !== null && _a !== void 0 ? _a : playerinfo_1.PlayerInfo.getName(member)) !== null && _b !== void 0 ? _b : member).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        _member.sendMessage(send.text("member.success.remove2").replace(/{name}/g, player.getName()).replace(/{land}/g, land.name).replace(/{pos}/g, land.landpos.toString()));
        lands[getLandIndex(pos)].members = lands[getLandIndex(pos)].members.filter((v) => v !== member);
        return true;
    }
    LandMain.removeMemberByXuid = removeMemberByXuid;
    /**Set land name */
    function setLandName(pos, player, name) {
        const land = EconomyLand.getLand(pos);
        const send = new translate_1.sendTranslate(player);
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
        lands[getLandIndex(pos)].name = name;
        return true;
    }
    LandMain.setLandName = setLandName;
    /**Get land options */
    function getLandOptions(pos) {
        const land = EconomyLand.getLand(pos);
        if (land)
            return land.options;
        else
            return null;
    }
    LandMain.getLandOptions = getLandOptions;
    /**Get land option */
    function getLandOption(pos, option) {
        const land = EconomyLand.getLand(pos);
        if (!land)
            return null;
        else
            return land.options[option].valueOf();
    }
    LandMain.getLandOption = getLandOption;
    /**Set land options */
    function setLandOptions(player, pos, option, value) {
        const idx = getLandIndex(pos);
        if (idx === -1)
            return false;
        if (!isOwner(pos, player)) {
            translate_1.send.error("player.error.permission");
            return false;
        }
        return lands[idx].options[option] = value;
    }
    LandMain.setLandOptions = setLandOptions;
    /**Get land member options */
    function getMemberOptions(pos) {
        const land = EconomyLand.getLand(pos);
        if (land)
            return land.member_options;
        else
            return null;
    }
    LandMain.getMemberOptions = getMemberOptions;
    /**Get land member option */
    function getMemberOption(pos, option) {
        const land = EconomyLand.getLand(pos);
        if (!land)
            return null;
        else
            return land.member_options[option].valueOf();
    }
    LandMain.getMemberOption = getMemberOption;
    /**Set land member options */
    function setMemberOptions(player, pos, option, value) {
        const idx = getLandIndex(pos);
        if (idx === -1)
            return false;
        if (!isOwner(pos, player)) {
            translate_1.send.error("player.error.permission");
            return false;
        }
        return lands[idx].member_options[option] = value;
    }
    LandMain.setMemberOptions = setMemberOptions;
    function isOwner(pos, player) {
        const land = EconomyLand.getLand(pos);
        if (!land)
            return false;
        else
            return (land.owner === player.getXuid());
    }
    LandMain.isOwner = isOwner;
    function getLandIndex(pos) {
        let result = -1;
        for (const [i, land] of lands.entries()) {
            const landpos = land.landpos;
            if (landpos.pos1.x >= pos.x && landpos.pos1.z >= pos.z && landpos.pos2.x <= pos.x && landpos.pos2.z <= pos.z)
                result = i;
            else if (landpos.pos1.x <= pos.x && landpos.pos1.z <= pos.z && landpos.pos2.x >= pos.x && landpos.pos2.z >= pos.z)
                result = i;
            else
                result = -1;
        }
        return result;
    }
})(LandMain = exports.LandMain || (exports.LandMain = {}));
event_1.events.serverOpen.on(() => {
    translate_1.send.success("Started!");
    require("./src");
    require("./src/commands");
    require("./src/utils/playerinfo");
});
event_1.events.serverClose.on(() => {
    EconomyLand.save(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzQ0FBb0M7QUFDcEMsK0NBQTJDO0FBQzNDLHFEQUE0RDtBQUU1RCx1REFBb0Q7QUFDcEQsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQVd6QixJQUFJLE1BQU0sR0FPTjtJQUNBLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxFQUFFLENBQUM7SUFDUCxTQUFTLEVBQUU7UUFDUCxHQUFHLEVBQUUsQ0FBQztRQUNOLEdBQUcsRUFBRSxJQUFJO0tBQ1o7Q0FDSixDQUFDO0FBRUYsSUFBSSxLQUFLLEdBQWUsRUFBRSxDQUFDO0FBRTNCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRXJELElBQUk7SUFDQSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdCLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Q0FDOUI7QUFBQyxPQUFNLEdBQUcsRUFBRSxHQUFFO0FBRWYsb0JBQW9CO0FBQ3BCLElBQWlCLFdBQVcsQ0E0SDNCO0FBNUhELFdBQWlCLFdBQVc7SUFFeEIsd0JBQXdCO0lBQ3hCLFNBQWdCLFFBQVE7UUFDcEIsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBRSxNQUFNLENBQUMsS0FBSyxLQUFLLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQzs7WUFDOUMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFIZSxvQkFBUSxXQUd2QixDQUFBO0lBRUQsdUJBQXVCO0lBQ3ZCLFNBQWdCLE9BQU87UUFDbkIsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBRSxNQUFNLENB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