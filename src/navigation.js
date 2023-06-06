"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandPos = exports.LandPosXZ = void 0;
class LandPosXZ {
    constructor(x, z) {
        this.x = x;
        this.z = z;
    }
    static create(pos) {
        let x = Math.floor(pos.x);
        let z = Math.floor(pos.z);
        return new LandPosXZ(x, z);
    }
    setPos(pos) {
        let x = Math.floor(pos.x);
        let z = Math.floor(pos.z);
        this.x = x;
        this.z = z;
    }
    setX(x) {
        this.x = Math.floor(x);
    }
    setZ(z) {
        this.z = Math.floor(z);
    }
    getX() {
        return Math.floor(this.x);
    }
    getZ() {
        return Math.floor(this.z);
    }
    toString() {
        return `[x: ${this.getX()}, z: ${this.getZ()}]`;
    }
}
exports.LandPosXZ = LandPosXZ;
class LandPos {
    constructor(pos1, pos2) {
        this.pos1 = pos1;
        this.pos2 = pos2;
        if (pos2.x > pos1.x) {
            const old = pos2.x;
            pos2.x = pos1.x;
            pos1.x = old;
        }
        if (pos2.z > pos1.z) {
            const old = pos2.z;
            pos2.z = pos1.z;
            pos1.z = old;
        }
    }
    static create(pos1, pos2) {
        return new LandPos(LandPosXZ.create(pos1), LandPosXZ.create(pos2));
    }
    setPos1(pos) {
        this.pos1 = LandPosXZ.create(pos);
    }
    setPos2(pos) {
        this.pos2 = LandPosXZ.create(pos);
    }
    getPos1() {
        return this.pos1;
    }
    getPos2() {
        return this.pos2;
    }
    getSize() {
        let calculate = Math.abs(this.pos2.x - this.pos1.x) * Math.abs(this.pos2.z - this.pos1.z);
        return calculate;
    }
    toString() {
        return `${this.pos1.toString()}, ${this.pos2.toString()}`;
    }
}
exports.LandPos = LandPos;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hdmlnYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBd0JBLE1BQWEsU0FBUztJQUNsQixZQUFtQixDQUFVLEVBQVMsQ0FBVTtRQUE3QixNQUFDLEdBQUQsQ0FBQyxDQUFTO1FBQVMsTUFBQyxHQUFELENBQUMsQ0FBUztJQUFHLENBQUM7SUFFcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFxQztRQUMvQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxQixPQUFPLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQWtCO1FBQ3JCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFCLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBQ1QsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsSUFBSSxDQUFDLENBQVM7UUFDVixJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksQ0FBQyxDQUFTO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO0lBQ3BELENBQUM7Q0FDSjtBQXJDRCw4QkFxQ0M7QUFFRCxNQUFhLE9BQU87SUFDaEIsWUFBbUIsSUFBZSxFQUFTLElBQWU7UUFBdkMsU0FBSSxHQUFKLElBQUksQ0FBVztRQUFTLFNBQUksR0FBSixJQUFJLENBQVc7UUFDdEQsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQztTQUNkO1FBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQztTQUNkO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBZ0QsRUFBRSxJQUFnRDtRQUM1RyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBK0M7UUFDbkQsSUFBSSxDQUFDLElBQUksR0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBK0M7UUFDbkQsSUFBSSxDQUFDLElBQUksR0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxPQUFPO1FBQ0gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxPQUFPO1FBQ0gsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRixPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0NBQ0o7QUExQ0QsMEJBMENDIn0=