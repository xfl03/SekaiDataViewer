import React from "react";
import {GetStaticProps} from "next";
import {getEvent, EventInfo, Card} from "../lib/event";
import style from "../styles/event.module.css"
import dateFormat from "dateFormat";
import {characters} from "../lib/character";
import {chineseSkills} from "../lib/skill";

function timeStampToString(timestamp: number): string {
    let date = new Date(timestamp);
    return dateFormat(date, "yyyy/mm/dd HH:MM");
}

function getFile(id: number): string {
    return id <= 26 ? `chr_ts_${id}.png` : `chr_ts_21_${id - 25}.png`;
}

function getImage(it: Card, normal: boolean) {
    if (!normal && it.rarity<3) return (<div className={style.card_detail_image} />);
    return (
        <div className={style.card_detail_image}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156">
                <image href={`/assets/card/${it.assetbundleName}_${normal ? "normal" : "after_training"}.webp`} x="8" y="8" height="140" width="140"/>
                <image href={`/assets/frame/cardFrame_S_${it.rarity}.png`} x="0" y="0" height="156"
                       width="156"/>
                <image href={`/assets/icon_attribute_${it.attr}.png`} x="0" y="0" height="35"
                       width="35"/>
                {Array.from(Array(it.rarity).keys()).map(i => (
                    <image key={i} href={`/assets/rarity_star_${normal ? "normal" : "afterTraining"}.png`} x={8 + i * 22}
                           y="125" width="22"
                           height="22"/>
                ))}
            </svg>
        </div>
    );
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
                            <img key={it} alt={it.toString()} src={`/assets/chara_icons/${getFile(it)}`}/>
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
            <div className={style.card}>
                {event.cards.map(it => (
                    <div key={it.characterId} className={style.card_detail}>
                        {getImage(it, true)}
                        {getImage(it, false)}
                        <div style={{marginLeft:'1.5rem'}}>
                            <div style={{fontSize:'1.6rem',color:'white'}}>
                                {it.prefix}
                            </div>
                            <div style={{fontSize:'1.2rem'}}>
                                {it.gacha?"卡池招募":"活动兑换"} {characters[it.characterId]}
                            </div>
                            <div style={{fontSize:'1.4rem',whiteSpace:'pre-line'}}>
                                {chineseSkills[it.skillId]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={style.footer}>
                仅供参考，请以游戏内信息为准<br/>
                BiliBili @xfl03
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
