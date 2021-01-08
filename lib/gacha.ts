import fs from "fs";
import path from "path";

export interface GachaInfo {
    name: string;
    assetbundleName: string;
    startAt: number;
    endAt: number;
    rates: number[];
    cardRates: CardRate[][];
}

export interface Card {
    rarity: number;
    attr: string;
    assetbundleName: string;
}

export interface CardRate {
    p: string;
    cards: Card[];
}

export function getGacha(): GachaInfo {
    let eventFile = fs.readFileSync(path.join(process.cwd(), 'data/gacha.json'), 'utf8');
    return JSON.parse(eventFile) as GachaInfo;
}