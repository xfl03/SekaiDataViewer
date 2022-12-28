import React from "react";
import {GetStaticProps} from "next";
import {getEvent, EventInfo} from "../lib/event";
import style from "../styles/event.module.css"
import dateFormat from "dateFormat";
import {characters, units} from "../lib/character";
import {chineseSkills, chineseSkillsSize} from "../lib/skill";
import {getCardImage, getCharacterIconFile} from "../lib/imageUtils";

function timeStampToString(timestamp: number): string {
    let date = new Date(timestamp);
    return dateFormat(date, "yyyy/mm/dd HH:MM");
}

export default function Event({event}: { event: EventInfo }) {
    return (
        <div className={style.body}>
            {/*Event info*/}
            <div className={style.event}>
                <div className={style.event_logo}>
                    <img src={`/assets/event/${event.assetbundleName}.webp`} alt={"logo"}/>
                </div>
                <div className={style.event_info}>
                    <div className={style.event_info_name}>
                        {event.name}
                    </div>
                    <div>
                        {`${timeStampToString(event.startAt)} ~ ${timeStampToString(event.aggregateAt)}（北京时间）`}
                    </div>
                    <div className={style.event_info_bonus}>
                        {event.characterBonus.map(it => (
                            <img key={it} alt={it.toString()} src={`/assets/chara_icons/${getCharacterIconFile(it)}`}/>
                        ))}
                        <div className={style.event_info_plus}>
                            &nbsp;+&nbsp;
                        </div>
                        <img className={style.event_info_bonus_attr} alt={event.attrBonus}
                             src={`/assets/icon_attribute_${event.attrBonus}.png`}/>
                    </div>
                </div>
            </div>

            {/*Card info*/}
            {/*<div className={style.card} style={{maxHeight:event.cards.length>6?'750px':'600px'}}>*/}
            <div className={style.card}>
                {event.cards.map(it => (
                    <div key={it.characterId} className={style.card_detail}>
                        {getCardImage(it, true)}
                        {getCardImage(it, false)}
                        <div style={{marginLeft: '1rem'}}>
                            <div style={{fontSize: '1.6rem', color: 'white'}}>
                                {it.prefix}
                            </div>
                            <div style={{fontSize: '1.2rem'}}>
                                {it.gacha ? "卡池招募" : "活动兑换"} {characters[it.characterId]}{it.supportUnit==="none"?"":`（${units[it.supportUnit]}）`}
                            </div>
                            <div style={{fontSize: chineseSkillsSize[it.skillId], whiteSpace: 'pre-line'}}>
                                {chineseSkills[it.skillId]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={style.footer}>
                仅供参考，请以游戏内信息为准<br/>
                bilibili @xfl03
            </div>
        </div>
    );
}
export const getStaticProps: GetStaticProps = async () => {
    const event = getEvent();
    return {
        props: {
            event
        }
    }
}
