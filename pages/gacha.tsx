import React from "react";
import {GetStaticProps} from "next";
import style from "../styles/event.module.css"
import dateFormat from "dateFormat";
import {characters, units} from "../lib/character";
import {chineseSkills} from "../lib/skill";
import {Card, CardRate, GachaInfo, getGacha} from "../lib/gacha";

function timeStampToString(timestamp: number): string {
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

function getRarity(rarity: number) {
    let normal = rarity < 4;
    return (
        <div>
            {Array.from(Array(rarity).keys()).map(i => (
                <img key={i} src={`/assets/rarity_star_${normal ? "normal" : "afterTraining"}.png`}
                     style={{display: "inline"}}/>
            ))}
        </div>
    );
}

function getCardRate(cardRate: CardRate, items: number) {
    let cards = cardRate.cards;
    cards = cards.reverse();
    return (
        <div style={{marginTop: '20px', marginLeft: '40px'}}>
            <div>{cardRate.p}%</div>
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

function getRate(gacha: GachaInfo, rarity: number) {
    let rate = gacha.rates[rarity - 1];
    let cardRate = gacha.cardRates[rarity - 1];
    if (rate === 0 || cardRate.length === 0) return (<div/>);

    return (
        <div style={{marginTop: '60px', paddingBottom: '30px'}}>
            <div style={{display: "flex"}}>
                {getRarity(rarity)}
                <div style={{fontSize: '50px', marginLeft: '20px'}}>{rate}%</div>
            </div>
            <div>
                {cardRate.map(it => getCardRate(it, cardRate.length == 1 ? 21 : 10))}
                {/*{cardRate.map(it => getCardRate(it, it.cards.length))}*/}
            </div>
        </div>
    );
}

export default function Gacha({gacha}: { gacha: GachaInfo }) {
    return (
        <div className={style.body}>
            {/*Event info*/}
            <div className={style.event}>
                <div className={style.event_logo}>
                    <img src={`/assets/gacha/${gacha.assetbundleName}.webp`} alt={"logo"}/>
                </div>
                <div className={style.event_info}>
                    <div className={style.event_info_name}>
                        {gacha.name}
                    </div>
                    <div>
                        {`${timeStampToString(gacha.startAt)} ~ ${timeStampToString(gacha.endAt)}（北京时间）`}
                    </div>
                    <div style={{display: "flex"}}>
                        {Array.from(Array(4).keys()).map(it => {
                            if (gacha.rates[3 - it] === 0) return (<div/>);
                            return (
                                <div style={{display: "flex"}}>
                                    {getRarity(4 - it)}
                                    <div style={{
                                        fontSize: '50px',
                                        marginLeft: '20px',
                                        marginRight: '20px'
                                    }}>{gacha.rates[3 - it]}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/*Array.from(Array(4).keys()).map(it=>getRate(gacha,4-it))*/}
            {getRate(gacha, 4)}

            <div className={style.footer}>
                仅供参考，请以游戏内信息为准<br/>
                bilibili @xfl03
            </div>
        </div>
    );
}
export const getStaticProps: GetStaticProps = async () => {
    const gacha = getGacha();
    return {
        props: {
            gacha
        }
    }
}
