import React from "react";
import {GetStaticProps} from "next";
import style from "../styles/event.module.css"
import dateFormat from "dateFormat";
import {characters, units} from "../lib/character";
import {chineseSkills} from "../lib/skill";
import {CardRate, GachaInfo, getGacha, SelectCard} from "../lib/gacha";
import {getCardImage} from "../lib/imageUtils";
import {Card} from "../lib/event";

const selectTypes = {
    "normal": "常驻卡，可选0.4%",
    "limited": "FES限定卡，可选0.4%",
    "fixed": "固定0.4%",
}

function timeStampToString(timestamp: number): string {
    let date = new Date(timestamp);
    return dateFormat(date, "yyyy/mm/dd HH:MM");
}

function getRarity(cardRarityType: string) {
    if (cardRarityType === "rarity_birthday") {
        return (<img src={`/assets/rarity_birthday.png`}
                     style={{display: "inline"}}/>);
    }
    let normal = cardRarityType === "rarity_2";
    return (
        <div>
            {Array.from(Array(parseInt(cardRarityType.split("_")[1])).keys()).map(i => (
                <img key={i} src={`/assets/rarity_star_${normal ? "normal" : "afterTraining"}.png`}
                     style={{display: "inline"}}/>
            ))}
        </div>
    );
}

function getCards(cards: Card[], items: number) {
    cards = cards.reverse();
    return (
        <div style={{display: "flex", flexWrap: "wrap"}}>
            {cards.map((it, i) => {
                if (i < items) return getCardImage(it, false, true)
                else if (i == items) return (<div>等{cards.length}张</div>)
                else return (<div/>)
            })}
        </div>
    );
}

function getCardRate(cardRate: CardRate, items: number) {
    let cards = cardRate.cards;
    return (
        <div style={{marginTop: '20px', marginLeft: '40px'}}>
            <div>{cardRate.p}%</div>
            {getCards(cards, items)}
        </div>
    );
}

function getCardSelect(select: SelectCard, items: number) {
    let cards = select.cards;
    return (
        <div style={{marginTop: '20px', marginLeft: '40px'}}>
            <div>{selectTypes[select.type]}</div>
            {getCards(cards, items)}
        </div>
    );
}

function getRate(gacha: GachaInfo, rarity: number) {
    let rate = gacha.rates[rarity - 1];
    let cardRate = gacha.cardRates[rarity - 1];
    if (rate === 0 || cardRate.length === 0) return (<div/>);

    //特判2周年自选UP
    let selectFlag = (rarity === 4 && gacha.selectCards !== undefined && gacha.selectCards.length !== 0);
    return (
        <div style={{marginTop: '60px', paddingBottom: '30px'}}>
            <div style={{display: "flex"}}>
                {getRarity(cardRate[0].cards[0].cardRarityType)}
                <div style={{fontSize: '50px', marginLeft: '20px'}}>{rate}%</div>
            </div>
            <div>
                {selectFlag && gacha.selectCards.map(it => getCardSelect(it, 9))}
                {cardRate.map(it => getCardRate(it, cardRate.length == 1 ? 29 : 9))}
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
                                    {getRarity(gacha.cardRates[3 - it][0].cards[0].cardRarityType)}
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
            {/*{getRate(gacha, 3)}*/}
            {/*{getRate(gacha, 2)}*/}

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
