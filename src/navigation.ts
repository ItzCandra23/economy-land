import { BlockPos, Vec3 } from "bdsx/bds/blockpos";
import { VectorXYZ, VectorXZ } from "bdsx/common";
import { int32_t } from "bdsx/nativetype"

export interface LandOptions {
    PVP: boolean;
    OpenChest: boolean;
    AttackMob: boolean;
    UseBlock: boolean;
    UseDoor: Boolean;
    PressButton: boolean;
    PlayerInteract: boolean;
}

export interface LandPosXZ {
    x: int32_t;
    z: int32_t;
}

export interface LandPos {
    pos1: LandPosXZ;
    pos2: LandPosXZ;
}

export class LandPosXZ {
    constructor(public x: int32_t, public z: int32_t) {}

    static create(pos: BlockPos|Vec3|VectorXYZ|VectorXZ): LandPosXZ {
        let x = Math.floor(pos.x);
        let z = Math.floor(pos.z);

        return new LandPosXZ(x, z);
    }

    setPos(pos: BlockPos|Vec3): void {
        let x = Math.floor(pos.x);
        let z = Math.floor(pos.z);

        this.x=x;
        this.z=z;
    }

    setX(x: number): void {
        this.x=Math.floor(x);
    }

    setZ(z: number): void {
        this.z=Math.floor(z);
    }

    getX(): number {
        return Math.floor(this.x);
    }

    getZ(): number {
        return Math.floor(this.z);
    }

    toString(): string {
        return `[x: ${this.getX()}, z: ${this.getZ()}]`;
    }
}

export class LandPos {
    constructor(public pos1: LandPosXZ, public pos2: LandPosXZ) {
        if (pos2.x > pos1.x) {
            const old = pos2.x;
            pos2.x=pos1.x;
            pos1.x=old;
        }
        if (pos2.z > pos1.z) {
            const old = pos2.z;
            pos2.z=pos1.z;
            pos1.z=old;
        }
    }

    static create(pos1: BlockPos|Vec3|VectorXYZ|VectorXZ|LandPosXZ, pos2: BlockPos|Vec3|VectorXYZ|VectorXZ|LandPosXZ): LandPos {
        return new LandPos(LandPosXZ.create(pos1), LandPosXZ.create(pos2));
    }

    setPos1(pos: BlockPos|Vec3|VectorXYZ|VectorXZ|LandPosXZ): void {
        this.pos1=LandPosXZ.create(pos);
    }

    setPos2(pos: BlockPos|Vec3|VectorXYZ|VectorXZ|LandPosXZ): void {
        this.pos2=LandPosXZ.create(pos);
    }

    getPos1(): LandPosXZ {
        return this.pos1;
    }

    getPos2(): LandPosXZ {
        return this.pos2;
    }

    getSize(): number {
        let calculate = Math.abs(this.pos2.x - this.pos1.x) * Math.abs(this.pos2.z - this.pos1.z);
        return calculate;
    }

    toString(): string {
        return `${this.pos1.toString()}, ${this.pos2.toString()}`;
    }
}