import { CommandPosition, PlayerCommandSelector } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { CxxString, bool_t } from "bdsx/nativetype";
import { DimensionId } from "bdsx/bds/actor";
import { send } from "./utils/translate";
import { LandMain, EconomyLand } from "..";
import { LandOptions, LandPos, LandPosXZ } from "./navigation";
import { PlayerInfo } from "./utils/playerinfo";
import { EconomyX } from "@bdsx/economy-x";
import { SimpleForm } from "bdsx/bds/form";

const cmd = command.register("land", send.text("command.land.description"));

// Land Claim Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPos.create(p.pos1.getPosition(o), p.pos2.getPosition(o));
    LandMain.claim(pos, player);
}, {
    claim: command.enum("EcoLand_claim", "claim"),
    pos1: CommandPosition,
    pos2: CommandPosition,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPos.create(p.pos1.getPosition(o), p.pos2.getPosition(o));
    LandMain.claim(pos, player, p.name);
}, {
    claim: command.enum("EcoLand_claim", "claim"),
    pos1: CommandPosition,
    pos2: CommandPosition,
    name: CxxString,
});

// Land Remove Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    LandMain.remove(LandPosXZ.create(player.getPosition()), player);
}, {
    remove: command.enum("EcoLand_remove", "remove"),
})
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    LandMain.remove(LandPosXZ.create(p.land.getPosition(o)), player);
}, {
    remove: command.enum("EcoLand_remove", "remove"),
    land: CommandPosition,
});

// Land Check Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    const land = EconomyLand.getLand(pos);

    if (!land) {
        send.error("land.error.notfound", player);
        return;
    }

    const check = new SimpleForm("--+ §2Land§eCheck§r +--");
    const landpos = LandPos.create(land.landpos.pos1, land.landpos.pos2);
    let content = `Name: §a${land.name}§r\nOwner: §a${PlayerInfo.getName(land.owner) ?? land.owner}§r\nLand: §a${landpos.toString()}§r\nSize: §a${landpos.getSize()} Blocks`;

    check.setContent(content);
    check.sendTo(player.getNetworkIdentifier());
}, {
    check: command.enum("EcoLand_check", "check"),
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(p.land.getPosition(o));
    const land = EconomyLand.getLand(pos);

    if (!land) {
        send.error("land.error.notfound", player);
        return;
    }

    const check = new SimpleForm("--+ §2Land§eCheck§r +--");
    const landpos = LandPos.create(land.landpos.pos1, land.landpos.pos2);
    let content = `Name: §a${land.name}§r\nOwner: §a${PlayerInfo.getName(land.owner) ?? land.owner}§r\nLand: §a${landpos.toString()}§r\nSize: §a${landpos.getSize()} Blocks`;

    check.setContent(content);
    check.sendTo(player.getNetworkIdentifier());
}, {
    check: command.enum("EcoLand_check", "check"),
    land: CommandPosition,
});

// Land price
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    player.sendMessage(`Buy: §e${EconomyX.currency()}${EconomyLand.getPrice()}/Block§r\nSell: §e${EconomyX.currency()}${EconomyLand.getSell()}/Block`);
}, {
    price: command.enum("EcoLand_price", "price"),
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(p.land.getPosition(o));
    const land = EconomyLand.getLand(pos);

    if (!land) {
        send.error("land.error.notfound", player);
        return;
    }

    player.sendMessage(`Buy: §e${EconomyX.currency()}${EconomyLand.getLandPrice(land.landpos)}§r\nSell: §e${EconomyX.currency()}${EconomyLand.getLandSell(land.landpos)}§r\nSize: §a${EconomyLand.getSize(land.landpos)} Blocks`);
}, {
    price: command.enum("EcoLand_price", "price"),
    land: CommandPosition,
});

// Land Change Owner Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    for (const target of p.target.newResults(o)) {
        LandMain.setOwner(pos, player, target);
    }
}, {
    setowner: command.enum("EcoLand_setowner", "setowner"),
    target: PlayerCommandSelector,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(p.land.getPosition(o));
    for (const target of p.target.newResults(o)) {
        LandMain.setOwner(pos, player, target);
    }
}, {
    setowner: command.enum("EcoLand_setowner", "setowner"),
    target: PlayerCommandSelector,
    land: CommandPosition,
});

cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const target = PlayerInfo.getXuid(p.target);
    if (!target) {
        send.error("player.notfound", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    LandMain.setOwnerByXuid(pos, player, target);
}, {
    setowner: command.enum("EcoLand_setowner", "setowner"),
    target: CxxString,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const target = PlayerInfo.getXuid(p.target);
    if (!target) {
        send.error("player.notfound", player);
        return;
    }

    const pos = LandPosXZ.create(p.land.getPosition(o));
    LandMain.setOwnerByXuid(pos, player, target);
}, {
    setowner: command.enum("EcoLand_setowner", "setowner"),
    target: CxxString,
    land: CommandPosition,
});

