import fs from "fs";
import path from "path";

export interface PredictDebugRank {
    scores: Array<number>,
    dayScores: Array<number>,
    scorePerNormalDay: number,
    todayScore: number,
    lastDayScore: number,
    result: number,
}

export interface PredictDebug {
    eventType: string,
    days: number,
    eventDayNow: number,
    eventStartTime: number,
    ranks: Record<string, PredictDebugRank>,
}

export interface PredictModel {
    dayPeriod: Record<string, Array<number>>,
    lastDay: Record<string, Array<number>>,
    lastDayPeriod: Record<string, Array<number>>,
}

export interface TopScore {
    uid: string,
    name: string,
    pts: Array<any>
}

export interface TopScores {
    tops: Array<TopScore>,
    eventStartTime: number,
    days: number
}

export function getPredictDebug(): PredictDebug {
    let file = fs.readFileSync(path.join(process.cwd(), 'data/predict-debug.json'), 'utf8');
    return JSON.parse(file) as PredictDebug;
}

export function getPredictModel(eventType: string): PredictModel {
    let file = fs.readFileSync(path.join(process.cwd(), `data/predict_models_${eventType}.json`), 'utf8');
    return JSON.parse(file) as PredictModel;
}

export function getTopScores(): TopScores {
    let file = fs.readFileSync(path.join(process.cwd(), 'data/top-history.json'), 'utf8');
    return JSON.parse(file) as TopScores;
}