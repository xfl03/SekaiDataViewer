import fs from "fs";
import path from "path";

export interface Difficulty {
    musicDifficulty: string;
    playLevel: number;
    noteCount: number;
}

export interface Character {
    characterType: string;
    characterId: number;
}

export interface Vocal {
    musicVocalType: string;
    characters: Character[];
}

export interface MusicInfo {
    categories: string[];
    title: string;
    lyricist: string;//作词
    composer: string;//作曲
    arranger: string;//编曲
    publishedAt: number;
    assetbundleName: string;
    duration: number;
    difficulties: Difficulty[];
    vocals: Vocal[];
}

export function getMusic(): MusicInfo {
    let musicFile = fs.readFileSync(path.join(process.cwd(), 'data/music.json'), 'utf8');
    return JSON.parse(musicFile) as MusicInfo;
}