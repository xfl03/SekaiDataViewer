import React from "react";
import {GetStaticProps} from "next";
import {getEvent, EventInfo, Card} from "../lib/event";
import style from "../styles/event.module.css"
import dateFormat from "dateFormat";
import {characters, units} from "../lib/character";
import {chineseSkills} from "../lib/skill";
import {getCardImage, getCharacterIconFile} from "../lib/imageUtils";

function timeStampToString(timestamp: number): string {
    let date = new Date(timestamp);
    return dateFormat(date, "yyyy/mm/dd HH:MM");
}

export default function EventBonus({event}: { event: EventInfo }) {
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

            <div>
                <div>+80%~95%</div>
                <div className={style.card} style={{marginLeft:'40px'}}>
                    {event.ultraBonusCards.map(it => {
                        return (getCardImage(it, false, true))
                    })}
                </div>
            </div>

            {/*Bonus Card info*/}
            <div>
                <div>+50%~75%</div>
                <div className={style.card}>
                    {event.characterBonus.map((it, p) => (
                        <div key={it} className={style.card_detail}>
                            <img className={style.bonus_image} key={it} alt={it.toString()}
                                 src={`/assets/chara_icons/${getCharacterIconFile(it)}`}/>
                            <img className={style.bonus_image} alt={event.attrBonus}
                                 src={`/assets/icon_attribute_${event.attrBonus}.png`}/>
                            {event.bonusCards[p].map(it => {
                                return (getCardImage(it, false, true))
                            })}
                        </div>
                    ))}
                </div>
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
