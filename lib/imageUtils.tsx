import {Card} from "./event";
import style from "../styles/event.module.css";
import React from "react";

export function getCharacterIconFile(id: number): string {
    if (id <= 26) {
        return `chr_ts_90_${id}.png`
    } else if (id <= 31) {
        //MIKU
        return `chr_ts_90_21_${id - 25}.png`
    } else if (id <= 36) {
        //RING
        return `chr_ts_90_22_2.png`
    } else if (id <= 41) {
        //REN
        return `chr_ts_90_23_2.png`
    } else if (id <= 46) {
        //LUKA
        return `chr_ts_90_24_2.png`
    } else if (id <= 51) {
        //MEIKO
        return `chr_ts_90_25_2.png`
    } else if (id <= 56) {
        //KAITO
        return `chr_ts_90_26_2.png`
    }
    return "404.png"
}

export function getCardImage(it: Card, normal: boolean, fallback: boolean = false) {
    if (!normal && (it.rarity < 3 || it.cardRarityType === "rarity_birthday")) {
        if (fallback) {
            normal = true;
        } else {
            return (<div className={style.card_detail_image}/>);
        }
    }
    let rarity = it.cardRarityType === "rarity_birthday" ? "bd" : it.rarity.toString();
    let stars = it.cardRarityType === "rarity_birthday" ? (
            <image key="114514" href={`/assets/rarity_birthday.png`}
                   x="8"
                   y="125" width="22"
                   height="22"/>
        ) :
        Array.from(Array(it.rarity).keys()).map(i => (
            <image key={i} href={`/assets/rarity_star_${normal ? "normal" : "afterTraining"}.png`}
                   x={8 + i * 22}
                   y="125" width="22"
                   height="22"/>
        ));
    return (
        <div className={style.card_detail_image}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156">
                <image href={`/assets/card/${it.assetbundleName}_${normal ? "normal" : "after_training"}.webp`} x="8"
                       y="8" height="140" width="140"/>
                <image href={`/assets/frame/cardFrame_S_${rarity}.png`} x="0" y="0" height="156"
                       width="156"/>
                <image href={`/assets/icon_attribute_${it.attr}.png`} x="0" y="0" height="35"
                       width="35"/>
                {stars}
            </svg>
        </div>
    );
}