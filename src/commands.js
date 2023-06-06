"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("bdsx/bds/command");
const command_2 = require("bdsx/command");
const nativetype_1 = require("bdsx/nativetype");
const actor_1 = require("bdsx/bds/actor");
const translate_1 = require("./utils/translate");
const __1 = require("..");
const navigation_1 = require("./navigation");
const playerinfo_1 = require("./utils/playerinfo");
const economy_x_1 = require("@bdsx/economy-x");
const form_1 = require("bdsx/bds/form");
const cmd = command_2.command.register("land", translate_1.send.text("command.land.description"));
// Land Claim Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPos.create(p.pos1.getPosition(o), p.pos2.getPosition(o));
    __1.LandMain.claim(pos, player);
}, {
    claim: command_2.command.enum("EcoLand_claim", "claim"),
    pos1: command_1.CommandPosition,
    pos2: command_1.CommandPosition,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPos.create(p.pos1.getPosition(o), p.pos2.getPosition(o));
    __1.LandMain.claim(pos, player, p.name);
}, {
    claim: command_2.command.enum("EcoLand_claim", "claim"),
    pos1: command_1.CommandPosition,
    pos2: command_1.CommandPosition,
    name: nativetype_1.CxxString,
});
// Land Remove Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    __1.LandMain.remove(navigation_1.LandPosXZ.create(player.getPosition()), player);
}, {
    remove: command_2.command.enum("EcoLand_remove", "remove"),
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    __1.LandMain.remove(navigation_1.LandPosXZ.create(p.land.getPosition(o)), player);
}, {
    remove: command_2.command.enum("EcoLand_remove", "remove"),
    land: command_1.CommandPosition,
});
// Land Check Commands
cmd.overload((p, o) => {
    var _a;
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    const land = __1.EconomyLand.getLand(pos);
    if (!land) {
        translate_1.send.error("land.error.notfound", player);
        return;
    }
    const check = new form_1.SimpleForm("--+ §2Land§eCheck§r +--");
    const landpos = navigation_1.LandPos.create(land.landpos.pos1, land.landpos.pos2);
    let content = `Name: §a${land.name}§r\nOwner: §a${(_a = playerinfo_1.PlayerInfo.getName(land.owner)) !== null && _a !== void 0 ? _a : land.owner}§r\nLand: §a${landpos.toString()}§r\nSize: §a${landpos.getSize()} Blocks`;
    check.setContent(content);
    check.sendTo(player.getNetworkIdentifier());
}, {
    check: command_2.command.enum("EcoLand_check", "check"),
});
cmd.overload((p, o) => {
    var _a;
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(p.land.getPosition(o));
    const land = __1.EconomyLand.getLand(pos);
    if (!land) {
        translate_1.send.error("land.error.notfound", player);
        return;
    }
    const check = new form_1.SimpleForm("--+ §2Land§eCheck§r +--");
    const landpos = navigation_1.LandPos.create(land.landpos.pos1, land.landpos.pos2);
    let content = `Name: §a${land.name}§r\nOwner: §a${(_a = playerinfo_1.PlayerInfo.getName(land.owner)) !== null && _a !== void 0 ? _a : land.owner}§r\nLand: §a${landpos.toString()}§r\nSize: §a${landpos.getSize()} Blocks`;
    check.setContent(content);
    check.sendTo(player.getNetworkIdentifier());
}, {
    check: command_2.command.enum("EcoLand_check", "check"),
    land: command_1.CommandPosition,
});
// Land price
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    player.sendMessage(`Buy: §e${economy_x_1.EconomyX.currency()}${__1.EconomyLand.getPrice()}/Block§r\nSell: §e${economy_x_1.EconomyX.currency()}${__1.EconomyLand.getSell()}/Block`);
}, {
    price: command_2.command.enum("EcoLand_price", "price"),
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(p.land.getPosition(o));
    const land = __1.EconomyLand.getLand(pos);
    if (!land) {
        translate_1.send.error("land.error.notfound", player);
        return;
    }
    player.sendMessage(`Buy: §e${economy_x_1.EconomyX.currency()}${__1.EconomyLand.getLandPrice(land.landpos)}§r\nSell: §e${economy_x_1.EconomyX.currency()}${__1.EconomyLand.getLandSell(land.landpos)}§r\nSize: §a${__1.EconomyLand.getSize(land.landpos)} Blocks`);
}, {
    price: command_2.command.enum("EcoLand_price", "price"),
    land: command_1.CommandPosition,
});
// Land Change Owner Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    for (const target of p.target.newResults(o)) {
        __1.LandMain.setOwner(pos, player, target);
    }
}, {
    setowner: command_2.command.enum("EcoLand_setowner", "setowner"),
    target: command_1.PlayerCommandSelector,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(p.land.getPosition(o));
    for (const target of p.target.newResults(o)) {
        __1.LandMain.setOwner(pos, player, target);
    }
}, {
    setowner: command_2.command.enum("EcoLand_setowner", "setowner"),
    target: command_1.PlayerCommandSelector,
    land: command_1.CommandPosition,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const target = playerinfo_1.PlayerInfo.getXuid(p.target);
    if (!target) {
        translate_1.send.error("player.notfound", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    __1.LandMain.setOwnerByXuid(pos, player, target);
}, {
    setowner: command_2.command.enum("EcoLand_setowner", "setowner"),
    target: nativetype_1.CxxString,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const target = playerinfo_1.PlayerInfo.getXuid(p.target);
    if (!target) {
        translate_1.send.error("player.notfound", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(p.land.getPosition(o));
    __1.LandMain.setOwnerByXuid(pos, player, target);
}, {
    setowner: command_2.command.enum("EcoLand_setowner", "setowner"),
    target: nativetype_1.CxxString,
    land: command_1.CommandPosition,
});
// Land Add or Remove Member Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    for (const target of p.target.newResults(o)) {
        if (p.member === "addmember")
            __1.LandMain.addMember(pos, player, target);
        if (p.member === "removemember")
            __1.LandMain.removeMember(pos, player, target);
    }
}, {
    member: command_2.command.enum("EcoLand_member", "addmember", "removemember"),
    target: command_1.PlayerCommandSelector,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(p.land.getPosition(o));
    for (const target of p.target.newResults(o)) {
        if (p.member === "addmember")
            __1.LandMain.addMember(pos, player, target);
        if (p.member === "removemember")
            __1.LandMain.removeMember(pos, player, target);
    }
}, {
    member: command_2.command.enum("EcoLand_member", "addmember", "removemember"),
    target: command_1.PlayerCommandSelector,
    land: command_1.CommandPosition,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const target = playerinfo_1.PlayerInfo.getXuid(p.target);
    if (!target) {
        translate_1.send.error("player.notfound", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    if (p.member === "addmember")
        __1.LandMain.addMemberByXuid(pos, player, target);
    if (p.member === "removemember")
        __1.LandMain.removeMemberByXuid(pos, player, target);
}, {
    member: command_2.command.enum("EcoLand_member", "addmember", "removemember"),
    target: nativetype_1.CxxString,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const target = playerinfo_1.PlayerInfo.getXuid(p.target);
    if (!target) {
        translate_1.send.error("player.notfound", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(p.land.getPosition(o));
    if (p.member === "addmember")
        __1.LandMain.addMemberByXuid(pos, player, target);
    if (p.member === "removemember")
        __1.LandMain.removeMemberByXuid(pos, player, target);
}, {
    member: command_2.command.enum("EcoLand_member", "addmember", "removemember"),
    target: nativetype_1.CxxString,
    land: command_1.CommandPosition,
});
// Land Get Members
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    const xuids = __1.LandMain.getMembers(pos);
    if (!xuids) {
        translate_1.send.error("land.error.notfound", player);
        return;
    }
    if (!__1.LandMain.isOwner(pos, player)) {
        translate_1.send.error("player.error.permission", player);
        return;
    }
    const members = playerinfo_1.PlayerInfo.getNames(xuids);
    player.sendMessage(translate_1.send.text("land.members").replace(/{members}/g, `${members.toString().replace(/,/g, ", ")}`));
}, {
    member: command_2.command.enum("EcoLand_getmember", "members"),
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(p.land.getPosition(o));
    const xuids = __1.LandMain.getMembers(pos);
    if (!xuids) {
        translate_1.send.error("land.error.notfound", player);
        return;
    }
    if (!__1.LandMain.isOwner(pos, player)) {
        translate_1.send.error("player.error.permission", player);
        return;
    }
    const members = playerinfo_1.PlayerInfo.getNames(xuids);
    player.sendMessage(translate_1.send.text("land.members").replace(/{members}/g, `${members.toString().replace(/,/g, ", ")}`));
}, {
    member: command_2.command.enum("EcoLand_getmember", "members"),
    land: command_1.CommandPosition,
});
// Land Options Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    const land = __1.EconomyLand.getLand(pos);
    if (!land) {
        translate_1.send.error("land.error.notfound", player);
        return;
    }
    if (!__1.LandMain.isOwner(pos, player)) {
        translate_1.send.error("player.error.permission", player);
        return;
    }
    if (p.options === "options") {
        let options = Object.keys(land.options);
        let message = `NormalOptions:`;
        options.forEach((v) => {
            message += `\n §d- §r${v}: §a${land.options[v]}`;
        });
        const form = new form_1.SimpleForm(`---+ §a${land.name}§r +---`);
        form.setContent(message);
        form.sendTo(player.getNetworkIdentifier());
        return;
    }
    if (p.options === "member_options") {
        let options = Object.keys(land.member_options);
        let message = `MemberOptions:`;
        options.forEach((v) => {
            message += `\n §d- §r${v}: §a${land.member_options[v]}`;
        });
        const form = new form_1.SimpleForm(`---+ §a${land.name}§r +---`);
        form.setContent(message);
        form.sendTo(player.getNetworkIdentifier());
        return;
    }
}, {
    options: command_2.command.enum("EcoLand_options", "options", "member_options"),
});
// Set Land Options Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        translate_1.send.error("command.error.console");
        return;
    }
    if (!player.isPlayer())
        return;
    if (player.getDimensionId() !== actor_1.DimensionId.Overworld) {
        translate_1.send.error("player.error.dimension", player);
        return;
    }
    const pos = navigation_1.LandPosXZ.create(player.getPosition());
    const land = __1.EconomyLand.getLand(pos);
    if (!land) {
        translate_1.send.error("land.error.notfound", player);
        return;
    }
    if (!__1.LandMain.isOwner(pos, player)) {
        translate_1.send.error("player.error.permission", player);
        return;
    }
    if (p.options === "options") {
        land.options[p.option] = p.value;
        player.sendMessage(`§a${p.option}: §r${p.value}`);
        return;
    }
    if (p.options === "member_options") {
        land.member_options[p.option] = p.value;
        player.sendMessage(`§a${p.option}: §r${p.value}`);
        return;
    }
}, {
    options: command_2.command.enum("EcoLand_options", "options", "member_options"),
    option: command_2.command.enum("EcoLand_optionselector", "PVP", "OpenChest", "AttackMob", "UseBlock", "UseDoor", "PressButton", "PlayerInteract"),
    value: nativetype_1.bool_t,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUFrRztBQUNsRywwQ0FBdUM7QUFDdkMsZ0RBQTZEO0FBQzdELDBDQUE2QztBQUM3QyxpREFBeUM7QUFDekMsMEJBQTJDO0FBQzNDLDZDQUErRDtBQUMvRCxtREFBZ0Q7QUFDaEQsK0NBQTJDO0FBQzNDLHdDQUEyQztBQUUzQyxNQUFNLEdBQUcsR0FBRyxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsZ0JBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBRTVFLHNCQUFzQjtBQUN0QixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2xCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM3QixJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7UUFDakIsZ0JBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNwQyxPQUFPO0tBQ1Y7SUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUFFLE9BQU87SUFDL0IsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFLEtBQUssbUJBQVcsQ0FBQyxTQUFTLEVBQUU7UUFDbkQsZ0JBQUksQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsT0FBTztLQUNWO0lBRUQsTUFBTSxHQUFHLEdBQUcsb0JBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RSxZQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNoQyxDQUFD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