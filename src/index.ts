import { events } from "bdsx/event";
import { EconomyLand, LandMain } from "..";
import { Player } from "bdsx/bds/player";
import { LandOptions, LandPosXZ } from "./navigation";
import { BlockPos } from "bdsx/bds/blockpos";
import { CANCEL } from "bdsx/common";
import { sendTranslate } from "./utils/translate";
import { DimensionId } from "bdsx/bds/actor";

function protect(player: Player, position: BlockPos = BlockPos.create(player.getPosition()), option?: keyof LandOptions): CANCEL|void {
    const pos = LandPosXZ.create(position);
    const land = EconomyLand.getLand(pos);
    const send = new sendTranslate(player);

    if (player.getDimensionId() !== DimensionId.Overworld) return;
    if (!land) return;
    if (LandMain.isOwner(pos, player)) return;
    if (!option) return CANCEL;

    if (LandMain.isMember(pos, player) && LandMain.getMemberOption(pos, option) === false) {
        send.error("player.error.permission");
        player.playSound("mob.villager.no");
        return CANCEL;
    }
    if (!LandMain.isMember(pos, player) && LandMain.getLandOption(pos, option) === false) {
        send.error("player.error.permission");
        return CANCEL;
    }

    return CANCEL;
}

events.itemUseOnBlock.on((ev) => protect(ev.actor as Player, BlockPos.create(ev.x, ev.y, ev.z), "UseBlock"));
events.blockInteractedWith.on((ev) => protect(ev.player, ev.blockPos, "UseBlock"));
events.farmlandDecay.on((ev) => protect(ev.culprit as Player, ev.blockPos, "UseBlock"));
events.blockDestroy.on((ev) => protect(ev.player, ev.blockPos, "UseBlock"));
events.blockPlace.on((ev) => protect(ev.player, ev.blockPos, "UseBlock"));
events.buttonPress.on((ev) => protect(ev.player, ev.blockPos, "PressButton"));
events.chestOpen.on((ev) => protect(ev.player, ev.blockPos, "OpenChest"));
events.playerSleepInBed.on((ev) => protect(ev.player, ev.pos, "PlayerInteract"));
events.playerInteract.on((ev) => protect(ev.player, BlockPos.create(ev.victim.getPosition()), "PlayerInteract"));
events.playerAttack.on((ev) => {
    if (ev.victim.isPlayer()) return protect(ev.player, BlockPos.create(ev.victim.getPosition()), "PVP");
    if (!ev.victim.hasFamily("monster")) return protect(ev.player, BlockPos.create(ev.victim.getPosition()), "AttackMob");
});
