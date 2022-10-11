import fs from "fs";
import path from "path";
import {Card} from "./event";

export interface GachaInfo {
    name: string;
    assetbundleName: string;
    startAt: number;
    endAt: number;
    rates: number[];
    cardRates: CardRate[][];
    selectCards: SelectCard[];
}

export interface CardRate {
    p: string;
    cards: Card[];
}

export interface SelectCard {
    type:string;
    cards: Card[];
}

export interface ExchangeInfo {
    name: string;
    assetbundleName: string;
    startAt: number;
    endAt: number;
    cards: Card[];
}

export function getGacha(): GachaInfo {
    let eventFile = fs.readFileSync(path.join(process.cwd(), 'data/gacha.json'), 'utf8');
    return JSON.parse(eventFile) as GachaInfo;
}

export function getExchange(): ExchangeInfo {
    let eventFile = fs.readFileSync(path.join(process.cwd(), 'data/exchange.json'), 'utf8');
    return JSON.parse(eventFile) as ExchangeInfo;
}