import fs from "fs";
import path from "path";

export interface Card {
    characterId: number;
    supportUnit: string;//none for default
    rarity: number;
    cardRarityType: string;
    attr: string;
    skillId: number;
    prefix: string;
    assetbundleName: string;
    gacha: boolean;
}

export interface EventInfo {
    name: string;
    assetbundleName: string;
    startAt: number;
    aggregateAt: number;
    attrBonus: string;
    characterBonus: number[];
    cards: Card[];
    bonusCards: Card[][];
    ultraBonusCards: Card[];
}

export function getEvent(): EventInfo {
    let eventFile = fs.readFileSync(path.join(process.cwd(), 'data/event.json'), 'utf8');
    return JSON.parse(eventFile) as EventInfo;
}