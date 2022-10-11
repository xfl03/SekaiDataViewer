import {GetStaticProps} from "next";
import {Difficulty, getMusic, MusicInfo} from "../lib/music";
import style from '../styles/music.module.css';
import React from "react";
import dateFormat from "dateFormat";

export const difficulties: Record<string, string> = {
    "easy": "#86DA45",
    "normal": "#5FB8E6",
    "hard": "#F3AE3C",
    "expert": "#DC5268",
    "master": "#AC3EE6",
}

export const vocals: Record<string, string> = {
    "original_song": "原曲",
    "sekai": "SEKAI",
    "another_vocal": "其他",
    "virtual_singer": "V家",
    "april_fool_2022": "2022愚人节",
}

export const categories: Record<string, string> = {
    "mv": "3DMV",
    "mv_2d": "2DMV",
    "origin": "原曲MV",
    "image": "静态图像",
}

export const outsideCharacters: Record<number, string> = {
    1: "GUMI",
    2: "IA",
    3: "flower",
    4: "VY2V3",
    5: "音街ウナ",
    6: "歌愛ユキ",
    7: "ネネロボ",
    8: "ミクダヨー",
    9: "可不",
    10: "神威がくぽ",
}

function timeStampToString(timestamp: number): string {
    let date = new Date(timestamp);
    return dateFormat(date, "yyyy/mm/dd HH:MM");
}

function getCharacter(id: number, type: string) {
    if (type == "game_character") {
        return (<div><img alt={id.toString()} src={`/assets/chara_icons/chr_ts_${id}.png`}
                     style={{width: '70px', height: '70px'}}/></div>);
    }
    return (<div>{outsideCharacters[id] === undefined ? `${id}缺失信息` : outsideCharacters[id]}</div>)
}

export default function Music({music}: { music: MusicInfo }) {
    return (
        <div className={style.body}>
            <div className={style.music}>
                <div className={style.music_logo}>
                    <img alt={"logo"} src={`/assets/music/${music.assetbundleName}.webp`}
                         style={{width: '800px', height: '800px'}}/>
                    <div className={style.footer}>
                        仅供参考，请以游戏内信息为准<br/>
                        bilibili @xfl03
                    </div>
                </div>
                <div className={style.music_info}>
                    <div className={music.title.length > 10 ? style.music_info_name_small : style.music_info_name}>
                        {music.title}
                    </div>
                    <div className={style.music_info_author}>
                        {(music.lyricist == music.composer && music.composer == music.arranger) ? `作词、作曲、编曲：${music.lyricist}` : `作词：${music.lyricist}  作曲：${music.composer}  编曲：${music.arranger}`}
                    </div>
                    <div className={style.music_info_duration}>
                        时长：{music.duration} 秒（{Math.floor(music.duration / 60)}分{Math.round((music.duration - Math.floor(music.duration / 60) * 60) * 10) / 10}秒）
                        {categories[music.categories[0]]}
                    </div>
                    <div className={style.music_info_publish}>
                        解锁时间：{timeStampToString(music.publishedAt)}（北京时间）
                    </div>
                    <div className={style.music_info_difficulty}>
                        <div>
                            <div>难度：</div>
                            <div>Combo：</div>
                        </div>
                        {music.difficulties.map(it => (
                            <div key={it.musicDifficulty} className={style.music_info_difficulty_info}
                                 style={{color: difficulties[it.musicDifficulty]}}>
                                <div>{it.playLevel}</div>
                                <div>{it.noteCount}</div>
                            </div>
                        ))}
                    </div>
                    <div className={style.music_info_vocal}>
                        {music.vocals.map(it => (
                            <div key={it.musicVocalType} className={style.music_info_vocal_info}>
                                <div className={style.music_info_vocal_name}>
                                    {vocals[it.musicVocalType]}：
                                </div>
                                {it.characters.map(it => getCharacter(it.characterId, it.characterType))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const music = getMusic();
    return {
        props: {
            music
        }
    }
}