// Land Add or Remove Member Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    for (const target of p.target.newResults(o)) {
        if (p.member === "addmember") LandMain.addMember(pos, player, target);
        if (p.member === "removemember") LandMain.removeMember(pos, player, target);
    }
}, {
    member: command.enum("EcoLand_member", "addmember", "removemember"),
    target: PlayerCommandSelector,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(p.land.getPosition(o));
    for (const target of p.target.newResults(o)) {
        if (p.member === "addmember") LandMain.addMember(pos, player, target);
        if (p.member === "removemember") LandMain.removeMember(pos, player, target);
    }
}, {
    member: command.enum("EcoLand_member", "addmember", "removemember"),
    target: PlayerCommandSelector,
    land: CommandPosition,
});

cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const target = PlayerInfo.getXuid(p.target);
    if (!target) {
        send.error("player.notfound", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    if (p.member === "addmember") LandMain.addMemberByXuid(pos, player, target);
    if (p.member === "removemember") LandMain.removeMemberByXuid(pos, player, target);
}, {
    member: command.enum("EcoLand_member", "addmember", "removemember"),
    target: CxxString,
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const target = PlayerInfo.getXuid(p.target);
    if (!target) {
        send.error("player.notfound", player);
        return;
    }

    const pos = LandPosXZ.create(p.land.getPosition(o));
    if (p.member === "addmember") LandMain.addMemberByXuid(pos, player, target);
    if (p.member === "removemember") LandMain.removeMemberByXuid(pos, player, target);
}, {
    member: command.enum("EcoLand_member", "addmember", "removemember"),
    target: CxxString,
    land: CommandPosition,
});

// Land Get Members
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    const xuids = LandMain.getMembers(pos);

    if (!xuids) {
        send.error("land.error.notfound", player);
        return;
    }
    if (!LandMain.isOwner(pos, player)) {
        send.error("player.error.permission", player);
        return;
    }

    const members = PlayerInfo.getNames(xuids);
    player.sendMessage(send.text("land.members").replace(/{members}/g, `${members.toString().replace(/,/g, ", ")}`));
}, {
    member: command.enum("EcoLand_getmember", "members"),
});
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(p.land.getPosition(o));
    const xuids = LandMain.getMembers(pos);

    if (!xuids) {
        send.error("land.error.notfound", player);
        return;
    }
    if (!LandMain.isOwner(pos, player)) {
        send.error("player.error.permission", player);
        return;
    }

    const members = PlayerInfo.getNames(xuids);
    player.sendMessage(send.text("land.members").replace(/{members}/g, `${members.toString().replace(/,/g, ", ")}`));
}, {
    member: command.enum("EcoLand_getmember", "members"),
    land: CommandPosition,
});

// Land Options Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    const land = EconomyLand.getLand(pos);

    if (!land) {
        send.error("land.error.notfound", player);
        return;
    }
    if (!LandMain.isOwner(pos, player)) {
        send.error("player.error.permission", player);
        return;
    }

    if (p.options === "options") {
        let options: string[] = Object.keys(land.options);
        let message = `NormalOptions:`;
        options.forEach((v) => {
            message+=`\n §d- §r${v}: §a${land.options[v as keyof LandOptions]}`;
        });
        const form = new SimpleForm(`---+ §a${land.name}§r +---`);
        form.setContent(message);
        form.sendTo(player.getNetworkIdentifier());
        return;
    }
    if (p.options === "member_options") {
        let options: string[] = Object.keys(land.member_options);
        let message = `MemberOptions:`;
        options.forEach((v) => {
            message+=`\n §d- §r${v}: §a${land.member_options[v as keyof LandOptions]}`;
        });
        const form = new SimpleForm(`---+ §a${land.name}§r +---`);
        form.setContent(message);
        form.sendTo(player.getNetworkIdentifier());
        return;
    }
}, {
    options: command.enum("EcoLand_options", "options", "member_options"),
});

// Set Land Options Commands
cmd.overload((p, o) => {
    const player = o.getEntity();
    if (player === null) {
        send.error("command.error.console");
        return;
    }
    if (!player.isPlayer()) return;
    if (player.getDimensionId() !== DimensionId.Overworld) {
        send.error("player.error.dimension", player);
        return;
    }

    const pos = LandPosXZ.create(player.getPosition());
    const land = EconomyLand.getLand(pos);

    if (!land) {
        send.error("land.error.notfound", player);
        return;
    }
    if (!LandMain.isOwner(pos, player)) {
        send.error("player.error.permission", player);
        return;
    }

    if (p.options === "options") {
        land.options[p.option]=p.value;
        player.sendMessage(`§a${p.option}: §r${p.value}`);
        return;
    }
    if (p.options === "member_options") {
        land.member_options[p.option]=p.value;
        player.sendMessage(`§a${p.option}: §r${p.value}`);
        return;
    }
}, {
    options: command.enum("EcoLand_options", "options", "member_options"),
    option: command.enum("EcoLand_optionselector", "PVP", "OpenChest", "AttackMob", "UseBlock", "UseDoor", "PressButton", "PlayerInteract"),
    value: bool_t,
});
