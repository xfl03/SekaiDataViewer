import React from "react";
import {GetStaticProps} from "next";
import style from "../styles/event.module.css"
import dateFormat from "dateFormat";
import {characters, units} from "../lib/character";
import {chineseSkills} from "../lib/skill";
import {Card, CardRate, ExchangeInfo, GachaInfo, getExchange, getGacha} from "../lib/gacha";

function timeStampToString(timestamp: number): string {
    if (timestamp === undefined) return "";
    let date = new Date(timestamp);
    return dateFormat(date, "yyyy/mm/dd HH:MM");
}

function getImage(it: Card) {
    let normal = it.rarity < 3;
    return (
        <div className={style.card_detail_image}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156">
                <image href={`/assets/card/${it.assetbundleName}_${normal ? "normal" : "after_training"}.webp`} x="8"
                       y="8" height="140" width="140"/>
                <image href={`/assets/frame/cardFrame_S_${it.rarity}.png`} x="0" y="0" height="156"
                       width="156"/>
                <image href={`/assets/icon_attribute_${it.attr}.png`} x="0" y="0" height="35"
                       width="35"/>
                {Array.from(Array(it.rarity).keys()).map(i => (
                    <image key={i} href={`/assets/rarity_star_${normal ? "normal" : "afterTraining"}.png`}
                           x={8 + i * 22}
                           y="125" width="22"
                           height="22"/>
                ))}
            </svg>
        </div>
    );
}

function getAllCards(cards:Card[],items:number) {
    cards = cards.reverse();
    return (
        <div style={{marginTop: '20px', marginLeft: '40px'}}>
            <div style={{display: "flex",flexWrap:"wrap"}}>
                {cards.map((it, i) => {
                    if (i < items) return getImage(it)
                    else if (i == items) return (<div>等{cards.length}张</div>)
                    else return (<div/>)
                })}
            </div>
        </div>
    );
}

export default function Exchange({exchange}: { exchange: ExchangeInfo }) {
    return (
        <div className={style.body}>
            {/*Event info*/}
            <div className={style.event}>
                <div className={style.event_info}>
                    <div className={style.event_info_name}>
                        {exchange.name}
                    </div>
                    <div>
                        {`${timeStampToString(exchange.startAt)} ~ ${timeStampToString(exchange.endAt)}（北京时间）`}
                    </div>
                </div>
            </div>

            {getAllCards(exchange.cards,43)}

            <div className={style.footer}>
                仅供参考，请以游戏内信息为准<br/>
                bilibili @xfl03
            </div>
        </div>
    );
}
export const getStaticProps: GetStaticProps = async () => {
    const exchange = getExchange();
    return {
        props: {
            exchange
        }
    }
}
